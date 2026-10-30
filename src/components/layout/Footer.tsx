import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Award,
  Truck,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const { settings, addSubscriber } = useStoreData();
  const { showToast } = useToast();
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    const added = addSubscriber(emailInput);
    if (added) {
      setIsSubscribed(true);
      setEmailInput('');
      showToast('Thank you for subscribing to our luxury newsletter.', 'success');
      setTimeout(() => setIsSubscribed(false), 3000);
    } else {
      showToast('This email is already registered with our newsletter.', 'info');
    }
  };

  const whatsappHref = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello Dubai Gold & Jewellers, I would like to inquire about your jewellery collections.'
  )}`;

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-300 pt-16 pb-20 md:pb-12 text-xs">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-stone-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">100% Certified Gold</h4>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Official Dubai Central Laboratories hallmarking certificate.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Souk Master Goldsmiths</h4>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Handcrafted filigree with over 35 years of royal Arab heritage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Insured Armed Delivery</h4>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Fully insured white-glove security transport across UAE and GCC.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">VIP Concierge Service</h4>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Personalized virtual consultations and bespoke commissions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Heritage */}
          <div className="lg:col-span-2">
            <span className="font-display tracking-[0.2em] text-lg font-bold uppercase gold-text-gradient block mb-3">
              DUBAI GOLD & JEWELLERS
            </span>
            <p className="text-stone-400 leading-relaxed pr-6 mb-6">
              Premier destination for royal 24K bullion, handcrafted 22K bridal ornaments, and GIA-certified diamond high jewellery in the historic heart of Dubai’s Deira Gold Souk.
            </p>

            <div className="space-y-2.5 text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-stone-400">{settings.storeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] text-stone-400">{settings.openingHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] text-stone-300 font-mono">{settings.storePhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] text-stone-400">{settings.storeEmail}</span>
              </div>
            </div>

            <div className="mt-5">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat with Souk Concierge on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100 mb-4 font-sans">
              The Collections
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li>
                <Link to="/collection/dubai-collection" className="hover:text-amber-400 transition-colors">
                  Dubai Royal Collection
                </Link>
              </li>
              <li>
                <Link to="/collection/bridal-collection" className="hover:text-amber-400 transition-colors">
                  Royal Bride Suites
                </Link>
              </li>
              <li>
                <Link to="/collection/mens-collection" className="hover:text-amber-400 transition-colors">
                  Men’s Solid Gold
                </Link>
              </li>
              <li>
                <Link to="/collection/investment-gold" className="hover:text-amber-400 transition-colors">
                  24K Bullion & Minted Bars
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Diamond%20Jewellery" className="hover:text-amber-400 transition-colors">
                  Certified Diamond Lines
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-400 transition-colors">
                  All Jewellery Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Calculations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100 mb-4 font-sans">
              Gold Services
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li>
                <Link to="/gold-rates" className="hover:text-amber-400 transition-colors">
                  Daily Dubai Gold Rates
                </Link>
              </li>
              <li>
                <Link to="/gold-calculator" className="hover:text-amber-400 transition-colors">
                  Interactive Gold Calculator
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  Our Atelier & Artisans
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Showroom Appointments
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-amber-400 transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-400 text-stone-500 transition-colors">
                  Showroom Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100 mb-4 font-sans">
              The Gold Gazette
            </h4>
            <p className="text-stone-400 text-[11px] leading-relaxed mb-3">
              Receive confidential gold market alerts, private collection debuts, and invitations to private viewings.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className={`w-full py-2 px-3 rounded font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  isSubscribed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Subscribed
                  </>
                ) : (
                  <>
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
            <p className="text-[10px] text-stone-500 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Dubai Gold & Jewellers LLC. All rights reserved. Deira Souk, UAE.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-500/80">Market Rate — Updated Manually</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Hallmark Verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
