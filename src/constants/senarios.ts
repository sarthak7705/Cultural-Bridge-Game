import { Role, Scenario } from "@/types/conflict";

export const scenarios: Scenario[] = [
    {
      id: 'india_pakistan',
      title: 'India-Pakistan Relations',
      description: 'Navigate the complex historical relationship between India and Pakistan, addressing territorial disputes and religious tensions.',
      imageUrl: 'https://images.pexels.com/photos/3791999/pexels-photo-3791999.jpeg',
      difficulty: 'hard'
    },
    {
      id: 'israeli_palestinian',
      title: 'Israeli-Palestinian Conflict',
      description: 'Attempt to broker peace in one of the world\'s most enduring conflicts with deep historical and religious dimensions.',
      imageUrl: 'https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg',
      difficulty: 'hard'
    },
    {
      id: 'us_china',
      title: 'US-China Trade Relations',
      description: 'Balance economic interests, human rights concerns, and geopolitical tensions between global superpowers.',
      imageUrl: 'https://images.pexels.com/photos/1055056/pexels-photo-1055056.jpeg',
      difficulty: 'medium'
    },
    {
      id: 'eu_migration',
      title: 'EU Migration Crisis',
      description: 'Address the humanitarian, political, and cultural challenges of migration flows into the European Union.',
      imageUrl: 'https://images.pexels.com/photos/6231/marketing-color-colors-wheel.jpg',
      difficulty: 'medium'
    }
  ];

  export const roles: Role[] = [
    {
      id: 'side_a',
      name: 'Side A Representative',
      description: 'Advocate for the interests of the first party in the conflict.'
    },
    {
      id: 'side_b',
      name: 'Side B Representative',
      description: 'Represent the second party and their needs and concerns.'
    },
    {
      id: 'facilitator',
      name: 'Neutral Facilitator',
      description: 'Work as a diplomat to find common ground between conflicting parties.'
    }
  ];