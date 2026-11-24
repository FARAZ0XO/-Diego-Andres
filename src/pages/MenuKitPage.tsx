import { useState } from 'react';
import { Check, Download, Printer } from 'lucide-react';
import type { MenuCourse, PageId } from '../types';
import { MENU_ITEMS, MENU_KIT_PRESETS, VENUE_CONTACT } from '../data/venueData';
import { calculateMenuKitQuote, formatCurrency } from '../utils/hospitalityLogic';

interface MenuKitPageProps {
  selectedKitIds: string[];
  onSetKitIds: (ids: string[]) => void;
  onToggleKitItem: (itemId: string) => void;
  onSendKitToBooking: (summaryText: string, guestCount: number) => void;
  onNavigate: (page: PageId) => void;
}

const COURSE_ORDER: MenuCourse[] = ['Starters', 'Mains', 'Desserts', 'Cellar'];

export function MenuKitPage({
  selectedKitIds,
  onSetKitIds,
  onToggleKitItem,
  onSendKitToBooking,
  onNavigate,
}: MenuKitPageProps) {
  const [kitTitle, setKitTitle] = useState('Private Tasting & Reception Kit');
  const [guestCount, setGuestCount] = useState(60);
  const [includeWinePairing, setIncludeWinePairing] = useState(true);
  const [activePresetId, setActivePresetId] = useState<string>(MENU_KIT_PRESETS[0].id);

  const activePreset =
    MENU_KIT_PRESETS.find((p) => p.id === activePresetId) ?? MENU_KIT_PRESETS[0];

  const quote = calculateMenuKitQuote(
    MENU_ITEMS,
    selectedKitIds,
    guestCount,
    activePreset.baseTierPrice,
    includeWinePairing
  );

  const selectedDishes = MENU_ITEMS.filter((i) => selectedKitIds.includes(i.id));

  const handleLoadPreset = (presetId: string) => {
    const preset = MENU_KIT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(preset.id);
    setKitTitle(preset.name);
    setGuestCount(preset.recommendedGuests);
    onSetKitIds(preset.itemIds);
  };

  const handleDownloadKit = () => {
    const lines = [
      `${VENUE_CONTACT.brandName} — CUSTOM MENU KIT BRIEF`,
      `==================================================`,
      `Kit Title: ${kitTitle}`,
      `Estimated Guests: ${quote.guestCount}`,
      `Sommelier Wine Pairing: ${includeWinePairing ? 'Included ($34/guest)' : 'Not Included'}`,
      ``,
      `SELECTED COURSES (${selectedDishes.length} items):`,
      ...selectedDishes.map(
        (d) =>
          `- [${d.course}] ${d.name} (${formatCurrency(d.price)} à la carte) — ${d.description}`
      ),
      ``,
      `ESTIMATED INVESTMENT:`,
      `Culinary Per Guest: ${formatCurrency(quote.foodPerGuest)}`,
      `Beverage Per Guest: ${formatCurrency(quote.beveragePerGuest)}`,
      `Combined Per Guest: ${formatCurrency(quote.perGuestTotal)}`,
      `Subtotal (${quote.guestCount} guests): ${formatCurrency(quote.subtotal)}`,
      `Hospitality & Service (18%): ${formatCurrency(quote.hospitalityServiceFee)}`,
      `Estimated Grand Total: ${formatCurrency(quote.grandTotal)}`,
      ``,
      `Contact Events Desk: ${VENUE_CONTACT.eventsPhone} | ${VENUE_CONTACT.eventsEmail}`,
      `${VENUE_CONTACT.addressLine1}, ${VENUE_CONTACT.addressLine2}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'alder-and-brass-menu-kit.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBookWithKit = () => {
    const dishNames = selectedDishes.map((d) => d.name).join(', ');
    const summary = `Menu Kit "${kitTitle}" (${quote.guestCount} guests, Est. ${formatCurrency(
      quote.grandTotal
    )}): ${dishNames || 'Chef seasonal selection'}.`;
    onSendKitToBooking(summary, quote.guestCount);
    onNavigate('booking');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5E7EB] pb-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-medium text-[#6C757D]">Interactive Event Brochure</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#14171A] [text-wrap:balance]">
            Custom Menu Kit Builder
          </h1>
          <p className="text-base text-[#495057] leading-relaxed">
            Start from a curated tasting template or assemble your own multi-course menu. Print a client-ready brochure or download your brief directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-[#14171A] bg-white border border-[#CED4DA] hover:bg-[#F8F9FA] rounded-md transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            <span>Print Kit</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadKit}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download Brief</span>
          </button>
        </div>
      </div>

      {/* Preset Templates */}
      <section className="space-y-4 no-print">
        <h2 className="font-display text-2xl font-semibold text-[#14171A]">
          01. Load a Curated Kit Template
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MENU_KIT_PRESETS.map((preset) => {
            const active = preset.id === activePresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleLoadPreset(preset.id)}
                className={`text-left bg-white rounded-xl p-5 border transition-colors space-y-2 cursor-pointer ${
                  active ? 'border-[#1B4332] ring-1 ring-[#1B4332]' : 'border-[#E5E7EB] hover:border-[#ADB5BD]'
                }`}
              >
                <p className="text-xs text-[#1B4332] font-medium">{preset.audience}</p>
                <h3 className="font-display text-xl font-semibold text-[#14171A]">
                  {preset.name}
                </h3>
                <p className="text-xs text-[#495057] leading-relaxed">{preset.summary}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Split: Dish Selector vs Live Brochure Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <section className="lg:col-span-7 space-y-8 no-print">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-[#14171A]">
              02. Customize Courses &amp; Dishes
            </h2>
            <button
              type="button"
              onClick={() => onSetKitIds([])}
              className="text-xs font-medium text-[#6C757D] hover:text-[#14171A] underline cursor-pointer"
            >
              Clear All Selections
            </button>
          </div>

          {COURSE_ORDER.map((course) => {
            const dishes = MENU_ITEMS.filter((m) => m.course === course);
            return (
              <div key={course} className="space-y-3">
                <h3 className="text-xs font-semibold tracking-wide text-[#6C757D] border-b border-[#E5E7EB] pb-2">
                  {course}
                </h3>
                <div className="space-y-2.5">
                  {dishes.map((dish) => {
                    const checked = selectedKitIds.includes(dish.id);
                    return (
                      <button
                        key={dish.id}
                        type="button"
                        onClick={() => onToggleKitItem(dish.id)}
                        aria-pressed={checked}
                        className={`w-full text-left p-4 rounded-lg border flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                          checked
                            ? 'bg-white border-[#1B4332]'
                            : 'bg-white border-[#E5E7EB] hover:border-[#CED4DA]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                              checked
                                ? 'bg-[#1B4332] border-[#1B4332] text-white'
                                : 'border-[#ADB5BD] bg-white'
                            }`}
                          >
                            {checked && <Check className="w-3.5 h-3.5" />}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-[#14171A]">{dish.name}</p>
                            <p className="text-xs text-[#495057] mt-0.5">{dish.description}</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-medium text-[#343A40] tabular-nums shrink-0 pt-0.5">
                          {formatCurrency(dish.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* Right: Printable Kit Brochure & Quote Calculator */}
        <aside className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
          <div className="space-y-3 border-b border-[#E5E7EB] pb-5">
            <label htmlFor="kit-title-input" className="block text-xs font-semibold text-[#6C757D] no-print">
              Kit Title
            </label>
            <input
              id="kit-title-input"
              type="text"
              value={kitTitle}
              onChange={(e) => setKitTitle(e.target.value)}
              className="w-full font-display text-2xl font-semibold text-[#14171A] bg-transparent border-b border-transparent focus:border-[#1B4332] focus:outline-none pb-1"
            />
            <p className="text-xs text-[#6C757D]">
              {VENUE_CONTACT.brandName} · Custom Tasting &amp; Event Estimate
            </p>
          </div>

          <div className="space-y-4 no-print">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#343A40] mb-1.5">
                <label htmlFor="kit-guests-input">Guest Count</label>
                <span className="font-mono tabular-nums">{quote.guestCount} guests</span>
              </div>
              <input
                id="kit-guests-input"
                type="range"
                min={10}
                max={300}
                step={2}
                value={quote.guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full accent-[#1B4332] cursor-pointer"
              />
            </div>

            <label className="flex items-center gap-2.5 text-sm text-[#343A40] cursor-pointer">
              <input
                type="checkbox"
                checked={includeWinePairing}
                onChange={(e) => setIncludeWinePairing(e.target.checked)}
                className="w-4 h-4 accent-[#1B4332]"
              />
              <span>Include Sommelier Wine Pairing (+$34 / guest)</span>
            </label>
          </div>

          {/* Selected Courses Summary */}
          <div className="space-y-2 border-y border-[#E5E7EB] py-4">
            <p className="text-xs font-semibold text-[#6C757D]">
              Selected Menu Items ({selectedDishes.length})
            </p>
            {selectedDishes.length === 0 ? (
              <p className="text-sm text-[#6C757D]">
                Select at least one dish on the left to build a custom course sheet.
              </p>
            ) : (
              <ul className="space-y-1.5 text-sm text-[#343A40]">
                {selectedDishes.map((d) => (
                  <li key={d.id} className="flex justify-between gap-3">
                    <span>{d.name}</span>
                    <span className="font-mono text-xs text-[#6C757D] shrink-0">{d.course}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Live Financial Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#495057]">
              <span>Culinary Rate (15% kit bundle applied)</span>
              <span className="font-mono tabular-nums">
                {formatCurrency(quote.foodPerGuest)} / guest
              </span>
            </div>
            <div className="flex justify-between text-[#495057]">
              <span>Sommelier Beverage Pairing</span>
              <span className="font-mono tabular-nums">
                {formatCurrency(quote.beveragePerGuest)} / guest
              </span>
            </div>
            <div className="flex justify-between text-[#495057]">
              <span>Subtotal ({quote.guestCount} guests)</span>
              <span className="font-mono tabular-nums">{formatCurrency(quote.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#495057]">
              <span>Hospitality &amp; Captain Service (18%)</span>
              <span className="font-mono tabular-nums">
                {formatCurrency(quote.hospitalityServiceFee)}
              </span>
            </div>
            <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-baseline">
              <span className="font-semibold text-[#14171A]">Estimated Total</span>
              <span className="font-mono text-2xl font-semibold text-[#1B4332] tabular-nums">
                {formatCurrency(quote.grandTotal)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookWithKit}
            className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors cursor-pointer no-print"
          >
            Reserve Event With This Menu Kit
          </button>
        </aside>
      </div>
    </div>
  );
}
