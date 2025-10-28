import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Scenario {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ScenarioSelectProps {
  scenarios: Scenario[];
  onSelect: (scenario: Scenario) => void;
}

const ScenarioSelect: React.FC<ScenarioSelectProps> = ({ scenarios, onSelect }) => {
  const { theme } = useTheme();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'medium':
        return theme === 'dark' ? 'text-amber-400' : 'text-amber-600';
      case 'hard':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      default:
        return '';
    }
  };

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold">Choose a Scenario</h2>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Select a historical or modern conflict to explore
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {scenarios.map((scenario) => (
          <div 
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            className={`
              flex flex-col cursor-pointer rounded-xl overflow-hidden shadow-md
              ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-50'}
              transition-all duration-300 hover:shadow-lg
            `}
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={scenario.imageUrl} 
                alt={scenario.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{scenario.title}</h3>
                <span className={`text-sm font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                  {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                </span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {scenario.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <button
                  className={`
                    w-full py-2 rounded-lg font-medium
                    bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90
                    transition-opacity
                  `}
                >
                  Select Scenario
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioSelect;