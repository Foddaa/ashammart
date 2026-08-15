import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import { UserContext } from "@/context/AuthContext";
import ImageGallery from "@/components/ProductDetails/ImageGallery";
import QuantityControls from "@/components/ProductDetails/QuantityControls";
import RelatedProductsSlider from "@/components/ProductDetails/RelatedProductsSlider";
import { addToCart } from "@/components/shared/cartService";
import { addFavorite, removeFavorite, checkFavorite } from "@/services/favoriteService";
import {
  getDiscountPercentage,
} from "@/utils/productDisplay";

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

  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { Token: contextToken, setToken } = useContext(UserContext);
  const { id } = useParams();
  const passedProductId = id || null;

  // --- Mock Data for Colors and Sizes (To match screenshot) ---
  const mockColors = [
    { name: "Royal Brown", hex: "#6b4c3b" },
    { name: "Stone", hex: "#d4cfc5" },
    { name: "Navy", hex: "#1a2a42" },
    { name: "Black", hex: "#2d2d2d" },
  ];
  const mockSizes = [6, 8, 10, 12, 14, 18, 20];
  const mockBrand = "Brand Name"; // Replace with actual product brand if available

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const local = localStorage.getItem("token");
    if (contextToken || local) {
      setToken(contextToken || local);
    }
  }, [contextToken, id]);

  const background = location.state?.background || null;

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantityToAdd, setQuantityToAdd] = useState(location.state?.quantityToAdd || 1);
  const [comment, setComment] = useState(location.state?.comment || "");
  const [loading, setLoading] = useState(true);
  const hasAddedToCart = useRef(false);
  const discount = getDiscountPercentage(product);

  // ✅ Favorite state
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteSaving, setIsFavoriteSaving] = useState(false);

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

  // ✅ Check favorite status once we have a product id and a token
  useEffect(() => {
    if (!product?.id || !contextToken) {
      setIsFavorite(false);
      return;
    }

    let cancelled = false;

    checkFavorite(product.id)
      .then((res) => {
        if (!cancelled) setIsFavorite(res.data);
      })
      .catch((err) => {
        console.error("Failed to check favorite status:", err);
      });

    return () => {
      cancelled = true;
    };
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

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantityToAdd);
    toast.success("Product added to cart 🛒");
  };

  const handleBuyNow = () => {
    if (!product) return;

    const orderItem = {
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      code: product.code,
      canceledPrice: product.canceledPrice,
      images: product.images,
      quantity: quantityToAdd,
      comment: comment,
      freeDelivery: product.freeDelivery,
    };

    navigate("/review-order", {
      state: {
        buyNow: true,
        directProduct: orderItem,
        subtotal: product.price * quantityToAdd,
        quantity: quantityToAdd,
        comment: comment,
      },
    });

    toast.success("Redirecting to checkout...");
  };

  // ✅ Toggle favorite
  const handleToggleFavorite = async () => {
    if (!contextToken) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    if (!product || isFavoriteSaving) return;

    const next = !isFavorite;
    setIsFavorite(next); // optimistic
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
      setIsFavorite(!next); // rollback
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

  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        {/* Main product card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Gallery */}
          <div className="p-3 md:p-0 lg:sticky lg:top-5 self-start">
            <ImageGallery
              images={product.images}
              mainImage={mainImage}
              setMainImage={setMainImage}
              title={product.name}
            />
          </div>

          {/* Right: Product info - Upgraded to match Screenshot */}
          <div className="flex flex-col space-y-6 text-left">

            {/* Brand & Title */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
                  {product.supplierCode}
                </p>
                <h1 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight text-neutral-900">
                  {product.title || product.name}
                </h1>
              </div>

              {/* ✅ Favorite Heart Button */}
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

            {/* Ratings & Sold Count */}
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
              {/* Mocked Sold Count */}
              <span className="text-sm text-neutral-500">{product.quantitySailed} Sold</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-normal text-neutral-900 tracking-tight">
                EGP {product.price}
              </span>
              {product.canceledPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  {product.price == product.canceledPrice || product.canceledPrice.toFixed(2)}
                </span>
              )}
              {product.price != product.canceledPrice && (
                <span className="text-[#d32f2f] text-sm font-semibold ">
                  -{discount}%
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

            {/* --- NEW SECTION: Color Selector (Mock) --- */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-sm text-neutral-800 font-medium">
                Color: <span className="font-normal text-neutral-600">Royal Brown</span>
              </span>
              <div className="flex gap-3">
                {mockColors.map((c) => (
                  <button
                    key={c.name}
                    className="w-8 h-8 rounded-[4px] border border-neutral-300 hover:border-black transition-colors flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                  >
                    {c.name === "Royal Brown" && (
                      <span className="w-full h-full border-[2px] border-black rounded-[2px] bg-transparent"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* --- NEW SECTION: Size Selector (Mock) --- */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-800 font-medium">
                  Size: <span className="font-normal text-neutral-600">8</span>
                </span>
                <a href="#" className="text-xs text-neutral-600 underline hover:text-black transition-colors">
                  View Size Chart
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockSizes.map((s) => (
                  <button
                    key={s}
                    className={`w-12 h-10 border ${
                      s === 8 ? "border-black bg-neutral-50" : "border-neutral-300"
                    } flex items-center justify-center text-sm text-neutral-700 hover:border-black transition-colors`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-800 font-medium">
                  Quantity
                </span>
              </div>
                <div className="flex flex-wrap gap-2">
                  <QuantityControls
                    value={quantityToAdd}
                    onChange={(value) => setQuantityToAdd(value)}
                  />
              </div>
            </div>

            {/* Actions - Side-by-side buttons matching the image's style */}
            <div className="flex flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-black text-white hover:bg-neutral-900 transition-colors duration-200 flex items-center justify-center gap-2 text-[15px] font-normal"
              >
                Add To Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-white text-black border border-black hover:bg-neutral-50 transition-colors duration-200 flex items-center justify-center gap-2 text-[15px] font-normal"
              >
                Checkout Now
              </button>
            </div>

          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20">
          <div className="flex items-center justify-between gap-4 mb-10 border-b border-neutral-200 pb-6">
            <h2 className="text-2xl font-light tracking-wide text-neutral-900">
              Customer Reviews
            </h2>
            <button
              onClick={() =>
                navigate(`/addReview/${product.id}`, {
                  state: { productTitle: product.title || product.name },
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
                          src={`${BASE_URL}/api${
                            url.startsWith("/") ? url : "/" + url
                          }`}
                          alt={`Review image ${i + 1}`}
                          className="w-20 h-20 object-cover border border-neutral-200 cursor-pointer transition hover:opacity-80"
                          onClick={() =>
                            setSelectedImage(
                              `${BASE_URL}/api${
                                url.startsWith("/") ? url : "/" + url
                              }`
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

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between gap-4 mb-10 border-b border-neutral-200 pb-6">
              <h2 className="text-2xl font-light tracking-wide text-neutral-900">
                  You May Be Interested In
              </h2>
            </div>
            <div >
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