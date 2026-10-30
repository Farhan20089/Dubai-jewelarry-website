import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle2,
  TrendingUp,
  Scale,
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { useCurrency } from '../context/CurrencyContext';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { JewelleryCustomizer } from '../components/common/JewelleryCustomizer';
import { ImageFallback } from '../components/common/ImageFallback';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { products, categories, goldRates, reviews, recentlyViewedIds } = useStoreData();
  const { formatPrice } = useCurrency();

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [customizeProduct, setCustomizeProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'newarrivals'>('featured');

  // Filtered products for curated showcases
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 8);

  const displayedProducts =
    activeTab === 'featured'
      ? featuredProducts
      : activeTab === 'bestsellers'
      ? bestSellers
      : newArrivals;

  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[680px] flex items-center justify-center bg-stone-950 overflow-hidden">
        {/* Background Image with Deep Luxury Gradient Scrim */}
        <div className="absolute inset-0 z-0">
          <ImageFallback
            src="/src/assets/images/hero_dubai_gold_1790862765571.jpg"
            alt="Dubai Gold & Jewellers Royal Exhibition"
            className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Deira Gold Souk · Certified Dubai Luxury
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-luxury font-bold text-stone-100 tracking-tight leading-[1.08] mb-6 drop-shadow-lg text-balance">
            Timeless Gold.{' '}
            <span className="block gold-text-gradient font-normal italic">
              Exceptional Craftsmanship.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed mb-10 text-balance">
            Discover exquisite 24K bullion, handcrafted 22K bridal ornaments, and GIA-certified diamond high jewellery crafted for moments that endure for generations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded font-semibold text-xs tracking-widest uppercase bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-xl shadow-amber-900/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              Shop Jewellery
            </Link>
            <Link
              to="/collections"
              className="w-full sm:w-auto px-8 py-3.5 rounded font-semibold text-xs tracking-widest uppercase bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-amber-500/40 hover:border-amber-400 transition-all backdrop-blur-sm"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      {/* 2. GOLD RATE SHOWCASE STRIP */}
      <section className="bg-stone-900/80 border-y border-stone-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
                Live Dubai Gold Rates
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                  Official Souk Rate
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Fixing as of {goldRates.lastUpdatedTime} · Updated Manually
              </p>
            </div>
          </div>

          {/* Quick Rate Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            {(['24K', '22K', '21K', '18K'] as const).map((purity) => (
              <div
                key={purity}
                className="bg-stone-950/80 px-4 py-2.5 rounded-lg border border-stone-800 text-center"
              >
                <span className="text-[11px] font-semibold text-amber-400 block">{purity} Gold</span>
                <span className="text-sm font-bold text-stone-100 tabular-nums">
                  {formatPrice(goldRates[purity].ratePerGram)}
                  <span className="text-[10px] text-stone-400 font-normal">/g</span>
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/gold-calculator"
            className="shrink-0 text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Price Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Curated Showroom
            </span>
            <h2 className="text-3xl font-serif-luxury font-bold text-stone-100 mt-1">
              Featured Jewellery Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-stone-300 hover:text-amber-400 inline-flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-800/80 hover:border-amber-600/50 transition-all duration-300 shadow-md"
            >
              <ImageFallback
                src={cat.image}
                alt={cat.name}
                fallbackTitle={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-stone-400">
                    {cat.itemCount} Designs Available
                  </span>
                </div>
                <span className="w-7 h-7 rounded-full bg-stone-900/80 border border-stone-700 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. CURATED SHOWCASE: FEATURED / BEST SELLERS / NEW ARRIVALS */}
      <section className="py-16 bg-stone-900/40 border-t border-stone-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                Atelier Highlights
              </span>
              <h2 className="text-3xl font-serif-luxury font-bold text-stone-100 mt-1">
                The Masterpiece Collection
              </h2>
            </div>

            {/* Interactive Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'featured'
                    ? 'bg-amber-600 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                Featured Pieces
              </button>
              <button
                onClick={() => setActiveTab('bestsellers')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'bestsellers'
                    ? 'bg-amber-600 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab('newarrivals')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'newarrivals'
                    ? 'bg-amber-600 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                New Arrivals
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
                onCustomize={(p) => setCustomizeProduct(p)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 rounded border border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-stone-950 transition-all font-semibold text-xs tracking-widest uppercase shadow"
            >
              Explore Full 30+ Piece Catalogue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. LUXURY COLLECTION PROMOTIONAL BANNER */}
      <section className="relative my-12 overflow-hidden border-y border-stone-800">
        <div className="relative min-h-[460px] flex items-center justify-center">
          <ImageFallback
            src="/src/assets/images/luxury_collection_banner_1790862779214.jpg"
            alt="Royal Arabian Bridal Haute Joaillerie"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-stone-950/90" />

          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-amber-400 mb-4 block">
              High Jewellery Exhibition
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-stone-100 leading-tight mb-4">
              The Royal Bridal Suite
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Monumental bridal sets crafted in 22K Dubai Gold, encrusted with diamonds and natural gemstones. Commissioned for royal weddings across the Emirates.
            </p>
            <Link
              to="/collection/bridal-collection"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded font-semibold text-xs tracking-widest uppercase bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-2xl transition-all hover:scale-105"
            >
              <span>Explore Luxury Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CRAFTSMANSHIP & WHY CHOOSE US */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 shadow-2xl">
            <ImageFallback
              src="/src/assets/images/craftsmanship_artisan_1790862790908.jpg"
              alt="Master goldsmith bench hand engraving filigree in Dubai atelier"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-stone-950/80 border border-stone-800/80 backdrop-blur-md">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
                The Artisan Heritage
              </span>
              <span className="text-xs text-stone-300">
                Over 120 dedicated goldsmiths, diamond setters, and gemologists based in our Deira Souk atelier.
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Why Dubai Gold &amp; Jewellers
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 mt-2 mb-6">
              Purity Verified by Government Hallmarks
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed mb-6">
              Every single gram of gold, diamond solitaire, and investment bar leaving our showroom carries official verification from the Dubai Central Laboratories (DCL) and London Bullion Market Association (LBMA).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-stone-900/60 border border-stone-800">
                <CheckCircle2 className="w-5 h-5 text-amber-400 mb-2" />
                <h3 className="text-sm font-semibold text-stone-200">100% Authentic Gold</h3>
                <p className="text-xs text-stone-400 mt-1">Zero impurity tolerance with guaranteed buyback value.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-900/60 border border-stone-800">
                <Award className="w-5 h-5 text-amber-400 mb-2" />
                <h3 className="text-sm font-semibold text-stone-200">Certified Jewellery</h3>
                <p className="text-xs text-stone-400 mt-1">Accredited GIA and IGI diamond dossiers included.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-900/60 border border-stone-800">
                <Truck className="w-5 h-5 text-amber-400 mb-2" />
                <h3 className="text-sm font-semibold text-stone-200">Secure Insured Transport</h3>
                <p className="text-xs text-stone-400 mt-1">Armored courier delivery across all UAE Emirates.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-900/60 border border-stone-800">
                <RotateCcw className="w-5 h-5 text-amber-400 mb-2" />
                <h3 className="text-sm font-semibold text-stone-200">Lifetime Exchange</h3>
                <p className="text-xs text-stone-400 mt-1">Complimentary ultrasonic cleaning and resizing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7. CUSTOMER REVIEWS */}
        <div className="pt-12 border-t border-stone-800">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Client Testimonials
            </span>
            <h2 className="text-3xl font-serif-luxury font-bold text-stone-100 mt-1">
              Words From Our Patrons
            </h2>
            <p className="text-xs text-stone-400 mt-2">
              Read verified feedback from collectors, brides, and gold investors in the UAE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-lg bg-stone-900/70 border border-stone-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed italic mb-4">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-100">{rev.customerName}</h4>
                    <span className="text-[10px] text-stone-500 block truncate max-w-[180px]">
                      {rev.productName}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. RECENTLY VIEWED (Requirement #63) */}
        {recentlyViewedProducts.length > 0 && (
          <div className="pt-16 mt-16 border-t border-stone-800">
            <h2 className="text-xl font-serif-luxury font-bold text-stone-100 mb-6">
              Recently Viewed Pieces
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewedProducts.slice(0, 4).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                  onCustomize={(prod) => setCustomizeProduct(prod)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Jewellery Customizer Modal */}
      <JewelleryCustomizer
        product={customizeProduct}
        isOpen={!!customizeProduct}
        onClose={() => setCustomizeProduct(null)}
      />
    </div>
  );
};
