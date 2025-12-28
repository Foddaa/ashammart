import React from 'react';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, updateQuantity } from '@/store/cart/cartSlice';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Card({ product, productsCount = 0 }) {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const {
    id,
    name = 'No Name',
    price,
    canceledPrice,
    images = [],
  } = product;

  const thumbnail = images?.[0]?.url
    ? `${BASE_URL}/api${images[0].url}`
    : "/default-image.jpg"; // fallback image

  const handleNavigate = () => {
    navigate(`/product/${id}`, { state: { product } }); // if you pass the full product
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden p-4 flex flex-col justify-between">
      <img
        src={thumbnail}
        alt={name}
        className="w-full h-48 object-contain rounded-lg mb-4 cursor-pointer"
        onClick={handleNavigate}
      />

      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-blue-600">EGP {price}</span>
          {canceledPrice && canceledPrice < price && (
            <span className="text-sm line-through text-gray-500">EGP {canceledPrice}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <button
            disabled={productsCount <= 0}
            onClick={() => {
              if (productsCount > 1) {
                dispatch(updateQuantity({ id, quantity: productsCount - 1 }));
              } else {
                dispatch(removeFromCart(id));
              }
            }}
            className="text-2xl p-1 text-gray-600 hover:text-red-500"
          >
            <CiCircleMinus />
          </button>

          <span className="text-lg font-medium">{productsCount}</span>

          <button
            onClick={() => dispatch(addToCart(product))}
            className="text-2xl p-1 text-gray-600 hover:text-blue-500"
          >
            <CiCirclePlus />
          </button>
        </div>
      </div>
    </div>
  );
}
