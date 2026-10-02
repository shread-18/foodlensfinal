import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Camera, 
  FileText, 
  Activity, 
  Target, 
  Sparkles, 
  Home,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/notifications';

export const DashboardSwitcher: React.FC = () => {
  const location = useLocation();
  const { currentFood, scanHistory, dailySummary } = useApp();

  const dashboards = [
    {
      id: 'home',
      path: '/',
      label: 'Portal Overview',
      tag: 'Hub',
      icon: Home,
      badge: 'Main',
      color: 'hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400',
      activeColor: 'bg-emerald-600 text-white shadow-sm border-emerald-600',
    },
    {
      id: 'scan',
      path: '/scan',
      label: 'Dashboard 1 · Scanner & OCR',
      tag: 'D-1',
      icon: Camera,
      badge: `${scanHistory.length} Scans`,
      color: 'hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400',
      activeColor: 'bg-emerald-600 text-white shadow-sm border-emerald-600',
    },
    {
      id: 'nutrition',
      path: '/nutrition',
      label: 'Dashboard 2 · Nutrition & Additives',
      tag: 'D-2',
      icon: FileText,
      badge: currentFood.name.split(' ')[0],
      color: 'hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400',
      activeColor: 'bg-teal-600 text-white shadow-sm border-teal-600',
    },
    {
      id: 'growth',
      path: '/growth',
      label: 'Dashboard 3 · Kid Growth & Body',
      tag: 'D-3',
      icon: Activity,
      badge: 'Simulator',
      color: 'hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400',
      activeColor: 'bg-purple-600 text-white shadow-sm border-purple-600',
    },
    {
      id: 'goals',
      path: '/goals',
      label: 'Dashboard 4 · Daily Goals & Water',
      tag: 'D-4',
      icon: Target,
      badge: `${Math.round(dailySummary.waterIntakeMl)}ml`,
      color: 'hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400',
      activeColor: 'bg-sky-600 text-white shadow-sm border-sky-600',
    },
    {
      id: 'kid-mode',
      path: '/kid-mode',
      label: 'Dashboard 5 · Safe Kid Zone',
      tag: 'D-5',
      icon: Sparkles,
      badge: 'Protected',
      color: 'hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400',
      activeColor: 'bg-pink-600 text-white shadow-sm border-pink-600',
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Label & Quick Switcher Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Web Dashboards
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              · Select any of the 5 specialized dashboards below
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Currently Inspected:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg truncate max-w-[180px]">
              {currentFood.name}
            </span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
              currentFood.consumptionSignal === 'GOOD' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
              currentFood.consumptionSignal === 'OK' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
              'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {currentFood.consumptionSignal}
            </span>
          </div>
        </div>

        {/* Horizontal Scrollable Tabs on Mobile / Flex Grid on Desktop */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dashboards.map((dash) => {
            const Icon = dash.icon;
            const isExact = dash.path === '/';
            return (
              <NavLink
                key={dash.id}
                to={dash.path}
                end={isExact}
                onClick={() => triggerHaptic('light')}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? dash.activeColor
                      : `bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 ${dash.color}`
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{dash.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {dash.badge}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
