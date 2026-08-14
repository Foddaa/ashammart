import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import api from "@/api/axiosInstance";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Sidebar({ selectedCategories, setSelectedCategories, onClose }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category/all`);
        const categoriesData = Array.isArray(response.data) ? response.data : [];
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Try again later.");
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
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("search");
      return params;
    });

    // Navigate to the shop page so the selection actually shows results
    if (location.pathname !== "/shop") {
      navigate("/shop");
    }

    // Close sidebar on mobile after selection
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div dir="ltr" className="bg-white border border-neutral-200 w-full">
      
      {/* Minimal Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
        <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
          Product Categories
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-neutral-400 hover:text-neutral-900 transition-colors p-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Content area */}
      <div className="py-1">
        {loading ? (
          <div className="px-5 space-y-4 py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-5 bg-neutral-100 border border-neutral-200 w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-neutral-500 text-sm text-center p-5 tracking-wide">{error}</p>
        ) : (
          <>
            {(!Array.isArray(categories) || categories.length === 0) && (
              <p className="text-neutral-400 text-xs tracking-wider text-center p-5 uppercase">No categories found.</p>
            )}
            {Array.isArray(categories) && categories.length > 0 && (
              <ul>
                {categories.map((category) => {
                  const isSelected = selectedCategories?.includes(category.id);
                  return (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full flex items-center justify-between px-5 py-3 transition-colors duration-200 text-sm border-l-2 ${
                          isSelected
                            ? "border-neutral-900 bg-neutral-100 text-neutral-900 font-medium"
                            : "border-transparent text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                        }`}
                      >
                        <span>{category.name}</span>
                        {/* Minimal LTR chevron arrow */}
                        <svg
                          className={`w-4 h-4 transition-colors duration-200 ${
                            isSelected ? "text-neutral-900" : "text-neutral-300"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 18l6-6-6-6" />
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