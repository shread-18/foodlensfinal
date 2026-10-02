import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Sparkles, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { sounds, triggerHaptic } from '../utils/notifications';

interface MobileInstallSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileInstallSheet: React.FC<MobileInstallSheetProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Listen for Chromium install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    sounds.playSuccessChime();
    triggerHaptic('medium');

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        onClose();
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative animate-in slide-in-from-bottom duration-300"
      >
        {/* Top Drag Handle Pill */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto -mt-2 mb-4"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Presentation Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <img
              src="/foodlens-icon.svg"
              alt="FoodLens App"
              className="w-16 h-16 rounded-2xl shadow-md border border-emerald-500/20"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                FoodLens Mobile
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-500">Fast, Offline, Instant Camera OCR</p>
            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
              <span>★★★★★</span>
              <span className="text-slate-400 font-normal">(4.9 · 10K+ Families)</span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs mb-5">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Instant home-screen launch with zero browser address bars</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Works 100% offline with encrypted local history vault</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Real-time mobile camera lens & hydration push reminders</span>
          </div>
        </div>

        {/* Action Button: Android/Desktop or iOS Instructions */}
        {isInstalled ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>FoodLens is already installed as a mobile app on this device!</span>
          </div>
        ) : isIOS ? (
          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-850 rounded-2xl text-xs space-y-2 text-sky-900 dark:text-sky-200">
            <div className="flex items-center gap-2 font-bold text-sm text-sky-800 dark:text-sky-300">
              <Smartphone className="w-4 h-4" />
              <span>How to install on iPhone & iPad:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
              <li className="flex items-center gap-1.5">
                <span>1. Tap the</span>
                <span className="inline-flex items-center px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-900 dark:text-white font-semibold">
                  <Share className="w-3 h-3 mr-0.5 inline" /> Share
                </span>
                <span>button in Safari footer.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>2. Scroll down and tap</span>
                <span className="inline-flex items-center px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-900 dark:text-white font-semibold">
                  <PlusSquare className="w-3 h-3 mr-0.5 inline" /> Add to Home Screen
                </span>
              </li>
              <li>3. Tap <strong>Add</strong> at top right to start using FoodLens!</li>
            </ol>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Install FoodLens App (Free)</span>
          </button>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Zero ads · Minor privacy compliant · Verified PWA</span>
        </div>
      </div>
    </div>
  );
};
