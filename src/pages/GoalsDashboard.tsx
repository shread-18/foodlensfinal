import React, { useState } from 'react';
import { 
  Target, 
  RotateCcw, 
  Plus, 
  Flame, 
  Droplet, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Bell, 
  Calendar, 
  Sliders, 
  Coffee, 
  Trash2,
  Check,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { MealLogItem } from '../types/food';
import { sounds, sendLocalNotification } from '../utils/notifications';

export const GoalsDashboard: React.FC = () => {
  const { 
    dailySummary, 
    dailyGoals, 
    updateDailyGoals, 
    addCustomIntake, 
    updateWater, 
    resetDailyGoals, 
    notificationsEnabled, 
    toggleNotifications 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditGoalsModal, setShowEditGoalsModal] = useState(false);

  // Form states
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customSugar, setCustomSugar] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customMealType, setCustomMealType] = useState<MealLogItem['mealType']>('Lunch');

  // Goals edit states
  const [targetCal, setTargetCal] = useState(dailyGoals.calories);
  const [targetSugar, setTargetSugar] = useState(dailyGoals.maxSugar);
  const [targetWater, setTargetWater] = useState(dailyGoals.waterMl);
  const [targetProtein, setTargetProtein] = useState(dailyGoals.protein);

  const calPercent = Math.min(100, Math.round((dailySummary.totalCalories / (dailyGoals.calories || 1800)) * 100));
  const sugarPercent = Math.round((dailySummary.totalSugar / (dailyGoals.maxSugar || 24)) * 100);
  const waterPercent = Math.min(100, Math.round((dailySummary.waterIntakeMl / (dailyGoals.waterMl || 2000)) * 100));
  const proteinPercent = Math.min(100, Math.round((dailySummary.totalProtein / (dailyGoals.protein || 45)) * 100));

  const allGoalsMet = 
    dailySummary.waterIntakeMl >= dailyGoals.waterMl &&
    dailySummary.totalSugar <= dailyGoals.maxSugar &&
    dailySummary.totalProtein >= dailyGoals.protein * 0.7;

  // Mock weekly trends
  const weeklyData = [
    { day: 'Mon', cal: 1720, sugar: 18, isGood: true },
    { day: 'Tue', cal: 1840, sugar: 22, isGood: true },
    { day: 'Wed', cal: 1910, sugar: 29, isGood: false },
    { day: 'Thu', cal: 1650, sugar: 16, isGood: true },
    { day: 'Fri', cal: 1800, sugar: 20, isGood: true },
    { day: 'Sat', cal: 1780, sugar: 23, isGood: true },
    { day: 'Sun (Today)', cal: dailySummary.totalCalories, sugar: dailySummary.totalSugar, isGood: dailySummary.totalSugar <= dailyGoals.maxSugar },
  ];

  const handleAddCustomMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName) return;

    addCustomIntake({
      name: customName,
      calories: parseFloat(customCalories) || 0,
      sugar: parseFloat(customSugar) || 0,
      protein: parseFloat(customProtein) || 0,
      mealType: customMealType,
    });

    sounds.playSuccessChime();
    setCustomName('');
    setCustomCalories('');
    setCustomSugar('');
    setCustomProtein('');
    setShowAddModal(false);
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    updateDailyGoals({
      calories: targetCal,
      maxSugar: targetSugar,
      waterMl: targetWater,
      protein: targetProtein,
    });
    sounds.playSuccessChime();
    setShowEditGoalsModal(false);
  };

  const handleWaterAdd = (amount: number) => {
    sounds.playSuccessChime();
    updateWater(amount);
    if (dailySummary.waterIntakeMl + amount >= dailyGoals.waterMl) {
      confetti({ particleCount: 70, spread: 60 });
      sendLocalNotification('💧 Hydration Goal Reached!', `You hit your ${dailyGoals.waterMl}ml daily water target!`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Dashboard 4 · Habit & Nutritional Targets
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Daily Goals, Reminders & Intake Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Customize daily nutrient ceilings, log meals, track circular progress rings, and monitor weekly trends.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Meal</span>
          </button>

          <button
            onClick={() => setShowEditGoalsModal(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Set Targets</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset today’s intake and refresh goals back to 0?')) {
                sounds.playScanClick();
                resetDailyGoals();
              }
            }}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl border border-slate-200 dark:border-slate-700"
            title="Refresh / Reset Goals"
          >
            <RotateCcw className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Goal Streak & Achievement Banner */}
      {allGoalsMet ? (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-3xl shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl text-2xl">🏆</div>
            <div>
              <h3 className="font-extrabold text-base">All Daily Health Goals Achieved!</h3>
              <p className="text-xs text-emerald-100">
                You maintained low free sugars, met your hydration target, and stayed within calorie allowances!
              </p>
            </div>
          </div>
          <span className="font-bold text-xs px-3 py-1.5 bg-white text-emerald-800 rounded-xl shadow shrink-0">
            Streak: 5 Days 🔥
          </span>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Daily Target Status: Drink {Math.max(0, dailyGoals.waterMl - dailySummary.waterIntakeMl)}ml more water to unlock today’s trophy!
            </span>
          </div>
          <span className="font-bold text-sky-600 font-mono">
            {((dailySummary.waterIntakeMl >= dailyGoals.waterMl ? 1 : 0) + (dailySummary.totalSugar <= dailyGoals.maxSugar ? 1 : 0) + (dailySummary.totalProtein >= dailyGoals.protein * 0.7 ? 1 : 0))}/3 Met
          </span>
        </div>
      )}

      {/* 4 Circular Progress Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ring 1: Calories */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-orange-500 transition-all duration-700"
                strokeDasharray={`${calPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-extrabold text-xs text-slate-800 dark:text-slate-100">{calPercent}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Calories</span>
            <span className="text-lg font-black text-slate-900 dark:text-white block">{dailySummary.totalCalories}</span>
            <span className="text-[11px] text-slate-500">/ {dailyGoals.calories} kcal</span>
          </div>
        </div>

        {/* Ring 2: Sugar Cap */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${sugarPercent > 100 ? 'text-rose-500' : 'text-amber-500'} transition-all duration-700`}
                strokeDasharray={`${Math.min(100, sugarPercent)}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className={`absolute font-extrabold text-xs ${sugarPercent > 100 ? 'text-rose-600' : 'text-slate-800 dark:text-slate-100'}`}>
              {sugarPercent}%
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sugar Cap</span>
            <span className={`text-lg font-black block ${dailySummary.totalSugar > dailyGoals.maxSugar ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
              {dailySummary.totalSugar}g
            </span>
            <span className="text-[11px] text-slate-500">/ Max {dailyGoals.maxSugar}g</span>
          </div>
        </div>

        {/* Ring 3: Water Hydration */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-sky-500 transition-all duration-700"
                strokeDasharray={`${waterPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-extrabold text-xs text-sky-600">{waterPercent}%</span>
          </div>
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Water</span>
            <span className="text-lg font-black text-sky-600 block">{dailySummary.waterIntakeMl} ml</span>
            <div className="flex gap-1 mt-1">
              <button
                onClick={() => handleWaterAdd(250)}
                className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold border border-sky-200 dark:border-sky-800"
              >
                +250ml
              </button>
              <button
                onClick={() => handleWaterAdd(500)}
                className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold border border-sky-200 dark:border-sky-800"
              >
                +500ml
              </button>
            </div>
          </div>
        </div>

        {/* Ring 4: Protein */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-700"
                strokeDasharray={`${proteinPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-extrabold text-xs text-emerald-600">{proteinPercent}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Protein</span>
            <span className="text-lg font-black text-emerald-600 block">{dailySummary.totalProtein}g</span>
            <span className="text-[11px] text-slate-500">/ {dailyGoals.protein}g target</span>
          </div>
        </div>
      </div>

      {/* 7-Day Weekly Trend Chart & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Bar Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Weekly Calorie & Sugar Intake Trends
              </h3>
            </div>
            <span className="text-xs text-slate-400">Past 7 Days</span>
          </div>

          {/* Bar Chart Graphic */}
          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-slate-100 dark:border-slate-800 pb-2">
            {weeklyData.map((d, i) => {
              const heightPercent = Math.min(100, Math.round((d.cal / 2200) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-400">{d.cal}</span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[36px] rounded-t-xl transition-all ${
                      d.isGood ? 'bg-emerald-500/80 hover:bg-emerald-500' : 'bg-rose-500/80 hover:bg-rose-500'
                    }`}
                    title={`${d.day}: ${d.cal} kcal, ${d.sugar}g sugar`}
                  />
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">{d.day.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Under Sugar Cap</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span>Exceeded Sugar Cap</span>
              </span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Daily Average: 1,780 kcal</span>
          </div>
        </div>

        {/* Reminders & Streak Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-sky-500" />
                <span>Smart Reminders</span>
              </h3>
              <button
                onClick={toggleNotifications}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  notificationsEnabled ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {notificationsEnabled ? 'Active' : 'Turn On'}
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Hydration Alert</span>
                  <span className="text-[10px] text-slate-400">Every 45 mins</span>
                </div>
                <span className="text-sky-600 font-bold">💧 Water Chime</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Daily Intake Check</span>
                  <span className="text-[10px] text-slate-400">08:00 PM evening</span>
                </div>
                <span className="text-emerald-600 font-bold">🥗 Summary</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl border border-orange-200 dark:border-orange-900/40 text-center">
            <span className="text-2xl block mb-1">🔥</span>
            <h4 className="font-black text-sm text-orange-900 dark:text-orange-200">5-Day Healthy Streak!</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              Keep free sugars under 24g for 2 more days to earn the "Sugar Slayer" gold badge!
            </p>
          </div>
        </div>
      </div>

      {/* Today's Intake Log with Meals added from Scans or Manually */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Today's Intake Log
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold">
              {dailySummary.mealLogs?.length || 0} Meals
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs text-emerald-600 font-bold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {(!dailySummary.mealLogs || dailySummary.mealLogs.length === 0) ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No meals logged today yet. Scan a package in /scan or click "Add Meal"!
          </div>
        ) : (
          <div className="space-y-2">
            {dailySummary.mealLogs.map((meal) => (
              <div
                key={meal.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">{meal.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {meal.mealType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{meal.loggedAt}</span>
                  </div>
                  {meal.brand && <span className="text-[11px] text-slate-500">{meal.brand}</span>}
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white block">{meal.calories} kcal</span>
                  <span className={`text-[11px] ${meal.sugar > 15 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                    {meal.sugar}g sugar · {meal.protein}g protein
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Add Custom Meal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Log Custom Meal / Snack</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddCustomMeal} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Food / Drink Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scrambled Eggs & Whole Wheat Toast"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Meal Category</label>
                <select
                  value={customMealType}
                  onChange={(e) => setCustomMealType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Calories</label>
                  <input
                    type="number"
                    placeholder="250"
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
                  Log Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Daily Targets */}
      {showEditGoalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Customize Daily Goals</h3>
              <button onClick={() => setShowEditGoalsModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveGoals} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Daily Calorie Target: {targetCal} kcal</label>
                <input
                  type="range"
                  min="1200"
                  max="3000"
                  step="50"
                  value={targetCal}
                  onChange={(e) => setTargetCal(parseInt(e.target.value, 10))}
                  className="w-full accent-orange-500 mt-1 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Free Sugar Ceiling (Cap): {targetSugar}g</label>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="1"
                  value={targetSugar}
                  onChange={(e) => setTargetSugar(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 mt-1 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Water Hydration Target: {targetWater} ml</label>
                <input
                  type="range"
                  min="1200"
                  max="3500"
                  step="100"
                  value={targetWater}
                  onChange={(e) => setTargetWater(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-500 mt-1 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Protein Target: {targetProtein}g</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={targetProtein}
                  onChange={(e) => setTargetProtein(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 mt-1 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditGoalsModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Goals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
