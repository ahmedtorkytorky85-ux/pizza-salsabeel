import React from 'react';
import { RestaurantInfo } from '../types/menu';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Edit3, 
  Printer, 
  Percent, 
  ShoppingBag, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  FileText, 
  Image as ImageIcon,
  Settings,
  MessageCircle,
  Palette,
  LayoutGrid,
  List
} from 'lucide-react';

export type MenuTheme = 'dark' | 'italian' | 'light';

interface HeaderProps {
  restaurant: RestaurantInfo;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenBulkPriceModal: () => void;
  onOpenSettingsModal: () => void;
  onResetMenu: () => void;
  onOpenCart: () => void;
  cartCount: number;
  viewMode: 'modern' | 'board' | 'compare';
  onChangeViewMode: (mode: 'modern' | 'board' | 'compare') => void;
  onPrint: () => void;
  currentTheme: MenuTheme;
  onChangeTheme: (theme: MenuTheme) => void;
  cardLayout: 'grid' | 'compact';
  onToggleCardLayout: () => void;
  isCustomerMode?: boolean;
  onToggleCustomerMode?: () => void;
  onOpenShareModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  restaurant,
  isEditMode,
  onToggleEditMode,
  onOpenBulkPriceModal,
  onOpenSettingsModal,
  onResetMenu,
  onOpenCart,
  cartCount,
  viewMode,
  onChangeViewMode,
  onPrint,
  currentTheme,
  onChangeTheme,
  cardLayout,
  onToggleCardLayout,
  isCustomerMode = false,
  onToggleCustomerMode,
  onOpenShareModal
}) => {
  const isLightTheme = currentTheme === 'light';

  return (
    <header className="no-print sticky top-0 z-40 backdrop-blur-md shadow-2xl transition-colors duration-300">
      
      {/* Top Banner Announcement */}
      {restaurant.announcement && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-slate-950 text-xs sm:text-sm font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <Sparkles size={15} className="animate-spin" />
          <span>{restaurant.announcement}</span>
        </div>
      )}

      {/* Main Header Container */}
      <div className={`transition-colors duration-300 border-b ${
        currentTheme === 'dark' 
          ? 'bg-slate-900/95 border-amber-500/20' 
          : currentTheme === 'italian'
          ? 'bg-stone-900/95 border-amber-600/30'
          : 'bg-white/95 border-amber-400/40 text-slate-900 shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Brand Info */}
            <div className="flex items-center gap-3.5 text-right w-full md:w-auto">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0 text-3xl ring-2 ring-amber-400/30">
                🍕
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-wide ${
                    isLightTheme ? 'text-slate-900' : 'text-white'
                  }`}>
                    {restaurant.name}
                  </h1>
                  {isEditMode && (
                    <button 
                      onClick={onOpenSettingsModal}
                      title="تعديل اسم وبيانات المطعم"
                      className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 text-xs transition-colors flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Settings size={14} />
                      <span className="hidden sm:inline">بيانات المطعم</span>
                    </button>
                  )}
                </div>
                <p className={`text-xs sm:text-sm font-semibold mt-0.5 ${
                  isLightTheme ? 'text-amber-700' : 'text-amber-400/90'
                }`}>
                  {restaurant.tagline}
                </p>

                {/* Quick details with prominent Address */}
                <div className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-[13px] mt-2 ${
                  isLightTheme ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  <span className={`flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-xl border ${
                    isLightTheme 
                      ? 'bg-amber-50 border-amber-300 text-amber-950 font-black' 
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-300 font-black'
                  }`}>
                    <MapPin size={14} className="text-amber-500 shrink-0" />
                    <span>{restaurant.address}</span>
                  </span>
                  <span className="flex items-center gap-1 opacity-80">
                    <Clock size={13} className="text-amber-500" />
                    <span>{restaurant.workingHours}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Numbers & WhatsApp */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
              {restaurant.deliveryPhones.map((phone, idx) => (
                <a
                  key={idx}
                  href={`tel:${phone}`}
                  className={`text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 border ${
                    isLightTheme
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                      : 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/80 text-slate-200'
                  }`}
                >
                  <Phone size={13} className="text-emerald-500" />
                  <span dir="ltr">{phone}</span>
                </a>
              ))}
              
              <a
                href={`https://wa.me/${restaurant.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-transform active:scale-95"
              >
                <MessageCircle size={14} />
                <span>واتساب الدليفري</span>
              </a>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className={`mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-2.5 text-xs ${
            isLightTheme ? 'border-slate-200' : 'border-slate-800/80'
          }`}>
            
            {/* View Modes Tabs */}
            <div className={`flex items-center p-1 rounded-xl border ${
              isLightTheme ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => onChangeViewMode('modern')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'modern'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                    : isLightTheme ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers size={14} />
                <span>{isCustomerMode ? 'منيو الطلب السريع 🛒' : 'العرض العصري'}</span>
              </button>

              <button
                onClick={() => onChangeViewMode('board')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'board'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                    : isLightTheme ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText size={14} />
                <span>المنيو الورقي المصور 🖨️</span>
              </button>
            </div>

            {/* Design Customizers & Actions */}
            <div className="flex items-center flex-wrap gap-2">
              
              {/* Share Customer Link Button (For Restaurant Owner) */}
              {!isCustomerMode && onOpenShareModal && (
                <button
                  onClick={onOpenShareModal}
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/25 hover:brightness-105 transition-transform active:scale-95 cursor-pointer border border-amber-300"
                  title="مشاركة رابط المنيو والأسعار المباشر مع الزبائن والعملاء"
                >
                  <span className="text-sm">🔗</span>
                  <span>رابط منيو العملاء والطلب</span>
                </button>
              )}

              {/* Theme Picker */}
              <div className={`flex items-center gap-1 p-1 rounded-xl border ${
                isLightTheme ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
              }`}>
                <span className="text-[10px] text-slate-400 px-1 flex items-center gap-1 font-bold">
                  <Palette size={12} className="text-amber-500" />
                  <span>الشكل:</span>
                </span>
                
                <button
                  onClick={() => onChangeTheme('dark')}
                  title="ستايل ملكي داكن"
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    currentTheme === 'dark'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : isLightTheme ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  داكن فخم 🌙
                </button>

                <button
                  onClick={() => onChangeTheme('italian')}
                  title="ستايل إيطالي دافئ"
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    currentTheme === 'italian'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : isLightTheme ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  إيطاليانو 🍕
                </button>

                <button
                  onClick={() => onChangeTheme('light')}
                  title="ستايل أبيض ناصع حديث"
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    currentTheme === 'light'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  فاتح عصري ☀️
                </button>
              </div>

              {/* Grid / Compact Layout Switcher */}
              {viewMode === 'modern' && (
                <button
                  onClick={onToggleCardLayout}
                  className={`p-1.5 rounded-xl border flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                    isLightTheme
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                  title={cardLayout === 'grid' ? 'تحويل إلى عرض قائمة سريعة ومدمجة' : 'تحويل إلى عرض كروت طعام كبيرة'}
                >
                  {cardLayout === 'grid' ? <List size={15} /> : <LayoutGrid size={15} />}
                  <span className="hidden sm:inline">
                    {cardLayout === 'grid' ? 'قائمة سريعة' : 'كروت طعام'}
                  </span>
                </button>
              )}

              {/* Live Edit Mode Button (Only in Owner Mode) */}
              {!isCustomerMode && (
                <button
                  onClick={onToggleEditMode}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                    isEditMode
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400 animate-pulse-subtle'
                      : isLightTheme
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
                  }`}
                >
                  <Edit3 size={14} />
                  <span>{isEditMode ? 'وضع التعديل مفعل ✏️' : 'تفعيل وضع التعديل'}</span>
                </button>
              )}

              {/* Bulk Price Adjust (Only in Owner Mode) */}
              {!isCustomerMode && isEditMode && (
                <button
                  onClick={onOpenBulkPriceModal}
                  className="bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-500/40 text-indigo-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="تعديل جماعي للأسعار (زيادة/تخفيض نسبة أو مبلغ)"
                >
                  <Percent size={13} />
                  <span>تعديل سريع للأسعار</span>
                </button>
              )}

              {/* Print / Save PDF */}
              <button
                onClick={onPrint}
                className={`border px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLightTheme
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="طباعة المنيو أو حفظه كـ PDF"
              >
                <Printer size={14} className="text-sky-500" />
                <span className="hidden sm:inline">طباعة / PDF</span>
              </button>

              {/* Reset to Default (Only in Owner Mode) */}
              {!isCustomerMode && isEditMode && (
                <button
                  onClick={onResetMenu}
                  className="bg-red-950/70 hover:bg-red-900/80 border border-red-500/30 text-red-300 px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="استعادة الأسعار الأصلية المسجلة من الصورة"
                >
                  <RotateCcw size={13} />
                  <span className="hidden sm:inline">استعادة الأسعار</span>
                </button>
              )}

              {/* Mode Toggle Button */}
              {onToggleCustomerMode && (
                <button
                  onClick={onToggleCustomerMode}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-500/25 transition-transform active:scale-95 cursor-pointer border border-sky-300"
                  title="الانتقال إلى منيو الزبائن الأزرق السماوي الكامل"
                >
                  <span>👁️</span>
                  <span>عرض منيو الزبائن (السماوي)</span>
                </button>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={onOpenCart}
                className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-transform active:scale-95 cursor-pointer"
              >
                <ShoppingBag size={15} />
                <span>الفاتورة والطلب</span>
                {cartCount > 0 && (
                  <span className="bg-white text-emerald-700 font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
