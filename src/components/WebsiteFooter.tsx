import React from 'react';
import { Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/scan', label: 'Scan Food' },
  { to: '/nutrition', label: 'Nutrition' },
  { to: '/health', label: 'Health Insights' },
  { to: '/about', label: 'About' },
];

export const WebsiteFooter: React.FC = () => (
  <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
      <div>
        <Link to="/" className="font-extrabold text-slate-900 dark:text-white">FoodLens AI</Link>
        <p className="mt-1 text-sm text-slate-500">Smart Food Package &amp; Nutrition Analyzer</p>
        <p className="mt-1 text-sm text-slate-500">Making food information easier to understand.</p>
      </div>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {links.map(({ to, label }) => (
          <Link key={to} to={to} className="text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400">
            {label}
          </Link>
        ))}
      </nav>
      <p className="max-w-xs text-xs leading-relaxed text-slate-500">
        FoodLens provides informational insights and is not a substitute for professional medical or dietary advice.
      </p>
    </div>
  </footer>
);
