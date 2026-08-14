import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/shared/ProductCard";
import api from "@/api/axiosInstance";
import { removeFavorite } from "@/services/favoriteService";

const LIMIT = 10;

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchFavorites = useCallback(async (pageNum) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/favorites", {
        params: { page: pageNum, limit: LIMIT },
      });
      setFavorites(res.data.products);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setError("Couldn't load your favorites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites(1);
  }, [fetchFavorites]);

  const handleRemove = async (id) => {
    if (removingId) return; // guard against double-clicks
    setRemovingId(id);

    const prevFavorites = favorites;
    setFavorites((prev) => prev.filter((item) => item.id !== id)); // optimistic

    try {
      await removeFavorite(id);
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      setFavorites(prevFavorites); // rollback
    } finally {
      setRemovingId(null);
    }
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    fetchFavorites(nextPage);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12 px-4 md:px-6" dir="ltr">
      <div className="container mx-auto max-w-7xl">

        {/* Minimal Luxury Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-light tracking-wide text-neutral-900">
              Favorites
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Your saved items
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white border border-neutral-200 p-12 md:p-20 text-center">
            <p className="text-neutral-500">{error}</p>
            <button
              onClick={() => fetchFavorites(page)}
              className="mt-6 px-6 py-2.5 bg-transparent border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors text-[10px] uppercase tracking-wider"
            >
              Retry
            </button>
          </div>
        ) : favorites.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-neutral-200 p-12 md:p-20 text-center">
            <div className="flex flex-col items-center justify-center text-neutral-400">
              <div className="w-16 h-16 border-2 border-neutral-200 rounded-full flex items-center justify-center mb-4 text-neutral-300">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  <line x1="22" y1="22" x2="17.65" y2="17.65"></line>
                </svg>
              </div>
              <p className="text-lg font-light tracking-wide text-neutral-500">Your favorites are empty</p>
              <p className="text-sm text-neutral-400 mt-1">Explore our collection and save items you love.</p>
              <Link
                to="/shop"
                className="mt-6 px-6 py-2.5 bg-transparent border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors text-[10px] uppercase tracking-wider w-full sm:w-auto"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Favorites Grid with Remove Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {favorites.map((item) => (
                <div key={item.id} className="relative group">
                  <ProductCard product={item} className="h-full" />

                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removingId === item.id}
                    className="absolute top-2 right-2 z-20 bg-white border border-neutral-200 w-7 h-7 flex items-center justify-center hover:bg-neutral-100 transition-colors shadow-sm disabled:opacity-50"
                    aria-label="Remove from favorites"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 border border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-neutral-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}