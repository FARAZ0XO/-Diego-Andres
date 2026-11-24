import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryCategory, GalleryItem } from '../types';
import { GALLERY_ITEMS } from '../data/venueData';
import { SafeImage } from '../components/SafeImage';

const GALLERY_CATEGORIES: GalleryCategory[] = [
  'All',
  'Dining Room',
  'Banquet Hall',
  'Culinary',
  'Catering',
];

export function GalleryPage() {
  const [category, setCategory] = useState<GalleryCategory>('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visibleItems = GALLERY_ITEMS.filter(
    (item) => category === 'All' || item.category === category
  );

  const activeItem: GalleryItem | null =
    activeIndex !== null && visibleItems[activeIndex] ? visibleItems[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveIndex(null);
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % visibleItems.length
        );
      } else if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + visibleItems.length) % visibleItems.length
        );
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, visibleItems.length]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5E7EB] pb-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-medium text-[#6C757D]">Editorial Archive</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#14171A] [text-wrap:balance]">
            Rooms, Evening Service &amp; Harvest Tables
          </h1>
          <p className="text-base text-[#495057] leading-relaxed">
            Select any photograph to open the full-resolution gallery viewer.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter gallery photos"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#E9ECEF] rounded-lg self-start md:self-auto"
        >
          {GALLERY_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setCategory(cat);
                  setActiveIndex(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-white text-[#14171A] shadow-xs'
                    : 'text-[#495057] hover:text-[#14171A]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Photography Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleItems.map((item, idx) => (
          <figure
            key={item.id}
            className={`bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col ${
              item.spanWide && category === 'All' ? 'md:col-span-2' : 'md:col-span-1'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Inspect photograph: ${item.title}`}
              className="group relative aspect-[16/10] w-full overflow-hidden bg-[#E9ECEF] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            >
              <SafeImage
                src={item.imageUrl}
                alt={item.imageAlt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </button>
            <figcaption className="p-5 space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs text-[#6C757D]">
                <span>{item.category}</span>
                <span>{item.dateLabel}</span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-[#14171A]">
                {item.title}
              </h2>
              <p className="text-sm text-[#495057]">{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeItem && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 bg-[#0B0D0F]/95 flex flex-col justify-between p-4 sm:p-8"
        >
          <div className="flex items-center justify-between text-white">
            <div className="text-xs text-white/75">
              {activeItem.category} · {activeItem.dateLabel} ({activeIndex + 1} /{' '}
              {visibleItems.length})
            </div>
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close gallery viewer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 min-h-0">
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (activeIndex - 1 + visibleItems.length) % visibleItems.length
                )
              }
              aria-label="Previous photograph"
              className="absolute left-2 sm:left-4 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="max-w-5xl max-h-full flex items-center justify-center overflow-hidden rounded-lg">
              <SafeImage
                src={activeItem.imageUrl}
                alt={activeItem.imageAlt}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>

            <button
              type="button"
              onClick={() => setActiveIndex((activeIndex + 1) % visibleItems.length)}
              aria-label="Next photograph"
              className="absolute right-2 sm:right-4 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-1 text-white">
            <h3 className="font-display text-2xl font-semibold">{activeItem.title}</h3>
            <p className="text-sm text-white/80">{activeItem.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
