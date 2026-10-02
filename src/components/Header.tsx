import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Moon, 
  Sun, 
  Bell, 
  Sparkles, 
  Lock, 
  KeyRound, 
  EyeOff,
  Camera,
  FileText,
  Activity,
  Target,
  Home,
  ShieldCheck,
  ChevronDown,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/notifications';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isDarkMode, 
    toggleDarkMode, 
    parentalSettings, 
    updateParentalSettings, 
    setIsParentalModalOpen, 
    setIsBackupModalOpen, 
    setIsAabModalOpen,
    notificationsEnabled, 
    toggleNotifications,
    currentFood,
    scanHistory
  } = useApp();

  const handleToggleKidMode = () => {
    triggerHaptic('medium');
    if (parentalSettings.kidModeActive) {
      setIsParentalModalOpen(true);
    } else {
      updateParentalSettings({ kidModeActive: true });
      navigate('/kid-mode');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <NavLink 
            to="/" 
            onClick={() => triggerHaptic('light')}
            className="flex items-center gap-3 group select-none"
          >
            <div className="relative">
              <img
                src="/foodlens-icon.svg"
                alt="FoodLens"
                className="w-10 h-10 rounded-2xl shadow-sm border border-emerald-500/30 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center">
                  Food<span className="text-emerald-600 dark:text-emerald-400">Lens</span>
                  <span className="ml-1 text-xs font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-md">
                    Portal
                  </span>
                </span>
                {parentalSettings.kidModeActive && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold font-fun px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300 border border-pink-300 animate-pulse">
                    🧒 Kid Mode
                  </span>
                )}
                {parentalSettings.privateIncognitoMode && (
                  <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <EyeOff className="w-3 h-3 text-emerald-500 mr-1" />
                    Incognito
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                AI Food Pack Vision, Nutrition Intelligence & Kid Growth Portal
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5">
            <NavLink
              to="/"
              end
              onClick={() => triggerHaptic('light')}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/scan"
              onClick={() => triggerHaptic('light')}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Camera className="w-3.5 h-3.5" />
              <span>1. Scanner & OCR</span>
            </NavLink>

            <NavLink
              to="/nutrition"
              onClick={() => triggerHaptic('light')}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Nutrition</span>
            </NavLink>

            <NavLink
              to="/growth"
              onClick={() => triggerHaptic('light')}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Activity className="w-3.5 h-3.5" />
              <span>3. Kid Growth</span>
            </NavLink>

            <NavLink
              to="/goals"
              onClick={() => triggerHaptic('light')}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Target className="w-3.5 h-3.5" />
              <span>4. Goals</span>
            </NavLink>

            <NavLink
              to="/kid-mode"
              onClick={() => triggerHaptic('light')}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-bold font-fun transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>5. Kid Zone</span>
            </NavLink>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Google Play .AAB Export Button */}
            <button
              onClick={() => {
                triggerHaptic('medium');
                setIsAabModalOpen(true);
              }}
              title="Generate Google Play .AAB (Android App Bundle)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs transition-all active:scale-95 animate-pulse"
            >
              <Package className="w-3.5 h-3.5 text-emerald-200" />
              <span>📦 .AAB Bundle URL</span>
            </button>

            {/* Kid Mode Quick Toggle Button */}
            <button
              onClick={handleToggleKidMode}
              title={parentalSettings.kidModeActive ? 'Exit Kid Mode' : 'Activate Kid Mode'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                parentalSettings.kidModeActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-fun text-xs">
                {parentalSettings.kidModeActive ? 'Kid Mode ON' : 'Kid Mode'}
              </span>
            </button>

            {/* E2EE Cloud Vault */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsBackupModalOpen(true);
              }}
              title="Encrypted Backup Vault"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <KeyRound className="w-4 h-4 text-indigo-500" />
            </button>

            {/* Push Notifications Toggle */}
            <button
              onClick={() => {
                triggerHaptic('light');
                toggleNotifications();
              }}
              title={notificationsEnabled ? 'Hydration & Goal Alerts On' : 'Turn on Hydration Alerts'}
              className={`p-2 rounded-xl transition-colors ${
                notificationsEnabled
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Parental Control Lock */}
            <button
              onClick={() => {
                triggerHaptic('medium');
                setIsParentalModalOpen(true);
              }}
              title="Parental Control Dashboard"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Lock className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                triggerHaptic('light');
                toggleDarkMode();
              }}
              title="Toggle Dark/Light Mode"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
