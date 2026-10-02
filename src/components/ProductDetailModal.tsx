import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Scale, 
  Heart, 
  Plus, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { FoodItem } from '../types/food';
import { sounds } from '../utils/notifications';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {food.brand} · {food.category}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {food.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Signal & Health Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className={`p-3.5 rounded-2xl border text-center ${
                food.consumptionSignal === 'GOOD'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : food.consumptionSignal === 'OK'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block">Continuous Intake</span>
              <span className="text-lg font-black tracking-wide">{food.consumptionSignal}</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Health Score</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{food.healthScore} / 100</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nutri-Grade</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">Grade {food.nutriGrade}</span>
            </div>
          </div>

          {/* Portion Adjuster */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                Adjust Intake Portion:
              </span>
              <span className="text-emerald-600 font-extrabold">{currentGrams} grams</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPortionMultiplier(Math.max(0.5, portionMultiplier - 0.25))}
                className="px-2.5 py-1 bg-white dark:bg-slate-700 border rounded-lg text-xs font-bold"
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
                className="flex-1 accent-emerald-600"
              />
              <button
                onClick={() => setPortionMultiplier(portionMultiplier + 0.25)}
                className="px-2.5 py-1 bg-white dark:bg-slate-700 border rounded-lg text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Detailed Nutritional Facts Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 font-bold text-xs text-slate-700 dark:text-slate-300">
              Nutritional Content (for {currentGrams}g portion)
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="px-4 py-2 flex justify-between">
                <span className="text-slate-500">Energy (Calories)</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{calc(food.calories)} kcal</span>
              </div>
              <div className="px-4 py-2 flex justify-between">
                <span className="text-slate-500">Total Sugar</span>
                <span className={`font-extrabold ${food.sugar > 20 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                  {calc(food.sugar)}g (~{(calc(food.sugar) / 4).toFixed(1)} spoons)
                </span>
              </div>
              <div className="px-4 py-2 flex justify-between">
                <span className="text-slate-500">Total Fats</span>
                <span className="font-bold text-slate-900 dark:text-white">{calc(food.totalFats)}g</span>
              </div>
              {food.saturatedFat !== undefined && (
                <div className="px-4 py-2 flex justify-between pl-8 bg-slate-50/50 dark:bg-slate-850">
                  <span className="text-slate-400">Saturated Fat</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{calc(food.saturatedFat)}g</span>
                </div>
              )}
              <div className="px-4 py-2 flex justify-between">
                <span className="text-slate-500">Protein</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{calc(food.protein)}g</span>
              </div>
              {food.sodium !== undefined && (
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-slate-500">Sodium / Salt</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{calc(food.sodium)}mg</span>
                </div>
              )}
              {food.caffeineMg !== undefined && food.caffeineMg > 0 && (
                <div className="px-4 py-2 flex justify-between text-rose-600 font-bold bg-rose-50/40 dark:bg-rose-950/20">
                  <span>Caffeine Content</span>
                  <span>{calc(food.caffeineMg)}mg (⚠️ 0mg safe limit for children)</span>
                </div>
              )}
            </div>
          </div>

          {/* Dataset Effects Callout (from PPT table) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-850">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Intended Benefits
              </span>
              <p className="text-slate-700 dark:text-slate-300">{food.positiveEffects}</p>
            </div>
            <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-850">
              <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Excess Intake Risk
              </span>
              <p className="text-slate-700 dark:text-slate-300">{food.excessIntakeEffects}</p>
            </div>
          </div>

          {/* Recommendations from Dataset */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recommended Consumption Protocol</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              <strong>Amount:</strong> {food.recommendedAmount} · <strong>Timing:</strong> {food.recommendedTime} · <strong>Frequency:</strong> {food.frequency}
            </p>
          </div>

          {/* Kid Suitability Action */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold font-fun text-amber-800 dark:text-amber-200 block">
                {food.kidSuitability.isRecommendedForKids ? '🧒 Safe & Wholesome for Kids' : '⚠️ Child Safety Alert Active'}
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                {food.kidSuitability.kidWarningText}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenKidVisualizer(food);
              }}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-fun font-bold text-xs rounded-xl shadow-sm shrink-0"
            >
              See Body Impact
            </button>
          </div>

          {/* Healthier Alternatives Section */}
          {food.healthierAlternatives.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Scientifically Curated Healthier Alternatives
              </span>
              <div className="space-y-2">
                {food.healthierAlternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {alt.name}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                          {alt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        {alt.benefitHighlight}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                        {alt.calories} kcal
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
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
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Portion: {currentGrams}g ({calc(food.calories)} kcal)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleLog}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log to Daily Health Habit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
