import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check, 
  Share, 
  PlusSquare, 
  Download, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { sounds, triggerHaptic } from '../utils/notifications';

interface PhoneInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneInstallModal: React.FC<PhoneInstallModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [platformTab, setPlatformTab] = useState<'iphone' | 'android'>('iphone');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [appUrl, setAppUrl] = useState('https://ais-pre-3r33mrbgf7eyfwu42pwrvy-91802752904.asia-southeast1.run.app');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use current window location or shared origin
      const current = window.location.origin;
      if (current && !current.includes('localhost')) {
        setAppUrl(current);
      } else {
        setAppUrl('https://ais-pre-3r33mrbgf7eyfwu42pwrvy-91802752904.asia-southeast1.run.app');
      }

      // Detect if user device is Android
      const ua = navigator.userAgent.toLowerCase();
      if (/android/.test(ua)) {
        setPlatformTab('android');
      } else if (/iphone|ipad|ipod/.test(ua)) {
        setPlatformTab('iphone');
      }
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    sounds.playSuccessChime();
    triggerHaptic('medium');
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDirectInstall = async () => {
    sounds.playScanClick();
    triggerHaptic('medium');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        onClose();
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl relative max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playScanClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title Banner */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black mb-2">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Install on iOS & Android</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Get FoodLens on Your Phone 📱
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Scan with your phone camera to open instantly, or save to your home screen with full offline access!
          </p>
        </div>

        {/* Center QR Code Box */}
        <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-850 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner mb-5">
          <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-emerald-500/30 relative group">
            <QRCodeSVG
              value={appUrl}
              size={180}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: '/foodlens-icon.svg',
                x: undefined,
                y: undefined,
                height: 38,
                width: 38,
                excavate: true,
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mt-3">
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Scan with your iPhone or Android camera</span>
          </div>

          {/* Direct Link & Copy */}
          <div className="w-full mt-3 flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="bg-transparent text-slate-600 dark:text-slate-300 flex-1 truncate font-mono text-[11px] focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Direct One-Click Install Button (When available in Chrome/Edge/Android) */}
        {deferredPrompt && (
          <div className="mb-5">
            <button
              onClick={handleDirectInstall}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Tap to Install FoodLens Mobile App Now</span>
            </button>
          </div>
        )}

        {/* Step-by-Step Platform Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-slate-500 uppercase tracking-wider text-[11px]">
              How to add to Home Screen:
            </span>
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl">
              <button
                onClick={() => {
                  setPlatformTab('iphone');
                  sounds.playScanClick();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  platformTab === 'iphone'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                 iPhone (Safari)
              </button>
              <button
                onClick={() => {
                  setPlatformTab('android');
                  sounds.playScanClick();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  platformTab === 'android'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🤖 Android (Chrome)
              </button>
            </div>
          </div>

          {platformTab === 'iphone' ? (
            /* iPhone Safari Guide */
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  Open the link in <strong>Safari</strong> on your iPhone.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                  <span>Tap the</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white">
                    <Share className="w-3.5 h-3.5 mr-1 text-sky-500" /> Share
                  </span>
                  <span>icon at the bottom of the screen.</span>
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                  <span>Scroll down and tap</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white">
                    <PlusSquare className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Add to Home Screen
                  </span>
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  4
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  Tap <strong>Add</strong> in the top right. The <strong>FoodLens</strong> app icon will appear on your phone home screen!
                </p>
              </div>
            </div>
          ) : (
            /* Android Chrome Guide */
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  Open the link in <strong>Google Chrome</strong> on your phone.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  Tap the banner saying <strong>"Add FoodLens to Home screen"</strong> (or tap the <strong>⋮ 3-dots</strong> menu at the top right).
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                  <span>Select</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white">
                    <Download className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Install App
                  </span>
                  <span>or "Add to Home Screen".</span>
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  4
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  Confirm <strong>Install</strong>. FoodLens is now installed as an app with full offline camera support!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PWA Verified · 0MB App Store Download</span>
          </span>
          <button
            onClick={() => {
              sounds.playScanClick();
              onClose();
            }}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
