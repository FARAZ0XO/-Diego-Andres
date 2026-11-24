import { ArrowRight, Calendar, Clock, FileText, Utensils } from 'lucide-react';
import type { PageId } from '../types';
import { BANQUET_ROOMS, MENU_ITEMS, VENUE_CONTACT, VENUE_IMAGES } from '../data/venueData';
import { formatCurrency, isVenueOpenAt } from '../utils/hospitalityLogic';
import { SafeImage } from '../components/SafeImage';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const openStatus = isVenueOpenAt(new Date());
  const featuredDishes = MENU_ITEMS.filter((item) => item.featured);
  const flagshipHall = BANQUET_ROOMS[0];

  return (
    <div className="space-y-20 pb-8">
      {/* Architectural Hero Split */}
      <section className="max-w-[1200px] mx-auto px-6 pt-10 md:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between py-2 space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-medium tracking-wide text-[#495057]">
                {VENUE_CONTACT.addressLine1} · {VENUE_CONTACT.addressLine2}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] font-semibold tracking-tight text-[#14171A] [text-wrap:balance]">
                Wood-fired Northwest dining &amp; grand private banquets.
              </h1>
              <p className="text-base text-[#495057] leading-relaxed max-w-md">
                Alder &amp; Brass pairs an intimate evening dining room with a 220-seat timber banquet estate and bespoke regional catering.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('booking')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
                >
                  Reserve a Table
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('banquet')}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#14171A] hover:text-[#1B4332] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Explore Banquet Hall</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <p className="text-xs text-[#6C757D] leading-relaxed">
                {openStatus.headline} ·{' '}
                <span className="whitespace-nowrap">
                  {openStatus.todayRow.dayName}: {openStatus.todayRow.diningHours}
                </span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="h-full min-h-[280px] sm:min-h-[380px] rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#E9ECEF]">
              <SafeImage
                src={VENUE_IMAGES.diningHero}
                alt="Alder & Brass main dining room with emerald velvet banquettes and walnut tables at dusk"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Proof Strip */}
        <div className="mt-10 pt-8 border-t border-[#E5E7EB] grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="font-mono text-2xl font-medium text-[#14171A] tabular-nums">220</p>
            <p className="text-xs text-[#6C757D] mt-1">Seated Banquet Capacity</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[#14171A] tabular-nums">1,400+</p>
            <p className="text-xs text-[#6C757D] mt-1">Cellar Vintage Bottles</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[#14171A] tabular-nums">18</p>
            <p className="text-xs text-[#6C757D] mt-1">Willamette Farm Partners</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[#14171A] tabular-nums">Tue–Sun</p>
            <p className="text-xs text-[#6C757D] mt-1">Evening Dining &amp; Bar Service</p>
          </div>
        </div>
      </section>

      {/* Section 01: Seasonal Menu & Tasting Preview */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E5E7EB]">
              <SafeImage
                src={VENUE_IMAGES.signatureDish}
                alt="Herb-crusted seared duck breast with roasted figs and parsnip puree"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#6C757D]">01. Seasonal Kitchen</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#14171A] [text-wrap:balance]">
                Autumn harvest courses from hearth &amp; cellar.
              </h2>
            </div>

            <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
              {featuredDishes.map((dish) => (
                <div key={dish.id} className="py-4 flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl font-semibold text-[#14171A]">
                      {dish.name}
                    </h3>
                    <p className="text-sm text-[#495057]">{dish.description}</p>
                    <p className="text-xs text-[#6C757D]">
                      {dish.course}
                      {dish.dietary.length > 0 ? ` · ${dish.dietary.join(' · ')}` : ''}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-medium text-[#14171A] tabular-nums shrink-0 pt-1">
                    {formatCurrency(dish.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => onNavigate('menu')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:text-[#122E22] transition-colors cursor-pointer"
              >
                <Utensils className="w-4 h-4" aria-hidden="true" />
                <span>View Full Seasonal Menu</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('menu-kit')}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#495057] hover:text-[#14171A] transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Build Custom Menu Kit</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Grand Banquet Facility */}
      <section className="bg-white border-y border-[#E5E7EB] py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
            <p className="text-xs font-medium text-[#6C757D]">02. Private Estate Events</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#14171A] [text-wrap:balance]">
              {flagshipHall.name} &amp; two private architectural suites.
            </h2>
            <p className="text-base text-[#495057] leading-relaxed">
              {flagshipHall.summary}
            </p>
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#E5E7EB]">
              <div>
                <p className="font-mono text-lg font-medium text-[#14171A] tabular-nums">
                  {flagshipHall.seatedCapacity}
                </p>
                <p className="text-xs text-[#6C757D]">Seated Gala</p>
              </div>
              <div>
                <p className="font-mono text-lg font-medium text-[#14171A] tabular-nums">
                  {flagshipHall.receptionCapacity}
                </p>
                <p className="text-xs text-[#6C757D]">Standing Reception</p>
              </div>
              <div>
                <p className="font-mono text-lg font-medium text-[#14171A] tabular-nums">
                  {flagshipHall.areaSqFt.toLocaleString()} sq ft
                </p>
                <p className="text-xs text-[#6C757D]">Timber Hall</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('banquet')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors cursor-pointer"
              >
                Inspect Banquet Spaces
              </button>
              <button
                type="button"
                onClick={() => onNavigate('gallery')}
                className="text-sm font-medium text-[#495057] hover:text-[#14171A] transition-colors cursor-pointer"
              >
                Browse Event Gallery
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="aspect-[16/10] rounded-xl overflow-hidden border border-[#E5E7EB]">
              <SafeImage
                src={VENUE_IMAGES.banquetHall}
                alt="The Grand Timber Hall dressed in white linens and taper candles for a gala dinner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Catering, Hours, Menu Kit & Contact Directory */}
      <section className="max-w-[1200px] mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#6C757D]">03. Hospitality Services</p>
            <h2 className="font-display text-3xl font-semibold text-[#14171A] mt-1">
              Plan an off-site feast, visit the house, or assemble your kit.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="text-sm font-semibold text-[#1B4332] hover:text-[#122E22] whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Read Our Story &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col justify-between">
            <div>
              <div className="aspect-[4/3] overflow-hidden border-b border-[#E5E7EB]">
                <SafeImage
                  src={VENUE_IMAGES.cateringSpread}
                  alt="Artisanal catering harvest spread with sourdough and roasted vegetables"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-display text-2xl font-semibold text-[#14171A]">
                  Off-Site Catering
                </h3>
                <p className="text-sm text-[#495057] leading-relaxed">
                  Seated galas, limestone grazing tables, and staffed cocktail receptions across Portland from $46 per guest.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                type="button"
                onClick={() => onNavigate('catering')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#122E22] cursor-pointer"
              >
                <span>Explore Catering Packages</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </article>

          <article className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <FileText className="w-5 h-5 text-[#1B4332]" aria-hidden="true" />
              <h3 className="font-display text-2xl font-semibold text-[#14171A]">
                Custom Menu Kit
              </h3>
              <p className="text-sm text-[#495057] leading-relaxed">
                Curate dishes for your reception or corporate dinner, calculate per-guest totals with wine pairings, and print or download a client-ready tasting brochure.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('menu-kit')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#122E22] cursor-pointer"
            >
              <span>Open Menu Kit Builder</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </article>

          <article className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <Clock className="w-5 h-5 text-[#1B4332]" aria-hidden="true" />
              <h3 className="font-display text-2xl font-semibold text-[#14171A]">
                Visiting Hours &amp; Concierge
              </h3>
              <p className="text-sm text-[#495057] leading-relaxed">
                Dinner service runs Tuesday through Sunday with bar pours beginning at 4:00 PM on weekends. Valet parking opens nightly at 5:00 PM.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => onNavigate('hours')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#122E22] cursor-pointer"
              >
                <span>See Visiting Hours</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#495057] hover:text-[#14171A] cursor-pointer"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Contact Us</span>
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* Proof / Attributable Guest Testimonials */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <blockquote className="space-y-4">
            <p className="font-display text-2xl text-[#14171A] leading-snug">
              “Moving our 180-person architectural awards dinner to the Grand Timber Hall cut event coordination time in half—every plated course arrived hot within twelve minutes.”
            </p>
            <footer className="text-xs text-[#6C757D]">
              Hannah Lindqvist, Director of Events · Northwest Design Council
            </footer>
          </blockquote>
          <blockquote className="space-y-4">
            <p className="font-display text-2xl text-[#14171A] leading-snug">
              “Their Menu Kit planner let us finalize gluten-free and vegetarian pairings with our family weeks ahead, and the Conservatory felt effortlessly candlelit.”
            </p>
            <footer className="text-xs text-[#6C757D]">
              David &amp; Priya Nair · Autumn Reception Hosts (82 Guests)
            </footer>
          </blockquote>
        </div>
      </section>
    </div>
  );
}
