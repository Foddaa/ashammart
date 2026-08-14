import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive } from "@/constants";
import actionNewArrivals from "@/components/HomeComponents/NewArrivals/actionNewArrivals";
import ProductCard from "@/components/shared/ProductCard";

function NewArrivals() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.newArrivals);

  useEffect(() => {
    dispatch(actionNewArrivals());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="w-full py-8 text-center text-neutral-400 text-sm tracking-wider">
        Loading new arrivals...
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-400 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-3 max-w-md mx-auto mt-6">
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full" dir="ltr">
      <div className="md:py-2">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-8">
          <div>
            <h2 className="text-xl font-light tracking-wide text-neutral-900">New Arrivals</h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Fresh drops, just added to the collection.
            </p>
          </div>
          <button
            onClick={() => navigate("/shop?section=new-arrivals")}
            className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            See all
          </button>
        </div>

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

export default NewArrivals;