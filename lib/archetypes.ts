import { Archetype } from "./types";

export interface BrandExample {
  name: string;
  domain: string;
}

export interface ArchetypeData {
  id: Archetype;
  name: string;
  tagline: string;
  keywords: string[];
  icon: string;
  description: string;
  strengths: string;
  shadow: string;
  examples: string[];
  brandExamples: BrandExample[];
}

export const ARCHETYPES: ArchetypeData[] = [
  {
    id: "jester",
    name: "The Jester",
    tagline: "Laugh and the world will laugh with you",
    keywords: ["Joy", "Humor", "Playfulness", "Fun"],
    icon: "🃏",
    description:
      "Whether it's a Fortune 100 or your mom and pop deli down the street, the Jester Archetype is present in cultures that do and give so others can have fun. Innovative and outspoken, Jesters are the first to suggest a cocktail after a hard day. Their fun-loving attitudes make people say, \"Hey, I want to hang out with them!\" As a service provider, they help us all take the pain out of life's hardest moments.",
    strengths:
      "Brings joy, builds connection through humor, makes the mundane memorable",
    shadow:
      "Sometimes jokes aren't funny. Laughing isn't always appropriate and the \"funny guy\" in the room may not be perceived as the smartest. Even the Jester may need a reminder to work on timing.",
    examples: ["MailChimp", "The Onion", "Ben & Jerry's", "M&M"],
    brandExamples: [
      { name: "MailChimp", domain: "mailchimp.com" },
      { name: "Ben & Jerry's", domain: "benjerry.com" },
      { name: "M&M", domain: "mms.com" },
    ],
  },
  {
    id: "sage",
    name: "The Sage",
    tagline: "To know is to grow",
    keywords: ["Wisdom", "Knowledge", "Truth", "Expertise"],
    icon: "📚",
    description:
      "Research, measure, and test, then study, revise, and teach – Sages are methodical and objective. They're the smartest ones in the room and likely have time, history, and proven strategies on their side. Books, conferences, and lunch and learns are the highlights of a Sage culture. They will always bring a well thought-out method to the table and you can guarantee they'll be able to prove their results.",
    strengths:
      "Deep expertise, data-driven, builds trust through knowledge sharing",
    shadow:
      'However awkward this potential "nerd" culture may be, they cherish keeping everyone on the team, from the top desk to every desk, informed.',
    examples: ["McKinsey", "Rosetta Stone", "Harvard"],
    brandExamples: [
      { name: "McKinsey", domain: "mckinsey.com" },
      { name: "Harvard", domain: "harvard.edu" },
      { name: "Rosetta Stone", domain: "rosettastone.com" },
    ],
  },
  {
    id: "magician",
    name: "The Magician",
    tagline: "Making the vision a reality",
    keywords: ["Transformation", "Vision", "Innovation", "Wonder"],
    icon: "✨",
    description:
      '"How did you do that?!" The Magician culture dazzles onlookers with grand ventures and a magical ability to accomplish whatever they set their minds to. At a Magician organization, impossible is only a state of mind. They can transform your image, feelings, or perspective on just about anything. The Magician often finds its way into a consultancy, training, or coaching organization as they help clients change their outlooks on life.',
    strengths: "Visionary, transformative, creates awe-inspiring experiences",
    shadow:
      "Trying to pull a rabbit out of a hat every day can be exhausting, and big expectations can leave employees scrambling to accomplish impossible tasks.",
    examples: ["Disney", "Polaroid", "Apple", "Dyson"],
    brandExamples: [
      { name: "Disney", domain: "disney.com" },
      { name: "Apple", domain: "apple.com" },
      { name: "Dyson", domain: "dyson.com" },
    ],
  },
  {
    id: "ruler",
    name: "The Ruler",
    tagline: "Take control and lead",
    keywords: ["Control", "Leadership", "Excellence", "Authority"],
    icon: "👑",
    description:
      "The king, the president, or the top of their class, Rulers are the absolute best at what they do. They know how to step into the limelight and take control. Through policies, procedures, and an authoritative personality, these cultures push until everything is done correctly. Even in a commanding role, these teams and organisations measure every step against what is socially responsible.",
    strengths:
      "Decisive leadership, sets high standards, creates order from chaos",
    shadow:
      "Like Abraham Lincoln, the strong opinion isn't always the popular one. And, sometimes, you have to put your foot down. Rulers are usually right, but that doesn't always mean everyone is thrilled to see them walk in the door.",
    examples: [
      "Mercedes-Benz",
      "Brooks Brothers",
      "Moody's",
      "British Airways",
    ],
    brandExamples: [
      { name: "Mercedes-Benz", domain: "mercedes-benz.com" },
      { name: "Brooks Brothers", domain: "brooksbrothers.com" },
      { name: "British Airways", domain: "britishairways.com" },
    ],
  },
  {
    id: "creator",
    name: "The Creator",
    tagline: "Pairing art with science",
    keywords: ["Imagination", "Self-expression", "Originality", "Craft"],
    icon: "🎨",
    description:
      "Writers, designers, architects, musicians, and even mechanical engineers – there's a special culture out there where people have the innate ability to build, present and perform. Creator cultures wow and amaze us with their skills for developing products that are equally beautiful and functional. Of every music note possible, they combine just the right ones in harmony.",
    strengths:
      "Innovative design, beautiful execution, creative problem-solving",
    shadow:
      "Don't confuse all Creators with the starving artist; these cultures are masters at effectiveness and persuasion. But, every Archetype has a shadow side and the Creator is likely to get stuck in a cycle of perfectionism...bogged down by their own frustration.",
    examples: [
      "Adobe",
      "LEGO",
      "Pixar",
      "Warner Music",
      "Pinterest",
      "Shutterstock",
    ],
    brandExamples: [
      { name: "Adobe", domain: "adobe.com" },
      { name: "LEGO", domain: "lego.com" },
      { name: "Pinterest", domain: "pinterest.com" },
    ],
  },
  {
    id: "outlaw",
    name: "The Revolutionary",
    tagline: "Conventions were made to be broken",
    keywords: ["Liberation", "Disruption", "Revolution", "Change"],
    icon: "⚡",
    description:
      "Weed through the clutter and challenge the status quo. Revolutionary organizations were born to break things, making way for creative breakthroughs that can bring true industry-changing innovation. Like MTV's videos or a crew of Harley Davidson riders, Revolutionaries stand up for what they believe in so we can all break away from what's conventional.",
    strengths: "Bold innovation, challenges norms, inspires radical change",
    shadow:
      "But, just like that biker rolling down the highway, the Revolutionary attitude can be jarring. Their passion for breaking things may push us forward, but the risk involved might cause them to lose a couple friends.",
    examples: ["Greenpeace", "Uber", "Netflix"],
    brandExamples: [
      { name: "Uber", domain: "uber.com" },
      { name: "Netflix", domain: "netflix.com" },
      { name: "Greenpeace", domain: "greenpeace.org" },
    ],
  },
  {
    id: "hero",
    name: "The Hero",
    tagline: "Bring it on",
    keywords: ["Mastery", "Courage", "Achievement", "Determination"],
    icon: "🦸",
    description:
      'We all have one. Some are disguised as Spider-Man. Others, like Gandhi, prefer to come as they are. Often, they fight for the underdog, a story that resonates across continents and cultures. Walk into a Hero organization and you\'ll be sure to see "Employee of the Month" awards or people praising one another for giving it their all. Motivational pep talks and sports analogies are likely to keep teams fighting the competition.',
    strengths:
      "Highly productive, disciplined, and focused. Champions of courage, inspiring us all to be a little braver",
    shadow:
      "Their mentality to work harder when times are tough can lead to burn-out, stress, or aggressive behaviors.",
    examples: ["Nike", "PayPal", "Doctors Without Borders"],
    brandExamples: [
      { name: "Nike", domain: "nike.com" },
      { name: "PayPal", domain: "paypal.com" },
    ],
  },
  {
    id: "innocent",
    name: "The Innocent",
    tagline: "Life as it should be",
    keywords: ["Safety", "Optimism", "Simplicity", "Purity"],
    icon: "🕊️",
    description:
      "Ice cold lemonade from a corner stand, a baby's first smile, or diving into a mountain lake. Some moments in life can only be described with one word: perfect. The Innocent culture helps people find sanctuary, peace, and happiness. Every cloud has a silver lining. Tomorrow is only a day away. Don't worry, be happy! Innocent cultures often train new workers or young employees, easing them into the tough realities of the real world.",
    strengths:
      "Exemplars of optimism, consistent and unpretentious through simple acts of kindness and a trusting smile",
    shadow:
      "Sometimes the glass isn't always half full, and the Innocent may need a reality check to keep business moving.",
    examples: ["Tumblr", "Innocent Smoothies", "Coca Cola"],
    brandExamples: [
      { name: "Coca Cola", domain: "coca-cola.com" },
      { name: "Innocent", domain: "innocentdrinks.co.uk" },
      { name: "Tumblr", domain: "tumblr.com" },
    ],
  },
  {
    id: "regular",
    name: "The Everyman",
    tagline: "All for one and one for all",
    keywords: ["Belonging", "Authenticity", "Connection", "Equality"],
    icon: "🤝",
    description:
      'Just like the Cheers theme song, "sometimes you want to go where everybody knows your name, and they\'re always glad you came." Every-person cultures are comfortable places where everyone belongs. A true egalitarian environment, everyone is treated equally and they work together to ensure rules are enforced equitably.',
    strengths: "Inclusive, collaborative, creates genuine sense of community",
    shadow:
      "But, if everyone is equal...who is in charge? Every-person cultures may breed turf wars or an over-reliance on team buy-in.",
    examples: [
      "Habitat for Humanity",
      "TOMS Shoes",
      "Volkswagen",
      "Craigslist",
    ],
    brandExamples: [
      { name: "Volkswagen", domain: "volkswagen.com" },
      { name: "TOMS", domain: "toms.com" },
      { name: "IKEA", domain: "ikea.com" },
    ],
  },
  {
    id: "lover",
    name: "The Lover",
    tagline: "Connecting deeper",
    keywords: ["Passion", "Intimacy", "Beauty", "Sensuality"],
    icon: "💎",
    description:
      'Think of your most vivid memory. Odds are, it involves a rich combination of senses and emotions. Lovers aim to elevate our experiences. They inspire us to say, "It\'s the way it makes me feel." Their ability to tap into a multi-dimensional experience is commonly carried throughout the retail, hospitality, tourism and entertainment industries with fans of all varieties.',
    strengths:
      "Creates deep emotional connections, appeals to all senses, elevates experiences",
    shadow:
      "Lovers do tend to put money into expensive ventures and may rely too much on flattery to feel successful...so it can't hurt to help them keep track of their gossip or their wallet.",
    examples: ["W Hotel", "Tiffany & Co.", "Häagen-Dazs", "Victoria Secret"],
    brandExamples: [
      { name: "Tiffany & Co.", domain: "tiffany.com" },
      { name: "Häagen-Dazs", domain: "haagendazs.com" },
      { name: "Victoria's Secret", domain: "victoriassecret.com" },
    ],
  },
  {
    id: "explorer",
    name: "The Explorer",
    tagline: "Let me be free",
    keywords: ["Freedom", "Discovery", "Adventure", "Independence"],
    icon: "🧭",
    description:
      "The top of a mountain. The edge of a cliff. Winning the pitch for your brand new startup. Explorers go where no man or woman has gone before. Explorer cultures are determined to get us to step out of life and into living. Independent, self-directed, and at the forefront of theory and practice, they're inherently non-conformist. With a childlike enthusiasm for what's new, they often are, or act, like the youngest one in the room.",
    strengths: "Pioneering spirit, independent thinking, pushes boundaries",
    shadow:
      "Like the lone ranger, however, the Explorer culture may have a habit of alienating themselves because they can't seem to settle down.",
    examples: [
      "Patagonia",
      "Starbucks",
      "NASA",
      "Mammut",
      "National Geographic",
    ],
    brandExamples: [
      { name: "Patagonia", domain: "patagonia.com" },
      { name: "Starbucks", domain: "starbucks.com" },
      { name: "NASA", domain: "nasa.gov" },
    ],
  },
  {
    id: "caregiver",
    name: "The Caregiver",
    tagline: "Making people a priority",
    keywords: ["Service", "Nurturing", "Generosity", "Compassion"],
    icon: "🤲",
    description:
      "Expert mentors and passionate defenders, these organisations and teams are the first ones to lend a hand, an ear, or a shoulder. The Caregiver culture will often model maternal or paternal patterns. They want to see their employees and customers learn and grow and they'll support them unconditionally. However, they also know that sometimes people need to learn their own lessons.",
    strengths:
      "Responsive, consistent, and trustworthy. Strongest when acting as a mentor for employees or clients",
    shadow:
      "Dependency, martyrdom, and sleepless nights from caring too much may signal a Caregiver shadow side.",
    examples: ["Dove", "Amnesty International", "Allstate Insurance"],
    brandExamples: [
      { name: "Dove", domain: "dove.com" },
      { name: "Allstate", domain: "allstate.com" },
    ],
  },
];

export function getArchetype(id: Archetype): ArchetypeData {
  return ARCHETYPES.find((a) => a.id === id)!;
}

export function getArchetypeCombinationDescription(
  primary: Archetype,
  secondary: Archetype,
): string {
  const p = getArchetype(primary);
  const s = getArchetype(secondary);
  return `Your brand leads with the ${p.name} archetype — ${p.tagline.toLowerCase()} — supported by the ${s.name} — ${s.tagline.toLowerCase()}. This combination means your brand voice balances ${p.keywords[0].toLowerCase()} with ${s.keywords[0].toLowerCase()}, creating a unique identity that is both ${p.keywords[1].toLowerCase()} and ${s.keywords[1].toLowerCase()}.`;
}
