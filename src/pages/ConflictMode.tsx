import { roles, scenarios } from '@/constants/senarios';
import { ConflictState, Role, Scenario } from '@/types/conflict';
import { Scale } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import ScenarioSelect from '../components/conflict/ScenarioSelect';
import { useTheme } from '../contexts/ThemeContext';
import { conflictApi } from '../services/api';
import ConflictResolutionUI, { ConflictResolutionData } from './ConflictUI';

const ConflictMode: React.FC = () => {
  const { theme } = useTheme();
  const [conflictState, setConflictState] = useState<ConflictState>({
    selectedScenario: null,
    selectedRole: null,
    tensionLevel: 50,
    currentPrompt: '',
    history: [],
    kalkiScore: null,
    isLoading: false,
    error: null
  });

  const [data, setData] = useState<ConflictResolutionData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [chatHistory, setChatHistory] = useState<Array<{ user: string, ai: string }>>([]);

  const selectScenario = useCallback((scenario: Scenario) => {
    setConflictState(prev => ({
      ...prev,
      selectedScenario: scenario
    }));
  }, []);

  // Helper function to map role names to valid API role types
  const mapRoleToAPIRole = (roleId: string): string => {
    // Map based on faction/position to standard role types accepted by the API
    switch (roleId) {
      case "side_a":
        return "diplomat"; // Side A Representative as diplomat
      case "side_b":
        return "diplomat"; // Side B Representative as diplomat
      case "neutral":
        return "mediator"; // Neutral Mediator as mediator
      default:
        return "diplomat"; // Default fallback
    }
  };

  const selectRole = useCallback(async (role: Role) => {
    if (!conflictState.selectedScenario) return;
    
    setConflictState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // Map the scenario ID to the conflict_type expected by the API
      const conflictType = conflictState.selectedScenario.id;
      // Map the role ID to player_faction
      const playerFaction = role.id; // Assuming role.id is one of: "side_a", "side_b", "neutral"
      // Map to an accepted role type from the enum: 'mediator', 'diplomat', 'citizen', 'activist', 'politician'
      const playerRole = mapRoleToAPIRole(role.id);
      
      const response = await conflictApi.startScenario(
        conflictType,
        playerRole,
        playerFaction,
        50 // Initial tension level
      );

      setSessionId(response.session_id);
      setData(response);
      setCurrentStage(response.current_stage);

      setConflictState(prev => ({
        ...prev,
        selectedRole: role,
        currentPrompt: response.response,
        tensionLevel: response.tension_level,
        history: [{ message: response.response, author: 'system' }],
        isLoading: false
      }));
    } catch (error) {
      setConflictState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to start the scenario. Please try again.'
      }));
    }
  }, [conflictState.selectedScenario]);

  const submitResponse = useCallback(async (userInput: string) => {
    if (!userInput.trim() || conflictState.isLoading || !sessionId || !conflictState.selectedScenario || !conflictState.selectedRole) return;

    setConflictState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      history: [...prev.history, { message: userInput, author: 'user' }]
    }));

    try {
      // Create a properly formatted chat history entry for this interaction
      const newHistoryEntry = {
        user: userInput,
        ai: conflictState.currentPrompt || ""
      };
      
      // For the first response, we send an empty chat history
      // For subsequent responses, we add to the existing chat history
      const updatedHistory = chatHistory.length > 0 ? 
        [...chatHistory, newHistoryEntry] : 
        [newHistoryEntry];
      
      // Use the same mapping function for consistent role values
      const playerRole = mapRoleToAPIRole(conflictState.selectedRole.id);
      
      const apiResponse = await conflictApi.continueScenario(
        userInput,
        sessionId,
        updatedHistory,
        conflictState.tensionLevel,
        currentStage,
        conflictState.selectedScenario.id,
        playerRole,
        conflictState.selectedRole.id
      );
      
      setData(apiResponse);
      setCurrentStage(apiResponse.current_stage);
      
      // Update chat history with the latest exchange
      setChatHistory(updatedHistory);

      setConflictState(prev => ({
        ...prev,
        tensionLevel: apiResponse.tension_level,
        currentPrompt: apiResponse.response,
        history: [...prev.history, { message: apiResponse.response, author: 'system' }],
        kalkiScore: apiResponse.kalki_score !== null ? {
          empathy: apiResponse.kalki_score.empathy || 0,
          diplomacy: apiResponse.kalki_score.diplomatic_skill || 0,
          history: apiResponse.kalki_score.historical_accuracy || 0,
          ethics: apiResponse.kalki_score.ethical_balance || 0,
          total: apiResponse.kalki_score.total_score || 0
        } : prev.kalkiScore,
        isLoading: false
      }));
    } catch (error) {
      setConflictState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to process your response. Please try again.'
      }));
    }
  }, [conflictState.isLoading, conflictState.history, sessionId, chatHistory, currentStage, conflictState.tensionLevel, conflictState.selectedScenario, conflictState.selectedRole, conflictState.currentPrompt]);

  const resetScenario = useCallback(() => {
    setConflictState({
      selectedScenario: null,
      selectedRole: null,
      tensionLevel: 50,
      currentPrompt: '',
      history: [],
      kalkiScore: null,
      isLoading: false,
      error: null
    });
    setData(null);
    setSessionId(null);
    setCurrentStage(0);
    setChatHistory([]);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Scale className={`h-8 w-8 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
          <h1 className="text-3xl font-bold">Conflict Resolution</h1>
        </div>
        <p className="text-lg max-w-3xl">
          Engage in diplomatic simulations based on real-world scenarios. Your decisions impact the tension level and resolution outcomes.
        </p>
      </header>

      {conflictState.error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{conflictState.error}</p>
        </div>
      )}

      {!conflictState.selectedScenario ? (
        <ScenarioSelect
          scenarios={scenarios}
          onSelect={selectScenario}
        />
      ) : !conflictState.selectedRole ? (
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} mb-6`}>
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            <h2 className="text-xl font-semibold">Choose Your Role</h2>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Select the perspective you want to take in this scenario
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`
                      rounded-lg p-4 cursor-pointer transition-colors
                      ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'}
                    `}
                  onClick={() => selectRole(role)}
                >
                  <h3 className="text-lg font-bold mb-2">{role.name}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {role.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={resetScenario}
                className={`
                    px-4 py-2 rounded-lg font-medium
                    ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}
                    transition-colors
                  `}
              >
                Back to Scenarios
              </button>
            </div>
          </div>
        </div>
      ) : conflictState.isLoading && !data ? (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading conflict interface...</p>
        </div>
      ) : data ? (
        <ConflictResolutionUI 
          data={data} 
          onSubmitResponse={submitResponse}
        />
      ) : (
        <div className="text-center text-red-500 p-8">
          <p className="text-xl mb-4">Something went wrong. Please try again.</p>
          <button
            onClick={resetScenario}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset Scenario
          </button>
        </div>
      )}
    </div>
  );
};

export default ConflictMode;