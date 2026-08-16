import { useEffect, useState } from "react";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import ProductCard from "@/components/shared/ProductCard";
import { useCategorySidebar } from "@/context/CategorySidebarContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 10;

const SECTION_TO_SORT = {
  "new-arrivals": "NEWEST",
  "most-rated": "MOST_RATED",
  "best-sellers": "BEST_SELLERS",
};

const SORT_OPTIONS = [
  { value: "NEWEST", label: "Newest" },
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
  { value: "MOST_RATED", label: "Top Rated" },
  { value: "BEST_SELLERS", label: "Best Sellers" },
];

export default function Shop() {
  const { categoryId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isFastDeliveryRoute = categoryId === "fast-delivery";
  const searchTerm = (searchParams.get("search") || "").toLowerCase();
  const section = searchParams.get("section") || null;

  const { selectedCategories, setSelectedCategories } = useCategorySidebar();

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [sort, setSort] = useState(SECTION_TO_SORT[section] || "NEWEST");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");

  // Default: filters are collapsed on page load
  const [showFilters, setShowFilters] = useState(false);

  // Rest of hooks unchanged...
  useEffect(() => {
    setSort(SECTION_TO_SORT[section] || "NEWEST");
    setCurrentPage(1);
  }, [section]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryId, selectedCategories, minPrice, maxPrice, minRating, sort]);

  useEffect(() => {
    if ((section || searchTerm) && selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
  }, [section, searchTerm, selectedCategories, setSelectedCategories]);

  useEffect(() => {
    return () => setSelectedCategories([]);
  }, [setSelectedCategories]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sort,
        });

        if (searchTerm) params.set("search", searchTerm);

        if (!isFastDeliveryRoute && selectedCategories.length > 0) {
          params.set("categoryIds", selectedCategories.join(","));
        }

        if (minPrice !== "") params.set("minPrice", minPrice);
        if (maxPrice !== "") params.set("maxPrice", maxPrice);
        if (minRating !== "") params.set("minRating", minRating);
        if (isFastDeliveryRoute) params.set("fastDelivery", "true");

        const res = await fetch(
          `${BASE_URL}/api/product/unified?${params.toString()}`,
          {
            credentials: 'include',
            headers: {
              'Accept': 'application/json'   // optional but good practice
            }
          }
        );
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
  }, [
    selectedCategories,
    categoryId,
    currentPage,
    searchTerm,
    sort,
    minPrice,
    maxPrice,
    minRating,
    isFastDeliveryRoute,
  ]);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
  };

  return (
    <div className="container mx-auto px-4 py-6" dir="ltr">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="w-full">
          {/* ===== TOGGLE BUTTON ===== */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 text-sm font-light tracking-wide text-neutral-600 hover:text-black transition-colors group"
            >
              <span className="uppercase text-[10px] tracking-[0.2em] text-neutral-400 group-hover:text-neutral-700">
                Filters
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 text-neutral-400 group-hover:text-neutral-700 ${
                  showFilters ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showFilters && (
              <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                Active filters
              </span>
            )}
          </div>

          {/* ===== FILTER BAR – collapsed by default ===== */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showFilters ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-6 mb-8 border-b border-neutral-200">
              {/* Desktop: grid layout */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 items-end">
                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="EGP"
                    className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="EGP"
                    className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                    Rating
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-white text-sm appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                    }}
                  >
                    <option value="">Any</option>
                    <option value="4">4★+</option>
                    <option value="3">3★+</option>
                    <option value="2">2★+</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                    Sort by
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-white text-sm appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3 flex items-end justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-neutral-400 hover:text-black transition-colors tracking-wide font-light underline-offset-2 hover:underline pb-2.5"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>

              {/* Mobile layout */}
              <div className="md:hidden space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="EGP"
                      className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="EGP"
                      className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                      Rating
                    </label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                      className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-white text-sm appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                      }}
                    >
                      <option value="">Any</option>
                      <option value="4">4★+</option>
                      <option value="3">3★+</option>
                      <option value="2">2★+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                      Sort by
                    </label>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-white text-sm appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                      }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-neutral-400 hover:text-black transition-colors tracking-wide font-light underline-offset-2 hover:underline py-2 text-center"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>

          {/* Products grid (unchanged) */}
          {loading ? (
            <p className="text-center text-neutral-500 text-sm tracking-wide uppercase py-10">
              Loading...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 py-10">{error}</p>
          ) : products.length === 0 ? (
            <div className="text-center py-12 border-t border-neutral-200 pt-8">
              <p className="text-neutral-500 text-lg font-light tracking-wide">
                No products found.
              </p>
              {searchTerm && (
                <p className="text-neutral-400 mt-2 text-sm">
                  No results found for "
                  <span className="font-medium text-neutral-800">{searchTerm}</span>"
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
                    "& .MuiPaginationItem-root": {
                      color: "#333",
                      border: "none",
                      "&:hover": { backgroundColor: "transparent", color: "#555" },
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "transparent",
                      borderBottom: "2px solid #1a1a1a",
                      borderRadius: "0",
                      color: "#1a1a1a",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "transparent",
                        borderBottomColor: "#1a1a1a",
                        color: "#1a1a1a",
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