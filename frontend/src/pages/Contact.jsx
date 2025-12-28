import React from 'react';
import { MdLocationPin } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";

export default function Contact() {
  return (
    <div dir="rtl" className="text-right font-sans">
      <div className="container-head mx-auto px-4 py-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6 text-center">تواصل معنا</h1>
        <p className="mb-6 text-center max-w-2xl">
          نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في أي وقت. لا تترددوا في التواصل معنا عبر أي من وسائل الاتصال المتاحة، وسنقوم بالرد عليكم في أقرب وقت ممكن.
        </p>
      </div>

      <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto px-4 py-8 justify-items-center">
        <div className="card bg-gray-100 p-6 rounded-xl text-center shadow-sm w-full max-w-xs flex flex-col items-center justify-center">
          <span className="text-blue-400 text-3xl flex items-center justify-center h-12 w-12 mb-4">
            <MdLocationPin />
          </span>
          <h3 className="text-lg font-semibold">النزهه الجديده جسر السويس</h3>
          <p className="mt-2 text-gray-600">العنوان التفصيلي للمقر الرئيسي.</p>
        </div>

        <div className="card bg-gray-100 p-6 rounded-xl text-center shadow-sm w-full max-w-xs flex flex-col items-center justify-center">
          <span className="text-blue-400 text-3xl flex items-center justify-center h-12 w-12 mb-4">
            <FiPhoneCall />
          </span>
          <h3 className="text-lg font-semibold">01118899959</h3>
          <p className="mt-2 text-gray-600">اتصل بنا لأي استفسار أو دعم فني.</p>
        </div>

        <div className="card bg-gray-100 p-6 rounded-xl text-center shadow-sm w-full max-w-xs flex flex-col items-center justify-center">
          <span className="text-blue-400 text-3xl flex items-center justify-center h-12 w-12 mb-4">
            <MdOutlineMail />
          </span>
          <h3 className="text-lg font-semibold">ashammart@gmail.com</h3>
          <p className="mt-2 text-gray-600">راسلنا عبر البريد الإلكتروني لأي اقتراحات أو استفسارات.</p>
        </div>
      </div>
      <section className="send-us bg-white m-6 px-8 py-8 shadow-2xl">
        <div className="container text-2xl mb-2 text-center">
          <h2 className="font-bold py-2">راسلنا</h2>
          <p>
            تواصل معنا لأي أسئلة أو آراء، ويمكنك حل مشكلتك بشكل أسرع من خلال التواصل مع أحد مكاتبنا.
          </p>
        </div>
      </section>
    </div>
  );
}
  