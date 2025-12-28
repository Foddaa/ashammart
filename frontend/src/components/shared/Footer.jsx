import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Envlope, Tele } from '@/assets/icons/svgs';
import { footerIcons, FooterList } from "@/constants";
import Facebook from '@/assets/images/logos/Facebook.png';
import Instgram from '@/assets/images/logos/Instgram.png';
import Tiktok from '@/assets/images/logos/Tiktok.png';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/supplierRequest", label: "اعرض منتجاتك معنا" },
    { path: "/privacyRules", label: "سياسة الخصوصية" },
    { path: "/dileveryRules", label: "سياسة الشحن" },
    { path: "/returningAndreplacing", label: "سياسة الاستبدال والاسترجاع" },
    { path: "/whoAreWe", label: "من نحن" },
    { path: "/paymentMethods", label: "طرق وسياسة الدفع" }
  ];

  return (
    <footer className="bg-gray-50 mt-16 text-sm text-gray-600">
      <div className="flex flex-col justify-between items-center px-4 sm:px-6 md:px-10 lg:px-[100px] xl:px-[250px] py-6 text-xs text-[#71778E] gap-4">
        {/* Navigation Links */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {navItems.map(({ path, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`px-3 py-1 rounded-full transition duration-150
                ${location.pathname === path
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:text-black"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-center w-full md:w-auto">© {new Date().getFullYear()} AshamMart. جميع الحقوق محفوظة.</p>
      </div>

      {/* Feature Icons */}
      <div className="flex flex-wrap justify-center gap-6 py-6 px-4 bg-[#F7F8FD] sm:px-6 md:px-10 lg:px-[100px] xl:px-[250px] text-center">
        {footerIcons.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <item.icon className="w-5 h-5 text-blue-600" />
            <span className="text-[#202435] font-medium">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-6 md:px-10 lg:px-[100px] xl:px-[250px]">
        <hr className="border-gray-200" />
      </div>

      {/* Footer List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 py-10 px-4 bg-[#F7F8FD] sm:px-6 md:px-10 lg:px-[100px] xl:px-[250px]">
        {FooterList.map((col, idx) => (
          <div key={idx}>
            <h3 className="font-bold mb-3 text-sm text-gray-800">{col.title}</h3>
            <ul className="space-y-2 text-xs text-[#71778E]">
              {col.items.map((item, i) => (
                <li key={i} className="hover:text-gray-900 cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact and Social */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 sm:px-6 md:px-10 lg:px-[100px] xl:px-[250px] py-8 bg-white gap-6">
        <div className="flex items-start gap-3">
          <Tele className="w-8 h-8 mt-1 text-blue-600" />
          <div>
            <p className="font-bold text-lg text-gray-800">01118899959</p>
            <p className="text-xs text-[#71778E]">ساعات العمل 8:00 - 22:00</p>
          </div>
        </div>
        <div className="flex gap-4">
          <a href="https://www.facebook.com/share/1FRdki8tEW/" target="_blank" rel="noopener noreferrer">
            <img src={Facebook} alt="Facebook" className="w-9 h-9 hover:scale-110 transition-transform" />
          </a>
          <a href="https://www.instagram.com/ashammart?utm_source=qr&igsh=MXdlbDJhOWM2dmd4dA==" target="_blank" rel="noopener noreferrer">
            <img src={Instgram} alt="Instagram" className="w-9 h-9 hover:scale-110 transition-transform" />
          </a>
          <a href="https://www.tiktok.com/@ashamart7?_t=ZS-8xyYL75mxve&_r=1" target="_blank" rel="noopener noreferrer">
            <img src={Tiktok} alt="TikTok" className="w-9 h-9 hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-10 lg:px-[100px] xl:px-[250px]">
        <hr className="border-gray-200" />
      </div>

      {/* Footer Bottom Padding */}
      <div className="py-4 bg-white" />
    </footer>
  );
};

export default Footer;
