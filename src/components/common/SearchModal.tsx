import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { ImageFallback } from './ImageFallback';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { products } = useStoreData();
  const { formatPrice } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');

  const suggestions = [
    '24K Gold Bar',
    'Bridal Collar',
    'Cuban Link Chain',
    'Diamond Tennis Bracelet',
    'Solitaire Ring',
    '22K Bangles',
    'Jhumka Earrings',
  ];

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.goldPurity.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [searchTerm, products]);

  if (!isOpen) return null;

  const handleSelectProduct = (id: string) => {
    onClose();
    navigate(`/product/${id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-stone-800 p-4">
          <Search className="w-5 h-5 text-amber-400 ml-2 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by jewellery piece, SKU, purity (24K, 22K), category..."
            className="w-full bg-transparent text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 text-stone-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Suggestion Chips */}
        {!searchTerm && (
          <div className="p-5">
            <div className="text-xs uppercase font-semibold text-stone-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Popular Curated Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  onClick={() => setSearchTerm(sug)}
                  className="px-3 py-1.5 rounded-full bg-stone-950 border border-stone-800 text-xs text-stone-300 hover:border-amber-500/60 hover:text-amber-300 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        {searchTerm && (
          <div className="max-h-[60vh] overflow-y-auto p-3">
            {filteredProducts.length > 0 ? (
              <div className="divide-y divide-stone-800/60">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="w-full text-left p-3 rounded-lg hover:bg-stone-800/60 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-14 h-14 rounded overflow-hidden bg-stone-950 shrink-0 border border-stone-800">
                      <ImageFallback
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-0.5">
                        <span className="text-amber-400 font-semibold">{product.goldPurity}</span>
                        <span>·</span>
                        <span>{product.weight}g</span>
                        <span>·</span>
                        <span className="truncate">{product.category}</span>
                      </div>
                      <div className="text-sm font-medium text-stone-100 group-hover:text-amber-300 transition-colors truncate">
                        {product.name}
                      </div>
                      <div className="text-xs font-semibold text-amber-400 tabular-nums">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <p className="text-stone-300 font-medium text-sm mb-1">
                  No jewellery found matching &ldquo;{searchTerm}&rdquo;
                </p>
                <p className="text-stone-500 text-xs max-w-sm mx-auto">
                  Try searching with terms like &ldquo;22K&rdquo;, &ldquo;Ring&rdquo;, &ldquo;Bridal&rdquo;, or &ldquo;Gold Bar&rdquo;.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        {searchTerm && filteredProducts.length > 0 && (
          <div className="p-3 bg-stone-950/60 border-t border-stone-800 text-center">
            <button
              onClick={handleSearchSubmit}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              View all results for &ldquo;{searchTerm}&rdquo; in Shop →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
