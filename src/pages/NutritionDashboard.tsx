import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Scale, 
  PieChart as PieIcon, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowLeftRight, 
  Plus, 
  ShieldCheck, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { lookupIngredient } from '../data/ingredientsData';
import { sounds } from '../utils/notifications';

export const NutritionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentFood, setCurrentFood, logFoodToIntake, dailyGoals } = useApp();

  const [portionGrams, setPortionGrams] = useState<number>(100);
  const [comparisonFood, setComparisonFood] = useState<FoodItem>(
    OFFICIAL_HACKATHON_DATASET.find((f) => f.id !== currentFood.id) || OFFICIAL_HACKATHON_DATASET[1]
  );
  const [activeChartTab, setActiveChartTab] = useState<'macros' | 'dv'>('macros');

  const ratio = portionGrams / 100;
  const calories = Math.round(currentFood.calories * ratio);
  const sugar = Math.round(currentFood.sugar * ratio * 10) / 10;
  const fats = Math.round(currentFood.totalFats * ratio * 10) / 10;
  const satFat = Math.round((currentFood.saturatedFat ?? currentFood.totalFats * 0.4) * ratio * 10) / 10;
  const protein = Math.round(currentFood.protein * ratio * 10) / 10;
  const sodium = Math.round((currentFood.sodium ?? 250) * ratio);
  const fiber = Math.round((currentFood.fiber ?? 2.5) * ratio * 10) / 10;

  // Macro calculation for Pie Chart
  const totalMacroGrams = Math.max(1, sugar + fats + protein);
  const sugarPct = Math.round((sugar / totalMacroGrams) * 100);
  const fatPct = Math.round((fats / totalMacroGrams) * 100);
  const proteinPct = Math.max(0, 100 - sugarPct - fatPct);

  // Daily Value (% DV) Baselines
  const dvCalories = Math.min(100, Math.round((calories / (dailyGoals.calories || 1800)) * 100));
  const dvSugar = Math.round((sugar / (dailyGoals.maxSugar || 24)) * 100);
  const dvSatFat = Math.round((satFat / 20) * 100); // 20g standard DV for sat fat
  const dvSodium = Math.round((sodium / 2000) * 100); // 2000mg standard DV
  const dvProtein = Math.round((protein / (dailyGoals.protein || 45)) * 100);

  // Extract ingredients to look up
  const rawIngredients = currentFood.ingredientsList && currentFood.ingredientsList.length > 0
    ? currentFood.ingredientsList
    : ['Palm oil', 'Wheat flour', 'Sugar', 'Tartrazine', 'Monosodium glutamate', 'Soy lecithin', 'Iodized salt'];

  const explainedIngredients = rawIngredients.map((ing) => lookupIngredient(ing));

  const handleSelectCompare = (foodId: string) => {
    const selected = OFFICIAL_HACKATHON_DATASET.find((f) => f.id === foodId);
    if (selected) {
      setComparisonFood(selected);
      sounds.playScanClick();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Dashboard 2 · Comprehensive Nutrition Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Nutritional Data & Ingredient Explainer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Macronutrient distribution, percent daily value bars, additive risk breakdown, and side-by-side food comparison.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              logFoodToIntake(currentFood, portionGrams);
              sounds.playSuccessChime();
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log ({portionGrams}g) to Goals</span>
          </button>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Spotlight & Portion Slider */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                {currentFood.brand} · {currentFood.category}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {currentFood.name}
              </h2>
            </div>
            <span className={`px-2.5 py-1 rounded-xl text-xs font-black text-white ${
              currentFood.consumptionSignal === 'GOOD' ? 'bg-emerald-600' : currentFood.consumptionSignal === 'OK' ? 'bg-amber-500' : 'bg-rose-600'
            }`}>
              {currentFood.consumptionSignal}
            </span>
          </div>

          {/* Portion Size Slider */}
          <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-teal-600" />
                Selected Portion:
              </span>
              <span className="text-teal-600 font-extrabold text-sm">{portionGrams}g</span>
            </div>
            <input
              type="range"
              min="25"
              max="250"
              step="25"
              value={portionGrams}
              onChange={(e) => setPortionGrams(parseInt(e.target.value, 10))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>25g (Small)</span>
              <span>100g (Standard)</span>
              <span>250g (Large)</span>
            </div>
          </div>

          {/* Nutrients List Table */}
          <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 font-medium">Calories</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{calories} kcal</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 font-medium">Free Sugars</span>
              <span className={`font-extrabold ${sugar > 20 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                {sugar}g (~{(sugar / 4).toFixed(1)} spoons)
              </span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 font-medium">Total Fats</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{fats}g</span>
            </div>
            <div className="pt-2 flex justify-between pl-4">
              <span className="text-slate-400">Saturated Fat</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{satFat}g</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 font-medium">Protein</span>
              <span className="font-extrabold text-emerald-600">{protein}g</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 font-medium">Dietary Fiber</span>
              <span className="font-semibold text-teal-600">{fiber}g</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 font-medium">Sodium</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{sodium}mg</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 font-medium">Vitamins & Minerals</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {currentFood.vitamins?.join(', ') || 'Calcium (10%), Iron (8%)'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Macro Pie/Bar Charts & % Daily Value Progress */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            {/* Chart Mode Toggle */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveChartTab('macros')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    activeChartTab === 'macros'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <PieIcon className="w-3.5 h-3.5" />
                  <span>Macronutrient Ratio Chart</span>
                </button>

                <button
                  onClick={() => setActiveChartTab('dv')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    activeChartTab === 'dv'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>% of Daily Value (% DV)</span>
                </button>
              </div>

              <span className="text-xs text-slate-400 font-mono">Normalized to {portionGrams}g</span>
            </div>

            {/* View 1: Macro Ratio Visualizer */}
            {activeChartTab === 'macros' && (
              <div className="mt-6 space-y-6">
                {/* Horizontal Macro Stack Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Macro Calorie Composition</span>
                    <span>100% Total Fuel</span>
                  </div>
                  <div className="h-6 w-full rounded-2xl overflow-hidden flex bg-slate-100 dark:bg-slate-800">
                    <div style={{ width: `${proteinPct}%` }} className="bg-emerald-500 h-full transition-all" title={`Protein: ${proteinPct}%`} />
                    <div style={{ width: `${fatPct}%` }} className="bg-amber-500 h-full transition-all" title={`Fats: ${fatPct}%`} />
                    <div style={{ width: `${sugarPct}%` }} className="bg-rose-500 h-full transition-all" title={`Sugars: ${sugarPct}%`} />
                  </div>
                </div>

                {/* 3 Macro Cards with SVG Donut Indicators */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 text-center">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Protein</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{proteinPct}%</span>
                    <span className="text-xs text-slate-500">{protein}g muscle repair</span>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-center">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase block">Fats</span>
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{fatPct}%</span>
                    <span className="text-xs text-slate-500">{fats}g lipid energy</span>
                  </div>

                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60 text-center">
                    <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase block">Carb / Sugar</span>
                    <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">{sugarPct}%</span>
                    <span className="text-xs text-slate-500">{sugar}g free sugar</span>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: % Daily Value (% DV) Progress Bars */}
            {activeChartTab === 'dv' && (
              <div className="mt-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Calories ({calories} / {dailyGoals.calories} kcal)</span>
                    <span className="text-slate-500">{dvCalories}% DV</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div style={{ width: `${dvCalories}%` }} className="bg-sky-500 h-full rounded-full transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Free Sugar ({sugar} / {dailyGoals.maxSugar}g Cap)</span>
                    <span className={`font-black ${dvSugar > 100 ? 'text-rose-600' : 'text-slate-500'}`}>{dvSugar}% DV</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.min(100, dvSugar)}%` }} className={`h-full rounded-full transition-all ${dvSugar > 100 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                  </div>
                  {dvSugar > 100 && (
                    <span className="text-[11px] font-bold text-rose-600 block">⚠️ Exceeds child safe daily allowance by {dvSugar - 100}%!</span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Saturated Fat ({satFat} / 20g Max)</span>
                    <span className="text-slate-500">{dvSatFat}% DV</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.min(100, dvSatFat)}%` }} className="bg-amber-500 h-full rounded-full transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Sodium ({sodium} / 2000mg Max)</span>
                    <span className="text-slate-500">{dvSodium}% DV</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.min(100, dvSodium)}%` }} className="bg-orange-500 h-full rounded-full transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Protein ({protein} / {dailyGoals.protein}g Target)</span>
                    <span className="text-emerald-600">{dvProtein}% DV</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.min(100, dvProtein)}%` }} className="bg-emerald-500 h-full rounded-full transition-all" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => navigate('/growth')}
              className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
            >
              <span>Observe Kid Body Growth 🧒🏃</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* INGREDIENT EXPLAINER (Safe / Moderate / Risky) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>Ingredient & Additive Safety Explainer</span>
            </h3>
            <p className="text-xs text-slate-500">
              Clear breakdown of what each ingredient/additive does and its health safety classification.
            </p>
          </div>
          <span className="text-xs text-slate-400">{explainedIngredients.length} Ingredients Evaluated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {explainedIngredients.map((ing, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                ing.safety === 'safe'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-850'
                  : ing.safety === 'moderate'
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-850'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-850'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                  {ing.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    ing.safety === 'safe'
                      ? 'bg-emerald-600 text-white'
                      : ing.safety === 'moderate'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {ing.safety}
                </span>
              </div>
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 block mb-1">
                {ing.category}
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-1 leading-snug">
                <strong>Purpose:</strong> {ing.purpose}
              </p>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                <strong>Health Effect:</strong> {ing.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* COMPARE TWO PRODUCTS SIDE BY SIDE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-teal-600" />
              <span>Compare Two Products Side-by-Side</span>
            </h3>
            <p className="text-xs text-slate-500">
              Benchmark the scanned food against another product or healthier alternative.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Compare with:</span>
            <select
              value={comparisonFood.id}
              onChange={(e) => handleSelectCompare(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              {OFFICIAL_HACKATHON_DATASET.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.brand})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item 1 (Current Scanned) */}
          <div className="p-5 rounded-2xl border-2 border-teal-500/50 bg-teal-50/20 dark:bg-teal-950/20 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase">Product A (Currently Active)</span>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{currentFood.name}</h4>
                <span className="text-xs text-slate-500">{currentFood.brand} · {currentFood.category}</span>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-teal-600 text-white">Score: {currentFood.healthScore}</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Calories:</span>
                <span className="font-bold">{currentFood.calories} kcal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Sugar:</span>
                <span className={`font-bold ${currentFood.sugar > 20 ? 'text-rose-600' : ''}`}>{currentFood.sugar}g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Fats:</span>
                <span className="font-bold">{currentFood.totalFats}g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Protein:</span>
                <span className="font-bold text-emerald-600">{currentFood.protein}g</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Signal:</span>
                <span className="font-bold">{currentFood.consumptionSignal}</span>
              </div>
            </div>
          </div>

          {/* Item 2 (Comparison Target) */}
          <div className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Product B (Benchmark Target)</span>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{comparisonFood.name}</h4>
                <span className="text-xs text-slate-500">{comparisonFood.brand} · {comparisonFood.category}</span>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-700 text-white">Score: {comparisonFood.healthScore}</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Calories:</span>
                <span className="font-bold">{comparisonFood.calories} kcal ({currentFood.calories - comparisonFood.calories > 0 ? `+${currentFood.calories - comparisonFood.calories}` : `${currentFood.calories - comparisonFood.calories}`})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Sugar:</span>
                <span className="font-bold">{comparisonFood.sugar}g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Fats:</span>
                <span className="font-bold">{comparisonFood.totalFats}g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Protein:</span>
                <span className="font-bold text-emerald-600">{comparisonFood.protein}g</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Signal:</span>
                <span className="font-bold">{comparisonFood.consumptionSignal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
