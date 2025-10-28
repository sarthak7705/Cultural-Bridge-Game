import { characterMap } from "@/constants/rpg_mode";
import {
  DebatePromptResponse,
  DebateMessageResponse,
  DebateEvaluationResponse,
} from "@/types/debate";
import { EvaluationRequest, EvaluationResponse } from "@/types/rpg";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

interface StoryRequest {
  culture: string;
  theme?: string;
  max_length?: number;
  language?: string;
  tone?: string;
}

interface StoryResponse {
  story: string;
  character_count: number;
  language: string;
  metadata: Record<string, any>;
  used_rag: boolean;
  reference_count: number;
  actions : string[];
}

interface ChatHistoryTurn {
  user: string;
  ai: string;
}

interface RolePlayRequest {
  role: string;
  culture: string;
  era: string;
  tone: string;
  language: string;
  include_emotion: boolean;
  user_input: string;
  chat_history: ChatHistoryTurn[];
}

// interface StoryResponseRPG {
//   story: string;
//   character_count: number;
//   language: string;
//   metadata: {
//     mode: string;
//     culture: string;
//     role: string;
//     era: string;
//     tone: string;
//     language: string;
//   };
//   used_rag: boolean;
//   reference_count: number;
// }

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const storyApi = {
  startStory: async (storyRequest: StoryRequest): Promise<StoryResponse> => {
    const enhancedRequest: StoryRequest = {
      ...storyRequest,
      tone: storyRequest.tone || "adventurous",
      max_length: Math.max(storyRequest.max_length || 800, 300),
    };

    const response = await api.post("/story", enhancedRequest);
    return response.data;
  },

  continueStory: async (
    userInput: string,
    currentStory: string
  ): Promise<StoryResponse> => {
    const keywords = userInput.split(" ");
    const possibleCulture = keywords[0];

    const continuationRequest: StoryRequest = {
      culture: possibleCulture.length > 3 ? possibleCulture : "General",
      theme: userInput,
      max_length: 500,
      language: "English",
      tone: "adventurous",
    };

    const response = await api.post("/story", continuationRequest);
    return response.data;
  },
};

export const rpgApi = {
  startSession: async (characterId: string) => {
    const charParams = characterMap[characterId] || {
      role: "Guide",
      culture: "Global",
      era: "Modern",
      tone: "friendly",
      language: "English",
    };

    const initialPrompt = `You meet a ${charParams.role} from ${charParams.culture} culture. How do you wish to begin your journey?`;

    const payload: RolePlayRequest = {
      ...charParams,
      include_emotion: true,
      user_input: initialPrompt,
      chat_history: [],
    };

    const response = await api.post<StoryResponse>("/rpg_mode", payload);

    return {
      scene: response.data.story,
      actions: response.data.actions
    };
  },

  performAction: async (action: string) => {
    const gameState = window.currentGameState || {
      chatHistory: [],
      currentRole: "Guide",
      currentCulture: "Global",
      currentEra: "Modern",
      currentTone: "friendly",
      currentLanguage: "English",
    };

    const payload: RolePlayRequest = {
      role: gameState.currentRole,
      culture: gameState.currentCulture,
      era: gameState.currentEra,
      tone: gameState.currentTone,
      language: gameState.currentLanguage,
      include_emotion: true,
      user_input: action,
      chat_history: gameState.chatHistory || [],
    };

    const response = await api.post<StoryResponse>("/rpg_mode", payload);

    return {
      scene: response.data.story,
      actions: response.data.actions,
    };
  },
  
  evaluateSession: async () => {
    const gameState = window.currentGameState || {
      chatHistory: [],
      currentRole: "Guide",
      currentCulture: "Global",
      currentEra: "Modern",
      currentTone: "friendly",
      currentLanguage: "English",
    };
    
    const formattedChatHistory = gameState.chatHistory.map(chat => ({
      user: chat.user,
      ai: chat.ai
    }));
    
    const payload: EvaluationRequest = {
      chat_history: formattedChatHistory
    };
    
    const response = await api.post<EvaluationResponse>("/rpg_evaluate", payload);
    
    return {
      empathyScore: response.data.empathy_score,
      diplomaticSkillScore: response.data.diplomatic_skill_score,
      historicalAccuracyScore: response.data.historical_accuracy_score,
      ethicalBalanceScore: response.data.ethical_balance_score,
      totalScore: response.data.total_score,
      performanceLevel: calculatePerformanceLevel(response.data.total_score)
    };
  }
};

function calculatePerformanceLevel(totalScore: number): string {
  if (totalScore >= 90) return "Master Diplomat";
  if (totalScore >= 75) return "Skilled Negotiator";
  if (totalScore >= 60) return "Competent Mediator";
  if (totalScore >= 45) return "Developing Peacemaker";
  return "Novice";
}

// export const conflictApi = {
//   startScenario: async (scenarioId: string, roleId: string) => {
//     const response = await api.post("/conflict_resolution", {
//         scenario_id: scenarioId,
//         role_id: roleId,
//         action: "start",
//       });
//       return response.data;
//     },

//     submitResponse: async (response: string,sessionId : string) => {
//       const result = await api.post("/conflict_resolution", {
//         response,
//         action: "respond",
//         session_id : sessionId
//     });
//     return result.data;
//   },
// };

export const conflictApi = {
  startScenario: async (
    conflictType: string,
    playerRole: string,
    playerFaction: string,
    initialTension: number = 50
  ) => {
    const response = await api.post("/start-conflict", {
      conflict_type: conflictType,
      player_role: playerRole,
      player_faction: playerFaction,
      tension_level: initialTension,
      user_input: "Let's begin the conflict resolution scenario.",
      chat_history: [],
      current_stage: 0
    });
    return response.data;
  },

  continueScenario: async (
    userInput: string,
    sessionId: string,
    chatHistory: Array<{ user: string, ai: string }>,
    tensionLevel: number,
    currentStage: number,
    conflictType: string,
    playerRole: string,
    playerFaction: string
  ) => {
    // Ensure chat history is in the correct format expected by the backend
    const formattedChatHistory = chatHistory.map(turn => ({
      user: turn.user,
      ai: turn.ai
    }));
    
    const result = await api.post("/continue-conflict", {
      session_id: sessionId,
      user_input: userInput,
      chat_history: formattedChatHistory,
      tension_level: tensionLevel,
      current_stage: currentStage,
      conflict_type: conflictType,
      player_role: playerRole,
      player_faction: playerFaction
    });
    return result.data;
  }
};

export const debateApi = {
  getPrompt: async (): Promise<DebatePromptResponse> => {
    const response = await api.get("/debate/prompt");
    return response.data;
  },

  sendMessage: async (
    prompt: string,
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<DebateMessageResponse> => {
    const response = await api.post("/debate/message", {
      prompt,
      message,
      history,
    });
    return response.data;
  },

  evaluateDebate: async (
    prompt: string,
    argument: string
  ): Promise<DebateEvaluationResponse> => {
    const response = await api.post("/debate/evaluate", {
      prompt,
      user_response : argument,
    });
    return response.data;
  },
};

export default api;
