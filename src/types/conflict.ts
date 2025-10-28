export interface Scenario {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface ConflictState {
  selectedScenario: Scenario | null;
  selectedRole: Role | null;
  tensionLevel: number;
  currentPrompt: string;
  history: Array<{ message: string; author: string }>;
  kalkiScore: {
    empathy: number;
    diplomacy: number;
    history: number;
    ethics: number;
    total: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}
