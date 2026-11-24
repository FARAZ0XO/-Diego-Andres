import { useEffect, useState, type FormEvent } from 'react';
import { CalendarCheck, Trash2 } from 'lucide-react';
import type { BookingKind, BookingRecord } from '../types';
import {
  BANQUET_ROOMS,
  TIME_SLOTS_BANQUET,
  TIME_SLOTS_DINING,
} from '../data/venueData';
import {
  generateReferenceCode,
  validateBookingForm,
  type ValidationErrors,
} from '../utils/hospitalityLogic';

interface OnlineBookingPageProps {
  bookings: BookingRecord[];
  onAddBooking: (record: BookingRecord) => void;
  onCancelBooking: (id: string) => void;
  prefillBanquetRoom?: string | null;
  prefillPartySize?: number | null;
  prefillNotes?: string | null;
}

const DINING_AREAS = [
  'Main Dining Room',
  'Courtyard Window Banquette',
  'Chef’s Hearth Counter',
  'Lounge & Cocktail Bar',
];

export function OnlineBookingPage({
  bookings,
  onAddBooking,
  onCancelBooking,
  prefillBanquetRoom,
  prefillPartySize,
  prefillNotes,
}: OnlineBookingPageProps) {
  const [kind, setKind] = useState<BookingKind>(
    prefillBanquetRoom ? 'banquet' : 'dining'
  );
  const [spaceName, setSpaceName] = useState<string>(
    prefillBanquetRoom || DINING_AREAS[0]
  );
  const [date, setDate] = useState<string>('2026-12-04');
  const [timeSlot, setTimeSlot] = useState<string>(
    prefillBanquetRoom ? TIME_SLOTS_BANQUET[2] : TIME_SLOTS_DINING[4]
  );
  const [partySize, setPartySize] = useState<number>(prefillPartySize || 4);
  const [guestName, setGuestName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>(prefillNotes || '');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [latestConfirmation, setLatestConfirmation] =
    useState<BookingRecord | null>(null);

  useEffect(() => {
    if (prefillBanquetRoom) {
      setKind('banquet');
      setSpaceName(prefillBanquetRoom);
      setTimeSlot(TIME_SLOTS_BANQUET[2]);
    }
    if (prefillPartySize) {
      setPartySize(prefillPartySize);
    }
    if (prefillNotes) {
      setNotes(prefillNotes);
    }
  }, [prefillBanquetRoom, prefillPartySize, prefillNotes]);

  const handleModeSwitch = (nextKind: BookingKind) => {
    setKind(nextKind);
    setErrors({});
    if (nextKind === 'dining') {
      setSpaceName(DINING_AREAS[0]);
      setTimeSlot(TIME_SLOTS_DINING[4]);
      setPartySize((prev) => (prev > 14 ? 4 : prev));
    } else {
      setSpaceName(BANQUET_ROOMS[0].name);
      setTimeSlot(TIME_SLOTS_BANQUET[2]);
      setPartySize((prev) => (prev < 12 ? 60 : prev));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateBookingForm({
      kind,
      guestName,
      email,
      phone,
      date,
      timeSlot,
      partySize,
      spaceName,
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const record: BookingRecord = {
      id: `bk-${Date.now()}`,
      confirmationCode: generateReferenceCode(
        kind === 'dining' ? 'TBL' : 'BNQ',
        Date.now()
      ),
      kind,
      guestName: guestName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      date,
      timeSlot,
      partySize,
      spaceName,
      notes: notes.trim(),
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    onAddBooking(record);
    setLatestConfirmation(record);
    setGuestName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  const availableSpaces =
    kind === 'dining' ? DINING_AREAS : BANQUET_ROOMS.map((r) => r.name);
  const availableSlots =
    kind === 'dining' ? TIME_SLOTS_DINING : TIME_SLOTS_BANQUET;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">
      <div className="border-b border-[#E5E7EB] pb-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-medium text-[#6C757D]">Online Reservations</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#14171A] [text-wrap:balance]">
            Book a Table or Reserve a Banquet Hall
          </h1>
          <p className="text-base text-[#495057] leading-relaxed">
            Select Dining Room service for parties up to 14 guests, or switch to Banquet &amp; Private Event for rooms seating 12 to 320 guests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Reservation Form */}
        <section className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-6 sm:p-8 space-y-6">
          {/* Booking Type Switcher */}
          <div
            role="tablist"
            aria-label="Reservation type"
            className="inline-flex items-center gap-1 p-1 bg-[#E9ECEF] rounded-lg"
          >
            <button
              type="button"
              role="tab"
              aria-selected={kind === 'dining'}
              onClick={() => handleModeSwitch('dining')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                kind === 'dining'
                  ? 'bg-white text-[#14171A] shadow-xs'
                  : 'text-[#495057] hover:text-[#14171A]'
              }`}
            >
              Dining Table (1–14 Guests)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={kind === 'banquet'}
              onClick={() => handleModeSwitch('banquet')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                kind === 'banquet'
                  ? 'bg-white text-[#14171A] shadow-xs'
                  : 'text-[#495057] hover:text-[#14171A]'
              }`}
            >
              Banquet Hall (12–320 Guests)
            </button>
          </div>

          {latestConfirmation && (
            <div
              role="status"
              className="bg-[#1B4332]/5 border border-[#1B4332]/30 rounded-lg p-5 space-y-2"
            >
              <div className="flex items-center gap-2 text-[#1B4332] font-semibold text-sm">
                <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                <span>
                  Reservation Confirmed ·{' '}
                  <span className="font-mono tabular-nums">
                    {latestConfirmation.confirmationCode}
                  </span>
                </span>
              </div>
              <p className="text-sm text-[#343A40]">
                {latestConfirmation.guestName} — {latestConfirmation.spaceName} on{' '}
                <span className="font-mono tabular-nums">{latestConfirmation.date}</span> at{' '}
                <span>{latestConfirmation.timeSlot}</span> for{' '}
                <span className="font-mono tabular-nums">{latestConfirmation.partySize}</span> guests.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="booking-space"
                  className="block text-xs font-semibold text-[#343A40] mb-1.5"
                >
                  {kind === 'dining' ? 'Seating Preference' : 'Banquet Suite'}
                </label>
                <select
                  id="booking-space"
                  value={spaceName}
                  onChange={(e) => setSpaceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                >
                  {availableSpaces.map((space) => (
                    <option key={space} value={space}>
                      {space}
                    </option>
                  ))}
                </select>
                {errors.spaceName && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.spaceName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-guests"
                  className="block text-xs font-semibold text-[#343A40] mb-1.5"
                >
                  Party Size *
                </label>
                <input
                  id="booking-guests"
                  type="number"
                  min={kind === 'dining' ? 1 : 12}
                  max={kind === 'dining' ? 14 : 320}
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                />
                {errors.partySize && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.partySize}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="booking-date"
                  className="block text-xs font-semibold text-[#343A40] mb-1.5"
                >
                  Date *
                </label>
                <input
                  id="booking-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                />
                {errors.date && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-time"
                  className="block text-xs font-semibold text-[#343A40] mb-1.5"
                >
                  Time Slot *
                </label>
                <select
                  id="booking-time"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                >
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.timeSlot && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.timeSlot}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-xs font-semibold text-[#343A40] mb-1.5"
                >
                  Guest / Host Name *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Marcus Reid"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                />
                {errors.guestName && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.guestName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-email"
                  className="block text-xs font-semibold text-[#343A40] mb-1.5"
                >
                  Email *
                </label>
                <input
                  id="booking-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcus@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                />
                {errors.email && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-phone"
                  className="block text-xs font-semibold text-[#343A40] mb-1.5"
                >
                  Phone *
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(503) 555-0144"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                />
                {errors.phone && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="booking-notes"
                className="block text-xs font-semibold text-[#343A40] mb-1.5"
              >
                Dietary Restrictions, Menu Kit Reference, or Special Notes
              </label>
              <textarea
                id="booking-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, celebratory occasion, AV needs, or Menu Kit selections..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors cursor-pointer"
            >
              {kind === 'dining' ? 'Confirm Table Reservation' : 'Submit Banquet Hold'}
            </button>
          </form>
        </section>

        {/* Right: Upcoming Bookings Ledger */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-[#14171A]">
                Your Reservations
              </h2>
              <span className="font-mono text-xs text-[#6C757D] tabular-nums">
                {bookings.length} active
              </span>
            </div>

            {bookings.length === 0 ? (
              <p className="text-sm text-[#6C757D] py-4">
                No active bookings saved on this browser yet. Completed reservations will appear here immediately.
              </p>
            ) : (
              <ul className="divide-y divide-[#E5E7EB]">
                {bookings.map((b) => (
                  <li key={b.id} className="py-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#14171A]">
                          {b.spaceName}
                        </p>
                        <p className="text-xs text-[#495057]">
                          {b.guestName} · {b.partySize} guests
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCancelBooking(b.id)}
                        aria-label={`Cancel reservation ${b.confirmationCode} for ${b.guestName}`}
                        className="inline-flex items-center gap-1 text-xs text-[#6C757D] hover:text-[#B91C1C] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Cancel</span>
                      </button>
                    </div>
                    <p className="text-xs font-mono text-[#6C757D] tabular-nums">
                      {b.confirmationCode} · {b.date} · {b.timeSlot}
                    </p>
                    {b.notes && (
                      <p className="text-xs text-[#495057] italic">{b.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
