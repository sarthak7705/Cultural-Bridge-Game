import { BookOpen, MessageCircle, Scale, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  
  const modes = [
    {
      id: 'story',
      title: 'Story Mode',
      subtitle: 'RAG-powered narrative',
      description: 'Explore immersive storytelling with AI-driven narrative generation.',
      icon: <BookOpen size={24} />,
      color: 'from-indigo-500 to-purple-600',
      path: '/story'
    },
    {
      id: 'rpg',
      title: 'Role-Playing',
      subtitle: 'Interactive storytelling',
      description: 'Assume a persona and make choices that impact the narrative flow.',
      icon: <Users size={24} />,
      color: 'from-emerald-500 to-green-600',
      path: '/rpg'
    },
    {
      id: 'conflict',
      title: 'Conflict Resolution',
      subtitle: 'Diplomatic simulation',
      description: 'Engage in diplomatic simulations with real-world cultural context.',
      icon: <Scale size={24} />,
      color: 'from-amber-500 to-yellow-600',
      path: '/conflict'
    },
    {
      id: 'debate',
      title: 'Debate Mode',
      subtitle: 'Ethical discussions',
      description: 'Analyze and argue ethical dilemmas across cultural perspectives.',
      icon: <MessageCircle size={24} />,
      color: 'from-rose-500 to-pink-600',
      path: '/debate'
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cultural Bridge</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-80">
            Explore storytelling, diplomacy, and ethical reasoning across cultural contexts
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {modes.map((mode) => (
            <div 
              key={mode.id}
              onClick={() => navigate(mode.path)}
              className={`
                cursor-pointer rounded-2xl overflow-hidden shadow-lg border 
                ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'}
                transition duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl
              `}
            >
              <div className={`p-6`}>
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-xl mr-4 bg-gradient-to-br ${mode.color} text-white`}>
                    {mode.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{mode.title}</h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{mode.subtitle}</p>
                  </div>
                </div>
                
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 text-sm`}>
                  {mode.description}
                </p>
                
                <div className="flex justify-end">
                  <button 
                    className={`
                      px-5 py-2 rounded-lg font-medium text-white
                      bg-gradient-to-r ${mode.color} 
                      hover:opacity-90 transition-all shadow-md
                    `}
                  >
                    Start Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;