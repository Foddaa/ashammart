import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { addFavorite, removeFavorite, checkFavorite } from "@/services/favoriteService";
import { getAccessToken } from "@/api/axiosInstance";
import {
  getProductImageUrl,
  getDisplayCanceledPrice,
  getDiscountPercentage,
  PLACEHOLDER_IMAGE,
} from "@/utils/productDisplay";
import { useBuyNow } from '@/context/BuyNowContext';

export default function ProductCard({ product, className = "" }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { openBuyNow } = useBuyNow();

  // Extract unique colors from product.variants
  const availableColors = useMemo(() => {
    if (!product?.variants) return [];
    const colorMap = new Map();
    product.variants.forEach((variant) => {
      if (!colorMap.has(variant.colorId)) {
        colorMap.set(variant.colorId, {
          id: variant.colorId,
          name: variant.colorName,
          hex: variant.colorHex,
        });
      }
    });
    return Array.from(colorMap.values());
  }, [product]);

  useEffect(() => {
    if (!product?.id || !getAccessToken()) return;
    let cancelled = false;

    checkFavorite(product.id)
      .then((res) => {
        if (!cancelled) setIsFavorite(res.data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [product?.id]);

  if (!product) return null;

  const imageUrl = getProductImageUrl(product);
  const canceledPrice = getDisplayCanceledPrice(product);
  const discount = getDiscountPercentage(product);
  const hasDiscount = discount > 0;

  const formatPrice = (value) => {
    if (value == null || isNaN(value)) return "0";
    return Math.trunc(value).toLocaleString("en-US");
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    openBuyNow(product);
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (isSaving) return;

    if (!getAccessToken()) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }

    const next = !isFavorite;
    setIsFavorite(next);
    setIsSaving(true);

    try {
      if (next) {
        await addFavorite(product.id);
      } else {
        await removeFavorite(product.id);
      }
    } catch (err) {
      setIsFavorite(!next);
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: `/product/${product.id}` } });
      }
      console.error("Failed to update favorite:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      dir="ltr"
      onClick={handleCardClick}
      className={`flex flex-col h-full overflow-hidden cursor-pointer duration-200 ${className}`}
    >
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

        <button
          onClick={toggleFavorite}
          disabled={isSaving}
          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Toggle favorite"
          aria-pressed={isFavorite}
        >
          {isFavorite ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="p-1 text-left flex-grow flex flex-col">
        <h3 className="text-sm font-light tracking-wide text-neutral-900 leading-tight line-clamp-1">
          {product.name}
        </h3>

        <div>
          <div className="px-0 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span className="text-sm text-neutral-900 font-medium">
                EGP {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(canceledPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 shrink-0">
              <span className="font-semibold text-xs text-gray-900">
                {(product.averageRating || 0).toFixed(1)}
              </span>
              <span className="text-amber-400 text-[10px]">★</span>
            </div>
          </div>

          {/* ---- SMALL COLOR INFO ---- */}
          {availableColors.length > 0 && (
            <div className="flex gap-1 mt-2">
              {availableColors.map((c) => (
                <div
                  key={c.id}
                  className="w-4 h-4 border border-neutral-300"
                  style={{ backgroundColor: c.hex || "#cccccc" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* mt-auto ensures the button always stays at the bottom of the card */}
        <div className="mt-auto pt-2">
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