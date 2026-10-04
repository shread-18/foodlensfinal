import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Scale, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Zap,
  Activity
} from 'lucide-react';
import { FoodItem } from '../types/food';
import { sounds } from '../utils/notifications';
import { StatusBadge } from './ui/StatusBadge';
import { GlowButton } from './ui/GlowButton';

interface ProductDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onLogFood: (food: FoodItem, grams: number) => void;
  onOpenKidVisualizer: (food: FoodItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  food,
  onClose,
  onLogFood,
  onOpenKidVisualizer,
}) => {
  if (!food) return null;

  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const baseGrams = 100;
  const currentGrams = Math.round(baseGrams * portionMultiplier);

  const calc = (val: number | undefined) => {
    if (val === undefined) return 0;
    return Math.round(val * portionMultiplier * 10) / 10;
  };

  const handleLog = () => {
    sounds.playSuccessChime();
    onLogFood(food, currentGrams);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,217,255,0.15)] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Futuristic corner brackets */}
        <div className="corner-bracket-tl !border-cyan-400" />
        <div className="corner-bracket-tr !border-cyan-400" />
        <div className="corner-bracket-bl !border-cyan-400" />
        <div className="corner-bracket-br !border-cyan-400" />

        {/* Top Glow Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(0,217,255,0.6)]" />

        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                {food.brand} // {food.category}
              </span>
              <StatusBadge label={`GRADE ${food.nutriGrade}`} variant="ready" dotColor="bg-cyan-400" />
            </div>
            <h2 className="text-xl font-heading font-extrabold text-white tracking-wide mt-0.5">
              {food.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-110"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Signal & Health Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className={`p-4 rounded-2xl border text-center ${
                food.consumptionSignal === 'GOOD'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(0,245,160,0.15)]'
                  : food.consumptionSignal === 'OK'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider block text-slate-400">Continuous Intake</span>
              <span className="text-lg font-heading font-black tracking-wider">{food.consumptionSignal}</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Health Score</span>
              <span className="text-lg font-heading font-black text-emerald-400">
                {food.healthScore} <span className="text-xs font-mono text-slate-500">/ 100</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Nutri-Grade</span>
              <span className="text-lg font-heading font-black text-cyan-300">Grade {food.nutriGrade}</span>
            </div>
          </div>

          {/* Portion Adjuster */}
          <div className="p-4 glass-panel rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-slate-300 flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                CALIBRATE INTAKE PORTION:
              </span>
              <span className="text-cyan-400 font-extrabold px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                {currentGrams} grams
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPortionMultiplier(Math.max(0.5, portionMultiplier - 0.25))}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-sm border border-slate-700 flex items-center justify-center transition-colors"
              >
                -
              </button>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.25"
                value={portionMultiplier}
                onChange={(e) => setPortionMultiplier(parseFloat(e.target.value))}
                className="flex-1 accent-cyan-400 cursor-pointer"
              />
              <button
                onClick={() => setPortionMultiplier(portionMultiplier + 0.25)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-sm border border-slate-700 flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Detailed Nutritional Facts Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden glass-panel">
            <div className="bg-slate-900/80 px-4 py-3 font-mono font-bold text-xs text-cyan-300 border-b border-slate-800 flex items-center justify-between">
              <span>NUTRITIONAL TELEMETRY (CALCULATED FOR {currentGrams}G)</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
            <div className="divide-y divide-slate-800/60 text-xs font-mono">
              <div className="px-4 py-2.5 flex justify-between items-center hover:bg-slate-900/40">
                <span className="text-slate-400">Energy (Calories)</span>
                <span className="font-bold text-white text-sm">{calc(food.calories)} kcal</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between items-center hover:bg-slate-900/40">
                <span className="text-slate-400">Total Free Sugar</span>
                <span className={`font-bold ${food.sugar > 20 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {calc(food.sugar)}g (~{(calc(food.sugar) / 4).toFixed(1)} spoons)
                </span>
              </div>
              <div className="px-4 py-2.5 flex justify-between items-center hover:bg-slate-900/40">
                <span className="text-slate-400">Total Fats</span>
                <span className="font-bold text-slate-200">{calc(food.totalFats)}g</span>
              </div>
              {food.saturatedFat !== undefined && (
                <div className="px-4 py-2 flex justify-between items-center pl-8 bg-slate-950/40 text-[11px]">
                  <span className="text-slate-500">Saturated Lipids</span>
                  <span className="text-slate-300">{calc(food.saturatedFat)}g</span>
                </div>
              )}
              <div className="px-4 py-2.5 flex justify-between items-center hover:bg-slate-900/40">
                <span className="text-slate-400">Protein Synthesis</span>
                <span className="font-bold text-emerald-400">{calc(food.protein)}g</span>
              </div>
              {food.sodium !== undefined && (
                <div className="px-4 py-2.5 flex justify-between items-center hover:bg-slate-900/40">
                  <span className="text-slate-400">Sodium / Salt Content</span>
                  <span className="font-bold text-slate-300">{calc(food.sodium)}mg</span>
                </div>
              )}
              {food.caffeineMg !== undefined && food.caffeineMg > 0 && (
                <div className="px-4 py-2.5 flex justify-between items-center text-rose-400 font-bold bg-rose-950/20">
                  <span>Caffeine Content</span>
                  <span>{calc(food.caffeineMg)}mg (⚠️ 0mg safe limit for children)</span>
                </div>
              )}
            </div>
          </div>

          {/* Dataset Effects Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/30">
              <span className="font-heading font-bold text-emerald-300 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Intended Benefits
              </span>
              <p className="text-slate-300 leading-relaxed">{food.positiveEffects}</p>
            </div>
            <div className="p-4 bg-rose-950/20 rounded-2xl border border-rose-500/30">
              <span className="font-heading font-bold text-rose-300 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Excess Intake Risk
              </span>
              <p className="text-slate-300 leading-relaxed">{food.excessIntakeEffects}</p>
            </div>
          </div>

          {/* Recommendations from Dataset */}
          <div className="p-4 glass-panel rounded-2xl border border-slate-800 text-xs space-y-1.5 font-mono">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>RECOMMENDED INTAKE PROTOCOL</span>
            </div>
            <p className="text-slate-300">
              <span className="text-slate-500">PORTION:</span> {food.recommendedAmount} · <span className="text-slate-500">TIMING:</span> {food.recommendedTime} · <span className="text-slate-500">FREQ:</span> {food.frequency}
            </p>
          </div>

          {/* Kid Suitability Action */}
          <div className="p-4 bg-amber-950/30 rounded-2xl border border-amber-500/40 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-heading font-bold text-amber-300 block">
                {food.kidSuitability.isRecommendedForKids ? '🧒 Safe & Wholesome for Kids' : '⚠️ Child Safety Alert Active'}
              </span>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {food.kidSuitability.kidWarningText}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenKidVisualizer(food);
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(245,158,11,0.4)] shrink-0 transition-all hover:scale-105"
            >
              See Body Impact
            </button>
          </div>

          {/* Healthier Alternatives Section */}
          {food.healthierAlternatives.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                SCIENTIFICALLY CURATED HEALTHIER ALTERNATIVES
              </span>
              <div className="space-y-2.5">
                {food.healthierAlternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-900/60 rounded-2xl border border-emerald-500/30 hover:border-emerald-400 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-xs text-white">
                          {alt.name}
                        </h4>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {alt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {alt.benefitHighlight}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3 font-mono">
                      <span className="text-xs font-extrabold text-emerald-400 block">
                        {alt.calories} kcal
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {alt.sugar}g sugar
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Actions */}
        <div className="px-6 py-4 border-t border-cyan-500/20 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            PORTION: {currentGrams}g ({calc(food.calories)} kcal)
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all"
            >
              CANCEL
            </button>
            <GlowButton
              variant="primary"
              onClick={handleLog}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>LOG TO DAILY HABITS</span>
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
  );
};
