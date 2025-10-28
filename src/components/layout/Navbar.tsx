import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const baseLinkStyles = `block px-4 py-2 rounded-xl text-base font-medium transition-colors duration-200`;
  const linkTheme = theme === 'dark'
    ? 'text-white hover:bg-slate-700'
    : 'text-gray-800 hover:bg-gray-100';

  return (
    <nav className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Globe className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Cultural Bridge
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`${baseLinkStyles} ${linkTheme}`}>Dashboard</Link>
            <Link to="/story" className={`${baseLinkStyles} ${linkTheme}`}>Story Mode</Link>
            <Link to="/rpg" className={`${baseLinkStyles} ${linkTheme}`}>RPG Mode</Link>
            <Link to="/conflict" className={`${baseLinkStyles} ${linkTheme}`}>Conflict Resolution</Link>
            <Link to="/debate" className={`${baseLinkStyles} ${linkTheme}`}>Debate Mode</Link>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-200 ${
                theme === 'dark' ? 'bg-slate-700 text-yellow-300' : 'bg-gray-200 text-slate-700'
              }`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className={`p-2 mr-2 rounded-full transition-all duration-200 ${
                theme === 'dark' ? 'bg-slate-700 text-yellow-300' : 'bg-gray-200 text-slate-700'
              }`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${
                theme === 'dark' ? 'text-gray-200 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} md:hidden shadow-md`}>
          <div className="px-4 pt-3 pb-4 space-y-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`${baseLinkStyles} ${linkTheme}`}>
              Dashboard
            </Link>
            <Link to="/story" onClick={() => setMobileMenuOpen(false)} className={`${baseLinkStyles} ${linkTheme}`}>
              Story Mode
            </Link>
            <Link to="/rpg" onClick={() => setMobileMenuOpen(false)} className={`${baseLinkStyles} ${linkTheme}`}>
              RPG Mode
            </Link>
            <Link to="/conflict" onClick={() => setMobileMenuOpen(false)} className={`${baseLinkStyles} ${linkTheme}`}>
              Conflict Resolution
            </Link>
            <Link to="/debate" onClick={() => setMobileMenuOpen(false)} className={`${baseLinkStyles} ${linkTheme}`}>
              Debate Mode
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
