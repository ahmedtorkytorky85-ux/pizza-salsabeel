import React, { useState } from 'react';
import { CartItem, RestaurantInfo } from '../types/menu';
import { X, Plus, Minus, Trash2, ShoppingBag, Send, Phone, Wallet, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  restaurant: RestaurantInfo;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  restaurant
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedCash, setCopiedCash] = useState(false);

  const handleCopyCash = () => {
    navigator.clipboard?.writeText('01094450011');
    setCopiedCash(true);
    setTimeout(() => setCopiedCash(false), 2000);
  };

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    // Format Arabic WhatsApp message
    let message = `*طلب جديد من منيو ${restaurant.name}* 🍕\n\n`;
    if (customerName) message += `👤 *اسم العميل:* ${customerName}\n`;
    if (customerPhone) message += `📱 *رقم الهاتف:* ${customerPhone}\n`;
    if (customerAddress) message += `📍 *عنوان التوصيل:* ${customerAddress}\n\n`;

    message += `📋 *تفاصيل الطلب:*\n`;
    message += `------------------------\n`;
    cart.forEach((item, index) => {
      message += item.variantLabel
        ? `${index + 1}. *${item.name}* (${item.variantLabel})\n`
        : `${index + 1}. *${item.name}*\n`;
      message += `   العدد: ${item.quantity} × ${item.price} ج.م = ${item.quantity * item.price} ج.م\n`;
    });
    message += `------------------------\n`;
    message += `💰 *الإجمالي النهائي:* ${totalAmount} جنيه مصري\n`;
    if (notes) message += `📝 *ملاحظات خاصة:* ${notes}\n`;
    message += `\nشكراً لكم ونتمنى لكم وجبة شهية! ✨`;

    const encoded = encodeURIComponent(message);
    const cleanNumber = restaurant.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-slate-900 border-r border-amber-500/30 shadow-2xl flex flex-col justify-between text-right">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="font-black text-lg text-white">سلة الطلبات</h2>
                <p className="text-xs text-slate-400">
                  {cart.length === 0 ? 'السلة فارغة حالياً' : `${cart.length} أصناف في طلبك`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="text-5xl mb-3">🛒</div>
                <p className="font-bold text-white text-base">سلة طلباتك فارغة</p>
                <p className="text-xs mt-1">تصفح المنيو واختر وجباتك المفضلة وأضفها للسلة</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
                  <span className="font-bold text-slate-300">الأصناف المختارة:</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-400 hover:text-red-300 font-medium cursor-pointer"
                  >
                    تفريغ السلة
                  </button>
                </div>

                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.variantLabel && (
                            <span className="text-[11px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded-md font-bold">
                              {item.variantLabel}
                            </span>
                          )}
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {item.price} ج.م
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.cartId, -1)}
                            className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-2 text-xs font-bold font-mono text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartId, 1)}
                            className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.cartId)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-900 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout with WhatsApp */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/95 space-y-3">
              {/* Order Type Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <span className="block text-[11px] font-bold text-slate-400 mb-1.5">طريقة الاستلام:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNotes(prev => prev.replace(' (استلام من المحل)', '') + ' (توصيل دليفري)')}
                    className="p-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>🛵 توصيل دليفري</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotes(prev => prev.replace(' (توصيل دليفري)', '') + ' (استلام من المحل)')}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:border-amber-400"
                  >
                    <span>🏪 استلام من المطعم</span>
                  </button>
                </div>
              </div>

              {/* Customer Info Form */}
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="اسم العميل"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-['Cairo']"
                  />
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="رقم الهاتف للتواصل"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-400 font-mono text-right focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <input
                  type="text"
                  placeholder="عنوان التوصيل بالتفصيل (إيتاي البارود - الشارع - رقم العمارة)"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-['Cairo']"
                />

                <input
                  type="text"
                  placeholder="ملاحظات الطلب (بدون بصل، شطة زيادة، إلخ...)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-['Cairo']"
                />
              </div>

              {/* Total Bill Calculation Box */}
              <div className="p-3 rounded-2xl bg-slate-900/90 border-2 border-emerald-500/40 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>عدد الوجبات والأصناف:</span>
                  <span className="font-mono font-bold text-white">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} صنف
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-black text-sm text-amber-300">
                      إجمالي الفاتورة والحساب:
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (الأسعار رسمية ومحدثة من المطعم)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 text-emerald-400">
                    <span className="text-3xl font-black font-mono tracking-tight">
                      {totalAmount}
                    </span>
                    <span className="text-xs font-black text-amber-300">
                      ج.م
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Phone Ordering Section - As explicitly requested */}
              <div className="space-y-1.5 pt-1">
                <span className="block text-[11px] font-bold text-amber-400 text-center">
                  📞 للطلب مباشرة عبر الاتصال الهاتفي:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:01159001520"
                    className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-400/60 text-amber-300 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <Phone size={13} className="text-emerald-400" />
                    <span dir="ltr">01159001520</span>
                  </a>
                  <div className="rounded-xl bg-slate-900 border border-red-400/60 p-1.5 flex flex-col items-center justify-center gap-1 shadow-sm">
                    <a
                      href="tel:01094450011"
                      className="text-amber-300 hover:text-amber-200 font-black text-xs flex items-center justify-center gap-1.5"
                    >
                      <Phone size={12} className="text-emerald-400" />
                      <span dir="ltr">01094450011</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyCash}
                      className="w-full bg-red-700 hover:bg-red-600 text-white rounded-lg px-2 py-0.5 text-[10px] font-black flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="اضغط لنسخ رقم فودافون كاش"
                    >
                      <Wallet size={10} className="text-amber-300" />
                      <span>{copiedCash ? 'تم نسخ الرقم' : 'فودافون كاش (نسخ)'}</span>
                      {copiedCash ? <Check size={10} className="text-emerald-300" /> : <Copy size={10} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Order Button */}
              <button
                onClick={handleSendWhatsAppOrder}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-transform active:scale-95 cursor-pointer"
              >
                <Send size={16} />
                <span>إرسال الفاتورة والطلب عبر الواتساب فوراً 📲</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
