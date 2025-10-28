import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, RefreshCcw, Share2, Sparkles, Bookmark, Book } from 'lucide-react';
import { storyApi } from '../services/api';
import StoryDisplay from '../components/story/StoryDisplay';
import StoryInput from '../components/story/StoryInput';
import { SUGGESTED_CULTURES, SUGGESTED_THEMES, TONES, LANGUAGES } from '@/constants/story';
import { StoryState, StoryParams } from '@/types/story';

const StoryMode: React.FC = () => {
  const { theme } = useTheme();
  const [storyState, setStoryState] = useState<StoryState>({
    isLoading: false,
    storyText: '',
    storyHistory: [],
    error: null
  });
  const [storyParams, setStoryParams] = useState<StoryParams>({
    culture: '',
    theme: '',
    max_length: 800,
    language: 'English',
    tone: 'adventurous'
  });
  const [activeTab, setActiveTab] = useState('culture');

  const handleParamChange = (param: keyof StoryParams, value: string | number) => {
    setStoryParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const selectSuggestion = (param: 'culture' | 'theme', value: string) => {
    setStoryParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const startNewStory = async () => {
    if (!storyParams.culture.trim()) return;
    
    setStoryState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const enhancedParams = {
        ...storyParams,
        theme: storyParams.theme || 'adventure'
      };
      
      const response = await storyApi.startStory(enhancedParams);
      
      setStoryState(prev => ({
        ...prev,
        isLoading: false,
        storyText: response.story,
        storyHistory: [response.story]
      }));
    } catch (error) {
      setStoryState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to start the story. Please try again.'
      }));
    }
  };

  const continueStory = async (userInput: string) => {
    if (!userInput.trim()) return;
    
    setStoryState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const continuationParams = {
        ...storyParams,
        theme: userInput
      };
      
      const response = await storyApi.startStory(continuationParams);
      
      setStoryState(prev => ({
        ...prev,
        isLoading: false,
        storyText: prev.storyText + '\n\n' + response.story,
        storyHistory: [...prev.storyHistory, response.story]
      }));
    } catch (error) {
      setStoryState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to continue the story. Please try again.'
      }));
    }
  };

  const resetStory = () => {
    setStoryState({
      isLoading: false,
      storyText: '',
      storyHistory: [],
      error: null
    });
  };

  const renderStoryForm = () => (
    <div className={`rounded-xl shadow-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} mb-6 overflow-hidden`}>
      <div className={`flex border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
        <button 
          className={`px-4 py-3 flex items-center space-x-2 ${
            activeTab === 'culture' 
              ? theme === 'dark' 
                ? 'border-b-2 border-blue-400 text-blue-400' 
                : 'border-b-2 border-blue-600 text-blue-600'
              : ''
          }`}
          onClick={() => setActiveTab('culture')}
        >
          <Book size={18} />
          <span>Culture</span>
        </button>
        <button 
          className={`px-4 py-3 flex items-center space-x-2 ${
            activeTab === 'theme' 
              ? theme === 'dark' 
                ? 'border-b-2 border-blue-400 text-blue-400' 
                : 'border-b-2 border-blue-600 text-blue-600'
              : ''
          }`}
          onClick={() => setActiveTab('theme')}
        >
          <Sparkles size={18} />
          <span>Theme</span>
        </button>
        <button 
          className={`px-4 py-3 flex items-center space-x-2 ${
            activeTab === 'settings' 
              ? theme === 'dark' 
                ? 'border-b-2 border-blue-400 text-blue-400' 
                : 'border-b-2 border-blue-600 text-blue-600'
              : ''
          }`}
          onClick={() => setActiveTab('settings')}
        >
          <Bookmark size={18} />
          <span>Settings</span>
        </button>
      </div>
      
      <div className="p-6">
        {activeTab === 'culture' && (
          <div>
            <label className="block text-lg font-medium mb-2">Select a Cultural Background</label>
            <input
              type="text"
              className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-300'} border mb-4`}
              value={storyParams.culture}
              onChange={(e) => handleParamChange('culture', e.target.value)}
              placeholder="Enter a culture (e.g. Japanese, Celtic, African)"
            />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Popular Choices</h3>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_CULTURES.map(culture => (
                  <button
                    key={culture}
                    onClick={() => selectSuggestion('culture', culture)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      storyParams.culture === culture
                        ? theme === 'dark' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-500 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-700 hover:bg-slate-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {culture}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'theme' && (
          <div>
            <label className="block text-lg font-medium mb-2">Choose a Story Theme</label>
            <input
              type="text"
              className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-300'} border mb-4`}
              value={storyParams.theme}
              onChange={(e) => handleParamChange('theme', e.target.value)}
              placeholder="Enter a theme (e.g. adventure, mystery, coming of age)"
            />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Inspiring Themes</h3>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_THEMES.map(themeOption => (
                  <button
                    key={themeOption}
                    onClick={() => selectSuggestion('theme', themeOption)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      storyParams.theme === themeOption
                        ? theme === 'dark' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-500 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-700 hover:bg-slate-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {themeOption}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Story Tone</label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(toneOption => (
                  <button
                    key={toneOption.value}
                    onClick={() => handleParamChange('tone', toneOption.value)}
                    className={`py-2 px-4 rounded-md text-sm ${
                      storyParams.tone === toneOption.value
                        ? theme === 'dark' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-500 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-700 hover:bg-slate-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {toneOption.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                title='language'
                className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-300'} border`}
                value={storyParams.language}
                onChange={(e) => handleParamChange('language', e.target.value)}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Story Length: {storyParams.max_length} words
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs">Short</span>
                <input
                  title='range'
                  type="range"
                  className="flex-grow"
                  min="300"
                  max="2000"
                  step="100"
                  value={storyParams.max_length}
                  onChange={(e) => handleParamChange('max_length', parseInt(e.target.value, 10))}
                />
                <span className="text-xs">Long</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <button
            onClick={startNewStory}
            disabled={storyState.isLoading || !storyParams.culture.trim()}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
              storyState.isLoading || !storyParams.culture.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            } text-white font-medium transition-colors`}
          >
            <Sparkles size={18} />
            <span>{storyState.isLoading ? 'Crafting Your Story...' : 'Begin Your Journey'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            <BookOpen className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h1 className="text-3xl font-bold">Storyteller</h1>
        </div>
        <p className="text-lg max-w-3xl">
          Embark on a journey through time, culture, and imagination with AI-crafted tales that respond to your choices.
        </p>
      </header>

      {!storyState.storyText && renderStoryForm()}

      {storyState.storyText && (
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} mb-6`}>
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-center`}>
            <div>
              <h2 className="text-xl font-semibold">{storyParams.culture} Tale</h2>
              <div className="text-sm opacity-70 flex space-x-2 mt-1">
                <span>{storyParams.language}</span>
                <span>•</span>
                <span className="capitalize">{storyParams.tone}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={resetStory}
                className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors`}
                title="Start New Story"
              >
                <RefreshCcw size={18} />
              </button>
              <button 
                className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors`}
                title="Share Story"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
          
          <StoryDisplay 
            storyText={storyState.storyText} 
            isLoading={storyState.isLoading} 
            error={storyState.error}
          />
        </div>
      )}

      {storyState.storyText && (
        <StoryInput 
          onStartStory={() => {}}
          onContinueStory={continueStory} 
          isLoading={storyState.isLoading}
          storyStarted={true}
        />
      )}
    </div>
  );
};

export default StoryMode;