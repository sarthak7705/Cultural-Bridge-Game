import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'} transition-colors duration-300`}>
      <Navbar />
      <div className="flex">
        <main className="flex-1 p-4 md:p-8 mx-auto max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;