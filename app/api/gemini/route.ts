import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { prompt, generateImage } = await req.json();

    if (generateImage) {
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

      return NextResponse.json({ text, imageBase64, mimeType });
    } else {
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const text = response.text || "";
      return NextResponse.json({ text });
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gemini request failed";
    console.error("Gemini API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
