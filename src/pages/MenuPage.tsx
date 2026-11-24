import { useState } from 'react';
import { Check, FileText, Plus } from 'lucide-react';
import type { DietaryTag, MenuCourse, PageId } from '../types';
import { MENU_ITEMS } from '../data/venueData';
import { formatCurrency } from '../utils/hospitalityLogic';

interface MenuPageProps {
  selectedKitIds: string[];
  onToggleKitItem: (itemId: string) => void;
  onNavigate: (page: PageId) => void;
}

const COURSES: Array<'All' | MenuCourse> = ['All', 'Starters', 'Mains', 'Desserts', 'Cellar'];
const DIETARY_FILTERS: DietaryTag[] = ['Vegetarian', 'Gluten-Free', 'Dairy-Free'];

export function MenuPage({ selectedKitIds, onToggleKitItem, onNavigate }: MenuPageProps) {
  const [activeCourse, setActiveCourse] = useState<'All' | MenuCourse>('All');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryTag | null>(null);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCourse = activeCourse === 'All' || item.course === activeCourse;
    const matchesDietary = !dietaryFilter || item.dietary.includes(dietaryFilter);
    return matchesCourse && matchesDietary;
  });

  const coursesToRender: MenuCourse[] =
    activeCourse === 'All'
      ? ['Starters', 'Mains', 'Desserts', 'Cellar']
      : [activeCourse];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5E7EB] pb-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-medium text-[#6C757D]">Autumn / Winter 2026</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#14171A] [text-wrap:balance]">
            Seasonal Dining Room &amp; Cellar Menu
          </h1>
          <p className="text-base text-[#495057] leading-relaxed">
            Menus print daily based on coastal catch and Willamette Valley harvests. Add any dish directly to your custom Menu Kit to estimate private event pricing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('menu-kit')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#1B4332] bg-white border border-[#1B4332] hover:bg-[#1B4332]/5 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>Menu Kit ({selectedKitIds.length} selected)</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('booking')}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            Reserve a Table
          </button>
        </div>
      </div>

      {/* Interactive Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter menu by course"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#E9ECEF] rounded-lg self-start"
        >
          {COURSES.map((course) => {
            const active = activeCourse === course;
            return (
              <button
                key={course}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCourse(course)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-white text-[#14171A] shadow-xs'
                    : 'text-[#495057] hover:text-[#14171A]'
                }`}
              >
                {course}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#6C757D] mr-1">Dietary:</span>
          {DIETARY_FILTERS.map((tag) => {
            const active = dietaryFilter === tag;
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => setDietaryFilter(active ? null : tag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                    : 'bg-white text-[#495057] border-[#DEE2E6] hover:border-[#ADB5BD]'
                }`}
              >
                {tag}
              </button>
            );
          })}
          {dietaryFilter && (
            <button
              type="button"
              onClick={() => setDietaryFilter(null)}
              className="text-xs font-medium text-[#6C757D] hover:text-[#14171A] underline ml-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Menu Listings */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-2xl text-[#14171A]">
            No dishes match that combination of filters.
          </p>
          <p className="text-sm text-[#495057]">
            Our kitchen gladly adapts most plates to dietary needs upon request.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCourse('All');
              setDietaryFilter(null);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] rounded-md cursor-pointer"
          >
            Reset Menu Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {coursesToRender.map((courseName) => {
            const itemsInCourse = filteredItems.filter((i) => i.course === courseName);
            if (itemsInCourse.length === 0) return null;

            return (
              <section key={courseName} className="space-y-5">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#14171A] border-b border-[#E5E7EB] pb-3">
                  {courseName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itemsInCourse.map((item) => {
                    const inKit = selectedKitIds.includes(item.id);
                    return (
                      <article
                        key={item.id}
                        className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-display text-2xl font-semibold text-[#14171A]">
                              {item.name}
                            </h3>
                            <span className="font-mono text-base font-medium text-[#14171A] tabular-nums shrink-0 pt-1">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                          <p className="text-sm text-[#495057] leading-relaxed">
                            {item.description}
                          </p>
                          <p className="text-xs text-[#6C757D] pt-1">
                            Pairing: {item.pairingNote}
                            {item.dietary.length > 0
                              ? ` · ${item.dietary.join(' · ')}`
                              : ''}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#F1F3F5] flex items-center justify-between">
                          <span className="text-xs text-[#6C757D]">{item.course}</span>
                          <button
                            type="button"
                            onClick={() => onToggleKitItem(item.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                              inKit
                                ? 'bg-[#1B4332] text-white'
                                : 'bg-[#F8F9FA] text-[#14171A] border border-[#DEE2E6] hover:bg-[#E9ECEF]'
                            }`}
                          >
                            {inKit ? (
                              <>
                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Added to Menu Kit</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Add to Menu Kit</span>
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
