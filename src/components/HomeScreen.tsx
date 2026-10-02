import React, { useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  Search,
  Scan,
  Swords
} from 'lucide-react';
import { FoodItem } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { sounds } from '../utils/notifications';

interface HomeScreenProps {
  onScanProduct: () => void;
  onUploadImage: (file: File) => void;
  onSelectQuickProduct: (food: FoodItem) => void;
  onOpenKidsMode: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onScanProduct,
  onUploadImage,
  onSelectQuickProduct,
  onOpenKidsMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sounds.playScanClick();
      onUploadImage(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* App Front Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative corner lines matching the viewfinder app icon */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-300/40 rounded-tl-xl pointer-events-none"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-300/40 rounded-tr-xl pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-300/40 rounded-bl-xl pointer-events-none"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-300/40 rounded-br-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg border-2 border-emerald-400">
            <img src="/foodlens-icon.svg" alt="FoodLens" className="w-full h-full object-contain" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              FoodLens
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md mt-1">
              Smart food pack analyzer. Check ingredients, calories & sugar, and watch animated superhero battles against tummy bugs!
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenKidsMode}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-fun font-bold text-xs shadow-md transition-transform hover:scale-105"
            >
              <Swords className="w-4 h-4 text-slate-900" />
              <span>Play Kids Tummy Bug Battle! 🐛⚡</span>
            </button>
          </div>
        </div>
      </div>

      {/* THE 2 MAIN FRONT OPTIONS AS REQUESTED BY USER */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
          Choose How to Inspect Your Food
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* OPTION 1: Scan the Product */}
          <button
            onClick={() => {
              sounds.playScanClick();
              onScanProduct();
            }}
            className="group relative p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/40 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Live AR Camera
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                1. Scan the Product
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Open the camera lens and point at any packaged food label or barcode for instant AR nutritional insights.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Start AR Scanner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>

          {/* OPTION 2: Upload Image */}
          <button
            onClick={() => {
              sounds.playScanClick();
              fileInputRef.current?.click();
            }}
            className="group relative p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-sky-500/40 hover:border-sky-500 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                Photo Gallery
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                2. Upload Image
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Upload a photo of food packaging from your gallery to inspect calories, sugar, and harmful additives.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
              <span>Choose Photo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Quick Test Pack Carousel (No physical pack needed to test!) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Or Tap Any Sample Product to Test Instantly:
            </h3>
            <p className="text-[11px] text-slate-500">
              Immediately opens nutritional data and triggers the bug battle animation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {OFFICIAL_HACKATHON_DATASET.slice(0, 6).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sounds.playScanClick();
                onSelectQuickProduct(item);
              }}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 hover:border-emerald-400 text-left transition-all group flex flex-col justify-between"
            >
              <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                {item.category.includes('Chocolate')
                  ? '🍫'
                  : item.category.includes('Noodles')
                  ? '🍜'
                  : item.category.includes('Dairy')
                  ? '🧀'
                  : item.category.includes('Chips')
                  ? '🥨'
                  : item.category.includes('Oats')
                  ? '🥣'
                  : '📦'}
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                  {item.name}
                </h4>
                <span className="text-[10px] text-slate-500 block">{item.brand}</span>
              </div>
              <div className="mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-700 dark:text-slate-300">{item.calories} kcal</span>
                <span
                  className={`font-black ${
                    item.consumptionSignal === 'GOOD'
                      ? 'text-emerald-500'
                      : item.consumptionSignal === 'OK'
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  }`}
                >
                  {item.consumptionSignal}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
