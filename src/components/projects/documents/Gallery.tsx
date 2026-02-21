/**
 * Gallery.tsx
 * /components/projects/documents/Gallery.tsx
 *
 * Reusable, JSON-driven gallery component for use inside DocumentationPage sections.
 * Follows the existing purple/gray dark design system exactly.
 *
 * Usage:
 *   import Gallery from '@/components/projects/documents/Gallery';
 *   <Gallery images={data.gallery} />
 *
 * JSON Integration:
 *   Add a "gallery" array to any project JSON following the GalleryItem schema.
 */

'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  KeyboardEvent,
  MouseEvent,
} from 'react';

// ─── TypeScript Interfaces ─────────────────────────────────────────────────────

export interface GalleryMeta {
  [key: string]: string | number | boolean;
}

export interface GalleryItem {
  id: string | number;
  src: string;
  alt: string;
  title: string;
  description: string;
  meta?: GalleryMeta;
}

interface GalleryProps {
  images: GalleryItem[];
  title?: string;
  ismobile?:boolean;
}

interface GalleryGridProps {
  images: GalleryItem[];
  onSelect: (index: number) => void;
  isMobile?: boolean;
}

interface GalleryItemProps {
  item: GalleryItem;
  index: number;
  onSelect: (index: number) => void;
  isMobile?: boolean;
}

interface GalleryOverlayProps {
  images: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

interface GalleryModalContentProps {
  item: GalleryItem;
}

interface GalleryNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
}

// ─── GalleryItem (single grid cell) ───────────────────────────────────────────

const GalleryItemCard = memo(({ item, index, onSelect ,isMobile }: GalleryItemProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(index);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title}`}
      onClick={() => onSelect(index)}
      onKeyDown={handleKeyDown}
      className="
        group relative overflow-hidden rounded-lg cursor-pointer
        border-2 border-purple-500/30
        bg-gradient-to-br from-purple-900/20 to-blue-900/20
        hover:border-purple-400/60 transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950
        aspect-square
      "
    >
      {/* Loading skeleton */}
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 bg-purple-900/20 animate-pulse rounded-lg" />
      )}

      {/* Broken image fallback */}
      {imgError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <div className="text-purple-400 opacity-50">
            <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-500">{item.alt}</p>
        </div>
      ) : (
<img
  src={item.src}
  alt={item.alt}
  loading="lazy"
  onLoad={() => setImgLoaded(true)}
  onError={() => {
    setImgError(true);
    setImgLoaded(true);
  }}
className={`
  w-full h-full
  ${isMobile ? 'object-contain' : 'object-cover'}
  transition-all duration-500
  group-hover:scale-105
  ${imgLoaded ? 'opacity-100' : 'opacity-0'}
`}
/>
      )}

      {/* Hover overlay with title */}
      <div className="
        absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        flex flex-col justify-end p-3
      ">
        <p className="text-white text-sm font-semibold leading-tight truncate">
          {item.title}
        </p>
        {item.description && (
          <p className="text-gray-300 text-xs mt-1 line-clamp-2 leading-snug">
            {item.description}
          </p>
        )}
      </div>

      {/* View icon badge */}
      <div className="
        absolute top-2 right-2
        w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm
        flex items-center justify-center
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
      ">
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </div>
    </div>
  );
});
GalleryItemCard.displayName = 'GalleryItemCard';

// ─── GalleryGrid ───────────────────────────────────────────────────────────────

const GalleryGrid = memo(({ images, onSelect, isMobile }: GalleryGridProps) => (
  <div
    className={`
      grid gap-4
      ${isMobile
        ? 'grid-cols-2'
        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}
    `}
    role="list"
    aria-label="Image gallery"
  >
    {images.map((item, index) => (
      <div key={item.id} role="listitem">
<GalleryItemCard
  item={item}
  index={index}
  onSelect={onSelect}
  isMobile={isMobile}
/>      </div>
    ))}
  </div>
));
GalleryGrid.displayName = 'GalleryGrid';

// ─── GalleryModalContent ───────────────────────────────────────────────────────

const GalleryModalContent = memo(({ item }: GalleryModalContentProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset states when item changes
  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [item.id]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Image panel */}
      <div className="flex-1 relative min-h-[240px] lg:min-h-0 rounded-lg overflow-hidden bg-black/30">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-purple-900/20 animate-pulse" />
        )}
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg className="w-16 h-16 text-purple-400 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 text-sm">{item.alt}</p>
          </div>
        ) : (
            <img
            src={item.src}
            alt={item.alt}
            loading="eager"
            onLoad={() => setImgLoaded(true)}
            onError={() => {
                setImgError(true);
                setImgLoaded(true);
            }}
            className={`
                w-full h-full
                object-contain
                transition-opacity duration-300
                ${imgLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            />
        )}
      </div>

      {/* Detail panel */}
      <div className="lg:w-72 flex flex-col gap-4 flex-shrink-0">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-gray-300 leading-relaxed text-sm">{item.description}</p>
        </div>

        {/* Metadata */}
        {item.meta && Object.keys(item.meta).length > 0 && (
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-purple-400 mb-3 text-sm">Details</h4>
            <div className="space-y-2">
              {Object.entries(item.meta).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-500 capitalize flex-shrink-0">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-gray-300 text-right">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
GalleryModalContent.displayName = 'GalleryModalContent';

// ─── GalleryNavigation ─────────────────────────────────────────────────────────

const GalleryNavigation = memo(({ onPrev, onNext, currentIndex, total }: GalleryNavigationProps) => (
  <div className="flex items-center justify-between mt-5 pt-4 border-t border-purple-500/20">
    <button
      onClick={onPrev}
      aria-label="Previous image"
      className="
        flex items-center gap-2 px-4 py-2 rounded-lg
        border border-purple-500/30 text-gray-300
        hover:border-purple-400/60 hover:text-purple-300 hover:bg-purple-900/20
        transition-all duration-200 text-sm
        focus:outline-none focus:ring-2 focus:ring-purple-500
        disabled:opacity-40 disabled:cursor-not-allowed
      "
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Previous
    </button>

    <span className="text-gray-500 text-sm font-mono">
      {currentIndex + 1} / {total}
    </span>

    <button
      onClick={onNext}
      aria-label="Next image"
      className="
        flex items-center gap-2 px-4 py-2 rounded-lg
        border border-purple-500/30 text-gray-300
        hover:border-purple-400/60 hover:text-purple-300 hover:bg-purple-900/20
        transition-all duration-200 text-sm
        focus:outline-none focus:ring-2 focus:ring-purple-500
      "
    >
      Next
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
));
GalleryNavigation.displayName = 'GalleryNavigation';

// ─── GalleryOverlay (modal) ────────────────────────────────────────────────────

const GalleryOverlay = memo(({ images, activeIndex, onClose, onNext, onPrev }: GalleryOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeItem = images[activeIndex];

  // Scroll lock
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  // Focus management — focus close button on open
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape': onClose(); break;
        case 'ArrowRight': onNext(); break;
        case 'ArrowLeft': onPrev(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modal.querySelectorAll<HTMLElement>(focusableSelectors);
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    const trapFocus = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };

    modal.addEventListener('keydown', trapFocus);
    return () => modal.removeEventListener('keydown', trapFocus);
  }, []);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!activeItem) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image detail: ${activeItem.title}`}
      onClick={handleBackdropClick}
      className="
        fixed inset-0 z-[9999] flex items-center justify-center p-4
        bg-black/80 backdrop-blur-sm
        animate-in fade-in duration-200
      "
      style={{ animation: 'galleryFadeIn 0.2s ease-out' }}
    >
      <div
        ref={modalRef}
        className="
          relative w-full max-w-4xl max-h-[90vh] overflow-y-auto
          bg-gray-900 border border-purple-500/30 rounded-lg p-6
        "
        style={{ animation: 'galleryScaleIn 0.2s ease-out' }}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close gallery"
          className="
            absolute top-4 right-4 z-10
            w-9 h-9 rounded-full flex items-center justify-center
            bg-gray-800 border border-purple-500/30 text-gray-400
            hover:border-purple-400/60 hover:text-white hover:bg-purple-900/30
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-purple-500
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal content */}
        <GalleryModalContent item={activeItem} />

        {/* Navigation */}
        <GalleryNavigation
          onPrev={onPrev}
          onNext={onNext}
          currentIndex={activeIndex}
          total={images.length}
        />
      </div>

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes galleryFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes galleryScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
});
GalleryOverlay.displayName = 'GalleryOverlay';

// ─── Empty State ───────────────────────────────────────────────────────────────

const GalleryEmptyState = () => (
  <div className="h-48 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-purple-500/20 bg-purple-900/10">
    <svg className="w-12 h-12 text-purple-400 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <p className="text-sm text-gray-500">No images to display</p>
  </div>
);

// ─── Main Gallery Component ────────────────────────────────────────────────────

/**
 * Gallery
 *
 * @param images  Array of GalleryItem objects (from JSON or props)
 * @param title   Optional section title (defaults to "Gallery")
 *
 * @example
 * // In DocumentationPage or any section component:
 * import Gallery from '@/components/projects/documents/Gallery';
 *
 * <Gallery images={data.gallery} title="Screenshots" />
 */
const Gallery = ({ images,ismobile=false, title = 'Gallery' }: GalleryProps) => {
  console.log(images)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;

  // Guard: ensure images is a valid array
  const safeImages: GalleryItem[] = Array.isArray(images) ? images : [];

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % safeImages.length));
  }, [activeIndex, safeImages.length]);

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) =>
      prev === null ? 0 : (prev - 1 + safeImages.length) % safeImages.length
    );
  }, [activeIndex, safeImages.length]);

  return (
    <>
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          {/* Gallery icon */}
          <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
        </div>

<div
  className={`
    ${ismobile
      ? 'p-2'
      : 'bg-gray-900/50 border border-purple-500/20 rounded-lg p-8'}
  `}
>          {safeImages.length > 0 ? (
            <>
              <p className="text-gray-400 text-sm mb-6">
                {safeImages.length} image{safeImages.length !== 1 ? 's' : ''} — click any to expand
              </p>
<GalleryGrid
  images={safeImages}
  onSelect={handleSelect}
  isMobile={ismobile}
/>            </>
          ) : (
            <GalleryEmptyState />
          )}
        </div>
      </section>

      {/* Overlay portal — rendered outside section to avoid stacking context issues */}
      {isOpen && activeIndex !== null && (
        <GalleryOverlay
          images={safeImages}
          activeIndex={activeIndex}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
};

export default Gallery;

