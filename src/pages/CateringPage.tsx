import { useState } from 'react';
import { Check, FileText } from 'lucide-react';
import type { PageId } from '../types';
import { CATERING_TIERS, VENUE_IMAGES } from '../data/venueData';
import { formatCurrency } from '../utils/hospitalityLogic';
import { SafeImage } from '../components/SafeImage';

interface CateringPageProps {
  onNavigate: (page: PageId) => void;
  onSelectCateringTopic: (tierName: string, guestCount: number) => void;
}

export function CateringPage({
  onNavigate,
  onSelectCateringTopic,
}: CateringPageProps) {
  const [selectedTierId, setSelectedTierId] = useState<string>(CATERING_TIERS[0].id);
  const [estimatedGuests, setEstimatedGuests] = useState<number>(60);
  const [includeServiceStaff, setIncludeServiceStaff] = useState<boolean>(true);

  const selectedTier =
    CATERING_TIERS.find((t) => t.id === selectedTierId) ?? CATERING_TIERS[0];

  const effectiveGuests = Math.max(selectedTier.minGuests, estimatedGuests);
  const baseFoodTotal = selectedTier.pricePerGuest * effectiveGuests;
  const staffingFee = includeServiceStaff ? Math.max(450, Math.round(effectiveGuests * 12)) : 0;
  const estimatedTotal = baseFoodTotal + staffingFee;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-14">
      {/* Split Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-medium text-[#6C757D]">Off-Site &amp; Estate Catering</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#14171A] leading-tight [text-wrap:balance]">
              Restaurant-caliber dining, delivered anywhere in Oregon.
            </h1>
            <p className="text-base text-[#495057] leading-relaxed">
              Whether setting a limestone harvest table in a private vineyard or plating a three-course awards gala inside a museum atrium, our catering brigade travels with stoneware, pressed linens, and full culinary staff.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('menu-kit')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>Customize Catering Menu Kit</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCateringTopic(selectedTier.name, effectiveGuests);
                onNavigate('contact');
              }}
              className="px-5 py-2.5 text-sm font-medium text-[#14171A] border border-[#CED4DA] hover:bg-white rounded-md transition-colors cursor-pointer"
            >
              Request Event Proposal
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[280px] rounded-xl overflow-hidden border border-[#E5E7EB]">
            <SafeImage
              src={VENUE_IMAGES.cateringSpread}
              alt="Artisanal catering grazing spread with sourdough loaves, roasted carrots, figs, and brass vessels"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Four Catering Service Packages */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-medium text-[#6C757D]">01. Service Formats</p>
          <h2 className="font-display text-3xl font-semibold text-[#14171A] mt-1">
            Select a format to preview courses and calculate pricing.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATERING_TIERS.map((tier) => {
            const active = tier.id === selectedTier.id;
            return (
              <article
                key={tier.id}
                className={`bg-white rounded-xl p-6 border transition-colors flex flex-col justify-between gap-5 ${
                  active ? 'border-[#1B4332] ring-1 ring-[#1B4332]' : 'border-[#E5E7EB]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-[#14171A]">
                        {tier.name}
                      </h3>
                      <p className="text-xs text-[#6C757D] mt-0.5">{tier.format}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-lg font-medium text-[#14171A] tabular-nums">
                        {formatCurrency(tier.pricePerGuest)}
                      </p>
                      <p className="text-xs text-[#6C757D]">per guest</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#495057] leading-relaxed">{tier.summary}</p>
                  <ul className="space-y-1.5 pt-2 border-t border-[#F1F3F5]">
                    {tier.includedCourses.map((course) => (
                      <li
                        key={course}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#343A40]"
                      >
                        <Check
                          className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F1F3F5]">
                  <span className="font-mono text-xs text-[#6C757D] tabular-nums">
                    Minimum {tier.minGuests} guests
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTierId(tier.id);
                      if (estimatedGuests < tier.minGuests) {
                        setEstimatedGuests(tier.minGuests);
                      }
                    }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#1B4332] text-white'
                        : 'bg-[#F8F9FA] text-[#14171A] border border-[#DEE2E6] hover:bg-[#E9ECEF]'
                    }`}
                  >
                    {active ? 'Selected in Estimator' : 'Estimate This Package'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Interactive Guest & Budget Estimator */}
      <section className="bg-white border border-[#E5E7EB] rounded-xl p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#6C757D]">Instant Catering Estimator</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#14171A]">
              {selectedTier.name}
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="catering-guest-range" className="font-medium text-[#343A40]">
                Estimated Guest Count
              </label>
              <span className="font-mono font-medium text-[#14171A] tabular-nums">
                {effectiveGuests} guests
              </span>
            </div>
            <input
              id="catering-guest-range"
              type="range"
              min={selectedTier.minGuests}
              max={300}
              step={5}
              value={effectiveGuests}
              onChange={(e) => setEstimatedGuests(Number(e.target.value))}
              className="w-full accent-[#1B4332] cursor-pointer"
            />
          </div>

          <label className="inline-flex items-center gap-2.5 text-sm text-[#343A40] cursor-pointer">
            <input
              type="checkbox"
              checked={includeServiceStaff}
              onChange={(e) => setIncludeServiceStaff(e.target.checked)}
              className="w-4 h-4 accent-[#1B4332] rounded"
            />
            <span>Include on-site culinary &amp; captain staffing ($12/guest, $450 min)</span>
          </label>
        </div>

        <div className="lg:col-span-5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-6 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#495057]">
                Culinary Package ({effectiveGuests} &times; {formatCurrency(selectedTier.pricePerGuest)})
              </span>
              <span className="font-mono tabular-nums text-[#14171A]">
                {formatCurrency(baseFoodTotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#495057]">On-Site Service &amp; Equipment</span>
              <span className="font-mono tabular-nums text-[#14171A]">
                {formatCurrency(staffingFee)}
              </span>
            </div>
            <div className="pt-3 border-t border-[#DEE2E6] flex justify-between items-baseline">
              <span className="font-semibold text-[#14171A]">Estimated Catering Total</span>
              <span className="font-mono text-2xl font-semibold text-[#1B4332] tabular-nums">
                {formatCurrency(estimatedTotal)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectCateringTopic(selectedTier.name, effectiveGuests);
              onNavigate('contact');
            }}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors cursor-pointer"
          >
            Send Catering Inquiry
          </button>
        </div>
      </section>
    </div>
  );
}
