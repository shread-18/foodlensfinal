import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Layers, 
  Database, 
  Calculator, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  Lock
} from 'lucide-react';
import { evaluateFoodNutrition } from '../services/nutritionAlgorithm';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                FoodLens AI Algorithm & Model Transparency Engine
              </h2>
              <p className="text-[11px] text-slate-500">
                Team Nexora · Multi-tier Nutrition & Pediatric Safety Formulation
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Architecture Overview */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              End-to-End Pipeline & Training Methodology
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-900 dark:text-white">1. Package Capture</span>
                <span className="text-[10px] text-slate-500">AR Camera / User Photo</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-900 dark:text-white">2. Neural OCR</span>
                <span className="text-[10px] text-slate-500">Gemini 3.8 Flash Vision</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-900 dark:text-white">3. Nexora Scoring</span>
                <span className="text-[10px] text-slate-500">Continuous Consumption Alg</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-900 dark:text-white">4. Child Shield</span>
                <span className="text-[10px] text-slate-500">Sugar & Azo-Dye Penalty</span>
              </div>
            </div>
          </div>

          {/* Mathematical Formulations */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Mathematical Scoring Formulations
            </h3>
            <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl space-y-2 overflow-x-auto shadow-inner">
              <p className="text-slate-400">// Overall Food Health Score (0 - 100)</p>
              <p>HealthScore = 100 - (P_sugar + P_satFat + P_sodium + P_additives) + B_protein</p>
              <p className="text-slate-400 mt-2">// Non-linear sugar penalty curve (accelerates beyond 15g):</p>
              <p>{evaluation.formulas.sugarFormula}</p>
              <p className="text-slate-400 mt-2">// Child Safety Hazard Index (WHO 24g free sugar daily baseline):</p>
              <p>{evaluation.formulas.kidSafetyFormula}</p>
            </div>
          </div>

          {/* Continuous Consumption Signal Classification Rules */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Continuous Consumption Decision Matrix:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>GOOD (Green)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  HealthScore ≥ 70, Sugar ≤ 16g, Sodium ≤ 500mg. Safe for regular, continuous daily meals (e.g. Fresh Paneer, Oats, Apple).
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>OK (Yellow)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  HealthScore 50-69, moderate natural sugars or fats. Suitable for occasional intake (e.g. Pure Honey, Protein Bars).
                </p>
              </div>

              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl">
                <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>BAD (Red)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  HealthScore &lt; 48, Sugar &gt; 28g, Sodium &gt; 750mg, or high artificial additives. Continuous use is harmful (e.g. Maggi, Kinder Joy, Soda).
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Interactive Algorithm Sandbox */}
          <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  Live Algorithm Sandbox
                </h3>
                <p className="text-xs text-slate-500">
                  Tweak nutrient parameters below to observe real-time score and signal reaction:
                </p>
              </div>

              {/* Dynamic Output Badge */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-white dark:bg-slate-800 border rounded-xl font-black text-sm">
                  Score: {evaluation.finalScore} / 100
                </div>
                <div
                  className={`px-3 py-1 rounded-xl text-xs font-black text-white ${
                    evaluation.signal === 'GOOD'
                      ? 'bg-emerald-600'
                      : evaluation.signal === 'OK'
                      ? 'bg-amber-500'
                      : 'bg-rose-600'
                  }`}
                >
                  {evaluation.signal}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Sugar Content: {sandboxSugar}g</span>
                  <span className="text-rose-500">Penalty: -{evaluation.sugarPenalty}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="65"
                  value={sandboxSugar}
                  onChange={(e) => setSandboxSugar(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Sodium: {sandboxSodium}mg</span>
                  <span className="text-amber-500">Penalty: -{evaluation.sodiumPenalty}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  step="50"
                  value={sandboxSodium}
                  onChange={(e) => setSandboxSodium(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Total Fat: {sandboxFat}g</span>
                  <span className="text-amber-500">Penalty: -{evaluation.saturatedFatPenalty}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={sandboxFat}
                  onChange={(e) => setSandboxFat(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Protein: {sandboxProtein}g</span>
                  <span className="text-emerald-500">Bonus: +{evaluation.proteinBonus}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={sandboxProtein}
                  onChange={(e) => setSandboxProtein(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Close Model Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
