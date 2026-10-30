import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { JewelleryCustomizer } from '../components/common/JewelleryCustomizer';
import { ImageFallback } from '../components/common/ImageFallback';
import { Product } from '../types';

export const CollectionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { collections, products } = useStoreData();

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [customizeProduct, setCustomizeProduct] = useState<Product | null>(null);

  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-stone-950">
        <h2 className="text-2xl font-serif-luxury font-bold text-stone-100 mb-2">
          Collection Not Found
        </h2>
        <Link
          to="/collections"
          className="px-6 py-2.5 rounded bg-amber-600 text-stone-950 font-bold text-xs uppercase"
        >
          View All Collections
        </Link>
      </div>
    );
  }

  const collectionProducts = products.filter(
    (p) => p.collection.toLowerCase() === collection.name.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-stone-950 pb-16">
      {/* Banner */}
      <div className="relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden border-b border-stone-800">
        <ImageFallback
          src={collection.bannerImage}
          alt={collection.title}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <Link
            to="/collections"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 mb-4 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Collections
          </Link>

          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-stone-100 mb-3">
            {collection.title}
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed mb-4">
            {collection.description}
          </p>

          <span className="text-xs text-amber-400 font-semibold bg-stone-900/80 px-3 py-1 rounded-full border border-stone-800">
            {collectionProducts.length} Exclusive Pieces Available
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collectionProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onCustomize={(prod) => setCustomizeProduct(prod)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-stone-900/40 rounded-xl border border-stone-800 text-stone-400 text-xs">
            New seasonal acquisitions for this collection are currently being assayed in our Deira Souk atelier.
          </div>
        )}
      </div>

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <JewelleryCustomizer
        product={customizeProduct}
        isOpen={!!customizeProduct}
        onClose={() => setCustomizeProduct(null)}
      />
    </div>
  );
};
