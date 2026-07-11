import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import {
  getProductImageUrl,
  getDisplayCanceledPrice,
  getTruncatedDescription,
  PLACEHOLDER_IMAGE,
} from "@/utils/productDisplay";

export default function ProductCard({ product, className = "" }) {
  const navigate = useNavigate();

  if (!product) return null;

  const imageUrl = getProductImageUrl(product);
  const canceledPrice = getDisplayCanceledPrice(product);

  // Navigate to product details on card click
  const handleCardClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Buy Now handler – stops propagation to prevent card navigation
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
    freeDelivery: product.freeDelivery, // <-- add this
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
      onClick={handleCardClick}
      className={`flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-square w-full flex justify-center items-center bg-gray-50">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover p-1"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
        {/* Free delivery badge */}
        {product.freeDelivery && (
          <span className="absolute top-3 right-2 z-10 flex items-center gap-2 bg-white/90 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full border-2 border-red-500 shadow-md backdrop-blur-sm">
            ⚡ توصيل مجاني
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-3 text-right flex-grow flex flex-col">
        <h3 className="font-semibold text-sm text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {getTruncatedDescription(product.description)}
        </p>
        <span className="text-xs text-blue-600 mt-1 block">تصميم مخصص</span>

        {/* Rating */}
        <div className="flex items-center gap-2 justify-start mt-2">
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

        {/* Bottom section: price + Buy Now button, pushed to bottom */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="p-2">
            <p className="text-black-600 font-bold">
              ج.م {product.price}
              <span className="mr-2 text-gray-500 line-through text-base font-normal">
                ج.م {canceledPrice.toFixed(2)}
              </span>
            </p>
          </div>

          <button
            onClick={handleBuyNow}
            className="w-full py-2 flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            اشتر الآن
          </button>
        </div>
      </div>
    </div>
  );
}