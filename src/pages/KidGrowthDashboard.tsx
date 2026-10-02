import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  RotateCcw, 
  Zap, 
  Heart, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Activity, 
  Layers, 
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Apple
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { sounds } from '../utils/notifications';

export const KidGrowthDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentFood, setCurrentFood } = useApp();

  const [characterGender, setCharacterGender] = useState<'girl' | 'boy'>('girl'); // Maya by default
  const [selectedFood, setSelectedFood] = useState<FoodItem>(currentFood);
  const [eatingState, setEatingState] = useState<'ready' | 'eating' | 'grown'>('ready');
  const [isChomping, setIsChomping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'gut-xray' | 'growth-metrics'>('visualizer');

  // Sync selected food if currentFood changes externally
  useEffect(() => {
    setSelectedFood(currentFood);
    setEatingState('ready');
  }, [currentFood]);

  const isHealthy = selectedFood.consumptionSignal === 'GOOD' || (selectedFood.sugar < 15 && selectedFood.healthScore >= 60);
  const isJunk = selectedFood.consumptionSignal === 'BAD' || selectedFood.sugar > 20 || selectedFood.healthScore < 50;

  // Simulate Kid Eating & Growth Response
  const handleEatFood = (foodToEat = selectedFood) => {
    setSelectedFood(foodToEat);
    setCurrentFood(foodToEat);
    setEatingState('eating');
    setIsChomping(true);
    sounds.playChomp();

    setTimeout(() => {
      sounds.playChomp();
    }, 300);

    setTimeout(() => {
      setIsChomping(false);
      setEatingState('grown');
      if (isHealthy) {
        sounds.playSuccessChime();
      } else {
        sounds.playAlertPing();
      }
    }, 750);
  };

  const handleReset = () => {
    setEatingState('ready');
    sounds.playScanClick();
  };

  const characterName = characterGender === 'girl' ? 'Maya' : 'Leo';

  // Physiological metrics calculated from food
  const energyLevel = isHealthy ? 98 : isJunk ? 28 : 65;
  const growthFactor = isHealthy ? '+3.8x (Optimal Bone & Muscle)' : isJunk ? 'Delayed (Excess Fat Storage)' : '+1.2x (Moderate)';
  const metabolicSpeed = isHealthy ? 'High / Clean Burn' : isJunk ? 'Sluggish / Sugar Crash' : 'Balanced';
  const gutStatus = isHealthy ? 'Flourishing Microbiome' : isJunk ? 'Bacterial Imbalance & Bloating' : 'Stable';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dashboard 3 · Nutrition & Body Reaction Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Kid Food Growth & Body Reaction
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Observe real-time physiological effects: healthy foods build tall, athletic posture; junk foods trigger belly fat & sluggish digestion.
          </p>
        </div>

        {/* Character Gender Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <span className="text-xs font-bold text-slate-500 px-2">Character:</span>
          <button
            onClick={() => {
              setCharacterGender('girl');
              sounds.playScanClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              characterGender === 'girl'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>👧 Maya</span>
          </button>
          <button
            onClick={() => {
              setCharacterGender('boy');
              sounds.playScanClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              characterGender === 'boy'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>👦 Leo</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Character Growth Canvas */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-50 via-sky-50/50 to-emerald-50/40 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg relative flex flex-col justify-between min-h-[500px]">
          
          {/* Top Status Bar & Sub-Tabs */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                {characterName}'s Vitality Status:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                isHealthy
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {eatingState === 'grown'
                  ? (isHealthy ? '⚡ Growing Tall & Strong' : '⚠️ Bloated & Sluggish')
                  : 'Ready to Eat'}
              </span>
            </div>

            {/* View Switcher: Body Visualizer vs Gut X-Ray */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setActiveTab('visualizer')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'visualizer'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Body Growth
              </button>
              <button
                onClick={() => setActiveTab('gut-xray')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'gut-xray'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Gut X-Ray
              </button>
            </div>
          </div>

          {/* Center Morphing Character Graphic */}
          <div className="relative my-auto flex flex-col items-center justify-center py-6 select-none">
            {/* Visualizer Aura Glows */}
            {eatingState === 'grown' && isHealthy && (
              <div className="absolute w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl animate-pulse pointer-events-none"></div>
            )}
            {eatingState === 'grown' && isJunk && (
              <div className="absolute w-80 h-80 rounded-full bg-rose-500/20 blur-3xl animate-pulse pointer-events-none"></div>
            )}

            {/* Character SVG Container */}
            <div className="relative w-64 h-84 flex items-center justify-center">
              <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id="growthSkin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="100%" stopColor="#fba677" />
                  </linearGradient>
                  <linearGradient id="healthyShirtGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="bloatedShirtGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>
                </defs>

                {/* Growth Sparkles / Upward Arrows for Healthy Growth */}
                {eatingState === 'grown' && isHealthy && (
                  <g className="animate-pulse">
                    <path d="M 120 15 L 126 35 L 114 35 Z" fill="#10b981" />
                    <path d="M 50 110 L 55 95 L 45 95 Z" fill="#38bdf8" />
                    <path d="M 190 110 L 195 95 L 185 95 Z" fill="#38bdf8" />
                    <text x="120" y="8" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="900">
                      +GROWING TALLER!
                    </text>
                  </g>
                )}

                {/* Legs (Taller & athletic vs Heavy & strained) */}
                <g>
                  {eatingState === 'grown' && isHealthy ? (
                    // Taller, lean, athletic legs
                    <>
                      <rect x="78" y="195" width="22" height="95" rx="10" fill="#1e293b" />
                      <rect x="140" y="195" width="22" height="95" rx="10" fill="#1e293b" />
                      <rect x="72" y="282" width="30" height="16" rx="6" fill="#10b981" />
                      <rect x="138" y="282" width="30" height="16" rx="6" fill="#10b981" />
                    </>
                  ) : eatingState === 'grown' && isJunk ? (
                    // Strained, shorter, heavy legs
                    <>
                      <rect x="68" y="225" width="34" height="60" rx="16" fill="#334155" />
                      <rect x="138" y="225" width="34" height="60" rx="16" fill="#334155" />
                      <rect x="60" y="278" width="44" height="18" rx="8" fill="#475569" />
                      <rect x="134" y="278" width="44" height="18" rx="8" fill="#475569" />
                    </>
                  ) : (
                    // Standard neutral legs
                    <>
                      <rect x="84" y="210" width="24" height="75" rx="10" fill="#3b82f6" />
                      <rect x="132" y="210" width="24" height="75" rx="10" fill="#3b82f6" />
                      <rect x="76" y="275" width="34" height="16" rx="6" fill="#0f172a" />
                      <rect x="130" y="275" width="34" height="16" rx="6" fill="#0f172a" />
                    </>
                  )}
                </g>

                {/* Torso & Stomach (Morphs based on healthy vs junk) */}
                <g>
                  {eatingState === 'grown' && isJunk ? (
                    // Bloated / Fat round belly
                    <>
                      <ellipse cx="120" cy="172" rx="74" ry="58" fill="url(#bloatedShirtGrad)" />
                      {/* Belly stretch fold lines */}
                      <path d="M 80 162 Q 88 185 82 195" fill="none" stroke="#ffe4e6" strokeWidth="2.5" opacity="0.6" />
                      <path d="M 160 162 Q 152 185 158 195" fill="none" stroke="#ffe4e6" strokeWidth="2.5" opacity="0.6" />
                      
                      {/* Gut X-Ray Mode Overlay */}
                      {activeTab === 'gut-xray' && (
                        <>
                          <ellipse cx="120" cy="175" rx="48" ry="38" fill="#1e1b4b" opacity="0.85" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" />
                          <text x="120" y="156" textAnchor="middle" fill="#fecdd3" fontSize="8" fontWeight="bold">
                            SUGAR INSECTS FEEDING
                          </text>
                          {/* Animated Tummy Insects / Microbes */}
                          <text x="100" y="176" fontSize="16" className="animate-bounce">🐛</text>
                          <text x="135" y="180" fontSize="16" className="animate-pulse">🪲</text>
                          <text x="116" y="195" fontSize="14" className="animate-bounce">🐜</text>
                        </>
                      )}
                    </>
                  ) : eatingState === 'grown' && isHealthy ? (
                    // Lean, athletic, strong torso
                    <>
                      <path d="M 66 130 L 174 130 L 152 205 L 88 205 Z" fill="url(#healthyShirtGrad)" />
                      <line x1="120" y1="130" x2="120" y2="195" stroke="#047857" strokeWidth="2" opacity="0.4" />
                      <circle cx="120" cy="165" r="16" fill="#ffffff" opacity="0.9" />
                      <path d="M 120 155 Q 112 163 120 175 Q 128 163 120 155" fill="#10b981" />
                      
                      {/* Gut X-Ray Mode Overlay */}
                      {activeTab === 'gut-xray' && (
                        <>
                          <ellipse cx="120" cy="172" rx="42" ry="30" fill="#064e3b" opacity="0.85" stroke="#34d399" strokeWidth="2" />
                          <text x="120" y="162" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">
                            CLEAN DIGESTION ✨
                          </text>
                          <text x="105" y="182" fontSize="14">🍏</text>
                          <text x="132" y="182" fontSize="14">⚡</text>
                        </>
                      )}
                    </>
                  ) : (
                    // Standard neutral torso
                    <path
                      d="M 72 135 L 168 135 L 158 215 L 82 215 Z"
                      fill={characterGender === 'girl' ? '#ec4899' : '#3b82f6'}
                    />
                  )}
                </g>

                {/* Arms */}
                <g>
                  {eatingState === 'grown' && isHealthy ? (
                    // Muscular, energetic arms raised high
                    <>
                      <path d="M 66 135 Q 36 105 45 80" fill="none" stroke="url(#growthSkin)" strokeWidth="22" strokeLinecap="round" />
                      <circle cx="45" cy="75" r="12" fill="#10b981" />
                      <path d="M 174 135 Q 204 105 195 80" fill="none" stroke="url(#growthSkin)" strokeWidth="22" strokeLinecap="round" />
                      <circle cx="195" cy="75" r="12" fill="#10b981" />
                    </>
                  ) : eatingState === 'grown' && isJunk ? (
                    // Slumped, tired arms hanging heavily
                    <>
                      <path d="M 52 145 Q 32 175 58 200" fill="none" stroke="url(#growthSkin)" strokeWidth="26" strokeLinecap="round" />
                      <path d="M 188 145 Q 208 175 182 200" fill="none" stroke="url(#growthSkin)" strokeWidth="26" strokeLinecap="round" />
                    </>
                  ) : (
                    // Normal relaxed arms
                    <>
                      <path d="M 72 142 Q 45 168 55 195" fill="none" stroke="url(#growthSkin)" strokeWidth="20" strokeLinecap="round" />
                      <path d="M 168 142 Q 195 168 185 195" fill="none" stroke="url(#growthSkin)" strokeWidth="20" strokeLinecap="round" />
                    </>
                  )}
                </g>

                {/* Head, Hair & Facial Expression */}
                <g>
                  <circle cx="120" cy="85" r="38" fill="url(#growthSkin)" />
                  
                  {/* Hair */}
                  {characterGender === 'girl' ? (
                    <>
                      <path d="M 82 85 Q 76 46 120 45 Q 164 46 158 85 Q 145 66 120 68 Q 95 66 82 85" fill="#92400e" />
                      <circle cx="70" cy="82" r="14" fill="#92400e" />
                      <circle cx="170" cy="82" r="14" fill="#92400e" />
                    </>
                  ) : (
                    <path d="M 80 82 Q 78 50 120 48 Q 162 50 160 82 Q 148 68 120 70 Q 92 68 80 82" fill="#78350f" />
                  )}

                  {/* Face Expressions */}
                  {eatingState === 'grown' && isJunk ? (
                    // Sick, bloated, dizzy face
                    <>
                      <path d="M 98 84 Q 106 88 112 84" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 128 84 Q 134 88 142 84" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                      {/* Dizzy wavy mouth */}
                      <path d="M 104 104 Q 112 96 120 102 Q 128 96 136 104" fill="none" stroke="#be123c" strokeWidth="3" strokeLinecap="round" />
                      {/* Pale sick cheeks */}
                      <ellipse cx="98" cy="94" rx="7" ry="4" fill="#86efac" opacity="0.7" />
                      <ellipse cx="142" cy="94" rx="7" ry="4" fill="#86efac" opacity="0.7" />
                    </>
                  ) : eatingState === 'grown' && isHealthy ? (
                    // Big bright smile and sparkling eyes
                    <>
                      <circle cx="106" cy="84" r="6" fill="#0f172a" />
                      <circle cx="134" cy="84" r="6" fill="#0f172a" />
                      {/* Cheerful wide open grin */}
                      <path d="M 104 96 Q 120 114 136 96 Z" fill="#be123c" />
                      {/* Rosy healthy cheeks */}
                      <circle cx="96" cy="92" r="6" fill="#f43f5e" opacity="0.4" />
                      <circle cx="144" cy="92" r="6" fill="#f43f5e" opacity="0.4" />
                    </>
                  ) : (
                    // Chomping or neutral face
                    <>
                      <circle cx="106" cy="84" r="5" fill="#0f172a" />
                      <circle cx="134" cy="84" r="5" fill="#0f172a" />
                      <path
                        d={isChomping ? "M 108 94 Q 120 112 132 94 Z" : "M 108 98 Q 120 108 132 98"}
                        fill={isChomping ? "#be123c" : "none"}
                        stroke="#0f172a"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </>
                  )}
                </g>
              </svg>
            </div>
          </div>

          {/* Action Footer: Eat Food Button or Healthy Swap */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
            {eatingState === 'ready' && (
              <button
                onClick={() => handleEatFood()}
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <span>Feed {characterName} "{selectedFood.name}" & Watch Body Grow! 🍽️</span>
              </button>
            )}

            {eatingState === 'eating' && (
              <div className="py-3 px-4 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-2xl border border-amber-300 dark:border-amber-800 text-center font-bold text-sm animate-pulse">
                <span>Chomping and digesting nutrients... 😋🍽️</span>
              </div>
            )}

            {eatingState === 'grown' && (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again / Reset Body</span>
                </button>

                {isJunk && (
                  <button
                    onClick={() => {
                      // Swap to fresh apple or paneer
                      const healthyPack = OFFICIAL_HACKATHON_DATASET[11] || OFFICIAL_HACKATHON_DATASET[1];
                      handleEatFood(healthyPack);
                    }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Apple className="w-4 h-4 text-emerald-200" />
                    <span>Swap with Crisp Apple (Cure Bloat!)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Clear Physiological Impact Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Food Card Being Tested */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                  Active Food Pack
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedFood.name}
                </h3>
                <span className="text-xs text-slate-500">{selectedFood.brand} · {selectedFood.category}</span>
              </div>

              <span className={`px-2.5 py-1 rounded-xl text-xs font-black text-white ${
                selectedFood.consumptionSignal === 'GOOD' ? 'bg-emerald-600' : selectedFood.consumptionSignal === 'OK' ? 'bg-amber-500' : 'bg-rose-600'
              }`}>
                {selectedFood.consumptionSignal}
              </span>
            </div>

            {/* Quick Nutrient Spec */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Calories</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedFood.calories}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Free Sugar</span>
                <span className={`font-extrabold ${selectedFood.sugar > 20 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                  {selectedFood.sugar}g
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Protein</span>
                <span className="font-extrabold text-emerald-600">{selectedFood.protein}g</span>
              </div>
            </div>
          </div>

          {/* Physiological Metrics Dashboard */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Physiological Growth Measurements
            </h4>

            {/* Metric 1: Energy & Vitality Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Cellular Energy & Stamina:
                </span>
                <span className={isHealthy ? 'text-emerald-600' : 'text-rose-600'}>{energyLevel}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${energyLevel}%` }}
                  className={`h-full rounded-full transition-all duration-700 ${
                    isHealthy ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </div>
            </div>

            {/* Metric 2: Growth Factor & Lean Muscle Synthesis */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Height & Muscle Synthesis:</span>
              <span className={`font-extrabold ${isHealthy ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                {growthFactor}
              </span>
            </div>

            {/* Metric 3: Digestion & Gut Microbiome */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Gut Flora & Tummy State:</span>
              <span className={`font-extrabold ${isHealthy ? 'text-emerald-600' : 'text-rose-600'}`}>
                {gutStatus}
              </span>
            </div>

            {/* Detailed Scientific Pediatric Note */}
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              isHealthy
                ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-850 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-850 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {isHealthy ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
                <span>{isHealthy ? 'Pediatric Growth Assessment:' : 'Sugar & Fat Warning For Parents:'}</span>
              </div>
              <p>
                {isHealthy
                  ? `${selectedFood.name} provides clean sustained energy without triggering blood sugar spikes. Essential amino acids encourage cellular growth and strong bones.`
                  : `${selectedFood.name} delivers ${selectedFood.sugar}g free sugars (~${(selectedFood.sugar / 4).toFixed(1)} spoons). Rapid insulin spikes lead to rapid fat accumulation in the abdominal area and energy crashes.`}
              </p>
            </div>
          </div>

          {/* Quick Pack Testing Selectors */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
              Test Another Food Pack:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {OFFICIAL_HACKATHON_DATASET.slice(0, 4).map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleEatFood(food)}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs flex items-center justify-between ${
                    selectedFood.id === food.id
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <span className="truncate">{food.name}</span>
                  <span className="text-[10px] font-black">{food.consumptionSignal}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
