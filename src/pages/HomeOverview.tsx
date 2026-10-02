import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  FileText, 
  Activity, 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Droplet, 
  TrendingUp, 
  ShieldAlert, 
  Zap,
  Lock,
  Trophy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/notifications';

export const HomeOverview: React.FC = () => {
  const { 
    currentFood, 
    dailySummary, 
    dailyGoals, 
    bugBattleStats, 
    parentalSettings, 
    scanHistory
  } = useApp();

  const sugarPercent = Math.round((dailySummary.totalSugar / (dailyGoals.maxSugar || 24)) * 100);
  const waterPercent = Math.min(100, Math.round((dailySummary.waterIntakeMl / (dailyGoals.waterMl || 2000)) * 100));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>All 5 Health Modules Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              FoodLens AI Health Suite
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Inspect food labels with AI, explore detailed nutrition & additive safety, simulate kid body growth and digestion reactions, and achieve your daily health goals.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0 w-full sm:w-auto">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200 block font-semibold">Active Inspected Pack</span>
            <span className="text-lg font-black block truncate max-w-[200px] mx-auto mt-0.5">{currentFood.name}</span>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
              currentFood.consumptionSignal === 'GOOD' ? 'bg-emerald-400 text-emerald-950' : currentFood.consumptionSignal === 'OK' ? 'bg-amber-300 text-amber-950' : 'bg-rose-400 text-rose-950'
            }`}>
              Signal: {currentFood.consumptionSignal}
            </span>
          </div>
        </div>
      </div>

      {/* QUICK DASHBOARD ACTION LAUNCHPAD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Instant Packaging Scanner Ready
            </h3>
            <p className="text-xs text-slate-500">
              Point your webcam or upload any packaged food image to analyze ingredients, palm oil, and WHO sugar thresholds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Link
            to="/scan"
            onClick={() => triggerHaptic('medium')}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Launch Live Scanner →</span>
          </Link>
          <Link
            to="/nutrition"
            onClick={() => triggerHaptic('light')}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
          >
            Nutrient Deep-Dive
          </Link>
        </div>
      </div>

      {/* 5 Dedicated Module Cards (One Per Module as requested!) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Dedicated Module Dashboards
          </h2>
          <span className="text-xs text-slate-400">5 Distinct Dashboards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* DASHBOARD 1 CARD: Scan / Upload (/scan) */}
          <Link
            to="/scan"
            className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  /scan
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                1. Scan & Upload Dashboard
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Live camera scanner & packaging photo upload. AI OCR analysis for ingredient breakdown, harmful flags, and scan history.
              </p>

              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-500">Scan History:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{scanHistory.length} Saved Records</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Open Scanner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* DASHBOARD 2 CARD: Nutritional Data (/nutrition) */}
          <Link
            to="/nutrition"
            className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  /nutrition
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                2. Nutritional Data Dashboard
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                In-depth macro charts, % Daily Value gauges, interactive additive/ingredient explainer, and side-by-side product comparison.
              </p>

              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-500">Current Score:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{currentFood.healthScore} / 100 ({currentFood.nutriGrade})</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Inspect Breakdown</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* DASHBOARD 3 CARD: Kid Food Growth & Body Reaction (/growth) */}
          <Link
            to="/growth"
            className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  /growth
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                3. Kid Body & Growth Simulator
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Watch the kid chomp and eat scanned food: growing tall & athletic with wholesome fuel, or bloated with sluggish tummy bugs from junk food.
              </p>

              <div className="mt-4 p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 text-xs flex items-center justify-between">
                <span className="text-emerald-800 dark:text-emerald-200 font-bold">Growth Simulator:</span>
                <span className="font-black text-emerald-600">Maya & Leo Active 🏃</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Simulate Kid Body Growth</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* DASHBOARD 4 CARD: Daily Goals & Intake (/goals) */}
          <Link
            to="/goals"
            className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  /goals
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                4. Daily Goals & Intake Dashboard
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Set custom nutrient targets, track today's meal logs, check weekly trends, progress rings, and refresh daily goals.
              </p>

              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-500">Water Target:</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{dailySummary.waterIntakeMl} / {dailyGoals.waterMl} ml ({waterPercent}%)</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
              <span>View Intake Log</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* DASHBOARD 5 CARD: Kid Mode (/kid-mode) */}
          <Link
            to="/kid-mode"
            className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 hover:border-rose-500 dark:hover:border-rose-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  /kid-mode
                </span>
              </div>

              <h3 className="text-lg font-extrabold font-fun text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                5. Kid Mode Dashboard
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Simplified child interface: large buttons, fun emojis, traffic-light ratings ("Eat often / Sometimes / Rarely"), and parental PIN lock.
              </p>

              <div className="mt-4 p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/60 text-xs flex items-center justify-between">
                <span className="text-rose-800 dark:text-rose-200 font-fun font-bold">Child Traffic Light:</span>
                <span className="font-black text-rose-600 font-fun">
                  {currentFood.consumptionSignal === 'GOOD' ? '🟢 Eat Often!' : currentFood.consumptionSignal === 'OK' ? '🟡 Sometimes' : '🔴 Rarely'}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400 font-fun">
              <span>Open Kid Mode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
