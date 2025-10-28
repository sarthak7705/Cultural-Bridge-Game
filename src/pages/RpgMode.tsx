import { characterInfo, characters } from '@/constants/rpg_mode';
import { Character, GameState, GameStateContext } from '@/types/rpg';
import { Award, RefreshCw, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import CharacterSelect from '../components/rpg/CharacterSelect';
import GameConsole from '../components/rpg/GameConsole';
import { useTheme } from '../contexts/ThemeContext';
import { rpgApi } from '../services/api';

declare global {
  interface Window {
    currentGameState?: GameStateContext;
  }
}

const RpgMode = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [gameState, setGameState] = useState<GameState>({
    started: false,
    selectedCharacter: null,
    currentScene: '',
    availableActions: [],
    gameHistory: [],
    isLoading: false,
    error: null,
    evaluation: null,
    showEvaluation: false,

    chatHistory: [],
    currentRole: '',
    currentCulture: '',
    currentEra: '',
    currentTone: '',
    currentLanguage: 'English'
  });

  useEffect(() => {
    if (gameState.started) {
      window.currentGameState = {
        chatHistory: gameState.chatHistory,
        currentRole: gameState.currentRole,
        currentCulture: gameState.currentCulture,
        currentEra: gameState.currentEra,
        currentTone: gameState.currentTone,
        currentLanguage: gameState.currentLanguage
      };
    }
  }, [gameState]);


  const selectCharacter = async (character: Character) => {
    setGameState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {

      const charInfo = characterInfo[character.id] || 
        { role: 'Guide', culture: 'Global', era: 'Modern', tone: 'friendly' };
      
      const response = await rpgApi.startSession(character.id);
      
      setGameState(prev => ({
        ...prev,
        started: true,
        selectedCharacter: character,
        currentScene: response.scene,
        availableActions: response.actions || [],
        gameHistory: [response.scene],
        isLoading: false,
        evaluation: null,
        showEvaluation: false,

        currentRole: charInfo.role,
        currentCulture: charInfo.culture,
        currentEra: charInfo.era,
        currentTone: charInfo.tone,

        chatHistory: [{ 
          user: `Hello, I'd like to meet with a ${charInfo.role} from ${charInfo.culture} culture.`, 
          ai: response.scene 
        }]
      }));
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to start the game session. Please try again.'
      }));
    }
  };

  const performAction = async (actionIndex: number) => {
    if (gameState.isLoading) return;
    
    const action = gameState.availableActions[actionIndex];
    
    setGameState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const response = await rpgApi.performAction(action);
      
      setGameState(prev => {

        const updatedChatHistory = [
          ...prev.chatHistory,
          { user: action, ai: response.scene }
        ];
        
        return {
          ...prev,
          currentScene: response.scene,
          availableActions: response.actions || [],
          gameHistory: [...prev.gameHistory, `You chose: ${action}`, response.scene],
          isLoading: false,
          chatHistory: updatedChatHistory
        };
      });
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to process your action. Please try again.'
      }));
    }
  };

  const evaluateAdventure = async () => {
    setGameState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const evaluationResult = await rpgApi.evaluateSession();
      
      setGameState(prev => ({
        ...prev,
        evaluation: evaluationResult,
        showEvaluation: true,
        isLoading: false
      }));
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to evaluate your adventure. Please try again.'
      }));
    }
  };

  const toggleEvaluation = () => {
    setGameState(prev => ({
      ...prev,
      showEvaluation: !prev.showEvaluation
    }));
  };

  const resetGame = () => {
    setGameState({
      started: false,
      selectedCharacter: null,
      currentScene: '',
      availableActions: [],
      gameHistory: [],
      isLoading: false,
      error: null,
      evaluation: null,
      showEvaluation: false,
      chatHistory: [],
      currentRole: '',
      currentCulture: '',
      currentEra: '',
      currentTone: '',
      currentLanguage: 'English'
    });
    
    window.currentGameState = undefined;
  };

  const renderEvaluation = () => {
    if (!gameState.evaluation) return null;
    const { empathyScore, diplomaticSkillScore, historicalAccuracyScore, ethicalBalanceScore, totalScore, performanceLevel } = gameState.evaluation;

    return (
      <div className={`mt-6 p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Award className={`mr-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} size={20} />
            KALKI Evaluation
          </h3>
          <div className={`text-lg font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
            {performanceLevel}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-sm font-medium mb-1 opacity-70">Empathy</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{empathyScore}</span>
              <span className="text-xs opacity-70">/30</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full" 
                style={{ width: `${(empathyScore / 30) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-sm font-medium mb-1 opacity-70">Diplomatic Skill</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{diplomaticSkillScore}</span>
              <span className="text-xs opacity-70">/30</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full" 
                style={{ width: `${(diplomaticSkillScore / 30) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-sm font-medium mb-1 opacity-70">Historical Accuracy</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{historicalAccuracyScore}</span>
              <span className="text-xs opacity-70">/20</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full" 
                style={{ width: `${(historicalAccuracyScore / 20) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-sm font-medium mb-1 opacity-70">Ethical Balance</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{ethicalBalanceScore}</span>
              <span className="text-xs opacity-70">/20</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full" 
                style={{ width: `${(ethicalBalanceScore / 20) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <span className="font-medium">Total Score</span>
          <span className="text-2xl font-bold">{totalScore}/100</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-6 py-12">
        <header className="mb-12 flex flex-col items-center text-center">
          <div className={`p-4 rounded-full ${isDark ? 'bg-emerald-900 bg-opacity-30' : 'bg-emerald-100'} mb-4`}>
            <Users className={`h-8 w-8 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <h1 className="text-4xl font-bold mb-2">Role-Playing Adventure</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded mb-4"></div>
          <p className="text-lg max-w-2xl opacity-80">
            Step into a character's shoes and navigate scenarios where your choices shape the outcome
          </p>
        </header>

        {!gameState.started ? (
          <div className="max-w-6xl mx-auto">
            <CharacterSelect 
              characters={characters} 
              onSelect={selectCharacter} 
              isLoading={gameState.isLoading}
              error={gameState.error}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className={`mb-8 p-6 rounded-2xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={gameState.selectedCharacter?.avatarUrl} 
                      alt={gameState.selectedCharacter?.name} 
                      className="w-16 h-16 rounded-xl object-cover shadow-md"
                    />
                    <div className="absolute -bottom-2 -right-2 p-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{gameState.selectedCharacter?.name}</h3>
                    <div className="flex items-center text-sm">
                      <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-medium`}>
                        {gameState.selectedCharacter?.role}
                      </span>
                      <span className={`mx-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {gameState.currentCulture}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {gameState.chatHistory.length > 1 && (
                    <button
                      onClick={gameState.evaluation ? toggleEvaluation : evaluateAdventure}
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                        ${isDark ? 'bg-amber-700 hover:bg-amber-600 text-white' : 'bg-amber-100 hover:bg-amber-200 text-amber-800'}
                        transition-all transform hover:shadow
                      `}
                      disabled={gameState.isLoading}
                    >
                      <Award size={16} />
                      <span>{gameState.evaluation ? (gameState.showEvaluation ? 'Hide' : 'Show') + ' Evaluation' : 'Evaluate Adventure'}</span>
                    </button>
                  )}
                  <button
                    onClick={resetGame}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                      ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
                      transition-all transform hover:shadow
                    `}
                  >
                    <RefreshCw size={16} />
                    <span>New Adventure</span>
                  </button>
                </div>
              </div>
              
              <GameConsole 
                gameHistory={gameState.gameHistory}
                availableActions={gameState.availableActions}
                onAction={performAction}
                isLoading={gameState.isLoading}
                error={gameState.error}
              />

              {gameState.showEvaluation && renderEvaluation()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RpgMode;