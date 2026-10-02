import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  FileText, 
  Activity, 
  Target 
} from 'lucide-react';
import { sounds, triggerHaptic } from '../utils/notifications';
import { useApp } from '../context/AppContext';

export const MobileBottomTabBar: React.FC = () => {
  const { currentFood, dailySummary, dailyGoals } = useApp();

  const handleTabPress = () => {
    sounds.playScanClick();
    triggerHaptic('light');
  };

  const hasWaterGoalRemaining = dailySummary.waterIntakeMl < dailyGoals.waterMl;

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 transition-colors select-none shadow-[0_-8px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-md mx-auto px-4 pt-1.5 pb-2">
        <div className="flex items-center justify-between">
          {/* TAB 1: Home */}
          <NavLink
            to="/"
            end
            onClick={handleTabPress}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Home className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500"></span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-bold">Home</span>
              </>
            )}
          </NavLink>

          {/* TAB 2: Nutritional Facts */}
          <NavLink
            to="/nutrition"
            onClick={handleTabPress}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <FileText className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500"></span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-bold">Nutrition</span>
              </>
            )}
          </NavLink>

          {/* TAB 3: CENTER PROMINENT SCAN BUTTON */}
          <NavLink
            to="/scan"
            onClick={() => {
              sounds.playScanClick();
              triggerHaptic('medium');
            }}
            className="flex flex-col items-center justify-center -mt-5 px-2 group"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white ring-4 ring-emerald-500/25 shadow-emerald-500/40'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  <Camera className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className={`text-[10px] mt-1 font-black ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                  Scan Pack
                </span>
              </>
            )}
          </NavLink>

          {/* TAB 4: Kid Growth */}
          <NavLink
            to="/growth"
            onClick={handleTabPress}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Activity className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500"></span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-bold">Growth</span>
              </>
            )}
          </NavLink>

          {/* TAB 5: Daily Goals */}
          <NavLink
            to="/goals"
            onClick={handleTabPress}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Target className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {hasWaterGoalRemaining && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-500 border border-white dark:border-slate-900"></span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-500"></span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-bold">Goals</span>
              </>
            )}
          </NavLink>
        </div>

        {/* iPhone Style Home Indicator Bar */}
        <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700/80 rounded-full mx-auto mt-2"></div>
      </div>
    </nav>
  );
};
