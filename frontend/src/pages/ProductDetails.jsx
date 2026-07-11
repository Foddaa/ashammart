import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import { UserContext } from "@/Context/AuthContext";
import AddToCartButtons from "@/components/ProductDetails/AddToCartButtons";
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
  const { Token: contextToken, setToken } = useContext(UserContext);
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
    freeDelivery: product.freeDelivery, // <-- add this
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

    toast.success("جاري التوجيه إلى صفحة الدفع...");
  };

  const handleClose = () => {
    if (background) navigate(background);
    else navigate(-1);
  };

  // Loading skeleton
  if (loading)
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
          <div className="bg-white rounded-2xl shadow-lg aspect-square" />
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50/30 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Main product card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Gallery */}
            <div className="bg-gray-50/50 p-6 md:p-8 lg:sticky lg:top-24 self-start">
              <ImageGallery
                images={product.images}
                mainImage={mainImage}
                setMainImage={setMainImage}
                title={product.name}
              />
            </div>

            {/* Right: Product info */}
            <div className="p-6 md:p-8 lg:p-10 space-y-6 text-right">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {product.title || product.name}
              </h1>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <div className="flex items-center gap-2">
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
                <div className="flex items-center gap-2 flex-wrap">
                  {product.freeDelivery && (
                    <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200 shadow-sm">
                      ⚡ توصيل مجاني
                    </span>
                  )}
                  {product.fastDelivery && (
                    <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
                      🚚 توصيل سريع
                    </span>
                  )}
                </div>
              </div>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                  خصم
                </span>
              <div className="flex items-baseline justify-end gap-3 bg-blue-50/30 p-4 rounded-2xl">
                <p className="text-2xl  text-blue-700">
                  ج.م
                </p>
                <span className="text-4xl font-bold text-blue-700">
                  {product.price} 
                </span>
                <span className="text-gray-400 line-through text-lg">
                  {product.canceledPrice
                    ? product.canceledPrice.toFixed(2)
                    : (product.price * 1.12).toFixed(2)}{" "}
                </span>

              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  الوصف
                </h3>
                <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {product.description || "لا يوجد وصف لهذا المنتج."}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-end gap-4">
                    <QuantityControls
                      value={quantityToAdd}
                      onChange={(value) => setQuantityToAdd(value)}
                    />
                    <label className="text-gray-700 font-medium">الكمية</label>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    تعليق (اختياري)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="2"
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-gray-50/50"
                    placeholder="أضف أي ملاحظات إضافية..."
                  />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <AddToCartButtons handleAddToCart={handleAddToCart} />
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
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
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between gap-4 mb-8">
                        <button
              onClick={() =>
                navigate(`/addReview/${product.id}`, {
                  state: { productTitle: product.title || product.name },
                })
              }
              className="shrink-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-semibold text-md hover:from-green-600 hover:to-green-700 transition shadow-md flex items-center gap-3"
            >
              ✍️ أضف تقييمك
            </button>
            <h2 className="text-2xl font-bold text-gray-800 shrink-0">
              تقييمات العملاء
            </h2>

          </div>

          <div className="space-y-6">
            {product.ratings?.length > 0 ? (
              product.ratings.map((rating, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 text-right">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {rating.clientName?.charAt(0) || "م"}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 text-lg">
                          {rating.clientName}
                        </span>
                        <p className="text-xs text-gray-400">
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
                  <p className="text-gray-700 whitespace-pre-wrap pr-3 border-r-2 border-blue-200 pl-4">
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
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer transition hover:scale-105 hover:shadow-md"
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
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <span className="text-5xl text-gray-300">⭐</span>
                <p className="text-gray-500 mt-3">
                  لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                قد يعجبك أيضاً
              </h2>
              <div className="flex-1 h-0.5 bg-gradient-to-l from-blue-200 to-transparent" />
            </div>
            <RelatedProductsSlider relatedProducts={relatedProducts} />
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
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