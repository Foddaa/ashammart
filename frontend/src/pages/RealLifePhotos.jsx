// src/pages/RealLifePhotos.jsx
import React, { useEffect, useState, useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RealLifePhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null); // index into photos, null = closed

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE_URL}/api/product/realLife`);
        if (!res.ok) throw new Error("فشل في جلب الصور");
        const data = await res.json();
        setPhotos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "حدث خطأ ما");
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const openLightbox = (index) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);

  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showNext(); // RTL: left arrow = next
      if (e.key === "ArrowRight") showPrev(); // RTL: right arrow = prev
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, showPrev, showNext]);

  const active = activeIndex !== null ? photos[activeIndex] : null;

  // Backend already returns image as "/api/uploads/real-life-photos/<file>",
  // so we only prefix with BASE_URL — no extra "/api" here.
  const imgSrc = (photo) => `${BASE_URL}${photo.image}`;

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-700 py-14 px-4 text-center mb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]"></div>
        <h1 className="relative text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          المنتجات على الطبيعة
        </h1>
        <p className="relative text-neutral-300 mt-3 text-sm md:text-base max-w-xl mx-auto">
          شاهد قطعنا كما هي فعلاً — صور حقيقية من منازل عملائنا وصالات العرض
        </p>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {loading && (
          <div className="flex justify-center py-24">
            <div className="h-10 w-10 rounded-full border-4 border-neutral-200 border-t-neutral-800 animate-spin"></div>
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-red-500 py-16">{error}</p>
        )}

        {!loading && !error && photos.length === 0 && (
          <p className="text-center text-neutral-400 py-16">لا توجد صور متاحة حالياً</p>
        )}

        {!loading && !error && photos.length > 0 && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="group relative block w-full mb-4 break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={imgSrc(photo)}
                  alt="صورة على الطبيعة"
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle hover overlay just for visual feedback, no text content */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 left-5 text-white/80 hover:text-white text-3xl leading-none z-10"
            aria-label="إغلاق"
          >
            ✕
          </button>

          {/* Prev / Next */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 px-2"
                aria-label="السابق"
              >
                ›
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 px-2"
                aria-label="التالي"
              >
                ‹
              </button>
            </>
          )}

          <div
            className="max-w-4xl w-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imgSrc(active)}
              alt="صورة على الطبيعة"
              className="max-h-[85vh] w-auto rounded-xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
