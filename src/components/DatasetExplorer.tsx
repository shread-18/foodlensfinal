import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Flame,
  Scale,
  Zap,
  Tag
} from 'lucide-react';
import { FoodItem } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { sounds } from '../utils/notifications';
import { StatusBadge } from './ui/StatusBadge';
import { GlowButton } from './ui/GlowButton';

interface DatasetExplorerProps {
  onSelectFood: (food: FoodItem) => void;
  onOpenKidVisualizer: (food: FoodItem) => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({
  onSelectFood,
  onOpenKidVisualizer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [signalFilter, setSignalFilter] = useState('ALL');
  const [kidsOnlyFilter, setKidsOnlyFilter] = useState(false);

  const categories = ['ALL', ...Array.from(new Set(OFFICIAL_HACKATHON_DATASET.map((d) => d.category)))];

  const filteredItems = OFFICIAL_HACKATHON_DATASET.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      (item.barcode && item.barcode.includes(query));

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSignal = signalFilter === 'ALL' || item.consumptionSignal === signalFilter;
    const matchesKids = !kidsOnlyFilter || item.kidSuitability.isRecommendedForKids;

    return matchesSearch && matchesCategory && matchesSignal && matchesKids;
  });

  const handleInspect = (food: FoodItem) => {
    sounds.playScanClick();
    onSelectFood(food);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative overflow-hidden shadow-[0_0_40px_rgba(0,245,160,0.1)]">
        <div className="corner-bracket-tl !border-emerald-400" />
        <div className="corner-bracket-tr !border-emerald-400" />
        <div className="corner-bracket-bl !border-emerald-400" />
        <div className="corner-bracket-br !border-emerald-400" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge label="VERIFIED CATALOG" variant="online" />
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                CSI ROUND 1 // TEAM NEXORA BENCHMARK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-wide">
              FoodLens Product Intelligence Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Complete, verified benchmark repository of packaged food products with authentic label information, calibrated continuous consumption signals, and pediatric impact profiles.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="glass-panel px-4 py-3 rounded-2xl border border-emerald-500/40 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Catalog Total</span>
              <span className="text-2xl font-heading font-extrabold text-emerald-400">
                {OFFICIAL_HACKATHON_DATASET.length}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">Active Packs</span>
            </div>

            <div className="glass-panel px-4 py-3 rounded-2xl border border-cyan-500/40 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Filtered</span>
              <span className="text-2xl font-heading font-extrabold text-cyan-300">
                {filteredItems.length}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">Displaying</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              placeholder="Search by product, brand, ID, barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-mono pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by Category"
              className="text-xs font-mono py-2.5 px-3.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            {/* Signal Filter */}
            <select
              value={signalFilter}
              onChange={(e) => setSignalFilter(e.target.value)}
              aria-label="Filter by Health Signal"
              className="text-xs font-mono py-2.5 px-3.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Health Signals</option>
              <option value="GOOD" className="bg-slate-900">Signal: GOOD (Green)</option>
              <option value="OK" className="bg-slate-900">Signal: OK (Yellow)</option>
              <option value="BAD" className="bg-slate-900">Signal: BAD (Red)</option>
            </select>

            {/* Kid Safe Toggle */}
            <button
              onClick={() => setKidsOnlyFilter(!kidsOnlyFilter)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                kidsOnlyFilter
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🧒</span>
              <span>Kid-Safe Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const hasImage = item.sampleImage || item.image;
          return (
            <div
              key={item.id}
              className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] group relative"
            >
              {/* Corner brackets on hover */}
              <div className="corner-bracket-tl !border-cyan-400/40 group-hover:!border-cyan-400" />
              <div className="corner-bracket-tr !border-cyan-400/40 group-hover:!border-cyan-400" />

              <div>
                {/* Product Image & Badges Banner */}
                <div className="relative w-full h-44 rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-hidden flex items-center justify-center p-3 mb-3.5 group-hover:border-cyan-500/30 transition-colors">
                  {hasImage ? (
                    <img
                      src={hasImage}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback gracefully to icon if image fails to load
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Top Floating Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                      {item.id}
                    </span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-700 backdrop-blur-md">
                      {item.brand}
                    </span>
                  </div>

                  {/* Nutri-Grade Floating Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg shadow-md ${
                        item.nutriGrade === 'A'
                          ? 'bg-emerald-500 text-slate-950'
                          : item.nutriGrade === 'B'
                          ? 'bg-teal-400 text-slate-950'
                          : item.nutriGrade === 'C'
                          ? 'bg-amber-400 text-slate-950'
                          : item.nutriGrade === 'D'
                          ? 'bg-orange-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      GRADE {item.nutriGrade}
                    </span>
                  </div>

                  {/* Consumption Signal Floating Bottom Pill */}
                  <div className="absolute bottom-2.5 right-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider ${
                        item.consumptionSignal === 'GOOD'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : item.consumptionSignal === 'OK'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {item.consumptionSignal}
                    </span>
                  </div>
                </div>

                {/* Title & Category */}
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-slate-400">{item.category}</span>
                    {item.barcode && (
                      <span className="text-[10px] font-mono text-slate-500">
                        · #{item.barcode.slice(-5)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Verified True Nutrition Telemetry Matrix */}
                <div className="grid grid-cols-4 gap-1.5 text-center mt-3.5 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs font-mono">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Energy</span>
                    <span className="font-extrabold text-white">{item.calories}</span>
                    <span className="text-[8px] text-slate-500 block">kcal</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Sugar</span>
                    <span className={`font-extrabold ${item.sugar > 20 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {item.sugar}g
                    </span>
                    <span className="text-[8px] text-slate-500 block">
                      ~{(item.sugar / 4).toFixed(0)} sp
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Fats</span>
                    <span className="font-extrabold text-slate-200">{item.totalFats}g</span>
                    <span className="text-[8px] text-slate-500 block">lipids</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Protein</span>
                    <span className="font-extrabold text-emerald-400">{item.protein}g</span>
                    <span className="text-[8px] text-slate-500 block">synth</span>
                  </div>
                </div>

                {/* Packaging Verified Insights */}
                <div className="mt-3 text-xs space-y-1 font-mono text-slate-300">
                  <p className="line-clamp-2 text-[11px] leading-relaxed">
                    <strong className="text-cyan-400">BENEFIT:</strong> {item.positiveEffects}
                  </p>
                  <p className="line-clamp-1 text-[11px] text-rose-300">
                    <strong className="text-rose-400">RISK:</strong> {item.excessIntakeEffects}
                  </p>
                </div>

                {/* Pediatric Shield Badge */}
                <div className="mt-3">
                  {item.kidSuitability.isRecommendedForKids ? (
                    <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Safe for Children (Low Hazard)
                      </span>
                      <span className="text-slate-400">Age {item.kidSuitability.minimumAge}+</span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 text-[10px] font-mono text-rose-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold line-clamp-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        Limit for Kids ({item.kidSuitability.sugarSpoonsCount} spoons sugar)
                      </span>
                      <button
                        onClick={() => onOpenKidVisualizer(item)}
                        className="text-amber-400 hover:text-amber-300 font-bold underline shrink-0 cursor-pointer ml-1"
                      >
                        Body Harm
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="font-mono text-xs">
                  <span className="text-slate-500">HEALTH SCORE: </span>
                  <span className="font-extrabold text-emerald-400">{item.healthScore}</span>
                  <span className="text-slate-600">/100</span>
                </div>

                <GlowButton
                  variant="primary"
                  onClick={() => handleInspect(item)}
                  className="text-xs !py-1.5 !px-3.5"
                >
                  <span>INSPECT IN LENS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </GlowButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
