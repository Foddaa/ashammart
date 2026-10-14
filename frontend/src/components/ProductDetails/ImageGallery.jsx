import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';

const SWIPE_THRESHOLD = 50;
const SLIDE_MS = 450;

// Keyframes live here so the component works without touching tailwind.config
const SLIDE_STYLES = `
@keyframes gallery-in-right  { from { transform: translateX(100%);  } to { transform: translateX(0); } }
@keyframes gallery-in-left   { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes gallery-out-left  { from { transform: translateX(0); } to { transform: translateX(-100%); } }
@keyframes gallery-out-right { from { transform: translateX(0); } to { transform: translateX(100%);  } }
@keyframes gallery-fade      { from { opacity: 0; } to { opacity: 1; } }

.gallery-in-right  { animation: gallery-in-right  ${SLIDE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.gallery-in-left   { animation: gallery-in-left   ${SLIDE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.gallery-out-left  { animation: gallery-out-left  ${SLIDE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.gallery-out-right { animation: gallery-out-right ${SLIDE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.gallery-fade      { animation: gallery-fade 200ms ease-out both; }

@media (prefers-reduced-motion: reduce) {
  .gallery-in-right, .gallery-in-left,
  .gallery-out-left, .gallery-out-right,
  .gallery-fade { animation: none; }
}
`;

/* ────────────────────────────────────────────────────────────
   Shared hooks (used by both the inline gallery and the lightbox)
   ──────────────────────────────────────────────────────────── */

// Handles index changes + the slide direction / outgoing image
function useSlideNav({ images, index, setIndex, onChange }) {
  const [anim, setAnim] = useState(null); // { outUrl, dir, id }
  const timer = useRef(null);
  const counter = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  // dir: 1 = next (new image enters from right), -1 = previous
  const goTo = (newIndex, dir) => {
    if (newIndex === index || !images[newIndex]) return;
    clearTimeout(timer.current);
    counter.current += 1;
    setAnim({ outUrl: images[index].url, dir, id: counter.current });
    timer.current = setTimeout(() => setAnim(null), SLIDE_MS);
    setIndex(newIndex);
    onChange?.(newIndex);
  };

  const next = () => goTo((index + 1) % images.length, 1);
  const prev = () => goTo((index - 1 + images.length) % images.length, -1);
  const goToIndex = (i) => goTo(i, i > index ? 1 : -1);

  return { anim, next, prev, goToIndex };
}

// Touch swipe handlers
function useSwipe({ onNext, onPrev }) {
  const startX = useRef(null);
  const deltaX = useRef(0);

  return {
    onTouchStart: (e) => {
      startX.current = e.touches[0].clientX;
      deltaX.current = 0;
    },
    onTouchMove: (e) => {
      if (startX.current === null) return;
      deltaX.current = e.touches[0].clientX - startX.current;
    },
    onTouchEnd: () => {
      if (startX.current === null) return;
      if (deltaX.current > SWIPE_THRESHOLD) onPrev();
      else if (deltaX.current < -SWIPE_THRESHOLD) onNext();
      startX.current = null;
      deltaX.current = 0;
    },
  };
}

const slideClasses = (anim) => ({
  inClass: anim ? (anim.dir === 1 ? "gallery-in-right" : "gallery-in-left") : "",
  outClass: anim ? (anim.dir === 1 ? "gallery-out-left" : "gallery-out-right") : "",
});

/* ────────────────────────────────────────────────────────────
   Fullscreen lightbox
   ──────────────────────────────────────────────────────────── */

function Lightbox({ images, startIndex, title, onClose, onIndexChange }) {
  const [index, setIndex] = useState(startIndex);
  const { anim, next, prev, goToIndex } = useSlideNav({
    images,
    index,
    setIndex,
    onChange: onIndexChange,
  });
  const swipe = useSwipe({ onNext: next, onPrev: prev });
  const { inClass, outClass } = slideClasses(anim);
  const thumbRefs = useRef([]);

  // Keep latest handlers in a ref so the key listener is attached only once
  const actions = useRef({});
  actions.current = { next, prev, onClose };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") actions.current.onClose();
      if (e.key === "ArrowRight") actions.current.next();
      if (e.key === "ArrowLeft") actions.current.prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll while open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Keep the active thumbnail visible
  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [index]);

  const stop = (e) => e.stopPropagation();
  const many = images.length > 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} – image viewer`}
      className="gallery-fade fixed inset-0 z-[100] bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white shrink-0">
        <span className="text-sm tracking-wider text-white/70">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={(e) => {
            stop(e);
            onClose();
          }}
          className="p-2 text-white/80 hover:text-white border border-white/20 hover:border-white/60 transition-colors"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Stage */}
      <div
        className="relative flex-1 min-h-0 overflow-hidden touch-pan-y select-none"
        {...swipe}
      >
        {anim && (
          <div
            key={`out-${anim.id}`}
            className={`absolute inset-0 flex items-center justify-center px-4 md:px-20 pointer-events-none ${outClass}`}
          >
            <img
              src={anim.outUrl}
              alt=""
              draggable={false}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        <div
          key={`in-${index}-${anim?.id ?? 0}`}
          className={`absolute inset-0 flex items-center justify-center px-4 md:px-20 ${inClass}`}
        >
          <img
            src={images[index].url}
            alt={`${title} – image ${index + 1}`}
            draggable={false}
            onClick={stop}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {many && (
          <>
            <button
              onClick={(e) => {
                stop(e);
                prev();
              }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 text-white/80 hover:text-white border border-white/20 hover:border-white/60 bg-black/30 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeftIcon fontSize="large" />
            </button>
            <button
              onClick={(e) => {
                stop(e);
                next();
              }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 text-white/80 hover:text-white border border-white/20 hover:border-white/60 bg-black/30 transition-colors"
              aria-label="Next image"
            >
              <ChevronRightIcon fontSize="large" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {many && (
        <div
          className="shrink-0 flex gap-2 justify-start md:justify-center overflow-x-auto px-4 py-3"
          onClick={stop}
        >
          {images.map((img, i) => (
            <button
              key={img.url}
              ref={(el) => (thumbRefs.current[i] = el)}
              onClick={() => goToIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`shrink-0 w-14 h-14 border transition-all duration-300 ${
                i === index
                  ? "border-white opacity-100"
                  : "border-transparent opacity-40 hover:opacity-80"
              }`}
            >
              <img
                src={img.url}
                alt=""
                draggable={false}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}

/* ────────────────────────────────────────────────────────────
   Inline gallery
   ──────────────────────────────────────────────────────────── */

export default function ImageGallery({ images, mainImage, setMainImage, title }) {
  const initialIndex = images.findIndex((img) => img.url === mainImage);
  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { anim, next, prev, goToIndex } = useSlideNav({
    images,
    index: currentIndex,
    setIndex: setCurrentIndex,
    onChange: (i) => setMainImage(images[i].url),
  });
  const swipe = useSwipe({ onNext: next, onPrev: prev });
  const { inClass, outClass } = slideClasses(anim);

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
    preload(images[currentIndex]?.url);
    const nextIdx = (currentIndex + 1) % images.length;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    preload(images[nextIdx].url);
    preload(images[prevIdx].url);
  }, [currentIndex, images, preload]);

  // Warm the whole gallery in the background once, so every
  // dot/arrow click is served from cache no matter how far you jump.
  useEffect(() => {
    images.forEach((img) => preload(img.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // External change of mainImage (e.g. color selected, or lightbox navigation):
  // swap without sliding
  useEffect(() => {
    const idx = images.findIndex((img) => img.url === mainImage);
    if (idx !== -1) setCurrentIndex(idx);
  }, [mainImage, images]);

  // ── Smart dot rendering ──
  const renderDots = () => {
    const total = images.length;
    const MAX_DOTS = 5;

    if (total <= MAX_DOTS) {
      return images.map((_, idx) => (
        <button
          key={idx}
          onClick={() => goToIndex(idx)}
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
          onClick={() => goToIndex(item)}
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

  if (!images.length) return null;

  const currentImage = images[currentIndex] ?? images[0];
  const currentLoaded = loadedCache.current.has(currentImage.url);

  return (
    <div className="relative flex flex-col items-center justify-center w-full mt-2">
      <style>{SLIDE_STYLES}</style>

      {/* overflow-hidden keeps the sliding images inside the gallery frame */}
      <div
        className="w-full max-h-[600px] flex items-center justify-center relative overflow-hidden touch-pan-y select-none"
        {...swipe}
      >
        {!currentLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Outgoing image: slides away while the new one slides in */}
        {anim && (
          <div
            key={`out-${anim.id}`}
            className={`absolute inset-0 flex items-center justify-center pointer-events-none ${outClass}`}
          >
            <img
              src={anim.outUrl}
              className="object-contain w-full h-full max-h-[500px]"
              alt=""
              draggable={false}
            />
          </div>
        )}

        {/* Incoming / current image – click to open fullscreen */}
        <img
          key={`${currentIndex}-${anim?.id ?? 0}`}
          src={currentImage.url}
          className={`object-contain w-full h-full max-h-[500px] cursor-zoom-in transition-opacity duration-300 ${inClass} ${
            currentLoaded ? "opacity-100" : "opacity-0"
          }`}
          alt={title}
          loading="eager"
          draggable={false}
          onClick={() => setLightboxOpen(true)}
        />

        <button
          onClick={prev}
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
          onClick={next}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2
                     bg-transparent hover:bg-neutral-100/80
                     text-neutral-900 p-2 rounded-md transition-all
                     duration-200 z-10 border border-transparent
                     hover:border-neutral-200"
          aria-label="Next image"
        >
          <ChevronRightIcon />
        </button>

        {/* Fullscreen button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-1.5
                     bg-white/80 hover:bg-white text-neutral-900
                     border border-neutral-200 transition-colors"
          aria-label="View fullscreen"
        >
          <FullscreenIcon fontSize="small" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {renderDots()}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          startIndex={currentIndex}
          title={title}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={(i) => setMainImage(images[i].url)}
        />
      )}
    </div>
  );
}