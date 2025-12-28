import React from "react";
import Whatsapp from "@/assets/images/logos/Whatsapp.png";

const FloatingWhatsApp = () => (
  <a
    href="https://wa.me/201118899959"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-18 right-5 z-50"
  >
    <img
      src={Whatsapp}
      alt="WhatsApp"
      className="w-12 h-12 rounded hover:scale-110 transition-transform drop-shadow-lg"
    />
  </a>
);

export default FloatingWhatsApp;
