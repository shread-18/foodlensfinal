import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  CloudUpload, 
  CloudDownload, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { encryptRecords, decryptRecords, saveToCloudVault, loadFromCloudVault } from '../services/cryptoBackup';
import { ScanHistoryItem, DailySummary } from '../types/food';
import { sounds } from '../utils/notifications';

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
      setStatusMessage({ type: 'error', text: 'Passphrase must be at least 6 characters for strong 256-bit key derivation.' });
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
        text: `Encrypted backup successfully synced to Cloud Vault! Your Backup ID is: ${cloudBackupId}`,
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
          text: `Success! Decrypted and restored ${decryptedData.history?.length || 0} records from zero-knowledge vault.`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                End-to-End Encrypted Cloud Vault
              </h2>
              <p className="text-[11px] text-slate-500">
                AES-256-GCM Zero-Knowledge Storage for Minor & Family Health Data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Zero-Knowledge Privacy Guarantee */}
          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Zero-Knowledge Architecture Verified</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              All records are encrypted in your local browser using AES-256-GCM before transmission. Even server administrators cannot inspect your family's food logs or nutritional history without your secret passphrase.
            </p>
          </div>

          {/* Passphrase Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Personal Secret Passphrase:</span>
              <span className="text-[10px] text-slate-400 font-normal">Used for PBKDF2 Key Derivation</span>
            </label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter strong private passphrase..."
              className="w-full text-sm py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Cloud Backup ID Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Cloud Vault ID:</span>
              <button
                onClick={copyBackupId}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
              >
                {copiedId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
              </button>
            </label>
            <input
              type="text"
              value={cloudBackupId}
              onChange={(e) => setCloudBackupId(e.target.value)}
              className="w-full text-xs font-mono py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCloudBackup}
              disabled={isProcessing}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CloudUpload className="w-4 h-4" />
              <span>{isProcessing ? 'Encrypting & Syncing...' : 'Encrypt & Backup to Cloud'}</span>
            </button>

            <button
              onClick={handleCloudRestore}
              disabled={isProcessing}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CloudDownload className="w-4 h-4 text-indigo-500" />
              <span>Restore from Cloud ID</span>
            </button>
          </div>

          {/* Local Encrypted File Export */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Offline local encrypted export (.foodlens.enc):
            </span>
            <button
              onClick={handleDownloadFile}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export File</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
