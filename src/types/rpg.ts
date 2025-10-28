export interface EvaluationRequest {
  chat_history: Array<{user: string, ai: string}>;
}

export interface EvaluationResponse {
  empathy_score: number;
  diplomatic_skill_score: number;
  historical_accuracy_score: number;
  ethical_balance_score: number;
  total_score: number;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarUrl: string;
}

export interface GameStateContext {
  chatHistory: Array<{user: string, ai: string}>;
  currentRole: string;
  currentCulture: string;
  currentEra: string;
  currentTone: string;
  currentLanguage: string;
}

export interface EvaluationResult {
  empathyScore: number;
  diplomaticSkillScore: number;
  historicalAccuracyScore: number;
  ethicalBalanceScore: number;
  totalScore: number;
  performanceLevel: string;
}

export interface GameState {
  started: boolean;
  selectedCharacter: Character | null;
  currentScene: string;
  availableActions: string[];
  gameHistory: string[];
  isLoading: boolean;
  error: string | null;
  evaluation: EvaluationResult | null;
  showEvaluation: boolean;
  
  chatHistory: Array<{user: string, ai: string}>;
  currentRole: string;
  currentCulture: string;
  currentEra: string;
  currentTone: string;
  currentLanguage: string;
}