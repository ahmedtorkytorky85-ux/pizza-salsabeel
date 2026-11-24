import React, { useState, useEffect } from 'react';
import { RestaurantInfo } from '../types/menu';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Phone, 
  MessageCircle, 
  QrCode, 
  Sparkles, 
  ShoppingBag,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface ShareMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: RestaurantInfo;
  onOpenCustomerView: () => void;
}

export const ShareMenuModal: React.FC<ShareMenuModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  onOpenCustomerView
}) => {
  const [copiedType, setCopiedType] = useState<'public' | 'dev' | null>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const isCustomHostedDomain =
    origin.startsWith('http') &&
    !origin.includes('ais-dev-') &&
    !origin.includes('ais-pre-') &&
    !origin.includes('aistudio') &&
    !origin.includes('localhost');

  // Public Shared URL (automatically uses clean domain when deployed on Vercel/Netlify/custom host)
  const publicBaseUrl = isCustomHostedDomain
    ? origin
    : 'https://ais-pre-vdurahzzova44qfuc6tfrn-743744296146.europe-west2.run.app';
  const publicSharedUrl = isCustomHostedDomain
    ? publicBaseUrl
    : `${publicBaseUrl}/pizza-salsabeel`;

  // Target clean brand link once deployed on Vercel / Netlify
  const cleanBrandUrl = 'https://pizza-salsabeel.vercel.app';

  // Current browser URL / Dev URL
  const currentDevUrl =
    typeof window !== 'undefined' && origin.startsWith('http')
      ? `${origin}/pizza-salsabeel`
      : 'https://ais-dev-vdurahzzova44qfuc6tfrn-743744296146.europe-west2.run.app/pizza-salsabeel';

  const handleCopy = (url: string, type: 'public' | 'dev') => {
    navigator.clipboard.writeText(url);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 3000);
  };

  const shareText = `منيو ${restaurant.name} الرسمي أونلاين 🍕✨\nتصفح جميع الأسعار المحدثة، واحسب إجمالي فاتورة طلبك، واطلب دليفري فوراً عبر الرابط التالي:\n${publicSharedUrl}`;

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" 
      dir="rtl"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-5 text-slate-950 flex items-center justify-between shadow-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-lg text-2xl font-black">
              🔗
            </div>
            <div>
              <h2 className="text-xl font-black font-['Cairo'] flex items-center gap-1.5">
                روابط منيو العملاء والطلب المباشر
              </h2>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                مشاركة المنيو باسم المحل مع الزبائن عبر الواتساب والفيسبوك
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-right font-['Cairo']">
          
          {/* Important Explanation Box on Custom Brand Domain vs Preview Host */}
          {!isCustomHostedDomain && (
            <div className="bg-amber-500/15 border-2 border-amber-400/80 rounded-2xl p-4 space-y-3 text-xs shadow-inner">
              <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                <span className="text-lg">🌐</span>
                <span>كيف تحصل على رابط باسم المحل فقط بدون أي كلمة أخرى؟</span>
              </div>

              <div className="bg-slate-950/80 border border-emerald-500/40 rounded-xl p-3 space-y-1.5">
                <p className="text-emerald-300 font-black text-xs">
                  الرابط النظيف المقترح عند النشر المجاني على Vercel أو Netlify:
                </p>
                <div className="text-left font-mono text-xs text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700" dir="ltr">
                  {cleanBrandUrl}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  بمجرد رفع المشروع مجاناً على <span className="text-white font-bold">Vercel</span> أو <span className="text-white font-bold">Netlify</span> وتسمية المشروع <span className="font-mono text-amber-300 font-bold" dir="ltr">pizza-salsabeel</span>، سيعمل الرابط فوراً بدون اسم المنصة الحالية وبشكل دائم للعملاء (تم تجهيز ملفات النشر تلقائياً).
                </p>
              </div>

              <div className="bg-amber-400/15 border border-amber-400/40 rounded-xl p-2.5 text-amber-100 text-[11px] leading-relaxed">
                💡 <span className="font-black">ملحوظة:</span> الرابط الحالي أدناه مضاف في نهايته <span className="font-mono text-amber-300 font-bold" dir="ltr">/pizza-salsabeel</span> ومجرد تفعيله بزر <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">Share</span> يفتح مع أي عميل بدون تسجيل دخول.
              </div>
            </div>
          )}

          {/* 1. Public Shared Link (For Customers) */}
          <div className="space-y-2 bg-slate-950/90 p-4 rounded-2xl border-2 border-emerald-500/50">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <span>🌐</span>
                <span>الرابط العام المخصص لزبائن المحل:</span>
              </label>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                جاهز للإرسال للعملاء
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2">
              <input
                type="text"
                readOnly
                value={publicSharedUrl}
                className="bg-transparent flex-1 text-xs text-emerald-300 font-mono focus:outline-none px-2 select-all text-left font-bold"
                dir="ltr"
              />
              <button
                onClick={() => handleCopy(publicSharedUrl, 'public')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer shrink-0 shadow-md ${
                  copiedType === 'public'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {copiedType === 'public' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedType === 'public' ? 'تم نسخ الرابط!' : 'نسخ الرابط'}</span>
              </button>
            </div>
            {copiedType === 'public' && (
              <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1 animate-in fade-in">
                <Check size={13} />
                <span>تم نسخ الرابط العام! يمكنك الآن لصقه في محادثات الواتساب أو الفيسبوك.</span>
              </p>
            )}
          </div>

          {/* 2. Current Development Link (For You on this device) */}
          <div className="space-y-1.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>💻</span>
              <span>رابط المعاينة على جهازك الحالي:</span>
            </label>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2">
              <input
                type="text"
                readOnly
                value={currentDevUrl}
                className="bg-transparent flex-1 text-xs text-amber-300 font-mono focus:outline-none px-2 select-all text-left"
                dir="ltr"
              />
              <button
                onClick={() => handleCopy(currentDevUrl, 'dev')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer shrink-0 shadow-md ${
                  copiedType === 'dev'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {copiedType === 'dev' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedType === 'dev' ? 'تم النسخ!' : 'نسخ'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleShareWhatsApp}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 cursor-pointer"
              >
                <MessageCircle size={17} />
                <span>مشاركة الرابط على الواتساب 📲</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenCustomerView();
                }}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <Eye size={17} />
                <span>معاينة المنيو على الشاشة 👁️</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <X size={15} />
              <span>إغلاق هذه النافذة والرجوع للمنيو</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
