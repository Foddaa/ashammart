import React, { useEffect, useState } from "react";
import CartItems from "@/components/CartComponents/CartItems";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCart, saveCart } from "@/components/shared/cartService";
import api from "@/api/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isBuyNow = location.state?.buyNow || false;
  const directProduct = location.state?.directProduct || null;

  const fetchCartItems = async () => {
    if (isBuyNow && directProduct) {
      setCartItems([directProduct]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const localCart = getCart();
      if (localCart.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const productIds = localCart.map((item) => item.id);
      const response = await api.post("/api/product/by-ids", productIds);

      const products = response.data;

      const mergedCart = localCart
        .map((item) => {
          const product = products.find((p) => p.id === item.id);
          if (!product) {
            console.warn(`Product with id ${item.id} not found, skipping`);
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
            freeDelivery: product.freeDelivery,
          };
        })
        .filter((item) => item !== null);

      setCartItems(mergedCart);

      if (mergedCart.length !== localCart.length) {
        const cleanCart = mergedCart.map(({ id, quantity }) => ({ id, quantity }));
        saveCart(cleanCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      toast.error("Error loading products");
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
        state: { 
          cartItems, 
          subtotal,
          buyNow: isBuyNow,
          directProduct: directProduct,
          comment: location.state?.comment || ""
        },
      });
    } else {
      toast.warn("Your cart is empty. Add products before checking out.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 md:py-12 md:px-6" dir="ltr">
      <div className="container mx-auto max-w-6xl">
        
        {/* Minimal Luxury Header - Responsive spacing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-5 mb-8 gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-light tracking-wide text-neutral-900">
              {isBuyNow ? "Order Review" : "Shopping Cart"}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              {isBuyNow 
                ? "Review your selected item before checkout" 
                : "Review your items before checkout"}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-neutral-200 p-10 md:p-12 text-center">
            <div className="w-8 h-8 border border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Loading cart...</p>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="bg-white border border-neutral-200">
            
            {/* Table Header (Desktop) */}
            <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_0.5fr] bg-neutral-50 border-b border-neutral-200 px-6 py-4 text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              <span className="text-left">Product</span>
              <span className="text-center">Price</span>
              <span className="text-center">Qty</span>
              <span className="text-center">Total</span>
              <span className="text-center"></span>
            </div>

            {/* Cart Items - Wrapped in overflow-x-auto to ensure mobile safety */}
            <div className="divide-y divide-neutral-100 overflow-x-auto w-full">
              <CartItems 
                items={cartItems} 
                onUpdate={fetchCartItems} 
                isBuyNow={isBuyNow}
              />
            </div>

            {/* Footer Summary - Perfectly stacks on mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-5 border-t border-neutral-200 bg-white gap-4 sm:gap-0">
              <span className="text-sm text-neutral-500 text-center sm:text-left">
                Total items: <span className="font-medium text-neutral-900">{cartItems.length}</span>
              </span>
              <button
                onClick={handleCheckout}
                className="w-full sm:w-auto bg-neutral-900 text-white px-6 sm:px-8 py-3 hover:bg-neutral-800 transition-colors text-xs sm:text-sm tracking-wider uppercase border border-neutral-900"
              >
                {isBuyNow ? "Checkout" : "Checkout"}
              </button>
            </div>
          </div>
        ) : (
          // Empty State - Responsive padding and spacing
          <div className="bg-white border border-neutral-200 p-10 md:p-16 text-center">
            <div className="flex flex-col items-center justify-center text-neutral-400">
              <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-neutral-200 rounded-full flex items-center justify-center mb-4 text-neutral-300">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <p className="text-lg font-light tracking-wide text-neutral-500">Cart is empty</p>
              <p className="text-sm text-neutral-400 mt-1">You haven't added any products yet</p>
              <button
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-2.5 bg-transparent border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors text-[10px] sm:text-xs uppercase tracking-wider w-full sm:w-auto"
              >
                Shop Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}