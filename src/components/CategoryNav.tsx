import React from 'react';
import { MenuCategory } from '../types/menu';
import { Search, X, Flame, Star, Leaf, Sparkles } from 'lucide-react';

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  itemCounts: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  itemCounts
}) => {
  return (
    <div className="no-print bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-[125px] sm:top-[128px] md:top-[118px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        
        {/* Search & Tag Filter Row */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-2.5">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن أكلة، بيتزا، كريب، صنف..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pr-10 pl-9 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Filter Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => onSelectTag(null)}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                selectedTag === null
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              جميع الأصناف
            </button>

            <button
              onClick={() => onSelectTag(selectedTag === 'combo' ? null : 'combo')}
              className={`px-2.5 py-1.5 rounded-lg font-black shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                selectedTag === 'combo'
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md ring-1 ring-amber-400'
                  : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/40'
              }`}
            >
              <span>✨ مكس نص ونص</span>
            </button>

            <button
              onClick={() => onSelectTag(selectedTag === 'popular' ? null : 'popular')}
              className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer ${
                selectedTag === 'popular'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
              }`}
            >
              <Flame size={13} className="text-orange-400" />
              <span>الأكثر طلباً</span>
            </button>

            <button
              onClick={() => onSelectTag(selectedTag === 'special' ? null : 'special')}
              className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer ${
                selectedTag === 'special'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-yellow-300 hover:bg-slate-700'
              }`}
            >
              <Star size={13} className="text-yellow-400" />
              <span>سبيشال المطعم</span>
            </button>

            <button
              onClick={() => onSelectTag(selectedTag === 'spicy' ? null : 'spicy')}
              className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer ${
                selectedTag === 'spicy'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-800 text-red-400 hover:bg-slate-700'
              }`}
            >
              <span>🌶️ حار وسبايسي</span>
            </button>

            <button
              onClick={() => onSelectTag(selectedTag === 'vegan' ? null : 'vegan')}
              className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer ${
                selectedTag === 'vegan'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
              }`}
            >
              <Leaf size={13} className="text-emerald-400" />
              <span>صيامي ونباتي</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md scale-102'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
            }`}
          >
            <Sparkles size={14} />
            <span>الكل</span>
            <span className="text-[10px] bg-slate-950/40 px-1.5 py-0.5 rounded-full font-mono">
              {Object.values(itemCounts).reduce((a, b) => a + b, 0)}
            </span>
          </button>

          {categories.map((cat) => {
            const count = itemCounts[cat.id] || 0;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black scale-102'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-slate-950/40 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
