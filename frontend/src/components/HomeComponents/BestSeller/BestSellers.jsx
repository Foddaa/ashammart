import { useEffect, useState } from "react";
// import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSeller } from "@/store/BestSeller/bestsellerslice";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import "./BestSellers.css"
import Heading from "@/components/shared/Heading";
import { responsive } from "@/constants";
import ViewAll from "@/components/shared/ViewAll";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BestSellers() {
  const { products, error } = useSelector(state => state.bestSeller);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bestSellerHeroUrl, setBestSellerHeroUrl] = useState(null);

  // Fetch dynamic best seller hero image (ad5.webp) from public endpoint
  useEffect(() => {
    const fetchBestSellerHero = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/public/assets/best-seller`);
        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setBestSellerHeroUrl(objectUrl);
        } else {
          console.error("Best seller hero fetch failed:", response.status);
        }
      } catch (err) {
        console.error("Failed to load best seller hero:", err);
      }
    };
    fetchBestSellerHero();

    // Cleanup object URL on unmount
    return () => {
      if (bestSellerHeroUrl && bestSellerHeroUrl.startsWith("blob:")) {
        URL.revokeObjectURL(bestSellerHeroUrl);
      }
    };
  }, []);

  function productPopUp(product) {
    navigate(`/product/${product.id}`, { state: { product } });
  }

  useEffect(() => {
    dispatch(fetchBestSeller());
  }, [dispatch]);

  if (error) {
    return (
      <div className="text-red-400 text-3xl">
        {error}
      </div>
    );
  }

  // Fallback placeholder SVG (transparent gray square)
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20'/%3E%3C/svg%3E";

  return (
    <div>
      <div className="py-5">
        <div className="flex justify-between mb-5">
          <Heading 
            header={"الأكثر مبيعًا"} 
            text={"الأكثر طلبًا من عملائنا، جودة وتجربة مضمونة."}
          />
          {/* <ViewAll /> */}
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
            {products.map((e) => (
              <div
                key={e.id}
                className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm w-full mx-1"
              >
                <div className="aspect-square w-full flex justify-center items-center bg-gray-50">
                  <img
                    src={e.images[0]?.url ? `${BASE_URL}/api${e.images[0].url}` : placeholderImage}
                    alt={e.name}
                    className="w-full h-full object-cover p-1 cursor-pointer"
                    loading="lazy"
                    onClick={() => productPopUp(e)}
                  />
                </div>

                {/* Product Info */}
                <div className="p-2">
                  <h3 className="font-semibold text-sm text-gray-800 truncate">
                    {e.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {e.description.length > 30
                      ? e.description.substring(0, 30) + "..."
                      : e.description}
                  </p>
                  <span className="text-xs text-blue-600 mt-1 block">
                    تصميم حسب الطلب
                  </span>
                </div>
                <div className="flex items-center mt-0.5 mb-0.5 px-2">
                  <Rating
                    name="read-only"
                    value={e.averageRating || 0}
                    readOnly
                    precision={0.5}
                    size="small"
                  />
                  <span className="text-xs text-gray-600 ml-1">
                    ({e.averageRating?.toFixed(1) || '0.0'})
                  </span>
                </div>

                <div className="p-3 border-t border-gray-100">
                  <p className="text-black-600 font-bold mb-2">
                    <span className="text-gray-500 line-through text-base font-normal mr-2">
                      {e.canceledPrice
                        ? `${e.canceledPrice.toFixed(2)}`
                        : `${(e.price * 1.12).toFixed(2)}`}
                    </span>
                    <span className="text-black-600 font-bold">
                      {e.price} جنيه
                    </span>
                  </p>
                  {/* <button ... > Add to Cart </button> */}
                </div>
              </div>
            ))}
          </Carousel>
        )}

        {/* Advertisement section – now using dynamic hero image */}
        <div className="flex justify-center items-center mt-10 px-4">
          <div className="w-full max-w-7xl aspect-[48/9] rounded-xl shadow-md overflow-hidden">
            <img
              src={bestSellerHeroUrl || placeholderImage}
              alt="Advertisement"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestSellers; 