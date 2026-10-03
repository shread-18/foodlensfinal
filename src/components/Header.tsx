import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/scan', label: 'Scan Food' },
  { to: '/nutrition', label: 'Nutrition' },
  { to: '/health', label: 'Health Insights' },
  { to: '/about', label: 'About' },
];

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useApp();

  const navigation = (mobile = false) => links.map(({ to, label }) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/'}
      onClick={() => mobile && setMenuOpen(false)}
      className={({ isActive }) =>
        `rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
        }`
      }
    >
      {label}
    </NavLink>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <img src="/foodlens-icon.svg" alt="" className="h-9 w-9 rounded-xl" />
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            FoodLens <span className="text-emerald-700 dark:text-emerald-400">AI</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {navigation()}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Use light theme' : 'Use dark theme'}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/scan"
            className="hidden rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 sm:inline-flex"
          >
            Scan Food
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile navigation" className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 dark:border-slate-800 lg:hidden">
          {navigation(true)}
          <Link
            to="/scan"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full bg-emerald-700 px-4 py-2.5 text-center text-sm font-bold text-white"
          >
            Scan Food
          </Link>
        </nav>
      )}
    </header>
  );
};
