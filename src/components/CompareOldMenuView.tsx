import React from 'react';
import { ArrowLeftRight, CheckCircle2, Sparkles, Layers, Eye } from 'lucide-react';

interface CompareOldMenuViewProps {
  onBackToModern: () => void;
}

export const CompareOldMenuView: React.FC<CompareOldMenuViewProps> = ({ onBackToModern }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Intro banner */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 mb-8 text-center sm:text-right shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Sparkles size={14} />
            <span>مقارنة وتطابق الأسعار بالكامل</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            جميع الأسعار المكتوبة بخط يدك أصبحت مضافة ومضبوطة بالكامل!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            تم تفريغ كل رقم وصنف من ورقة المنيو المكتوبة باليد إلى هذا المنيو الرقمي الحديث، مع إمكانية التعديل السريع في أي وقت، ودعم كامل للطلب والطباعة.
          </p>
        </div>

        <button
          onClick={onBackToModern}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-transform active:scale-95 shrink-0"
        >
          <Layers size={16} />
          <span>الرجوع للمنيو التفاعلي</span>
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Old Handwritten Image Card */}
        <div className="bg-slate-900/90 border-2 border-amber-500/30 rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="font-black text-white text-base">
                الصورة التي أرسلتها (الأسعار بخط اليد)
              </h3>
            </div>
            <span className="text-xs text-amber-300 font-bold bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">
              تم نقل جميع أرقامها بدقة 100%
            </span>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
              <div className="bg-slate-800/80 px-3 py-1 text-[11px] font-bold text-amber-300">
                🔍 صورة قسم الفطير المقربة (صاروخ / وسط / كبير):
              </div>
              <img
                src="/assets/aistudio/IMG_________________e22e6214.jpg"
                alt="صورة قسم الفطير المقربة بالأسعار"
                className="w-full h-auto object-contain max-h-[350px] hover:scale-102 transition-transform duration-300"
              />
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
              <div className="bg-slate-800/80 px-3 py-1 text-[11px] font-bold text-amber-300">
                🍕 صورة منيو المحل المعتمدة مع كافة التحديثات والأسعار:
              </div>
              <img
                src="/assets/aistudio/image_5dd37606.png"
                alt="فلاير بيتزا سلسبيل الأحدث"
                className="w-full h-auto object-contain max-h-[500px] hover:scale-102 transition-transform duration-300"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400 text-center font-medium">
            (تم اعتماد كافة الأسعار المدونة في هاتين الصورتين بالمللي للأحجام والأصناف)
          </p>
        </div>

        {/* New Design Highlights Card */}
        <div className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-black text-white text-base">
                المنيو الجديد المطور (تصميم فندقي حديث)
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
              أشكال وتصميمات متعددة
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-black text-white text-sm">
                  1. تفريغ جميع أسعارك بدون أي نقص
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  البيتزا (مارجريتا 75 / 95 / 125، ميكس فراخ 100 / 120 / 180)، الفطاير (وسط / كبير / صاروخ)، الكريب الحادق والحلو، المكرونات، السندوتشات، والإضافات.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-black text-white text-sm">
                  2. تصميم فاخر يكسر شكل المنيو القديم التقليدي
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  تم التخلص تماماً من شكل الورقة الحمراء القديمة ذات الأعمدة المزدحمة، واستبدالها بواجهة تفاعلية ذات ثيمات فخمة تليق بأكبر المطاعم.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-black text-white text-sm">
                  3. تعديل فوري بنقرة واحدة بنفسك
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  لو زاد أي سعر مستقبلاً، لن تحتاج لطبع منيو جديد، فقط انقر على السعر في وضع التعديل واكتب الرقم الجديد وسيحفظ فوراً!
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-black text-white text-sm">
                  4. لوحة طباعة بوستر احترافية (Print / PDF)
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  يمكنك بضغطة زر طباعة منيو ورقي عالي الجودة لعرضه في الصالة أو تعليقه على الحائط أو إرساله للزبائن في صورة ملف PDF.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-black text-white text-sm">
                  5. استلام الأوردرات مباشرة عبر الواتساب
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  الزبائن يختارون وجباتهم وأحجامها ويرسلون الطلب بحساب الفاتورة وعنوانهم إلى رقم واتساب المطعم مباشرة.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onBackToModern}
              className="w-full bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500 text-slate-950 font-black py-3 px-6 rounded-2xl shadow-xl shadow-amber-500/20 hover:opacity-95 cursor-pointer text-sm"
            >
              استعراض المنيو بالأسعار الجديدة الآن 🍕
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
