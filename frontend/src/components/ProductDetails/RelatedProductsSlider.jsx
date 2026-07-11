import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "@/components/shared/ProductCard";

export default function RelatedProductsSlider({ relatedProducts }) {
  if (!relatedProducts?.length) return null;

  return (
    <div className="mt-14 px-4 py-6 overflow-hidden text-right" dir="rtl">
      {/* Heading with gradient line - matches product details style */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 shrink-0">
          منتجات مشابهة
        </h2>
        <div className="flex-1 h-0.5 bg-gradient-to-l from-blue-200 to-transparent" />
      </div>

      {/* Swiper with subtle card background */}
      <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-inner">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={24}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 1.5, spaceBetween: 20 },
            640: { slidesPerView: 2, spaceBetween: 24 },
            768: { slidesPerView: 3, spaceBetween: 28 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="relative py-2"
        >
          {relatedProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} className="hover:shadow-xl transition-shadow" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom navigation buttons - positioned outside the slides */}
        <button
          className="swiper-button-next-custom absolute top-1/2 -right-4 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition border border-gray-200 hover:border-blue-300 focus:outline-none"
          aria-label="التالي"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="swiper-button-prev-custom absolute top-1/2 -left-4 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition border border-gray-200 hover:border-blue-300 focus:outline-none"
          aria-label="السابق"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
} 