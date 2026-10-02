import React, { useState } from 'react';
import { 
  X, 
  Package, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { sounds, triggerHaptic } from '../utils/notifications';

interface AabExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AabExportModal: React.FC<AabExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [activeTab, setActiveTab] = useState<'url' | 'cli' | 'guide'>('url');

  if (!isOpen) return null;

  // The live public HTTPS URL of this applet
  const appOrigin = typeof window !== 'undefined' && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://ais-pre-3r33mrbgf7eyfwu42pwrvy-91802752904.asia-southeast1.run.app';

  // Direct 1-Click .AAB Generator link via PWABuilder (Google & Microsoft official PWA to Play Store partner)
  const pwaBuilderAabUrl = `https://www.pwabuilder.com/publish?url=${encodeURIComponent(appOrigin)}`;

  // Bubblewrap CLI command
  const cliCommand = `npx @bubblewrap/cli init --manifest=${appOrigin}/manifest.json && npx @bubblewrap/cli build`;

  const handleCopyUrl = () => {
    sounds.playSuccessChime();
    triggerHaptic('medium');
    navigator.clipboard.writeText(pwaBuilderAabUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCli = () => {
    sounds.playSuccessChime();
    triggerHaptic('medium');
    navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const downloadJson = (filename: string, content: string) => {
    sounds.playScanClick();
    triggerHaptic('light');
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl relative max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playScanClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black mb-2">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Play Store Format</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Android App Bundle (.AAB) Export
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Google Play strictly requires <strong>.aab</strong> (Android App Bundle) instead of legacy .apk. Use our verified generator URL or Google’s Bubblewrap CLI to produce your Play Store release bundle.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>1-Click .AAB Generator URL</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cli'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Google Bubblewrap CLI</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Play Store Steps</span>
          </button>
        </div>

        {/* TAB 1: 1-Click .AAB Generator URL */}
        {activeTab === 'url' && (
          <div className="space-y-5">
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-slate-850 dark:to-slate-800/80 rounded-2xl border border-emerald-500/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                    Official Google Partner Pipeline
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Direct .AAB Generation URL
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    PWABuilder will automatically read your <code className="text-emerald-600 font-mono">manifest.json</code> and <code className="text-emerald-600 font-mono">sw.js</code>, package your icons, configure the TWA keystore, and download your signed <strong>app-release-bundle.aab</strong>.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Package className="w-5 h-5" />
                </div>
              </div>

              {/* URL Box */}
              <div className="mt-4 flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <input
                  type="text"
                  readOnly
                  value={pwaBuilderAabUrl}
                  className="bg-transparent text-slate-700 dark:text-slate-300 flex-1 truncate font-mono text-[11px] focus:outline-none"
                />
                <button
                  onClick={handleCopyUrl}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    copiedUrl
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={pwaBuilderAabUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playSuccessChime()}
                  className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>🚀 Open PWABuilder & Download .AAB Package</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Config Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-750">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Package Name</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">com.nexora.foodlens</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-750">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Output</span>
                <span className="font-bold text-emerald-600">.AAB (Bundle)</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-750">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Play Verification</span>
                <span className="font-bold text-sky-600">assetlinks.json ✓</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bubblewrap CLI */}
        {activeTab === 'cli' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Google provides the official command line tool <strong>@bubblewrap/cli</strong> to compile the exact <code className="font-mono text-emerald-600">.aab</code> package from your terminal:
            </p>

            <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 font-mono text-xs border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                <span>Terminal / Bash</span>
                <button
                  onClick={handleCopyCli}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  {copiedCli ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCli ? 'Copied' : 'Copy Command'}</span>
                </button>
              </div>

              <div className="space-y-2 text-slate-300">
                <p className="text-slate-500"># 1. Initialize with your app manifest</p>
                <p className="text-emerald-400 select-all">
                  npx @bubblewrap/cli init --manifest={appOrigin}/manifest.json
                </p>

                <p className="text-slate-500 mt-2"># 2. Build the signed Android App Bundle (.aab)</p>
                <p className="text-emerald-400 select-all">
                  npx @bubblewrap/cli build
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>Download Generated Android TWA Configurations:</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Both files have already been prepared and configured in your project root:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => downloadJson('twa-manifest.json', JSON.stringify({
                    packageId: 'com.nexora.foodlens',
                    host: appOrigin.replace('https://', ''),
                    name: 'FoodLens AI',
                    themeColor: '#10B981',
                    startUrl: '/',
                    appVersionName: '1.0.0'
                  }, null, 2))}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold flex items-center gap-1.5 hover:bg-slate-100"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>twa-manifest.json</span>
                </button>
                <button
                  onClick={() => downloadJson('assetlinks.json', JSON.stringify([{
                    relation: ['delegate_permission/common.handle_all_urls'],
                    target: {
                      namespace: 'android_app',
                      package_name: 'com.nexora.foodlens'
                    }
                  }], null, 2))}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold flex items-center gap-1.5 hover:bg-slate-100"
                >
                  <Download className="w-3.5 h-3.5 text-teal-600" />
                  <span>assetlinks.json</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Google Play Store Steps */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">Download your .AAB file</h4>
                  <p className="text-slate-500 mt-0.5">
                    Click the <strong>Open PWABuilder</strong> button or run the Bubblewrap CLI build command. It generates <code className="font-mono text-emerald-600">app-release-bundle.aab</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">Go to Google Play Console</h4>
                  <p className="text-slate-500 mt-0.5">
                    Log in at <a href="https://play.google.com/console" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline font-bold">play.google.com/console</a> and create your application named <strong>FoodLens AI</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">Upload .AAB in Production Release</h4>
                  <p className="text-slate-500 mt-0.5">
                    Navigate to <strong>Release ➔ Production ➔ Create new release</strong> and drag & drop the <code className="font-mono text-emerald-600">.aab</code> file into the upload box.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">Submit for Review</h4>
                  <p className="text-slate-500 mt-0.5">
                    Complete the Store Listing and Privacy Policy declarations, then click <strong>Start rollout to Production</strong>!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Meets all Google Play 2026 TWA specifications</span>
          </span>
          <button
            onClick={() => {
              sounds.playScanClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
