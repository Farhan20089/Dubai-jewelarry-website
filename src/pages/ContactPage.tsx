import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Check,
  Building2,
  Calendar,
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { settings, addContactMessage } = useStoreData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all mandatory fields.', 'error');
      return;
    }

    addContactMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    });

    setIsSubmitted(true);
    showToast('Inquiry sent successfully to our Souk Concierge.', 'success');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  const whatsappHref = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello Dubai Gold & Jewellers, I would like to schedule a private showroom appointment.'
  )}`;

  return (
    <div className="min-h-screen bg-stone-950 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 block mb-2">
          Concierge &amp; Private Consultations
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-stone-100 mb-3">
          Connect with Our Atelier
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
          Whether inquiring about custom bridal suites, acquiring 24K bullion, or reserving a private viewing suite in the Gold Souk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Left Info & Showrooms (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-5">
            <h2 className="text-lg font-serif-luxury font-bold text-stone-100 pb-3 border-b border-stone-800">
              Showroom Locations
            </h2>

            {/* Flagship Showroom */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Deira Gold Souk Flagship</span>
              </div>
              <p className="text-xs text-stone-300">
                Suite 401, Gold Centre Building, Old Baladiya Street, Deira Gold Souk, Dubai, UAE
              </p>
              <p className="text-[11px] text-stone-500">
                Saturday – Thursday: 10:00 AM – 10:30 PM | Friday: 4:00 PM – 10:30 PM
              </p>
            </div>

            {/* Downtown VIP Salon */}
            <div className="space-y-2 pt-4 border-t border-stone-800/80">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Downtown Dubai VIP Private Salon</span>
              </div>
              <p className="text-xs text-stone-300">
                Level 12, Boulevard Plaza Tower 1, Sheikh Mohammed bin Rashid Blvd, Downtown Dubai
              </p>
              <p className="text-[11px] text-stone-500">
                By Appointment Only · Valet Parking Available
              </p>
            </div>
          </div>

          {/* Quick Direct Contacts */}
          <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase text-stone-300 tracking-wider">
              Direct Inquiries
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-950 flex items-center justify-center text-amber-400 border border-stone-800">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Showroom Switchboard</span>
                  <span className="text-stone-200 font-mono font-semibold">{settings.storePhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-950 flex items-center justify-center text-amber-400 border border-stone-800">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Concierge Email</span>
                  <span className="text-stone-200">{settings.storeEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-800/60">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Official WhatsApp</span>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-mono"
                  >
                    {settings.whatsappNumber} (Chat Now)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-xl font-serif-luxury font-bold text-stone-100 mb-1">
            Send an Inquiry to the Atelier
          </h2>
          <p className="text-xs text-stone-400 mb-6">
            Our gold experts and bridal consultants will reply within 2 working hours.
          </p>

          {isSubmitted ? (
            <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-3">
              <Check className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-200">Message Delivered</p>
                <p className="mt-0.5">Thank you. Your inquiry has been logged in our concierge records.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tariq Mansour"
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. tariq@outlook.com"
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+971 50 123 4567"
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                  Message / Bespoke Commission Request *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the jewellery design, purity, target budget, or preferred appointment date..."
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry to Showroom</span>
              </button>
            </form>
          )}

          {/* Interactive Map Visual Placeholder */}
          <div className="mt-8 pt-6 border-t border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-2">
              Interactive Showroom Locator
            </span>
            <div className="w-full h-40 rounded-lg bg-stone-950 border border-stone-800 flex flex-col items-center justify-center text-center p-4">
              <MapPin className="w-6 h-6 text-amber-500 mb-1 animate-bounce" />
              <span className="text-xs font-semibold text-stone-200">Deira Gold Souk Precinct</span>
              <span className="text-[11px] text-stone-500">25.2676° N, 55.2974° E · Dubai Creek Water Taxi Station nearby</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
