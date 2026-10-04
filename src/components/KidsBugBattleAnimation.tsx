import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Zap, 
  Shield, 
  Heart, 
  Volume2, 
  ArrowRight,
  Flame,
  Frown,
  Smile,
  Swords,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FoodItem } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { sounds } from '../utils/notifications';

interface KidsBugBattleAnimationProps {
  currentFood?: FoodItem | null;
  onSelectHealthyAlternative?: (foodName: string) => void;
}

interface Bug {
  id: number;
  x: number;
  y: number;
  type: 'sugar-worm' | 'grease-beetle' | 'acid-ant';
  isAlive: boolean;
  defeatedAnimation?: boolean;
}

export const KidsBugBattleAnimation: React.FC<KidsBugBattleAnimationProps> = ({
  currentFood,
  onSelectHealthyAlternative,
}) => {
  // Character Gender
  const [characterGender, setCharacterGender] = useState<'boy' | 'girl'>('boy');
  
  // Selected Food to Eat (defaults to current scanned food or Kinder Joy/Cola)
  const [activeFood, setActiveFood] = useState<FoodItem>(
    currentFood || OFFICIAL_HACKATHON_DATASET[4] // Kinder Joy by default
  );

  // Animation Stage: 'idle' | 'eating' | 'unhealthy-bloated' | 'healthy-powerup' | 'battle' | 'victory'
  const [stage, setStage] = useState<'idle' | 'eating' | 'unhealthy-bloated' | 'healthy-powerup' | 'battle' | 'victory'>('idle');
  const [heroEnergy, setHeroEnergy] = useState<number>(50);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [comboHits, setComboHits] = useState<number>(0);
  const [isMouthChomping, setIsMouthChomping] = useState<boolean>(false);

  // Sync if currentFood changes
  useEffect(() => {
    if (currentFood) {
      setActiveFood(currentFood);
      setStage('idle');
    }
  }, [currentFood]);

  // Feed food and trigger appropriate storyline
  const handleFeedCharacter = (food: FoodItem) => {
    setActiveFood(food);
    setStage('eating');
    setIsMouthChomping(true);
    sounds.playChomp();

    setTimeout(() => {
      sounds.playChomp();
    }, 400);

    setTimeout(() => {
      setIsMouthChomping(false);
      const isUnhealthy = food.consumptionSignal === 'BAD' || food.sugar > 20 || food.healthScore < 50;

      if (isUnhealthy) {
        // Unhealthy Path: Bloated, fat, tummy bugs appear
        setStage('unhealthy-bloated');
        setHeroEnergy(15);
        sounds.playAlertPing();
        sounds.playBugBuzz();

        // Spawn bugs in tummy
        const initialBugs: Bug[] = [
          { id: 1, x: 42, y: 55, type: 'sugar-worm', isAlive: true },
          { id: 2, x: 58, y: 54, type: 'grease-beetle', isAlive: true },
          { id: 3, x: 50, y: 62, type: 'acid-ant', isAlive: true },
          { id: 4, x: 45, y: 68, type: 'sugar-worm', isAlive: true },
          { id: 5, x: 55, y: 66, type: 'grease-beetle', isAlive: true },
        ];
        setBugs(initialBugs);
      } else {
        // Healthy Path: Superhero power up! Slim, strong, energy max!
        setStage('healthy-powerup');
        setHeroEnergy(100);
        sounds.playSuccessChime();

        // If bugs previously existed, start battle to punch them!
        setTimeout(() => {
          setStage('battle');
          sounds.playZap();
          autoDefeatBugs();
        }, 1200);
      }
    }, 900);
  };

  // Auto-defeat bugs with super lightning strike
  const autoDefeatBugs = () => {
    let delay = 300;
    bugs.forEach((b, idx) => {
      setTimeout(() => {
        sounds.playZap();
        setBugs((prev) =>
          prev.map((bug) => (bug.id === b.id ? { ...bug, isAlive: false, defeatedAnimation: true } : bug))
        );
        setComboHits((c) => c + 1);

        if (idx === bugs.length - 1) {
          setTimeout(() => {
            setStage('victory');
            sounds.playVictory();
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
              colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e'],
            });
          }, 600);
        }
      }, delay);
      delay += 400;
    });

    if (bugs.length === 0) {
      setStage('victory');
      sounds.playVictory();
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  // Interactive tap on bug to zap it
  const handleTapBug = (bugId: number) => {
    sounds.playZap();
    setComboHits((c) => c + 1);
    setBugs((prev) =>
      prev.map((b) => (b.id === bugId ? { ...b, isAlive: false, defeatedAnimation: true } : b))
    );

    const remaining = bugs.filter((b) => b.id !== bugId && b.isAlive);
    if (remaining.length === 0) {
      setStage('victory');
      sounds.playVictory();
      confetti({ particleCount: 80, spread: 70 });
    }
  };

  const isBloated = stage === 'unhealthy-bloated';
  const isPoweredUp = stage === 'healthy-powerup' || stage === 'battle' || stage === 'victory';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Playful Futuristic Arena Header */}
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 rounded-3xl p-6 border border-amber-400/40 backdrop-blur-xl relative overflow-hidden shadow-[0_10px_35px_rgba(251,191,36,0.15)]">
        <div className="corner-bracket-tl !border-amber-400" />
        <div className="corner-bracket-tr !border-amber-400" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black font-fun tracking-wide backdrop-blur-md mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>SUPERHERO NUTRITION ARENA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-fun font-black text-white tracking-wide">
              TUMMY BUG BATTLE 🐛⚡
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl mt-1 font-sans">
              "Eat smart. Power up. Defeat the bugs!" See how nutritious foods charge your hero aura and blast away greedy sugar bugs!
            </p>
          </div>

          {/* Boy / Girl Avatar Toggle */}
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-amber-400/30 shrink-0">
            <button
              onClick={() => {
                setCharacterGender('boy');
                sounds.playScanClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-fun font-bold text-xs transition-all cursor-pointer ${
                characterGender === 'boy'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-base">👦</span>
              <span>Leo</span>
            </button>
            <button
              onClick={() => {
                setCharacterGender('girl');
                sounds.playScanClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-fun font-bold text-xs transition-all cursor-pointer ${
                characterGender === 'girl'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-base">👧</span>
              <span>Maya</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage & Character Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Character Stage (Interactive Animation Frame) */}
        <div className="lg:col-span-8 bg-slate-950/80 rounded-3xl p-6 border-2 border-amber-400/30 shadow-[0_0_30px_rgba(251,191,36,0.15)] relative min-h-[480px] flex flex-col justify-between overflow-hidden select-none">
          <div className="corner-bracket-tl !border-amber-400" />
          <div className="corner-bracket-tr !border-amber-400" />
          <div className="corner-bracket-bl !border-amber-400" />
          <div className="corner-bracket-br !border-amber-400" />

          {/* Energy Bar at Top */}
          <div className="relative z-10 flex items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/80 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-lg">{isPoweredUp ? '⚡' : isBloated ? '😴' : '😊'}</span>
              <span className="font-fun font-bold text-xs text-slate-200">
                {characterGender === 'boy' ? "Leo's Super Energy:" : "Maya's Super Energy:"}
              </span>
            </div>
            <div className="flex-1 max-w-xs bg-slate-800 h-4 rounded-full overflow-hidden relative border border-slate-700">
              <div
                style={{ width: `${heroEnergy}%` }}
                className={`h-full transition-all duration-700 rounded-full ${
                  isPoweredUp
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 animate-pulse shadow-[0_0_12px_#00F5A0]'
                    : isBloated
                    ? 'bg-rose-500 shadow-[0_0_10px_#FF4D6D]'
                    : 'bg-cyan-400'
                }`}
              />
            </div>
            <span className="font-tech font-black text-xs text-emerald-400">{heroEnergy}%</span>
          </div>

          {/* Center Character SVG Graphic with Dynamic Morphing */}
          <div className="relative my-auto flex items-center justify-center py-4">
            {/* Superhero Aura Glow when Healthy */}
            {isPoweredUp && (
              <div className="absolute w-72 h-72 rounded-full bg-emerald-400/20 dark:bg-emerald-500/30 blur-2xl animate-pulse pointer-events-none"></div>
            )}

            {/* Bloated Slime Glow when Unhealthy */}
            {isBloated && (
              <div className="absolute w-80 h-80 rounded-full bg-rose-400/20 dark:bg-rose-500/25 blur-3xl animate-pulse pointer-events-none"></div>
            )}

            {/* SVG Character */}
            <div className="relative w-64 h-80 flex items-center justify-center">
              <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id="bodySkin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffd5b5" />
                    <stop offset="100%" stopColor="#f8be95" />
                  </linearGradient>
                  <linearGradient id="healthyShirt" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="unhealthyShirt" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>
                </defs>

                {/* Superhero Lightning Aura Spikes when Powered Up */}
                {isPoweredUp && (
                  <g className="animate-spin" style={{ transformOrigin: '120px 140px', animationDuration: '10s' }}>
                    <path d="M 120 10 L 125 35 L 115 35 Z" fill="#fbbf24" opacity="0.8" />
                    <path d="M 230 140 L 205 135 L 205 145 Z" fill="#fbbf24" opacity="0.8" />
                    <path d="M 120 270 L 125 245 L 115 245 Z" fill="#fbbf24" opacity="0.8" />
                    <path d="M 10 140 L 35 135 L 35 145 Z" fill="#fbbf24" opacity="0.8" />
                  </g>
                )}

                {/* Character Legs */}
                <g>
                  {isPoweredUp ? (
                    // Athletic superhero wide stance
                    <>
                      <rect x="75" y="210" width="22" height="75" rx="10" fill="#1e293b" />
                      <rect x="143" y="210" width="22" height="75" rx="10" fill="#1e293b" />
                      {/* Red superhero boots */}
                      <rect x="68" y="275" width="32" height="18" rx="6" fill="#ef4444" />
                      <rect x="140" y="275" width="32" height="18" rx="6" fill="#ef4444" />
                    </>
                  ) : isBloated ? (
                    // Strained, heavy wobbly legs
                    <>
                      <rect x="70" y="225" width="32" height="55" rx="14" fill="#334155" />
                      <rect x="138" y="225" width="32" height="55" rx="14" fill="#334155" />
                      {/* Heavy shoes */}
                      <rect x="62" y="270" width="44" height="20" rx="8" fill="#475569" />
                      <rect x="134" y="270" width="44" height="20" rx="8" fill="#475569" />
                    </>
                  ) : (
                    // Normal relaxed legs
                    <>
                      <rect x="85" y="210" width="24" height="70" rx="10" fill="#3b82f6" />
                      <rect x="131" y="210" width="24" height="70" rx="10" fill="#3b82f6" />
                      {/* Normal shoes */}
                      <rect x="78" y="270" width="34" height="16" rx="6" fill="#0f172a" />
                      <rect x="128" y="270" width="34" height="16" rx="6" fill="#0f172a" />
                    </>
                  )}
                </g>

                {/* Arms */}
                <g>
                  {isPoweredUp ? (
                    // Flexing superhero arms with big muscles!
                    <>
                      {/* Left flexing arm */}
                      <path d="M 65 140 Q 35 110 40 85 Q 55 90 65 115" fill="url(#bodySkin)" stroke="#e29b6c" strokeWidth="2" />
                      <circle cx="45" cy="85" r="12" fill="url(#bodySkin)" />
                      {/* Left fist */}
                      <circle cx="45" cy="75" r="14" fill="#ef4444" />

                      {/* Right flexing arm */}
                      <path d="M 175 140 Q 205 110 200 85 Q 185 90 175 115" fill="url(#bodySkin)" stroke="#e29b6c" strokeWidth="2" />
                      <circle cx="195" cy="85" r="12" fill="url(#bodySkin)" />
                      {/* Right fist with lightning punch! */}
                      <circle cx="195" cy="75" r="14" fill="#ef4444" />
                      <path d="M 210 70 L 225 60 L 218 80 L 235 70" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                    </>
                  ) : isBloated ? (
                    // Sluggish, tired droopy arms resting on belly
                    <>
                      <path d="M 45 150 Q 30 180 60 200" fill="none" stroke="url(#bodySkin)" strokeWidth="24" strokeLinecap="round" />
                      <path d="M 195 150 Q 210 180 180 200" fill="none" stroke="url(#bodySkin)" strokeWidth="24" strokeLinecap="round" />
                    </>
                  ) : (
                    // Normal cheerful standing arms
                    <>
                      <path d="M 70 145 Q 40 170 50 195" fill="none" stroke="url(#bodySkin)" strokeWidth="20" strokeLinecap="round" />
                      <path d="M 170 145 Q 200 170 190 195" fill="none" stroke="url(#bodySkin)" strokeWidth="20" strokeLinecap="round" />
                    </>
                  )}
                </g>

                {/* Torso / Body (SLIM & FIT VS. BLOATED & FAT) */}
                <g>
                  {isBloated ? (
                    // BLOATED & FAT SILHOUETTE
                    <>
                      {/* Outer rounded fat belly */}
                      <ellipse cx="120" cy="170" rx="72" ry="58" fill="url(#unhealthyShirt)" />
                      {/* Strained stretched shirt seams */}
                      <line x1="80" y1="160" x2="85" y2="185" stroke="#ffe4e6" strokeWidth="2" opacity="0.6" />
                      <line x1="160" y1="160" x2="155" y2="185" stroke="#ffe4e6" strokeWidth="2" opacity="0.6" />

                      {/* Translucent Stomach X-Ray Bubble where bugs feed */}
                      <ellipse cx="120" cy="172" rx="46" ry="36" fill="#1e1b4b" opacity="0.65" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 2" />
                      <text x="120" y="152" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                        STOMACH BUGS FEEDING!
                      </text>
                    </>
                  ) : isPoweredUp ? (
                    // SLIM, FIT & MUSCULAR V-TAPER TORSO
                    <>
                      {/* V-Shape Athletic Torso */}
                      <path d="M 68 135 L 172 135 L 152 215 L 88 215 Z" fill="url(#healthyShirt)" />
                      {/* Superhero Golden Belt & Chest Crest */}
                      <rect x="85" y="205" width="70" height="12" rx="4" fill="#fbbf24" />
                      <circle cx="120" cy="211" r="9" fill="#d97706" />
                      {/* Chest Emblem: Apple / Leaf Shield */}
                      <circle cx="120" cy="165" r="20" fill="#ffffff" />
                      <path d="M 120 152 Q 110 162 120 178 Q 130 162 120 152" fill="#10b981" />
                      <circle cx="123" cy="154" r="2.5" fill="#f59e0b" />
                    </>
                  ) : (
                    // Regular kid torso
                    <path d="M 72 135 L 168 135 L 158 215 L 82 215 Z" fill={characterGender === 'boy' ? '#3b82f6' : '#ec4899'} rx="8" />
                  )}
                </g>

                {/* Head, Hair & Facial Expressions */}
                <g>
                  {/* Head base */}
                  <circle cx="120" cy="85" r="38" fill="url(#bodySkin)" />

                  {/* Hair based on Gender */}
                  {characterGender === 'boy' ? (
                    <path d="M 80 82 Q 78 50 120 48 Q 162 50 160 82 Q 148 68 120 70 Q 92 68 80 82" fill="#78350f" />
                  ) : (
                    <>
                      {/* Girl Ponytails / Long Hair */}
                      <path d="M 82 85 Q 76 46 120 45 Q 164 46 158 85 Q 145 66 120 68 Q 95 66 82 85" fill="#92400e" />
                      <circle cx="70" cy="82" r="14" fill="#92400e" />
                      <circle cx="170" cy="82" r="14" fill="#92400e" />
                      <circle cx="70" cy="82" r="5" fill="#f43f5e" />
                      <circle cx="170" cy="82" r="5" fill="#f43f5e" />
                    </>
                  )}

                  {/* Eyes & Mouth expression */}
                  {isBloated ? (
                    // Sad, sick, groggy face
                    <>
                      {/* Droopy squinting eyes */}
                      <path d="M 98 84 Q 106 88 112 84" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 128 84 Q 134 88 142 84" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                      {/* Sweat drops */}
                      <path d="M 148 70 Q 152 75 148 80 Q 144 75 148 70" fill="#38bdf8" />
                      {/* Wobbly wavy sad mouth */}
                      <path d="M 104 104 Q 112 96 120 102 Q 128 96 136 104" fill="none" stroke="#be123c" strokeWidth="3" strokeLinecap="round" />
                      {/* Greenish sick cheeks */}
                      <ellipse cx="98" cy="94" rx="7" ry="4" fill="#86efac" opacity="0.6" />
                      <ellipse cx="142" cy="94" rx="7" ry="4" fill="#86efac" opacity="0.6" />
                    </>
                  ) : isPoweredUp ? (
                    // Confident superhero grin & glowing eyes
                    <>
                      {/* Confident big sparkling eyes */}
                      <circle cx="106" cy="84" r="6" fill="#0f172a" />
                      <circle cx="134" cy="84" r="6" fill="#0f172a" />
                      <circle cx="108" cy="82" r="2.5" fill="#ffffff" />
                      <circle cx="136" cy="82" r="2.5" fill="#ffffff" />
                      {/* Confident smile */}
                      <path d="M 104 98 Q 120 114 136 98" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                      {/* Rosy healthy cheeks */}
                      <circle cx="96" cy="92" r="6" fill="#f43f5e" opacity="0.4" />
                      <circle cx="144" cy="92" r="6" fill="#f43f5e" opacity="0.4" />
                    </>
                  ) : (
                    // Regular happy smiling face
                    <>
                      <circle cx="106" cy="84" r="5" fill="#0f172a" />
                      <circle cx="134" cy="84" r="5" fill="#0f172a" />
                      <circle cx="108" cy="82" r="2" fill="#ffffff" />
                      <circle cx="136" cy="82" r="2" fill="#ffffff" />
                      <path d={isMouthChomping ? "M 108 96 Q 120 112 132 96 Z" : "M 108 98 Q 120 108 132 98"} fill={isMouthChomping ? "#be123c" : "none"} stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                    </>
                  )}
                </g>
              </svg>

              {/* Crawling Tummy Bugs in the Bloated Belly! */}
              {isBloated && (
                <div className="absolute inset-0 pointer-events-auto">
                  {bugs.map((bug) => (
                    <button
                      key={bug.id}
                      onClick={() => handleTapBug(bug.id)}
                      style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 transform hover:scale-125 ${
                        !bug.isAlive ? 'scale-0 opacity-0 -translate-y-12' : 'animate-bounce'
                      }`}
                      title="Tap to squash bug!"
                    >
                      <span className="text-2xl drop-shadow filter">
                        {bug.type === 'sugar-worm' ? '🐛' : bug.type === 'grease-beetle' ? '🪲' : '🐜'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Floating Battle / Story Message */}
          <div className="relative z-10">
            {isBloated ? (
              <div className="bg-rose-500/95 text-white p-3.5 rounded-2xl shadow-lg border border-rose-300 flex items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤢</span>
                  <div>
                    <h4 className="font-fun font-bold text-xs sm:text-sm">
                      Sugar Overload! Heavy, Bloated & Tummy Bugs Feeding!
                    </h4>
                    <p className="text-[11px] text-white/90">
                      Tap the creepy insects to squash them, or feed a healthy apple to get super bug-punching energy!
                    </p>
                  </div>
                </div>

                {activeFood.healthierAlternatives.length > 0 && (
                  <button
                    onClick={() => {
                      const healthy = OFFICIAL_HACKATHON_DATASET.find((f) => f.consumptionSignal === 'GOOD') || OFFICIAL_HACKATHON_DATASET[11];
                      handleFeedCharacter(healthy);
                    }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs rounded-xl shadow-md shrink-0 flex items-center gap-1.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Power Up with Healthy Food!</span>
                  </button>
                )}
              </div>
            ) : isPoweredUp ? (
              <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-lg border border-emerald-400 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h4 className="font-fun font-bold text-xs sm:text-sm">
                      SUPERHERO MODE: Lean, Fit, Strong & Bug-Free!
                    </h4>
                    <p className="text-[11px] text-emerald-100">
                      Natural nutrients blasted all tummy insects away! 100% steady clean energy for school and playtime!
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-white/20 rounded-xl text-xs font-fun font-bold shrink-0">
                  💪 Combo: {comboHits} Zaps!
                </div>
              </div>
            ) : (
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-300">
                Choose a snack below to feed {characterGender === 'boy' ? 'Leo' : 'Maya'} and watch their body react!
              </div>
            )}
          </div>
        </div>

        {/* Snack Tray / Feeding Controls */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase font-fun">
                Snack & Drink Tray
              </span>
              <h3 className="text-base font-fun font-bold text-slate-900 dark:text-white mt-0.5">
                Feed {characterGender === 'boy' ? 'Leo' : 'Maya'}
              </h3>
              <p className="text-xs text-slate-500">
                Pick a junk food to see the bugs infest, or pick a healthy food to power up!
              </p>
            </div>

            {/* Currently Selected Food Card */}
            <div
              className={`p-3.5 rounded-2xl border ${
                activeFood.consumptionSignal === 'GOOD'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-fun font-bold text-slate-900 dark:text-white">
                  {activeFood.name}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    activeFood.consumptionSignal === 'GOOD'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {activeFood.consumptionSignal === 'GOOD' ? 'Super Fuel' : 'Bug Breeder'}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>{activeFood.calories} kcal · {activeFood.sugar}g sugar</span>
                <span>{activeFood.sugar > 20 ? '⚠️ High Bloat Risk' : '✨ Clean Energy'}</span>
              </div>

              <button
                onClick={() => handleFeedCharacter(activeFood)}
                className={`mt-2.5 w-full py-2 px-3 rounded-xl font-fun font-bold text-xs text-white shadow-sm flex items-center justify-center gap-1.5 transition-all ${
                  activeFood.consumptionSignal === 'GOOD'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <span>Feed This Now!</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Snacks to Test */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Test Foods:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* 2 Junk Foods */}
                <button
                  onClick={() => handleFeedCharacter(OFFICIAL_HACKATHON_DATASET[4])} // Kinder Joy
                  className="p-2.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl border border-rose-200 dark:border-rose-800/60 text-left transition-all"
                >
                  <span className="text-base block">🍫</span>
                  <span className="text-xs font-fun font-bold text-rose-900 dark:text-rose-200 block truncate">
                    Kinder Joy
                  </span>
                  <span className="text-[10px] text-rose-600">51g Sugar (Bloat!)</span>
                </button>

                <button
                  onClick={() => handleFeedCharacter(OFFICIAL_HACKATHON_DATASET[10])} // Cola Can
                  className="p-2.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl border border-rose-200 dark:border-rose-800/60 text-left transition-all"
                >
                  <span className="text-base block">🥤</span>
                  <span className="text-xs font-fun font-bold text-rose-900 dark:text-rose-200 block truncate">
                    Sparkling Cola
                  </span>
                  <span className="text-[10px] text-rose-600">39g Sugar + Bugs</span>
                </button>

                {/* 2 Healthy Foods */}
                <button
                  onClick={() => handleFeedCharacter(OFFICIAL_HACKATHON_DATASET[11])} // Fresh Apple
                  className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-left transition-all"
                >
                  <span className="text-base block">🍏</span>
                  <span className="text-xs font-fun font-bold text-emerald-900 dark:text-emerald-200 block truncate">
                    Fresh Apple
                  </span>
                  <span className="text-[10px] text-emerald-600">Fiber (Bug Buster!)</span>
                </button>

                <button
                  onClick={() => handleFeedCharacter(OFFICIAL_HACKATHON_DATASET[1])} // Paneer
                  className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-left transition-all"
                >
                  <span className="text-base block">🧀</span>
                  <span className="text-xs font-fun font-bold text-emerald-900 dark:text-emerald-200 block truncate">
                    Fresh Paneer
                  </span>
                  <span className="text-[10px] text-emerald-600">Protein (Power!)</span>
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setStage('idle');
                setHeroEnergy(50);
                setBugs([]);
                sounds.playScanClick();
              }}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-fun font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Character</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
