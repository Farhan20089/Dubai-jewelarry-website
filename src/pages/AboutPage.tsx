import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Gem,
  CheckCircle2,
} from 'lucide-react';
import { ImageFallback } from '../components/common/ImageFallback';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      {/* Hero Banner */}
      <section className="relative min-h-[460px] flex items-center justify-center border-b border-stone-800 overflow-hidden">
        <ImageFallback
          src="/src/assets/images/hero_dubai_gold_1790862765571.jpg"
          alt="Dubai Gold Souk Heritage"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-3 block">
            Deira Gold Souk · Established 1988
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif-luxury font-bold text-stone-100 mb-4">
            A Legacy of Pure Arabian Gold
          </h1>
          <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-xl mx-auto">
            From the bustling traditional alleyways of Old Dubai to the private vaults of royal dignitaries across the globe.
          </p>
        </div>
      </section>

      {/* Story & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Our Origins
            </span>
            <h2 className="text-3xl font-serif-luxury font-bold text-stone-100 mt-2 mb-6">
              Born Along the Historic Dubai Creek
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-stone-400 leading-relaxed">
              <p>
                Founded in 1988 within the vibrant maze of the Deira Gold Souk, <strong>Dubai Gold &amp; Jewellers</strong> began as a family-led goldsmith atelier dedicated to preserving the ancient art of Emirati bridal filigree.
              </p>
              <p>
                Over nearly four decades, as Dubai transformed into the &ldquo;City of Gold&rdquo;, our house expanded into an internationally revered jewellery institution, trusted by private collectors, state dignitaries, and generations of families celebrating monumental life occasions.
              </p>
              <p>
                Today, our master benches marry time-honored Arabian hand-chasing techniques with micro-laser precision, crafting singular works in 24K bullion, 22K solid gold, and certified high jewellery diamonds.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 shadow-2xl">
            <ImageFallback
              src="/src/assets/images/craftsmanship_artisan_1790862790908.jpg"
              alt="Artisan Benchwork in Dubai Gold Atelier"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars / Quality Promise */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              The Gold Standard
            </span>
            <h2 className="text-3xl font-serif-luxury font-bold text-stone-100 mt-1">
              Our Uncompromising Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-100 mb-2">Government Verified Hallmarking</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Zero tolerance for alloy variance. Every creation is certified by the Dubai Central Laboratories (DCL) Bareeq quality program.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-100 mb-2">Master Bench Goldsmithing</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Our in-house artisans undergo rigorous decades-long training, executing complex hollow rope weaves, micro-prongs, and hand filigree.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-100 mb-2">Ethical Sourcing &amp; LBMA</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                All 24K minted gold bars comply strictly with London Bullion Market Association (LBMA) and Kimberley Process conflict-free certifications.
              </p>
            </div>
          </div>
        </div>

        {/* CTA to showroom */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 text-center">
          <h2 className="text-3xl font-serif-luxury font-bold text-stone-100 mb-3">
            Experience Our Private Showrooms
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto mb-8">
            Schedule a private consultation in our Deira Gold Souk lounge or downtown suite to commission bespoke bridal ensembles or acquire bullion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow"
            >
              Book Showroom Appointment
            </Link>
            <Link
              to="/shop"
              className="px-8 py-3 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
