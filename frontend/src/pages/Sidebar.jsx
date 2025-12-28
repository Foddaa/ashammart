import { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar({ selectedCategories, setSelectedCategories, onClose }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category/all`);
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("فشل تحميل التصنيفات. حاول مرة أخرى لاحقًا.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCheckboxChange = (value) => {
    if (selectedCategories.includes(value)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([value]);
    }
    // Close sidebar on mobile after selection
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div dir="rtl" className="bg-gray-100 p-4 rounded-lg shadow-md w-full text-right">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">تصنيفات المنتجات</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-red-500 text-xl"
          >
            ×
          </button>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center animate-pulse flex-row-reverse">
              <div className="ml-2 h-5 w-5 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => {
            const id = `category-${category.id}`;
            return (
              <li key={category.id} className="flex items-center gap-2 w-full justify-start flex-row-reverse">
                <input
                  type="checkbox"
                  id={id}
                  className="h-5 w-5 text-blue-600"
                  checked={selectedCategories?.includes(category.id)}
                  onChange={() => handleCheckboxChange(category.id)}
                />
                <label htmlFor={id} className="cursor-pointer">
                  {category.name}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}