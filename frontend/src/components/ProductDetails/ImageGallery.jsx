import { useState, useRef, useEffect, useCallback } from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SWIPE_THRESHOLD = 50;

export default function ImageGallery({ images, mainImage, setMainImage, title }) {
  const initialIndex = images.findIndex((img) => img.url === mainImage);
  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  // ── Image cache ──
  // Keyed by original URL -> true once the browser has fully loaded it.
  // We never re-request a URL that's already in this set; we just reuse
  // the cached network/decoded copy the browser already has in memory.
  const loadedCache = useRef(new Set());
  const [, forceRender] = useState(0); // trigger a re-render when a new image finishes loading

  // Preload an image exactly once and mark it as cached
  const preload = useCallback((url) => {
    if (!url || loadedCache.current.has(url)) return;
    const img = new Image();
    img.onload = () => {
      loadedCache.current.add(url);
      forceRender((n) => n + 1);
    };
    img.onerror = () => {
      // still mark as "attempted" so we don't hammer a broken URL repeatedly
      loadedCache.current.add(url);
    };
    img.src = url;
  }, []);

  // Preload the current image immediately, and the neighbors (prev/next)
  // so swiping/clicking dots feels instant and never re-fetches.
  useEffect(() => {
    if (!images.length) return;
    preload(images[currentIndex].url);
    const nextIdx = (currentIndex + 1) % images.length;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    preload(images[nextIdx].url);
    preload(images[prevIdx].url);
  }, [currentIndex, images, preload]);

  // Optional: warm the whole gallery in the background once, so every
  // dot/arrow click is served from cache no matter how far you jump.
  useEffect(() => {
    images.forEach((img) => preload(img.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  useEffect(() => {
    const idx = images.findIndex((img) => img.url === mainImage);
    if (idx !== -1) setCurrentIndex(idx);
  }, [mainImage, images]);

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setMainImage(images[newIndex].url);
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setMainImage(images[newIndex].url);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setMainImage(images[index].url);
  };

  // Swipe handling (unchanged)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    if (touchDeltaX.current > SWIPE_THRESHOLD) handlePrev();
    else if (touchDeltaX.current < -SWIPE_THRESHOLD) handleNext();
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // ── Smart dot rendering ──
  const renderDots = () => {
    const total = images.length;
    const MAX_DOTS = 5;

    if (total <= MAX_DOTS) {
      return images.map((_, idx) => (
        <button
          key={idx}
          onClick={() => handleDotClick(idx)}
          className={`rounded-full transition-all duration-300 shadow-sm ${
            currentIndex === idx
              ? "bg-white w-4 h-2"
              : "bg-white/60 hover:bg-white/90 w-2 h-2"
          }`}
          aria-label={`Go to image ${idx + 1}`}
        />
      ));
    }

    let start = Math.max(0, Math.min(currentIndex - 2, total - MAX_DOTS));
    const dots = [];

    if (start > 0) dots.push('ellipsis-left');
    for (let i = start; i < start + MAX_DOTS && i < total; i++) {
      dots.push(i);
    }
    if (start + MAX_DOTS < total) dots.push('ellipsis-right');

    return dots.map((item) => {
      if (item === 'ellipsis-left' || item === 'ellipsis-right') {
        return (
          <span key={item} className="text-white/60 text-xs px-1 select-none">
            …
          </span>
        );
      }
      return (
        <button
          key={item}
          onClick={() => handleDotClick(item)}
          className={`rounded-full transition-all duration-300 shadow-sm ${
            currentIndex === item
              ? "bg-white w-4 h-2 animate-dot-breathe"
              : "bg-white/60 hover:bg-white/90 w-2 h-2"
          }`}
          aria-label={`Go to image ${item + 1}`}
        />
      );
    });
  };

  const currentLoaded = loadedCache.current.has(images[currentIndex].url);

  return (
    <div className="relative flex flex-col items-center justify-center w-full mt-2">
      <div
        className="w-full max-h-[600px] flex items-center justify-center relative touch-pan-y select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!currentLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
          </div>
        )}

        <img
          src={images[currentIndex].url}
          className={`object-contain w-full h-full max-h-[500px] transition-opacity duration-300 ${
            currentLoaded ? "opacity-100" : "opacity-0"
          }`}
          alt={title}
          loading="eager"
          draggable={false}
        />

        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2
                     bg-transparent hover:bg-neutral-100/80
                     text-neutral-900 p-2 rounded-md transition-all
                     duration-200 z-10 border border-transparent
                     hover:border-neutral-200"
          aria-label="Previous image"
        >
          <ChevronLeftIcon />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2
                     bg-transparent hover:bg-neutral-100/80
                     text-neutral-900 p-2 rounded-md transition-all
                     duration-200 z-10 border border-transparent
                     hover:border-neutral-200"
          aria-label="Next image"
        >
          <ChevronRightIcon />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {renderDots()}
        </div>
      </div>
    </div>
  );
}