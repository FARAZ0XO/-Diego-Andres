export type PageId =
  | 'home'
  | 'about'
  | 'menu'
  | 'banquet'
  | 'gallery'
  | 'catering'
  | 'contact'
  | 'hours'
  | 'booking'
  | 'menu-kit';

export interface PageRoute {
  id: PageId;
  label: string;
  path: string;
  description: string;
}

export type MenuCourse = 'Starters' | 'Mains' | 'Desserts' | 'Cellar';
export type DietaryTag = 'Vegetarian' | 'Gluten-Free' | 'Dairy-Free';

export interface MenuItem {
  id: string;
  name: string;
  course: MenuCourse;
  price: number;
  description: string;
  pairingNote: string;
  dietary: DietaryTag[];
  featured?: boolean;
}

export interface BanquetRoom {
  id: string;
  name: string;
  seatedCapacity: number;
  receptionCapacity: number;
  areaSqFt: number;
  ceilingHeightFt: number;
  baseRentalFee: number;
  minimumSpend: number;
  summary: string;
  amenities: string[];
  imageUrl: string;
  imageAlt: string;
}

export interface CateringTier {
  id: string;
  name: string;
  format: string;
  pricePerGuest: number;
  minGuests: number;
  summary: string;
  includedCourses: string[];
}

export type GalleryCategory = 'All' | 'Dining Room' | 'Banquet Hall' | 'Culinary' | 'Catering';

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  caption: string;
  dateLabel: string;
  imageUrl: string;
  imageAlt: string;
  spanWide?: boolean;
}

export interface ServiceHoursRow {
  dayIndex: number; // 0 = Sun, 1 = Mon ... 6 = Sat
  dayName: string;
  diningHours: string;
  barHours: string;
  eventsOffice: string;
  openHour: number | null; // 24h decimal e.g. 17.0
  closeHour: number | null; // 24h decimal e.g. 22.5
}

export interface HolidayNotice {
  dateLabel: string;
  occasion: string;
  status: string;
}

export interface MenuKitPreset {
  id: string;
  name: string;
  audience: string;
  baseTierPrice: number;
  recommendedGuests: number;
  summary: string;
  itemIds: string[];
}

export type BookingKind = 'dining' | 'banquet';

export interface BookingRecord {
  id: string;
  confirmationCode: string;
  kind: BookingKind;
  guestName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  partySize: number;
  spaceName: string;
  notes: string;
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  referenceCode: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  submittedAt: string;
}
