import type {
  BookingKind,
  MenuItem,
  ServiceHoursRow,
} from '../types';
import { SERVICE_HOURS } from '../data/venueData';

export interface OpenStatusResult {
  isOpen: boolean;
  headline: string;
  detail: string;
  todayRow: ServiceHoursRow;
}

export function isVenueOpenAt(
  date: Date,
  schedule: ServiceHoursRow[] = SERVICE_HOURS
): OpenStatusResult {
  const dayIndex = date.getDay();
  const decimalHour = date.getHours() + date.getMinutes() / 60;
  const todayRow =
    schedule.find((row) => row.dayIndex === dayIndex) ?? schedule[0];

  if (todayRow.openHour === null || todayRow.closeHour === null) {
    return {
      isOpen: false,
      headline: 'Closed for Public Dining Today',
      detail: `${todayRow.dayName}: ${todayRow.diningHours}. Events Office open ${todayRow.eventsOffice}.`,
      todayRow,
    };
  }

  if (decimalHour >= todayRow.openHour && decimalHour < todayRow.closeHour) {
    return {
      isOpen: true,
      headline: 'Open Now for Evening Service',
      detail: `Serving today (${todayRow.dayName}) ${todayRow.diningHours}.`,
      todayRow,
    };
  }

  if (decimalHour < todayRow.openHour) {
    return {
      isOpen: false,
      headline: 'Opens Later Today',
      detail: `${todayRow.dayName} Dining Room opens at ${formatDecimalHour(todayRow.openHour)} (${todayRow.diningHours}).`,
      todayRow,
    };
  }

  return {
    isOpen: false,
    headline: 'Closed for the Evening',
    detail: `${todayRow.dayName} dinner service concluded at ${formatDecimalHour(todayRow.closeHour)}.`,
    todayRow,
  };
}

export function formatDecimalHour(decimalHour: number): string {
  const wholeHours = Math.floor(decimalHour);
  const mins = Math.round((decimalHour - wholeHours) * 60);
  const period = wholeHours >= 12 ? 'PM' : 'AM';
  const hour12 = wholeHours % 12 === 0 ? 12 : wholeHours % 12;
  const minsStr = mins === 0 ? '00' : String(mins).padStart(2, '0');
  return `${hour12}:${minsStr} ${period}`;
}

export interface MenuKitQuote {
  selectedCount: number;
  guestCount: number;
  foodPerGuest: number;
  beveragePerGuest: number;
  perGuestTotal: number;
  subtotal: number;
  hospitalityServiceFee: number;
  grandTotal: number;
}

export function calculateMenuKitQuote(
  allItems: MenuItem[],
  selectedIds: string[],
  guestCount: number,
  baseSetupPerGuest: number,
  includeSommelierPairing: boolean
): MenuKitQuote {
  const safeGuests = Math.max(10, Math.min(500, Math.round(guestCount || 10)));
  const selectedItems = allItems.filter((item) => selectedIds.includes(item.id));
  const dishSum = selectedItems.reduce((acc, item) => acc + item.price, 0);

  // Course tasting bundle yields a 15% catering preparation discount on individual menu dish prices
  const foodPerGuest =
    selectedItems.length > 0
      ? Math.round(dishSum * 0.85 + baseSetupPerGuest * 0.25)
      : Math.round(baseSetupPerGuest);

  const beveragePerGuest = includeSommelierPairing ? 34 : 0;
  const perGuestTotal = foodPerGuest + beveragePerGuest;
  const subtotal = perGuestTotal * safeGuests;
  const hospitalityServiceFee = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + hospitalityServiceFee;

  return {
    selectedCount: selectedItems.length,
    guestCount: safeGuests,
    foodPerGuest,
    beveragePerGuest,
    perGuestTotal,
    subtotal,
    hospitalityServiceFee,
    grandTotal,
  };
}

export interface BookingValidationInput {
  kind: BookingKind;
  guestName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  partySize: number;
  spaceName: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

export function validateBookingForm(
  input: BookingValidationInput
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!input.guestName.trim() || input.guestName.trim().length < 2) {
    errors.guestName = 'Please enter a full guest or organizer name.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const digitsOnly = input.phone.replace(/\D/g, '');
  if (digitsOnly.length < 7) {
    errors.phone = 'Please enter a valid phone number (at least 7 digits).';
  }

  if (!input.date.trim()) {
    errors.date = 'Please select an event or dining date.';
  }

  if (!input.timeSlot.trim()) {
    errors.timeSlot = 'Please select a preferred seating time.';
  }

  if (input.kind === 'dining') {
    if (!Number.isFinite(input.partySize) || input.partySize < 1 || input.partySize > 14) {
      errors.partySize = 'Dining room tables accommodate 1 to 14 guests. Use Banquet Event for larger groups.';
    }
  } else {
    if (!Number.isFinite(input.partySize) || input.partySize < 12 || input.partySize > 320) {
      errors.partySize = 'Banquet events accommodate between 12 and 320 guests.';
    }
  }

  if (!input.spaceName.trim()) {
    errors.spaceName = 'Please select a dining area or banquet hall.';
  }

  return errors;
}

export interface ContactValidationInput {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

export function validateContactForm(
  input: ContactValidationInput
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!input.name.trim() || input.name.trim().length < 2) {
    errors.name = 'Please enter your name.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(input.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  const digitsOnly = input.phone.replace(/\D/g, '');
  if (input.phone.trim().length > 0 && digitsOnly.length < 7) {
    errors.phone = 'If providing a phone number, include at least 7 digits.';
  }

  if (!input.message.trim() || input.message.trim().length < 10) {
    errors.message = 'Please share a brief message (at least 10 characters).';
  }

  return errors;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateReferenceCode(prefix: string, seed: number): string {
  const cleanPrefix = prefix.toUpperCase().slice(0, 3);
  const codeNumber = String(Math.abs(Math.floor(seed)) % 900000 + 100000);
  return `${cleanPrefix}-${codeNumber}`;
}
