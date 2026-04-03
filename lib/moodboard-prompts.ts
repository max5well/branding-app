import { BrandProject } from "./types";
import { getArchetype, ArchetypeData } from "./archetypes";

const WCAG_CONTRAST_RULES = `
Text readability rules (MANDATORY for any visual with text):
- Calculate relative luminance of every background: L = 0.2126×R + 0.7152×G + 0.0722×B (values 0–1)
- If L > 0.5 → use dark text (#000000 or darkest brand color)
- If L ≤ 0.5 → use light text (#FFFFFF or lightest brand color)
- Never use gray, semi-transparent, or mid-tone text on any colored background
- Every text-background pair must meet WCAG 2.1 AA: minimum 4.5:1 for body text, 3:1 for headings
- When in doubt, maximize contrast — readability always beats aesthetics`;

// ─── Rich context builder ───

interface BrandContext {
  brand: BrandProject["strategy"]["brand"];
  primary: ArchetypeData | null;
  secondary: ArchetypeData | null;
  brief: BrandProject["creativeBrief"];
  personas: string;
  personaChannels: string[];
  personaAgeRanges: string[];
  competitors: string;
  competitorColors: string[];
  competitorFonts: string[];
  competitorStyles: string[];
  personalitySummary: string;
  archetypeCombination: string;
}

function buildContext(project: BrandProject): BrandContext {
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
        `"${p.name}" (${p.ageRange}, ${p.occupation}): Struggles with ${p.painPoints.join(", ")}. Wants ${p.goals.join(", ")}. Found on ${p.channels.join(", ")}.`,
    )
    .join("\n  ");

  const personaChannels = [
    ...new Set(
      project.strategy.audience.personas.flatMap((p) => p.channels),
    ),
  ];

  const personaAgeRanges = [
    ...new Set(
      project.strategy.audience.personas
        .filter((p) => p.ageRange)
        .map((p) => p.ageRange),
    ),
  ];

  const competitors = project.strategy.competitors
    .filter((c) => c.name || c.website)
    .map((c) => {
      let line = `${c.name || c.website}: ${c.description || ""}`;
      if (c.visualStyle?.length) line += `. Visual: ${c.visualStyle.join(", ")}`;
      if (c.brand) {
        if (c.brand.colors?.length)
          line += `. Colors: ${c.brand.colors.join(", ")}`;
        if (c.brand.fonts?.length)
          line += `. Fonts: ${c.brand.fonts.join(", ")}`;
        if (c.brand.positioning) line += `. Positioning: ${c.brand.positioning}`;
        if (c.brand.brandVoice) line += `. Voice: ${c.brand.brandVoice}`;
      }
      if (c.strengths) line += `. Strengths: ${c.strengths}`;
      if (c.weaknesses) line += `. Weaknesses: ${c.weaknesses}`;
      return line;
    })
    .join("\n  ");

  const competitorColors = project.strategy.competitors
    .flatMap((c) => c.brand?.colors || [])
    .filter(Boolean);

  const competitorFonts = [
    ...new Set(
      project.strategy.competitors.flatMap((c) => c.brand?.fonts || []),
    ),
  ];

  const competitorStyles = [
    ...new Set(
      project.strategy.competitors.flatMap((c) => c.visualStyle || []),
    ),
  ];

  let archetypeCombination = "";
  if (primary && secondary) {
    archetypeCombination = `The brand leads with ${primary.name} (${primary.tagline}) — ${primary.keywords.join(", ")} — blended with ${secondary.name} (${secondary.tagline}) — ${secondary.keywords.join(", ")}.`;
  } else if (primary) {
    archetypeCombination = `The brand embodies ${primary.name} (${primary.tagline}) — ${primary.keywords.join(", ")}.`;
  }

  return {
    brand: b,
    primary,
    secondary,
    brief,
    personas,
    personaChannels,
    personaAgeRanges,
    competitors,
    competitorColors,
    competitorFonts,
    competitorStyles,
    personalitySummary: project.personality.personalitySummary || "",
    archetypeCombination,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// DESIGN ANALYSIS SYSTEM
//
// Instead of prescribing "serif + muted" or "geometric + vibrant," we break the
// brand data into separate DESIGN DIMENSIONS. Each dimension is analyzed on its
// own and produces design implications. The model reads these as independent
// inputs and synthesizes them through its assigned creative philosophy.
//
// The 3 options diverge via ABSTRACT PHILOSOPHIES — not static templates:
//   Option 1 "True to Core"      → Most direct expression of brand identity
//   Option 2 "Audience-First"    → Optimized for who sees it and where
//   Option 3 "Category Breaker"  → Owns the whitespace competitors leave open
//
// What "true to core" MEANS depends entirely on the brand data. A playful brand
// gets playful Option 1. A corporate brand gets corporate Option 1.
// ──────────────────────────────────────────────────────────────────────────────

// Creative philosophies — abstract enough to not predetermine outputs,
// concrete enough to force divergence.
const CREATIVE_PHILOSOPHIES = [
  {
    id: "true-to-core",
    label: "True to Core",
    briefing: `Your concept is the most DIRECT expression of the brand's identity.
Lean heavily into Dimension 1 (archetype) and Dimension 4 (creative brief).
The audience and competitive context inform your choices, but identity leads.
Ask yourself: "If I could only show ONE palette/pairing to explain what this brand IS, what would it be?"
This is the concept the founder would immediately recognize as 'us.'`,
  },
  {
    id: "audience-first",
    label: "Audience-First",
    briefing: `Your concept is optimized for WHERE and BY WHOM the brand is experienced.
Lean heavily into Dimension 2 (audience) and Dimension 3 (competitive context).
The brand identity is still present, but filtered through audience expectations.
Ask yourself: "What would stop THIS audience on THESE channels — while still feeling like this brand?"
This is the concept that performs best in the real world.`,
  },
  {
    id: "category-breaker",
    label: "Category Breaker",
    briefing: `Your concept deliberately ZAGS where the category zigs.
Lean heavily into Dimension 3 (competitive landscape) and Dimension 5 (anti-references).
Combine the brand's personality dimensions (1+2) in the most unexpected way that still feels authentic.
Ask yourself: "What would make this brand IMPOSSIBLE to confuse with any competitor?"
This is the concept that redefines the visual category.`,
  },
];

// ── Build per-dimension analysis blocks ──

function buildDimension1(ctx: BrandContext): string {
  // ARCHETYPE & PERSONALITY — what the brand IS
  const parts: string[] = [];

  if (ctx.primary) {
    parts.push(`Primary archetype: ${ctx.primary.name} — "${ctx.primary.tagline}"`);
    parts.push(`Core qualities: ${ctx.primary.keywords.join(", ")}`);
    parts.push(`Reference brands: ${ctx.primary.examples.join(", ")}`);
  }
  if (ctx.secondary) {
    parts.push(`Secondary archetype: ${ctx.secondary.name} — "${ctx.secondary.tagline}"`);
    parts.push(`Blended qualities: ${ctx.secondary.keywords.join(", ")}`);
  }
  if (ctx.personalitySummary) {
    parts.push(`Personality narrative: ${ctx.personalitySummary}`);
  }
  if (parts.length === 0) {
    parts.push(`Brand description: ${ctx.brand.description}`);
    parts.push(`Mission: ${ctx.brand.mission}`);
  }

  return `DIMENSION 1 — ARCHETYPE & PERSONALITY (what the brand IS)
${parts.join("\n")}
→ Design implication: What visual language naturally expresses these qualities?`;
}

function buildDimension2(ctx: BrandContext): string {
  // AUDIENCE & CHANNELS — who sees it and where
  const parts: string[] = [];

  if (ctx.personaAgeRanges.length > 0) {
    parts.push(`Age ranges: ${ctx.personaAgeRanges.join(", ")}`);
  }
  if (ctx.personaChannels.length > 0) {
    parts.push(`Primary channels: ${ctx.personaChannels.join(", ")}`);
  }
  if (ctx.personas) {
    parts.push(`Personas:\n  ${ctx.personas}`);
  }
  if (ctx.brand.salesChannels?.length) {
    parts.push(`Sales channels: ${ctx.brand.salesChannels.join(", ")}`);
  }
  if (parts.length === 0) {
    parts.push(`General audience — no specific persona data`);
  }

  return `DIMENSION 2 — AUDIENCE & CHANNELS (who sees it and where)
${parts.join("\n")}
→ Design implication: What resonates with this audience on these platforms?`;
}

function buildDimension3(ctx: BrandContext): string {
  // COMPETITIVE LANDSCAPE — what's already taken
  const parts: string[] = [];

  if (ctx.competitorColors.length > 0) {
    parts.push(`Competitor colors in use: ${ctx.competitorColors.join(", ")}`);
  }
  if (ctx.competitorFonts.length > 0) {
    parts.push(`Competitor fonts in use: ${ctx.competitorFonts.join(", ")}`);
  }
  if (ctx.competitorStyles.length > 0) {
    parts.push(`Competitor visual styles: ${ctx.competitorStyles.join(", ")}`);
  }
  if (ctx.competitors) {
    parts.push(`Competitor details:\n  ${ctx.competitors}`);
  }
  if (parts.length === 0) {
    parts.push(`No competitor visual data available — opportunity to define the category`);
  }

  return `DIMENSION 3 — COMPETITIVE LANDSCAPE (what's already taken)
${parts.join("\n")}
→ Design implication: Where is the visual whitespace? What's ownable?`;
}

function buildDimension4(ctx: BrandContext): string {
  // CREATIVE BRIEF — the desired expression
  return `DIMENSION 4 — CREATIVE BRIEF (the desired expression)
Visual traits: ${ctx.brief.traits.join(", ")}
Tone: ${ctx.brief.tone.join(", ")}
Experience: ${ctx.brief.experience.join(", ")}
Famous for: "${ctx.brief.famousFor}"
→ Design implication: What visual choices create this specific experience and tone?`;
}

function buildDimension5(ctx: BrandContext): string {
  // ANTI-REFERENCES — what the brand must NOT be
  return `DIMENSION 5 — ANTI-REFERENCES (what the brand must NOT be)
NOT this: ${ctx.brief.notThis.join(", ")}
${ctx.competitorColors.length > 0 ? `Competitor colors to avoid: ${ctx.competitorColors.join(", ")}` : ""}
${ctx.competitorFonts.length > 0 ? `Competitor fonts to avoid: ${ctx.competitorFonts.join(", ")}` : ""}
→ Design implication: What directions are off-limits? What defines the boundaries?`;
}

// ─── Prompt: Colors (Claude Opus) ───

export function buildColorPrompt(
  project: BrandProject,
  optionIndex: number,
): string {
  const ctx = buildContext(project);
  const philosophy = CREATIVE_PHILOSOPHIES[optionIndex] || CREATIVE_PHILOSOPHIES[0];

  const otherLabels = CREATIVE_PHILOSOPHIES
    .filter((_, i) => i !== optionIndex)
    .map((p) => `"${p.label}"`)
    .join(" and ");

  return `You are an elite brand designer. Your task has two phases.

═══ PHASE 1: ANALYZE each dimension independently ═══

Read each dimension. For each one, determine what it implies for COLOR choices.
Do this analysis internally before making any decisions.

${buildDimension1(ctx)}

${buildDimension2(ctx)}

${buildDimension3(ctx)}

${buildDimension4(ctx)}

${buildDimension5(ctx)}

═══ PHASE 2: CREATE a 4-color palette through the lens of "${philosophy.label}" ═══

This is Option ${optionIndex + 1} of 3. Each option interprets the SAME brand through a different creative philosophy.

YOUR PHILOSOPHY:
${philosophy.briefing}

The other two options are ${otherLabels}. Your palette must look and feel DISTINCTLY DIFFERENT from what those philosophies would produce. If you can imagine the other options arriving at a similar palette, you haven't pushed far enough.

═══ BRAND CONTEXT ═══
"${ctx.brand.name}" — ${ctx.brand.description}
Mission: "${ctx.brand.mission}"
${ctx.archetypeCombination || ""}

═══ REQUIREMENTS ═══
- Exactly 4 colors: Primary (dominant brand color), Secondary (supporting/contrast), Accent (highlights/CTAs), Dark (text/backgrounds)
- Each color must trace back to a SPECIFIC dimension + your philosophy — no arbitrary choices
- Colors must have sufficient contrast for accessibility (WCAG AA)
- Give each color a creative name tied to THIS brand (not generic names like "Ocean Blue")
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

"reasoning" must be exactly 3 bullets (max 15 words each) connecting color choices to specific dimensions + the "${philosophy.label}" philosophy.
Respond with ONLY the JSON wrapped in \`\`\`json code fences.`;
}

// ─── Prompt: Fonts (Claude Opus) ───

export function buildFontPrompt(
  project: BrandProject,
  optionIndex: number,
): string {
  const ctx = buildContext(project);
  const philosophy = CREATIVE_PHILOSOPHIES[optionIndex] || CREATIVE_PHILOSOPHIES[0];

  const otherLabels = CREATIVE_PHILOSOPHIES
    .filter((_, i) => i !== optionIndex)
    .map((p) => `"${p.label}"`)
    .join(" and ");

  return `You are a typography director. Your task has two phases.

═══ PHASE 1: ANALYZE each dimension independently ═══

Read each dimension. For each one, determine what it implies for TYPOGRAPHY choices.
Do this analysis internally before making any decisions.

${buildDimension1(ctx)}

${buildDimension2(ctx)}

${buildDimension3(ctx)}

${buildDimension4(ctx)}

${buildDimension5(ctx)}

═══ PHASE 2: SELECT a font pairing through the lens of "${philosophy.label}" ═══

This is Option ${optionIndex + 1} of 3. Each option interprets the SAME brand through a different creative philosophy.

YOUR PHILOSOPHY:
${philosophy.briefing}

The other two options are ${otherLabels}. Your font pairing must feel CATEGORICALLY DIFFERENT from what those philosophies would produce.

═══ BRAND CONTEXT ═══
"${ctx.brand.name}" — ${ctx.brand.description}
${ctx.archetypeCombination || ""}

═══ REQUIREMENTS ═══
- Exactly 2 Google Fonts (freely available on Google Fonts)
- Heading font: must express this brand as seen through the "${philosophy.label}" philosophy
- Body font: optimized for readability on ${ctx.personaChannels.includes("Instagram") || ctx.personaChannels.includes("TikTok") ? "mobile screens and social media" : ctx.personaChannels.includes("Blogs") ? "long-form reading on screens" : "screen and print"}
- The pairing must feel like it belongs to THIS brand through THIS philosophy, not a template
- Must NOT use the same fonts as competitors

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

"reasoning" must be exactly 3 bullets (max 15 words each) connecting font choices to specific dimensions + the "${philosophy.label}" philosophy.
Respond with ONLY the JSON wrapped in \`\`\`json code fences.`;
}

// ─── Prompt: Logo (Recraft) ───

export function buildLogoPrompt(
  project: BrandProject,
  colors: { hex: string; name: string; role: string }[],
): string {
  const ctx = buildContext(project);
  const primaryColor = colors.find((c) => c.role === "primary") || colors[0];
  const accentColor = colors.find((c) => c.role === "accent") || colors[1];

  const archetypeStyle = ctx.primary
    ? `Embodies ${ctx.primary.name} archetype — think ${ctx.primary.keywords.slice(0, 2).map((k) => k.toLowerCase()).join(" and ")}.`
    : "";

  const industryContext = ctx.brand.businessModels?.length
    ? `Industry: ${ctx.brand.businessModels.join(", ")}.`
    : "";

  return `A distinctive, professional brand logo for "${ctx.brand.name}" — ${ctx.brand.description}. ${archetypeStyle} ${industryContext} Visual traits: ${ctx.brief.traits.join(", ")}. The brand is famous for "${ctx.brief.famousFor}". The logo should NOT look like: ${ctx.brief.notThis.slice(0, 2).join(", ") || "generic or templated"}. Dominant color: ${primaryColor?.name || "brand primary"} (${primaryColor?.hex || ""}), accent: ${accentColor?.name || "brand accent"} (${accentColor?.hex || ""}). Clean background, scalable from favicon to billboard. The logo must feel ${ctx.brief.tone.slice(0, 2).join(" and ") || "unique and memorable"}.`;
}

// ─── Prompt: Iconography (Recraft) ───

export function buildIconPrompt(
  project: BrandProject,
  colors: { hex: string; name: string; role: string }[],
): string {
  const ctx = buildContext(project);
  const primaryColor = colors.find((c) => c.role === "primary") || colors[0];

  const archetypeIcon = ctx.primary
    ? `The icon should symbolize ${ctx.primary.keywords[0].toLowerCase()} — the core of ${ctx.primary.name}.`
    : "";

  return `A cohesive brand icon for "${ctx.brand.name}" — ${ctx.brand.description}. ${archetypeIcon} Visual style: ${ctx.brief.traits.join(", ")}. The icon represents the brand's mission: "${ctx.brand.mission}". Clean, recognizable, using ${primaryColor?.name || "brand"} color (${primaryColor?.hex || ""}) on white background. NOT: ${ctx.brief.notThis.slice(0, 2).join(", ") || "generic"}. Must work at 16px and 512px.`;
}

// ─── Prompt: Brand Mood Images (Gemini) × 2 ───

export function buildMoodImagePrompt(
  project: BrandProject,
  colors: { hex: string; name: string; role: string }[],
  variant: "atmosphere" | "product",
): string {
  const ctx = buildContext(project);

  const personaContext = project.strategy.audience.personas
    .filter((p) => p.name)
    .map((p) => `${p.name} (${p.ageRange}, ${p.occupation})`)
    .join(", ");

  const variantInstructions =
    variant === "atmosphere"
      ? `ATMOSPHERE SHOT: Show the WORLD this brand creates. Imagine a ${ctx.brief.experience.join(", ")} environment where ${personaContext || "the target audience"} would feel at home. Wide establishing shot, environmental, aspirational. The setting should reflect the brand's mission: "${ctx.brand.mission}".`
      : `PRODUCT/EXPERIENCE SHOT: Show what the brand DELIVERS. A close-up or mid-shot of the tangible experience — ${ctx.brand.description}. The shot should make ${personaContext || "the viewer"} think "I want this." Textural, intimate, detailed.`;

  return `Generate a cinematic brand mood image for "${ctx.brand.name}".

═══ BRAND ═══
${ctx.brand.name}: ${ctx.brand.description}
Mission: ${ctx.brand.mission}
Vision: ${ctx.brand.vision}
${ctx.brand.businessModels?.length ? `Industry: ${ctx.brand.businessModels.join(", ")}` : ""}

═══ PERSONALITY ═══
${ctx.archetypeCombination || `Visual traits: ${ctx.brief.traits.join(", ")}`}
Brand experience: ${ctx.brief.experience.join(", ")}
Tone: ${ctx.brief.tone.join(", ")}
Famous for: "${ctx.brief.famousFor}"

═══ TARGET AUDIENCE ═══
${personaContext || "General audience"}

═══ IMAGE DIRECTION ═══
${variantInstructions}

═══ COLOR PALETTE ═══
${colors.map((c) => `${c.name} ${c.hex} (${c.role})`).join(", ")}
Use these as the dominant color tones in the image.

═══ REQUIREMENTS ═══
- Photorealistic, editorial photography style
- Color grading MUST reflect the palette above
- No text, no logos, no UI elements
- Landscape aspect ratio (16:9)
- Cinematic lighting, shallow depth of field
- NOT: ${ctx.brief.notThis.join(", ") || "generic stock photography"}
${WCAG_CONTRAST_RULES}

After generating the image, provide 3 bullet points (max 15 words each) explaining the creative direction.`;
}

// ─── Prompt: Stock/Lifestyle Image (Gemini) ───

export function buildStockImagePrompt(
  project: BrandProject,
  colors: { hex: string; name: string; role: string }[],
): string {
  const ctx = buildContext(project);

  const personaScene = project.strategy.audience.personas
    .filter((p) => p.name)
    .map(
      (p) =>
        `${p.name} — a ${p.ageRange} ${p.occupation} who wants ${p.goals[0] || "solutions"}`,
    )
    .join("; ");

  return `Generate an editorial stock photograph for "${ctx.brand.name}" brand mood board.

═══ BRAND ═══
${ctx.brand.name}: ${ctx.brand.description}
Mission: ${ctx.brand.mission}
${ctx.brand.businessModels?.length ? `Industry: ${ctx.brand.businessModels.join(", ")}` : ""}
${ctx.brand.salesChannels?.length ? `Sales channels: ${ctx.brand.salesChannels.join(", ")}` : ""}

═══ WHO TO SHOW ═══
${personaScene || `Someone who would benefit from "${ctx.brand.description}"`}
The image should connect with ${ctx.personaAgeRanges.join(" and ") || "the target"} demographic.

═══ BRAND FEELING ═══
${ctx.archetypeCombination || ""}
The brand experience is: ${ctx.brief.experience.join(", ")}
The tone is: ${ctx.brief.tone.join(", ")}
Famous for: "${ctx.brief.famousFor}"

═══ COLOR PALETTE ═══
${colors.map((c) => `${c.name} ${c.hex} (${c.role})`).join(", ")}

═══ REQUIREMENTS ═══
1. Must directly relate to "${ctx.brand.description}" — NOT generic lifestyle
2. Color temperature must match the palette above
3. Must feel ${ctx.brief.tone.slice(0, 2).join(" and ")} — editorial and authentic
4. No text, no logos, no overlays
5. Landscape (16:9), natural lighting
6. Should NOT look like: ${ctx.brief.notThis.join(", ") || "generic stock"}
7. Must evoke the brand values and resonate with the target audience
${WCAG_CONTRAST_RULES}

After generating the image, provide 3 bullet points (max 15 words each) explaining why this image fits the brand.`;
}
