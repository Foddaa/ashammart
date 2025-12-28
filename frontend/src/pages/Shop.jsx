import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Rating from "@mui/material/Rating";
import Pagination from "@mui/material/Pagination";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Shop({ cartItems = [] }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const searchTerm = (searchParams.get("search") || "").toLowerCase();
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    categoryId ? [parseInt(categoryId)] : []
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
      // Clear the state to prevent reopening on refresh
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
    
    if (locationState.toggleSidebar) {
      setSidebarOpen(prev => !prev);
      // Clear the state to prevent retoggling on refresh
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname, location.search]);

  // Handle categoryId from URL
  useEffect(() => {
    if (categoryId) {
      setSelectedCategories([parseInt(categoryId)]);
    }
  }, [categoryId]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]); 

  // Fetch products based on selected categories
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        let url = `${BASE_URL}/api/product/all`;
        if (selectedCategories.length > 0) {
          const idsParam = selectedCategories.join(",");
          url = `${BASE_URL}/api/product/byCategory?categoryId=${idsParam}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("فشل في جلب المنتجات");
        const data = await res.json();
        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        setError(err.message || "حدث خطأ ما");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories]);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  // Function to close sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="container mx-auto p-4" dir="rtl">
      {/* Mobile Sidebar - Controlled by header button */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 fade-in"
            onClick={closeSidebar}
          />
          {/* Sidebar Panel */}
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
        {/* Desktop Sidebar - Always visible on desktop */}
        <div className="hidden lg:block lg:w-1/4">
          <Sidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>

        {/* Main Content */}
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
              {/* Search results info */}
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

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {paginatedProducts.map((product) => {
                  const cartProduct = cartItems.find((item) => item.id === product.id);
                  const displayCanceledPrice =
                    !product.canceledPrice || product.canceledPrice <= product.price
                      ? Math.round(product.price * 1.12)
                      : product.canceledPrice;

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                      className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white"
                    >
                      {/* Product Image */}
                      <div className="aspect-square w-full flex justify-center items-center bg-gray-50">
                        <img
                          src={
                            product.images?.[0]?.url
                              ? `${BASE_URL}/api${product.images[0].url}`
                              : "/placeholder.png"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover p-1"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="p-3 text-right flex-grow">
                        <h3 className="font-semibold text-sm text-gray-800 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.description?.length > 30
                            ? `${product.description.substring(0, 30)}...`
                            : product.description}
                        </p>
                        <span className="text-xs text-blue-600 mt-1 block">
                          تصميم مخصص
                        </span>
                        
                        {/* Price Section */}
                        <div className="p-2 border-t border-gray-100 mt-2">
                          <p className="text-black-600 font-bold">
                            ج.م {product.price}
                            <span className="mr-2 text-gray-500 line-through text-base font-normal">
                              ج.م{displayCanceledPrice.toFixed(2)}
                            </span>
                          </p>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 justify-start mt-2">
                          <Rating
                            name="read-only"
                            value={product.averageRating || 0}
                            readOnly
                            precision={0.5}
                            size="small"
                          />
                          <span className="text-xs text-gray-600">
                            ({product.averageRating?.toFixed(1) || "0.0"})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
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