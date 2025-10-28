import React, { useState } from 'react';
import { Send, Play } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface StoryInputProps {
  onStartStory: (prompt: string) => void;
  onContinueStory: (input: string) => void;
  isLoading: boolean;
  storyStarted: boolean;
}

const StoryInput: React.FC<StoryInputProps> = ({ 
  onStartStory, 
  onContinueStory, 
  isLoading,
  storyStarted
}) => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputText.trim() && !isLoading) {
      if (storyStarted) {
        onContinueStory(inputText);
      } else {
        onStartStory(inputText);
      }
      setInputText('');
    }
  };

  return (
    <div className={`rounded-xl shadow-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} p-4`}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-3">
          <label 
            htmlFor="storyInput" 
            className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {storyStarted ? 'What happens next?' : 'Start your story'}
          </label>
          <textarea
            id="storyInput"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={storyStarted 
              ? "Continue the narrative... What do you do next?" 
              : "Enter a story prompt, setting, or character description..."}
            rows={3}
            className={`w-full p-3 rounded-lg ${
              theme === 'dark' 
                ? 'bg-slate-700 text-white border-slate-600 focus:border-blue-500' 
                : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
            } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
              ${isLoading || !inputText.trim() 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:opacity-90'}
              transition-colors
            `}
          >
            {storyStarted ? (
              <>
                <Send size={16} />
                <span>Continue</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Begin Story</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoryInput;