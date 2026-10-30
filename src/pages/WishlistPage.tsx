import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useStoreData } from '../context/StoreDataContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { ImageFallback } from '../components/common/ImageFallback';
import { Product } from '../types';

export const WishlistPage: React.FC = () => {
  const { wishlistIds, removeFromWishlist, clearWishlist } = useWishlist();
  const { products } = useStoreData();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const savedProducts = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const handleMoveAllToCart = () => {
    savedProducts.forEach((p) => {
      if (p.stock > 0) {
        addToCart(p, 1);
      }
    });
    clearWishlist();
  };

  if (savedProducts.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-stone-950">
        <div className="w-20 h-20 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mb-6 text-rose-500/80">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif-luxury font-bold text-stone-100 mb-2">
          Save your favourite pieces here.
        </h1>
        <p className="text-xs text-stone-400 max-w-sm mx-auto mb-8 leading-relaxed">
          Create your private wishlist of handcrafted bridal sets, 24K bars, and diamond jewellery to review later or commission.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 rounded font-semibold text-xs tracking-widest uppercase bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-xl transition-all"
        >
          Explore Showroom
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-stone-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-amber-400">My Wishlist</span>
          </div>
          <h1 className="text-3xl font-serif-luxury font-bold text-stone-100">
            Saved Jewellery ({savedProducts.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMoveAllToCart}
            className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow"
          >
            <ShoppingBag className="w-4 h-4" /> Move All to Bag
          </button>
          <button
            onClick={clearWishlist}
            className="px-3 py-2 rounded bg-stone-900 border border-stone-800 hover:border-rose-700 text-stone-400 hover:text-rose-400 text-xs transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {savedProducts.map((product) => (
          <div
            key={product.id}
            className="relative flex flex-col bg-stone-900/60 rounded-xl border border-stone-800 overflow-hidden shadow-md hover:border-amber-600/40 transition-all"
          >
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-stone-950/80 text-stone-400 hover:text-rose-400 border border-stone-700 backdrop-blur-sm"
              title="Remove from wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <Link
              to={`/product/${product.id}`}
              className="relative aspect-[4/3] bg-stone-950 overflow-hidden block"
            >
              <ImageFallback
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </Link>

            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                  <span className="text-amber-400 font-bold">{product.goldPurity}</span>
                  <span>·</span>
                  <span>{product.weight}g</span>
                  <span>·</span>
                  <span className="truncate">{product.category}</span>
                </div>

                <Link
                  to={`/product/${product.id}`}
                  className="font-medium text-sm text-stone-100 hover:text-amber-400 transition-colors line-clamp-1 block"
                >
                  {product.name}
                </Link>

                <div className="text-base font-bold text-amber-300 mt-2 tabular-nums">
                  {formatPrice(product.price)}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800 flex gap-2">
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    removeFromWishlist(product.id);
                  }}
                  disabled={product.stock <= 0}
                  className="flex-1 py-2 px-3 rounded font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 flex items-center justify-center gap-1.5 disabled:opacity-40 shadow"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
