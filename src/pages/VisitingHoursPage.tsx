import { Car, Clock, Sparkles } from 'lucide-react';
import type { PageId } from '../types';
import { HOLIDAY_NOTICES, SERVICE_HOURS, VENUE_CONTACT } from '../data/venueData';
import { isVenueOpenAt } from '../utils/hospitalityLogic';

interface VisitingHoursPageProps {
  onNavigate: (page: PageId) => void;
}

export function VisitingHoursPage({ onNavigate }: VisitingHoursPageProps) {
  const now = new Date();
  const status = isVenueOpenAt(now);
  const currentDayIndex = now.getDay();

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5E7EB] pb-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-medium text-[#6C757D]">Schedule &amp; Visitor Guide</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#14171A] [text-wrap:balance]">
            Visiting Hours &amp; Estate Access
          </h1>
          <p className="text-base text-[#495057] leading-relaxed">
            {VENUE_CONTACT.addressLine1}, {VENUE_CONTACT.addressLine2} · Dining Desk {VENUE_CONTACT.phone}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('booking')}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          Book Evening Table
        </button>
      </div>

      {/* Live Open/Closed Banner */}
      <section className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <Clock className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[#14171A]">{status.headline}</p>
            <p className="text-sm text-[#495057] mt-0.5">{status.detail}</p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-md self-start sm:self-auto ${
            status.isOpen
              ? 'bg-[#1B4332] text-white'
              : 'bg-[#E9ECEF] text-[#343A40]'
          }`}
        >
          {status.isOpen ? 'Open Now' : 'Currently Closed'}
        </span>
      </section>

      {/* Weekly Schedule Table */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-[#14171A]">
          Weekly Hours by Department
        </h2>
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-xs font-semibold text-[#6C757D]">
                <th className="py-3.5 px-5">Day</th>
                <th className="py-3.5 px-5">Main Dining Room</th>
                <th className="py-3.5 px-5">Courtyard Bar &amp; Lounge</th>
                <th className="py-3.5 px-5">Private Events Office</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {SERVICE_HOURS.map((row) => {
                const isToday = row.dayIndex === currentDayIndex;
                return (
                  <tr
                    key={row.dayName}
                    className={isToday ? 'bg-[#1B4332]/5 font-medium' : 'hover:bg-[#F8F9FA]'}
                  >
                    <td className="py-4 px-5 text-[#14171A]">
                      {row.dayName}
                      {isToday ? ' (Today)' : ''}
                    </td>
                    <td className="py-4 px-5 font-mono tabular-nums text-[#343A40]">
                      {row.diningHours}
                    </td>
                    <td className="py-4 px-5 font-mono tabular-nums text-[#343A40]">
                      {row.barHours}
                    </td>
                    <td className="py-4 px-5 font-mono tabular-nums text-[#343A40]">
                      {row.eventsOffice}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Holiday Calendar & Arrival Etiquette */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-4">
          <h2 className="font-display text-2xl font-semibold text-[#14171A]">
            Upcoming Holiday &amp; Seasonal Schedule
          </h2>
          <div className="divide-y divide-[#E5E7EB]">
            {HOLIDAY_NOTICES.map((notice) => (
              <div key={notice.occasion} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[#14171A]">{notice.occasion}</p>
                  <p className="text-xs font-mono text-[#6C757D] tabular-nums">{notice.dateLabel}</p>
                </div>
                <p className="text-xs sm:text-sm text-[#495057]">{notice.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-5">
          <h2 className="font-display text-2xl font-semibold text-[#14171A]">
            Arrival, Valet &amp; Dress Code
          </h2>
          <div className="space-y-4 text-sm text-[#495057] leading-relaxed">
            <div className="flex items-start gap-3">
              <Car className="w-4 h-4 text-[#1B4332] shrink-0 mt-1" aria-hidden="true" />
              <p>{VENUE_CONTACT.parkingNote}</p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#1B4332] shrink-0 mt-1" aria-hidden="true" />
              <p>
                Smart casual attire is welcomed throughout the Dining Room and Conservatory. Private Banquet Tours are scheduled Tuesday through Saturday by appointment.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="text-sm font-semibold text-[#1B4332] hover:text-[#122E22] cursor-pointer"
          >
            Schedule a Private Venue Tour &rarr;
          </button>
        </div>
      </section>
    </div>
  );
}
