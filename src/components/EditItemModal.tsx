import React, { useState, useEffect } from 'react';
import { MenuItem, MenuCategory, PriceVariant } from '../types/menu';
import { X, Plus, Trash2, Check, Sparkles } from 'lucide-react';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null; // null means new item
  categories: MenuCategory[];
  defaultCategoryId?: string;
  onSave: (item: MenuItem) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  item,
  categories,
  defaultCategoryId,
  onSave
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [prices, setPrices] = useState<PriceVariant[]>([{ label: 'عادي', price: 50 }]);
  const [tags, setTags] = useState<NonNullable<MenuItem['tags']>>([]);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategoryId(item.categoryId);
      setDescription(item.description || '');
      setPrices(item.prices.map((p) => ({ ...p })));
      setTags(item.tags || []);
    } else {
      // New item
      const initialCatId = defaultCategoryId || categories[0]?.id || 'pizza';
      const cat = categories.find((c) => c.id === initialCatId);
      setName('');
      setCategoryId(initialCatId);
      setDescription('');
      if (cat?.sizeLabels && cat.sizeLabels.length > 0) {
        setPrices(cat.sizeLabels.map((label) => ({ label, price: 50 })));
      } else {
        setPrices([{ label: 'عادي', price: 50 }]);
      }
      setTags([]);
    }
  }, [item, isOpen, defaultCategoryId, categories]);

  if (!isOpen) return null;

  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    // If user hasn't customized prices much, adopt the category's size labels
    const cat = categories.find((c) => c.id === newCatId);
    if (cat?.sizeLabels && cat.sizeLabels.length > 0) {
      setPrices(
        cat.sizeLabels.map((lbl, idx) => ({
          label: lbl,
          price: prices[idx]?.price || 50
        }))
      );
    }
  };

  const handlePriceChange = (index: number, field: 'label' | 'price', value: string) => {
    const next = [...prices];
    if (field === 'price') {
      next[index].price = parseFloat(value) || 0;
    } else {
      next[index].label = value;
    }
    setPrices(next);
  };

  const handleAddPriceVariant = () => {
    setPrices([...prices, { label: 'حجم إضافي', price: 50 }]);
  };

  const handleRemovePriceVariant = (index: number) => {
    if (prices.length <= 1) return;
    setPrices(prices.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: NonNullable<MenuItem['tags']>[number]) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const savedItem: MenuItem = {
      id: item?.id || `custom-${Date.now()}`,
      name: name.trim(),
      categoryId,
      description: description.trim(),
      prices,
      tags
    };

    onSave(savedItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-right"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {item ? 'تعديل بيانات الصنف' : 'إضافة صنف جديد للمنيو'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              اسم الصنف / الأكلة <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: بيتزا مارجريتا، كريب استربس..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              القسم في المنيو
            </label>
            <select
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              المكونات أو الوصف (اختياري)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: صلصة طماطم متبلة، جبنة موتزاريلا، ريحان..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Prices & Sizes Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300">
                الأسعار والأحجام (جنيه مصري)
              </label>
              <button
                type="button"
                onClick={handleAddPriceVariant}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                <span>إضافة حجم إضافي</span>
              </button>
            </div>

            <div className="space-y-2">
              {prices.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="الحجم (وسط، كبير، صاروخ...)"
                      value={p.label}
                      onChange={(e) => handlePriceChange(idx, 'label', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="w-28 flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5">
                    <input
                      type="number"
                      step="any"
                      placeholder="السعر"
                      value={p.price}
                      onChange={(e) => handlePriceChange(idx, 'price', e.target.value)}
                      className="w-full bg-transparent text-amber-400 font-bold font-mono text-center text-xs focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400">ج.م</span>
                  </div>
                  {prices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePriceVariant(idx)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-900 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Badges / Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              تمييز الصنف (شارات ترويجية):
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => toggleTag('combo')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  tags.includes('combo')
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-amber-300 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                ✨ مكس نص ونص
              </button>
              <button
                type="button"
                onClick={() => toggleTag('popular')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  tags.includes('popular')
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                🔥 الأكثر طلباً
              </button>
              <button
                type="button"
                onClick={() => toggleTag('special')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  tags.includes('special')
                    ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                ⭐ سبيشال المطعم
              </button>
              <button
                type="button"
                onClick={() => toggleTag('spicy')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  tags.includes('spicy')
                    ? 'bg-red-500/30 text-red-300 border-red-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                🌶️ حار وسبايسي
              </button>
              <button
                type="button"
                onClick={() => toggleTag('vegan')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  tags.includes('vegan')
                    ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                🌿 صيامي ونباتي
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={15} />
              <span>{item ? 'حفظ التعديلات' : 'إضافة للمنيو الآن'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
