import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Spinner from '../ui/Spinner';

interface GameConsoleProps {
  gameHistory: string[];
  availableActions: string[];
  onAction: (actionIndex: number) => void;
  isLoading: boolean;
  error: string | null;
}

const GameConsole: React.FC<GameConsoleProps> = ({ 
  gameHistory, 
  availableActions, 
  onAction,
  isLoading,
  error
}) => {
  const { theme } = useTheme();
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gameHistory, isLoading]);

  const formatText = (text: string, isAction: boolean = false) => {
    if (isAction) {
      return (
        <div className={`py-2 px-3 my-2 rounded-lg text-sm ${
          theme === 'dark' ? 'bg-slate-700 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
        }`}>
          {text}
        </div>
      );
    }
    
    return text.split('\n').map((paragraph, idx) => (
      <p key={idx} className="mb-2">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold">Game Console</h2>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      <div className={`h-80 overflow-y-auto p-4 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="space-y-4">
          {gameHistory.map((entry, index) => (
            <div key={index} className={
              entry.startsWith('You chose:') 
                ? 'text-right' 
                : ''
            }>
              {formatText(entry, entry.startsWith('You chose:'))}
            </div>
          ))}
        </div>
        
        {isLoading && (
          <div className="flex justify-center my-4">
            <Spinner size="md" />
          </div>
        )}
        
        <div ref={consoleEndRef} />
      </div>
      
      <div className="p-4">
        <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Available Actions:
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableActions.map((action, index) => (
            <button
              key={index}
              onClick={() => onAction(index)}
              disabled={isLoading}
              className={`
                py-2 px-4 rounded-lg text-left transition-colors
                ${isLoading 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : theme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'}
              `}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameConsole;