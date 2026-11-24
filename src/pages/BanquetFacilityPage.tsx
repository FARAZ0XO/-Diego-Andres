import { useState } from 'react';
import { CheckCircle2, Users } from 'lucide-react';
import type { PageId } from '../types';
import { BANQUET_ROOMS } from '../data/venueData';
import { formatCurrency } from '../utils/hospitalityLogic';
import { SafeImage } from '../components/SafeImage';

interface BanquetFacilityPageProps {
  onSelectRoomForBooking: (roomName: string, recommendedGuests: number) => void;
  onNavigate: (page: PageId) => void;
}

export function BanquetFacilityPage({
  onSelectRoomForBooking,
  onNavigate,
}: BanquetFacilityPageProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(BANQUET_ROOMS[0].id);
  const activeRoom =
    BANQUET_ROOMS.find((room) => room.id === selectedRoomId) ?? BANQUET_ROOMS[0];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">
      <div className="space-y-3 max-w-2xl">
        <p className="text-xs font-medium text-[#6C757D]">Private Dining &amp; Banquet Estate</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#14171A] [text-wrap:balance]">
          Architectural banquet spaces from 28 to 320 guests.
        </h1>
        <p className="text-base text-[#495057] leading-relaxed">
          Each private hall includes solid timber furnishings, house acoustic audio, custom linen service, and a dedicated event captain from arrival through final toast.
        </p>
      </div>

      {/* Room Selector Tabs */}
      <div
        role="tablist"
        aria-label="Banquet spaces"
        className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#E9ECEF] rounded-lg"
      >
        {BANQUET_ROOMS.map((room) => {
          const active = room.id === activeRoom.id;
          return (
            <button
              key={room.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedRoomId(room.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-white text-[#14171A] shadow-xs'
                  : 'text-[#495057] hover:text-[#14171A]'
              }`}
            >
              {room.name}
            </button>
          );
        })}
      </div>

      {/* Active Room Showcase */}
      <section className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 min-h-[280px] lg:min-h-[440px]">
          <SafeImage
            src={activeRoom.imageUrl}
            alt={activeRoom.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-semibold text-[#14171A]">
              {activeRoom.name}
            </h2>
            <p className="text-sm text-[#495057] leading-relaxed">{activeRoom.summary}</p>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#E5E7EB]">
              <div>
                <p className="font-mono text-lg font-medium text-[#14171A] tabular-nums">
                  {activeRoom.seatedCapacity} / {activeRoom.receptionCapacity}
                </p>
                <p className="text-xs text-[#6C757D]">Seated / Reception</p>
              </div>
              <div>
                <p className="font-mono text-lg font-medium text-[#14171A] tabular-nums">
                  {activeRoom.areaSqFt.toLocaleString()} sq ft
                </p>
                <p className="text-xs text-[#6C757D]">
                  {activeRoom.ceilingHeightFt} ft Ceilings
                </p>
              </div>
              <div>
                <p className="font-mono text-lg font-medium text-[#14171A] tabular-nums">
                  {formatCurrency(activeRoom.baseRentalFee)}
                </p>
                <p className="text-xs text-[#6C757D]">Space Rental Fee</p>
              </div>
              <div>
                <p className="font-mono text-lg font-medium text-[#14171A] tabular-nums">
                  {formatCurrency(activeRoom.minimumSpend)}
                </p>
                <p className="text-xs text-[#6C757D]">Food &amp; Bev Minimum</p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {activeRoom.amenities.map((amenity) => (
                <li key={amenity} className="flex items-start gap-2.5 text-sm text-[#343A40]">
                  <CheckCircle2
                    className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onSelectRoomForBooking(
                  activeRoom.name,
                  Math.min(activeRoom.seatedCapacity, Math.max(24, Math.round(activeRoom.seatedCapacity * 0.7)))
                );
                onNavigate('booking');
              }}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors cursor-pointer"
            >
              Book {activeRoom.name}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('menu-kit')}
              className="px-4 py-2.5 text-sm font-medium text-[#14171A] border border-[#CED4DA] hover:bg-[#F8F9FA] rounded-md transition-colors cursor-pointer"
            >
              Configure Menu Kit
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-[#14171A]">
          Capacity &amp; Rate Comparison
        </h2>
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-xs font-semibold text-[#6C757D]">
                <th className="py-3.5 px-5">Space</th>
                <th className="py-3.5 px-5">Seated</th>
                <th className="py-3.5 px-5">Reception</th>
                <th className="py-3.5 px-5">Floor Area</th>
                <th className="py-3.5 px-5">Room Fee</th>
                <th className="py-3.5 px-5">F&amp;B Minimum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {BANQUET_ROOMS.map((room) => (
                <tr key={room.id} className="hover:bg-[#F8F9FA]">
                  <td className="py-4 px-5 font-medium text-[#14171A]">
                    <span className="inline-flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#1B4332]" aria-hidden="true" />
                      {room.name}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono tabular-nums text-[#343A40]">
                    {room.seatedCapacity}
                  </td>
                  <td className="py-4 px-5 font-mono tabular-nums text-[#343A40]">
                    {room.receptionCapacity}
                  </td>
                  <td className="py-4 px-5 font-mono tabular-nums text-[#343A40]">
                    {room.areaSqFt.toLocaleString()} sq ft
                  </td>
                  <td className="py-4 px-5 font-mono tabular-nums text-[#343A40]">
                    {formatCurrency(room.baseRentalFee)}
                  </td>
                  <td className="py-4 px-5 font-mono tabular-nums text-[#343A40]">
                    {formatCurrency(room.minimumSpend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
