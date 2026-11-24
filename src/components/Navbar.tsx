import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import type { PageId } from '../types';
import { PAGE_ROUTES } from '../data/venueData';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  menuKitCount: number;
}

export function Navbar({ currentPage, onNavigate, menuKitCount }: NavbarProps) {
  const [visitOpen, setVisitOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setVisitOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setVisitOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLinkClick = (page: PageId) => {
    onNavigate(page);
    setVisitOpen(false);
    setMobileOpen(false);
  };

  const primaryNav: Array<{ id: PageId; label: string }> = [
    { id: 'menu', label: 'Menu' },
    { id: 'banquet', label: 'Banquet' },
    { id: 'catering', label: 'Catering' },
    { id: 'gallery', label: 'Gallery' },
  ];

  const visitSubPages: Array<{ id: PageId; label: string }> = [
    { id: 'about', label: 'About Us' },
    { id: 'hours', label: 'Visiting Hours' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'menu-kit', label: menuKitCount > 0 ? `Menu Kit (${menuKitCount})` : 'Menu Kit' },
  ];

  const isVisitActive =
    currentPage === 'about' ||
    currentPage === 'hours' ||
    currentPage === 'contact' ||
    currentPage === 'menu-kit';

  return (
    <header className="sticky top-0 z-40 bg-[#F8F9FA]/95 backdrop-blur-sm border-b border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="font-display text-2xl font-semibold tracking-tight text-[#14171A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
        >
          Alder &amp; Brass
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          {primaryNav.map((item) => {
            const active = currentPage === item.id;
            return (
              <a
                key={item.id}
                href={PAGE_ROUTES.find((r) => r.id === item.id)?.path ?? '/'}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332] ${
                  active
                    ? 'text-[#1B4332] border-[#1B4332]'
                    : 'text-[#495057] border-transparent hover:text-[#14171A] hover:border-[#CED4DA]'
                }`}
              >
                {item.label}
              </a>
            );
          })}

          {/* 5th nav item: Visit & Kits dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setVisitOpen((prev) => !prev)}
              aria-expanded={visitOpen}
              aria-haspopup="menu"
              className={`inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332] ${
                isVisitActive
                  ? 'text-[#1B4332] border-[#1B4332]'
                  : 'text-[#495057] border-transparent hover:text-[#14171A] hover:border-[#CED4DA]'
              }`}
            >
              <span>Visit</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  visitOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {visitOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1.5 z-50"
              >
                {visitSubPages.map((sub) => {
                  const active = currentPage === sub.id;
                  const path = PAGE_ROUTES.find((r) => r.id === sub.id)?.path ?? '/';
                  return (
                    <a
                      key={sub.id}
                      role="menuitem"
                      href={path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(sub.id);
                      }}
                      className={`block px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                        active
                          ? 'bg-[#1B4332]/8 text-[#1B4332] font-semibold'
                          : 'text-[#343A40] hover:bg-[#F1F3F5]'
                      }`}
                    >
                      {sub.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('booking')}
            className="px-4 py-2 text-xs font-semibold tracking-wide text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
          >
            Online Booking
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-[#DEE2E6] text-[#14171A] hover:bg-[#E9ECEF] transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <MenuIcon className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer listing all 10 pages cleanly */}
      {mobileOpen && (
        <nav
          aria-label="Mobile full site navigation"
          className="md:hidden bg-white border-b border-[#E5E7EB] px-6 py-4"
        >
          <div className="grid grid-cols-2 gap-2">
            {PAGE_ROUTES.map((route) => {
              const active = currentPage === route.id;
              return (
                <a
                  key={route.id}
                  href={route.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(route.id);
                  }}
                  className={`px-3 py-2.5 rounded-md text-sm font-medium whitespace-nowrap truncate transition-colors ${
                    active
                      ? 'bg-[#1B4332] text-white'
                      : 'text-[#343A40] hover:bg-[#F1F3F5]'
                  }`}
                >
                  {route.label}
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
