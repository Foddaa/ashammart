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
        const categoriesData = Array.isArray(response.data) ? response.data : [];
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("فشل تحميل التصنيفات. حاول مرة أخرى لاحقًا.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (value) => {
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
    <div dir="rtl" className="bg-white rounded-2xl shadow-lg w-full text-right overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">تصنيفات المنتجات</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600 text-2xl transition"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="py-2">
        {loading ? (
          <div className="px-5 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm text-center p-5">{error}</p>
        ) : (
          <>
            {(!Array.isArray(categories) || categories.length === 0) && (
              <p className="text-gray-500 text-sm text-center p-5">لا توجد تصنيفات.</p>
            )}
            {Array.isArray(categories) && categories.length > 0 && (
              <ul>
                {categories.map((category) => {
                  const isSelected = selectedCategories?.includes(category.id);
                  return (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full flex justify-between items-center px-5 py-3 transition hover:bg-gray-50 ${
                          isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700"
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        {/* Arrow pointing left (chevron-left) */}
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}