import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { useEffect, useState, useRef, useContext, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import { UserContext } from "@/context/AuthContext";
import ImageGallery from "@/components/ProductDetails/ImageGallery";
import QuantityControls from "@/components/ProductDetails/QuantityControls";
import RelatedProductsSlider from "@/components/ProductDetails/RelatedProductsSlider";
import { addToCart, triggerCartUpdate } from "@/components/shared/cartService";
import { addFavorite, removeFavorite, checkFavorite } from "@/services/favoriteService";
import { getDiscountPercentage } from "@/utils/productDisplay";
import { useBuyNow } from '@/context/BuyNowContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ProductDetails() {
  useEffect(() => {
    const background = document.getElementById("background");
    if (background) background.style.display = "none";
    return () => {
      if (background) background.style.display = "";
    };
  }, []);
  
  const { openBuyNow } = useBuyNow();
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { Token: contextToken, setToken } = useContext(UserContext);
  const { id } = useParams();
  const passedProductId = id || null;

  // ---- Real variant selection state ----
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // 👇 Prevent duplicate favorite checks / retry loops
  const favoriteCheckedForRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const local = localStorage.getItem("token");
    const next = contextToken || local;
    // 👇 Only update if actually different – prevents context churn / re-render loop
    if (next && next !== contextToken) {
      setToken(next);
    }
  }, [contextToken, id]);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantityToAdd, setQuantityToAdd] = useState(location.state?.quantityToAdd || 1);
  const [comment, setComment] = useState(location.state?.comment || "");
  const [loading, setLoading] = useState(true);
  const hasAddedToCart = useRef(false);
  const discount = getDiscountPercentage(product);

  // Favorite state
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteSaving, setIsFavoriteSaving] = useState(false);

  const displayImages = useMemo(() => {
    if (!product?.images) return [];
    if (!selectedColorId) return product.images;

    const colorImages = product.images.filter(img => img.color?.id === selectedColorId);
    const otherImages = product.images.filter(img => img.color?.id !== selectedColorId);
    return [...colorImages, ...otherImages];
  }, [product?.images, selectedColorId]);

  useEffect(() => {
    if (!product?.images || product.images.length === 0) return;
    if (selectedColorId) {
      const firstColorImage = product.images.find(img => img.color?.id === selectedColorId);
      if (firstColorImage) {
        setMainImage(firstColorImage.url);
      } else {
        setMainImage(product.images[0].url);
      }
    } else {
      setMainImage(product.images[0].url);
    }
  }, [selectedColorId, product?.images]);
  
  // Fetch product
  useEffect(() => {
    if (passedProductId) {
      setLoading(true);
      fetch(`${BASE_URL}/api/product/byId?id=${passedProductId}`)
        .then((res) => res.json())
        .then((data) => {
          const fixedImages = data.images.map((img) => ({
            ...img,
            url: img.url.startsWith("http")
              ? img.url
              : `${BASE_URL}/api${img.url}`,
          }));
          data.images = fixedImages;
          setProduct(data);

          // Set default selections: first variant with available stock, or first variant
          if (data.variants && data.variants.length > 0) {
            const inStock = data.variants.find(v => v.quantity > 0 && v.status === "AVAILABLE");
            const defaultVariant = inStock || data.variants[0];
            setSelectedColorId(defaultVariant.colorId);
            setSelectedSizeId(defaultVariant.sizeId);
            setSelectedVariant(defaultVariant);
          }
        })
        .catch((err) => {
          console.error("Error loading product:", err);
          toast.error("Error loading product");
        })
        .finally(() => setLoading(false));
    }
  }, [passedProductId]);

  // Set main image
  useEffect(() => {
    if (product?.images?.length) {
      setMainImage(product.images[0].url);
    } else {
      setMainImage("");
    }
  }, [product]);

  // Update selected variant when color or size changes
  useEffect(() => {
    if (!product?.variants) return;
    if (selectedColorId !== null && selectedSizeId !== null) {
      const match = product.variants.find(
        v => v.colorId === selectedColorId && v.sizeId === selectedSizeId
      );
      setSelectedVariant(match || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColorId, selectedSizeId, product]);

  // Check favorite status
  useEffect(() => {
    if (!product?.id || !contextToken) {
      setIsFavorite(false);
      return;
    }

    // 👇 Only check once per product. Prevents infinite 401/refresh loop.
    if (favoriteCheckedForRef.current === product.id) return;
    favoriteCheckedForRef.current = product.id;

    let cancelled = false;
    checkFavorite(product.id)
      .then((res) => {
        if (!cancelled) setIsFavorite(res.data);
      })
      .catch((err) => {
        // 401s are expected for expired tokens; don't retry or toast.
        if (err.response?.status !== 401) {
          console.error("Failed to check favorite status:", err);
        }
      });
    return () => { cancelled = true; };
  }, [product?.id, contextToken]);

  // Auto add to cart & Fetch related
  useEffect(() => {
    if (location.state?.autoAddToCart && !hasAddedToCart.current) {
      hasAddedToCart.current = true;
      navigate(location.pathname, {
        state: { ...location.state, autoAddToCart: undefined },
        replace: true,
      });
    }

    if (product?.categoryId) {
      fetch(
        `${BASE_URL}/api/product/byCategory?categoryId=${product.categoryId}&page=1&limit=8`
      )
        .then((res) => res.json())
        .then((data) => {
          const related = (data.products || []).filter((p) => p.id !== product.id);
          setRelatedProducts(related);
        })
        .catch((err) => console.error("Failed to load related", err));
    }
  }, [product, location.state, navigate]);

  // ---- Compute unique colors & sizes from variants ----
  const availableColors = product?.variants
    ? product.variants
        .filter((v, i, self) => self.findIndex(t => t.colorId === v.colorId) === i)
        .map(v => ({ id: v.colorId, name: v.colorName, hex: v.colorHex }))
    : [];

  const availableSizes = product?.variants
    ? product.variants
        .filter((v, i, self) => self.findIndex(t => t.sizeId === v.sizeId) === i)
        .map(v => ({ id: v.sizeId, name: v.sizeName }))
        .sort((a, b) => a.id - b.id)
    : [];

  // ---- Handlers ----
  const handleColorSelect = (colorId) => {
    setSelectedColorId(colorId);
    // Reset size selection if current size not available for this color
    if (selectedSizeId !== null) {
      const stillAvailable = product.variants.some(
        v => v.colorId === colorId && v.sizeId === selectedSizeId
      );
      if (!stillAvailable) {
        const firstAvailable = product.variants.find(v => v.colorId === colorId);
        setSelectedSizeId(firstAvailable ? firstAvailable.sizeId : null);
      }
    }
  };

  const handleSizeSelect = (sizeId) => {
    setSelectedSizeId(sizeId);
    if (selectedColorId !== null) {
      const stillAvailable = product.variants.some(
        v => v.sizeId === sizeId && v.colorId === selectedColorId
      );
      if (!stillAvailable) {
        const firstAvailable = product.variants.find(v => v.sizeId === sizeId);
        setSelectedColorId(firstAvailable ? firstAvailable.colorId : null);
      }
    }
  };

  // ---- Add to Cart ----
const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.warning("Please select a color and size combination.");
      return;
    }
    if (selectedVariant.quantity < quantityToAdd) {
      toast.error(`Only ${selectedVariant.quantity} items in stock.`);
      return;
    }
    // Updated call: pass the product and the selected variant
    addToCart(product, selectedVariant, quantityToAdd);
    toast.success("Product added to cart 🛒");
};

  // ---- Buy Now ----
  const handleBuyNow = () => {
    if (!selectedVariant && product.variants?.length > 0) {
      toast.warning("Please select a color and size combination.");
      return;
    }
    // If no variants, use product itself as the variant
    const variant = selectedVariant || { 
      id: product.id, 
      price: product.price, 
      canceledPrice: product.canceledPrice, 
      quantity: 999, 
      colorName: null, 
      sizeName: null 
    };
    if (variant.quantity < quantityToAdd) {
      toast.error(`Only ${variant.quantity} items in stock.`);
      return;
    }

    const orderItem = {
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      price: variant.price ?? product.price,
      canceledPrice: variant.canceledPrice ?? product.canceledPrice,
      images: product.images,
      quantity: quantityToAdd,
      comment: comment,
      freeDelivery: product.freeDelivery,
      color: variant.colorName,
      size: variant.sizeName,
    };

    navigate("/review-order", {
      state: {
        buyNow: true,
        directProduct: orderItem,
        subtotal: (variant.price ?? product.price) * quantityToAdd,
        quantity: quantityToAdd,
        comment: comment,
      },
    });
  };

  // ---- Favorite toggle ----
  const handleToggleFavorite = async () => {
    if (!contextToken) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    if (!product || isFavoriteSaving) return;
    const next = !isFavorite;
    setIsFavorite(next);
    setIsFavoriteSaving(true);
    try {
      if (next) {
        await addFavorite(product.id);
        toast.success("Added to favorites");
      } else {
        await removeFavorite(product.id);
        toast.success("Removed from favorites");
      }
    } catch (err) {
      setIsFavorite(!next);
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: `/product/${product.id}` } });
      } else {
        toast.error("Failed to update favorites");
      }
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsFavoriteSaving(false);
    }
  };

  // Loading skeleton
  if (loading)
    return (
      <div className="w-full min-h-screen bg-white p-8 md:p-12" dir="ltr">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="h-[600px] bg-neutral-100" />
          <div className="space-y-6">
            <div className="h-10 bg-neutral-100 w-3/4" />
            <div className="h-6 bg-neutral-100 w-1/2" />
            <div className="h-8 bg-neutral-100 w-1/3" />
            <div className="space-y-3">
              <div className="h-4 bg-neutral-100" />
              <div className="h-4 bg-neutral-100 w-5/6" />
            </div>
            <div className="h-12 bg-neutral-100" />
            <div className="h-12 bg-neutral-100 border border-neutral-100" />
          </div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20 text-neutral-600 text-xl" dir="ltr">
        Product not found
      </div>
    );

  // ---- Determine effective price and stock ----
  const effectivePrice = selectedVariant?.price ?? product.price;
  const effectiveCanceled = selectedVariant?.canceledPrice ?? product.canceledPrice;
  const stock = selectedVariant?.quantity ?? 0;
  const isInStock = stock > 0 && selectedVariant?.status === "AVAILABLE";

  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Gallery */}
          <div className="p-3 md:p-0 lg:sticky self-start">
            <ImageGallery
              images={displayImages}
              mainImage={mainImage}
              setMainImage={setMainImage}
              title={product.name}
            />
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col space-y-6 text-left">
            {/* Brand & Title */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
                  {product.supplierCode}
                </p>
                <h1 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight text-neutral-900">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={handleToggleFavorite}
                disabled={isFavoriteSaving}
                className="shrink-0 w-11 h-11 flex items-center justify-center border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                aria-label="Toggle favorite"
                aria-pressed={isFavorite}
              >
                {isFavorite ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                )}
              </button>
            </div>

            {/* Ratings & Sold */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <Rating
                  name="read-only"
                  value={product.averageRating || 0}
                  readOnly
                  precision={0.5}
                  size="small"
                  className="text-neutral-800"
                />
                <span className="text-sm font-normal text-neutral-700">
                  {product.averageRating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <span className="text-neutral-300 text-sm">|</span>
              <span className="text-sm text-neutral-500">
                {product.quantitySailed} Sold
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-normal text-neutral-900 tracking-tight">
                EGP {effectivePrice}
              </span>
              {effectiveCanceled && effectiveCanceled > effectivePrice && (
                <span className="text-sm text-neutral-400 line-through">
                  EGP {effectiveCanceled}
                </span>
              )}
              {effectiveCanceled && effectiveCanceled > effectivePrice && (
                <span className="text-[#d32f2f] text-sm font-semibold">
                  -{Math.round((1 - effectivePrice / effectiveCanceled) * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-neutral-100">
              <h3 className="text-sm uppercase tracking-widest text-neutral-800 mb-2 font-medium">
                Description
              </h3>
              <div className="text-neutral-600 whitespace-pre-wrap leading-relaxed font-light text-[15px]">
                {product.description || "No description available."}
              </div>
            </div>

            {/* ---- COLOR SELECTOR ---- */}
            {availableColors.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-sm text-neutral-800 font-medium">
                  Color:{" "}
                  <span className="font-normal text-neutral-600">
                    {availableColors.find(c => c.id === selectedColorId)?.name || "Select"}
                  </span>
                </span>
                <div className="flex gap-3 flex-wrap">
                  {availableColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleColorSelect(c.id)}
                      className={`w-10 h-10 p-1.5 border-2 bg-white transition-colors ${
                        selectedColorId === c.id
                          ? "border-black"
                          : "border-transparent hover:border-neutral-300"
                      }`}
                    >
                      <div
                        className="w-full h-full border border-neutral-400"
                        style={{ backgroundColor: c.hex || "#cccccc" }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---- SIZE SELECTOR ---- */}
            {availableSizes.length > 0 && (
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-800 font-medium">
                    Size:{" "}
                    <span className="font-normal text-neutral-600">
                      {availableSizes.find(s => s.id === selectedSizeId)?.name || "Select"}
                    </span>
                  </span>
                  <a
                    href="#"
                    className="text-xs text-neutral-600 underline hover:text-black transition-colors"
                  >
                    View Size Chart
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((s) => {
                    const isAvailable = product.variants.some(
                      v =>
                        v.sizeId === s.id &&
                        v.colorId === selectedColorId &&
                        v.quantity > 0 &&
                        v.status === "AVAILABLE"
                    );
                    const isSelected = selectedSizeId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleSizeSelect(s.id)}
                        disabled={!isAvailable}
                        title={!isAvailable ? "Sold out" : `Size ${s.name}`}
                        className={`relative w-12 h-10 border overflow-hidden flex items-center justify-center text-sm transition-colors ${
                          isSelected ? "border-black bg-neutral-50" : "border-neutral-300 bg-white"
                        } ${isAvailable ? "hover:border-black cursor-pointer" : "cursor-not-allowed"}`}
                      >
                        <span className={!isAvailable ? "text-neutral-700" : "text-neutral-700"}>
                          {s.name}
                        </span>
                        {!isAvailable && (
                          <span className="absolute left-1/2 top-1/2 w-[140%] h-[1px] bg-neutral-500 -translate-x-1/2 -translate-y-1/2 -rotate-[35deg] pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock indicator – urgency only when stock <= 5 */}
            <div className="text-sm">
              {!isInStock ? (
                <span className="text-red-500">Out of stock</span>
              ) : stock <= 5 ? (
                <span className="text-red-500 font-medium">Only {stock} left!</span>
              ) : null}
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-800 font-medium">Quantity</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <QuantityControls
                  value={quantityToAdd}
                  onChange={(value) => setQuantityToAdd(value)}
                  max={stock}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 py-4 text-white hover:bg-neutral-900 transition-colors duration-200 flex items-center justify-center gap-2 text-[15px] font-normal ${
                  isInStock ? "bg-black" : "bg-neutral-400 cursor-not-allowed"
                }`}
              >
                Add To Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!isInStock}
                className={`flex-1 py-4 bg-white text-black border border-black hover:bg-neutral-50 transition-colors duration-200 flex items-center justify-center gap-2 text-[15px] font-normal ${
                  !isInStock && "opacity-50 cursor-not-allowed"
                }`}
              >
                Checkout Now
              </button>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-20">
          <div className="flex items-center justify-between gap-4 mb-10 border-b border-neutral-200 pb-6">
            <h2 className="text-2xl font-light tracking-wide text-neutral-900">
              Customer Reviews
            </h2>
            <button
              onClick={() =>
                navigate(`/addReview/${product.id}`, {
                  state: { productTitle: product.name },
                })
              }
              className="bg-transparent text-neutral-900 border border-neutral-900 px-6 py-3 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              Add a Review
            </button>
          </div>

          <div className="space-y-6">
            {product.ratings?.length > 0 ? (
              product.ratings.map((rating, index) => (
                <div
                  key={index}
                  className="bg-white border border-neutral-200 p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 bg-neutral-200 flex items-center justify-center text-neutral-900 font-bold text-sm">
                        {rating.clientName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <span className="font-medium text-neutral-900 text-lg">
                          {rating.clientName}
                        </span>
                        <p className="text-xs text-neutral-400">
                          {formatDate(rating.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Rating
                        value={rating.stars || 0}
                        readOnly
                        precision={0.5}
                        size="small"
                      />
                    </div>
                  </div>
                  <p className="text-neutral-600 leading-relaxed pr-4 border-l-2 border-neutral-300 pl-4">
                    {rating.comment || "No comment provided."}
                  </p>
                  {rating.imageUrls?.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4 justify-start">
                      {rating.imageUrls.map((url, i) => (
                        <img
                          key={i}
                          src={`${BASE_URL}/api${url.startsWith("/") ? url : "/" + url}`}
                          alt={`Review image ${i + 1}`}
                          className="w-20 h-20 object-cover border border-neutral-200 cursor-pointer transition hover:opacity-80"
                          onClick={() =>
                            setSelectedImage(
                              `${BASE_URL}/api${url.startsWith("/") ? url : "/" + url}`
                            )
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16 border border-neutral-200 bg-neutral-50">
                <span className="text-4xl text-neutral-300">✦</span>
                <p className="text-neutral-500 mt-3 font-light">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between gap-4 mb-10 border-b border-neutral-200 pb-6">
              <h2 className="text-2xl font-light tracking-wide text-neutral-900">
                You May Be Interested In
              </h2>
            </div>
            <div>
              <RelatedProductsSlider relatedProducts={relatedProducts} />
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer backdrop-blur-md transition-all"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged image"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          <button
            className="absolute top-6 right-6 text-white bg-transparent border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition"
            onClick={() => setSelectedImage(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}