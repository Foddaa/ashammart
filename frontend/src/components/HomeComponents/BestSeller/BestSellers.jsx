import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSeller } from "@/store/BestSeller/bestsellerslice";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive } from "@/constants";
import ProductCard from "@/components/shared/ProductCard";
import "swiper/css";

function BestSellers() {
  const { products, error } = useSelector((state) => state.bestSeller);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBestSeller());
  }, [dispatch]);

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20'/%3E%3C/svg%3E";

  if (error) {
    return (
      <div className="border border-red-400 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-3 max-w-md mx-auto mt-6">
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full" dir="ltr">
      <div className="md:py-2">
        
        {/* Editorial Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-8">
          <div>
            <h2 className="text-xl font-light tracking-wide text-neutral-900">
              Best Sellers
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Most requested by our customers, guaranteed quality.
            </p>
          </div>
        </div>

        {/* Products Carousel */}
        {!Array.isArray(products) || products.length === 0 ? (
          <div className="text-center text-neutral-400 text-sm tracking-wider uppercase py-10">
            No products found
          </div>
        ) : (
          <Carousel
            autoPlay
            responsive={responsive}
            infinite={true}
            containerClass="carousel-container"
            itemClass="px-1"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
}

export default BestSellers;