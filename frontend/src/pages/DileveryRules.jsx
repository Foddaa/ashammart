import React from "react";

const DileveryRules = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">سياسة الشحن</h2>
        <p className="text-sm leading-relaxed">
          تقوم <span className="font-semibold">عشم مارت</span> بشحن المنتجات إلى جميع أنحاء الجمهورية.
        </p>
        <p className="text-sm leading-relaxed mt-2">
          نرجو ملاحظة أنه لا يمكننا التوصيل إلى القرى الصغيرة أو النجوع غير المعروفة.
        </p>
        <p className="text-sm leading-relaxed mt-2">
          بعد انتهاء مدة تصنيع المنتج، قد تُضاف مدة إضافية تتراوح من <span className="font-semibold">٣ إلى ٥ أيام</span> لإتمام عملية الشحن من قبل شركة التوصيل.
        </p>
      </section>
    </div>
  );
};

export default DileveryRules;
