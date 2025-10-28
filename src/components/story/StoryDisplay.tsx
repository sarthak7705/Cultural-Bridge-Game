import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Spinner from '../ui/Spinner';

interface StoryDisplayProps {
  storyText: string;
  isLoading: boolean;
  error: string | null;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ storyText, isLoading, error }) => {
  const { theme } = useTheme();

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!storyText && !isLoading) {
    return (
      <div className="p-10 text-center">
        <p className={`italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Your story will appear here. Start by entering a prompt below.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="prose max-w-none" style={{ whiteSpace: 'pre-wrap' }}>
        {storyText.split('\n').map((paragraph, idx) => (
          <p key={idx} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            {paragraph}
          </p>
        ))}
      </div>
      
      {isLoading && (
        <div className="flex justify-center mt-4">
          <Spinner size="md" />
        </div>
      )}
    </div>
  );
};

export default StoryDisplay;