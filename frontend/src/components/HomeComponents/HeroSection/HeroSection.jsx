import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import heroVideo from "@/assets/videos/HeroSectionVedio.mp4";
import img1 from "@/assets/images/HeroImg1.webp";
import img2 from "@/assets/images/HeroImg2.webp";
import img3 from "@/assets/images/HeroImg3.webp";
import  { Autoplay }  from "swiper/modules";
export const ImgUrl = [
  { img: img1 },
  { img: img2 },
  { img: img3 },
];
export default function HeroSection() {
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-6 w-full">

      {/* 🔁 First Card - Image Slider */}
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
          delay: 3000,       // 3000ms = 3 seconds per slide
          disableOnInteraction: false, // keeps autoplay after user interacts
        }}
        >
          {ImgUrl.map((item, index) => (
            <SwiperSlide key={index} className="w-full h-full">
              <img
                src={item.img}
                alt={`hero-${index}`}
                className="w-full h-full object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

      {/* 🎥 Second Card - Video */}
      <div className="w-full aspect-[288/100] rounded-2xl overflow-hidden 
                      bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
        
        <video
          className="w-full h-full object-contain"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      </div>

    </div>
  );
}