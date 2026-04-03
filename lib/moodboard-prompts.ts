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

  // Build a narrative archetype combination description
  let archetypeCombination = "";
  if (primary && secondary) {
    archetypeCombination = `The brand leads with ${primary.name} (${primary.tagline}) — ${primary.keywords.join(", ")} — blended with ${secondary.name} (${secondary.tagline}) — ${secondary.keywords.join(", ")}. This means the visual identity should feel ${primary.keywords[0].toLowerCase()} yet ${secondary.keywords[1].toLowerCase()}, ${primary.keywords[1].toLowerCase()} yet ${secondary.keywords[0].toLowerCase()}.`;
  } else if (primary) {
    archetypeCombination = `The brand embodies ${primary.name} (${primary.tagline}) — ${primary.keywords.join(", ")}. The visual identity should feel ${primary.keywords.map((k) => k.toLowerCase()).join(", ")}.`;
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

// ─── Dynamic direction derivation ───
// Instead of hardcoded hints, derive 3 directions from the actual brand data

function deriveColorDirections(ctx: BrandContext): string[] {
  const directions: string[] = [];

  // Direction 1: Archetype-driven — pull from the archetype's natural visual territory
  if (ctx.primary) {
    const archetypeKeywords = ctx.primary.keywords
      .map((k) => k.toLowerCase())
      .join(", ");
    const trait1 = ctx.brief.traits[0] || "distinctive";
    const trait2 = ctx.brief.traits[1] || "memorable";
    directions.push(
      `ARCHETYPE-LED: Build the palette from the emotional core of ${ctx.primary.name}. The colors should viscerally communicate ${archetypeKeywords}. Lean into ${trait1} and ${trait2}. Think about what colors ${ctx.primary.examples.join(", ")} use and WHY — then find your own unique expression of that same emotional territory.`,
    );
  } else {
    directions.push(
      `BRAND-LED: Build the palette directly from the brand's mission ("${ctx.brand.mission}") and the experience it creates ("${ctx.brief.experience.join(", ")}"). What colors make someone FEEL that experience?`,
    );
  }

  // Direction 2: Audience-driven — what resonates with the target personas
  if (ctx.personaAgeRanges.length > 0 && ctx.personaChannels.length > 0) {
    const channels = ctx.personaChannels.slice(0, 3).join(", ");
    const ages = ctx.personaAgeRanges.join(" and ");
    const notThis = ctx.brief.notThis.slice(0, 2).join(" or ");
    directions.push(
      `AUDIENCE-LED: Design for ${ages} audiences who live on ${channels}. The palette must perform on digital-first channels — high contrast on mobile screens, thumb-stopping in social feeds. It should feel ${ctx.brief.tone.join(", ")} — specifically NOT ${notThis || "generic or forgettable"}. Study what resonates with this demographic but avoid what competitors already own (${ctx.competitorColors.slice(0, 6).join(", ") || "unknown"}).`,
    );
  } else {
    directions.push(
      `EXPERIENCE-LED: The brand wants to be famous for "${ctx.brief.famousFor}". Build a palette that would make sense on a billboard advertising exactly that. The tone is ${ctx.brief.tone.join(", ")} — the experience is ${ctx.brief.experience.join(", ")}.`,
    );
  }

  // Direction 3: Competitive white-space — deliberately differentiate
  if (ctx.competitorColors.length > 0 || ctx.competitorStyles.length > 0) {
    const avoidColors = ctx.competitorColors.slice(0, 8).join(", ");
    const avoidStyles = ctx.competitorStyles.slice(0, 5).join(", ");
    const weakness = ctx.brief.notThis[0] || "generic";
    directions.push(
      `DIFFERENTIATION-LED: The competitive landscape uses these colors: ${avoidColors || "unknown"}. Their visual styles: ${avoidStyles || "unknown"}. Find the WHITE SPACE — the colors NO competitor owns. If they're all cool-toned, go warm. If they're muted, go vivid. The brand wants to be the opposite of "${weakness}". Create a palette that would make this brand instantly recognizable next to its competitors.`,
    );
  } else {
    const experience = ctx.brief.experience.join(", ");
    directions.push(
      `INNOVATION-LED: With no direct competitor visual data to avoid, go bold. Build a palette that would define and OWN the visual space for "${ctx.brand.description}". The brand experience is: ${experience}. Create colors that would become synonymous with this brand — the way Tiffany owns blue or Hermès owns orange.`,
    );
  }

  return directions;
}

function deriveFontDirections(ctx: BrandContext): string[] {
  const directions: string[] = [];

  // Direction 1: Archetype-expressive
  if (ctx.primary && ctx.secondary) {
    directions.push(
      `ARCHETYPE EXPRESSION: The heading font must embody ${ctx.primary.name}'s ${ctx.primary.keywords[0].toLowerCase()} quality while the body font carries ${ctx.secondary.name}'s ${ctx.secondary.keywords[2]?.toLowerCase() || ctx.secondary.keywords[0].toLowerCase()} quality. ${ctx.primary.name} brands like ${ctx.primary.examples.slice(0, 2).join(", ")} tend toward ${ctx.primary.keywords[1].toLowerCase()} typography — find that energy but make it unique to "${ctx.brand.name}".`,
    );
  } else {
    directions.push(
      `BRAND EXPRESSION: Typography should directly express "${ctx.brief.famousFor}". The heading font is the brand's voice — it speaks ${ctx.brief.tone.join(", ")}. The body font is functional but still on-brand.`,
    );
  }

  // Direction 2: Channel-optimized for target audience
  const channels = ctx.personaChannels;
  const hasSocial = channels.some((c) =>
    ["Instagram", "TikTok", "Twitter/X"].includes(c),
  );
  const hasProfessional = channels.some((c) =>
    ["LinkedIn", "Blogs", "Events"].includes(c),
  );
  if (hasSocial && hasProfessional) {
    directions.push(
      `VERSATILE PAIRING: The audience spans social (${channels.filter((c) => ["Instagram", "TikTok", "Twitter/X"].includes(c)).join(", ")}) AND professional (${channels.filter((c) => ["LinkedIn", "Blogs", "Events"].includes(c)).join(", ")}) channels. Pick a heading font with enough personality for social content but enough gravitas for professional contexts. The body font must be crystal-clear at small sizes on mobile.`,
    );
  } else if (hasSocial) {
    directions.push(
      `SOCIAL-FIRST: The audience lives on ${channels.slice(0, 3).join(", ")}. Typography needs to be bold, scannable, and impactful at phone-screen sizes. Heading font should work as display text on Stories, Reels, and posts. Think expressive and contemporary.`,
    );
  } else {
    directions.push(
      `CONTENT-FIRST: The brand communicates through ${channels.slice(0, 3).join(", ") || ctx.brand.salesChannels?.join(", ") || "long-form content"}. Prioritize reading comfort and intellectual authority. The heading font should command attention; the body font should be effortless to read for paragraphs.`,
    );
  }

  // Direction 3: Competitive differentiation
  if (ctx.competitorFonts.length > 0) {
    directions.push(
      `DIFFERENTIATION: Competitors use: ${ctx.competitorFonts.join(", ")}. Choose fonts that are DISTINCTLY different — if they use geometric sans-serifs, consider humanist or serif alternatives. If they use traditional serifs, consider modern or grotesque options. The brand must look different at a glance.`,
    );
  } else {
    directions.push(
      `CATEGORY DISRUPTION: Without competitor font data, aim to set a new typographic standard for "${ctx.brand.description}". The pairing should feel like it could only belong to this brand — not a template, not an industry default.`,
    );
  }

  return directions;
}

// ─── Prompt: Colors (Claude Opus) ───

export function buildColorPrompt(
  project: BrandProject,
  optionIndex: number,
): string {
  const ctx = buildContext(project);
  const directions = deriveColorDirections(ctx);
  const direction = directions[optionIndex] || directions[0];

  return `You are an elite brand designer creating a 4-color palette for "${ctx.brand.name}".
This is Option ${optionIndex + 1} of 3 — each option must take a FUNDAMENTALLY different approach.

═══ CREATIVE DIRECTION FOR THIS OPTION ═══
${direction}

═══ BRAND IDENTITY ═══
Name: ${ctx.brand.name}
What they do: ${ctx.brand.description}
Mission: ${ctx.brand.mission}
Vision: ${ctx.brand.vision}
Business model: ${(ctx.brand.businessModels || []).join(", ")}${ctx.brand.businessModelCustom ? ` (${ctx.brand.businessModelCustom})` : ""}
Sales channels: ${(ctx.brand.salesChannels || []).join(", ")}
${ctx.brand.pricingNotes ? `Pricing strategy: ${ctx.brand.pricingNotes}` : ""}

═══ BRAND PERSONALITY ═══
${ctx.archetypeCombination}
${ctx.personalitySummary ? `\nPersonality narrative: ${ctx.personalitySummary}` : ""}

═══ CREATIVE BRIEF ═══
Visual traits the brand WANTS: ${ctx.brief.traits.join(", ")}
Tone of voice: ${ctx.brief.tone.join(", ")}
Brand experience: ${ctx.brief.experience.join(", ")}
Famous for: "${ctx.brief.famousFor}"
NOT this (anti-references): ${ctx.brief.notThis.join(", ")}

═══ TARGET AUDIENCE ═══
${ctx.personas || "No personas defined"}

═══ COMPETITIVE LANDSCAPE ═══
${ctx.competitors || "No competitors analyzed"}
${ctx.competitorColors.length > 0 ? `\nAll competitor colors to AVOID: ${ctx.competitorColors.join(", ")}` : ""}

═══ REQUIREMENTS ═══
- Exactly 4 colors: Primary (dominant brand color), Secondary (supporting/contrast), Accent (highlights/CTAs), Dark (text/backgrounds)
- Each color must DIRECTLY tie back to a specific brand attribute above — no arbitrary choices
- Colors must have sufficient contrast for accessibility (WCAG AA)
- Must NOT overlap with competitor colors listed above
- Return valid hex codes and a creative, brand-specific name for each (not generic names like "Ocean Blue" — name them after what makes THIS brand unique)
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

"reasoning" must be exactly 3 bullets (max 15 words each) connecting each color choice to a SPECIFIC brand attribute from above.
Respond with ONLY the JSON wrapped in \`\`\`json code fences.`;
}

// ─── Prompt: Fonts (Claude Opus) ───

export function buildFontPrompt(
  project: BrandProject,
  optionIndex: number,
): string {
  const ctx = buildContext(project);
  const directions = deriveFontDirections(ctx);
  const direction = directions[optionIndex] || directions[0];

  return `You are a typography director selecting a font pairing for "${ctx.brand.name}".
This is Option ${optionIndex + 1} of 3 — each must take a FUNDAMENTALLY different typographic approach.

═══ CREATIVE DIRECTION FOR THIS OPTION ═══
${direction}

═══ BRAND IDENTITY ═══
Name: ${ctx.brand.name}
What they do: ${ctx.brand.description}
Mission: ${ctx.brand.mission}
${ctx.brand.pricingNotes ? `Pricing: ${ctx.brand.pricingNotes}` : ""}
Sales channels: ${(ctx.brand.salesChannels || []).join(", ")}

═══ BRAND PERSONALITY ═══
${ctx.archetypeCombination}
${ctx.personalitySummary ? `\nPersonality: ${ctx.personalitySummary}` : ""}

═══ CREATIVE BRIEF ═══
Visual traits: ${ctx.brief.traits.join(", ")}
Tone: ${ctx.brief.tone.join(", ")}
Experience: ${ctx.brief.experience.join(", ")}
Famous for: "${ctx.brief.famousFor}"
NOT this: ${ctx.brief.notThis.join(", ")}

═══ AUDIENCE ═══
Age ranges: ${ctx.personaAgeRanges.join(", ") || "Mixed"}
Primary channels: ${ctx.personaChannels.join(", ") || "Not specified"}

═══ COMPETITOR FONTS TO AVOID ═══
${ctx.competitorFonts.length > 0 ? ctx.competitorFonts.join(", ") : "No competitor font data — aim to set the standard for this category"}

═══ REQUIREMENTS ═══
- Exactly 2 Google Fonts (freely available on Google Fonts)
- Heading font: must express the brand archetype — ${ctx.primary?.name || "the brand"}'s ${ctx.primary?.keywords[0]?.toLowerCase() || "core"} quality should be visible in the letterforms
- Body font: optimized for readability on ${ctx.personaChannels.includes("Instagram") || ctx.personaChannels.includes("TikTok") ? "mobile screens and social media" : ctx.personaChannels.includes("Blogs") ? "long-form reading on screens" : "screen and print"}
- The pairing must feel like it belongs to THIS specific brand, not a template
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

"reasoning" must be exactly 3 bullets (max 15 words each) connecting font choices to specific brand attributes.
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
