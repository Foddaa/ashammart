import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HeroSection() {
  // Direct URLs – browser will fetch and cache them automatically
  const sliderImages = [
    `${BASE_URL}/api/public/assets/slider/1`,
    `${BASE_URL}/api/public/assets/slider/2`,
    `${BASE_URL}/api/public/assets/slider/3`,
  ];
  const heroVideoUrl = `${BASE_URL}/api/public/assets/hero-video`;
  const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20'/%3E%3C/svg%3E`;

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-6 w-full">

      {/* First Card - Image Slider */}
      <div className="w-full aspect-[288/100] rounded-2xl overflow-hidden 
                      bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
        <Swiper
          className="w-full h-full"
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          speed={2000}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          {sliderImages.map((imgUrl, index) => (
            <SwiperSlide key={index} className="w-full h-full">
              <img
                src={imgUrl}
                alt={`hero-${index}`}
                className="w-full h-full object-contain"
                loading={index === 0 ? "eager" : "lazy"}
                onError={(e) => { e.target.src = placeholderImage; }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Second Card - Video */}
      <div className="w-full aspect-[288/100] rounded-2xl overflow-hidden 
                      bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
        <video
          className="w-full h-full object-contain"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={heroVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

    </div>
  );
}