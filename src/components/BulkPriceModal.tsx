import React, { useState } from 'react';
import { MenuCategory, MenuItem } from '../types/menu';
import { X, Percent, Plus, Minus, Check, ArrowRight } from 'lucide-react';

interface BulkPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: MenuCategory[];
  items: MenuItem[];
  onApplyBulkPriceChange: (targetCategoryId: string | 'all', type: 'amount' | 'percent', value: number, roundToNearest5: boolean) => void;
}

export const BulkPriceModal: React.FC<BulkPriceModalProps> = ({
  isOpen,
  onClose,
  categories,
  items,
  onApplyBulkPriceChange
}) => {
  const [targetCategory, setTargetCategory] = useState<string>('all');
  const [adjustType, setAdjustType] = useState<'amount' | 'percent'>('amount');
  const [direction, setDirection] = useState<'increase' | 'decrease'>('increase');
  const [value, setValue] = useState<number>(5);
  const [roundToNearest5, setRoundToNearest5] = useState<boolean>(true);

  if (!isOpen) return null;

  // Calculate preview sample
  const sampleItems = (targetCategory === 'all' 
    ? items 
    : items.filter(i => i.categoryId === targetCategory)
  ).slice(0, 3);

  const calculateNewPrice = (oldPrice: number) => {
    let factor = direction === 'increase' ? 1 : -1;
    let newPrice = oldPrice;
    if (adjustType === 'amount') {
      newPrice = oldPrice + (factor * value);
    } else {
      newPrice = oldPrice + (factor * (oldPrice * (value / 100)));
    }
    if (roundToNearest5) {
      newPrice = Math.round(newPrice / 5) * 5;
    } else {
      newPrice = Math.round(newPrice);
    }
    return Math.max(0, newPrice);
  };

  const handleApply = () => {
    const finalValue = direction === 'increase' ? Math.abs(value) : -Math.abs(value);
    onApplyBulkPriceChange(targetCategory, adjustType, finalValue, roundToNearest5);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-right"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <div>
              <h2 className="text-lg font-black text-white">
                تعديل سريع للأسعار جماعياً
              </h2>
              <p className="text-xs text-indigo-300">
                زيادة أو تخفيض الأسعار بضغطة زر لكل المنيو أو لقسم محدد
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-xs sm:text-sm">
          
          {/* Target Section */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              تطبيق التعديل على:
            </label>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="all">🌟 كامل المنيو (جميع الأقسام والأصناف)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Direction: Increase / Decrease */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              نوع العملية:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('increase')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  direction === 'increase'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Plus size={15} />
                <span>زيادة في الأسعار</span>
              </button>

              <button
                type="button"
                onClick={() => setDirection('decrease')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  direction === 'decrease'
                    ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Minus size={15} />
                <span>تخفيض في الأسعار</span>
              </button>
            </div>
          </div>

          {/* Calculation Type & Value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                طريقة الحساب:
              </label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as 'amount' | 'percent')}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="amount">مبلغ ثابت (جنيه مصري)</option>
                <option value="percent">نسبة مئوية (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                القيمة:
              </label>
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5">
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-white font-bold font-mono text-center focus:outline-none"
                />
                <span className="text-xs text-indigo-300 font-bold">
                  {adjustType === 'amount' ? 'ج.م' : '%'}
                </span>
              </div>
            </div>
          </div>

          {/* Rounding option */}
          <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              checked={roundToNearest5}
              onChange={(e) => setRoundToNearest5(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
            />
            <span className="text-xs text-slate-300">
              تقريب الناتج لأقرب 5 جنيهات تلقائياً (مثال: 83 تصبح 85 ج)
            </span>
          </label>

          {/* Live Preview of Changes */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-indigo-500/30">
            <h4 className="text-xs font-bold text-indigo-300 mb-2">
              معاينة سريعة قبل التطبيق:
            </h4>
            <div className="space-y-1.5">
              {sampleItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-0">
                  <span className="text-slate-300 font-bold">{item.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 line-through">
                      {item.prices[0]?.price} ج
                    </span>
                    <ArrowRight size={12} className="text-indigo-400 rotate-180" />
                    <span className="text-emerald-400 font-black">
                      {calculateNewPrice(item.prices[0]?.price || 0)} ج.م
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={15} />
              <span>تطبيق التعديل على الأسعار</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
