import type { PageId } from '../types';
import { VENUE_CONTACT, VENUE_IMAGES } from '../data/venueData';
import { SafeImage } from '../components/SafeImage';

interface AboutUsPageProps {
  onNavigate: (page: PageId) => void;
}

export function AboutUsPage({ onNavigate }: AboutUsPageProps) {
  const team = [
    {
      name: 'Julian Vance',
      role: 'Executive Chef & Co-Founder',
      bio: 'Trained in Lyon and Seattle before opening Alder & Brass in 2016, Julian leads our hearth kitchen and direct partnerships with eighteen Willamette Valley farms.',
    },
    {
      name: 'Elena Brooks',
      role: 'Head Sommelier & Cellar Director',
      bio: 'Curates our 1,400-bottle limestone vault with a focus on low-intervention Oregon Pinot Noir, grower Champagne, and botanical non-alcoholic infusions.',
    },
    {
      name: 'Nadia Kowalski',
      role: 'Director of Banquets & Catering',
      bio: 'Oversees private buyouts, architectural galas, and off-site harvest catering across Greater Portland with twelve years in estate hospitality.',
    },
  ];

  const milestones = [
    {
      year: '2016',
      detail: 'Opened the 64-seat Main Dining Room inside the restored 1924 Alder Carriage House.',
    },
    {
      year: '2019',
      detail: 'Completed restoration of The Grand Timber Hall and 1,400-bottle Cellar Vault.',
    },
    {
      year: '2022',
      detail: 'Launched Alder & Brass Off-Site Catering with zero-plastic stoneware logistics.',
    },
    {
      year: '2026',
      detail: 'Expanded our seasonal sourcing collective to 18 certified regenerative Oregon farms.',
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-16">
      {/* Header & Chef Portrait Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <p className="text-xs font-medium text-[#6C757D]">About {VENUE_CONTACT.brandName}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#14171A] leading-tight [text-wrap:balance]">
            Founded on seasonal restraint, hearth cooking, and unhurried hospitality.
          </h1>
          <p className="text-base text-[#495057] leading-relaxed">
            Housed inside a landmark 1924 timber-and-steel courtyard building in Portland’s Pearl District, Alder &amp; Brass was conceived as two distinct experiences under one roof: an intimate nightly dining room and an architectural estate purpose-built for memorable gatherings.
          </p>
          <p className="text-base text-[#495057] leading-relaxed">
            Every menu begins at morning harvest. Our cooks butcher whole pasture-raised poultry in-house, mill heritage grains weekly, and preserve orchard stone fruit and wild chanterelles for winter banquet service.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors cursor-pointer"
            >
              Explore Seasonal Menu
            </button>
            <button
              type="button"
              onClick={() => onNavigate('booking')}
              className="px-5 py-2.5 text-sm font-medium text-[#14171A] border border-[#CED4DA] hover:bg-white rounded-md transition-colors cursor-pointer"
            >
              Book a Table or Tour
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[#E5E7EB]">
            <SafeImage
              src={VENUE_IMAGES.chefPortrait}
              alt="Executive Chef Julian Vance standing in the Alder & Brass prep kitchen"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-[#6C757D] mt-3">
            Executive Chef &amp; Co-Founder Julian Vance in the Alder Courtyard prep kitchen.
          </p>
        </div>
      </section>

      {/* Leadership Team (3-Column Grid) */}
      <section className="space-y-6 pt-6 border-t border-[#E5E7EB]">
        <div>
          <p className="text-xs font-medium text-[#6C757D]">Culinary &amp; Event Leadership</p>
          <h2 className="font-display text-3xl font-semibold text-[#14171A] mt-1">
            The people behind every service.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <article
              key={member.name}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-3"
            >
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#14171A]">
                  {member.name}
                </h3>
                <p className="text-xs font-medium text-[#1B4332] mt-0.5">{member.role}</p>
              </div>
              <p className="text-sm text-[#495057] leading-relaxed">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Estate Timeline */}
      <section className="bg-white border border-[#E5E7EB] rounded-xl p-8 space-y-6">
        <h2 className="font-display text-2xl font-semibold text-[#14171A]">
          Ten Years at Alder Courtyard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m) => (
            <div key={m.year} className="space-y-2 border-t border-[#E5E7EB] pt-4">
              <p className="font-mono text-lg font-medium text-[#1B4332] tabular-nums">{m.year}</p>
              <p className="text-sm text-[#495057] leading-relaxed">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
