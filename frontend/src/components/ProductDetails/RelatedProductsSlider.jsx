import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContext } from "react";
import { UserContext } from "@/Context/AuthContext";
import Rating from "@mui/material/Rating";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RelatedProductsSlider({ relatedProducts }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { Token, setToken } = useContext(UserContext);

  if (!relatedProducts?.length) return null;

  function productPopUp(product) {
    navigate(`/product/${product.id}`, { state: { product } });
  }

  return (
    <div className="mt-14 px-4 py-6 overflow-hidden text-right" dir="rtl">
      <h2 className="text-2xl font-bold leading-8 mb-4 text-green-700">منتجات مشابهة</h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          480: { slidesPerView: 1.5 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="relative py-4 overflow-hidden"
      >
        {relatedProducts.map((product) => {
          const imageUrl =
            product.images?.[0]?.url
              ? `${BASE_URL}/api${product.images[0].url}`
              : "/placeholder.png";

          const displayCanceledPrice =
            !product.canceledPrice || product.canceledPrice <= product.price
              ? Math.round(product.price * 1.12)
              : product.canceledPrice;

          return (
            <SwiperSlide key={product.id}>
              <div
                onClick={() => productPopUp(product)}
                className="flex flex-col border border-gray-300 rounded-lg overflow-hidden shadow-sm cursor-pointer h-full"
              >
                <div className="aspect-square w-full flex justify-center items-center bg-gray-100">
                  <img
                    src={imageUrl}
                    className="w-full h-full object-cover p-1"
                    alt={product.name}
                    loading="lazy"
                  />
                </div>

                <div className="p-3 text-right">
                  <h3 className="font-semibold text-sm text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {product.description?.length > 30
                      ? `${product.description.substring(0, 30)}...`
                      : product.description}
                  </p>
                  <span className="text-xs text-green-700 mt-1 block">
                    تصميم خاص
                  </span>
                  <div className="p-2 border-t border-gray-200">
                    <p className="text-black-600 font-bold mb-2">
                      {product.price} جنيه
                      <span className="mr-2 text-gray-500 line-through text-base font-normal">
                        {displayCanceledPrice.toFixed(2)} جنيه
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Rating
                      name="read-only"
                      value={product.averageRating || 0}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                    <span className="text-xs text-gray-600">
                      ({product.averageRating?.toFixed(1) || "0.0"})
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
