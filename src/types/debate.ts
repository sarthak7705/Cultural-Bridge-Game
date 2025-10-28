export interface DebateState {
  dilemma: string;
  userArgument: string;
  evaluation: {
    score: number;
    feedback: string;
    strengths: string[];
    areas_to_improve: string[];
  } | null;
  isLoading: boolean;
  isEvaluating: boolean;
  error: string | null;
}

export interface DebatePromptResponse {
  prompt: string;
  timestamp: string;
}

export interface DebateMessageRequest {
  prompt: string;
  message: string;
  history: Array<{ role: string; content: string }>;
}

export interface DebateMessageResponse {
  content: string;
  timestamp: string;
}

export interface DebateEvaluationRequest {
  prompt: string;
  response: string;
}

export interface DebateEvaluationResponse {
  evaluation: string;
  timestamp: string;
}
