import { BrandProject } from "./types";
import { getArchetype } from "./archetypes";

const WCAG_CONTRAST_RULES = `
Text readability rules (MANDATORY for any visual with text):
- Calculate relative luminance of every background: L = 0.2126×R + 0.7152×G + 0.0722×B (values 0–1)
- If L > 0.5 → use dark text (#000000 or darkest brand color)
- If L ≤ 0.5 → use light text (#FFFFFF or lightest brand color)
- Never use gray, semi-transparent, or mid-tone text on any colored background
- Every text-background pair must meet WCAG 2.1 AA: minimum 4.5:1 for body text, 3:1 for headings
- When in doubt, maximize contrast — readability always beats aesthetics`;

function brandSummary(project: BrandProject) {
  const b = project.strategy.brand;
  const primary = project.personality.primaryArchetype
    ? getArchetype(project.personality.primaryArchetype)
    : null;
  const secondary = project.personality.secondaryArchetype
    ? getArchetype(project.personality.secondaryArchetype)
    : null;
  const brief = project.creativeBrief;

  const personas = project.strategy.audience.personas
    .filter((p) => p.name)
    .map(
      (p) =>
        `${p.name} (${p.ageRange}, ${p.occupation}): Pain points: ${p.painPoints.join(", ")}. Goals: ${p.goals.join(", ")}`,
    )
    .join("\n  ");

  const competitors = project.strategy.competitors
    .filter((c) => c.name || c.website)
    .map(
      (c) =>
        `${c.name || c.website}: ${c.description || ""}. Visual style: ${c.visualStyle.join(", ")}${c.brand ? `. Colors: ${c.brand.colors.join(", ")}. Fonts: ${c.brand.fonts.join(", ")}. Positioning: ${c.brand.positioning}` : ""}`,
    )
    .join("\n  ");

  return {
    brand: b,
    primary,
    secondary,
    brief,
    personas,
    competitors,
    personalitySummary: project.personality.personalitySummary || "",
  };
}

// ─── Prompt: Colors (Claude Opus) — runs FIRST ───

export function buildColorPrompt(
  project: BrandProject,
  optionIndex: number,
): string {
  const s = brandSummary(project);
  const directionHints = [
    "Go for a bold, high-contrast palette with a strong primary color. Think confident and energetic.",
    "Go for an earthy, warm, approachable palette. Think natural and trustworthy.",
    "Go for a cool, sophisticated, premium palette. Think refined and modern.",
  ];

  return `You are an elite brand designer selecting a 4-color palette for "${s.brand.name}".
This is Option ${optionIndex + 1} of 3 distinct directions. ${directionHints[optionIndex]}

Brand context:
- Description: ${s.brand.description}
- Mission: ${s.brand.mission}
- Vision: ${s.brand.vision}
- Business Model: ${(s.brand.businessModels || []).join(", ")}
- Target Audience:
  ${s.personas || "Not specified"}
- Competitors:
  ${s.competitors || "None specified"}
- Brand Archetypes: ${s.primary?.name} (primary) + ${s.secondary?.name} (secondary)
- Personality: ${s.personalitySummary}

Creative Brief:
- Visual traits: ${s.brief.traits.join(", ")}
- Voice tone: ${s.brief.tone.join(", ")}
- Brand experience: ${s.brief.experience.join(", ")}
- Famous for: ${s.brief.famousFor}
- NOT this: ${s.brief.notThis.join(", ")}

Rules:
- Exactly 4 colors. Roles: Primary (dominant brand color), Secondary (supporting/contrast), Accent (highlights/CTAs), Dark (text/backgrounds).
- Colors must have sufficient contrast for accessibility (WCAG AA).
- Differentiate from competitor palettes listed above.
- Return valid hex codes and a creative name for each.
${WCAG_CONTRAST_RULES}

Return JSON:
\`\`\`json
{
  "colors": [
    { "hex": "#...", "name": "...", "role": "primary" },
    { "hex": "#...", "name": "...", "role": "secondary" },
    { "hex": "#...", "name": "...", "role": "accent" },
    { "hex": "#...", "name": "...", "role": "dark" }
  ],
  "reasoning": [
    "...",
    "...",
    "..."
  ]
}
\`\`\`

"reasoning" must be exactly 3 bullets (max 15 words each) explaining why these colors suit the brand.
Respond with ONLY the JSON wrapped in \`\`\`json code fences.`;
}

// ─── Prompt: Fonts (Claude Opus) — runs FIRST ───

export function buildFontPrompt(
  project: BrandProject,
  optionIndex: number,
): string {
  const s = brandSummary(project);
  const directionHints = [
    "Pick expressive, characterful fonts. A display or serif heading with a clean sans body.",
    "Pick warm, humanist fonts. Rounded or organic shapes that feel approachable.",
    "Pick sharp, geometric fonts. Technical precision with elegant spacing.",
  ];

  return `You are a typography director selecting a font pairing for "${s.brand.name}".
This is Option ${optionIndex + 1} of 3 distinct directions. ${directionHints[optionIndex]}

Brand context:
- Description: ${s.brand.description}
- Mission: ${s.brand.mission}
- Brand Archetypes: ${s.primary?.name} (primary) + ${s.secondary?.name} (secondary)
- Personality: ${s.personalitySummary}

Creative Brief:
- Visual traits: ${s.brief.traits.join(", ")}
- Voice tone: ${s.brief.tone.join(", ")}
- Brand experience: ${s.brief.experience.join(", ")}
- NOT this: ${s.brief.notThis.join(", ")}
- Competitor fonts: ${s.competitors || "None"}

Rules:
- Select exactly 2 Google Fonts (must be freely available on Google Fonts).
- Heading font: expressive, embodies the brand archetype. Can be serif, sans-serif, or display.
- Body font: highly legible, pairs well with the heading font. Must be sans-serif or serif with good screen readability.
- Must differ from competitor fonts listed above.

Return JSON:
\`\`\`json
{
  "headingFont": "...",
  "bodyFont": "...",
  "reasoning": [
    "...",
    "...",
    "..."
  ]
}
\`\`\`

"reasoning" must be exactly 3 bullets (max 15 words each) explaining the pairing choice.
Respond with ONLY the JSON wrapped in \`\`\`json code fences.`;
}

// ─── Prompt: Logo (Recraft) ───

export function buildLogoPrompt(
  project: BrandProject,
  colors: { hex: string; name: string; role: string }[],
): string {
  const s = brandSummary(project);

  return `A distinctive, professional brand logo for "${s.brand.name}", a ${s.brand.description}. ${s.brief.traits.join(", ")} aesthetic. ${s.primary?.name || ""} archetype personality. Clean solid background, works at all sizes from favicon to billboard.`;
}

// ─── Prompt: Iconography (Recraft) ───

export function buildIconPrompt(
  project: BrandProject,
  colors: { hex: string; name: string; role: string }[],
): string {
  const s = brandSummary(project);
  const primaryColor = colors.find((c) => c.role === "primary") || colors[0];

  return `A cohesive icon representing the core concept of "${s.brand.name}", a ${s.brand.description}. ${s.brief.traits.join(", ")} style. Clean, recognizable, using ${primaryColor?.name || "brand"} color ${primaryColor?.hex || ""} on white background.`;
}

// ─── Prompt: Brand Mood Images (Gemini Nanobanana 2) × 2 ───

export function buildMoodImagePrompt(
  project: BrandProject,
  colors: { hex: string; name: string; role: string }[],
  variant: "atmosphere" | "product",
): string {
  const s = brandSummary(project);
  const focusMap = {
    atmosphere:
      "Atmosphere / lifestyle — show the world the brand creates. Wide establishing shot, environmental, aspirational.",
    product:
      "Product / detail — show the tangible experience the brand delivers. Close-up or mid-shot, textural, intimate.",
  };

  return `Generate a cinematic brand mood image for "${s.brand.name}".

Brand context:
- Description: ${s.brand.description}
- Mission: ${s.brand.mission}
- Brand Archetypes: ${s.primary?.name} + ${s.secondary?.name}
- Brand experience: ${s.brief.experience.join(", ")}
- Visual traits: ${s.brief.traits.join(", ")}
- Color palette: ${colors.map((c) => `${c.name} ${c.hex}`).join(", ")}

Image focus: ${focusMap[variant]}

Requirements:
- Photorealistic, editorial photography style
- Color grading must match the brand palette (use the colors as dominant tones)
- No text, no logos, no UI elements
- Landscape aspect ratio (16:9)
- Cinematic lighting, shallow depth of field
${WCAG_CONTRAST_RULES}

After generating the image, provide 3 bullet points (max 15 words each) explaining the creative direction of this image.`;
}

// ─── Prompt: Stock/Lifestyle Image (Gemini Nanobanana 2) ───

export function buildStockImagePrompt(
  project: BrandProject,
  colors: { hex: string; name: string; role: string }[],
): string {
  const s = brandSummary(project);

  return `Generate a high-quality editorial stock photograph for "${s.brand.name}" mood board.

Brand context:
- Description: ${s.brand.description}
- Mission: ${s.brand.mission}
- Industry: ${(s.brand.businessModels || []).join(", ")}
- Visual traits: ${s.brief.traits.join(", ")}
- Brand experience: ${s.brief.experience.join(", ")}
- Color palette: ${colors.map((c) => `${c.name} ${c.hex}`).join(", ")}

This image should:
1. Relate directly to the company's purpose and industry
2. Match the mood and color temperature of the brand palette
3. Feel editorial and authentic, not generic

Requirements:
- Photorealistic, natural lighting
- No text, no logos, no overlays
- Landscape aspect ratio (16:9)
- Should evoke the brand's values and target audience lifestyle
${WCAG_CONTRAST_RULES}

After generating the image, provide 3 bullet points (max 15 words each) explaining why this image fits the brand.`;
}
