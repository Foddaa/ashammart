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

export default function ProductDetails() {
  useEffect(() => {
    const background = document.getElementById("background");
    if (background) background.style.display = "none";
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { Token: contextToken, setToken, ready } = useContext(UserContext);
  const { id } = useParams();
  const passedProductId = id || null;
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setSelectedImage(null);
    }
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

  const hasAddedToCart = useRef(false);

  useEffect(() => {
    if (passedProductId) {
      fetch(`${BASE_URL}/api/product/byId?id=${passedProductId}`)
        .then((res) => res.json())
        .then((data) => {
          const fixedImages = data.images.map((img) => ({
            ...img,
            url: img.url.startsWith("http") ? img.url : `${BASE_URL}/api${img.url}`,
          }));
          data.images = fixedImages;
          setProduct(data);
        })
        .catch((err) => {
          console.error("خطأ في تحميل المنتج:", err);
        });
    }
  }, [passedProductId]);

  useEffect(() => {
    if (product?.images?.length) {
      setMainImage(product.images[0].url);
    } else {
      setMainImage("");
    }
  }, [product]);

  useEffect(() => {
    if (location.state?.autoAddToCart && !hasAddedToCart.current) {
      hasAddedToCart.current = true;
      navigate(location.pathname, {
        state: {
          ...location.state,
          autoAddToCart: undefined,
        },
        replace: true,
      });
    }

    if (product?.categoryId) {
      fetch(`${BASE_URL}/api/product/byCategory?categoryId=${product.categoryId}`)
        .then((res) => res.json())
        .then((data) => {
          const related = data.filter((p) => p.id !== product.id);
          setRelatedProducts(related);
        });
    }
  }, [product]);

  if (!product) return <p className="text-red-500 p-10">لا يوجد بيانات للمنتج.</p>;
  
  
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantityToAdd); // ✅ uses cookies
    toast.success("تمت إضافة المنتج إلى السلة 🛒");
  };


  const handleClose = () => {
    if (background) {
      navigate(background);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="bg-white w-full max-w-6xl mx-auto min-h-screen px-4 py-6 md:p-10 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:flex md:flex-row-reverse">
          <div className="w-full md:w-1/2">
            <ImageGallery
              images={product.images}
              mainImage={mainImage}
              setMainImage={setMainImage}
              title={product.name}
            />
          </div>

          <div className="w-full md:w-1/2 space-y-5 text-right">
            <h2 className="text-2xl font-medium capitalize text-black">
              {product.title || product.name}
            </h2>
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

            <p className="text-xl font-bold text-black">
              {product.price} ج.م
              <span className="mr-2 text-gray-500 line-through text-base font-normal">
                {product.canceledPrice ? product.canceledPrice.toFixed(2) : (product.price * 1.12).toFixed(2)} ج.م
              </span>
            </p>

            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.description || "لا يوجد وصف."}
            </div>

            <QuantityControls
              value={quantityToAdd}
              onChange={(value) => setQuantityToAdd(value)}
            />

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="إضف تعليقاتك الخاصة (اختياري)"
              className="border p-2 w-full rounded"
            />

            <ActionButtons handleAddToCart={handleAddToCart} />
          </div>
        </div>

        <div className="mt-10">
          <RelatedProductsSlider relatedProducts={relatedProducts} />
        </div>
        
         
  <div className="mt-10 text-right" dir="rtl">
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={() =>
        navigate(`/addReview/${product.id}`, {
          state: { productTitle: product.title || product.name },
        })
      }
    >
      أضف تقييمك
    </button>
  </div>


<div className="mt-16 text-right" dir="rtl">
  <h3 className="text-xl font-semibold mb-6 text-gray-800">تقييمات العملاء</h3>
  <div className="space-y-4">
    {product.ratings?.length > 0 ? (
      product.ratings.map((rating, index) => (
        <div
          key={index}
          className="border border-gray-200 p-4 rounded-md shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-right">
              <span className="font-semibold text-gray-900">
                {rating.clientName}
              </span>
              <p className="text-xs text-gray-500">
                {/* {new Date(rating.createdAt).toLocaleDateString("ar-EG")} */}
              </p>
            </div>
            <Rating
              value={rating.stars || 0}
              readOnly
              precision={0.5}
              size="small"
            />
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {rating.comment || "لا يوجد تعليق."}
          </p>
          {rating.imageUrls?.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2 justify-end">
              {rating.imageUrls.map((url, i) => (
                <img
  key={i}
  src={`${BASE_URL}/api${url.startsWith("/") ? url : "/" + url}`}
  alt={`صورة التقييم ${i + 1}`}
  className="w-24 h-24 object-cover rounded border cursor-pointer"
  onClick={() =>
    setSelectedImage(`${BASE_URL}/api${url.startsWith("/") ? url : "/" + url}`)
  }
/>
              ))}
            </div>
          )}
        </div>
      ))
    ) : (
      <p className="text-gray-500">لا توجد تقييمات بعد.</p>
    )}
  </div>
</div>

      </div>
      {selectedImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <img
      src={selectedImage}
      alt="صورة مكبرة"
      className="max-w-full max-h-full rounded shadow-lg"
    />
  </div>
)}
    </div>
    
    
  );

}
