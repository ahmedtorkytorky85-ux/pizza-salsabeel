import React, { useState } from 'react';
import { MenuItem, MenuCategory } from '../types/menu';
import { Edit3, Trash2, Plus, Check, Star, Flame, Leaf } from 'lucide-react';
import { MenuTheme } from './Header';

interface MenuItemCardProps {
  item: MenuItem;
  category?: MenuCategory;
  isEditMode: boolean;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdatePrice: (itemId: string, variantIndex: number, newPrice: number) => void;
  onAddToCart: (item: MenuItem, variantLabel: string, price: number) => void;
  theme?: MenuTheme;
  layout?: 'grid' | 'compact';
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  category,
  isEditMode,
  onEditItem,
  onDeleteItem,
  onUpdatePrice,
  onAddToCart,
  theme = 'dark',
  layout = 'grid'
}) => {
  const [editingPriceIndex, setEditingPriceIndex] = useState<number | null>(null);
  const [tempPriceValue, setTempPriceValue] = useState<string>('');

  const handleStartEditPrice = (idx: number, currentPrice: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditMode) return;
    setEditingPriceIndex(idx);
    setTempPriceValue(currentPrice.toString());
  };

  const handleSavePrice = (idx: number, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseFloat(tempPriceValue);
    if (!isNaN(val) && val >= 0) {
      onUpdatePrice(item.id, idx, val);
    }
    setEditingPriceIndex(null);
  };

  const isLight = theme === 'light';
  const isItalian = theme === 'italian';

  // Card Base styling based on theme
  const cardBgClass = isLight
    ? 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-amber-400'
    : isItalian
    ? 'bg-stone-900/90 border-stone-800 text-stone-100 hover:border-amber-600/50'
    : 'bg-slate-900/90 border-slate-800 text-slate-100 hover:border-amber-500/40 shadow-md';

  // Compact row presentation
  if (layout === 'compact') {
    return (
      <div
        className={`group p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isEditMode ? 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/30' : cardBgClass
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-black text-sm sm:text-base ${
              isLight ? 'text-slate-950 group-hover:text-amber-600' : 'text-white group-hover:text-amber-400'
            }`}>
              {item.name}
            </h3>

            {item.tags?.includes('combo') && (
              <span className="text-[10px] bg-gradient-to-r from-red-600 to-amber-500 text-white px-2 py-0.5 rounded-full font-black shadow-xs">
                ✨ مكس نص ونص
              </span>
            )}
            {item.tags?.includes('popular') && (
              <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold">
                🔥 شائع
              </span>
            )}
            {item.tags?.includes('special') && (
              <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded font-bold">
                ⭐ سبيشال
              </span>
            )}
            {item.tags?.includes('spicy') && (
              <span className="text-[10px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-bold">
                🌶️ حار
              </span>
            )}
            {item.tags?.includes('vegan') && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded font-bold">
                🌿 صيامي
              </span>
            )}
          </div>
          {item.description && (
            <p className={`text-xs mt-0.5 line-clamp-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {item.description}
            </p>
          )}
        </div>

        {/* Prices and actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {item.prices.map((variant, idx) => {
            const isEditing = editingPriceIndex === idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs border ${
                  isEditMode
                    ? 'bg-amber-950/20 border-amber-500/50 cursor-pointer hover:bg-amber-900/30'
                    : isLight
                    ? 'bg-slate-100 border-slate-200'
                    : 'bg-slate-950 border-slate-800'
                }`}
                onClick={(e) => isEditMode && handleStartEditPrice(idx, variant.price, e)}
              >
                <span className={`text-[11px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {variant.label}:
                </span>

                {isEditing ? (
                  <form onSubmit={(e) => handleSavePrice(idx, e)} className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="number"
                      autoFocus
                      step="any"
                      value={tempPriceValue}
                      onChange={(e) => setTempPriceValue(e.target.value)}
                      onBlur={() => handleSavePrice(idx)}
                      className="w-16 bg-slate-900 text-amber-300 font-bold font-mono text-center text-xs py-0.5 rounded border border-amber-400 focus:outline-none"
                    />
                    <button type="submit" className="p-0.5 bg-amber-500 text-slate-950 rounded cursor-pointer">
                      <Check size={11} />
                    </button>
                  </form>
                ) : (
                  <span className="font-mono font-black text-amber-500 text-base sm:text-lg">
                    {variant.price > 0 ? `${variant.price} ج.م` : 'بالفرع'}
                  </span>
                )}

                {!isEditMode && variant.price > 0 && (
                  <button
                    onClick={() => onAddToCart(item, variant.label, variant.price)}
                    className="mr-1 p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] cursor-pointer transition-transform active:scale-90"
                    title={
                      variant.label && variant.label !== 'السعر' && item.categoryId !== 'crepes' && item.categoryId !== 'sweet-crepes' && item.categoryId !== 'hawawshi' && item.categoryId !== 'calzone' && item.categoryId !== 'juices'
                        ? `إضافة ${variant.label} للطلب`
                        : `إضافة ${item.name} للطلب`
                    }
                  >
                    <Plus size={11} />
                  </button>
                )}
              </div>
            );
          })}

          {isEditMode && (
            <div className="flex items-center gap-1 mr-1">
              <button
                onClick={() => onEditItem(item)}
                className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg cursor-pointer"
                title="تعديل الصنف"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg cursor-pointer"
                title="حذف الصنف"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid standard spacious presentation
  return (
    <div
      className={`group relative border rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between ${
        isEditMode
          ? 'border-amber-500/60 bg-amber-500/5 ring-1 ring-amber-500/30'
          : cardBgClass
      } ${
        !isEditMode && 'hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5'
      }`}
    >
      {/* Top Header of Card */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-black text-base sm:text-lg transition-colors ${
                isLight
                  ? 'text-slate-900 group-hover:text-amber-600'
                  : 'text-white group-hover:text-amber-400'
              }`}>
                {item.name}
              </h3>

              {/* Tags */}
              {item.tags?.includes('combo') && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  ✨ مكس نص ونص
                </span>
              )}
              {item.tags?.includes('popular') && (
                <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  <Flame size={11} className="text-orange-500" />
                  الأكثر طلباً
                </span>
              )}
              {item.tags?.includes('special') && (
                <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/30">
                  <Star size={11} className="text-yellow-500" />
                  سبيشال
                </span>
              )}
              {item.tags?.includes('spicy') && (
                <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                  🌶️ حار
                </span>
              )}
              {item.tags?.includes('vegan') && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Leaf size={11} className="text-emerald-500" />
                  صيامي
                </span>
              )}
            </div>

            {item.description && (
              <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {item.description}
              </p>
            )}
          </div>

          {/* Admin Edit / Delete Actions */}
          {isEditMode && (
            <div className={`flex items-center gap-1 shrink-0 p-1 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-amber-500/30'
            }`}>
              <button
                onClick={() => onEditItem(item)}
                title="تعديل الصنف والمكونات والأسعار"
                className="p-1.5 text-amber-500 hover:text-amber-400 hover:bg-slate-800/20 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
                title="حذف هذا الصنف من المنيو"
                className="p-1.5 text-red-500 hover:text-red-400 hover:bg-slate-800/20 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pricing and Variants Section */}
      <div className={`mt-4 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
        
        {/* If edit mode helper hint */}
        {isEditMode && (
          <p className="text-[10px] text-amber-500 mb-2 font-bold">
            💡 اضغط على أي سعر لتعديله فوراً:
          </p>
        )}

        <div className="grid grid-flow-col auto-cols-fr gap-2">
          {item.prices.map((variant, idx) => {
            const isEditing = editingPriceIndex === idx;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between p-2 rounded-xl transition-all border ${
                  isEditMode
                    ? 'bg-amber-950/20 border-amber-500/50 hover:bg-amber-900/30 cursor-pointer'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    : isItalian
                    ? 'bg-stone-950/80 border-stone-800 hover:border-stone-700'
                    : 'bg-slate-950/70 border-slate-800/70 hover:border-slate-700'
                }`}
                onClick={(e) => {
                  if (isEditMode) {
                    handleStartEditPrice(idx, variant.price, e);
                  }
                }}
              >
                {/* Size / Variant Label */}
                <span className={`text-[11px] font-bold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {variant.label}
                </span>

                {/* Price Display or Inline Input */}
                {isEditing ? (
                  <form
                    onSubmit={(e) => handleSavePrice(idx, e)}
                    className="flex items-center gap-1 w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="number"
                      autoFocus
                      step="any"
                      value={tempPriceValue}
                      onChange={(e) => setTempPriceValue(e.target.value)}
                      onBlur={() => handleSavePrice(idx)}
                      className="w-full bg-slate-900 text-amber-300 font-bold font-mono text-center text-sm py-0.5 rounded border border-amber-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-1 bg-amber-500 text-slate-950 rounded hover:bg-amber-400 cursor-pointer"
                    >
                      <Check size={12} />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span className="text-lg sm:text-xl font-black text-amber-500 font-mono tracking-tight">
                      {variant.price > 0 ? variant.price : 'متاح'}
                    </span>
                    {variant.price > 0 && (
                      <span className={`text-[11px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        ج.م
                      </span>
                    )}
                  </div>
                )}

                {/* Customer Add to Cart button */}
                {!isEditMode && variant.price > 0 && (
                  <button
                    onClick={() => onAddToCart(item, variant.label, variant.price)}
                    className="mt-1.5 w-full py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm shadow-emerald-600/20"
                    title={
                      variant.label && variant.label !== 'السعر' && item.categoryId !== 'crepes' && item.categoryId !== 'sweet-crepes' && item.categoryId !== 'hawawshi' && item.categoryId !== 'calzone' && item.categoryId !== 'juices'
                        ? `إضافة ${item.name} (${variant.label}) للسلة`
                        : `إضافة ${item.name} للسلة`
                    }
                  >
                    <Plus size={12} />
                    <span>أضف للطلب</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
