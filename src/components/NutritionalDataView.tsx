import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Scale, 
  Clock, 
  ArrowRight, 
  Plus, 
  Swords, 
  ShieldAlert, 
  ShieldCheck, 
  Heart,
  RotateCcw
} from 'lucide-react';
import { FoodItem } from '../types/food';
import { sounds } from '../utils/notifications';

interface NutritionalDataViewProps {
  food: FoodItem;
  onOpenKidsBugBattle: () => void;
  onLogToDailyGoals: (food: FoodItem, grams: number) => void;
  onRescan: () => void;
  onSwapAlternative: (altName: string) => void;
}

export const NutritionalDataView: React.FC<NutritionalDataViewProps> = ({
  food,
  onOpenKidsBugBattle,
  onLogToDailyGoals,
  onRescan,
  onSwapAlternative,
}) => {
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const currentGrams = Math.round(100 * portionMultiplier);

  const calc = (val: number | undefined) => {
    if (val === undefined) return 0;
    return Math.round(val * portionMultiplier * 10) / 10;
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case 'GOOD':
        return 'bg-emerald-600 text-white border-emerald-400';
      case 'OK':
        return 'bg-amber-500 text-white border-amber-400';
      case 'BAD':
      default:
        return 'bg-rose-600 text-white border-rose-400';
    }
  };

  const getNutriColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-600 text-white';
      case 'B': return 'bg-lime-500 text-white';
      case 'C': return 'bg-amber-400 text-slate-900';
      case 'D': return 'bg-orange-500 text-white';
      case 'E':
      default: return 'bg-rose-600 text-white';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner & Next Kids Animation Action */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {food.brand} · {food.category}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${getNutriColor(food.nutriGrade)}`}>
              Grade {food.nutriGrade}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {food.name}
          </h1>
          <p className="text-xs text-slate-500">
            Nutritional analysis & safety report for {currentGrams}g portion
          </p>
        </div>

        {/* PROMINENT NEXT BUTTON: Kids Mode Animation */}
        <button
          onClick={() => {
            sounds.playScanClick();
            onOpenKidsBugBattle();
          }}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-fun font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all"
        >
          <Swords className="w-4 h-4 text-yellow-200" />
          <span>Next: See Kids Bug Battle Animation! 🐛</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Signal Banner */}
      <div
        className={`p-5 rounded-3xl border ${
          food.consumptionSignal === 'GOOD'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : food.consumptionSignal === 'OK'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {food.consumptionSignal === 'GOOD' ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">Continuous Intake Recommendation:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-black text-xs ${getSignalBadge(food.consumptionSignal)}`}>
                  {food.consumptionSignal}
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed">
                <strong>Intake Protocol:</strong> {food.recommendedAmount} during {food.recommendedTime} ({food.frequency}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onLogToDailyGoals(food, currentGrams)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Intake</span>
            </button>
            <button
              onClick={onRescan}
              className="px-3 py-2 bg-white/60 dark:bg-slate-800/60 hover:bg-white text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition-all"
              title="Scan another food"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Other</span>
            </button>
          </div>
        </div>
      </div>

      {/* Portion Slider */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center text-xs font-bold mb-2">
          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-emerald-600" />
            Adjust Portion Size:
          </span>
          <span className="text-emerald-600 font-extrabold text-sm">{currentGrams} grams</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.25"
          value={portionMultiplier}
          onChange={(e) => setPortionMultiplier(parseFloat(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>50g (Bite)</span>
          <span>100g (Standard)</span>
          <span>200g (Double)</span>
          <span>300g (Bowl)</span>
        </div>
      </div>

      {/* Nutrition Facts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Energy</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            {calc(food.calories)}
          </span>
          <span className="text-xs text-slate-500">kcal</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Sugar</span>
          <span className={`text-2xl font-extrabold mt-1 block ${calc(food.sugar) > 20 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
            {calc(food.sugar)}g
          </span>
          <span className="text-xs text-slate-500">
            ~{(calc(food.sugar) / 4).toFixed(1)} spoons
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Fats</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            {calc(food.totalFats)}g
          </span>
          <span className="text-xs text-slate-500">
            Sat: {calc(food.saturatedFat)}g
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Protein</span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {calc(food.protein)}g
          </span>
          <span className="text-xs text-slate-500">Muscle Fuel</span>
        </div>
      </div>

      {/* Effects & Risks Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Nutritional Benefits
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {food.positiveEffects}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Excess Consumption Risks
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {food.excessIntakeEffects}
          </p>
        </div>
      </div>

      {/* Kid Safety Verdict */}
      <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-3xl border border-amber-200 dark:border-amber-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-fun font-bold text-sm text-amber-900 dark:text-amber-200">
              🧒 Kids & Minor Safety Verdict:
            </span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                food.kidSuitability.isRecommendedForKids
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {food.kidSuitability.isRecommendedForKids ? 'Safe for Kids' : '🚫 Not for Kids'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {food.kidSuitability.kidWarningText}
          </p>
        </div>

        <button
          onClick={onOpenKidsBugBattle}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-fun font-bold text-xs rounded-2xl shadow-sm shrink-0 flex items-center gap-1.5 transition-all"
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Play Bug Battle Animation</span>
        </button>
      </div>

      {/* Healthier Alternatives */}
      {food.healthierAlternatives.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Smart Healthier Alternatives
            </h3>
            <span className="text-xs text-emerald-600 font-semibold">Recommended Swaps</span>
          </div>

          <div className="space-y-2">
            {food.healthierAlternatives.map((alt, i) => (
              <div
                key={i}
                className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {alt.name}
                    </h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                      {alt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {alt.benefitHighlight}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      {alt.calories} kcal
                    </span>
                    <span className="text-[10px] text-slate-500">{alt.sugar}g sugar</span>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playSuccessChime();
                      onSwapAlternative(alt.name);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
