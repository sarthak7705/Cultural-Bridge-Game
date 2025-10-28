import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { RefreshCw, Send, AlertTriangle, ThumbsUp } from 'lucide-react';
import Spinner from '../ui/Spinner';

interface Scenario {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface KalkiScore {
  empathy: number;
  diplomacy: number;
  history: number;
  ethics: number;
  total: number;
}

interface ConflictSimulatorProps {
  scenario: Scenario;
  role: Role;
  tensionLevel: number;
  history: Array<{message: string; author: string}>;
  kalkiScore: KalkiScore | null;
  onSubmitResponse: (response: string) => void;
  onReset: () => void;
  isLoading: boolean;
  error: string | null;
}

const ConflictSimulator: React.FC<ConflictSimulatorProps> = ({
  scenario,
  role,
  tensionLevel,
  history,
  kalkiScore,
  onSubmitResponse,
  onReset,
  isLoading,
  error
}) => {
  const { theme } = useTheme();
  const [response, setResponse] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim() && !isLoading) {
      onSubmitResponse(response);
      setResponse('');
    }
  };

  const getTensionColor = () => {
    if (tensionLevel < 30) return theme === 'dark' ? 'text-green-400' : 'text-green-600';
    if (tensionLevel < 70) return theme === 'dark' ? 'text-amber-400' : 'text-amber-600';
    return theme === 'dark' ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} mb-6`}>
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-center`}>
            <div>
              <h2 className="text-xl font-semibold">{scenario.title}</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                You are: {role.name}
              </p>
            </div>
            <button
              onClick={onReset}
              className={`
                p-2 rounded-md 
                ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}
                transition-colors
              `}
              title="Reset Simulation"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-center">
              <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <div className={`h-96 overflow-y-auto p-4 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={index} className={`${entry.author === 'user' ? 'text-right' : ''}`}>
                  <div 
                    className={`
                      inline-block max-w-[90%] rounded-lg px-4 py-2
                      ${entry.author === 'user' 
                        ? theme === 'dark' 
                          ? 'bg-amber-800/30 text-amber-100' 
                          : 'bg-amber-100 text-amber-800'
                        : theme === 'dark'
                          ? 'bg-slate-700 text-white' 
                          : 'bg-white text-gray-800 border border-gray-200'}
                    `}
                  >
                    {entry.message.split('\n').map((paragraph, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-center py-2">
                  <Spinner size="md" />
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          </div>
          
          <div className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="flex items-start space-x-2">
                <textarea 
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your diplomatic response..."
                  className={`
                    flex-1 p-3 rounded-lg resize-none
                    ${theme === 'dark' 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'}
                    border focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50
                    focus:border-amber-500 transition-colors
                  `}
                  rows={3}
                  disabled={isLoading}
                />
                <button
                  title='submit-title'
                  type="submit"
                  disabled={isLoading || !response.trim()}
                  className={`
                    p-3 rounded-lg
                    ${isLoading || !response.trim() 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90'}
                    transition-colors
                  `}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} mb-6 sticky top-4`}>
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            <h2 className="text-xl font-semibold">Scenario Details</h2>
          </div>
          
          <div className="p-4">
            <div className="mb-6">
              <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Tension Level
              </h3>
              <div className="mb-2 flex justify-between items-center">
                <span className={`text-2xl font-bold ${getTensionColor()}`}>{tensionLevel}%</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tensionLevel < 30 ? 'Low Tension' : tensionLevel < 70 ? 'Moderate Tension' : 'High Tension'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    tensionLevel < 30 
                      ? 'bg-green-500' 
                      : tensionLevel < 70 
                        ? 'bg-amber-500' 
                        : 'bg-red-500'
                  }`} 
                  style={{ width: `${tensionLevel}%` }}
                ></div>
              </div>
            </div>
            
            {kalkiScore && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    KALKI Score
                  </h3>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                    {kalkiScore.total}/100
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Empathy</span>
                      <span className="text-xs font-medium">{kalkiScore.empathy}/30</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(kalkiScore.empathy / 30) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Diplomacy</span>
                      <span className="text-xs font-medium">{kalkiScore.diplomacy}/30</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(kalkiScore.diplomacy / 30) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Historical Accuracy</span>
                      <span className="text-xs font-medium">{kalkiScore.history}/20</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(kalkiScore.history / 20) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ethical Balance</span>
                      <span className="text-xs font-medium">{kalkiScore.ethics}/20</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(kalkiScore.ethics / 20) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                
                {kalkiScore.total >= 80 && (
                  <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${theme === 'dark' ? 'bg-green-800/30 text-green-200' : 'bg-green-100 text-green-800'}`}>
                    <ThumbsUp size={16} />
                    <span className="text-sm">Excellent diplomacy skills!</span>
                  </div>
                )}
              </div>
            )}
            
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                About This Scenario
              </h3>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {scenario.description}
              </p>
              <div className={`text-xs p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <p className="font-medium mb-1">Tips for {role.name}:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Listen carefully to opposing viewpoints</li>
                  <li>Acknowledge historical context</li>
                  <li>Focus on shared interests</li>
                  <li>Consider long-term implications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictSimulator;