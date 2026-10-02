import React, { useState } from 'react';
import { 
  Smartphone, 
  Maximize2, 
  Download, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { MobileStatusBar } from './MobileStatusBar';
import { MobileBottomTabBar } from './MobileBottomTabBar';
import { MobileInstallSheet } from './MobileInstallSheet';
import { triggerHaptic } from '../utils/notifications';
import { useApp } from '../context/AppContext';

interface MobileAppShellProps {
  children: React.ReactNode;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({ children }) => {
  const { setIsPhoneModalOpen } = useApp();
  // Desktop preview mode: 'phone-frame' (iPhone device frame) or 'fluid-mobile'
  const [deviceMode, setDeviceMode] = useState<'phone-frame' | 'fluid-mobile'>('phone-frame');
  const [isInstallSheetOpen, setIsInstallSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start select-text selection:bg-emerald-500 selection:text-white">
      {/* Top Desktop Controls Bar (Only visible on wide desktop screens to switch view or install) */}
      <div className="hidden lg:flex w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-2.5 items-center justify-between z-50 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-slate-200 font-extrabold tracking-tight">FoodLens Mobile App</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
            v2.0 PWA
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Device Preview:</span>
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => {
                setDeviceMode('phone-frame');
                triggerHaptic('light');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                deviceMode === 'phone-frame'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone Frame</span>
            </button>
            <button
              onClick={() => {
                setDeviceMode('fluid-mobile');
                triggerHaptic('light');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                deviceMode === 'fluid-mobile'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Mobile</span>
            </button>
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setIsPhoneModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-sm transition-all active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-200" />
            <span>📲 Get on Phone (QR Code)</span>
          </button>

          <button
            onClick={() => setIsInstallSheetOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install PWA</span>
          </button>
        </div>
      </div>

      {/* Main Container Area */}
      <div className="w-full flex-1 flex items-center justify-center sm:py-6 sm:px-4">
        {deviceMode === 'phone-frame' ? (
          /* Phone Device Frame (iPhone 16 Pro styling on desktop) */
          <div className="relative w-full max-w-[420px] sm:h-[870px] bg-slate-50 dark:bg-slate-950 sm:rounded-[52px] sm:border-[10px] sm:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all">
            {/* Status Bar */}
            <MobileStatusBar />

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col scroll-smooth">
              {children}
            </div>

            {/* Bottom Tab Bar Dock */}
            <MobileBottomTabBar />
          </div>
        ) : (
          /* Fluid Mobile View (Responsive mobile view up to max-w-lg) */
          <div className="relative w-full max-w-lg min-h-screen bg-slate-50 dark:bg-slate-950 sm:shadow-2xl sm:border-x border-slate-200 dark:border-slate-800 flex flex-col transition-all">
            <MobileStatusBar />

            <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col">
              {children}
            </div>

            <MobileBottomTabBar />
          </div>
        )}
      </div>

      {/* PWA Install Sheet Modal */}
      <MobileInstallSheet
        isOpen={isInstallSheetOpen}
        onClose={() => setIsInstallSheetOpen(false)}
      />
    </div>
  );
};
