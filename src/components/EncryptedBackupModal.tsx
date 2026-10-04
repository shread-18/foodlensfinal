import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  CloudUpload, 
  CloudDownload, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Lock,
  Cpu
} from 'lucide-react';
import { encryptRecords, decryptRecords, saveToCloudVault, loadFromCloudVault } from '../services/cryptoBackup';
import { ScanHistoryItem, DailySummary } from '../types/food';
import { sounds } from '../utils/notifications';
import { GlowButton } from './ui/GlowButton';
import { StatusBadge } from './ui/StatusBadge';

interface EncryptedBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryItem[];
  dailySummary: DailySummary;
  onRestoreData: (restoredHistory: ScanHistoryItem[], restoredSummary: DailySummary) => void;
}

export const EncryptedBackupModal: React.FC<EncryptedBackupModalProps> = ({
  isOpen,
  onClose,
  history,
  dailySummary,
  onRestoreData,
}) => {
  if (!isOpen) return null;

  const [passphrase, setPassphrase] = useState('');
  const [cloudBackupId, setCloudBackupId] = useState(`FL-${Date.now().toString(36).toUpperCase()}`);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Backup to Cloud
  const handleCloudBackup = async () => {
    if (!passphrase || passphrase.length < 6) {
      setStatusMessage({ type: 'error', text: 'Passphrase must be at least 6 characters for strong 256-bit PBKDF2 derivation.' });
      sounds.playAlertPing();
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const recordsToEncrypt = {
        history,
        dailySummary,
        exportedAt: new Date().toISOString(),
      };

      const encryptedCipher = await encryptRecords(recordsToEncrypt, passphrase);
      await saveToCloudVault(cloudBackupId, encryptedCipher);

      sounds.playSuccessChime();
      setStatusMessage({
        type: 'success',
        text: `Encrypted payload successfully committed to Zero-Knowledge Vault. Vault ID: ${cloudBackupId}`,
      });
    } catch (err: any) {
      sounds.playAlertPing();
      setStatusMessage({ type: 'error', text: err.message || 'Failed to complete cloud backup.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Restore from Cloud
  const handleCloudRestore = async () => {
    if (!passphrase) {
      setStatusMessage({ type: 'error', text: 'Enter your private passphrase to decrypt cloud record.' });
      sounds.playAlertPing();
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const encryptedCipher = await loadFromCloudVault(cloudBackupId);
      const decryptedData = await decryptRecords(encryptedCipher, passphrase);

      if (decryptedData.history || decryptedData.dailySummary) {
        onRestoreData(decryptedData.history || [], decryptedData.dailySummary || dailySummary);
        sounds.playSuccessChime();
        setStatusMessage({
          type: 'success',
          text: `Success! Decrypted and restored ${decryptedData.history?.length || 0} nutritional telemetry records.`,
        });
      } else {
        throw new Error('Invalid backup container format.');
      }
    } catch (err: any) {
      sounds.playAlertPing();
      setStatusMessage({ type: 'error', text: err.message || 'Failed to restore cloud backup.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Download encrypted file (.foodlens.enc)
  const handleDownloadFile = async () => {
    if (!passphrase || passphrase.length < 6) {
      setStatusMessage({ type: 'error', text: 'Enter a passphrase (min 6 chars) to encrypt the export file.' });
      sounds.playAlertPing();
      return;
    }

    try {
      const recordsToEncrypt = {
        history,
        dailySummary,
        exportedAt: new Date().toISOString(),
      };

      const encryptedCipher = await encryptRecords(recordsToEncrypt, passphrase);
      const blob = new Blob([encryptedCipher], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `foodlens_backup_${Date.now()}.foodlens.enc`;
      a.click();
      URL.revokeObjectURL(url);
      sounds.playSuccessChime();
    } catch (err: any) {
      sounds.playAlertPing();
      setStatusMessage({ type: 'error', text: err.message || 'File export failed.' });
    }
  };

  const copyBackupId = () => {
    navigator.clipboard.writeText(cloudBackupId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
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
        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 shadow-[0_0_12px_rgba(0,217,255,0.6)]" />

        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-heading font-extrabold text-white tracking-wide">
                  End-to-End Encrypted Cloud Vault
                </h2>
                <StatusBadge label="AES-256-GCM" variant="ready" dotColor="bg-cyan-400" />
              </div>
              <p className="text-[11px] font-mono text-slate-400 tracking-wider">
                SYS.CRYPTO // CLIENT-SIDE KEY DERIVATION & ZERO-KNOWLEDGE SYNC
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Zero-Knowledge Privacy Guarantee */}
          <div className="p-4 bg-cyan-950/20 rounded-2xl border border-cyan-500/30 text-xs text-slate-300 space-y-2 shadow-[0_0_15px_rgba(0,217,255,0.05)]">
            <div className="flex items-center gap-2 font-mono font-bold text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>ZERO-KNOWLEDGE ARCHITECTURE VERIFIED</span>
            </div>
            <p className="text-[11px] font-sans leading-relaxed text-slate-300">
              Payloads are sealed directly within client memory using AES-256-GCM with PBKDF2 (100,000 rounds) before hitting the network. Server hosts possess zero cryptographic ability to read your family's nutritional history.
            </p>
          </div>

          {/* Passphrase Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>PRIVATE SECRET PASSPHRASE:</span>
              <span className="text-[10px] text-cyan-400 font-normal">PBKDF2 SHA-256 DERIVATION</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter private encryption passphrase (min 6 chars)..."
                className="w-full text-sm font-mono py-2.5 px-4 rounded-xl border border-cyan-500/30 bg-slate-950/80 text-cyan-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.1)]"
              />
            </div>
          </div>

          {/* Cloud Backup ID Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>CLOUD VAULT IDENTIFIER:</span>
              <button
                onClick={copyBackupId}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1 transition-colors"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId ? 'COPIED' : 'COPY ID'}</span>
              </button>
            </label>
            <input
              type="text"
              value={cloudBackupId}
              onChange={(e) => setCloudBackupId(e.target.value)}
              className="w-full text-xs font-mono py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900/80 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(0,245,160,0.15)]'
                  : 'bg-rose-950/40 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <GlowButton
              variant="primary"
              onClick={handleCloudBackup}
              disabled={isProcessing}
              className="w-full justify-center text-xs tracking-wider"
            >
              <CloudUpload className="w-4 h-4" />
              <span>{isProcessing ? 'ENCRYPTING & SYNCING...' : 'ENCRYPT & BACKUP'}</span>
            </GlowButton>

            <GlowButton
              variant="secondary"
              onClick={handleCloudRestore}
              disabled={isProcessing}
              className="w-full justify-center text-xs tracking-wider border-cyan-500/40 text-cyan-300"
            >
              <CloudDownload className="w-4 h-4 text-cyan-400" />
              <span>RESTORE FROM CLOUD ID</span>
            </GlowButton>
          </div>

          {/* Local Encrypted File Export */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              OFFLINE ENCRYPTED EXPORT (.foodlens.enc):
            </span>
            <button
              onClick={handleDownloadFile}
              className="px-3.5 py-1.5 border border-slate-700 hover:border-cyan-400/50 bg-slate-900/60 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 font-mono text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPORT CIPHER</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-cyan-500/20 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            RECORD COUNT: {history.length} ITEMS // {dailySummary.totalCalories} KCAL
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
