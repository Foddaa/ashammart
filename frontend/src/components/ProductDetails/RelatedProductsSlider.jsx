import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "@/components/shared/ProductCard";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive } from "@/constants";


export default function RelatedProductsSlider({ relatedProducts }) {
  if (!relatedProducts?.length) return null;

  return (
    <div className="mt-1 px-4  overflow-hidden text-left" dir="rtl">
      <div className="relative p-4 md:p-6">
        <Carousel
          autoPlay
          responsive={responsive}
          infinite={true}
          containerClass="carousel-container"
          itemClass="px-1"
        >
          {relatedProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} className="" />
          </SwiperSlide>
          ))}
        </Carousel>

        {/* Custom navigation buttons - positioned outside the slides */}
      </div>
    </div>
  );
} 