import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { FoodItem } from '../types/food';
import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';

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

  const categories = ['ALL', ...Array.from(new Set(OFFICIAL_HACKATHON_DATASET.map((d) => d.category)))];

  const filteredItems = OFFICIAL_HACKATHON_DATASET.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSignal = signalFilter === 'ALL' || item.consumptionSignal === signalFilter;

    return matchesSearch && matchesCategory && matchesSignal;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              CSI Hackathon Round 1 Benchmark
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Team Nexora Dataset
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Packaged Food Nutrition & Recommendation Dataset
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Complete dataset of benchmark packaged food items with nutritional values, intake guidelines, allergens, and kid risk assessments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-850 text-xs font-bold">
            {filteredItems.length} Products Shown
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, brand, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Signal Filter */}
          <select
            value={signalFilter}
            onChange={(e) => setSignalFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Signals (Good/OK/Bad)</option>
            <option value="GOOD">Signal: GOOD</option>
            <option value="OK">Signal: OK</option>
            <option value="BAD">Signal: BAD</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-400">{item.id}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                      {item.brand}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
                    {item.name}
                  </h3>
                  <span className="text-xs text-slate-500">{item.category}</span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-black text-white ${
                    item.consumptionSignal === 'GOOD'
                      ? 'bg-emerald-600'
                      : item.consumptionSignal === 'OK'
                      ? 'bg-amber-500'
                      : 'bg-rose-600'
                  }`}
                >
                  {item.consumptionSignal}
                </span>
              </div>

              {/* Nutrition row */}
              <div className="grid grid-cols-4 gap-1.5 text-center mt-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Calories</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.calories}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Sugar</span>
                  <span className={`font-extrabold ${item.sugar > 20 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.sugar}g
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Fat</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.totalFats}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Protein</span>
                  <span className="font-extrabold text-emerald-600">{item.protein}g</span>
                </div>
              </div>

              {/* Timing & Protocol */}
              <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p>
                  <strong>Amount:</strong> {item.recommendedAmount}
                </p>
                <p>
                  <strong>Recommended:</strong> {item.recommendedTime} ({item.frequency})
                </p>
                <p className="line-clamp-2">
                  <strong>Effects:</strong> {item.positiveEffects}
                </p>
                <p className="text-rose-600 dark:text-rose-400 line-clamp-1">
                  <strong>Excess:</strong> {item.excessIntakeEffects}
                </p>
              </div>

              {/* Kid Warning if not safe */}
              {!item.kidSuitability.isRecommendedForKids && (
                <div className="mt-2.5 p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-800 dark:text-rose-200 flex items-center justify-between gap-1">
                  <span className="line-clamp-1 font-medium">⚠️ {item.kidSuitability.sugarSpoonsCount} spoons sugar (Not for kids)</span>
                  <button
                    onClick={() => onOpenKidVisualizer(item)}
                    className="text-rose-700 dark:text-rose-300 font-bold underline shrink-0 font-fun"
                  >
                    View Harm
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                Score: {item.healthScore}/100
              </span>
              <button
                onClick={() => onSelectFood(item)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Inspect in Lens</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
