import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className={`max-w-md mx-auto mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button
        onClick={() => navigate('/')}
        className={`
          inline-flex items-center px-4 py-2 rounded-lg font-medium
          ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
          text-white transition-colors
        `}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;