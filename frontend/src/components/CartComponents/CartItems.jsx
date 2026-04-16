// src/components/CartComponents/CartItems.jsx
import React from "react";
import { updateCartItemQuantity, removeFromCart } from "@/components/shared/cartService";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CartItems({ items = [], onUpdate }) {
  // Guard: if items is not an array, render nothing
  if (!Array.isArray(items)) {
    return null;
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // Optionally remove if quantity becomes zero
      handleRemove(productId);
      return;
    }
    try {
      updateCartItemQuantity(productId, newQuantity);
      onUpdate(); // refresh cart
    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("حدث خطأ أثناء تحديث الكمية");
    }
  };

  const handleRemove = (productId) => {
    try {
      removeFromCart(productId);
      toast.success("تم حذف المنتج من السلة");
      onUpdate();
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("حدث خطأ أثناء حذف المنتج");
    }
  };

  return (
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <div
          key={item.id}
          className="group p-4 sm:p-5 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent"
        >
          {/* Main row: responsive grid */}
          <div className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:gap-4 sm:items-center">
            {/* Product info (image + name + code) */}
            <div className="flex gap-4 mb-4 sm:mb-0">
              <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={
                    item.images?.[0]?.url
                      ? `${BASE_URL}/api${item.images[0].url}`
                      : "/placeholder.png"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">كود: {item.code}</p>
                {/* Mobile price (visible on small screens only) */}
                <div className="sm:hidden mt-2">
                  <span className="text-blue-600 font-bold text-base">
                    {item.price.toLocaleString()} ج.م
                  </span>
                  {item.canceledPrice > item.price && (
                    <span className="mr-2 text-gray-400 line-through text-sm">
                      {item.canceledPrice.toLocaleString()} ج.م
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop price */}
            <div className="hidden sm:block text-center">
              <div className="font-medium text-gray-800">
                {item.price.toLocaleString()} ج.م
              </div>
              {item.canceledPrice > item.price && (
                <div className="text-gray-400 line-through text-sm">
                  {item.canceledPrice.toLocaleString()} ج.م
                </div>
              )}
            </div>

            {/* Quantity controls – modern pill style */}
            <div className="flex items-center justify-start sm:justify-center mb-4 sm:mb-0">
              <div className="inline-flex items-center gap-1 bg-gray-100/80 rounded-full p-1 shadow-inner">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-9 h-9 rounded-full bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center justify-center shadow-sm"
                  aria-label="إنقاص الكمية"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-semibold text-gray-800 text-base">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-9 h-9 rounded-full bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-200 flex items-center justify-center shadow-sm"
                  aria-label="زيادة الكمية"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop total */}
            <div className="hidden sm:block text-center">
              <span className="font-bold text-gray-900 text-base">
                {(item.price * item.quantity).toLocaleString()} ج.م
              </span>
            </div>

            {/* Delete button – modern with icon + label (desktop) */}
            <div className="flex justify-start sm:justify-center">
              <button
                onClick={() => handleRemove(item.id)}
                className="group/delete flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-all duration-200"
                aria-label="حذف المنتج"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="text-sm hidden sm:inline group-hover/delete:text-red-600">
                  حذف
                </span>
              </button>
            </div>

            {/* Mobile total row (visible only on small screens) */}
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-gray-600">الإجمالي:</span>
              <span className="font-bold text-blue-600 text-lg">
                {(item.price * item.quantity).toLocaleString()} ج.م
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}