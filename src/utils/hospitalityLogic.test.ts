import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMenuKitQuote,
  formatCurrency,
  generateReferenceCode,
  isVenueOpenAt,
  validateBookingForm,
  validateContactForm,
} from './hospitalityLogic';
import { MENU_ITEMS } from '../data/venueData';

test('isVenueOpenAt reports closed on Mondays', () => {
  // Monday Nov 23, 2026 at 18:30
  const mondayEvening = new Date(2026, 10, 23, 18, 30);
  const status = isVenueOpenAt(mondayEvening);
  assert.equal(status.isOpen, false);
  assert.match(status.headline, /Closed/i);
});

test('isVenueOpenAt reports open during Tuesday dinner hours and closed before opening', () => {
  // Tuesday Nov 24, 2026 at 19:00
  const tuesdayDinner = new Date(2026, 10, 24, 19, 0);
  const openStatus = isVenueOpenAt(tuesdayDinner);
  assert.equal(openStatus.isOpen, true);
  assert.match(openStatus.headline, /Open Now/i);

  // Tuesday Nov 24, 2026 at 14:00
  const tuesdayAfternoon = new Date(2026, 10, 24, 14, 0);
  const earlyStatus = isVenueOpenAt(tuesdayAfternoon);
  assert.equal(earlyStatus.isOpen, false);
  assert.match(earlyStatus.headline, /Opens Later/i);
});

test('calculateMenuKitQuote computes per-guest rate, service fee, and totals accurately', () => {
  const quote = calculateMenuKitQuote(
    MENU_ITEMS,
    ['st-crudo', 'mn-duck', 'ds-tart'], // 22 + 46 + 16 = 84
    50,
    48,
    true
  );

  assert.equal(quote.selectedCount, 3);
  assert.equal(quote.guestCount, 50);
  // 84 * 0.85 = 71.4; 48 * 0.25 = 12; round(83.4) = 83
  assert.equal(quote.foodPerGuest, 83);
  assert.equal(quote.beveragePerGuest, 34);
  assert.equal(quote.perGuestTotal, 117);
  assert.equal(quote.subtotal, 5850);
  assert.equal(quote.hospitalityServiceFee, Math.round(5850 * 0.18));
  assert.equal(quote.grandTotal, 5850 + Math.round(5850 * 0.18));
});

test('validateBookingForm catches missing/invalid inputs and passes valid dining & banquet bookings', () => {
  const invalidErrors = validateBookingForm({
    kind: 'dining',
    guestName: ' ',
    email: 'not-an-email',
    phone: '123',
    date: '',
    timeSlot: '',
    partySize: 20,
    spaceName: '',
  });

  assert.ok(invalidErrors.guestName);
  assert.ok(invalidErrors.email);
  assert.ok(invalidErrors.phone);
  assert.ok(invalidErrors.date);
  assert.ok(invalidErrors.timeSlot);
  assert.ok(invalidErrors.partySize);
  assert.ok(invalidErrors.spaceName);

  const validDining = validateBookingForm({
    kind: 'dining',
    guestName: 'Claire Bennett',
    email: 'claire@example.com',
    phone: '503-555-0192',
    date: '2026-12-05',
    timeSlot: '7:00 PM',
    partySize: 4,
    spaceName: 'Main Dining Room',
  });
  assert.deepEqual(validDining, {});

  const validBanquet = validateBookingForm({
    kind: 'banquet',
    guestName: 'Marcus Reid',
    email: 'm.reid@studio.org',
    phone: '5035550111',
    date: '2027-02-14',
    timeSlot: '6:00 PM (Evening Formal Dinner)',
    partySize: 120,
    spaceName: 'The Grand Timber Hall',
  });
  assert.deepEqual(validBanquet, {});
});

test('validateContactForm validates email and message length', () => {
  const errs = validateContactForm({
    name: 'A',
    email: 'bad',
    phone: '12',
    topic: 'General',
    message: 'Too short',
  });
  assert.ok(errs.name);
  assert.ok(errs.email);
  assert.ok(errs.phone);
  assert.ok(errs.message);

  const ok = validateContactForm({
    name: 'Elena Morales',
    email: 'elena@domain.com',
    phone: '(503) 555-0123',
    topic: 'Catering',
    message: 'Looking for off-site harvest catering for 65 guests next spring.',
  });
  assert.deepEqual(ok, {});
});

test('formatCurrency and generateReferenceCode format cleanly', () => {
  assert.equal(formatCurrency(4200), '$4,200');
  assert.equal(generateReferenceCode('ab', 45123), 'AB-145123');
});
