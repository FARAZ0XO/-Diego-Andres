import type { PageId } from '../types';
import { PAGE_ROUTES, VENUE_CONTACT } from '../data/venueData';

interface FooterProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export function Footer({ currentPage, onNavigate }: FooterProps) {
  const culinaryPages: PageId[] = ['home', 'about', 'menu', 'banquet', 'gallery'];
  const servicePages: PageId[] = ['catering', 'menu-kit', 'hours', 'booking', 'contact'];

  const renderLinks = (ids: PageId[]) =>
    ids.map((id) => {
      const route = PAGE_ROUTES.find((r) => r.id === id);
      if (!route) return null;
      const active = currentPage === route.id;
      return (
        <li key={route.id}>
          <a
            href={route.path}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(route.id);
            }}
            className={`text-sm transition-colors duration-150 ${
              active
                ? 'text-[#1B4332] font-semibold underline underline-offset-4'
                : 'text-[#495057] hover:text-[#14171A]'
            }`}
          >
            {route.label}
          </a>
        </li>
      );
    });

  return (
    <footer className="border-t border-[#E5E7EB] bg-white mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="font-display text-2xl font-semibold tracking-tight text-[#14171A]"
          >
            {VENUE_CONTACT.brandName}
          </a>
          <p className="text-sm text-[#495057] max-w-sm leading-relaxed">
            Pacific Northwest seasonal dining room, architectural banquet estate, and full-service private catering.
          </p>
          <div className="pt-2 text-xs text-[#6C757D] space-y-1 font-mono tabular-nums">
            <p>
              {VENUE_CONTACT.addressLine1} · {VENUE_CONTACT.addressLine2}
            </p>
            <p>
              Dining Desk: {VENUE_CONTACT.phone} · Events: {VENUE_CONTACT.eventsPhone}
            </p>
          </div>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-semibold tracking-wide text-[#6C757D]">
            House &amp; Spaces
          </h3>
          <ul className="space-y-2">{renderLinks(culinaryPages)}</ul>
        </div>

        <div className="md:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold tracking-wide text-[#6C757D]">
            Events, Hours &amp; Kits
          </h3>
          <ul className="space-y-2">{renderLinks(servicePages)}</ul>
        </div>
      </div>

      <div className="border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6C757D]">
          <span>&copy; 2026 {VENUE_CONTACT.brandName}. All rights reserved.</span>
          <span>Tuesday–Sunday Dinner Service · Monday Private Events</span>
        </div>
      </div>
    </footer>
  );
}
