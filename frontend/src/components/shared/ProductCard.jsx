import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import {
  getProductImageUrl,
  getDisplayCanceledPrice,
  getTruncatedDescription,
  getDiscountPercentage,
  PLACEHOLDER_IMAGE,
} from "@/utils/productDisplay";

export default function ProductCard({ product, className = "" }) {
  const navigate = useNavigate();

  if (!product) return null;

  const imageUrl = getProductImageUrl(product);
  const canceledPrice = getDisplayCanceledPrice(product);
  const discount = getDiscountPercentage(product);
  const hasDiscount = discount > 0;

  // Format numbers with commas
  const formatPrice = (value) => {
    if (value == null || isNaN(value)) return "0";
    return Math.trunc(value).toLocaleString("en-US");
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();

    const orderItem = {
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      code: product.code,
      canceledPrice: product.canceledPrice,
      images: product.images,
      quantity: 1,
      comment: "",
      freeDelivery: product.freeDelivery,
    };

    navigate("/review-order", {
      state: {
        buyNow: true,
        directProduct: orderItem,
        subtotal: product.price,
        quantity: 1,
        comment: "",
      },
    });
  };

  return (
    <div
      dir="ltr"
      onClick={handleCardClick}
      className={`flex flex-col h-full  overflow-hidden cursor-pointer  duration-200  ${className}`}
    >
      {/* Image section with badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden shrink-0 bg-gray-50">
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />

        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 text-[#d32f2f] text-sm font-semibold px-3 py-0.5">
            -{discount}%
          </span>
        )}

        {/* {product.freeDelivery && (
          <span className="absolute top-2 right-2 z-10 bg-white flex items-center gap-1 text-[#d32f2f] text-sm font-semibold px-3 py-0.5 rounded-full border-2 border-red-500 shadow-md backdrop-blur-sm">
            ⚡ free delivery
          </span>
        )} */}
      </div>

      {/* Details */}
      <div className="p-1 text-left flex-grow flex flex-col">
        <p className="text-sm truncate">
          {product.name}
        </p>
        <p className="text-xs truncate">
          {product.description || ""}
        </p>

        <div>
          <div className="px-0 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span
                className={`text-base whitespace-nowrap text-sm tabular-nums ${
                  hasDiscount ? "text-red-600" : "text-black"
                }`}
              >
                EGP {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-black line-through text-sm font-normal whitespace-nowrap tabular-nums">
                  {formatPrice(canceledPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5  px-2.5 py-1 shrink-0">
              <span className="font-semibold text-xs text-gray-900">
                {(product.averageRating || 0).toFixed(1)}
              </span>
              <span className="text-amber-400 text-[10px]">★</span>
            </div>
          </div>

          <button
            onClick={handleBuyNow}
            className="w-full py-2 border text-black text-sm hover:bg-gray-50 transition-colors duration-200"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}