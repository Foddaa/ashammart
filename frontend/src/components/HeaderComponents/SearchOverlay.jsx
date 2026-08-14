import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PLACEHOLDER_IMAGE } from "@/utils/productDisplay"; // Import your placeholder

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RECENT_KEY = "dodo_recent_searches";
const MAX_RECENT = 6;

export default function SearchOverlay({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]); // product suggestions
  const [terms, setTerms] = useState([]);              // matching search terms
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // ✅ Helper to construct the full image URL (matches your ProductCard logic)
  const getSearchImageUrl = (product) => {
    if (!product?.imageUrl) return PLACEHOLDER_IMAGE;
    // If it's an absolute URL, return it as-is
    if (product.imageUrl.startsWith("http://") || product.imageUrl.startsWith("https://")) {
      return product.imageUrl;
    }
    // Ensure there's exactly one `/` before the path
    const path = product.imageUrl.startsWith("/") ? product.imageUrl : `/${product.imageUrl}`;
    return `${BASE_URL}/api${path}`;
  };

  // Helper to format EGP
  const formatPrice = (value) => {
    if (value == null || isNaN(value)) return "0";
    return Math.trunc(value).toLocaleString("en-US");
  };

  // Load recent searches from localStorage + fetch trending on first open
  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      setRecent(stored);
    } catch {
      setRecent([]);
    }

    fetch(`${BASE_URL}/api/search/trending`)
      .then((res) => (res.ok ? res.json() : { terms: [] }))
      .then((data) => setTrending(data.terms || []))
      .catch(() => setTrending([]));

    // autofocus when overlay opens
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  // Reset state fully on close
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSuggestions([]);
      setTerms([]);
      setActiveIndex(-1);
      setLoading(false);
    }
  }, [isOpen]);

  // Debounced live suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      setTerms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query.trim());
    }, 250); // debounce window

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const fetchSuggestions = useCallback(async (q) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(
        `${BASE_URL}/api/search/suggestions?q=${encodeURIComponent(q)}&limit=6`,
        { signal: controller.signal }
      );
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.products || []);
        setTerms(data.terms || []);
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Search suggestion error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRecent = (term) => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const updated = [term, ...stored.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // localStorage unavailable — non-fatal
    }
  };

  const runSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    saveRecent(trimmed);
    onClose();
    navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
  };

  const goToProduct = (product) => {
    saveRecent(query.trim());
    onClose();
    navigate(`/product/${product.slug || product.id}`);
  };

  const flatResults = [...terms.map((t) => ({ type: "term", value: t })), ...suggestions.map((p) => ({ type: "product", value: p }))];

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && flatResults[activeIndex]) {
        const item = flatResults[activeIndex];
        item.type === "term" ? runSearch(item.value) : goToProduct(item.value);
      } else {
        runSearch(query);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-[fadeIn_0.15s_ease-out]">
      {/* Top bar: input + close */}
      <div className="border-b border-black/10">
        <div className="container mx-auto px-4 md:px-6 h-[80px] flex items-center gap-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-black/50">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="flex-1 h-full bg-transparent text-lg md:text-xl text-black placeholder-black/40 outline-none"
            aria-label="Search"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="text-black/40 hover:text-black transition-colors text-sm shrink-0"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 hover:bg-black/5 transition-colors shrink-0"
            aria-label="Close search"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 md:px-6 py-6 max-w-2xl">

          {/* Empty state: recent + trending */}
          {!query && (
            <div className="space-y-8">
              {recent.length > 0 && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium mb-3">Recent searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <button
                        key={term}
                        onClick={() => runSearch(term)}
                        className="px-3 py-1.5 border border-black/15 text-sm hover:bg-black/5 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {trending.length > 0 && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium mb-3">Trending</h3>
                  <div className="flex flex-wrap gap-2">
                    {trending.map((term) => (
                      <button
                        key={term}
                        onClick={() => runSearch(term)}
                        className="px-3 py-1.5 border border-black/15 text-sm hover:bg-black/5 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {recent.length === 0 && trending.length === 0 && (
                <p className="text-black/40 text-sm">Start typing to search products.</p>
              )}
            </div>
          )}

          {/* Loading */}
          {query && loading && (
            <p className="text-black/40 text-sm">Searching...</p>
          )}

          {/* No results */}
          {query && !loading && flatResults.length === 0 && (
            <p className="text-black/40 text-sm">No results for "{query}". Try a different search.</p>
          )}

          {/* Matching terms */}
          {!loading && terms.length > 0 && (
            <div className="mb-6">
              {terms.map((term, i) => (
                <button
                  key={term}
                  onClick={() => runSearch(term)}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${activeIndex === i ? "bg-black/5" : "hover:bg-black/5"}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/30 shrink-0">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span className="text-sm">{term}</span>
                </button>
              ))}
            </div>
          )}

          {/* Product suggestions - updated image and currency */}
          {!loading && suggestions.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium mb-3">Products</h3>
              <div className="space-y-1">
                {suggestions.map((product, i) => {
                  const idx = terms.length + i;
                  return (
                    <button
                      key={product.id}
                      onClick={() => goToProduct(product)}
                      className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${activeIndex === idx ? "bg-black/5" : "hover:bg-black/5"}`}
                    >
                      <img
                        src={getSearchImageUrl(product)}
                        alt={product.name}
                        className="w-12 h-12 object-cover bg-black/5 shrink-0 border border-black/5"
                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm truncate font-light tracking-wide text-neutral-900">{product.name}</p>
                        {product.price != null && (
                          <p className="text-xs text-neutral-500 font-medium">
                            EGP {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => runSearch(query)}
                className="mt-4 text-sm underline text-black/60 hover:text-black transition-colors"
              >
                See all results for "{query}"
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}