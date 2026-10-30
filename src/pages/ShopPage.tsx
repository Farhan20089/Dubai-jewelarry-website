import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { JewelleryCustomizer } from '../components/common/JewelleryCustomizer';
import { Product, GoldPurity, GenderCategory, SortOption } from '../types';

export const ShopPage: React.FC = () => {
  const { products, categories, collections } = useStoreData();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const categoryParam = searchParams.get('category') || 'All';
  const collectionParam = searchParams.get('collection') || 'All';
  const searchParam = searchParams.get('search') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedCollection, setSelectedCollection] = useState<string>(collectionParam);
  const [selectedPurity, setSelectedPurity] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(40000);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Mobile filters drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [customizeProduct, setCustomizeProduct] = useState<Product | null>(null);

  // Sync from URL changes
  useEffect(() => {
    if (categoryParam !== selectedCategory) setSelectedCategory(categoryParam);
    if (collectionParam !== selectedCollection) setSelectedCollection(collectionParam);
    if (searchParam !== searchQuery) setSearchQuery(searchParam);
  }, [categoryParam, collectionParam, searchParam]);

  // Handle category change and sync URL
  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setSelectedPurity('All');
    setSelectedGender('All');
    setInStockOnly(false);
    setMaxPriceLimit(40000);
    setMinRating(0);
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All') {
        const catMatch =
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());
        if (!catMatch) return false;
      }

      // Collection filter
      if (selectedCollection !== 'All') {
        if (p.collection.toLowerCase() !== selectedCollection.toLowerCase()) {
          return false;
        }
      }

      // Gold Purity
      if (selectedPurity !== 'All') {
        if (p.goldPurity !== selectedPurity) return false;
      }

      // Gender
      if (selectedGender !== 'All') {
        if (p.gender !== selectedGender && p.gender !== 'Unisex') return false;
      }

      // In stock
      if (inStockOnly && p.stock <= 0) return false;

      // Price limit
      if (p.price > maxPriceLimit) return false;

      // Min Rating
      if (p.rating < minRating) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesSku && !matchesCat && !matchesTag) return false;
      }

      return true;
    });
  }, [
    products,
    selectedCategory,
    selectedCollection,
    selectedPurity,
    selectedGender,
    inStockOnly,
    maxPriceLimit,
    minRating,
    searchQuery,
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'popular':
        return list.sort((a, b) => b.reviewsCount - a.reviewsCount);
      case 'featured':
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="min-h-screen bg-stone-950 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner & Breadcrumb */}
      <div className="mb-8 pb-6 border-b border-stone-800">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-amber-400">Shop Jewellery</span>
          {selectedCategory !== 'All' && (
            <>
              <span>/</span>
              <span className="text-stone-200">{selectedCategory}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100">
              {selectedCategory !== 'All' ? selectedCategory : 'All Jewellery Creations'}
            </h1>
            <p className="text-xs text-stone-400 mt-1 max-w-xl">
              Authentic 24K, 22K, 21K, and 18K handcrafted pieces hallmarked by Dubai Central Laboratories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-200 font-medium"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-stone-900 border border-stone-800 rounded-lg px-4 py-2 pr-8 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest Arrivals</option>
                <option value="price-low">Sort: Price: Low to High</option>
                <option value="price-high">Sort: Price: High to Low</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="popular">Sort: Most Popular</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-stone-900/40 p-5 rounded-xl border border-stone-800/80 self-start">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-200 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Filter Jewellery
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-1.5">
              Keyword or SKU
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-2">
              Category
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                  selectedCategory === 'All'
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <span>All Jewellery</span>
                <span className="tabular-nums text-[10px] opacity-75">{products.length}</span>
              </button>
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.name).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCategorySelect(c.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === c.name
                        ? 'bg-amber-600 text-stone-950 font-bold'
                        : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="tabular-nums text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gold Purity */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-2">
              Gold Purity
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['All', '24K', '22K', '21K', '18K'].map((purity) => (
                <button
                  key={purity}
                  onClick={() => setSelectedPurity(purity)}
                  className={`py-1.5 px-2 rounded border text-xs text-center transition-colors ${
                    selectedPurity === purity
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {purity === 'All' ? 'All Purities' : `${purity} Gold`}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-2">
              Gender / Recipient
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['All', 'Women', 'Men', 'Unisex'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`py-1.5 px-2 rounded border text-xs text-center transition-colors ${
                    selectedGender === g
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
              <span className="font-semibold uppercase">Max Price</span>
              <span className="text-amber-400 font-bold tabular-nums">
                AED {maxPriceLimit.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={40000}
              step={1000}
              value={maxPriceLimit}
              onChange={(e) => setMaxPriceLimit(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>AED 2,000</span>
              <span>AED 40,000+</span>
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-300">In Stock Ready to Ship</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded border-stone-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <section className="lg:col-span-3">
          {/* Active Filter Tags */}
          {(selectedCategory !== 'All' ||
            selectedPurity !== 'All' ||
            selectedGender !== 'All' ||
            inStockOnly ||
            searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-stone-500 font-medium">Active filters:</span>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => handleCategorySelect('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-xs text-stone-200 hover:text-white"
                >
                  Category: {selectedCategory} <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              {selectedPurity !== 'All' && (
                <button
                  onClick={() => setSelectedPurity('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-xs text-stone-200 hover:text-white"
                >
                  {selectedPurity} <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              {selectedGender !== 'All' && (
                <button
                  onClick={() => setSelectedGender('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-xs text-stone-200 hover:text-white"
                >
                  {selectedGender} <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              {inStockOnly && (
                <button
                  onClick={() => setInStockOnly(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-xs text-stone-200 hover:text-white"
                >
                  In Stock Only <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-xs text-stone-200 hover:text-white"
                >
                  &ldquo;{searchQuery}&rdquo; <X className="w-3 h-3 text-stone-400" />
                </button>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-400 hover:text-amber-300 ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid or Empty State */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onCustomize={(p) => setCustomizeProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-stone-900/40 rounded-xl border border-stone-800">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-serif-luxury font-bold text-stone-100 mb-2">
                No jewellery found matching your search.
              </h2>
              <p className="text-xs text-stone-400 max-w-md mx-auto mb-6">
                Try widening your price range, clearing purity selections, or exploring our flagship Dubai Souk categories.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded font-semibold text-xs uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-stone-950 shadow"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/80 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-stone-900 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <span className="font-serif-luxury text-lg font-bold text-stone-100">
                  Filters &amp; Refinements
                </span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded text-stone-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-2">
                  Category
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => handleCategorySelect('All')}
                    className={`w-full text-left px-3 py-2 rounded text-xs ${
                      selectedCategory === 'All' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300'
                    }`}
                  >
                    All Jewellery
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategorySelect(c.name)}
                      className={`w-full text-left px-3 py-2 rounded text-xs ${
                        selectedCategory === c.name ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gold Purity */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-2">
                  Gold Purity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['All', '24K', '22K', '21K', '18K'].map((purity) => (
                    <button
                      key={purity}
                      onClick={() => setSelectedPurity(purity)}
                      className={`py-2 px-3 rounded border text-xs text-center ${
                        selectedPurity === purity
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                          : 'border-stone-800 bg-stone-950 text-stone-400'
                      }`}
                    >
                      {purity}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="w-1/2 py-2.5 rounded bg-stone-800 text-xs font-semibold text-stone-300 hover:text-white"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-1/2 py-2.5 rounded bg-amber-600 text-stone-950 text-xs font-bold uppercase tracking-wider"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

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
