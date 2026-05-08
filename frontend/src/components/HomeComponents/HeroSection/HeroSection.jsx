import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HeroSection() {
  const [sliderImages, setSliderImages] = useState([]);
  const [heroVideoUrl, setHeroVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // Fetch slider images (1,2,3)
        const imageUrls = [];
        for (let i = 1; i <= 3; i++) {
          const response = await fetch(`${BASE_URL}/api/public/assets/slider/${i}`);
          if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            imageUrls.push(objectUrl);
          } else {
            console.error(`Slider ${i} fetch failed:`, response.status);
            // Push a placeholder to maintain layout
            imageUrls.push(`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='288' height='100' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20'/%3E%3C/svg%3E`);
          }
        }
        setSliderImages(imageUrls);

        // Fetch hero video
        const videoResponse = await fetch(`${BASE_URL}/api/public/assets/hero-video`);
        if (videoResponse.ok) {
          const videoBlob = await videoResponse.blob();
          const videoObjectUrl = URL.createObjectURL(videoBlob);
          setHeroVideoUrl(videoObjectUrl);
        } else {
          console.error("Hero video fetch failed:", videoResponse.status);
        }
      } catch (err) {
        console.error("Failed to load hero assets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();

    // Cleanup object URLs to avoid memory leaks
    return () => {
      sliderImages.forEach(url => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      if (heroVideoUrl && heroVideoUrl.startsWith("blob:")) URL.revokeObjectURL(heroVideoUrl);
    };
  }, []);

  // Show a simple loading indicator while fetching (optional)
  if (loading) {
    return (
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 w-full">
        <div className="w-full aspect-[288/100] rounded-2xl bg-gray-200 animate-pulse" />
        <div className="w-full aspect-[288/100] rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    );
  }

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
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Second Card - Video */}
      <div className="w-full aspect-[288/100] rounded-2xl overflow-hidden 
                      bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
        {heroVideoUrl ? (
          <video
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={heroVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            فيديو غير متوفر
          </div>
        )}
      </div>

    </div>
  );
}