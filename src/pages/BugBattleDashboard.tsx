import React, { useState } from 'react';
import { 
  Swords, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Heart, 
  Award, 
  UserCheck, 
  ArrowRight,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { FoodItem } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { sounds } from '../utils/notifications';

interface Bug {
  id: number;
  x: number;
  y: number;
  type: 'sugar-worm' | 'grease-beetle' | 'acid-ant';
  isAlive: boolean;
}

export const BugBattleDashboard: React.FC = () => {
  const { currentFood, setCurrentFood, bugBattleStats, recordBattleVictory } = useApp();

  const [characterGender, setCharacterGender] = useState<'boy' | 'girl'>('girl'); // "Maya" by default as requested in prompt!
  const [selectedFood, setSelectedFood] = useState<FoodItem>(currentFood);
  const [stage, setStage] = useState<'idle' | 'eating' | 'unhealthy-bloated' | 'healthy-powerup' | 'battle' | 'victory'>('idle');
  const [heroEnergy, setHeroEnergy] = useState<number>(65);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [comboHits, setComboHits] = useState<number>(0);
  const [isMouthChomping, setIsMouthChomping] = useState<boolean>(false);

  // Feeding & Storyline Animation
  const handleFeed = (food: FoodItem) => {
    setSelectedFood(food);
    setCurrentFood(food);
    setStage('eating');
    setIsMouthChomping(true);
    sounds.playChomp();

    setTimeout(() => {
      sounds.playChomp();
    }, 350);

    setTimeout(() => {
      setIsMouthChomping(false);
      const isUnhealthy = food.consumptionSignal === 'BAD' || food.sugar > 20 || food.healthScore < 50;

      if (isUnhealthy) {
        // Bloated & Tummy Bugs
        setStage('unhealthy-bloated');
        setHeroEnergy(15);
        sounds.playAlertPing();
        sounds.playBugBuzz();

        const newBugs: Bug[] = [
          { id: 1, x: 42, y: 55, type: 'sugar-worm', isAlive: true },
          { id: 2, x: 58, y: 54, type: 'grease-beetle', isAlive: true },
          { id: 3, x: 50, y: 62, type: 'acid-ant', isAlive: true },
          { id: 4, x: 45, y: 68, type: 'sugar-worm', isAlive: true },
          { id: 5, x: 55, y: 66, type: 'grease-beetle', isAlive: true },
        ];
        setBugs(newBugs);
      } else {
        // Superhero Power Up & Blast Away Bugs
        setStage('healthy-powerup');
        setHeroEnergy(100);
        sounds.playSuccessChime();

        setTimeout(() => {
          setStage('battle');
          sounds.playZap();
          autoZapBugs();
        }, 1000);
      }
    }, 850);
  };

  const autoZapBugs = () => {
    let delay = 300;
    const bugCount = bugs.length || 4;

    bugs.forEach((b, idx) => {
      setTimeout(() => {
        sounds.playZap();
        setBugs((prev) => prev.map((bug) => (bug.id === b.id ? { ...bug, isAlive: false } : bug)));
        setComboHits((c) => c + 1);

        if (idx === bugs.length - 1) {
          setTimeout(() => {
            setStage('victory');
            sounds.playVictory();
            recordBattleVictory(bugCount);
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e'],
            });
          }, 500);
        }
      }, delay);
      delay += 350;
    });

    if (bugs.length === 0) {
      setStage('victory');
      sounds.playVictory();
      recordBattleVictory(4);
      confetti({ particleCount: 80, spread: 70 });
    }
  };

  const handleTapBug = (bugId: number) => {
    sounds.playZap();
    setComboHits((c) => c + 1);
    setBugs((prev) => prev.map((b) => (b.id === bugId ? { ...b, isAlive: false } : b)));

    const remaining = bugs.filter((b) => b.id !== bugId && b.isAlive);
    if (remaining.length === 0) {
      setStage('victory');
      sounds.playVictory();
      recordBattleVictory(bugs.length || 5);
      confetti({ particleCount: 80, spread: 70 });
    }
  };

  const isBloated = stage === 'unhealthy-bloated';
  const isPoweredUp = stage === 'healthy-powerup' || stage === 'battle' || stage === 'victory';

  // Mock Leaderboard
  const leaderboard = [
    { rank: 1, name: 'Maya Super Hero', score: 1420, level: 5, badge: '👑 Bug Champion' },
    { rank: 2, name: 'Leo Zap Master', score: 980, level: 4, badge: '⚡ Lightning Fist' },
    { rank: 3, name: 'You (Current Player)', score: bugBattleStats.score, level: bugBattleStats.level, badge: '🌟 Sugar Scout' },
    { rank: 4, name: 'Sammy Apple Saver', score: 280, level: 2, badge: '🍏 Fiber Guard' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Fun Kids Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black font-fun tracking-wide backdrop-blur-md mb-2">
              <Swords className="w-4 h-4" />
              <span>Dashboard 3 · Kids Superhero Health Arena</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-fun font-bold">
              Kids Bug Battle: Healthy Superhero vs. Tummy Insects! 🐛⚡
            </h1>
            <p className="text-xs sm:text-sm text-white/95 max-w-xl mt-1">
              Eat junk food $\to$ body gets bloated & insects feed in the tummy! Eat healthy food $\to$ gain super energy & zap bugs away!
            </p>
          </div>

          {/* Maya / Leo Character Switcher */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/30 shrink-0">
            <button
              onClick={() => {
                setCharacterGender('girl');
                sounds.playScanClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-fun font-bold text-xs transition-all ${
                characterGender === 'girl' ? 'bg-white text-rose-600 shadow' : 'text-white/80 hover:text-white'
              }`}
            >
              <span className="text-base">👧</span>
              <span>Maya</span>
            </button>
            <button
              onClick={() => {
                setCharacterGender('boy');
                sounds.playScanClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-fun font-bold text-xs transition-all ${
                characterGender === 'boy' ? 'bg-white text-blue-600 shadow' : 'text-white/80 hover:text-white'
              }`}
            >
              <span className="text-base">👦</span>
              <span>Leo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Animated Battle Arena View */}
        <div className="lg:col-span-8 bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-950 rounded-3xl p-6 border-4 border-amber-300 dark:border-slate-800 shadow-xl relative min-h-[480px] flex flex-col justify-between overflow-hidden select-none">
          {/* Top Maya's Energy Bar */}
          <div className="relative z-10 flex items-center justify-between gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/40 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">{isPoweredUp ? '⚡' : isBloated ? '😴' : '😊'}</span>
              <span className="font-fun font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                {characterGender === 'girl' ? "Maya's Energy Bar:" : "Leo's Energy Bar:"}
              </span>
            </div>
            <div className="flex-1 max-w-xs bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden relative">
              <div
                style={{ width: `${heroEnergy}%` }}
                className={`h-full transition-all duration-700 rounded-full ${
                  isPoweredUp ? 'bg-gradient-to-r from-emerald-400 to-amber-400 animate-pulse' : isBloated ? 'bg-rose-500' : 'bg-sky-400'
                }`}
              />
            </div>
            <span className="font-fun font-black text-xs text-slate-900 dark:text-white">{heroEnergy}%</span>
          </div>

          {/* Morphing Character Visualizer (SVG with fixed camelCase attributes) */}
          <div className="relative my-auto flex items-center justify-center py-4">
            {isPoweredUp && (
              <div className="absolute w-72 h-72 rounded-full bg-emerald-400/25 blur-3xl animate-pulse pointer-events-none"></div>
            )}
            {isBloated && (
              <div className="absolute w-80 h-80 rounded-full bg-rose-500/25 blur-3xl animate-pulse pointer-events-none"></div>
            )}

            <div className="relative w-64 h-80 flex items-center justify-center">
              <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-2xl overflow-visible">
                <defs>
                  <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffd5b5" />
                    <stop offset="100%" stopColor="#f8be95" />
                  </linearGradient>
                  <linearGradient id="healthyArmor" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="bloatedArmor" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>
                </defs>

                {/* Superhero Wings/Aura when powered up */}
                {isPoweredUp && (
                  <g className="animate-spin" style={{ transformOrigin: '120px 140px', animationDuration: '10s' }}>
                    <path d="M 120 10 L 126 35 L 114 35 Z" fill="#fbbf24" opacity="0.9" />
                    <path d="M 230 140 L 205 134 L 205 146 Z" fill="#fbbf24" opacity="0.9" />
                    <path d="M 120 270 L 126 245 L 114 245 Z" fill="#fbbf24" opacity="0.9" />
                    <path d="M 10 140 L 35 134 L 35 146 Z" fill="#fbbf24" opacity="0.9" />
                  </g>
                )}

                {/* Legs */}
                <g>
                  {isPoweredUp ? (
                    <>
                      <rect x="75" y="210" width="22" height="75" rx="10" fill="#1e293b" />
                      <rect x="143" y="210" width="22" height="75" rx="10" fill="#1e293b" />
                      <rect x="68" y="275" width="32" height="18" rx="6" fill="#ef4444" />
                      <rect x="140" y="275" width="32" height="18" rx="6" fill="#ef4444" />
                    </>
                  ) : isBloated ? (
                    <>
                      <rect x="70" y="225" width="32" height="55" rx="14" fill="#334155" />
                      <rect x="138" y="225" width="32" height="55" rx="14" fill="#334155" />
                      <rect x="62" y="270" width="44" height="20" rx="8" fill="#475569" />
                      <rect x="134" y="270" width="44" height="20" rx="8" fill="#475569" />
                    </>
                  ) : (
                    <>
                      <rect x="85" y="210" width="24" height="70" rx="10" fill="#3b82f6" />
                      <rect x="131" y="210" width="24" height="70" rx="10" fill="#3b82f6" />
                      <rect x="78" y="270" width="34" height="16" rx="6" fill="#0f172a" />
                      <rect x="128" y="270" width="34" height="16" rx="6" fill="#0f172a" />
                    </>
                  )}
                </g>

                {/* Arms */}
                <g>
                  {isPoweredUp ? (
                    <>
                      <path d="M 65 140 Q 35 110 40 85 Q 55 90 65 115" fill="url(#skinGrad)" stroke="#e29b6c" strokeWidth="2" />
                      <circle cx="45" cy="85" r="12" fill="url(#skinGrad)" />
                      <circle cx="45" cy="75" r="14" fill="#ef4444" />
                      <path d="M 175 140 Q 205 110 200 85 Q 185 90 175 115" fill="url(#skinGrad)" stroke="#e29b6c" strokeWidth="2" />
                      <circle cx="195" cy="85" r="12" fill="url(#skinGrad)" />
                      <circle cx="195" cy="75" r="14" fill="#ef4444" />
                      <path d="M 210 70 L 225 60 L 218 80 L 235 70" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                    </>
                  ) : isBloated ? (
                    <>
                      <path d="M 45 150 Q 30 180 60 200" fill="none" stroke="url(#skinGrad)" strokeWidth="24" strokeLinecap="round" />
                      <path d="M 195 150 Q 210 180 180 200" fill="none" stroke="url(#skinGrad)" strokeWidth="24" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <path d="M 70 145 Q 40 170 50 195" fill="none" stroke="url(#skinGrad)" strokeWidth="20" strokeLinecap="round" />
                      <path d="M 170 145 Q 200 170 190 195" fill="none" stroke="url(#skinGrad)" strokeWidth="20" strokeLinecap="round" />
                    </>
                  )}
                </g>

                {/* Torso & Stomach X-Ray */}
                <g>
                  {isBloated ? (
                    <>
                      <ellipse cx="120" cy="170" rx="72" ry="58" fill="url(#bloatedArmor)" />
                      <line x1="80" y1="160" x2="85" y2="185" stroke="#ffe4e6" strokeWidth="2" opacity="0.6" />
                      <line x1="160" y1="160" x2="155" y2="185" stroke="#ffe4e6" strokeWidth="2" opacity="0.6" />
                      <ellipse cx="120" cy="172" rx="46" ry="36" fill="#1e1b4b" opacity="0.75" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 2" />
                      <text x="120" y="152" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                        STOMACH BUGS FEEDING!
                      </text>
                    </>
                  ) : isPoweredUp ? (
                    <>
                      <path d="M 68 135 L 172 135 L 152 215 L 88 215 Z" fill="url(#healthyArmor)" />
                      <rect x="85" y="205" width="70" height="12" rx="4" fill="#fbbf24" />
                      <circle cx="120" cy="211" r="9" fill="#d97706" />
                      <circle cx="120" cy="165" r="20" fill="#ffffff" />
                      <path d="M 120 152 Q 110 162 120 178 Q 130 162 120 152" fill="#10b981" />
                    </>
                  ) : (
                    <path d="M 72 135 L 168 135 L 158 215 L 82 215 Z" fill={characterGender === 'girl' ? '#ec4899' : '#3b82f6'} />
                  )}
                </g>

                {/* Head & Expression */}
                <g>
                  <circle cx="120" cy="85" r="38" fill="url(#skinGrad)" />
                  {characterGender === 'girl' ? (
                    <>
                      <path d="M 82 85 Q 76 46 120 45 Q 164 46 158 85 Q 145 66 120 68 Q 95 66 82 85" fill="#92400e" />
                      <circle cx="70" cy="82" r="14" fill="#92400e" />
                      <circle cx="170" cy="82" r="14" fill="#92400e" />
                    </>
                  ) : (
                    <path d="M 80 82 Q 78 50 120 48 Q 162 50 160 82 Q 148 68 120 70 Q 92 68 80 82" fill="#78350f" />
                  )}

                  {isBloated ? (
                    <>
                      <path d="M 98 84 Q 106 88 112 84" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 128 84 Q 134 88 142 84" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 104 104 Q 112 96 120 102 Q 128 96 136 104" fill="none" stroke="#be123c" strokeWidth="3" strokeLinecap="round" />
                      <ellipse cx="98" cy="94" rx="7" ry="4" fill="#86efac" opacity="0.6" />
                      <ellipse cx="142" cy="94" rx="7" ry="4" fill="#86efac" opacity="0.6" />
                    </>
                  ) : isPoweredUp ? (
                    <>
                      <circle cx="106" cy="84" r="6" fill="#0f172a" />
                      <circle cx="134" cy="84" r="6" fill="#0f172a" />
                      <path d="M 104 98 Q 120 114 136 98" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="96" cy="92" r="6" fill="#f43f5e" opacity="0.4" />
                      <circle cx="144" cy="92" r="6" fill="#f43f5e" opacity="0.4" />
                    </>
                  ) : (
                    <>
                      <circle cx="106" cy="84" r="5" fill="#0f172a" />
                      <circle cx="134" cy="84" r="5" fill="#0f172a" />
                      <path d={isMouthChomping ? "M 108 96 Q 120 112 132 96 Z" : "M 108 98 Q 120 108 132 98"} fill={isMouthChomping ? "#be123c" : "none"} stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                    </>
                  )}
                </g>
              </svg>

              {/* Tummy Bugs in bloated state */}
              {isBloated && (
                <div className="absolute inset-0 pointer-events-auto">
                  {bugs.map((bug) => (
                    <button
                      key={bug.id}
                      onClick={() => handleTapBug(bug.id)}
                      style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 text-2xl transition-all duration-300 transform hover:scale-125 ${
                        !bug.isAlive ? 'scale-0 opacity-0 -translate-y-12' : 'animate-bounce'
                      }`}
                      title="Tap to punch insect!"
                    >
                      {bug.type === 'sugar-worm' ? '🐛' : bug.type === 'grease-beetle' ? '🪲' : '🐜'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Battle Status Message */}
          <div className="relative z-10">
            {isBloated ? (
              <div className="bg-rose-500/95 text-white p-4 rounded-2xl shadow-lg border border-rose-300 flex items-center justify-between gap-3 animate-pulse">
                <div>
                  <h4 className="font-fun font-bold text-sm">
                    {characterGender === 'girl' ? 'Maya' : 'Leo'} is Bloated! Tummy Insects Infestation!
                  </h4>
                  <p className="text-xs text-rose-100">
                    High free sugars and saturated fats created {bugs.length} greedy tummy bugs. Tap to squash them or feed a healthy apple to blast them away!
                  </p>
                </div>
                <button
                  onClick={() => {
                    const apple = OFFICIAL_HACKATHON_DATASET[11];
                    handleFeed(apple);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs rounded-xl shadow shrink-0 flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Zap with Apple!</span>
                </button>
              </div>
            ) : isPoweredUp ? (
              <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg border border-emerald-400 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-fun font-bold text-sm">
                    SUPERHERO POWER ACTIVE: Slim, Strong & Bug-Free!
                  </h4>
                  <p className="text-xs text-emerald-100">
                    Clean vitamins and dietary fiber recharged {characterGender === 'girl' ? 'Maya' : 'Leo'}! Insects zapped away!
                  </p>
                </div>
                <span className="font-fun font-black text-xs px-3 py-1.5 bg-white/20 rounded-xl shrink-0">
                  +{comboHits * 50} Battle XP!
                </span>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border text-center text-xs font-fun text-slate-600 dark:text-slate-300">
                Feed {characterGender === 'girl' ? 'Maya' : 'Leo'} a food from the tray to begin the battle!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Score, Level, Badges & Leaderboard */}
        <div className="lg:col-span-4 space-y-4">
          {/* Level & XP Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 font-fun">
                  Player Progression
                </span>
                <h3 className="text-lg font-fun font-bold text-slate-900 dark:text-white">
                  Hero Level {bugBattleStats.level}
                </h3>
              </div>
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-2xl">
                <Trophy className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-fun font-bold">
                <span>XP: {bugBattleStats.xp} / {bugBattleStats.level * 200}</span>
                <span className="text-amber-600">{bugBattleStats.score} pts</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (bugBattleStats.xp % 200) / 2)}%` }}
                  className="bg-amber-500 h-full rounded-full transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-fun pt-1">
              <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Bugs Smashed</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{bugBattleStats.bugsDefeated} 🐛</span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Healthy Streak</span>
                <span className="font-extrabold text-orange-500">{bugBattleStats.streakDays} Days 🔥</span>
              </div>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold font-fun text-slate-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Unlocked Badges</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {bugBattleStats.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl text-xs font-fun font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold font-fun text-slate-900 dark:text-white flex items-center justify-between">
              <span>Bug Buster Leaderboard</span>
              <span className="text-[10px] text-amber-600 font-bold">Top Heroes</span>
            </h4>
            <div className="space-y-2 text-xs font-fun">
              {leaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    item.rank === 3
                      ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-black text-slate-400">#{item.rank}</span>
                    <div>
                      <span className="text-slate-900 dark:text-white block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.badge}</span>
                    </div>
                  </div>
                  <span className="font-black text-amber-600">{item.score} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Feeding Food Tray */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-fun">
              Choose Food to Feed:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleFeed(OFFICIAL_HACKATHON_DATASET[4])} // Kinder Joy
                className="p-2.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 rounded-xl border border-rose-200 dark:border-rose-900 text-left transition-all"
              >
                <span className="text-base block">🍫</span>
                <span className="text-xs font-fun font-bold text-rose-900 dark:text-rose-200 block truncate">Kinder Joy</span>
                <span className="text-[10px] text-rose-600">51g Sugar (Bugs!)</span>
              </button>

              <button
                onClick={() => handleFeed(OFFICIAL_HACKATHON_DATASET[11])} // Fresh Apple
                className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 rounded-xl border border-emerald-200 dark:border-emerald-900 text-left transition-all"
              >
                <span className="text-base block">🍏</span>
                <span className="text-xs font-fun font-bold text-emerald-900 dark:text-emerald-200 block truncate">Fresh Apple</span>
                <span className="text-[10px] text-emerald-600">Power Up!</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
