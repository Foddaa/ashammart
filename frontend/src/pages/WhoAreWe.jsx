import React from "react";

const WhoAreWe = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">من نحن</h2>
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">عشم مارت</span> هي منصة تسوق إلكترونية توفر لك كل ما يلزم المنزل العصري بأقل الأسعار وأعلى جودة.
        </p>
        <p className="text-sm leading-relaxed mt-2">
          تشمل منتجاتنا:
        </p>
        <ul className="list-disc list-inside text-sm leading-relaxed pl-4">
          <li>الديكور المنزلي</li>
          <li>الأثاث المنزلي</li>
          <li>الأثاث الخارجي</li>
          <li>الإضاءة</li>
          <li>السجاد</li>
          <li>لوازم الشاليهات مثل:</li>
          <ul className="list-disc list-inside text-sm leading-relaxed pl-6">
            <li>المفروشات</li>
            <li>البين باج</li>
            <li>الأسِرّة الفندقية</li>
            <li>المرايات</li>
            <li>الشمسيات</li>
          </ul>
        </ul>
      </section>
    </div>
  );
};

export default WhoAreWe;
