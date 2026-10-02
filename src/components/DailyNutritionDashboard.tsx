import React, { useState } from 'react';
import { 
  Droplet, 
  Coffee, 
  Flame, 
  Activity, 
  Watch, 
  Bell, 
  Check, 
  Plus, 
  RotateCcw, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  Heart,
  Footprints,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailySummary, WearableDeviceState } from '../types/food';
import { sounds, sendLocalNotification } from '../utils/notifications';

interface DailyNutritionDashboardProps {
  summary: DailySummary;
  onUpdateWater: (amountMl: number) => void;
  onResetDay: () => void;
  wearableState: WearableDeviceState;
  onSyncWearable: (provider: 'Apple Health' | 'Fitbit' | 'Garmin' | 'Google Fit') => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  isKidMode: boolean;
}

export const DailyNutritionDashboard: React.FC<DailyNutritionDashboardProps> = ({
  summary,
  onUpdateWater,
  onResetDay,
  wearableState,
  onSyncWearable,
  notificationsEnabled,
  onToggleNotifications,
  isKidMode,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'Apple Health' | 'Fitbit' | 'Garmin' | 'Google Fit'>('Apple Health');
  const [isSyncing, setIsSyncing] = useState(false);
  const [waterGoal, setWaterGoal] = useState(summary.targetWaterMl || 2200);

  const waterPercent = Math.min(100, Math.round((summary.waterIntakeMl / waterGoal) * 100));
  const childSugarCap = isKidMode ? 24 : 50; // WHO recommendations
  const sugarPercent = Math.round((summary.totalSugar / childSugarCap) * 100);

  const handleAddWater = (ml: number) => {
    sounds.playSuccessChime();
    onUpdateWater(ml);
    if (summary.waterIntakeMl + ml >= waterGoal) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0284c7', '#38bdf8', '#7dd3fc', '#10b981'],
      });
      sendLocalNotification('💧 Hydration Goal Reached!', `Great job! You drank ${summary.waterIntakeMl + ml}ml of water today.`);
    }
  };

  const handleTriggerSync = (provider: 'Apple Health' | 'Fitbit' | 'Garmin' | 'Google Fit') => {
    setIsSyncing(true);
    sounds.playScanClick();
    setTimeout(() => {
      onSyncWearable(provider);
      setIsSyncing(false);
      sounds.playSuccessChime();
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Daily Goal Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Personalized Health Dashboard
            </span>
            {isKidMode && (
              <span className="text-[10px] font-bold font-fun px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Kid Safety Limits Active
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Today's Nutritional & Habit Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Real-time daily balances, continuous consumption signal health, hydration radar, and wearable device biometrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDay}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl transition-all"
            title="Reset daily logs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Day</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Energy</span>
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary.totalCalories}
            </span>
            <span className="text-xs text-slate-400 ml-1">kcal</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Estimated daily budget: {isKidMode ? '1,600' : '2,200'} kcal
          </p>
        </div>

        {/* Free Sugar Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Free Sugar</span>
            <div
              className={`p-2 rounded-xl ${
                sugarPercent > 100
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-2xl sm:text-3xl font-extrabold ${
                sugarPercent > 100 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
              }`}
            >
              {summary.totalSugar}g
            </span>
            <span className="text-xs text-slate-400 ml-1">/ {childSugarCap}g cap</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              style={{ width: `${Math.min(100, sugarPercent)}%` }}
              className={`h-full ${sugarPercent > 100 ? 'bg-rose-500' : 'bg-amber-500'}`}
            />
          </div>
        </div>

        {/* Quality Signals Balance */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Habit Signals</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              {summary.goodCount} Good
            </div>
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              {summary.okCount} OK
            </div>
            <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-extrabold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              {summary.badCount} Bad
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Continuous consumption balance
          </p>
        </div>

        {/* Caffeine Tracker Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Daily Caffeine</span>
            <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-2xl sm:text-3xl font-extrabold ${
                isKidMode && summary.totalCaffeine > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {summary.totalCaffeine}
            </span>
            <span className="text-xs text-slate-400 ml-1">mg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isKidMode ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                ⚠️ Safe limit for children is 0 mg
              </span>
            ) : (
              'Adult safe maximum: 400 mg'
            )}
          </p>
        </div>
      </div>

      {/* Hydration Tracker & Wearable Sync Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hydration Radar Section */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  Hydration Goal Engine
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Daily Water Intake Tracker
                </h3>
              </div>
              <button
                onClick={onToggleNotifications}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  notificationsEnabled
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
                title="Hourly hydration push reminders"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{notificationsEnabled ? 'Alerts ON' : 'Enable Reminders'}</span>
              </button>
            </div>

            {/* Water Bottle Graphic / Progress */}
            <div className="mt-6 flex items-center justify-center gap-8">
              {/* Animated Water Vessel */}
              <div className="relative w-28 h-48 border-4 border-sky-400 dark:border-sky-600 rounded-3xl overflow-hidden bg-sky-50/50 dark:bg-sky-950/20 p-1 shadow-inner">
                {/* Measuring ticks */}
                <div className="absolute right-1 top-4 text-[9px] font-mono text-sky-400 select-none">2000</div>
                <div className="absolute right-1 top-16 text-[9px] font-mono text-sky-400 select-none">1500</div>
                <div className="absolute right-1 top-28 text-[9px] font-mono text-sky-400 select-none">1000</div>
                <div className="absolute right-1 top-40 text-[9px] font-mono text-sky-400 select-none">500</div>

                {/* Filled Water with wave effect */}
                <div
                  style={{ height: `${waterPercent}%` }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-600 to-sky-400 transition-all duration-700 ease-out"
                >
                  <div className="w-full h-2 bg-sky-300/40 opacity-70"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900 dark:text-white drop-shadow">
                    {waterPercent}%
                  </span>
                </div>
              </div>

              {/* Water Volume Details */}
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500 block">Logged Today:</span>
                  <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
                    {summary.waterIntakeMl} <span className="text-sm font-normal text-slate-400">/ {waterGoal} ml</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
                  Drinking fresh water neutralizes mouth acids, protects tooth enamel from snack decay, and sustains peak cognitive focus in school.
                </p>

                {/* Quick Add Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleAddWater(250)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+250 ml (Glass)</span>
                  </button>
                  <button
                    onClick={() => handleAddWater(500)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+500 ml (Bottle)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-900/60 text-xs text-sky-900 dark:text-sky-200 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-sky-500 shrink-0" />
            <span>Next personalized hydration alert scheduled in 45 minutes.</span>
          </div>
        </div>

        {/* Wearable Device Integration Hub */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Wearable IoT Sync
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Fitness & Biometric Integration
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Sync real-time calorie burn and heart rate from your smartwatch to dynamically adjust your daily nutritional allowances.
            </p>

            {/* Provider Selector */}
            <div className="grid grid-cols-4 gap-2 my-4">
              {(['Apple Health', 'Fitbit', 'Garmin', 'Google Fit'] as const).map((prov) => (
                <button
                  key={prov}
                  onClick={() => setSelectedProvider(prov)}
                  className={`p-2 rounded-xl text-xs font-bold text-center border transition-all ${
                    selectedProvider === prov
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>

            {/* Live Biometrics Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Footprints className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Daily Steps</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {wearableState.steps.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400">Goal: 10,000</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>Active Burn</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {wearableState.activeCalories}
                </div>
                <span className="text-[10px] text-slate-400">kcal burned</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Resting HR</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {wearableState.restingHeartRate}
                </div>
                <span className="text-[10px] text-slate-400">bpm normal</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              Last synced: {wearableState.lastSyncTime}
            </span>
            <button
              onClick={() => handleTriggerSync(selectedProvider)}
              disabled={isSyncing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Watch className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : `Sync ${selectedProvider}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
