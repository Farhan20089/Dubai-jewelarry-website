import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { ImageFallback } from '../components/common/ImageFallback';

export const CollectionsPage: React.FC = () => {
  const { collections, products } = useStoreData();

  return (
    <div className="min-h-screen bg-stone-950 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500 block mb-2">
          Curated Royal Archives
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-luxury font-bold text-stone-100 mb-4">
          The Signature Collections
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
          From sovereign 24K bullion to regal bridal suites and masculine solid gold, explore curated universes crafted with over three decades of Dubai master goldsmithing.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((col) => {
          const matchingCount = products.filter((p) => p.collection === col.name).length;
          return (
            <Link
              key={col.id}
              to={`/collection/${col.slug}`}
              className="group relative rounded-xl overflow-hidden border border-stone-800/80 hover:border-amber-600/60 transition-all duration-500 shadow-xl flex flex-col justify-end min-h-[380px] p-6 sm:p-8"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <ImageFallback
                  src={col.bannerImage}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.45]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
              </div>

              {/* Content overlay */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    {col.name}
                  </span>
                  <span className="text-xs text-stone-400 bg-stone-950/80 px-2.5 py-0.5 rounded border border-stone-800">
                    {matchingCount} Pieces
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100 group-hover:text-amber-300 transition-colors mb-2">
                  {col.title}
                </h2>

                <p className="text-xs text-stone-300 leading-relaxed mb-4 line-clamp-2">
                  {col.subtitle}
                </p>

                <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 group-hover:text-amber-300 uppercase tracking-wider">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
