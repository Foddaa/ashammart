import React from "react";
import { useNavigate } from "react-router-dom";
import { updateCartItemQuantity, removeFromCart } from "@/components/shared/cartService";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CartItems({ items = [], onUpdate }) {
  const navigate = useNavigate();

  // Guard: if items is not an array, render nothing
  if (!Array.isArray(items)) {
    return null;
  }

  const handleQuantityChange = (variantId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(variantId);
      return;
    }
    try {
      updateCartItemQuantity(variantId, newQuantity);
      onUpdate(); // refresh cart
    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = (variantId) => {
    try {
      removeFromCart(variantId);
      toast.success("Product removed from cart");
      onUpdate();
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="divide-y divide-neutral-100">
      {items.map((item) => (
        <div
          key={item.variantId || item.id} // Changed to variantId to avoid React key collisions
          className="p-4 sm:p-6 bg-white transition-colors duration-200 hover:bg-neutral-50"
        >
          {/* Main row: LTR responsive grid */}
          <div className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:gap-4 sm:items-center">
            
            {/* Product info (image + name + code) */}
            <div className="flex gap-4 mb-4 sm:mb-0 text-left">
              <div className="flex-shrink-0 w-20 h-20 border border-neutral-200 bg-neutral-50">
                <img
                  src={
                    item.images?.[0]?.url
                      ? `${BASE_URL}/api${item.images[0].url}`
                      : "/placeholder.png"
                  }
                  alt={item.name}
                  onClick={() =>
                    navigate(`/product/${item.id}`, { // NOTE: Keep item.id here for navigation URL
                      state: { product: item },
                    })
                  }
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-medium text-neutral-900 text-base sm:text-lg tracking-tight">
                  {item.name}
                </h3>
                <p className="text-neutral-400 text-[10px] uppercase tracking-wider mt-0.5">
                  Code: {item.code}
                </p>
                
                {/* NEW: Display Size and Color */}
                {item.size || item.color ? (
                  <p className="text-neutral-500 text-xs mt-1">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && <span className="mx-1 text-neutral-300">|</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </p>
                ) : null}

                {/* Mobile price (visible on small screens only) */}
                <div className="sm:hidden mt-2 flex items-center gap-2">
                  <span className="text-neutral-900 font-medium">
                    {item.price.toLocaleString()} EGP
                  </span>
                  {item.canceledPrice > item.price && (
                    <span className="text-neutral-400 line-through text-sm">
                      {item.canceledPrice.toLocaleString()} EGP
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop price */}
            <div className="hidden sm:flex flex-col items-center justify-center">
              <span className="text-sm text-neutral-700">
                {item.price.toLocaleString()} EGP
              </span>
              {item.canceledPrice > item.price && (
                <span className="text-[10px] text-neutral-400 line-through">
                  {item.canceledPrice.toLocaleString()} EGP
                </span>
              )}
            </div>

            {/* Quantity controls – Minimal & Sharp */}
            <div className="flex items-center justify-start sm:justify-center mb-4 sm:mb-0">
              <div className="flex items-center border border-neutral-200 bg-white">
                <button
                  onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)} // Changed to variantId
                  className="px-3 py-1.5 text-neutral-500 hover:bg-neutral-50 transition-colors duration-200"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                
                <span className="w-10 text-center text-sm font-light text-neutral-900 border-l border-r border-neutral-200 py-1.5">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)} // Changed to variantId
                  className="px-3 py-1.5 text-neutral-500 hover:bg-neutral-50 transition-colors duration-200"
                  aria-label="Increase quantity"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop total */}
            <div className="hidden sm:flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-900">
                {(item.price * item.quantity).toLocaleString()} EGP
              </span>
            </div>

            {/* Minimal Delete Button (Exactly matching your admin tables) */}
            <div className="flex justify-start sm:justify-center mt-2 sm:mt-0">
              <button
                onClick={() => handleRemove(item.variantId)} // Changed to variantId
                className="inline-flex items-center gap-1.5 border border-red-400 px-3 py-1.5 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 text-[10px] uppercase tracking-wider"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete
              </button>
            </div>

            {/* Mobile total row (visible only on small screens) */}
            <div className="sm:hidden mt-3 pt-3 border-t border-neutral-200 flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Total</span>
              <span className="font-medium text-neutral-900 text-base">
                {(item.price * item.quantity).toLocaleString()} EGP
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}