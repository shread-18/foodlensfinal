import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Camera, 
  FileText, 
  Activity, 
  Target, 
  Lock, 
  KeyRound,
  Package 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WebsiteFooter: React.FC = () => {
  const { setIsParentalModalOpen, setIsBackupModalOpen, setIsAabModalOpen } = useApp();

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/foodlens-icon.svg" alt="FoodLens" className="w-8 h-8 rounded-xl" />
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                Food<span className="text-emerald-600 dark:text-emerald-400">Lens</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI-assisted packaged food scanner, clinical nutrition breakdown, and interactive kid physiological growth visualizer.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>WHO & FSSAI Compliant Guidelines</span>
            </div>
          </div>

          {/* Col 2: Specialized Dashboards */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Specialized Dashboards
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/scan" className="hover:text-emerald-600 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Dashboard 1 · Scanner & OCR</span>
                </Link>
              </li>
              <li>
                <Link to="/nutrition" className="hover:text-teal-600 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-500" />
                  <span>Dashboard 2 · Nutrition & Additives</span>
                </Link>
              </li>
              <li>
                <Link to="/growth" className="hover:text-purple-600 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-500" />
                  <span>Dashboard 3 · Kid Body Growth</span>
                </Link>
              </li>
              <li>
                <Link to="/goals" className="hover:text-sky-600 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-sky-500" />
                  <span>Dashboard 4 · Daily Goals & Water</span>
                </Link>
              </li>
              <li>
                <Link to="/kid-mode" className="hover:text-pink-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>Dashboard 5 · Safe Kid Mode</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinical & Safety Norms */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Health & Safety Standards
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>• Maximum recommended added sugar: <strong>24g / day</strong> (WHO)</li>
              <li>• Mandatory allergen & palm oil transparency</li>
              <li>• Pediatric caffeine restriction (0mg safe limit)</li>
              <li>• Real-time nutritional recalculation per serving gram</li>
            </ul>
          </div>

          {/* Col 4: Privacy & Tools */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Privacy & Security
            </h4>
            <div className="space-y-2.5 text-xs">
              <button
                onClick={() => setIsParentalModalOpen(true)}
                className="w-full flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 transition-colors text-slate-700 dark:text-slate-300 font-bold"
              >
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Parental PIN Lock
                </span>
                <span>Configure →</span>
              </button>

              <button
                onClick={() => setIsBackupModalOpen(true)}
                className="w-full flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 transition-colors text-slate-700 dark:text-slate-300 font-bold"
              >
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                  Encrypted Data Vault
                </span>
                <span>Export →</span>
              </button>

              <button
                onClick={() => setIsAabModalOpen(true)}
                className="w-full flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-emerald-800 dark:text-emerald-300 font-extrabold"
              >
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  Google Play .AAB Export
                </span>
                <span>Generate →</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} FoodLens AI Web Portal. Designed for health-conscious families and smart grocery shoppers.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Empowering healthy eating with AI Vision & Science</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
