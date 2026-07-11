import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import "./BestSellers.css"
import Heading from "@/components/shared/Heading";
import { responsive } from "@/constants";
import actionMostRated from "@/store/BestSeller/thunk/actionMostRated";
import ProductCard from "@/components/shared/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MostRated() {
  const sliderImages = [
    `${BASE_URL}/api/public/assets/most-rated/1`,
    `${BASE_URL}/api/public/assets/most-rated/2`,
    `${BASE_URL}/api/public/assets/most-rated/3`,
  ];
  const { products, error } = useSelector(state => state.mostRated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionMostRated());
  }, [dispatch]);

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20'/%3E%3C/svg%3E";

  if (error) {
    return <div className="text-red-400 text-3xl">{error}</div>;
  }

  return (
    <div>
      <div className="py-5">
        <div className="flex justify-between mb-5">
          <Heading
            header={"الاعلي تقيِما"}
            text={"منتجات نالت أعلى تقييمات وثقة المستخدمين."}
          />
        </div>

        {!Array.isArray(products) || products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            لا يوجد منتجات
          </div>
        ) : (
          <Carousel
            autoPlay
            responsive={responsive}
            infinite={true}
            containerClass="carousel-container"
            itemClass="px-1"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Carousel>
        )}

        {/* Advertisement section */}
               <div className="w-full aspect-[288/100] rounded-2xl overflow-hidden
                        bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 mt-8">
          <Swiper
            className="w-full h-full"
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            speed={1000}
            loop={true}
            autoplay={{
              delay: 1000,
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
      </div>
    </div>
  );
}

export default MostRated;