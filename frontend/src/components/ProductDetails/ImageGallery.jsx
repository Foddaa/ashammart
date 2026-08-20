import { useState, useRef } from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SWIPE_THRESHOLD = 50; // px — minimum drag distance to count as a swipe

export default function ImageGallery({ images, mainImage, setMainImage, title }) {
  // Determine initial index based on the mainImage URL passed from parent
  const initialIndex = images.findIndex((img) => img.url === mainImage);
  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setMainImage(images[newIndex].url); // Keeps parent state in sync for the Lightbox
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

  // ── Swipe handling ──
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

    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      handlePrev(); // swiped right → previous image
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      handleNext(); // swiped left → next image
    }

    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
  <div className="relative flex flex-col items-center justify-center w-full mt-2">
    
    {/* Main Image Container */}
    <div
      className="w-full max-h-[600px] flex items-center justify-center relative touch-pan-y select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={images[currentIndex].url}
        className="object-contain w-full h-full max-h-[500px] transition-all duration-300"
        alt={title}
        loading="lazy"
        draggable={false}
      />

      {/* Left Arrow */}
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

      {/* Right Arrow */}
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

      {/* Dots INSIDE image */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`rounded-full transition-all duration-300 shadow-sm ${
              currentIndex === index
                ? "bg-white w-4 h-2"
                : "bg-white/60 hover:bg-white/90 w-2 h-2"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
);
}