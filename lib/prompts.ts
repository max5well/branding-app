import { BrandProject } from "./types";
import { getArchetype } from "./archetypes";

function brandContext(project: BrandProject): string {
  const b = project.strategy.brand;
  const personas = project.strategy.audience.personas
    .filter((p) => p.name)
    .map(
      (p) =>
        `  - ${p.name} (${p.ageRange}, ${p.occupation}): Pain points: ${p.painPoints.join(", ")}. Goals: ${p.goals.join(", ")}`,
    )
    .join("\n");
  const competitors = project.strategy.competitors
    .filter((c) => c.name || c.website)
    .map(
      (c) =>
        `  - ${c.name || c.website}: ${c.description || ""}. Strengths: ${c.strengths}. Weaknesses: ${c.weaknesses}. Visual style: ${c.visualStyle.join(", ")}${c.brand ? `. Brand colors: ${c.brand.colors.join(", ")}. Positioning: ${c.brand.positioning}` : ""}`,
    )
    .join("\n");

  return `Brand Name: ${b.name}
Description: ${b.description}
Mission: ${b.mission}
Vision: ${b.vision}
Business Model: ${b.businessModels.join(", ")}${b.businessModelCustom ? ` (${b.businessModelCustom})` : ""}
Sales Channels: ${b.salesChannels.join(", ")}${b.pricingNotes ? `. Notes: ${b.pricingNotes}` : ""}

Target Audience:
${personas || "  Not specified"}

Competitors:
${competitors || "  None specified"}`;
}

export function buildPersonalityPrompt(project: BrandProject): string {
  const primary = project.personality.primaryArchetype
    ? getArchetype(project.personality.primaryArchetype)
    : null;
  const secondary = project.personality.secondaryArchetype
    ? getArchetype(project.personality.secondaryArchetype)
    : null;

  return `You are a world-class brand strategist. Based on the following brand information and selected archetypes, write a compelling brand personality summary (3-4 paragraphs). Explain how the primary and secondary archetypes complement each other, what this means for the brand's voice, values, and how it should show up in the world. Be specific to THIS brand, not generic.

${brandContext(project)}

Primary Archetype: ${primary?.name} - ${primary?.tagline}
${primary?.description}

Secondary Archetype: ${secondary?.name} - ${secondary?.tagline}
${secondary?.description}

Write the personality summary as rich, engaging prose. Do not use JSON. Address the brand directly using "your brand" language.`;
}

export function buildMoodBoardPrompt(project: BrandProject): string {
  const primary = project.personality.primaryArchetype
    ? getArchetype(project.personality.primaryArchetype)
    : null;
  const secondary = project.personality.secondaryArchetype
    ? getArchetype(project.personality.secondaryArchetype)
    : null;
  const brief = project.creativeBrief;

  return `You are an elite creative director at a top branding agency. Generate exactly 3 distinct mood board directions for this brand. Each direction should be a cohesive creative concept that could work as the brand's visual identity.

${brandContext(project)}

Brand Archetypes: ${primary?.name} (primary) + ${secondary?.name} (secondary)
Brand Personality: ${project.personality.personalitySummary || "Not yet generated"}

Creative Brief:
- Visual Traits (how it should LOOK): ${brief.traits.join(", ")}
- Voice Tone (how it should SPEAK): ${brief.tone.join(", ")}
- Brand Experience (how it should FEEL): ${brief.experience.join(", ")}
- Famous For: ${brief.famousFor}
- What the brand is NOT: ${brief.notThis.join(", ")}

Return a JSON array of exactly 3 mood board objects. Each object must have:
- id: a unique string (use "board-1", "board-2", "board-3")
- name: creative direction name (e.g., "Bold & Modern", "Organic & Warm")
- description: 2-3 sentences explaining the creative rationale
- colors: array of exactly 5 color objects, each with hex (valid hex like "#1A2B3C"), name (creative name), and usage ("primary", "secondary", "accent", "background", "text")
- primaryFont: Google Font name for headings
- secondaryFont: Google Font name for body text
- visualKeywords: array of 5-6 descriptive tags
- shapeLanguage: description of geometric vs organic, rounded vs sharp, etc.
- logoDirection: description of suggested logo style
- imageStyle: photography/illustration style description

Make each direction genuinely different - don't just vary colors. Each should represent a distinct creative philosophy that could work for this brand. Ensure colors have good contrast and are usable for a real brand.

Respond with ONLY the JSON array wrapped in \`\`\`json code fences.`;
}

export function buildRefinementPrompt(project: BrandProject): string {
  const selected = project.moodBoards.filter((b) =>
    project.selectedMoodBoardIds.includes(b.id),
  );
  const feedback = project.feedback;

  return `You are an elite creative director refining a brand direction. The client has selected ${selected.length} mood board direction(s) and provided feedback. Generate a single, refined brand direction that incorporates their feedback.

${brandContext(project)}

Selected Direction(s):
${selected.map((b) => JSON.stringify(b, null, 2)).join("\n\n")}

Client Feedback:
- Color changes: ${feedback.colorChanges ? JSON.stringify(feedback.colorChanges) : "None"}
- Typography feedback: ${feedback.typographyFeedback || "None"}
- General feedback: ${feedback.generalFeedback || "None"}
- Merge strategy: ${feedback.mergeStrategy || "N/A"}

Generate a single refined mood board object (same schema as before) that addresses the client's feedback while maintaining creative coherence. Use id "refined-1".

Respond with ONLY the JSON object wrapped in \`\`\`json code fences.`;
}

export function buildGuidelinePrompt(project: BrandProject): string {
  const direction =
    project.refinedDirection ||
    project.moodBoards.find((b) => project.selectedMoodBoardIds.includes(b.id));
  const primary = project.personality.primaryArchetype
    ? getArchetype(project.personality.primaryArchetype)
    : null;
  const secondary = project.personality.secondaryArchetype
    ? getArchetype(project.personality.secondaryArchetype)
    : null;

  return `You are a senior brand strategist creating a comprehensive brand guideline document. Write polished, professional copy for each section.

${brandContext(project)}

Archetypes: ${primary?.name} (primary), ${secondary?.name} (secondary)
Personality: ${project.personality.personalitySummary}

Creative Brief:
- Traits: ${project.creativeBrief.traits.join(", ")}
- Tone: ${project.creativeBrief.tone.join(", ")}
- Experience: ${project.creativeBrief.experience.join(", ")}
- Famous For: ${project.creativeBrief.famousFor}
- Not This: ${project.creativeBrief.notThis.join(", ")}

Final Visual Direction:
${JSON.stringify(direction, null, 2)}

Generate a complete brand guideline as a JSON object with:
- overview: 2-3 paragraph brand overview incorporating mission, vision, and personality
- archetypeDescription: paragraph describing the archetype combination and what it means
- voiceGuidelines: { dos: string[] (5-7 items), donts: string[] (5-7 items), toneDescription: string (2 paragraphs) }
- colorPalette: array of color objects with hex, name, and usage (use the final direction's colors plus any refinements)
- typography: { primaryFont: string, secondaryFont: string, hierarchy: { "h1": { size: "...", weight: "..." }, "h2": {...}, "h3": {...}, "body": {...}, "caption": {...} } }
- visualStyle: 2 paragraphs describing image direction, shape language, and iconography
- logoGuidance: paragraph with logo style recommendations
- brandDonts: string[] (5-7 things the brand should never do/be)

Respond with ONLY the JSON object wrapped in \`\`\`json code fences.`;
}
