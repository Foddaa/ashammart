import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import ProductCard from "@/components/shared/ProductCard";
import { useCategorySidebar } from "@/context/CategorySidebarContext"; // ✅ Import global context

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 10;

export default function Shop() {
  const { categoryId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isFastDelivery = categoryId === "fast-delivery";
  const searchTerm = (searchParams.get("search") || "").toLowerCase();

  // ✅ Get the global selected categories
  const { selectedCategories } = useCategorySidebar();

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Handle categoryId from URL
  useEffect(() => {
    // No sidebar logic here anymore. 
    // If you want URL `/shop/1` to pre-select a category, 
    // you can call setSelectedCategories from the context here.
  }, [categoryId]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryId, selectedCategories]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
        if (searchTerm) params.set("search", searchTerm);

        let url;
        if (categoryId === "fast-delivery") {
          url = `${BASE_URL}/api/product/fastDelivery?${params.toString()}`;
        } else if (selectedCategories.length > 0) {
          params.set("categoryId", selectedCategories[0]); // backend expects a single Long, not a list
          url = `${BASE_URL}/api/product/byCategory?${params.toString()}`;
        } else {
          url = `${BASE_URL}/api/product/all?${params.toString()}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load products");
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          console.error("❌ Not JSON response:", text);
          throw new Error("No products found on the server");
        }

        setProducts(Array.isArray(data.products) ? data.products : []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, categoryId, currentPage, searchTerm]);

  return (
    <div className="container mx-auto p-4" dir="ltr">
      <div className="flex flex-col lg:flex-row lg:gap-6">
        {/* ✅ Sidebar removed completely from here. It's handled globally now! */}

        <div className="w-full">
          {loading ? (
            <p className="text-center text-neutral-500 text-sm tracking-wide uppercase py-10">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-10">{error}</p>
          ) : products.length === 0 ? (
            <div className="text-center py-12 border-t border-neutral-200 pt-8">
              <p className="text-neutral-500 text-lg font-light tracking-wide">No products found.</p>
              {searchTerm && (
                <p className="text-neutral-400 mt-2 text-sm">
                  No results found for "<span className="font-medium text-neutral-800">{searchTerm}</span>"
                </p>
              )}
            </div>
          ) : (
            <>
              {searchTerm && (
                <div className="mb-6 border-l-2 border-neutral-900 p-3 bg-neutral-50 text-neutral-700 text-sm">
                  <span className="font-medium">Search results for: </span>
                  "<span className="text-neutral-900">{searchTerm}</span>"
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => {
                    setCurrentPage(value);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  siblingCount={1}
                  boundaryCount={1}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#333',
                      border: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#555',
                      },
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                      backgroundColor: 'transparent',
                      borderBottom: '2px solid #1a1a1a',
                      borderRadius: '0',
                      color: '#1a1a1a',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        borderBottomColor: '#1a1a1a',
                        color: '#1a1a1a',
                      },
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}