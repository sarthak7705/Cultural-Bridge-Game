import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Spinner from '../ui/Spinner';

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarUrl: string;
}

interface CharacterSelectProps {
  characters: Character[];
  onSelect: (character: Character) => void;
  isLoading: boolean;
  error: string | null;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ 
  characters, 
  onSelect, 
  isLoading,
  error
}) => {
  const { theme } = useTheme();

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold">Choose Your Character</h2>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Select a character to begin your journey
        </p>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {characters.map((character) => (
            <div 
              key={character.id}
              className={`
                rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105
                ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'}
              `}
            >
              <img 
                src={character.avatarUrl} 
                alt={character.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{character.name}</h3>
                <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {character.role}
                </p>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {character.description}
                </p>
                <button
                  onClick={() => onSelect(character)}
                  disabled={isLoading}
                  className={`
                    w-full py-2 rounded-lg font-medium
                    ${isLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90'}
                    transition-colors
                  `}
                >
                  {isLoading ? <Spinner size="sm" /> : 'Select Character'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;