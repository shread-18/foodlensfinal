import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Sparkles, 
  Activity, 
  Heart, 
  Zap, 
  Brain, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { FoodItem } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { sounds } from '../utils/notifications';
import { StatusBadge } from './ui/StatusBadge';
import { GlowButton } from './ui/GlowButton';

interface KidHarmVisualizerProps {
  initialFood?: FoodItem | null;
  onSwapWithHealthyAlternative: (altName: string) => void;
}

export const KidHarmVisualizer: React.FC<KidHarmVisualizerProps> = ({
  initialFood,
  onSwapWithHealthyAlternative,
}) => {
  const [selectedItem, setSelectedItem] = useState<FoodItem>(
    initialFood || OFFICIAL_HACKATHON_DATASET.find((f) => f.id === 'P011') || OFFICIAL_HACKATHON_DATASET[4]
  );
  const [servings, setServings] = useState<number>(1);
  const [activeOrgan, setActiveOrgan] = useState<'teeth' | 'brain' | 'tummy' | 'heart' | 'energy'>('teeth');

  const totalSugar = Math.round(selectedItem.sugar * servings * 10) / 10;
  const spoons = Math.round((totalSugar / 4) * 10) / 10; // 1 spoon = 4g sugar
  const childMaxDailyAllowance = 24; // 24g max for kids
  const percentOfDailyLimit = Math.round((totalSugar / childMaxDailyAllowance) * 100);

  const handleSelectItem = (item: FoodItem) => {
    sounds.playScanClick();
    setSelectedItem(item);
    if (!item.kidSuitability.isRecommendedForKids) {
      sounds.playAlertPing();
    } else {
      sounds.playSuccessChime();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Friendly Cyber Hero Kid Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 border border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-orange-950/60 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="corner-bracket-tl !border-amber-400" />
        <div className="corner-bracket-tr !border-amber-400" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 mb-2">
              <span>🦊 SPROUT FOX // SUGAR DETECTIVE MATRIX</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-wide">
              What Happens When Kids Eat High-Sugar Foods?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Explore how hidden sugars, artificial azo-dyes, and caffeine impact growing teeth, neural focus, gut biome, and stamina.
            </p>
          </div>

          <div className="glass-panel px-5 py-3 rounded-2xl border border-amber-500/40 text-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-300 block">WHO Child Safe Standard</span>
            <span className="text-2xl font-heading font-black text-white">MAX 24g</span>
            <span className="text-[10px] font-mono text-slate-400 block">(≤ 6 small spoons/day)</span>
          </div>
        </div>
      </div>

      {/* Select Food or Drink to test */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            SELECT SAMPLE FOOD TO PROJECT PHYSIOLOGICAL IMPACT:
          </h3>
          <span className="text-[10px] font-mono text-slate-500">12 TEST PACKS AVAILABLE</span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {OFFICIAL_HACKATHON_DATASET.map((item) => {
            const isSelected = selectedItem.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`px-4 py-3 rounded-2xl border text-left shrink-0 transition-all text-xs flex items-center gap-3 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <span className="text-2xl">
                  {item.category.includes('Beverage')
                    ? '🥤'
                    : item.category.includes('Chocolate')
                    ? '🍫'
                    : item.category.includes('Noodles')
                    ? '🍜'
                    : item.category.includes('Chips')
                    ? '🥨'
                    : item.category.includes('Fruit')
                    ? '🍏'
                    : '🍪'}
                </span>
                <div>
                  <span className="font-heading font-bold block leading-tight">{item.name}</span>
                  <span className="text-[10px] font-mono text-amber-400">{item.sugar}g sugar</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Sugar Spoons Meter & Servings Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  SUGAR LOAD TELEMETRY
                </span>
                <h3 className="text-xl font-heading font-extrabold text-white mt-0.5">
                  {selectedItem.name}
                </h3>
              </div>
              <StatusBadge
                label={selectedItem.kidSuitability.isRecommendedForKids ? 'KID SAFE' : 'LIMIT INTAKE'}
                variant={selectedItem.kidSuitability.isRecommendedForKids ? 'online' : 'warning'}
              />
            </div>

            {/* Serving portion slider */}
            <div className="mt-5 p-4 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span className="text-slate-300">Portion / Servings:</span>
                <span className="text-amber-400 font-extrabold px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  {servings}x Serving
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={servings}
                onChange={(e) => setServings(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.5x Portion</span>
                <span>1x Standard</span>
                <span>2x Double</span>
                <span>3x Mega</span>
              </div>
            </div>

            {/* Big Sugar Spoons Stack Display */}
            <div className="mt-6 text-center p-6 bg-slate-900/70 rounded-2xl border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.08)]">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                VISUAL SUGAR EQUIVALENCE
              </span>
              <div className="text-4xl sm:text-5xl font-heading font-black text-amber-300 my-2 flex items-center justify-center gap-2">
                <span>{spoons}</span>
                <span className="text-lg font-sans font-normal text-slate-400">Spoons of Sugar</span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                ({totalSugar} grams total free sugar in {servings} serving)
              </p>

              {/* Physical Spoon Icons Grid */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-h-36 overflow-y-auto p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                {Array.from({ length: Math.min(30, Math.ceil(spoons)) }).map((_, i) => (
                  <span
                    key={i}
                    title={`Spoon ${i + 1}`}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shadow-sm transition-transform hover:scale-125 ${
                      i < 6
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    }`}
                  >
                    🥄
                  </span>
                ))}
              </div>

              {/* Child Daily Allowance Bar */}
              <div className="mt-5 text-left">
                <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
                  <span className="text-slate-300">
                    Percent of Daily Child Allowance (24g max):
                  </span>
                  <span
                    className={`font-black ${
                      percentOfDailyLimit > 100
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {percentOfDailyLimit}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    style={{ width: `${Math.min(100, percentOfDailyLimit)}%` }}
                    className={`h-full transition-all duration-500 rounded-full ${
                      percentOfDailyLimit > 100
                        ? 'bg-gradient-to-r from-amber-400 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(0,245,160,0.5)]'
                    }`}
                  />
                </div>
                {percentOfDailyLimit > 100 && (
                  <p className="text-[11px] font-mono font-bold text-rose-400 mt-2 flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                    EXCEEDS SAFE DAILY MAXIMUM BY {percentOfDailyLimit - 100}% IN A SINGLE SERVING!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Child Warning Text */}
          <div className="p-4 bg-rose-950/30 border border-rose-500/30 rounded-2xl text-xs text-rose-300 space-y-1">
            <h4 className="font-heading font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Pediatric Nutritional Warning
            </h4>
            <p className="leading-relaxed text-slate-300">{selectedItem.kidSuitability.kidWarningText}</p>
          </div>
        </div>

        {/* Interactive Human Body Explorer */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  PHYSIOLOGICAL MAP
                </span>
                <h3 className="text-lg font-heading font-extrabold text-white">
                  Where Does Junk Food Strain Young Bodies?
                </h3>
              </div>
              <span className="text-[11px] font-mono text-amber-400">
                Select organ below ⬇️
              </span>
            </div>

            {/* Organ Tabs */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <button
                onClick={() => {
                  sounds.playScanClick();
                  setActiveOrgan('teeth');
                }}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs transition-all border ${
                  activeOrgan === 'teeth'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-105'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xl">🦷</span>
                <span className="font-heading font-bold text-[11px]">Teeth</span>
              </button>

              <button
                onClick={() => {
                  sounds.playScanClick();
                  setActiveOrgan('brain');
                }}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs transition-all border ${
                  activeOrgan === 'brain'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-105'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xl">🧠</span>
                <span className="font-heading font-bold text-[11px]">Brain</span>
              </button>

              <button
                onClick={() => {
                  sounds.playScanClick();
                  setActiveOrgan('tummy');
                }}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs transition-all border ${
                  activeOrgan === 'tummy'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-105'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xl">🧃</span>
                <span className="font-heading font-bold text-[11px]">Tummy</span>
              </button>

              <button
                onClick={() => {
                  sounds.playScanClick();
                  setActiveOrgan('heart');
                }}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs transition-all border ${
                  activeOrgan === 'heart'
                    ? 'bg-red-500/20 text-red-300 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] scale-105'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xl">🫀</span>
                <span className="font-heading font-bold text-[11px]">Heart</span>
              </button>

              <button
                onClick={() => {
                  sounds.playScanClick();
                  setActiveOrgan('energy');
                }}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs transition-all border ${
                  activeOrgan === 'energy'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.3)] scale-105'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xl">⚡</span>
                <span className="font-heading font-bold text-[11px]">Energy</span>
              </button>
            </div>

            {/* Organ Explanation Card */}
            <div className="p-5 rounded-2xl border bg-slate-900/70 border-slate-800 space-y-3">
              {activeOrgan === 'teeth' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🦷</span>
                    <h4 className="font-heading font-bold text-base text-white">
                      Dental Enamel Erosion & Cavity Acid
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    When children sip sugary drinks or eat sticky sweets (like Kinder Joy or Bourbon cream), mouth bacteria feed on the sugars within <strong>20 seconds</strong>, turning it into corrosive lactic acid that eats away protective enamel and creates painful cavities.
                  </p>
                  <div className="p-3 bg-rose-950/40 rounded-xl text-[11px] text-rose-300 font-mono border border-rose-500/30">
                    🦷 <strong>PRO TIP:</strong> Rinsing with pure water right after a snack washes away acid and protects enamel!
                  </div>
                </div>
              )}

              {activeOrgan === 'brain' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧠</span>
                    <h4 className="font-heading font-bold text-base text-white">
                      Hyperactivity Spike & Focus Crashes
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    High free sugars spike blood glucose rapidly. In young brains, this causes dopamine surges leading to erratic restlessness and fidgeting. 45 minutes later, an insulin rebound triggers a sharp crash — causing afternoon temper tantrums and difficulty focusing on schoolwork.
                  </p>
                  {selectedItem.kidSuitability.harmfulAdditives?.some((a) => a.includes('E102') || a.includes('E110')) && (
                    <div className="p-3 bg-amber-950/40 rounded-xl text-[11px] text-amber-300 font-mono border border-amber-500/30">
                      ⚠️ <strong>AZO DYE ALERT:</strong> Contains artificial colors (Tartrazine E102 / Sunset Yellow E110) which have mandated EU warnings for childhood attention deficit.
                    </div>
                  )}
                </div>
              )}

              {activeOrgan === 'tummy' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧃</span>
                    <h4 className="font-heading font-bold text-base text-white">
                      Gut Microbiome Imbalance & Bloating
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ultra-processed palm fats and refined sugars bypass stomach satiety and feed opportunistic bacteria, causing gas, stomach aches, and poor absorption of natural minerals like zinc and iron.
                  </p>
                </div>
              )}

              {activeOrgan === 'heart' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🫀</span>
                    <h4 className="font-heading font-bold text-base text-white">
                      Vessel Strain & Caffeine Palpitations
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    High sodium in instant noodles (like Maggi's 860mg) pulls water into blood vessels, straining small hearts. In carbonated colas, caffeine can induce rapid heartbeat, nervousness, and sleep disruption.
                  </p>
                </div>
              )}

              {activeOrgan === 'energy' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <h4 className="font-heading font-bold text-base text-white">
                      Energy Rollercoaster vs. Steady Fuel
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Whole grains and proteins (like roasted makhana, paneer, oats) provide a smooth 4-hour burn. Refined junk food creates a sharp 20-minute spike followed by deep fatigue.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Healthy Swap Recommendation Card */}
          {selectedItem.healthierAlternatives.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 rounded-2xl border border-emerald-500/40 shadow-[0_0_20px_rgba(0,245,160,0.1)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  HERO SWAP // SMARTER ALTERNATIVE IDENTIFIED:
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-heading font-bold text-sm text-white">
                    {selectedItem.healthierAlternatives[0].name}
                  </h5>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedItem.healthierAlternatives[0].benefitHighlight}
                  </p>
                </div>
                <GlowButton
                  variant="primary"
                  onClick={() => onSwapWithHealthyAlternative(selectedItem.healthierAlternatives[0].name)}
                  className="text-xs shrink-0"
                >
                  <span>CHOOSE THIS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </GlowButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
