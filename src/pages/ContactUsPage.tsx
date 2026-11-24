import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import type { ContactInquiry, PageId } from '../types';
import { VENUE_CONTACT } from '../data/venueData';
import {
  generateReferenceCode,
  validateContactForm,
  type ValidationErrors,
} from '../utils/hospitalityLogic';

interface ContactUsPageProps {
  prefillTopic?: string;
  prefillMessage?: string;
  onNavigate: (page: PageId) => void;
}

const TOPICS = [
  'General Dining Question',
  'Private Banquet Inquiry',
  'Off-Site Catering Proposal',
  'Dietary & Allergy Request',
  'Press & Partnership',
];

export function ContactUsPage({
  prefillTopic,
  prefillMessage,
  onNavigate,
}: ContactUsPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState(prefillTopic || TOPICS[0]);
  const [message, setMessage] = useState(prefillMessage || '');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submittedInquiry, setSubmittedInquiry] = useState<ContactInquiry | null>(null);

  useEffect(() => {
    if (prefillTopic) setTopic(prefillTopic);
    if (prefillMessage) setMessage(prefillMessage);
  }, [prefillTopic, prefillMessage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm({
      name,
      email,
      phone,
      topic,
      message,
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const record: ContactInquiry = {
      id: `inq-${Date.now()}`,
      referenceCode: generateReferenceCode('INQ', Date.now()),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      topic,
      message: message.trim(),
      submittedAt: new Date().toLocaleString(),
    };
    setSubmittedInquiry(record);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">
      <div className="border-b border-[#E5E7EB] pb-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-medium text-[#6C757D]">Concierge &amp; Event Desk</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#14171A] [text-wrap:balance]">
            Contact {VENUE_CONTACT.brandName}
          </h1>
          <p className="text-base text-[#495057] leading-relaxed">
            Reach our dining concierge for large-party arrangements, accessibility requests, private hall tours, or bespoke catering proposals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Direct Estate Details */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-5">
            <h2 className="font-display text-2xl font-semibold text-[#14171A]">
              Estate Directory
            </h2>

            <div className="space-y-4 text-sm text-[#343A40]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1B4332] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#14171A]">{VENUE_CONTACT.brandName}</p>
                  <p>{VENUE_CONTACT.addressLine1}</p>
                  <p>{VENUE_CONTACT.addressLine2}</p>
                  <p className="text-xs text-[#6C757D] mt-1">{VENUE_CONTACT.parkingNote}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#1B4332] shrink-0 mt-1" aria-hidden="true" />
                <div className="space-y-1">
                  <p>
                    <span className="text-[#6C757D]">Dining Desk: </span>
                    <span className="font-mono tabular-nums">{VENUE_CONTACT.phone}</span>
                  </p>
                  <p>
                    <span className="text-[#6C757D]">Banquets &amp; Catering: </span>
                    <span className="font-mono tabular-nums">{VENUE_CONTACT.eventsPhone}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#1B4332] shrink-0 mt-1" aria-hidden="true" />
                <div className="space-y-1">
                  <p>{VENUE_CONTACT.email}</p>
                  <p>{VENUE_CONTACT.eventsEmail}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onNavigate('hours')}
                className="text-sm font-semibold text-[#1B4332] hover:text-[#122E22] cursor-pointer"
              >
                View Visiting Hours &rarr;
              </button>
              <button
                type="button"
                onClick={() => onNavigate('booking')}
                className="text-sm font-medium text-[#495057] hover:text-[#14171A] cursor-pointer"
              >
                Online Booking &rarr;
              </button>
            </div>
          </div>
        </aside>

        {/* Right: Validated Contact Form */}
        <section className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-8">
          {submittedInquiry ? (
            <div className="space-y-5 py-4" role="status">
              <div className="flex items-center gap-3 text-[#1B4332]">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                <h2 className="font-display text-3xl font-semibold text-[#14171A]">
                  Message Received
                </h2>
              </div>
              <p className="text-sm text-[#495057] leading-relaxed">
                Thank you, {submittedInquiry.name}. Our concierge desk has logged your inquiry regarding{' '}
                <span className="font-medium text-[#14171A]">{submittedInquiry.topic}</span> and will respond to{' '}
                <span className="font-medium text-[#14171A]">{submittedInquiry.email}</span> within one business day.
              </p>
              <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4 text-xs font-mono text-[#343A40] space-y-1 tabular-nums">
                <p>Reference: {submittedInquiry.referenceCode}</p>
                <p>Logged: {submittedInquiry.submittedAt}</p>
              </div>
              <button
                type="button"
                onClick={() => setSubmittedInquiry(null)}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <h2 className="font-display text-2xl font-semibold text-[#14171A]">
                Send an Inquiry
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-[#343A40] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Claire Bennett"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                  />
                  {errors.name && (
                    <p className="text-xs text-[#B91C1C] mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-[#343A40] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="claire@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                  />
                  {errors.email && (
                    <p className="text-xs text-[#B91C1C] mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#343A40] mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(503) 555-0194"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-[#B91C1C] mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-topic" className="block text-xs font-semibold text-[#343A40] mb-1.5">
                    Department / Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-[#343A40] mb-1.5">
                  How Can We Help? *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share preferred dates, guest count, or questions for our culinary and events team..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9FA] border border-[#CED4DA] rounded-md focus:outline-none focus:border-[#1B4332]"
                />
                {errors.message && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#122E22] rounded-md transition-colors cursor-pointer"
              >
                Send Inquiry
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
