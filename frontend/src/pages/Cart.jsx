import React, { useEffect, useState } from "react";
import CartItems from "@/components/CartComponents/CartItems";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCart } from "@/components/shared/cartService"; 
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchCartItems = async () => {
  setLoading(true);
  try {
    const localCart = getCart(); // [{ id, quantity }]
    if (localCart.length === 0) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    // Get IDs from cookie cart
    const productIds = localCart.map(item => item.id);

    // Fetch products from backend
    const response = await axios.post(
      `${BASE_URL}/api/product/by-ids`,
      productIds,
      { headers: { "Content-Type": "application/json" } }
    );

    const products = response.data; // full objects

    // ✅ Normalize backend data with local quantity
    const mergedCart = localCart.map(item => {
      const product = products.find(p => p.id === item.id);
      console.log(product.id+" "+product.name+" "+product.price);
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        code:product.code,
        canceledPrice: product.canceledPrice,
        images: product.images,
        quantity: item.quantity,
      };
    });

    setCartItems(mergedCart);
  } catch (error) {
    console.error("Error loading cart:", error);
    toast.error("حدث خطأ أثناء تحميل المنتجات");
  }
  setLoading(false);
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
      state: {
        cartItems,
        subtotal,
      },
    });
  } else {
    toast.warn("سلة المشتريات فارغة. أضف منتجات قبل إتمام الطلب.");
  }
};


  return (
    <section className="container" dir="rtl">
      {loading ? (
        <div className="text-center py-10 text-lg font-semibold">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
          جاري تحميل سلة المشتريات...
        </div>
      ) : cartItems.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold text-center my-5">سلة المشتريات</h1>
          <div className="flex flex-col">
            <div className="sm:grid sm:grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-3 p-2 border-b font-bold text-lg text-right">
              <span>المنتج</span>
              <span className="max-sm:hidden">السعر</span>
              <span className="max-sm:hidden">الكمية</span>
              <span className="max-sm:hidden">الإجمالي</span>
              <span className="max-sm:hidden">حذف</span>
            </div>
            <div className="mt-2 p-2">
              <CartItems items={cartItems} onUpdate={fetchCartItems} />
            </div>
            <div className="flex justify-start mt-5">
              <button
                className="bg-blue-600 text-white w-[250px] p-2 scale-90 hover:scale-100 transition-all"
                onClick={handleCheckout}
              >
               شراء
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center flex-col mt-10">
          <p className="font-extrabold text-4xl">سلة المشتريات فارغة</p>
          <button
            onClick={() => navigate("/")}
            className="p-2 bg-blue-700 text-white rounded-3xl mt-5"
          >
            الرجوع للتسوق
          </button>
        </div>
      )}
    </section>
  );
}
