import React, { useEffect, useState } from "react";
import CartItems from "@/components/CartComponents/CartItems";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCart, saveCart } from "@/components/shared/cartService";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const localCart = getCart();
      if (localCart.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const productIds = localCart.map((item) => item.id);
      const response = await axios.post(
        `${BASE_URL}/api/product/by-ids`,
        productIds,
        { headers: { "Content-Type": "application/json" } }
      );

      const products = response.data;

      const mergedCart = localCart
        .map((item) => {
          const product = products.find((p) => p.id === item.id);
          if (!product) {
            console.warn(`Product ${item.id} not found, skipping`);
            return null;
          }
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            code: product.code,
            canceledPrice: product.canceledPrice,
            images: product.images,
            quantity: item.quantity,
          };
        })
        .filter((item) => item !== null);

      setCartItems(mergedCart);

      // Clean up local storage if some products were removed
      if (mergedCart.length !== localCart.length) {
        const cleanCart = mergedCart.map(({ id, quantity }) => ({ id, quantity }));
        saveCart(cleanCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      toast.error("حدث خطأ أثناء تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      navigate("/review-order", {
        state: { cartItems, subtotal },
      });
    } else {
      toast.warn("سلة المشتريات فارغة. أضف منتجات قبل إتمام الطلب.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4" dir="rtl">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">🛒 سلة المشتريات</h1>
          <p className="text-gray-500 mt-2">مراجعة المنتجات المضافة قبل إتمام الطلب</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">جاري تحميل سلة المشتريات...</p>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Table header - hidden on mobile, visible on sm+ */}
            <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 text-gray-700 font-semibold">
              <span className="text-right">المنتج</span>
              <span className="text-center">السعر</span>
              <span className="text-center">الكمية</span>
              <span className="text-center">الإجمالي</span>
              <span className="text-center"></span>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-gray-100">
              <CartItems items={cartItems} onUpdate={fetchCartItems} />
            </div>

            {/* Footer with checkout button */}
            <div className="bg-gray-50 px-6 py-5 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-gray-600 text-sm">
                إجمالي عدد المنتجات: <span className="font-bold text-gray-800">{cartItems.length}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg"
              >
                إتمام الشراء →
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6"
                />
              </svg>
              <p className="text-2xl font-bold text-gray-600 mb-2">سلة المشتريات فارغة</p>
              <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات بعد</p>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition shadow-md"
              >
                تسوق الآن
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}