import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, MenuCategory, RestaurantInfo, CartItem } from './types/menu';
import { 
  DEFAULT_RESTAURANT_INFO, 
  DEFAULT_CATEGORIES, 
  DEFAULT_MENU_ITEMS 
} from './data/defaultMenu';
import { Header, MenuTheme } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { MenuItemCard } from './components/MenuItemCard';
import { EditItemModal } from './components/EditItemModal';
import { BulkPriceModal } from './components/BulkPriceModal';
import { RestaurantSettingsModal } from './components/RestaurantSettingsModal';
import { PrintMenuView } from './components/PrintMenuView';
import { CompareOldMenuView } from './components/CompareOldMenuView';
import { CartDrawer } from './components/CartDrawer';
import { ShareMenuModal } from './components/ShareMenuModal';
import { CustomerMenuView } from './components/CustomerMenuView';
import { Plus, Sparkles, Phone, FileText } from 'lucide-react';

const STORAGE_KEY_ITEMS = 'salsabeel_menu_items_v22_crepe_cono_menu';
const STORAGE_KEY_CATEGORIES = 'salsabeel_menu_categories_v22_crepe_cono_menu';
const STORAGE_KEY_RESTAURANT = 'salsabeel_restaurant_info_v20_exact_user_menu';
const STORAGE_KEY_CART = 'salsabeel_cart_v20';
const STORAGE_KEY_THEME = 'salsabeel_theme_v20';
const STORAGE_KEY_LAYOUT = 'salsabeel_layout_v20';

export default function App() {
  // Theme & Layout for Admin
  const [currentTheme, setCurrentTheme] = useState<MenuTheme>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as MenuTheme) || 'dark';
  });

  const [cardLayout, setCardLayout] = useState<'grid' | 'compact'>(() => {
    return (localStorage.getItem(STORAGE_KEY_LAYOUT) as 'grid' | 'compact') || 'grid';
  });

  // Persistent restaurant data
  const [restaurant, setRestaurant] = useState<RestaurantInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RESTAURANT);
    if (!saved) return DEFAULT_RESTAURANT_INFO;
    try {
      const parsed: RestaurantInfo = JSON.parse(saved);
      if (parsed.name.includes('مطعم') || parsed.name.includes('فطاطري')) {
        parsed.name = 'بيتزا سلسبيل';
      }
      return parsed;
    } catch {
      return DEFAULT_RESTAURANT_INFO;
    }
  });

  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!saved) return DEFAULT_CATEGORIES;
    try {
      const parsed: MenuCategory[] = JSON.parse(saved);
      const existingCatIds = new Set(parsed.map((c) => c.id));
      const missingCats = DEFAULT_CATEGORIES.filter((d) => !existingCatIds.has(d.id));
      const mergedCats = [...parsed, ...missingCats];
      return mergedCats.map((cat) => {
        if (cat.id === 'hawawshi') {
          return { ...cat, name: 'حواوشي إيطالي', sizeLabels: ['ساده', 'موتزاريلا'] };
        }
        if (cat.id === 'calzone') {
          return { ...cat, name: 'كالزوني إيطالي', sizeLabels: ['السعر'] };
        }
        if (cat.id === 'crepes') {
          return { ...cat, name: 'كريب | كونو', sizeLabels: ['كريب', 'كونو'] };
        }
        if (cat.id === 'sweet-crepes' || cat.id === 'juices') {
          return { ...cat, sizeLabels: ['السعر'] };
        }
        return cat;
      });
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [items, setItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!saved) return DEFAULT_MENU_ITEMS;
    try {
      const parsed: MenuItem[] = JSON.parse(saved);
      const savedHawawshi = parsed.filter((i) => i.categoryId === 'hawawshi');
      const needsHawawshiReset =
        savedHawawshi.length !== 6 || savedHawawshi.some((i) => i.prices.length !== 2);

      const savedJuices = parsed.filter((i) => i.categoryId === 'juices');
      const needsJuicesReset =
        savedJuices.length !== 22 ||
        savedJuices.some((i) => ['j-15', 'j-16', 'j-25', 'j-26', 'j-27'].includes(i.id)) ||
        savedJuices.every((i) => (i.prices[0]?.price || 0) === 0);

      const baseItems = parsed.filter((i) => {
        if (i.id === 'cz-1' || i.name.trim() === 'كالزوني مارجريتا') return false;
        if (needsHawawshiReset && i.categoryId === 'hawawshi') return false;
        if (needsJuicesReset && i.categoryId === 'juices') return false;
        return true;
      });

      const existingIds = new Set(baseItems.map((i) => i.id));
      const missingDefaults = DEFAULT_MENU_ITEMS.filter((d) => !existingIds.has(d.id));
      const merged = [...baseItems, ...missingDefaults];

      // Ensure s-14 (سندوتش برجر بيض جبنه) is strictly Fino only (40 LE)
      // and single-size crepes do not show "كبير"
      return merged.map(item => {
        if (item.id === 's-14' || item.name.includes('برجر بيض جبنه')) {
          return {
            ...item,
            prices: [{ label: 'فينو', price: 40 }]
          };
        }
        if (item.categoryId === 'sweet-crepes' && item.prices.length === 1) {
          return {
            ...item,
            prices: [{ ...item.prices[0], label: 'السعر' }]
          };
        }
        return item;
      });
    } catch {
      return DEFAULT_MENU_ITEMS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CART);
    if (!saved) return [];
    try {
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed.map((c) => {
        const isSingleFixed =
          c.itemId.startsWith('scr-') ||
          c.itemId.startsWith('cz-') ||
          c.itemId.startsWith('j-');
        if (isSingleFixed || c.variantLabel === 'السعر' || c.variantLabel === 'عادي') {
          return { ...c, variantLabel: '' };
        }
        return c;
      });
    } catch {
      return [];
    }
  });

  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  // Default to Customer Menu view (Light Sky Blue), unless URL explicitly includes ?admin=1 or #admin
  const [isCustomerMode, setIsCustomerMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === '1' || window.location.hash === '#admin') {
        return false;
      }
    }
    return true;
  });
  const [viewMode, setViewMode] = useState<'modern' | 'board' | 'compare'>('modern');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [targetCatForNewItem, setTargetCatForNewItem] = useState<string | undefined>(undefined);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ensure Customer Mode displays the clean /pizza-salsabeel path in the URL bar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const isAdminUrl = params.get('admin') === '1' || window.location.hash === '#admin';
    if (isCustomerMode && !isAdminUrl) {
      if (window.location.pathname !== '/pizza-salsabeel') {
        window.history.replaceState(null, '', '/pizza-salsabeel');
      }
    }
  }, [isCustomerMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LAYOUT, cardLayout);
  }, [cardLayout]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RESTAURANT, JSON.stringify(restaurant));
  }, [restaurant]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  // Item counts by category
  const itemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.id] = items.filter((i) => i.categoryId === cat.id).length;
    });
    return counts;
  }, [categories, items]);

  // Filtered items for Admin view
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
        return false;
      }
      if (selectedTag && !item.tags?.includes(selectedTag as any)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q) || false;
        return matchesName || matchesDesc;
      }
      return true;
    });
  }, [items, activeCategory, selectedTag, searchQuery]);

  // Handlers for updating menu
  const handleUpdatePrice = (itemId: string, variantIndex: number, newPrice: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const nextPrices = [...item.prices];
        if (nextPrices[variantIndex]) {
          nextPrices[variantIndex] = {
            ...nextPrices[variantIndex],
            price: newPrice
          };
        }
        return { ...item, prices: nextPrices };
      })
    );
    showToast(`تم تحديث السعر بنجاح: ${newPrice} ج.م`);
  };

  const handleSaveItem = (savedItem: MenuItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === savedItem.id);
      if (exists) {
        return prev.map((i) => (i.id === savedItem.id ? savedItem : i));
      } else {
        return [savedItem, ...prev];
      }
    });
    showToast(`تم حفظ الصنف: "${savedItem.name}" بنجاح!`);
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find((i) => i.id === id);
    if (!itemToDelete) return;
    if (window.confirm(`هل أنت متأكد من حذف "${itemToDelete.name}" من المنيو؟`)) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`تم حذف "${itemToDelete.name}" من المنيو.`);
    }
  };

  const handleAddNewItem = (catId?: string) => {
    setEditingItem(null);
    setTargetCatForNewItem(catId || (activeCategory !== 'all' ? activeCategory : undefined));
    setIsEditModalOpen(true);
  };

  const handleApplyBulkPriceChange = (
    targetCategory: string | 'all',
    type: 'amount' | 'percent',
    value: number,
    roundToNearest5: boolean
  ) => {
    let affectedCount = 0;
    setItems((prev) =>
      prev.map((item) => {
        if (targetCategory !== 'all' && item.categoryId !== targetCategory) {
          return item;
        }
        affectedCount++;
        const nextPrices = item.prices.map((p) => {
          let updated = p.price;
          if (type === 'amount') {
            updated = p.price + value;
          } else {
            updated = p.price + (p.price * (value / 100));
          }
          if (roundToNearest5) {
            updated = Math.round(updated / 5) * 5;
          } else {
            updated = Math.round(updated);
          }
          return {
            ...p,
            price: Math.max(0, updated)
          };
        });
        return { ...item, prices: nextPrices };
      })
    );
    showToast(`تم تعديل الأسعار جماعياً لـ ${affectedCount} صنف بنجاح!`);
  };

  const handleResetMenu = () => {
    if (window.confirm('هل تريد استعادة جميع الأسعار الأصلية المسجلة من الصورة المكتوبة بخط اليد؟')) {
      setRestaurant(DEFAULT_RESTAURANT_INFO);
      setCategories(DEFAULT_CATEGORIES);
      setItems(DEFAULT_MENU_ITEMS);
      localStorage.removeItem(STORAGE_KEY_ITEMS);
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
      localStorage.removeItem(STORAGE_KEY_RESTAURANT);
      showToast('تمت استعادة الأسعار الأصلية بنجاح!');
    }
  };

  const handleImportData = (newItems: MenuItem[], newCats: MenuCategory[], newRest: RestaurantInfo) => {
    setItems(newItems);
    setCategories(newCats);
    setRestaurant(newRest);
    showToast('تم استيراد نسخة المنيو بنجاح!');
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem, variantLabel: string, price: number) => {
    const omitSizeLabel =
      item.categoryId === 'sweet-crepes' ||
      item.categoryId === 'calzone' ||
      !variantLabel.trim() ||
      variantLabel === 'السعر' ||
      variantLabel === 'عادي';
    const cleanVariantLabel = omitSizeLabel ? '' : variantLabel;
    const cartId = `${item.id}-${cleanVariantLabel || 'single'}`;

    setCart((prev) => {
      const existing = prev.find((c) => c.cartId === cartId);
      if (existing) {
        return prev.map((c) =>
          c.cartId === cartId ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [
          ...prev,
          {
            cartId,
            itemId: item.id,
            name: item.name,
            variantLabel: cleanVariantLabel,
            price,
            quantity: 1
          }
        ];
      }
    });

    showToast(
      cleanVariantLabel
        ? `تم إضافة "${item.name} (${cleanVariantLabel})" إلى السلة! 🛒`
        : `تم إضافة "${item.name}" إلى السلة! 🛒`
    );
  };

  const handleUpdateCartQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePrint = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('تم فتح المنيو الورقي! يمكنك حفظه كـ PDF أو طباعته 🖨️');
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.warn('Print error:', err);
      }
    }, 400);
  };

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const themePageClasses = 
    currentTheme === 'light'
      ? 'bg-slate-50 text-slate-900'
      : currentTheme === 'italian'
      ? 'bg-[#181311] text-stone-100'
      : 'bg-slate-950 text-slate-100';

  // 1. CUSTOMER MODE: Standalone Light Sky Blue Menu with live bill calculator
  if (isCustomerMode) {
    return (
      <div className="min-h-screen bg-[#cce8fd] text-slate-950 font-['Cairo',sans-serif]" dir="rtl">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-6 z-50 bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
            <Sparkles size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* The Entire Menu in Light Sky Blue with Tap-to-Order and Live Bill Calculator */}
        <CustomerMenuView
          restaurant={restaurant}
          categories={categories}
          items={items}
          cart={cart}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Customer Cart / Live Bill Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          restaurant={restaurant}
        />
      </div>
    );
  }

  // 2. ADMIN & MANAGEMENT MODE: Full Dashboard with edit buttons, theme chooser, bulk pricing, adding items
  return (
    <div className={`min-h-screen flex flex-col font-['Cairo',sans-serif] selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300 ${themePageClasses}`} dir="rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header with all tools */}
      <Header
        restaurant={restaurant}
        isEditMode={isEditMode}
        onToggleEditMode={() => {
          setIsEditMode(!isEditMode);
          showToast(!isEditMode ? 'تم تفعيل وضع التعديل! يمكنك الآن تغيير أي سعر مباشرة بالنقر عليه ✏️' : 'تم إغلاق وضع التعديل.');
        }}
        onOpenBulkPriceModal={() => setIsBulkModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onResetMenu={handleResetMenu}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        viewMode={viewMode}
        onChangeViewMode={(mode) => setViewMode(mode)}
        onPrint={handlePrint}
        currentTheme={currentTheme}
        onChangeTheme={(theme) => {
          setCurrentTheme(theme);
          showToast(`تم تغيير شكل المنيو إلى: ${theme === 'dark' ? 'داكن فخم 🌙' : theme === 'italian' ? 'إيطاليانو دافئ 🍕' : 'فاتح عصري ☀️'}`);
        }}
        cardLayout={cardLayout}
        onToggleCardLayout={() => {
          const next = cardLayout === 'grid' ? 'compact' : 'grid';
          setCardLayout(next);
          showToast(next === 'compact' ? 'تم تفعيل عرض القائمة السريعة والمدمجة 📋' : 'تم تفعيل عرض كروت الطعام الكبيرة 🎴');
        }}
        isCustomerMode={isCustomerMode}
        onToggleCustomerMode={() => {
          setIsCustomerMode(true);
          showToast('تم العودة إلى منيو الزبائن الأزرق السماوي 🛒');
        }}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Mode 1: Modern Digital App View */}
      {viewMode === 'modern' && (
        <>
          {/* Sticky Category & Search Navigation */}
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={(id) => setActiveCategory(id)}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            selectedTag={selectedTag}
            onSelectTag={(t) => setSelectedTag(t)}
            itemCounts={itemCounts}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
            
            {/* Quick Switch Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-sky-900/40 border border-sky-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛠️</span>
                <div>
                  <span className="font-black text-sky-300">أنت في لوحة تحكم وإدارة المنيو:</span>
                  <span className="opacity-90 mr-1 text-slate-200">
                    يمكنك تعديل الأسعار، إضافة أصناف جديدة، تغيير شكل وألوان المنيو، أو الطباعة.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCustomerMode(true)}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
              >
                <span>👁️</span>
                <span>عرض منيو الزبائن (السماوي)</span>
              </button>
            </div>

            {/* Edit Mode Alert Banner if active */}
            {isEditMode && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-500 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✏️</span>
                  <div>
                    <span className="font-black text-amber-500">أنت الآن في وضع التعديل المباشر:</span>
                    <span className="opacity-90 mr-1">
                      اضغط على أي سعر في أي صنف لتعديله فوراً، أو انقر على أيقونة القلم لتعديل الاسم والمكونات، أو أضف أصناف جديدة!
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAddNewItem()}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus size={15} />
                    <span>إضافة صنف جديد +</span>
                  </button>

                  <button
                    onClick={() => setIsEditMode(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-2 rounded-xl cursor-pointer"
                  >
                    حفظ وخروج
                  </button>
                </div>
              </div>
            )}

            {/* Displaying Categories and Items */}
            {activeCategory === 'all' && !searchQuery.trim() && !selectedTag ? (
              <div className="space-y-12">
                {categories.map((cat) => {
                  const catItems = items.filter((i) => i.categoryId === cat.id);
                  if (catItems.length === 0) return null;

                  return (
                    <section key={cat.id} id={cat.id} className="scroll-mt-36">
                      
                      {/* Section Title Header */}
                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-5 border-b ${
                        currentTheme === 'light' ? 'border-slate-200' : 'border-slate-800'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                          <div>
                            <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${
                              currentTheme === 'light' ? 'text-slate-900' : 'text-white'
                            }`}>
                              {cat.name}
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                currentTheme === 'light' ? 'bg-amber-100 text-amber-800' : 'bg-slate-800 text-amber-400'
                              }`}>
                                {catItems.length} صنف
                              </span>
                            </h2>
                            {cat.subtitle && (
                              <p className={`text-xs mt-0.5 ${
                                currentTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                              }`}>
                                {cat.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Add item to this category if editing */}
                        {isEditMode && (
                          <button
                            onClick={() => handleAddNewItem(cat.id)}
                            className="self-start sm:self-auto text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Plus size={14} />
                            <span>إضافة صنف في {cat.name}</span>
                          </button>
                        )}
                      </div>

                      {/* Items Grid or Compact List */}
                      <div className={
                        cardLayout === 'compact'
                          ? 'space-y-2.5'
                          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
                      }>
                        {catItems.map((item) => (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            category={cat}
                            isEditMode={isEditMode}
                            onEditItem={(itemToEdit) => {
                              setEditingItem(itemToEdit);
                              setIsEditModalOpen(true);
                            }}
                            onDeleteItem={handleDeleteItem}
                            onUpdatePrice={handleUpdatePrice}
                            onAddToCart={handleAddToCart}
                            theme={currentTheme}
                            layout={cardLayout}
                          />
                        ))}
                      </div>

                    </section>
                  );
                })}
              </div>
            ) : (
              // Filtered View
              <div>
                <div className={`flex items-center justify-between pb-3 mb-5 border-b ${
                  currentTheme === 'light' ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {activeCategory !== 'all' ? categories.find((c) => c.id === activeCategory)?.icon : '🔍'}
                    </span>
                    <h2 className={`text-xl sm:text-2xl font-black ${
                      currentTheme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}>
                      {searchQuery
                        ? `نتائج البحث عن "${searchQuery}"`
                        : activeCategory !== 'all'
                        ? categories.find((c) => c.id === activeCategory)?.name
                        : 'الأصناف المفلترة'}
                    </h2>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      currentTheme === 'light' ? 'bg-amber-100 text-amber-800' : 'bg-slate-800 text-amber-400'
                    }`}>
                      {filteredItems.length} صنف
                    </span>
                  </div>

                  {isEditMode && (
                    <button
                      onClick={() => handleAddNewItem(activeCategory !== 'all' ? activeCategory : undefined)}
                      className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>إضافة صنف جديد +</span>
                    </button>
                  )}
                </div>

                <div className={
                  cardLayout === 'compact'
                    ? 'space-y-2.5'
                    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
                }>
                  {filteredItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      category={categories.find((c) => c.id === item.categoryId)}
                      isEditMode={isEditMode}
                      onEditItem={(itemToEdit) => {
                        setEditingItem(itemToEdit);
                        setIsEditModalOpen(true);
                      }}
                      onDeleteItem={handleDeleteItem}
                      onUpdatePrice={handleUpdatePrice}
                      onAddToCart={handleAddToCart}
                      theme={currentTheme}
                      layout={cardLayout}
                    />
                  ))}
                </div>
              </div>
            )}

          </main>
        </>
      )}

      {/* Mode 2: Multi-Column Printable Poster Board View */}
      {viewMode === 'board' && (
        <PrintMenuView
          restaurant={restaurant}
          categories={categories}
          items={items}
          isEditMode={isEditMode}
          onEditItem={(itemToEdit) => {
            setEditingItem(itemToEdit);
            setIsEditModalOpen(true);
          }}
          onUpdatePrice={handleUpdatePrice}
          onPrint={handlePrint}
        />
      )}

      {/* Mode 3: Compare with the handwritten prices photo */}
      {viewMode === 'compare' && (
        <CompareOldMenuView
          onBackToModern={() => setViewMode('modern')}
        />
      )}

      {/* Modals & Drawers */}
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={editingItem}
        categories={categories}
        defaultCategoryId={targetCatForNewItem}
        onSave={handleSaveItem}
      />

      <BulkPriceModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        categories={categories}
        items={items}
        onApplyBulkPriceChange={handleApplyBulkPriceChange}
      />

      <RestaurantSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        restaurant={restaurant}
        onSave={(updated) => {
          setRestaurant(updated);
          showToast('تم حفظ بيانات المطعم بنجاح!');
        }}
        items={items}
        categories={categories}
        onImportData={handleImportData}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        restaurant={restaurant}
      />

      <ShareMenuModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        restaurant={restaurant}
        onOpenCustomerView={() => setIsCustomerMode(true)}
      />

    </div>
  );
}
