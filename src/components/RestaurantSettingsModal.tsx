import React, { useState } from 'react';
import { RestaurantInfo, MenuItem, MenuCategory } from '../types/menu';
import { X, Check, Download, Upload, Phone, MapPin, Clock, Store, Megaphone } from 'lucide-react';

interface RestaurantSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: RestaurantInfo;
  onSave: (updated: RestaurantInfo) => void;
  items: MenuItem[];
  categories: MenuCategory[];
  onImportData: (items: MenuItem[], categories: MenuCategory[], restaurant: RestaurantInfo) => void;
}

export const RestaurantSettingsModal: React.FC<RestaurantSettingsModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  onSave,
  items,
  categories,
  onImportData
}) => {
  const [formData, setFormData] = useState<RestaurantInfo>({ ...restaurant });
  const [phonesText, setPhonesText] = useState(restaurant.deliveryPhones.join(', '));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phones = phonesText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    onSave({
      ...formData,
      deliveryPhones: phones
    });
    onClose();
  };

  const handleExportBackup = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      restaurant: formData,
      categories,
      items
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu_backup_${restaurant.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.items && json.categories) {
          onImportData(json.items, json.categories, json.restaurant || formData);
          alert('تم استيراد نسخة المنيو بنجاح!');
          onClose();
        } else {
          alert('ملف غير صالح.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة الملف.');
      }
    };
    reader.readAsText(file);
  };

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
            <Store className="text-amber-400" size={22} />
            <h2 className="text-lg font-black text-white">
              إعدادات وبيانات المطعم
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
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              اسم المطعم
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              الوصف والشعار الترويجي
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              أرقام هواتف الدليفري (افصل بينها بفاصلة ,)
            </label>
            <div className="relative">
              <Phone size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                dir="ltr"
                value={phonesText}
                onChange={(e) => setPhonesText(e.target.value)}
                placeholder="01012345678, 01123456789"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500 text-right"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              رقم الواتساب لاستقبال الطلبات (مع كود الدولة مثل 201012345678)
            </label>
            <input
              type="text"
              dir="ltr"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-amber-500 text-left"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                العنوان
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ساعات العمل
              </label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              شريط الإعلانات أعلى الصفحة
            </label>
            <input
              type="text"
              value={formData.announcement || ''}
              onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
              placeholder="مثال: خصم 10% على كل طلبات الأونلاين اليوم!"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Backup & Restore section */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400">
              النسخ الاحتياطي ونقل المنيو:
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <Download size={13} />
                <span>تحميل نسخة احتياطية (JSON)</span>
              </button>

              <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700">
                <Upload size={13} />
                <span>استيراد نسخة من ملف</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit */}
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
              <span>حفظ البيانات</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
