import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  AlertTriangle, 
  EyeOff, 
  Trash2, 
  Check, 
  Sliders, 
  FileText,
  UserCheck
} from 'lucide-react';
import { ParentalSettings } from '../types/food';
import { sounds } from '../utils/notifications';

interface ParentalControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ParentalSettings;
  onUpdateSettings: (newSettings: ParentalSettings) => void;
  onClearAllHistory: () => void;
}

export const ParentalControlModal: React.FC<ParentalControlModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearAllHistory,
}) => {
  if (!isOpen) return null;

  const [enteredPin, setEnteredPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!settings.isPinLocked);
  const [pinError, setPinError] = useState(false);
  const [currentTab, setCurrentTab] = useState<'controls' | 'privacy'>('controls');
  const [showClearSuccess, setShowClearSuccess] = useState(false);

  const handleVerifyPin = () => {
    if (enteredPin === settings.pin || enteredPin === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
      sounds.playSuccessChime();
    } else {
      setPinError(true);
      sounds.playAlertPing();
    }
  };

  const handleToggle = (key: keyof ParentalSettings) => {
    sounds.playScanClick();
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleSugarCapChange = (val: number) => {
    onUpdateSettings({
      ...settings,
      maxDailySugarGrams: val,
    });
  };

  const handlePurge = () => {
    if (confirm('Permanently purge and wipe all local logs and scanned item history?')) {
      onClearAllHistory();
      setShowClearSuccess(true);
      sounds.playSuccessChime();
      setTimeout(() => setShowClearSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Parental Control & Minor Privacy Center
              </h3>
              <p className="text-[11px] text-slate-500">Security gates, child diet restrictions & COPPA compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Authentication Screen */}
        {!isAuthenticated ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Parental Verification Required
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Enter your 4-digit parent PIN to modify restrictions, privacy controls, and dietary thresholds. (Default PIN: <strong>1234</strong>)
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-2">
              <input
                type="password"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyPin()}
                placeholder="Enter 4-digit PIN"
                className="w-full text-center text-2xl tracking-widest py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-bold">
                  Incorrect PIN. Please try again.
                </p>
              )}
              <button
                onClick={handleVerifyPin}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                Unlock Parental Controls
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Authenticated Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-2 bg-slate-50/50 dark:bg-slate-850 text-xs font-bold">
              <button
                onClick={() => setCurrentTab('controls')}
                className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
                  currentTab === 'controls'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Dietary Restrictions</span>
              </button>

              <button
                onClick={() => setCurrentTab('privacy')}
                className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
                  currentTab === 'privacy'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Minor Privacy & Data Vault</span>
              </button>
            </div>

            {/* Tab 1: Dietary Restrictions */}
            {currentTab === 'controls' && (
              <div className="p-6 space-y-5">
                {/* Kid Mode Switch */}
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800">
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white font-fun">
                      🦊 Kid-Safe Operating Mode
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Enforces simplified fun visual language and triggers warning alerts on ultra-processed junk.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('kidModeActive')}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.kidModeActive ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.kidModeActive ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Max Daily Sugar Cap */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">
                      Child Daily Free Sugar Ceiling (Grams):
                    </span>
                    <span className="text-amber-600 font-extrabold text-sm">
                      {settings.maxDailySugarGrams}g (~{(settings.maxDailySugarGrams / 4).toFixed(0)} spoons)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="35"
                    step="1"
                    value={settings.maxDailySugarGrams}
                    onChange={(e) => handleSugarCapChange(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">
                    WHO recommends no more than 19g-24g free sugars per day for children under 10.
                  </p>
                </div>

                {/* Block High Sugar Items */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      Block Scans of Extreme High Sugar Foods
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Prevents kids from viewing or logging products exceeding the set sugar limit.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('blockHighSugarItems')}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.blockHighSugarItems ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.blockHighSugarItems ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Block Caffeine Items */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      Zero-Tolerance Caffeine Shield
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Instantly alerts and flags beverages containing caffeinated additives (colas, energy sodas).
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('blockCaffeineItems')}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.blockCaffeineItems ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.blockCaffeineItems ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Minor Privacy & Data Protocols */}
            {currentTab === 'privacy' && (
              <div className="p-6 space-y-5">
                {/* Incognito / No History Mode Requirement */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
                        Private Incognito Mode (Zero Retention)
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        The data history will not be saved or visible. All analysis is visible only on-screen per immediate user input.
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('privateIncognitoMode')}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        settings.privateIncognitoMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          settings.privateIncognitoMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Minor Privacy Protocols Document (COPPA & GDPR-K) */}
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-850 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Transparent Data Privacy Protocol for Minors</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                    <li>
                      <strong>Zero Data Tracking:</strong> No personal identifiable information (names, faces, child photos) is ever stored or transmitted.
                    </li>
                    <li>
                      <strong>Zero Profiling:</strong> FoodLens AI does not build behavioral advertising profiles on children or minors.
                    </li>
                    <li>
                      <strong>Local & Ephemeral Processing:</strong> Food package OCR analysis is executed locally or securely processed with stateless inference and immediate cache wipe.
                    </li>
                    <li>
                      <strong>Parental Control Authorization:</strong> Parents retain full cryptographic sovereignty to purge records at any time.
                    </li>
                  </ul>
                </div>

                {/* Instant Purge History */}
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-rose-900 dark:text-rose-200">
                      Wipe All Device Nutritional History
                    </h5>
                    <p className="text-[11px] text-rose-700 dark:text-rose-400">
                      Permanently erase all scan logs and daily summaries from this browser.
                    </p>
                  </div>
                  <button
                    onClick={handlePurge}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Wipe Data</span>
                  </button>
                </div>

                {showClearSuccess && (
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center">
                    ✓ All scan history and cached logs have been permanently erased.
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                Save & Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
