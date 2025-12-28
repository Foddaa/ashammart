import React from "react";
import { toast } from "react-toastify";
import placeholderImage from "@/assets/images/ad1.jpg";
import { updateCartItem, removeFromCart } from "@/components/shared/cartService";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CartItems({ items, onUpdate }) {
  const handleRemove = (id) => {
    try {
      removeFromCart(id); // ✅ correct function name
      toast.success("تم حذف المنتج من السلة");
      onUpdate();
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("حدث خطأ أثناء حذف المنتج");
    }
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    try {
      updateCartItem(id, quantity);
      onUpdate();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("حدث خطأ أثناء تحديث الكمية");
    }
  };

  return (
    <>
      {items.map((item) => {
        const imageUrl = item.imageUrl ? item.imageUrl : placeholderImage;

        return (
          <div
            key={item.id}
            className="sm:grid sm:grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-3 p-2 border-b items-center"
          >
            <div className="flex items-center gap-2">

            <img
              src={
                item.images?.[0]?.url
                  ? `${BASE_URL}/api${item.images[0].url}`
                  : "/default-image.jpg"
              }
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">كود المنتج : {item.code}</p>
              </div>
            </div>

            <div className="max-sm:before:content-['السعر:_'] max-sm:flex max-sm:justify-between">
              EGP {item.price?.toFixed(2) || "0.00"}
            </div>

            <div className="max-sm:before:content-['الكمية:_'] max-sm:flex max-sm:justify-between">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.id, parseInt(e.target.value))
                }
                className="w-16 border rounded p-1 text-center"
              />
            </div>

            <div className="max-sm:before:content-['الإجمالي:_'] max-sm:flex max-sm:justify-between">
              EGP {(item.price * item.quantity).toFixed(2)}
            </div>

            <div className="max-sm:before:content-['حذف:_'] max-sm:flex max-sm:justify-between">
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
