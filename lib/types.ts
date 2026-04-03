export interface Persona {
  id: string;
  name: string;
  ageRange: string;
  occupation: string;
  painPoints: string[];
  goals: string[];
  channels: string[];
}

export interface CompetitorSocialMedia {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
}

export interface CompetitorBrand {
  colors: string[];
  headingFont: string;
  bodyFont: string;
  accentFont?: string;
  logoDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
  tagline?: string;
  mission?: string;
  vision?: string;
  brandVoice?: string;
  socialMedia?: CompetitorSocialMedia;
  // legacy fields kept for backwards compat
  logo?: string;
  fonts: string[];
  imagery: string;
  positioning: string;
}

export interface Competitor {
  id: string;
  website: string;
  name: string;
  description: string;
  strengths: string;
  weaknesses: string;
  visualStyle: string[];
  brand?: CompetitorBrand;
  analyzing?: boolean;
  analyzed?: boolean;
}

export type Archetype =
  | "innocent"
  | "explorer"
  | "sage"
  | "hero"
  | "outlaw"
  | "magician"
  | "regular"
  | "lover"
  | "jester"
  | "caregiver"
  | "creator"
  | "ruler";

export interface ColorSwatch {
  hex: string;
  name: string;
  usage: string;
}

export interface GeneratedMoodBoard {
  id: string;
  colors: { hex: string; name: string; role: string }[];
  colorsReasoning: string[];
  headingFont: string;
  bodyFont: string;
  fontsReasoning: string[];
  logoBase64?: string;
  logoMimeType?: string;
  logoReasoning: string[];
  iconsBase64?: string;
  iconsMimeType?: string;
  iconsReasoning: string[];
  moodImage1Base64?: string;
  moodImage1MimeType?: string;
  moodImage1Reasoning: string[];
  moodImage2Base64?: string;
  moodImage2MimeType?: string;
  moodImage2Reasoning: string[];
  stockImageBase64?: string;
  stockImageMimeType?: string;
  stockImageReasoning: string[];
}

export interface MoodBoard {
  id: string;
  name: string;
  description: string;
  colors: ColorSwatch[];
  primaryFont: string;
  secondaryFont: string;
  visualKeywords: string[];
  shapeLanguage: string;
  logoDirection: string;
  imageStyle: string;
}

export interface BrandGuideline {
  overview: string;
  archetypeDescription: string;
  voiceGuidelines: {
    dos: string[];
    donts: string[];
    toneDescription: string;
  };
  colorPalette: ColorSwatch[];
  typography: {
    primaryFont: string;
    secondaryFont: string;
    hierarchy: Record<string, { size: string; weight: string }>;
  };
  visualStyle: string;
  logoGuidance: string;
  brandDonts: string[];
}

export interface BrandProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentPhase: 1 | 2 | 3 | 4 | 5 | 6;

  strategy: {
    brand: {
      name: string;
      description: string;
      mission: string;
      vision: string;
      businessModels: string[];
      businessModelCustom?: string;
      salesChannels: string[];
      pricingNotes?: string;
    };
    audience: {
      personas: Persona[];
    };
    competitors: Competitor[];
  };

  personality: {
    primaryArchetype: Archetype | null;
    secondaryArchetype: Archetype | null;
    personalitySummary?: string;
  };

  creativeBrief: {
    traits: string[];
    tone: string[];
    experience: string[];
    famousFor: string;
    notThis: string[];
  };

  moodBoards: MoodBoard[];
  generatedMoodBoards?: GeneratedMoodBoard[];
  selectedGeneratedBoardId?: string;
  selectedMoodBoardIds: string[];

  feedback: {
    colorChanges?: Record<string, string>;
    typographyFeedback?: string;
    generalFeedback?: string;
    mergeStrategy?: string;
  };
  refinedDirection?: MoodBoard;

  finalGuideline?: BrandGuideline;
}

export interface PhaseInfo {
  number: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  path: string;
  description: string;
}
