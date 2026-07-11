import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Pagination from "@mui/material/Pagination";
import ProductCard from "@/components/shared/ProductCard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Shop() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isFastDelivery = categoryId === "fast-delivery";
  const searchTerm = (searchParams.get("search") || "").toLowerCase();
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    categoryId && !isFastDelivery ? [parseInt(categoryId)] : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Check location state for sidebar control from header
  useEffect(() => {
    const locationState = location.state || {};

    if (locationState.openSidebar) {
      setSidebarOpen(true);
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }

    if (locationState.toggleSidebar) {
      setSidebarOpen(prev => !prev);
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname, location.search]);

  // Handle categoryId from URL
  useEffect(() => {
    if (categoryId && categoryId !== "fast-delivery") {
      setSelectedCategories([parseInt(categoryId)]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryId]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch products based on selected categories / fast delivery
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        let url;
        if (categoryId === "fast-delivery") {
          url = `${BASE_URL}/api/product/fastDelivery`;
        } else if (selectedCategories.length > 0) {
          const idsParam = selectedCategories.join(",");
          url = `${BASE_URL}/api/product/byCategory?categoryId=${idsParam}`;
        } else {
          url = `${BASE_URL}/api/product/all`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("فشل في جلب المنتجات");
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          console.error("❌ Not JSON response:", text);
          throw new Error("لا يوجد منتجات في السيرفر");
        }
        setProducts(Array.isArray(data) ? data : []);
        setCurrentPage(1);
      } catch (err) {
        setError(err.message || "حدث خطأ ما");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, categoryId]);

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="container mx-auto p-4" dir="rtl">
      {/* Mobile Sidebar - Controlled by header button */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 fade-in"
            onClick={closeSidebar}
          />
          <div className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-white shadow-lg overflow-y-auto slide-in-right">
            <div className="p-4">
              <Sidebar
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                onClose={closeSidebar}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="lg:flex lg:gap-6">
        <div className="hidden lg:block lg:w-1/4">
          <Sidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>

        <div className="w-full lg:w-3/4">
          {loading ? (
            <p className="text-center text-blue-500">جاري التحميل...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">لا توجد منتجات مطابقة.</p>
              {searchTerm && (
                <p className="text-gray-400 mt-2">
                  لم يتم العثور على نتائج لـ "<span className="font-semibold">{searchTerm}</span>"
                </p>
              )}
            </div>
          ) : (
            <>
              {searchTerm && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-gray-700">
                    نتائج البحث عن: "<span className="font-semibold text-blue-600">{searchTerm}</span>"
                    <span className="mr-2 text-sm text-gray-500">
                      ({filteredProducts.length} منتج)
                    </span>
                  </p>
                </div>
              )}

              {/* Products Grid — card itself lives in <ProductCard /> */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pageCount > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={(event, value) => {
                      setCurrentPage(value);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    shape="rounded"
                    color="primary"
                    siblingCount={1}
                    boundaryCount={1}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}