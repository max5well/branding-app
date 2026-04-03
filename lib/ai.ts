"use client";

import {
  BrandProject,
  MoodBoard,
  BrandGuideline,
  Persona,
  Competitor,
} from "./types";
import {
  buildPersonalityPrompt,
  buildMoodBoardPrompt,
  buildRefinementPrompt,
  buildGuidelinePrompt,
} from "./prompts";
import {
  buildColorPrompt,
  buildFontPrompt,
  buildLogoPrompt,
  buildIconPrompt,
  buildMoodImagePrompt,
  buildStockImagePrompt,
} from "./moodboard-prompts";

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "AI request failed");
  }

  const data = await res.json();
  return data.content;
}

function parseJSON<T>(text: string): T {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = match ? match[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

export async function generatePersonalitySummary(
  project: BrandProject,
): Promise<string> {
  const prompt = buildPersonalityPrompt(project);
  return callClaude(prompt);
}

export async function generateMoodBoards(
  project: BrandProject,
): Promise<MoodBoard[]> {
  const prompt = buildMoodBoardPrompt(project);
  const response = await callClaude(prompt);
  return parseJSON<MoodBoard[]>(response);
}

export async function generateRefinedDirection(
  project: BrandProject,
): Promise<MoodBoard> {
  const prompt = buildRefinementPrompt(project);
  const response = await callClaude(prompt);
  return parseJSON<MoodBoard>(response);
}

export async function generateBrandGuideline(
  project: BrandProject,
): Promise<BrandGuideline> {
  const prompt = buildGuidelinePrompt(project);
  const response = await callClaude(prompt);
  return parseJSON<BrandGuideline>(response);
}

export async function generateFieldContent(
  field: string,
  context: string,
): Promise<string> {
  const prompt = `You are a world-class brand strategist. Based on the following context, generate content for the "${field}" field. Be concise, compelling, and specific to this brand.

Context:
${context}

Write ONLY the content for "${field}" — no quotes, no labels, no explanation. Just the text itself.`;
  return callClaude(prompt);
}

export async function generatePersona(
  project: BrandProject,
): Promise<Omit<Persona, "id">> {
  const context = `Brand: ${project.strategy.brand.name}
Description: ${project.strategy.brand.description}
Mission: ${project.strategy.brand.mission}
Business Models: ${(project.strategy.brand.businessModels || []).join(", ")}
Sales Channels: ${(project.strategy.brand.salesChannels || []).join(", ")}
Existing personas: ${
    project.strategy.audience.personas
      .filter((p) => p.name)
      .map((p) => p.name)
      .join(", ") || "None"
  }`;

  const prompt = `You are a world-class brand strategist. Based on the following brand context, generate a realistic customer persona that would be a great fit for this brand. Make it different from any existing personas.

${context}

Return a JSON object with:
- name: a memorable persona label (e.g. "Tech-savvy Sarah")
- ageRange: one of "18-24", "25-34", "35-44", "45-54", "55-64", "65+"
- occupation: their job title or role
- painPoints: array of 2-3 specific pain points
- goals: array of 2-3 specific goals
- channels: array of 3-5 channels from: Instagram, LinkedIn, TikTok, Twitter/X, Reddit, YouTube, Podcasts, Blogs, Events

Respond with ONLY the JSON object wrapped in \`\`\`json code fences.`;

  const response = await callClaude(prompt);
  return parseJSON<Omit<Persona, "id">>(response);
}

// ─── Moodboard Generation (2-phase, 3 options) ───

export interface MoodBoardGenColors {
  colors: { hex: string; name: string; role: string }[];
  reasoning: string[];
}

export interface MoodBoardGenFonts {
  headingFont: string;
  bodyFont: string;
  reasoning: string[];
}

export interface MoodBoardGenImage {
  text: string;
  imageBase64: string;
  mimeType: string;
}

export interface MoodBoardPhase1Option {
  colors: MoodBoardGenColors;
  fonts: MoodBoardGenFonts;
}

export interface MoodBoardPhase2Result {
  logo: MoodBoardGenImage | { error: string };
  icons: MoodBoardGenImage | { error: string };
  moodImage1: MoodBoardGenImage | { error: string };
  moodImage2: MoodBoardGenImage | { error: string };
  stockImage: MoodBoardGenImage | { error: string };
}

// Phase 1: Generate colors + fonts for 3 options in parallel
export async function generateMoodBoardPhase1(
  project: BrandProject,
): Promise<MoodBoardPhase1Option[]> {
  const res = await fetch("/api/moodboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "phase1",
      prompts: [0, 1, 2].map((i) => ({
        colors: buildColorPrompt(project, i),
        fonts: buildFontPrompt(project, i),
      })),
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Phase 1 generation failed");
  }

  const data = await res.json();
  return data.results;
}

// Phase 2: Generate images for one selected option
export async function generateMoodBoardPhase2(
  project: BrandProject,
  colors: { hex: string; name: string; role: string }[],
): Promise<MoodBoardPhase2Result> {
  const res = await fetch("/api/moodboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "phase2",
      colors: colors.map((c) => ({ hex: c.hex })),
      prompts: {
        logo: buildLogoPrompt(project, colors),
        icons: buildIconPrompt(project, colors),
        moodImage1: buildMoodImagePrompt(project, colors, "atmosphere"),
        moodImage2: buildMoodImagePrompt(project, colors, "product"),
        stockImage: buildStockImagePrompt(project, colors),
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Phase 2 generation failed");
  }

  return res.json();
}

export async function analyzeCompetitor(
  website: string,
): Promise<Partial<Competitor>> {
  const prompt = `You are a brand analyst. Visit the website ${website} and extract the following information:

## Brand Identity

**Colors**
- List all primary and secondary brand colors with hex codes if identifiable (inspect CSS, buttons, headers, logos)

**Typography**
- Primary font (headings): Return ONLY the font family name (e.g. "Inter", "Playfair Display"). Do NOT include fallbacks like "Arial, Helvetica, sans-serif".
- Secondary font (body text): Same rule — single font family name only.

**Logo**
- Describe the logo briefly (shape, colors, style)

---

## Brand Messaging

**Tagline** (if present)

**Mission Statement** (if present)

**Vision Statement** (if present)

**Brand Voice** (1–2 sentences describing tone: formal/casual, bold/subtle, etc.)

---

## Social Media Presence

Find and list ONLY the official social media links that are actually present on the website (usually in the footer or header). Check for:
- Instagram
- LinkedIn
- X (Twitter)
- TikTok
- YouTube
- Facebook

IMPORTANT: Only include a social media channel if you can find an actual link to it on the website. Do NOT guess or fabricate URLs. If a channel has no link on the site, omit it entirely from the socialMedia object — do NOT include it with a null value.

---

## Competitive Analysis

- name: the company/brand name
- description: 1-2 sentence description of what they do
- strengths: their key brand/business strengths (2-3 sentences)
- weaknesses: their brand/business weaknesses or gaps (2-3 sentences)
- visualStyle: array of 3-5 visual style keywords that describe their brand aesthetic
- positioning: their market positioning in 1-2 sentences

---

Return ONLY a JSON object wrapped in \`\`\`json code fences with this structure:
\`\`\`json
{
  "name": "...",
  "description": "...",
  "strengths": "...",
  "weaknesses": "...",
  "visualStyle": ["...", "..."],
  "brand": {
    "colors": ["#hex1", "#hex2", "..."],
    "headingFont": "Actual Font Name",
    "bodyFont": "Actual Font Name",
    "logoDescription": "...",
    "tagline": "... or null",
    "mission": "... or null",
    "vision": "... or null",
    "brandVoice": "...",
    "positioning": "...",
    "imagery": "...",
    "fonts": ["heading font name", "body font name"],
    "socialMedia": {
      // ONLY include channels that were actually found on the website
      // e.g. "instagram": "https://instagram.com/brandname"
      // Omit any channel not found — do NOT set to null
    }
  }
}
\`\`\`

IMPORTANT:
- For fonts, return ONLY the single font family name (e.g. "Inter"), never CSS font stacks with fallbacks.
- For socialMedia, only include channels you actually found linked on the website. Omit all others.
- If something cannot be determined from the website, use null rather than guessing.`;

  const response = await callClaude(prompt);
  return parseJSON<Partial<Competitor>>(response);
}
