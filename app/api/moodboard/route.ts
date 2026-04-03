import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const RECRAFT_API_KEY = process.env.RECRAFT_API_KEY!;
const RECRAFT_BASE = "https://external.api.recraft.ai/v1";

function parseJSON<T>(text: string): T {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = match ? match[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

async function callClaude(prompt: string): Promise<string> {
  const message = await claude.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });
  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Recraft: Logo & Icon generation ───

async function callRecraft(
  prompt: string,
  style: "digital_illustration" | "vector_illustration",
  colors: { hex: string }[],
  retries = 2,
): Promise<{ imageBase64: string; mimeType: string }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const body: Record<string, unknown> = {
        prompt,
        model: "recraftv3",
        style,
        size: "1024x1024",
        response_format: "b64_json",
        n: 1,
      };

      if (colors.length > 0) {
        body.controls = {
          colors: colors.slice(0, 5).map((c) => ({ rgb: hexToRgb(c.hex) })),
        };
      }

      const res = await fetch(`${RECRAFT_BASE}/images/generations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RECRAFT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429 && attempt < retries) {
          const delay = Math.pow(2, attempt) * 5000;
          console.log(
            `Recraft rate limited, retrying in ${delay / 1000}s...`,
          );
          await sleep(delay);
          continue;
        }
        throw new Error(`Recraft API ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const imageData = data.data?.[0];

      return {
        imageBase64: imageData.b64_json,
        mimeType: "image/png",
      };
    } catch (error) {
      if (attempt < retries) {
        await sleep(Math.pow(2, attempt) * 3000);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Recraft max retries exceeded");
}

// ─── Gemini: Mood & Stock images ───

async function callGeminiImage(
  prompt: string,
  retries = 3,
): Promise<{
  text: string;
  imageBase64: string;
  mimeType: string;
}> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: prompt,
        config: {
          responseModalities: ["Text", "Image"],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];

      let text = "";
      let imageBase64 = "";
      let mimeType = "";

      for (const part of parts) {
        if (part.text) text += part.text;
        if (part.inlineData) {
          imageBase64 = part.inlineData.data || "";
          mimeType = part.inlineData.mimeType || "image/png";
        }
      }

      return { text, imageBase64, mimeType };
    } catch (error: unknown) {
      const isRateLimit =
        error instanceof Error &&
        (error.message.includes("429") ||
          error.message.includes("RESOURCE_EXHAUSTED"));
      if (isRateLimit && attempt < retries) {
        const delay = Math.pow(2, attempt) * 15000;
        console.log(
          `Gemini rate limited on attempt ${attempt + 1}, retrying in ${delay / 1000}s...`,
        );
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Gemini max retries exceeded");
}

export async function POST(req: NextRequest) {
  try {
    const { action, prompt, prompts, colors } = await req.json();

    // Single Claude prompt
    if (action === "claude") {
      const text = await callClaude(prompt);
      return NextResponse.json({ result: text });
    }

    // Single Gemini image prompt
    if (action === "gemini-image") {
      const result = await callGeminiImage(prompt);
      return NextResponse.json({ result });
    }

    // Phase 1: Colors + Fonts (parallel Claude calls) — runs 3 times for 3 options
    if (action === "phase1") {
      const results = await Promise.all(
        prompts.map(async (p: { colors: string; fonts: string }) => {
          const [colorsRaw, fontsRaw] = await Promise.all([
            callClaude(p.colors),
            callClaude(p.fonts),
          ]);

          const parsedColors = parseJSON<{
            colors: { hex: string; name: string; role: string }[];
            reasoning: string[];
          }>(colorsRaw);

          const fonts = parseJSON<{
            headingFont: string;
            bodyFont: string;
            reasoning: string[];
          }>(fontsRaw);

          return { colors: parsedColors, fonts };
        }),
      );

      return NextResponse.json({ results });
    }

    // Phase 2: Logo + Icons (Recraft) + Mood Images + Stock (Gemini)
    if (action === "phase2") {
      const brandColors: { hex: string }[] = colors || [];
      const results: Record<string, unknown> = {};

      // Logo via Recraft
      try {
        const logoResult = await callRecraft(
          prompts.logo,
          "digital_illustration",
          brandColors,
        );
        results.logo = {
          text: "",
          imageBase64: logoResult.imageBase64,
          mimeType: logoResult.mimeType,
        };
      } catch (error) {
        console.error("logo failed:", error);
        results.logo = { error: String(error) };
      }

      // Icons via Recraft
      try {
        const iconsResult = await callRecraft(
          prompts.icons,
          "vector_illustration",
          brandColors,
        );
        results.icons = {
          text: "",
          imageBase64: iconsResult.imageBase64,
          mimeType: iconsResult.mimeType,
        };
      } catch (error) {
        console.error("icons failed:", error);
        results.icons = { error: String(error) };
      }

      // Mood images + Stock via Gemini (sequential with delays)
      const geminiTasks = ["moodImage1", "moodImage2", "stockImage"] as const;
      for (let i = 0; i < geminiTasks.length; i++) {
        const label = geminiTasks[i];
        try {
          results[label] = await callGeminiImage(prompts[label]);
        } catch (error) {
          console.error(`${label} failed:`, error);
          results[label] = { error: String(error) };
        }
        if (i < geminiTasks.length - 1) {
          await sleep(2000);
        }
      }

      return NextResponse.json(results);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Moodboard generation failed";
    console.error("Moodboard API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
