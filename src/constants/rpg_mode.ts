import { Character } from "@/types/rpg";

export const characters: Character[] = [
  {
    id: "diplomat",
    name: "Namiko",
    role: "Diplomat",
    description:
      "A skilled negotiator from Kyoto, versed in ancient Japanese etiquette and modern diplomacy.",
    avatarUrl:
      "https://images.pexels.com/photos/789822/pexels-photo-789822.jpeg",
  },
  {
    id: "warrior",
    name: "Ravi",
    role: "Warrior",
    description:
      "A Kshatriya from North India, trained in martial arts and battle strategy.",
    avatarUrl:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
  },
  {
    id: "sage",
    name: "Elena",
    role: "Sage",
    description:
      "A Balkan mystic who draws on Slavic folklore and spiritual insight to guide others.",
    avatarUrl:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    id: "merchant",
    name: "Omar",
    role: "Merchant",
    description:
      "A skilled negotiator from Marrakech who blends business with deep cultural wisdom.",
    avatarUrl:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  },
  {
    id: "healer",
    name: "Amina",
    role: "Healer",
    description:
      "An herbalist from the Sahel who practices ancient African healing traditions.",
    avatarUrl:
      "https://images.pexels.com/photos/1181317/pexels-photo-1181317.jpeg",
  },
];

export const characterInfo: Record<
  string,
  {
    role: string;
    culture: string;
    era: string;
    tone: string;
  }
> = {
  diplomat: {
    role: "Diplomat",
    culture: "Japanese",
    era: "Modern",
    tone: "formal",
  },
  warrior: {
    role: "Warrior",
    culture: "Indian",
    era: "Medieval",
    tone: "brave",
  },
  sage: { role: "Sage", culture: "Balkan", era: "Ancient", tone: "wise" },
  merchant: {
    role: "Merchant",
    culture: "Moroccan",
    era: "Renaissance",
    tone: "persuasive",
  },
  healer: {
    role: "Healer",
    culture: "African",
    era: "Traditional",
    tone: "compassionate",
  },
  storyteller: {
    role: "Griot",
    culture: "West African",
    era: "Traditional",
    tone: "engaging",
  },
  explorer: {
    role: "Anthropologist",
    culture: "South Indian",
    era: "Contemporary",
    tone: "curious",
  },
  artisan: {
    role: "Artisan",
    culture: "Quechua",
    era: "Colonial",
    tone: "expressive",
  },
  shaman: {
    role: "Shaman",
    culture: "Polynesian",
    era: "Ancient",
    tone: "mystical",
  },
  poet: {
    role: "Poet",
    culture: "Rajasthani",
    era: "Classical",
    tone: "lyrical",
  },
  monk: { role: "Monk", culture: "Japanese", era: "Feudal", tone: "serene" },
  dancer: {
    role: "Dancer",
    culture: "Indian",
    era: "Classical",
    tone: "rhythmic",
  },
};

export const characterMap: Record<
  string,
  {
    role: string;
    culture: string;
    era: string;
    tone: string;
    language: string;
  }
> = {
  diplomat: {
    role: "Diplomat",
    culture: "Japanese",
    era: "Modern",
    tone: "formal",
    language: "English",
  },
  warrior: {
    role: "Warrior",
    culture: "Indian",
    era: "Medieval",
    tone: "brave",
    language: "English",
  },
  sage: {
    role: "Sage",
    culture: "Balkan",
    era: "Ancient",
    tone: "wise",
    language: "English",
  },
  merchant: {
    role: "Merchant",
    culture: "Moroccan",
    era: "Renaissance",
    tone: "persuasive",
    language: "English",
  },
  healer: {
    role: "Healer",
    culture: "African",
    era: "Traditional",
    tone: "compassionate",
    language: "English",
  },
  storyteller: {
    role: "Griot",
    culture: "West African",
    era: "Traditional",
    tone: "engaging",
    language: "English",
  },
  explorer: {
    role: "Anthropologist",
    culture: "South Indian",
    era: "Contemporary",
    tone: "curious",
    language: "English",
  },
  artisan: {
    role: "Artisan",
    culture: "Quechua",
    era: "Colonial",
    tone: "expressive",
    language: "English",
  },
  shaman: {
    role: "Shaman",
    culture: "Polynesian",
    era: "Ancient",
    tone: "mystical",
    language: "English",
  },
  poet: {
    role: "Poet",
    culture: "Rajasthani",
    era: "Classical",
    tone: "lyrical",
    language: "English",
  },
  monk: {
    role: "Monk",
    culture: "Japanese",
    era: "Feudal",
    tone: "serene",
    language: "English",
  },
  dancer: {
    role: "Dancer",
    culture: "Indian",
    era: "Classical",
    tone: "rhythmic",
    language: "English",
  },
};
