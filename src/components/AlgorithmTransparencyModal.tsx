import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Layers, 
  Calculator, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  Activity,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { evaluateFoodNutrition } from '../services/nutritionAlgorithm';
import { StatusBadge } from './ui/StatusBadge';
import { GlowButton } from './ui/GlowButton';

interface AlgorithmTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmTransparencyModal: React.FC<AlgorithmTransparencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Interactive sandbox state
  const [sandboxSugar, setSandboxSugar] = useState<number>(25);
  const [sandboxFat, setSandboxFat] = useState<number>(12);
  const [sandboxSodium, setSandboxSodium] = useState<number>(450);
  const [sandboxProtein, setSandboxProtein] = useState<number>(6);
  const [sandboxCaffeine, setSandboxCaffeine] = useState<number>(0);
  const [sandboxAdditives, setSandboxAdditives] = useState<number>(1);

  const evaluation = evaluateFoodNutrition({
    sugar: sandboxSugar,
    totalFats: sandboxFat,
    saturatedFat: sandboxFat * 0.45,
    sodium: sandboxSodium,
    protein: sandboxProtein,
    caffeineMg: sandboxCaffeine,
    kidSuitability: {
      isRecommendedForKids: true,
      minimumAge: 5,
      hazardLevel: 'low',
      kidWarningText: '',
      sugarSpoonsCount: sandboxSugar / 4,
      harmfulAdditives: Array.from({ length: sandboxAdditives }).map((_, i) => `Additive_${i + 1}`),
      visualHarmEffects: [],
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,245,160,0.15)] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Futuristic corner brackets */}
        <div className="corner-bracket-tl !border-emerald-400" />
        <div className="corner-bracket-tr !border-emerald-400" />
        <div className="corner-bracket-bl !border-emerald-400" />
        <div className="corner-bracket-br !border-emerald-400" />

        {/* Top Glow Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(0,245,160,0.6)]" />

        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(0,245,160,0.2)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-heading font-extrabold text-white tracking-wide">
                  FoodLens AI Algorithm & Model Transparency Engine
                </h2>
                <StatusBadge label="VERIFIED" variant="online" />
              </div>
              <p className="text-[11px] font-mono text-slate-400 tracking-wider">
                SYS.CORE // MULTI-TIER NUTRITION & PEDIATRIC FORMULATION (TEAM NEXORA)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-110"
            title="Close inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Architecture Overview */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
            <h3 className="font-mono text-xs uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2 font-bold">
              <Layers className="w-4 h-4" />
              END-TO-END PIPELINE & INFERENCE METHODOLOGY
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
                <span className="font-heading font-bold block text-white">1. PACKAGE CAPTURE</span>
                <span className="text-[10px] font-mono text-slate-400">AR Camera / Image File</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
                <span className="font-heading font-bold block text-cyan-400">2. NEURAL OCR</span>
                <span className="text-[10px] font-mono text-slate-400">Gemini 2.5 Flash Vision</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-colors">
                <span className="font-heading font-bold block text-emerald-400">3. NEXORA SCORING</span>
                <span className="text-[10px] font-mono text-slate-400">Continuous Intake Alg</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-colors">
                <span className="font-heading font-bold block text-amber-400">4. CHILD SHIELD</span>
                <span className="text-[10px] font-mono text-slate-400">Sugar & Azo-Dye Penalty</span>
              </div>
            </div>
          </div>

          {/* Mathematical Formulations */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Mathematical Scoring Formulations
            </h3>
            <div className="p-5 bg-slate-950/90 text-emerald-400 font-mono text-xs rounded-2xl space-y-2 border border-emerald-500/30 overflow-x-auto shadow-inner">
              <p className="text-slate-400">// Primary Food Health Score Formulation (0 - 100)</p>
              <p className="text-cyan-300 font-bold">HealthScore = 100 - (P_sugar + P_satFat + P_sodium + P_additives) + B_protein</p>
              <p className="text-slate-400 mt-2">// Non-linear sugar penalty curve (accelerates exponentially beyond 15g threshold):</p>
              <p className="text-amber-300">{evaluation.formulas.sugarFormula}</p>
              <p className="text-slate-400 mt-2">// Pediatric Safety Hazard Index (WHO 24g free sugar daily baseline):</p>
              <p className="text-rose-300">{evaluation.formulas.kidSafetyFormula}</p>
            </div>
          </div>

          {/* Continuous Consumption Signal Classification Rules */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Continuous Consumption Decision Matrix:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-heading font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>GOOD (Green)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  HealthScore ≥ 70, Sugar ≤ 16g, Sodium ≤ 500mg. Safe for regular, continuous daily consumption (Fresh Paneer, Oats, Pure Milk).
                </p>
              </div>

              <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-heading font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>OK (Yellow)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  HealthScore 50-69, moderate natural sugars or fats. Suitable for occasional intake (Yoga Bar, Pure Honey).
                </p>
              </div>

              <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-heading font-bold text-rose-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>BAD (Red)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  HealthScore &lt; 48, Sugar &gt; 28g, Sodium &gt; 750mg, or artificial additives. Strictly limit (Maggi, Kurkure, Kinder Joy).
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Interactive Algorithm Sandbox */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Live Algorithm Sandbox
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Tweak nutrient parameters to observe real-time score and signal calibration:
                </p>
              </div>

              {/* Dynamic Output Badge */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl font-mono font-bold text-sm text-white">
                  Score: <span className="text-emerald-400">{evaluation.finalScore}</span> / 100
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black ${
                    evaluation.signal === 'GOOD'
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(0,245,160,0.5)]'
                      : evaluation.signal === 'OK'
                      ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                  }`}
                >
                  {evaluation.signal}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono font-semibold">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex justify-between mb-1.5">
                  <span className="text-slate-300">Sugar Content: {sandboxSugar}g</span>
                  <span className="text-rose-400">Penalty: -{evaluation.sugarPenalty}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="65"
                  value={sandboxSugar}
                  onChange={(e) => setSandboxSugar(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex justify-between mb-1.5">
                  <span className="text-slate-300">Sodium: {sandboxSodium}mg</span>
                  <span className="text-amber-400">Penalty: -{evaluation.sodiumPenalty}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  step="50"
                  value={sandboxSodium}
                  onChange={(e) => setSandboxSodium(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex justify-between mb-1.5">
                  <span className="text-slate-300">Total Fat: {sandboxFat}g</span>
                  <span className="text-amber-400">Penalty: -{evaluation.saturatedFatPenalty}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={sandboxFat}
                  onChange={(e) => setSandboxFat(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex justify-between mb-1.5">
                  <span className="text-slate-300">Protein: {sandboxProtein}g</span>
                  <span className="text-emerald-400">Bonus: +{evaluation.proteinBonus}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={sandboxProtein}
                  onChange={(e) => setSandboxProtein(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-emerald-500/20 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            NEXORA ENGINE // DETERMINISTIC NUTRITION SCORING ACTIVE
          </span>
          <GlowButton
            variant="primary"
            onClick={onClose}
            className="text-xs"
          >
            DISMISS MODEL INSPECTOR
          </GlowButton>
        </div>
      </div>
    </div>
  );
};
