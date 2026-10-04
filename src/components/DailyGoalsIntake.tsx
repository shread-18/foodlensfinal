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
  Check,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailySummary } from '../types/food';
import { sounds, sendLocalNotification } from '../utils/notifications';
import { FuturisticCard } from './ui/FuturisticCard';
import { GlowButton } from './ui/GlowButton';
import { StatusBadge } from './ui/StatusBadge';
import { SectionHeader } from './ui/SectionHeader';

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

  // Overall Daily Health Score
  const isHydrated = summary.waterIntakeMl >= targetWater;
  const isSugarSafe = summary.totalSugar <= maxSugarCap;
  const isProteinMet = summary.totalProtein >= targetProtein * 0.7;
  const completedTargets = (isHydrated ? 1 : 0) + (isSugarSafe ? 1 : 0) + (isProteinMet ? 1 : 0) + (summary.totalCalories > 0 ? 1 : 0);
  const overallProgressPercent = Math.min(100, Math.round((completedTargets / 4) * 100));
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
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* 1. Header & Quick Actions */}
      <FuturisticCard variant="emerald" className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="online" label="HEALTH COMMAND CENTER" sublabel="TELEMETRY" />
              {isKidMode && (
                <span className="text-[10px] font-fun font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  🧒 Kid Targets Active (24g Sugar Limit)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-display tracking-tight">
              Daily Health Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-tech">
              Continuous dietary budget tracking, WHO free-sugar ceiling, and hydration monitoring
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <GlowButton
              size="md"
              variant="primary"
              onClick={() => setShowAddModal(true)}
              icon={<Plus className="w-4 h-4 text-slate-950" />}
            >
              Log Custom Food
            </GlowButton>

            <GlowButton
              size="md"
              variant="secondary"
              onClick={() => {
                if (confirm('Refresh and reset today’s goals and logged intake back to 0?')) {
                  sounds.playScanClick();
                  onResetGoals();
                }
              }}
              icon={<RotateCcw className="w-4 h-4 text-cyan-400" />}
            >
              Refresh Goals
            </GlowButton>
          </div>
        </div>
      </FuturisticCard>

      {/* 2. Central Daily Progress Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Overall Health Command Center Dial */}
        <FuturisticCard variant="emerald" cornerBrackets={true} className="md:col-span-5 p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="#00F5A0"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 - (overallProgressPercent / 100) * 2 * Math.PI * 64}
                strokeLinecap="round"
                fill="none"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(0,245,160,0.5))',
                  transition: 'stroke-dashoffset 1s ease-out',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black font-display text-white">
                {overallProgressPercent}%
              </span>
              <span className="text-[10px] font-tech text-emerald-400 uppercase tracking-widest">
                ON TRACK
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 w-full flex items-center justify-between text-xs font-tech">
            <span className="text-slate-400">HEALTH PROTOCOL</span>
            <span className="text-emerald-400 font-bold">{completedTargets}/4 TARGETS MET</span>
          </div>
        </FuturisticCard>

        {/* Right: Celebratory / Status Alert Card */}
        <div className="md:col-span-7">
          {allGoalsAchieved ? (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-400/50 shadow-[0_0_25px_rgba(0,245,160,0.2)] space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <h3 className="font-display font-black text-lg text-white">
                    Congratulations! All Health Targets Achieved!
                  </h3>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    You kept free sugars under the recommended cap, hit your hydration goal, and fueled with clean protein.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <FuturisticCard variant="neutral" className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold font-display text-white">
                    Daily Nutrition Protocol
                  </h3>
                </div>
                <StatusBadge status="active" label="MONITORING" />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Log packaged meals via the AR Scanner or Photo Upload. FoodLens automatically tallies calories, sugars, fats, and protein against WHO safe guidelines.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-tech text-slate-400 uppercase block">Sugar Safe Margin</span>
                  <span className="text-sm font-bold font-tech text-emerald-400">
                    {Math.max(0, maxSugarCap - summary.totalSugar).toFixed(1)}g remaining
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-tech text-slate-400 uppercase block">Hydration Needed</span>
                  <span className="text-sm font-bold font-tech text-cyan-400">
                    {Math.max(0, targetWater - summary.waterIntakeMl)} ml remaining
                  </span>
                </div>
              </div>
            </FuturisticCard>
          )}
        </div>
      </div>

      {/* 3. Core Nutrient Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <FuturisticCard variant="neutral" className="p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">Calories</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black font-display text-white">
              {summary.totalCalories} <span className="text-xs font-tech text-slate-400">/ {targetCalories} kcal</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${calPercent}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 shadow-[0_0_8px_#FBBF24]"
              />
            </div>
          </div>

          <span className="text-[10px] font-tech text-slate-400">Energy intake budget</span>
        </FuturisticCard>

        {/* Free Sugar Ceiling Card */}
        <FuturisticCard
          variant={summary.totalSugar > maxSugarCap ? 'neutral' : 'emerald'}
          className={`p-5 flex flex-col justify-between space-y-3 ${
            summary.totalSugar > maxSugarCap ? '!border-rose-500/50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">Sugar Limit</span>
            <div
              className={`p-2 rounded-xl border ${
                summary.totalSugar > maxSugarCap
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div
              className={`text-2xl font-black font-display ${
                summary.totalSugar > maxSugarCap ? 'text-rose-400' : 'text-white'
              }`}
            >
              {summary.totalSugar}g <span className="text-xs font-tech text-slate-400">/ Max {maxSugarCap}g</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${Math.min(100, sugarPercent)}%` }}
                className={`h-full rounded-full transition-all duration-700 ${
                  summary.totalSugar > maxSugarCap
                    ? 'bg-rose-500 shadow-[0_0_10px_#FF4D6D]'
                    : 'bg-emerald-500 shadow-[0_0_10px_#00F5A0]'
                }`}
              />
            </div>
          </div>

          <span className="text-[10px] font-tech text-slate-400">
            {summary.totalSugar > maxSugarCap ? '⚠️ WHO threshold exceeded!' : '✓ Safe under limit'}
          </span>
        </FuturisticCard>

        {/* Hydration Reservoir Card */}
        <FuturisticCard variant="cyan" className="p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">Hydration</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Droplet className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black font-display text-cyan-400">
              {summary.waterIntakeMl} <span className="text-xs font-tech text-slate-400">/ {targetWater} ml</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${waterPercent}%` }}
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700 shadow-[0_0_8px_#00D9FF]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleWaterClick(250)}
              className="flex-1 py-1 px-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-tech font-bold text-[10px] rounded-lg border border-cyan-400/30 transition-all cursor-pointer text-center"
            >
              +250ml
            </button>
            <button
              onClick={() => handleWaterClick(500)}
              className="flex-1 py-1 px-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-tech font-bold text-[10px] rounded-lg border border-cyan-400/30 transition-all cursor-pointer text-center"
            >
              +500ml
            </button>
          </div>
        </FuturisticCard>

        {/* Protein Builder Card */}
        <FuturisticCard variant="emerald" className="p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">Protein</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Check className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black font-display text-emerald-400">
              {summary.totalProtein}g <span className="text-xs font-tech text-slate-400">/ {targetProtein}g</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${proteinPercent}%` }}
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700 shadow-[0_0_8px_#00F5A0]"
              />
            </div>
          </div>

          <span className="text-[10px] font-tech text-slate-400">Cellular & muscle recovery</span>
        </FuturisticCard>
      </div>

      {/* 4. Hydration Graduated Reservoir Visualization */}
      <FuturisticCard variant="cyan" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold font-display text-base text-white flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              Hydration Reservoir Status
            </h3>
            <p className="text-xs text-slate-400 font-tech">Graduated reservoir measuring cell hydration balance</p>
          </div>
          <span className="text-xs font-tech font-bold text-cyan-400">{summary.waterIntakeMl} / {targetWater} ML</span>
        </div>

        {/* Visual Reservoir Tube */}
        <div className="space-y-2">
          <div className="relative w-full h-8 bg-slate-950 rounded-xl border border-cyan-500/30 overflow-hidden flex items-center p-1">
            <div
              className="h-full rounded-lg bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-300 transition-all duration-1000 shadow-[0_0_15px_rgba(0,217,255,0.4)]"
              style={{ width: `${waterPercent}%` }}
            />
          </div>

          {/* Graduated Tick Steps */}
          <div className="flex justify-between text-[10px] font-tech text-slate-400 px-1">
            <span>0ml</span>
            <span>250ml</span>
            <span>500ml</span>
            <span>1000ml</span>
            <span>1500ml</span>
            <span className="font-bold text-cyan-400">2000ml (Goal)</span>
          </div>
        </div>
      </FuturisticCard>

      {/* 5. Custom Add Intake Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <FuturisticCard variant="emerald" cornerBrackets={true} className="w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-extrabold text-base text-white">
                Log Quick Meal or Snack
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-4">
              <div>
                <label className="text-xs font-tech font-bold text-slate-300 block mb-1">
                  Food / Drink Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprouted Green Moong Bowl"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-tech font-bold text-slate-300 block mb-1">Calories</label>
                  <input
                    type="number"
                    placeholder="180"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:border-emerald-400 focus:outline-none font-tech"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-tech font-bold text-slate-300 block mb-1">Sugar (g)</label>
                  <input
                    type="number"
                    placeholder="3"
                    value={customSugar}
                    onChange={(e) => setCustomSugar(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:border-emerald-400 focus:outline-none font-tech"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-tech font-bold text-slate-300 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    placeholder="14"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:border-emerald-400 focus:outline-none font-tech"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-xl text-xs font-tech text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <GlowButton size="sm" variant="primary" type="submit">
                  Log to Daily Goals
                </GlowButton>
              </div>
            </form>
          </FuturisticCard>
        </div>
      )}
    </div>
  );
};
