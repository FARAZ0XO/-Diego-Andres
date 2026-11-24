import { useEffect, useState } from 'react';
import type { BookingRecord, PageId } from './types';
import { MENU_KIT_PRESETS, PAGE_ROUTES } from './data/venueData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { MenuPage } from './pages/MenuPage';
import { BanquetFacilityPage } from './pages/BanquetFacilityPage';
import { GalleryPage } from './pages/GalleryPage';
import { CateringPage } from './pages/CateringPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { VisitingHoursPage } from './pages/VisitingHoursPage';
import { OnlineBookingPage } from './pages/OnlineBookingPage';
import { MenuKitPage } from './pages/MenuKitPage';

const BOOKINGS_STORAGE_KEY = 'alder_brass_bookings_v1';
const KIT_STORAGE_KEY = 'alder_brass_menu_kit_v1';

function resolvePageFromPath(pathname: string): PageId {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const match = PAGE_ROUTES.find((route) => route.path === normalized);
  return match ? match.id : 'home';
}

const INITIAL_SEED_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-seed-1',
    confirmationCode: 'TBL-842190',
    kind: 'dining',
    guestName: 'Elena Alvarez',
    email: 'elena.alvarez@example.com',
    phone: '(503) 555-0132',
    date: '2026-12-05',
    timeSlot: '7:00 PM',
    partySize: 4,
    spaceName: 'Courtyard Window Banquette',
    notes: 'Anniversary dinner, 1 gluten-free guest.',
    createdAt: 'Nov 24, 2026',
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() =>
    resolvePageFromPath(window.location.pathname)
  );

  const [selectedKitIds, setSelectedKitIds] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(KIT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return MENU_KIT_PRESETS[0].itemIds;
  });

  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_SEED_BOOKINGS;
  });

  const [bookingPrefillRoom, setBookingPrefillRoom] = useState<string | null>(null);
  const [bookingPrefillGuests, setBookingPrefillGuests] = useState<number | null>(null);
  const [bookingPrefillNotes, setBookingPrefillNotes] = useState<string | null>(null);

  const [contactPrefillTopic, setContactPrefillTopic] = useState<string | undefined>(undefined);
  const [contactPrefillMessage, setContactPrefillMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      window.localStorage.setItem(KIT_STORAGE_KEY, JSON.stringify(selectedKitIds));
    } catch {
      // ignore storage errors
    }
  }, [selectedKitIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // ignore storage errors
    }
  }, [bookings]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(resolvePageFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: PageId) => {
    const route = PAGE_ROUTES.find((r) => r.id === page);
    if (route && window.location.pathname !== route.path) {
      window.history.pushState({}, '', route.path);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleKitItem = (itemId: string) => {
    setSelectedKitIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddBooking = (record: BookingRecord) => {
    setBookings((prev) => [record, ...prev]);
    setBookingPrefillRoom(null);
    setBookingPrefillGuests(null);
    setBookingPrefillNotes(null);
  };

  const handleCancelBooking = (id: string) => {
    setBookings((prev) => prev.filter((item) => item.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutUsPage onNavigate={handleNavigate} />;
      case 'menu':
        return (
          <MenuPage
            selectedKitIds={selectedKitIds}
            onToggleKitItem={handleToggleKitItem}
            onNavigate={handleNavigate}
          />
        );
      case 'banquet':
        return (
          <BanquetFacilityPage
            onSelectRoomForBooking={(roomName, recommendedGuests) => {
              setBookingPrefillRoom(roomName);
              setBookingPrefillGuests(recommendedGuests);
            }}
            onNavigate={handleNavigate}
          />
        );
      case 'gallery':
        return <GalleryPage />;
      case 'catering':
        return (
          <CateringPage
            onNavigate={handleNavigate}
            onSelectCateringTopic={(tierName, guestCount) => {
              setContactPrefillTopic('Off-Site Catering Proposal');
              setContactPrefillMessage(
                `Requesting a catering proposal for "${tierName}" for approximately ${guestCount} guests.`
              );
            }}
          />
        );
      case 'contact':
        return (
          <ContactUsPage
            prefillTopic={contactPrefillTopic}
            prefillMessage={contactPrefillMessage}
            onNavigate={handleNavigate}
          />
        );
      case 'hours':
        return <VisitingHoursPage onNavigate={handleNavigate} />;
      case 'booking':
        return (
          <OnlineBookingPage
            bookings={bookings}
            onAddBooking={handleAddBooking}
            onCancelBooking={handleCancelBooking}
            prefillBanquetRoom={bookingPrefillRoom}
            prefillPartySize={bookingPrefillGuests}
            prefillNotes={bookingPrefillNotes}
          />
        );
      case 'menu-kit':
        return (
          <MenuKitPage
            selectedKitIds={selectedKitIds}
            onSetKitIds={setSelectedKitIds}
            onToggleKitItem={handleToggleKitItem}
            onSendKitToBooking={(summaryText, guests) => {
              setBookingPrefillRoom('The Grand Timber Hall');
              setBookingPrefillGuests(guests);
              setBookingPrefillNotes(summaryText);
            }}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#14171A]">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        menuKitCount={selectedKitIds.length}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
