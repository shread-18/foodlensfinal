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
  RotateCcw,
  Activity,
  Flame,
  Droplets,
  Zap,
  Layers,
  ChevronRight
} from 'lucide-react';
import { FoodItem } from '../types/food';
import { sounds } from '../utils/notifications';
import { HealthRing } from './ui/HealthRing';
import { MetricGauge } from './ui/MetricGauge';
import { FuturisticCard } from './ui/FuturisticCard';
import { GlowButton } from './ui/GlowButton';
import { StatusBadge } from './ui/StatusBadge';
import { SectionHeader } from './ui/SectionHeader';

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
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'OK':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'BAD':
      default:
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    }
  };

  const getNutriColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-500 text-slate-950 font-black';
      case 'B': return 'bg-teal-400 text-slate-950 font-black';
      case 'C': return 'bg-amber-400 text-slate-950 font-black';
      case 'D': return 'bg-orange-500 text-white font-black';
      case 'E':
      default: return 'bg-rose-600 text-white font-black';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* 1. Header Banner & Direct Action to Kids Bug Battle */}
      <FuturisticCard variant="emerald" className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-tech font-bold uppercase tracking-widest text-emerald-400">
                {food.brand} · {food.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${getNutriColor(food.nutriGrade)} shadow-md`}>
                GRADE {food.nutriGrade}
              </span>
              <StatusBadge status="online" label="ANALYZED & VERIFIED" />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-display tracking-tight">
              {food.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-tech">
              Comprehensive clinical nutrient telemetry computed for {currentGrams}g portion
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <GlowButton
              size="lg"
              variant="kids"
              onClick={() => {
                sounds.playScanClick();
                onOpenKidsBugBattle();
              }}
              className="w-full sm:w-auto"
              icon={<Swords className="w-5 h-5 text-slate-950" />}
            >
              Play Kids Bug Battle! 🐛⚡
            </GlowButton>

            <GlowButton
              size="md"
              variant="secondary"
              onClick={onRescan}
              icon={<RotateCcw className="w-4 h-4 text-cyan-400" />}
            >
              Scan Other
            </GlowButton>
          </div>
        </div>
      </FuturisticCard>

      {/* 2. Central Health Score & Protocol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left: HealthRing Core Visualization */}
        <FuturisticCard variant="emerald" cornerBrackets={true} className="md:col-span-4 flex flex-col items-center justify-center p-6 text-center">
          <HealthRing score={food.healthScore} nutriGrade={food.nutriGrade} size={170} strokeWidth={14} />

          <div className="mt-4 pt-3 border-t border-slate-800 w-full flex items-center justify-between text-xs font-tech">
            <span className="text-slate-400">NUTRI-SCORE SIGNAL</span>
            <span className={`font-black uppercase px-2 py-0.5 rounded-full ${getSignalBadge(food.consumptionSignal)}`}>
              {food.consumptionSignal}
            </span>
          </div>
        </FuturisticCard>

        {/* Right: Intake Protocol & Portion Tuner */}
        <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
          {/* Signal Protocol Card */}
          <div
            className={`p-5 rounded-2xl border ${
              food.consumptionSignal === 'GOOD'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : food.consumptionSignal === 'OK'
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2.5 font-bold mb-1.5 font-tech text-sm">
              {food.consumptionSignal === 'GOOD' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <span>
                CONTINUOUS INTAKE SIGNAL: <span className="underline">{food.consumptionSignal}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>Protocol:</strong> {food.recommendedAmount} during {food.recommendedTime} ({food.frequency}).
            </p>
            <p className="text-xs text-slate-400 mt-1">
              <strong>Risk Warning:</strong> {food.excessIntakeEffects}
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end">
              <GlowButton
                size="sm"
                variant="primary"
                onClick={() => onLogToDailyGoals(food, currentGrams)}
                icon={<Plus className="w-3.5 h-3.5 text-slate-950" />}
              >
                Log {currentGrams}g into Daily Health Goals
              </GlowButton>
            </div>
          </div>

          {/* Portion Calibrator */}
          <FuturisticCard variant="neutral" className="p-4">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-slate-300 flex items-center gap-1.5 font-tech">
                <Scale className="w-4 h-4 text-emerald-400" />
                CALIBRATE PORTION SIZE:
              </span>
              <span className="text-emerald-400 font-tech font-black text-sm">{currentGrams} grams</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.25"
              value={portionMultiplier}
              onChange={(e) => setPortionMultiplier(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-tech text-slate-400 mt-2">
              <button onClick={() => setPortionMultiplier(0.5)} className="hover:text-emerald-400 cursor-pointer">50g (Snack)</button>
              <button onClick={() => setPortionMultiplier(1.0)} className="hover:text-emerald-400 cursor-pointer">100g (Standard)</button>
              <button onClick={() => setPortionMultiplier(2.0)} className="hover:text-emerald-400 cursor-pointer">200g (Double)</button>
              <button onClick={() => setPortionMultiplier(3.0)} className="hover:text-emerald-400 cursor-pointer">300g (Full Meal)</button>
            </div>
          </FuturisticCard>
        </div>
      </div>

      {/* 3. Nutrition Gauges Grid */}
      <section className="space-y-4">
        <SectionHeader
          badge="QUANTITATIVE TELEMETRY"
          title="Nutrient Concentration Breakdown"
          subtitle={`Calculated for ${currentGrams}g serving size based on package label values.`}
          align="left"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricGauge
            label="Energy"
            value={calc(food.calories)}
            unit="kcal"
            maxRecommended={600}
            statusText={calc(food.calories) > 400 ? 'HIGH' : 'NORMAL'}
            statusType={calc(food.calories) > 400 ? 'warning' : 'good'}
            icon={<Flame className="w-4 h-4 text-amber-400" />}
          />

          <MetricGauge
            label="Total Sugar"
            value={calc(food.sugar)}
            unit="g"
            maxRecommended={24}
            statusText={calc(food.sugar) > 20 ? 'HIGH SUGAR' : 'SAFE'}
            statusType={calc(food.sugar) > 20 ? 'danger' : 'good'}
            subtitle={`~${(calc(food.sugar) / 4).toFixed(1)} spoons sugar`}
            icon={<Zap className="w-4 h-4 text-rose-400" />}
          />

          <MetricGauge
            label="Total Fats"
            value={calc(food.totalFats)}
            unit="g"
            maxRecommended={30}
            statusText={`Sat: ${calc(food.saturatedFat)}g`}
            statusType={calc(food.saturatedFat) > 5 ? 'warning' : 'neutral'}
            icon={<Droplets className="w-4 h-4 text-cyan-400" />}
          />

          <MetricGauge
            label="Protein Fuel"
            value={calc(food.protein)}
            unit="g"
            maxRecommended={25}
            statusText={calc(food.protein) >= 10 ? 'HIGH PROTEIN' : 'MODERATE'}
            statusType={calc(food.protein) >= 10 ? 'good' : 'neutral'}
            icon={<Activity className="w-4 h-4 text-emerald-400" />}
          />
        </div>
      </section>

      {/* 4. Product Intelligence Comparison */}
      <FuturisticCard variant="neutral" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Product Intelligence & Category Benchmark
            </h3>
            <p className="text-xs text-slate-400 font-tech">Comparative health score against common benchmark alternatives</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-tech mb-1">
              <span className="font-bold text-white flex items-center gap-2">
                <span>{food.name} (Current)</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] ${getNutriColor(food.nutriGrade)}`}>{food.nutriGrade}</span>
              </span>
              <span className="font-bold text-emerald-400">{food.healthScore}/100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-700 shadow-[0_0_10px_#00F5A0]"
                style={{ width: `${food.healthScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-tech mb-1 text-slate-400">
              <span>Fresh Malai Paneer (Dairy Benchmark)</span>
              <span>84/100</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: '84%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-tech mb-1 text-slate-400">
              <span>Yoga Bar Protein Bar (Snack Benchmark)</span>
              <span>72/100</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-cyan-500/60 rounded-full" style={{ width: '72%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-tech mb-1 text-slate-400">
              <span>Maggi 2-Min Noodles (Instant Food Benchmark)</span>
              <span>42/100</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-rose-500/60 rounded-full" style={{ width: '42%' }} />
            </div>
          </div>
        </div>
      </FuturisticCard>

      {/* 5. Health Benefits & Excess Risks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FuturisticCard variant="emerald" className="p-5">
          <h3 className="font-bold font-tech text-xs uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Positive Nutritional Benefits
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {food.positiveEffects}
          </p>
        </FuturisticCard>

        <FuturisticCard variant="neutral" className="p-5 border-rose-500/30">
          <h3 className="font-bold font-tech text-xs uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Excess Consumption Risks
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {food.excessIntakeEffects}
          </p>
        </FuturisticCard>
      </div>

      {/* 6. Kid Safety Verdict Callout */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-fun font-bold text-sm text-amber-300 flex items-center gap-1.5">
              🧒 Kids & Minor Safety Verdict:
            </span>
            <span
              className={`text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded-full ${
                food.kidSuitability.isRecommendedForKids
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {food.kidSuitability.isRecommendedForKids ? 'Safe for Kids' : '🚫 Not for Kids'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {food.kidSuitability.kidWarningText}
          </p>
        </div>

        <GlowButton
          size="md"
          variant="kids"
          onClick={onOpenKidsBugBattle}
          className="shrink-0"
          icon={<Swords className="w-4 h-4" />}
        >
          Battle Bugs! 🐛⚡
        </GlowButton>
      </div>

      {/* 7. Healthier Alternatives (Smart Swaps) */}
      {food.healthierAlternatives.length > 0 && (
        <FuturisticCard variant="emerald" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold font-display text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Smart Healthier Swaps
              </h3>
              <p className="text-xs text-slate-400 font-tech">Curated alternatives with higher nutrient density & lower glycemic load</p>
            </div>
            <StatusBadge status="online" label="VERIFIED SWAPS" />
          </div>

          <div className="space-y-3">
            {food.healthierAlternatives.map((alt, i) => (
              <div
                key={i}
                className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white font-display">
                      {alt.name}
                    </h4>
                    <span className="text-[10px] font-tech px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {alt.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {alt.benefitHighlight}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-tech font-bold text-emerald-400 block">
                      {alt.calories} kcal
                    </span>
                    <span className="text-[10px] font-tech text-slate-400">{alt.sugar}g sugar</span>
                  </div>
                  <GlowButton
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      sounds.playSuccessChime();
                      onSwapAlternative(alt.name);
                    }}
                  >
                    Swap
                  </GlowButton>
                </div>
              </div>
            ))}
          </div>
        </FuturisticCard>
      )}
    </div>
  );
};
