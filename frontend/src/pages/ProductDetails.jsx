import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { useEffect, useState, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import { UserContext } from "@/Context/AuthContext";
import ActionButtons from "@/components/ProductDetails/ActionButtons";
import ImageGallery from "@/components/ProductDetails/ImageGallery";
import QuantityControls from "@/components/ProductDetails/QuantityControls";
import RelatedProductsSlider from "@/components/ProductDetails/RelatedProductsSlider";
import { addToCart } from "@/components/shared/cartService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: format date to Arabic
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
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
  const { Token: contextToken, setToken, ready } = useContext(UserContext);
  const { id } = useParams();
  const passedProductId = id || null;

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
          console.error("خطأ في تحميل المنتج:", err);
          toast.error("حدث خطأ أثناء تحميل المنتج");
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

  // Auto add to cart if from specific state
  useEffect(() => {
    if (location.state?.autoAddToCart && !hasAddedToCart.current) {
      hasAddedToCart.current = true;
      navigate(location.pathname, {
        state: { ...location.state, autoAddToCart: undefined },
        replace: true,
      });
    }

    // Fetch related products
    if (product?.categoryId) {
      fetch(`${BASE_URL}/api/product/byCategory?categoryId=${product.categoryId}`)
        .then((res) => res.json())
        .then((data) => {
          const related = data.filter((p) => p.id !== product.id);
          setRelatedProducts(related);
        })
        .catch((err) => console.error("Failed to load related", err));
    }
  }, [product, location.state, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantityToAdd);
    toast.success("تمت إضافة المنتج إلى السلة 🛒");
  };

  const handleClose = () => {
    if (background) navigate(background);
    else navigate(-1);
  };

  // Loading skeleton
  if (loading)
    return (
      <div className="w-full bg-white min-h-screen p-4 md:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="bg-gray-200 rounded-2xl aspect-square" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20 text-red-500 text-xl">
        لم نتمكن من العثور على المنتج
      </div>
    );

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Product main section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className="lg:sticky lg:top-24 self-start">
            <ImageGallery
              images={product.images}
              mainImage={mainImage}
              setMainImage={setMainImage}
              title={product.name}
            />
          </div>

          {/* Right: Product info */}
          <div className="space-y-6 text-right">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.title || product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center justify-end gap-2">
              <Rating
                name="read-only"
                value={product.averageRating || 0}
                readOnly
                precision={0.5}
                size="medium"
                className="text-yellow-500"
              />
              <span className="text-sm text-gray-500">
                ({product.averageRating?.toFixed(1) || "0.0"})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline justify-end gap-3">
              <span className="text-3xl font-bold text-blue-700">
                {product.price} ج.م
              </span>
              <span className="text-gray-400 line-through text-lg">
                {product.canceledPrice
                  ? product.canceledPrice.toFixed(2)
                  : (product.price * 1.12).toFixed(2)}{" "}
                ج.م
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                الوصف
              </h3>
              <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {product.description || "لا يوجد وصف لهذا المنتج."}
              </div>
            </div>

            {/* Quantity & comment */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  الكمية
                </label>
                <QuantityControls
                  value={quantityToAdd}
                  onChange={(value) => setQuantityToAdd(value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  تعليق (اختياري)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="2"
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="أضف أي ملاحظات إضافية..."
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              <ActionButtons handleAddToCart={handleAddToCart} />
            </div>

            {/* Add review button */}
            <div className="pt-4">
              <button
                onClick={() =>
                  navigate(`/addReview/${product.id}`, {
                    state: { productTitle: product.title || product.name },
                  })
                }
                className="w-full md:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition shadow-md flex items-center justify-center gap-2"
              >
                <span>✍️</span> أضف تقييمك
              </button>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 inline-block pb-2 border-b-2 border-blue-500">
              تقييمات العملاء
            </h2>
          </div>

          <div className="space-y-6">
            {product.ratings?.length > 0 ? (
              product.ratings.map((rating, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 text-lg">
                        {rating.clientName}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(rating.createdAt)}
                      </p>
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
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {rating.comment || "لا يوجد تعليق."}
                  </p>
                  {rating.imageUrls?.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4 justify-end">
                      {rating.imageUrls.map((url, i) => (
                        <img
                          key={i}
                          src={`${BASE_URL}/api${
                            url.startsWith("/") ? url : "/" + url
                          }`}
                          alt={`صورة التقييم ${i + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer transition hover:scale-105"
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
              <div className="text-center py-10 bg-gray-50 rounded-2xl">
                <span className="text-gray-400 text-lg">⭐</span>
                <p className="text-gray-500 mt-2">لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="border-b border-gray-200 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 inline-block pb-2 border-b-2 border-blue-500">
                قد يعجبك أيضاً
              </h2>
            </div>
            <RelatedProductsSlider relatedProducts={relatedProducts} />
          </div>
        )}
      </div>

      {/* Lightbox Modal for fullscreen image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer backdrop-blur-sm transition-all"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="صورة مكبرة"
            className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl object-contain"
          />
          <button
            className="absolute top-6 right-6 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}