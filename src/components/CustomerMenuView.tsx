import React, { useState } from 'react';
import { MenuItem, MenuCategory, RestaurantInfo, CartItem } from '../types/menu';
import {
  Phone,
  MapPin,
  ShoppingBag,
  MessageCircle,
  Search,
  Wallet,
  Copy,
  Check
} from 'lucide-react';
import { SalsabeelWordmark } from './SalsabeelWordmark';

const FOOD_IMAGES = {
  pizza: '/assets/aistudio/image_86369f0e.png',
  feteer: '/assets/aistudio/image_10b572b6.png',
  sweetFeteer: '/assets/aistudio/image_f37f8769.png',
  crepeCloseUp: '/assets/aistudio/WhatsApp_Image_2026-11-02_at_4.22.17_PM_653e5048.jpeg',
  pasta: '/assets/aistudio/image_37498677.png',
  syrian: '/assets/aistudio/image_56a48c70.png',
  burger: '/assets/aistudio/image_924d197e.png',
  brandLogoCoin: '/assets/aistudio/WhatsApp_Image_2026-11-17_at_4.54.01_PM_27ba9516.jpeg',
};

interface CustomerMenuViewProps {
  restaurant: RestaurantInfo;
  categories: MenuCategory[];
  items: MenuItem[];
  cart: CartItem[];
  onAddToCart: (item: MenuItem, variantLabel: string, price: number) => void;
  onOpenCart: () => void;
}

export const CustomerMenuView: React.FC<CustomerMenuViewProps> = ({
  restaurant,
  categories,
  items,
  cart,
  onAddToCart,
  onOpenCart
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);
  const [copiedCash, setCopiedCash] = useState(false);

  const handleCopyCash = () => {
    navigator.clipboard?.writeText('01094450011');
    setCopiedCash(true);
    setTimeout(() => setCopiedCash(false), 2000);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAdd = (item: MenuItem, variantLabel: string, price: number) => {
    onAddToCart(item, variantLabel, price);
    setLastAddedItem(`${item.id}-${variantLabel}`);
    setTimeout(() => {
      setLastAddedItem(null);
    }, 1200);
  };

  const scrollToCategory = (catId: string) => {
    const el = document.getElementById(`customer-cat-${catId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Grouped 4 main columns matching image_1030ea15.png:
  // Column 1 (Right): بيتزا إيطالي + السلطات والإضافات
  const pizzaCategory = categories.find((c) => c.id === 'pizza');
  const sidesCategory = categories.find((c) => c.id === 'sides');

  // Column 2: فطاير حادق + فطاير حلو
  const savoryPiesCategory = categories.find((c) => c.id === 'savory-pies');
  const sweetPiesCategory = categories.find((c) => c.id === 'sweet-pies');

  // Column 3: مكرونات + سندوتشات
  const pastaCategory = categories.find((c) => c.id === 'pasta');
  const sandwichesCategory = categories.find((c) => c.id === 'sandwiches');

  // Column 4 (Left): كريب حادق + كريب حلو
  const crepesCategory = categories.find((c) => c.id === 'crepes');
  const sweetCrepesCategory = categories.find((c) => c.id === 'sweet-crepes');

  // New Featured Sections: حواوشي + كالزوني
  const hawawshiCategory = categories.find((c) => c.id === 'hawawshi');
  const calzoneCategory = categories.find((c) => c.id === 'calzone');

  const getCatItems = (catId?: string) => {
    if (!catId) return [];
    return items.filter((i) => i.categoryId === catId);
  };

  const getCategoryBadgeImage = (catId: string) => {
    switch (catId) {
      case 'pizza':
        return FOOD_IMAGES.pizza;
      case 'savory-pies':
        return FOOD_IMAGES.feteer;
      case 'sweet-pies':
        return FOOD_IMAGES.sweetFeteer;
      case 'pasta':
        return FOOD_IMAGES.pasta;
      case 'sandwiches':
        return FOOD_IMAGES.syrian;
      case 'crepes':
        return FOOD_IMAGES.crepeCloseUp;
      case 'hawawshi':
        return FOOD_IMAGES.syrian;
      case 'calzone':
        return FOOD_IMAGES.pizza;
      default:
        return null;
    }
  };

  const renderSection = (category?: MenuCategory) => {
    if (!category) return null;
    const catItems = getCatItems(category.id);
    if (catItems.length === 0) return null;

    const isMajorCategory = ['pizza', 'savory-pies', 'sweet-pies', 'pasta', 'crepes', 'sweet-crepes', 'hawawshi', 'calzone'].includes(category.id);
    const hasMultipleSizes = category.sizeLabels && category.sizeLabels.length > 1;
    const badgeImg = getCategoryBadgeImage(category.id);

    return (
      <div
        id={`customer-cat-${category.id}`}
        className="scroll-mt-28 flex flex-col rounded-2xl shadow-lg shadow-sky-900/10 overflow-hidden mb-3 last:mb-0 bg-white border-2 border-sky-400/90 transition-shadow hover:shadow-xl"
      >
        {/* Category Header: Sapphire Navy with Gold Stars & Circular Food Image Badge */}
        <div className="bg-gradient-to-r from-[#012b4a] via-[#02558d] to-[#012b4a] border-b-2 border-amber-400 text-white py-1.5 px-3 flex items-center justify-center shadow-sm">
          <div className="flex items-center gap-2 text-center font-black">
            <span className="text-amber-300 text-sm sm:text-base font-black select-none">★</span>
            {badgeImg && (
              <img
                src={badgeImg}
                alt={category.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-amber-300 shadow-sm shrink-0 bg-slate-900"
              />
            )}
            <h3
              className={`tracking-wide font-black font-['Cairo'] text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] ${
                isMajorCategory ? 'text-[19px] sm:text-[21px]' : 'text-[17px] sm:text-[18.5px]'
              }`}
            >
              {category.name}
            </h3>
            <span className="text-amber-300 text-sm sm:text-base font-black select-none">★</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-1.5 sm:p-2 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#f8fcff] to-[#eef8ff]">
          {/* Size Header Row */}
          {hasMultipleSizes && category.sizeLabels && (
            <div className="flex items-center justify-between pb-1.5 pt-1.5 px-2 border-b-2 mb-1.5 font-['Cairo'] font-black rounded-lg border-sky-400/90 bg-sky-200/90 text-black">
              <span className="text-right text-black font-black text-[14.5px] sm:text-[15.5px] font-['Cairo'] tracking-wide [text-shadow:0_0_0.45px_currentColor]">
                الصنف
              </span>
              <div className="flex items-center gap-1 text-center shrink-0">
                {category.sizeLabels.map((lbl, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && category.id === 'crepes' && (
                      <span className="w-[2px] h-4 bg-sky-600/70 rounded-full mx-0.5 shrink-0" />
                    )}
                    <span
                      className={`${
                        lbl.length > 5
                          ? 'w-[74px] sm:w-[82px]'
                          : category.id === 'hawawshi'
                          ? 'w-[54px] sm:w-[60px]'
                          : 'w-[48px] sm:w-[54px]'
                      } text-center font-black text-black text-[14.5px] sm:text-[15.5px] font-['Cairo'] whitespace-nowrap [text-shadow:0_0_0.5px_currentColor]`}
                    >
                      {lbl}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Item Rows (NO pizza triangle icon) */}
          <div className="space-y-1">
            {catItems.map((item, idx) => {
              const isCombo = item.tags?.includes('combo');
              const isMatchSearch =
                searchQuery.trim() &&
                item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
              const isEven = idx % 2 === 0;
              const nameLen = item.name.length;
              const sizeCount = category.sizeLabels ? category.sizeLabels.length : 1;

              // Dynamically calibrate sharp, clear bold typography
              let fontSizeClass = 'text-[17.5px] sm:text-[19px]';
              if (category.id === 'hawawshi') {
                fontSizeClass = 'text-[19px] sm:text-[21px] [text-shadow:0_0_0.45px_currentColor]';
              } else if (sizeCount >= 3) {
                if (nameLen > 24) {
                  fontSizeClass = 'text-[14.5px] sm:text-[15.5px]';
                } else if (nameLen > 18) {
                  fontSizeClass = 'text-[16px] sm:text-[17px]';
                } else {
                  fontSizeClass = 'text-[17.5px] sm:text-[19px]';
                }
              } else if (sizeCount === 2) {
                if (nameLen > 24) {
                  fontSizeClass = 'text-[15.5px] sm:text-[16.5px]';
                } else if (nameLen > 18) {
                  fontSizeClass = 'text-[16.5px] sm:text-[18px]';
                } else {
                  fontSizeClass = 'text-[18px] sm:text-[19.5px]';
                }
              } else {
                if (nameLen > 24) {
                  fontSizeClass = 'text-[16.5px] sm:text-[18px]';
                } else if (nameLen > 18) {
                  fontSizeClass = 'text-[18px] sm:text-[19.5px]';
                } else {
                  fontSizeClass = 'text-[19px] sm:text-[21px]';
                }
              }

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-1.5 leading-snug py-1 px-2 rounded-xl transition-all group ${
                    isMatchSearch
                      ? 'bg-amber-200 ring-2 ring-amber-500 shadow-sm'
                      : isCombo
                      ? 'bg-gradient-to-l from-amber-100 via-amber-50 to-amber-100/90 border border-amber-400/90 shadow-2xs'
                      : isEven
                      ? 'bg-white/95 hover:bg-sky-50 border border-sky-100/70'
                      : 'bg-[#ebf7ff]/90 hover:bg-sky-100/80 border border-sky-200/50'
                  }`}
                >
                  {/* Item Name - Clean without triangle */}
                  <div className="flex-1 min-w-0 flex items-center gap-1 overflow-visible">
                    <span
                      className={`font-black font-['Cairo'] text-black leading-snug select-text tracking-tight ${fontSizeClass}`}
                      title={item.name}
                    >
                      {item.name}
                    </span>

                    {isCombo && (
                      <span className="text-[12px] shrink-0 leading-none" title="ميكس نص ونص">
                        🔥
                      </span>
                    )}
                    {item.tags?.includes('popular') && !isCombo && (
                      <span className="text-[12px] text-amber-500 font-black shrink-0" title="الأكثر طلباً">
                        ★
                      </span>
                    )}
                    {item.tags?.includes('spicy') && (
                      <span className="text-[12px] shrink-0" title="حار">
                        🌶️
                      </span>
                    )}
                  </div>

                  {/* Boxed Modern Interactive Prices */}
                  <div className="flex items-center gap-1 shrink-0 font-mono">
                    {category.sizeLabels && category.sizeLabels.length > 1 ? (
                      category.sizeLabels.map((sizeLabel, sIdx) => {
                        const dividerEl =
                          sIdx > 0 && category.id === 'crepes' ? (
                            <span className="w-[2px] h-5 bg-sky-400/80 rounded-full mx-0.5 shrink-0" />
                          ) : null;

                        const priceObj = item.prices.find(
                          (pr) => pr.label.trim() === sizeLabel.trim()
                        );
                        if (!priceObj) {
                          return (
                            <React.Fragment key={sIdx}>
                              {dividerEl}
                              <div
                                className="w-[48px] sm:w-[54px] h-8 flex items-center justify-center font-black font-mono select-none text-[15px] text-slate-300"
                              >
                                -
                              </div>
                            </React.Fragment>
                          );
                        }

                        const isJustAdded = lastAddedItem === `${item.id}-${priceObj.label}`;

                        return (
                          <React.Fragment key={sIdx}>
                            {dividerEl}
                            <button
                              type="button"
                              onClick={() => handleAdd(item, priceObj.label, priceObj.price)}
                              className={`${
                                sizeLabel.length > 5
                                  ? 'w-[74px] sm:w-[82px]'
                                  : category.id === 'hawawshi'
                                  ? 'w-[54px] sm:w-[60px]'
                                  : 'w-[48px] sm:w-[54px]'
                              } ${
                                category.id === 'hawawshi' ? 'h-9 text-[18px] sm:text-[19px]' : 'h-8 text-[16.5px] sm:text-[17.5px]'
                              } text-center font-black font-mono [text-shadow:0_0_0.45px_currentColor] rounded-lg cursor-pointer transition-all active:scale-90 flex items-center justify-center relative group/btn border shadow-2xs ${
                                isJustAdded
                                  ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-md ring-2 ring-emerald-300'
                                  : 'bg-white border-sky-300 text-black hover:bg-amber-400 hover:border-amber-500 hover:shadow-sm'
                              }`}
                              title={`اضغط لإضافة ${item.name} (${priceObj.label}) بسعر ${priceObj.price} ج.م`}
                            >
                              <span>{priceObj.price}</span>
                              <span className="absolute -top-1.5 -right-1.5 opacity-0 group-hover/btn:opacity-100 text-[9px] bg-slate-950 text-amber-300 rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold shadow">
                                +
                              </span>
                            </button>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      item.prices.map((p, pIdx) => {
                        const isJustAdded = lastAddedItem === `${item.id}-${p.label}`;
                        const isSidesMulti = item.categoryId === 'sides' && item.prices.length > 1;

                        const hasMeaningfulLabel =
                          item.categoryId !== 'crepes' &&
                          item.categoryId !== 'sweet-crepes' &&
                          item.categoryId !== 'calzone' &&
                          item.categoryId !== 'juices' &&
                          Boolean(p.label?.trim()) &&
                          p.label !== 'السعر' &&
                          p.label !== 'عادي';

                        if (p.price <= 0) {
                          return (
                            <span
                              key={pIdx}
                              className="min-w-[56px] px-2 h-8 text-center font-black font-['Cairo'] text-[11.5px] rounded-lg flex items-center justify-center border border-sky-200 bg-sky-50 text-sky-900 select-none"
                              title="متاح بالفرع — اضغط على الأسعار في الإدارة لتحديد السعر"
                            >
                              متاح
                            </span>
                          );
                        }

                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleAdd(item, p.label, p.price)}
                            className={`${
                              isSidesMulti ? 'px-1.5 min-w-[46px]' : 'min-w-[48px] sm:min-w-[52px] px-2'
                            } h-8 text-center font-black font-mono text-[15.5px] sm:text-[17px] rounded-lg cursor-pointer transition-all active:scale-90 flex items-center justify-center gap-0.5 relative group/btn border shadow-2xs ${
                              isJustAdded
                                ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-md ring-2 ring-emerald-300'
                                : 'bg-white border-sky-300 text-slate-950 hover:bg-amber-400 hover:border-amber-500 hover:shadow-sm'
                            }`}
                            title={
                              hasMeaningfulLabel
                                ? `اضغط لإضافة ${item.name} (${p.label}) بسعر ${p.price} ج.م`
                                : `اضغط لإضافة ${item.name} بسعر ${p.price} ج.م`
                            }
                          >
                            {isSidesMulti && (
                              <span className="text-[10.5px] font-black text-sky-800 font-['Cairo']">
                                {p.label === 'صغير' ? 'ص:' : p.label === 'وسط' ? 'و:' : 'ك:'}
                              </span>
                            )}
                            <span>{p.price}</span>
                            <span className="absolute -top-1.5 -right-1.5 opacity-0 group-hover/btn:opacity-100 text-[9px] bg-slate-950 text-amber-300 rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold shadow">
                              +
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const bottomShowcaseItems = [
    {
      title: 'بيتزا إيطالي',
      subtitle: 'موتزاريلا طبيعية',
      image: FOOD_IMAGES.pizza,
      targetCat: 'pizza'
    },
    {
      title: 'فطاير',
      subtitle: 'مورقة طازجة',
      image: FOOD_IMAGES.feteer,
      targetCat: 'savory-pies'
    },
    {
      title: 'كريب | كونو',
      subtitle: 'كرسبي وكونو مقرمش',
      image: FOOD_IMAGES.crepeCloseUp,
      targetCat: 'crepes'
    },
    {
      title: 'مكرونات',
      subtitle: 'وايت وريد صوص وجبن',
      image: FOOD_IMAGES.pasta,
      targetCat: 'pasta'
    },
    {
      title: 'سندوتشات سوري',
      subtitle: 'شاورما وفراخ مقرمشة',
      image: FOOD_IMAGES.syrian,
      targetCat: 'sandwiches'
    },
    {
      title: 'سندوتشات برجر',
      subtitle: 'لحم بلدي وشيدر',
      image: FOOD_IMAGES.burger,
      targetCat: 'sandwiches'
    },
    {
      title: 'حواوشي إيطالي',
      subtitle: 'ساده وموتزاريلا',
      image: FOOD_IMAGES.syrian,
      targetCat: 'hawawshi'
    },
    {
      title: 'كالزوني إيطالي',
      subtitle: 'محشو ومخبوز على الحجر',
      image: FOOD_IMAGES.pizza,
      targetCat: 'calzone'
    }
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#d8efff] via-[#bfe4fd] to-[#d6eeff] flex flex-col font-['Cairo',sans-serif] selection:bg-amber-400 selection:text-slate-950 pb-24"
      dir="rtl"
    >
      {/* 1. COMPACT STICKY SEARCH & QUICK ORDER BAR */}
      <div className="no-print sticky top-0 z-40 bg-[#01233c]/95 backdrop-blur-md border-b border-sky-400/50 px-3 sm:px-6 py-2 shadow-lg text-white">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Quick Search Input */}
          <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-300" />
            <input
              type="text"
              placeholder="ابحث عن أي صنف في المنيو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#022f4f] border border-sky-400/40 rounded-xl pr-9 pl-7 py-1.5 text-xs text-white placeholder-sky-200/70 focus:outline-none focus:border-amber-400 font-['Cairo']"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sky-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-sky-200 font-bold">
            <span>💡 اضغط على أي سعر لإضافته للفاتورة مباشرة</span>
          </div>

          {/* Direct Quick Call & WhatsApp & Cart */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/${restaurant.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
            >
              <MessageCircle size={14} />
              <span>واتساب</span>
            </a>

            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span>الفاتورة</span>
              {totalCartCount > 0 && (
                <span className="bg-slate-950 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN MODERN FLYER CONTAINER MATCHING REFERENCE DESIGN (image_1030ea15.png) */}
      <main className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="rounded-3xl border-3 border-sky-400 shadow-2xl overflow-hidden bg-gradient-to-b from-[#d8efff] via-[#c3e6fd] to-[#d9f0ff]">
          
          {/* TOP SAPPHIRE FLYER HEADER BANNER */}
          <div className="bg-gradient-to-l from-[#012744] via-[#024778] to-[#012744] border-b-3 border-amber-400 px-4 sm:px-6 py-3.5 text-white relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Right: Brand Title + Larger Circular Coin Logo + Specialty Pills */}
              <div className="flex items-center gap-3.5 sm:gap-4 select-none">
                <div className="w-24 h-24 sm:w-[116px] sm:h-[116px] rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 p-1 border-2 border-white ring-2 ring-amber-300/60 flex items-center justify-center shadow-[0_10px_28px_rgba(0,0,0,0.45)] shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#4a2612]">
                    <img
                      src={FOOD_IMAGES.brandLogoCoin}
                      alt={restaurant.name}
                      className="w-full h-full object-cover scale-[1.15] brightness-[1.06] contrast-[1.09] saturate-[1.08]"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="text-amber-400 text-xl sm:text-2xl font-black">★</span>
                    <div className="flex items-center gap-2 sm:gap-2.5" aria-label={restaurant.name}>
                      <span className="text-2xl sm:text-4xl font-black text-white font-['Cairo'] leading-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                        بيتزا
                      </span>
                      <SalsabeelWordmark
                        variant="red-white"
                        idPrefix="cust-hdr"
                        className="h-16 sm:h-[78px] w-auto -my-2.5 drop-shadow-[0_3px_6px_rgba(0,0,0,0.65)]"
                      />
                    </div>
                    <span className="text-amber-400 text-xl sm:text-2xl font-black">★</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm">
                    <span className="font-bold text-white/95">{restaurant.tagline}</span>
                    <span className="hidden sm:inline text-sky-400">•</span>
                    <div className="hidden sm:flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-white/10 border border-sky-300/30 rounded-full px-2 py-0.5 text-[11px] font-bold text-sky-100">
                        <img src={FOOD_IMAGES.pizza} alt="" className="w-4 h-4 rounded-full object-cover" />
                        بيتزا إيطالي
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white/10 border border-sky-300/30 rounded-full px-2 py-0.5 text-[11px] font-bold text-sky-100">
                        <img src={FOOD_IMAGES.feteer} alt="" className="w-4 h-4 rounded-full object-cover" />
                        فطاير
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white/10 border border-sky-300/30 rounded-full px-2 py-0.5 text-[11px] font-bold text-sky-100">
                        <img src={FOOD_IMAGES.crepeCloseUp} alt="" className="w-4 h-4 rounded-full object-cover" />
                        كريب مقرمش
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Location Pill */}
              <div className="bg-[#011c32]/90 border border-sky-300/50 rounded-2xl px-4 py-2 flex items-center gap-2.5 shadow-inner">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-amber-300" />
                </div>
                <div className="text-right">
                  <div className="text-[10.5px] font-bold text-sky-200">مقر وموقع المحل:</div>
                  <div className="text-xs sm:text-sm font-black text-white">{restaurant.address}</div>
                </div>
              </div>

              {/* Left: Golden Delivery & Vodafone Cash Banner */}
              <div className="bg-gradient-to-r from-[#ffe600] to-[#ffd000] border-2 border-amber-200 rounded-2xl px-3.5 py-2 text-slate-950 shadow-lg flex items-center gap-3">
                <div className="text-right space-y-1">
                  <div className="text-[10.5px] font-black text-red-950">
                    أرقام الدليفري والطلبات السريعة:
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono font-black text-base sm:text-lg text-slate-950 leading-none" dir="ltr">
                    <a href="tel:01159001520" className="hover:text-red-800 transition-colors">
                      01159001520
                    </a>
                    <span className="text-red-800">-</span>
                    <div className="inline-flex items-center gap-1.5">
                      <a href="tel:01094450011" className="hover:text-red-800 transition-colors">
                        01094450011
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyCash}
                        className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white rounded-lg px-2 py-0.5 inline-flex items-center gap-1 text-[10.5px] font-['Cairo'] font-black shadow-xs transition-all active:scale-95 cursor-pointer"
                        dir="rtl"
                        title="اضغط لنسخ رقم فودافون كاش"
                      >
                        <Wallet size={11} className="text-amber-300 shrink-0" />
                        <span>{copiedCash ? 'تم النسخ' : 'فودافون كاش'}</span>
                        {copiedCash ? (
                          <Check size={10} className="text-emerald-300" />
                        ) : (
                          <Copy size={10} className="text-white/85" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-red-900 text-amber-300 flex items-center justify-center shadow shrink-0">
                  <Phone size={16} />
                </div>
              </div>

            </div>
          </div>

          {/* QUICK-ACCESS TOP CATEGORY NAVIGATION STRIP (Immediately Visible on Open) */}
          <div className="px-2.5 sm:px-4 pt-3 pb-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {bottomShowcaseItems.map((card, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToCategory(card.targetCat)}
                  className="bg-white/95 hover:bg-white backdrop-blur-sm border-2 border-sky-300 hover:border-amber-400 rounded-2xl p-2 sm:p-2.5 flex items-center justify-between gap-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-right cursor-pointer group"
                >
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-black text-[#012f52] group-hover:text-amber-700 truncate">
                      {card.title}
                    </div>
                    <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-600 truncate mt-0.5">
                      {card.subtitle}
                    </div>
                  </div>
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-400/80 shadow-xs shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 4-COLUMN MENU BODY */}
          <div className="p-2.5 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
              
              {/* Column 1 (Right): بيتزا إيطالي + السلطات والإضافات */}
              <div className="flex flex-col">
                {renderSection(pizzaCategory)}
                {renderSection(sidesCategory)}
              </div>

              {/* Column 2: فطاير حادق + فطاير حلو */}
              <div className="flex flex-col">
                {renderSection(savoryPiesCategory)}
                {renderSection(sweetPiesCategory)}
              </div>

              {/* Column 3: مكرونات + سندوتشات */}
              <div className="flex flex-col">
                {renderSection(pastaCategory)}
                {renderSection(sandwichesCategory)}
              </div>

              {/* Column 4 (Left): كريب حادق + كريب حلو */}
              <div className="flex flex-col">
                {renderSection(crepesCategory)}
                {renderSection(sweetCrepesCategory)}
              </div>

            </div>

            {/* FEATURED 2-COLUMN SECTION: حواوشي + كالزوني */}
            {(hawawshiCategory || calzoneCategory) && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                {renderSection(hawawshiCategory)}
                {renderSection(calzoneCategory)}
              </div>
            )}
          </div>

          {/* BOTTOM SKY BLUE BRAND FOOTER BAR */}
          <div className="bg-gradient-to-r from-[#5ab4f2] via-[#75c4fa] to-[#5ab4f2] border-t-2 border-sky-300 px-4 py-2.5 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-black">
            <div className="flex items-center gap-2">
              <span className="text-[#012f52]">★</span>
              <div className="inline-flex items-center gap-1.5" aria-label={restaurant.name}>
                <span className="font-black text-sm sm:text-base text-[#012f52]">بيتزا</span>
                <SalsabeelWordmark variant="red-white" idPrefix="cust-ftr" className="h-9 sm:h-10 w-auto -my-1.5" />
              </div>
              <span>•</span>
              <span className="font-extrabold text-[#012f52]">{restaurant.tagline}</span>
              <span className="text-[#012f52]">★</span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#012f52]" />
              <span>{restaurant.address}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 font-mono" dir="ltr">
              <Phone size={13} className="text-[#012f52]" />
              <a href="tel:01159001520" className="hover:underline">01159001520</a>
              <span>-</span>
              <div className="inline-flex items-center gap-1.5">
                <a href="tel:01094450011" className="hover:underline">01094450011</a>
                <button
                  type="button"
                  onClick={handleCopyCash}
                  className="bg-red-700 hover:bg-red-800 text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1 text-[10.5px] font-['Cairo'] font-black shadow-xs transition-colors cursor-pointer"
                  dir="rtl"
                  title="اضغط لنسخ رقم فودافون كاش"
                >
                  <Wallet size={10} className="text-amber-300" />
                  <span>{copiedCash ? 'تم النسخ' : 'فودافون كاش'}</span>
                  {copiedCash && <Check size={10} className="text-emerald-300" />}
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 3. STICKY FLOATING LIVE BILL CALCULATOR BAR */}
      <div className="no-print fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-3xl">
        <div className="bg-[#01253e]/95 backdrop-blur-md border-2 border-amber-400 rounded-3xl p-3 sm:p-3.5 shadow-2xl shadow-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-right text-white">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-lg text-xl">
              🧾
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">
                  {totalCartCount === 0
                    ? 'اضغط على أي سعر لإضافته للفاتورة'
                    : `سلة طلبك: (${totalCartCount} وجبة)`}
                </span>
                {totalCartCount > 0 && (
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    حساب مباشر ✨
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xs text-slate-300 font-bold">إجمالي الفاتورة:</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                  {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                </span>
                <span className="text-xs font-black text-amber-300">ج.م</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <a
              href="tel:01159001520"
              className="hidden lg:flex py-2.5 px-3 rounded-2xl bg-[#011a2c] hover:bg-[#022947] border border-amber-400 text-amber-300 font-black text-xs items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              title="اتصال هاتفي مباشر"
            >
              <Phone size={13} className="text-amber-400" />
              <span dir="ltr">01159001520</span>
            </a>

            <button
              onClick={onOpenCart}
              className="flex-1 sm:flex-initial py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag size={16} />
              <span>عرض الفاتورة وإرسال الطلب 🛒</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
