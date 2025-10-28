export interface StoryState {
  isLoading: boolean;
  storyText: string;
  storyHistory: string[];
  error: string | null;
}

export interface StoryParams {
  culture: string;
  theme: string;
  max_length: number;
  language: string;
  tone: string;
}