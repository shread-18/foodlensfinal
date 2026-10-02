import React, { useState } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Plus, 
  Flame, 
  Droplet, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Bell,
  Sliders,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailySummary, FoodItem } from '../types/food';
import { sounds, sendLocalNotification } from '../utils/notifications';

interface DailyGoalsIntakeProps {
  summary: DailySummary;
  onUpdateWater: (ml: number) => void;
  onResetGoals: () => void;
  onAddCustomIntake: (name: string, calories: number, sugar: number, protein: number) => void;
  isKidMode: boolean;
}

export const DailyGoalsIntake: React.FC<DailyGoalsIntakeProps> = ({
  summary,
  onUpdateWater,
  onResetGoals,
  onAddCustomIntake,
  isKidMode,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customSugar, setCustomSugar] = useState('');
  const [customProtein, setCustomProtein] = useState('');

  // Target recommendations
  const targetCalories = isKidMode ? 1600 : 2000;
  const maxSugarCap = isKidMode ? 24 : 50; // WHO guideline
  const targetWater = summary.targetWaterMl || 2000;
  const targetProtein = isKidMode ? 35 : 55;

  // Percentage calculations
  const calPercent = Math.min(100, Math.round((summary.totalCalories / targetCalories) * 100));
  const sugarPercent = Math.round((summary.totalSugar / maxSugarCap) * 100);
  const waterPercent = Math.min(100, Math.round((summary.waterIntakeMl / targetWater) * 100));
  const proteinPercent = Math.min(100, Math.round((summary.totalProtein / targetProtein) * 100));

  // Are goals achieved?
  const isHydrated = summary.waterIntakeMl >= targetWater;
  const isSugarSafe = summary.totalSugar <= maxSugarCap;
  const isProteinMet = summary.totalProtein >= targetProtein * 0.7;
  const allGoalsAchieved = isHydrated && isSugarSafe && isProteinMet;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName) return;
    const cal = parseFloat(customCalories) || 0;
    const sug = parseFloat(customSugar) || 0;
    const pro = parseFloat(customProtein) || 0;

    sounds.playSuccessChime();
    onAddCustomIntake(customName, cal, sug, pro);
    setCustomName('');
    setCustomCalories('');
    setCustomSugar('');
    setCustomProtein('');
    setShowAddModal(false);
  };

  const handleWaterClick = (ml: number) => {
    sounds.playSuccessChime();
    onUpdateWater(ml);
    if (summary.waterIntakeMl + ml >= targetWater) {
      confetti({ particleCount: 70, spread: 60 });
      sendLocalNotification('💧 Hydration Goal Complete!', 'Outstanding! You met your daily water intake goal.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header & Refresh Goals */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Nutrition & Habit Protocol
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Daily Intake & Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track daily targets, stay within safe sugar limits, and achieve your health streak.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Quick Add Custom Food */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Intake</span>
          </button>

          {/* Refresh / Reset Goals as requested */}
          <button
            onClick={() => {
              if (confirm('Refresh and reset today’s goals and logged intake back to 0?')) {
                sounds.playScanClick();
                onResetGoals();
              }
            }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
            title="Refresh Goals"
          >
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <span>Refresh Goals</span>
          </button>
        </div>
      </div>

      {/* All Goals Achieved Celebratory Banner */}
      {allGoalsAchieved ? (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-3xl shadow-lg flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl text-2xl">🏆</div>
            <div>
              <h3 className="font-extrabold text-base">Congratulations! All Goals Achieved Today!</h3>
              <p className="text-xs text-emerald-100">
                You maintained low free sugars, met your hydration target, and fueled with clean protein!
              </p>
            </div>
          </div>
          <span className="font-fun font-bold text-xs px-3 py-1.5 bg-white text-emerald-700 rounded-xl shadow-sm shrink-0">
            100% Score!
          </span>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Daily Target Status: Complete all 4 recommendations below to unlock today’s health trophy!
            </span>
          </div>
          <span className="font-bold text-emerald-600 font-mono">
            {((isHydrated ? 1 : 0) + (isSugarSafe ? 1 : 0) + (isProteinMet ? 1 : 0))}/3 Targets
          </span>
        </div>
      )}

      {/* 4 Core Goal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Goal 1: Calorie Target */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Daily Calories</span>
            <div className="p-2 bg-orange-100 dark:bg-orange-950 text-orange-600 rounded-xl">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {summary.totalCalories} <span className="text-xs font-normal text-slate-400">/ {targetCalories} kcal</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${calPercent}%` }}
                className="h-full bg-orange-500 rounded-full transition-all"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Recommended energy budget
          </p>
        </div>

        {/* Goal 2: Free Sugar Ceiling */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Sugar Limit (Cap)</span>
            <div
              className={`p-2 rounded-xl ${
                summary.totalSugar > maxSugarCap
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950'
                  : 'bg-amber-100 text-amber-600 dark:bg-amber-950'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div
              className={`text-2xl font-extrabold ${
                summary.totalSugar > maxSugarCap ? 'text-rose-600' : 'text-slate-900 dark:text-white'
              }`}
            >
              {summary.totalSugar}g <span className="text-xs font-normal text-slate-400">/ Max {maxSugarCap}g</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${Math.min(100, sugarPercent)}%` }}
                className={`h-full rounded-full transition-all ${
                  summary.totalSugar > maxSugarCap ? 'bg-rose-500' : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            {summary.totalSugar > maxSugarCap ? '⚠️ Limit exceeded!' : '✓ Safe under threshold'}
          </p>
        </div>

        {/* Goal 3: Hydration */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Water Hydration</span>
            <div className="p-2 bg-sky-100 dark:bg-sky-950 text-sky-600 rounded-xl">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-sky-600">
              {summary.waterIntakeMl} <span className="text-xs font-normal text-slate-400">/ {targetWater} ml</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${waterPercent}%` }}
                className="h-full bg-sky-500 rounded-full transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => handleWaterClick(250)}
              className="flex-1 py-1 bg-sky-50 dark:bg-sky-950 hover:bg-sky-100 text-sky-700 dark:text-sky-300 font-bold text-[10px] rounded-lg border border-sky-200 dark:border-sky-800 text-center"
            >
              +250ml
            </button>
            <button
              onClick={() => handleWaterClick(500)}
              className="flex-1 py-1 bg-sky-50 dark:bg-sky-950 hover:bg-sky-100 text-sky-700 dark:text-sky-300 font-bold text-[10px] rounded-lg border border-sky-200 dark:border-sky-800 text-center"
            >
              +500ml
            </button>
          </div>
        </div>

        {/* Goal 4: Protein */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Protein Builder</span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {summary.totalProtein}g <span className="text-xs font-normal text-slate-400">/ {targetProtein}g</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${proteinPercent}%` }}
                className="h-full bg-emerald-500 rounded-full transition-all"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Bone & muscle recovery
          </p>
        </div>
      </div>

      {/* Custom Add Intake Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Log Quick Meal or Snack
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Food / Drink Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Greek Yogurt Bowl"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Calories</label>
                  <input
                    type="number"
                    placeholder="150"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Sugar (g)</label>
                  <input
                    type="number"
                    placeholder="4"
                    value={customSugar}
                    onChange={(e) => setCustomSugar(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Protein (g)</label>
                  <input
                    type="number"
                    placeholder="12"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Log to Daily Goals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
