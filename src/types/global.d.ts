
interface GameStateContext {
    chatHistory: Array<{user: string, ai: string}>;
    currentRole: string;
    currentCulture: string;
    currentEra: string;
    currentTone: string;
    currentLanguage: string;
  }
  
  declare global {
    interface Window {
      currentGameState?: GameStateContext;
    }
  }
  
 export {};