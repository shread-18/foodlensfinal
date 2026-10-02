import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Lock, 
  Unlock, 
  Smile, 
  Frown, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Flame, 
  Heart,
  Droplet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { sounds } from '../utils/notifications';

export const KidModeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentFood, setCurrentFood, parentalSettings, updateParentalSettings, verifyPin } = useApp();

  const [selectedKidFood, setSelectedKidFood] = useState<FoodItem>(currentFood);
  const [showExitPinModal, setShowExitPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const isGreen = selectedKidFood.consumptionSignal === 'GOOD';
  const isYellow = selectedKidFood.consumptionSignal === 'OK';
  const isRed = selectedKidFood.consumptionSignal === 'BAD';

  const handleSelectFood = (food: FoodItem) => {
    setSelectedKidFood(food);
    setCurrentFood(food);
    if (food.consumptionSignal === 'GOOD') {
      sounds.playSuccessChime();
    } else {
      sounds.playAlertPing();
    }
  };

  const handleUnlockExit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPin(pinInput)) {
      updateParentalSettings({ kidModeActive: false });
      setShowExitPinModal(false);
      sounds.playSuccessChime();
      navigate('/');
    } else {
      setPinError(true);
      sounds.playAlertPing();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-fun">
      {/* Kid Mode Top Header */}
      <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md mb-2">
            <span>🧒 Kid-Friendly Safe Zone</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Kid Mode: Food Light & Super Fuel! 🚦🍎
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-lg mt-1">
            Learn which foods give you superhero strength and which ones feed greedy tummy bugs!
          </p>
        </div>

        {/* Parent Exit Button with Lock */}
        <button
          onClick={() => {
            setShowExitPinModal(true);
            setPinError(false);
            setPinInput('');
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-2xl text-xs font-bold shadow transition-all shrink-0"
        >
          <Lock className="w-4 h-4 text-amber-300" />
          <span>Parent Lock (Exit)</span>
        </button>
      </div>

      {/* BIG TRAFFIC LIGHT RATING CARD AS REQUESTED */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-purple-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Traffic Light Visual Pillar */}
          <div className="w-32 bg-slate-900 p-4 rounded-3xl border-4 border-slate-700 shadow-2xl flex flex-col items-center gap-3 shrink-0">
            {/* Green Light */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-500 ${
                isGreen
                  ? 'bg-emerald-500 shadow-[0_0_25px_#10b981] scale-110 border-4 border-white'
                  : 'bg-emerald-950/70 opacity-30'
              }`}
            >
              🌟
            </div>

            {/* Yellow Light */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-500 ${
                isYellow
                  ? 'bg-amber-400 shadow-[0_0_25px_#f59e0b] scale-110 border-4 border-white'
                  : 'bg-amber-950/70 opacity-30'
              }`}
            >
              🎈
            </div>

            {/* Red Light */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-500 ${
                isRed
                  ? 'bg-rose-500 shadow-[0_0_25px_#f43f5e] scale-110 border-4 border-white animate-pulse'
                  : 'bg-rose-950/70 opacity-30'
              }`}
            >
              🚫
            </div>
          </div>

          {/* Traffic Light Meaning & Character Reaction */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Selected Food Check
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {selectedKidFood.name}
              </h2>
            </div>

            {/* Clear Big Traffic Light Messages as requested */}
            {isGreen && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 text-emerald-900 dark:text-emerald-200 rounded-2xl space-y-1">
                <span className="text-xl font-black block">🟢 GREEN LIGHT: Eat Often! 🌟</span>
                <p className="text-xs leading-relaxed">
                  This wholesome food gives you super brain focus, makes your muscles strong, and keeps your tummy happy!
                </p>
              </div>
            )}

            {isYellow && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 text-amber-900 dark:text-amber-200 rounded-2xl space-y-1">
                <span className="text-xl font-black block">🟡 YELLOW LIGHT: Sometimes Treat! 🎈</span>
                <p className="text-xs leading-relaxed">
                  Enjoy this as an occasional snack or celebration. Eat in small portions!
                </p>
              </div>
            )}

            {isRed && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 text-rose-900 dark:text-rose-200 rounded-2xl space-y-1">
                <span className="text-xl font-black block">🔴 RED LIGHT: Rarely / Watch Out! 🚫</span>
                <p className="text-xs leading-relaxed">
                  Too much free sugar or fried oil! This makes you feel bloated and tired, feeds tummy bugs, and damages tooth enamel.
                </p>
              </div>
            )}

            {/* Quick Sugar Spoons Notice */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300">Sugar Spoons in this Pack:</span>
              <span className={`text-base font-black ${selectedKidFood.sugar > 20 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                🥄 {(selectedKidFood.sugar / 4).toFixed(1)} Spoons ({selectedKidFood.sugar}g)
              </span>
            </div>

            {/* Big Action Button to View Body Growth Effect */}
            <button
              onClick={() => navigate('/growth')}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 transform hover:scale-102 transition-all"
            >
              <Activity className="w-5 h-5 text-emerald-300" />
              <span>See How This Food Grows Your Body! 🧒🏃</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Large Colorful Food Buttons (Simplified for young children) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Tap Any Snack to Check the Traffic Light:
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {OFFICIAL_HACKATHON_DATASET.slice(0, 6).map((food) => {
            const isSelected = selectedKidFood.id === food.id;
            return (
              <button
                key={food.id}
                onClick={() => handleSelectFood(food)}
                className={`p-4 rounded-3xl border-3 text-center transition-all flex flex-col items-center justify-between gap-2 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 ring-4 ring-purple-300 shadow-md scale-105'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-purple-300'
                }`}
              >
                <span className="text-3xl">
                  {food.category.includes('Noodles') ? '🍜' : food.category.includes('Chocolate') ? '🍫' : food.category.includes('Dairy') ? '🧀' : food.category.includes('Chips') ? '🥨' : food.category.includes('Oats') ? '🥣' : '🍏'}
                </span>
                <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                  {food.name}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    food.consumptionSignal === 'GOOD' ? 'bg-emerald-100 text-emerald-800' : food.consumptionSignal === 'OK' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {food.consumptionSignal === 'GOOD' ? '🟢 Eat Often' : food.consumptionSignal === 'OK' ? '🟡 Sometimes' : '🔴 Rarely'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parent Lock PIN Modal */}
      {showExitPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Parent Verification Required</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your 4-digit parent PIN to exit Kid Mode. (Default: <strong>1234</strong>)
              </p>
            </div>

            <form onSubmit={handleUnlockExit} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="4-digit PIN"
                className="w-full text-center text-2xl tracking-widest p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              {pinError && (
                <span className="text-xs text-rose-600 font-bold block">Incorrect PIN. Try again.</span>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowExitPinModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Unlock & Exit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
