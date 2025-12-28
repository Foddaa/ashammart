import React from "react";

const PrivacyRules = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">سياسة الخصوصية</h2>
        <p className="text-sm leading-relaxed">
          نحن في <span className="font-semibold">عشم مارت</span> نحرص دائمًا على خصوصية عملائنا. لا نقوم بمشاركة أي معلومات
          شخصية مثل أرقام الهواتف، العنوان، أو البريد الإلكتروني مع أي جهة خارجية.
        </p>
        <p className="text-sm leading-relaxed mt-2">
          تُستخدم بياناتك فقط لتسهيل عملية التوصيل وضمان وصول الطلبات إليك بطريقة سهلة وآمنة. نحن نلتزم بحماية بياناتك
          وعدم استخدامها لأي أغراض أخرى.
        </p>
      </section>
    </div>
  );
};

export default PrivacyRules;
