import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Users, Scale, MessageCircle, Home } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/story', icon: <BookOpen size={20} />, label: 'Story Mode' },
    { path: '/rpg', icon: <Users size={20} />, label: 'RPG Mode' },
    { path: '/conflict', icon: <Scale size={20} />, label: 'Conflict Resolution' },
    { path: '/debate', icon: <MessageCircle size={20} />, label: 'Debate Mode' },
  ];

  return (
    <aside className={`hidden md:block w-64 h-[calc(100vh-4rem)] ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-md transition-colors duration-300`}>
      <div className="h-full py-6 px-3 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 text-base font-normal rounded-lg transition duration-150 ease-in-out ${
                    isActive 
                      ? theme === 'dark' 
                        ? 'bg-blue-900/50 text-blue-200' 
                        : 'bg-blue-100 text-blue-700'
                      : theme === 'dark'
                        ? 'text-gray-200 hover:bg-slate-700'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;