import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Sparkles, 
  Activity, 
  Heart, 
  Zap, 
  Brain, 
  Smile, 
  Frown, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Info,
  ArrowRight
} from 'lucide-react';
import { FoodItem } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { sounds } from '../utils/notifications';

interface KidHarmVisualizerProps {
  initialFood?: FoodItem | null;
  onSwapWithHealthyAlternative: (altName: string) => void;
}

export const KidHarmVisualizer: React.FC<KidHarmVisualizerProps> = ({
  initialFood,
  onSwapWithHealthyAlternative,
}) => {
  // Default to Cola Can (P011) or Kinder Joy (P005) or initialFood
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
    <div className="space-y-6">
      {/* Friendly Kid Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold font-fun backdrop-blur-md mb-2">
              <span>🦊 Sprout Fox & Sugar Detective</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-fun font-bold tracking-tight">
              What Happens When Kids Eat High-Sugar Foods & Drinks?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl mt-1">
              Explore how hidden sugars, artificial dyes, and caffeine affect growing teeth, brain focus, tummy health, and sleep energy.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 text-center shrink-0">
            <span className="text-[11px] uppercase font-bold text-white/80 block">WHO Daily Child Safe Cap</span>
            <span className="text-xl font-black font-fun">Max 24g Sugar</span>
            <span className="text-[10px] text-white/80 block">(~6 small spoons per day)</span>
          </div>
        </div>
      </div>

      {/* Select Food or Drink to test */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Select a Product to Visualize Bodily Impact:
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {OFFICIAL_HACKATHON_DATASET.map((item) => {
            const isSelected = selectedItem.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`px-3.5 py-2.5 rounded-2xl border text-left shrink-0 transition-all font-fun text-xs flex items-center gap-2.5 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-sm ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span className="text-lg">
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
                  <span className="font-bold block leading-tight">{item.name}</span>
                  <span className="text-[10px] text-slate-500 font-sans">{item.sugar}g sugar</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Sugar Spoons Meter & Servings Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase font-fun">Sugar Load Calculator</span>
                <h3 className="text-xl font-fun font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedItem.name}
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold font-fun ${
                  selectedItem.kidSuitability.isRecommendedForKids
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {selectedItem.kidSuitability.isRecommendedForKids ? 'Kid Safe' : '🚫 Not for Kids'}
              </span>
            </div>

            {/* Serving portion slider */}
            <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-slate-700 dark:text-slate-300 font-fun">Portion / Servings:</span>
                <span className="text-amber-600 dark:text-amber-400 font-extrabold">{servings} Serving(s)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={servings}
                onChange={(e) => setServings(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-sans mt-1">
                <span>Half Portion (0.5x)</span>
                <span>Standard (1x)</span>
                <span>Double (2x)</span>
                <span>Mega (3x)</span>
              </div>
            </div>

            {/* Big Sugar Spoons Stack Display */}
            <div className="mt-6 text-center p-6 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/40">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 font-fun uppercase">
                Visual Sugar Equivalence
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-amber-600 dark:text-amber-400 font-fun my-2 flex items-center justify-center gap-2">
                <span>{spoons}</span>
                <span className="text-lg text-slate-600 dark:text-slate-300 font-normal">Spoons of Sugar</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ({totalSugar} grams total free sugar in {servings} serving)
              </p>

              {/* Physical Spoon Icons Grid */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-h-36 overflow-y-auto p-2 bg-white/60 dark:bg-slate-900/60 rounded-xl">
                {Array.from({ length: Math.min(30, Math.ceil(spoons)) }).map((_, i) => (
                  <span
                    key={i}
                    title={`Spoon ${i + 1}`}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shadow-sm transition-transform hover:scale-125 ${
                      i < 6
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    }`}
                  >
                    🥄
                  </span>
                ))}
              </div>

              {/* Child Daily Allowance Bar */}
              <div className="mt-4 text-left">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-fun">
                    Percent of Daily Child Allowance (24g):
                  </span>
                  <span
                    className={`font-black ${
                      percentOfDailyLimit > 100
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {percentOfDailyLimit}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, percentOfDailyLimit)}%` }}
                    className={`h-full transition-all duration-500 rounded-full ${
                      percentOfDailyLimit > 100
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                {percentOfDailyLimit > 100 && (
                  <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                    Exceeds safe daily maximum by {percentOfDailyLimit - 100}% in one go!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Child Warning Text */}
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-xs text-rose-900 dark:text-rose-200">
            <h4 className="font-bold flex items-center gap-1.5 mb-1 font-fun">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Pediatric Nutritional Warning
            </h4>
            <p className="leading-relaxed">{selectedItem.kidSuitability.kidWarningText}</p>
          </div>
        </div>

        {/* Interactive Human Body Explorer */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Interactive Body Map
                </span>
                <h3 className="text-lg font-fun font-bold text-slate-900 dark:text-white">
                  Where Does Junk Food Hurt Young Bodies?
                </h3>
              </div>
              <span className="text-[11px] text-amber-600 font-semibold font-fun">
                Tap an organ below ⬇️
              </span>
            </div>

            {/* Organ Tabs */}
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              <button
                onClick={() => {
                  sounds.playScanClick();
                  setActiveOrgan('teeth');
                }}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-fun transition-all border ${
                  activeOrgan === 'teeth'
                    ? 'bg-rose-500 text-white border-rose-400 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-xl">🦷</span>
                <span className="font-bold text-[11px]">Teeth</span>
              </button>

              <button
                onClick={() => {
                  sounds.playScanClick();
                  setActiveOrgan('brain');
                }}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-fun transition-all border ${
                  activeOrgan === 'brain'
                    ? 'bg-amber-500 text-white border-amber-400 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-xl">🧠</span>
                <span className="font-bold text-[11px]">Brain</span>
              </button>

              <button
                onClick={() => {
                  sounds.playScanClick();
                  setActiveOrgan('tummy');
                }}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-fun transition-all border ${
                  activeOrgan === 'tummy'
                    ? 'bg-orange-500 text-white border-orange-400 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-xl">🧃</span>
                <span className="font-bold text-[11px]">Tummy</span>
              </button>

              <button
                onClick={() => {
                  sounds.playScanClick();
                  setActiveOrgan('heart');
                }}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-fun transition-all border ${
                  activeOrgan === 'heart'
                    ? 'bg-red-500 text-white border-red-400 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-xl">🫀</span>
                <span className="font-bold text-[11px]">Heart</span>
              </button>

              <button
                onClick={() => {
                  sounds.playScanClick();
                  setActiveOrgan('energy');
                }}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-fun transition-all border ${
                  activeOrgan === 'energy'
                    ? 'bg-indigo-500 text-white border-indigo-400 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-xl">⚡</span>
                <span className="font-bold text-[11px]">Energy</span>
              </button>
            </div>

            {/* Organ Explanation Card */}
            <div className="p-5 rounded-2xl border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 space-y-3">
              {activeOrgan === 'teeth' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🦷</span>
                    <h4 className="font-fun font-bold text-base text-slate-900 dark:text-white">
                      Dental Enamel Erosion & Cavity Acid
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    When children sip sugary drinks or eat sticky sweets (like Kinder Joy or Bourbon cream), mouth bacteria feed on the sugars within <strong>20 seconds</strong>, turning it into corrosive lactic acid that eats away protective enamel and creates painful cavities.
                  </p>
                  <div className="p-3 bg-rose-100/60 dark:bg-rose-950/40 rounded-xl text-[11px] text-rose-900 dark:text-rose-200 font-medium">
                    🦷 <strong>Pro Tip:</strong> Drinking water right after a snack or choosing crunchy apples washes away acid and saves enamel!
                  </div>
                </div>
              )}

              {activeOrgan === 'brain' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧠</span>
                    <h4 className="font-fun font-bold text-base text-slate-900 dark:text-white">
                      Hyperactivity Spike & Focus Crashes
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    High free sugars spike blood glucose rapidly. In young brains, this causes dopamine surges leading to erratic restlessness and fidgeting. 45 minutes later, an insulin rebound triggers a sharp crash — causing afternoon temper tantrums and difficulty focusing on schoolwork.
                  </p>
                  {selectedItem.kidSuitability.harmfulAdditives?.some((a) => a.includes('E102') || a.includes('E110')) && (
                    <div className="p-3 bg-amber-100/60 dark:bg-amber-950/40 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 font-medium">
                      ⚠️ <strong>Azo Dye Alert:</strong> Contains artificial colors (Tartrazine E102 / Sunset Yellow E110) which have mandated EU warnings for childhood attention deficit.
                    </div>
                  )}
                </div>
              )}

              {activeOrgan === 'tummy' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧃</span>
                    <h4 className="font-fun font-bold text-base text-slate-900 dark:text-white">
                      Gut Microbiome Imbalance & Bloating
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Ultra-processed palm fats and refined sugars bypass stomach satiety and feed opportunistic bacteria, causing gas, stomach aches, and poor absorption of natural minerals like zinc and iron.
                  </p>
                </div>
              )}

              {activeOrgan === 'heart' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🫀</span>
                    <h4 className="font-fun font-bold text-base text-slate-900 dark:text-white">
                      Vessel Strain & Caffeine Palpitations
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    High sodium in instant noodles (like Maggi's 860mg) pulls water into blood vessels, straining small hearts. In carbonated colas, caffeine can induce rapid heartbeat, nervousness, and sleep disruption.
                  </p>
                </div>
              )}

              {activeOrgan === 'energy' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <h4 className="font-fun font-bold text-base text-slate-900 dark:text-white">
                      Energy Rollercoaster vs. Steady Fuel
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Whole grains and proteins (like roasted makhana, paneer, oats) provide a smooth 4-hour burn. Refined junk food creates a sharp 20-minute spike followed by deep fatigue.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Healthy Swap Recommendation Card */}
          {selectedItem.healthierAlternatives.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-2xl border border-emerald-300 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-fun flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Hero Swap: Switch to something delicious & safe!
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white font-fun">
                    {selectedItem.healthierAlternatives[0].name}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {selectedItem.healthierAlternatives[0].benefitHighlight}
                  </p>
                </div>
                <button
                  onClick={() => onSwapWithHealthyAlternative(selectedItem.healthierAlternatives[0].name)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs rounded-xl shadow-sm shrink-0 flex items-center gap-1.5 transition-all"
                >
                  <span>Choose This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
