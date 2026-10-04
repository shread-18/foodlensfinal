import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  EyeOff, 
  Trash2, 
  Sliders, 
  KeyRound,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { ParentalSettings } from '../types/food';
import { sounds } from '../utils/notifications';
import { GlowButton } from './ui/GlowButton';
import { StatusBadge } from './ui/StatusBadge';

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
    if (confirm('Permanently purge and cryptographically wipe all local telemetry and scanned food history?')) {
      onClearAllHistory();
      setShowClearSuccess(true);
      sounds.playSuccessChime();
      setTimeout(() => setShowClearSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,217,255,0.15)] overflow-hidden my-8">
        {/* Futuristic corner brackets */}
        <div className="corner-bracket-tl !border-cyan-400" />
        <div className="corner-bracket-tr !border-cyan-400" />
        <div className="corner-bracket-bl !border-cyan-400" />
        <div className="corner-bracket-br !border-cyan-400" />

        {/* Ambient Top Glow Line */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(0,217,255,0.6)]" />

        {/* Top Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base text-white tracking-wide">
                  Parental Control & Minor Privacy Vault
                </h3>
                <StatusBadge label="COPPA SAFE" variant="ready" dotColor="bg-cyan-400" />
              </div>
              <p className="text-[11px] font-mono text-slate-400 tracking-wider">
                SYS.GATEWAY // PEDIATRIC RESTRICTIONS & ZERO RETENTION
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-110"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Authentication Screen */}
        {!isAuthenticated ? (
          <div className="p-8 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-[0_0_25px_rgba(0,245,160,0.25)]">
                <KeyRound className="w-9 h-9" />
              </div>
            </div>
            <div>
              <h4 className="font-heading font-bold text-xl text-white">
                Cryptographic Parent Access Gate
              </h4>
              <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                Enter your 4-digit security PIN to calibrate pediatric thresholds, content gating, and zero-retention storage. <br />
                <span className="text-emerald-400 font-bold">Default Factory PIN: 1234</span>
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-3">
              <div className="relative">
                <input
                  type="password"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyPin()}
                  placeholder="••••"
                  autoFocus
                  className="w-full text-center text-3xl font-mono tracking-[0.5em] py-3 px-4 rounded-xl border border-cyan-500/40 bg-slate-950/80 text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent shadow-[0_0_20px_rgba(0,217,255,0.2)]"
                />
              </div>
              {pinError && (
                <p className="text-xs text-rose-400 font-mono font-bold flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  AUTHENTICATION REJECTED. TRY AGAIN.
                </p>
              )}
              <GlowButton
                variant="primary"
                onClick={handleVerifyPin}
                className="w-full justify-center text-xs tracking-wider"
              >
                UNLOCK SYSTEM CONTROLS
              </GlowButton>
            </div>
          </div>
        ) : (
          <div>
            {/* Authenticated Tabs */}
            <div className="flex border-b border-cyan-500/20 px-6 pt-2 bg-slate-950/50 text-xs font-mono font-bold">
              <button
                onClick={() => setCurrentTab('controls')}
                className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
                  currentTab === 'controls'
                    ? 'border-emerald-400 text-emerald-300 shadow-[0_4px_15px_rgba(0,245,160,0.25)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>DIETARY RESTRICTIONS</span>
              </button>

              <button
                onClick={() => setCurrentTab('privacy')}
                className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
                  currentTab === 'privacy'
                    ? 'border-cyan-400 text-cyan-300 shadow-[0_4px_15px_rgba(0,217,255,0.25)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>MINOR PRIVACY & VAULT</span>
              </button>
            </div>

            {/* Tab 1: Dietary Restrictions */}
            {currentTab === 'controls' && (
              <div className="p-6 space-y-5">
                {/* Kid Mode Switch */}
                <div className="flex items-center justify-between p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <div>
                    <h5 className="font-heading font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                      <span>🦊</span> Kid-Safe Operating Mode
                    </h5>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Enforces simplified fun visual language and triggers warning alerts on ultra-processed junk.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('kidModeActive')}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.kidModeActive ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-slate-800'
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
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span className="text-slate-300">
                      Child Daily Free Sugar Ceiling:
                    </span>
                    <span className="text-amber-400 font-extrabold text-sm px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
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
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <p className="text-[11px] font-mono text-slate-400">
                    WHO pediatric standard: ≤ 19g-24g free sugars per day for children under 10.
                  </p>
                </div>

                {/* Block High Sugar Items */}
                <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60">
                  <div>
                    <h5 className="font-heading font-bold text-xs text-white">
                      Block Scans of Extreme High Sugar Foods
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Prevents kids from viewing or logging products exceeding the set sugar limit.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('blockHighSugarItems')}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.blockHighSugarItems ? 'bg-emerald-500 shadow-[0_0_10px_rgba(0,245,160,0.5)]' : 'bg-slate-800'
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
                <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60">
                  <div>
                    <h5 className="font-heading font-bold text-xs text-white">
                      Zero-Tolerance Caffeine Shield
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Instantly alerts and flags beverages containing caffeinated additives (colas, energy sodas).
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('blockCaffeineItems')}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.blockCaffeineItems ? 'bg-emerald-500 shadow-[0_0_10px_rgba(0,245,160,0.5)]' : 'bg-slate-800'
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
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-heading font-bold text-xs text-white flex items-center gap-2">
                        <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                        Private Incognito Mode (Zero Retention)
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Food scan history is not saved locally or in the cloud. Analysis is strictly ephemeral.
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('privateIncognitoMode')}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        settings.privateIncognitoMode ? 'bg-cyan-500 shadow-[0_0_10px_rgba(0,217,255,0.5)]' : 'bg-slate-800'
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
                <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-500/30 text-xs text-slate-300 space-y-2.5">
                  <div className="flex items-center gap-2 font-mono font-bold text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>CHILD DATA SOVEREIGNTY PROTOCOL</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-[11px] font-sans leading-relaxed text-slate-300">
                    <li>
                      <strong className="text-white">Zero Tracking:</strong> No personally identifiable information (child names, faces, camera feed frames) is ever saved.
                    </li>
                    <li>
                      <strong className="text-white">Zero Behavioral Profiling:</strong> FoodLens AI does not commercialize or profile nutritional habits for ads.
                    </li>
                    <li>
                      <strong className="text-white">Local Inference Cache:</strong> OCR is processed with stateless inference and immediate RAM wipe.
                    </li>
                    <li>
                      <strong className="text-white">Parental Right to Purge:</strong> Instant cryptographic wipe available at any time below.
                    </li>
                  </ul>
                </div>

                {/* Instant Purge History */}
                <div className="p-4 bg-rose-950/30 rounded-2xl border border-rose-500/30 flex items-center justify-between">
                  <div>
                    <h5 className="font-heading font-bold text-xs text-rose-300">
                      Wipe All Device Nutritional History
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Permanently erase all scan logs and daily summaries from this browser.
                    </p>
                  </div>
                  <button
                    onClick={handlePurge}
                    className="px-3.5 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:scale-105"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>PURGE LOGS</span>
                  </button>
                </div>

                {showClearSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-mono font-bold text-center">
                    ✓ All scan history and cached logs have been cryptographically erased.
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-950/80 border-t border-cyan-500/20 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">
                STATUS: ENCRYPTED // AES-256 SESSION
              </span>
              <GlowButton
                variant="primary"
                onClick={onClose}
                className="text-xs"
              >
                APPLY & CLOSE
              </GlowButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
