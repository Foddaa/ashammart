import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDebounce } from "use-debounce";
import CardCategory from "@/components/HomeComponents/Furit&Veges/CardCategory";
import Card from "@/components/ShopCategoryCard/Card";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SearchResults() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rawQueryParam = new URLSearchParams(location.search).get("query");
  const rawQuery = typeof rawQueryParam === "string" ? rawQueryParam : "";

  const [debouncedQuery] = useDebounce(rawQuery.toLowerCase(), 300);

  useEffect(() => {
    const fetchProductsBySearch = async () => {
      if (!debouncedQuery.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${BASE_URL}/api/product/search?search=${debouncedQuery}`);
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsBySearch();
  }, [debouncedQuery]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <section className="container">
      <h2 className="text-xl font-semibold p-4">
        Search Results for: <span className="text-blue-600">{debouncedQuery}</span>
      </h2>

      {products.length === 0 ? (
        <p className="p-4 text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {products.map((product) => (
            <Card key={product.id} product={product} discount className="h-full" />
          ))}
        </div>
      )}
    </section>
  );
}
