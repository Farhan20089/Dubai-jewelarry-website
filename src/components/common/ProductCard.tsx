import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { ImageFallback } from './ImageFallback';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onCustomize?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onCustomize,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addToCart(product, 1);
    setIsAddedRecently(true);

    setTimeout(() => {
      setIsAddedRecently(false);
    }, 1500);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product.id);
  };

  return (
    <div className="group relative flex flex-col bg-stone-900/60 dark:bg-stone-900/60 rounded-lg border border-stone-800/80 hover:border-amber-600/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-950/20">
      {/* Badge Ribbon */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.badge && (
          <span className="text-[11px] font-semibold tracking-wider px-2 py-0.5 uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        {product.discountPercent > 0 && (
          <span className="text-[11px] font-semibold tracking-wider px-2 py-0.5 uppercase bg-rose-950/80 text-rose-300 border border-rose-800/50 rounded backdrop-blur-sm">
            -{product.discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        aria-label={
          isFavorite ? 'Remove from wishlist' : 'Add to wishlist'
        }
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-stone-950/70 hover:bg-stone-900 border border-stone-700/60 flex items-center justify-center text-stone-300 hover:text-amber-400 transition-colors backdrop-blur-sm"
      >
        <Heart
          className={`w-4 h-4 transition-transform active:scale-125 ${
            isFavorite ? 'fill-rose-500 text-rose-500' : ''
          }`}
        />
      </button>

      {/* Product Image Link */}
      <Link
        to={`/product/${product.id}`}
        className="relative block w-full aspect-[4/3] bg-stone-950 overflow-hidden"
      >
        <ImageFallback
          src={product.images[0]}
          alt={product.name}
          fallbackTitle={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={handleQuickViewClick}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 text-stone-100 text-xs font-medium border border-amber-500/40 hover:bg-amber-600 hover:text-white transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-bold tracking-widest uppercase text-stone-300 bg-stone-900 px-3 py-1 border border-stone-700 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1 tracking-wide">
            <span className="text-amber-400 font-semibold">
              {product.goldPurity} Gold
            </span>

            <span
              aria-hidden="true"
              className="text-stone-600"
            >
              ·
            </span>

            <span>{product.weight}g</span>

            <span
              aria-hidden="true"
              className="text-stone-600"
            >
              ·
            </span>

            <span className="truncate">
              {product.category}
            </span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-sm font-medium text-stone-100 hover:text-amber-400 transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-xs text-stone-400">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>

            <span className="font-semibold text-stone-200 tabular-nums">
              {product.rating}
            </span>

            <span className="text-stone-500">
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-semibold text-amber-300 tabular-nums">
              {formatPrice(
                product.discountPercent > 0
                  ? product.price *
                    (1 - product.discountPercent / 100)
                  : product.price
              )}
            </div>

            {product.discountPercent > 0 && (
              <div className="text-[11px] text-stone-500 line-through tabular-nums">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Customize */}
            {onCustomize && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCustomize(product);
                }}
                title="Bespoke Customizer"
                className="px-2 py-1.5 text-[11px] rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 border border-stone-700 transition-colors"
              >
                Custom
              </button>
            )}

            {/* Add To Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`p-2 rounded flex items-center justify-center transition-all ${
                isOutOfStock
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  : isAddedRecently
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold shadow-md active:scale-95'
              }`}
              aria-label={
                isOutOfStock
                  ? 'Out of stock'
                  : 'Add to bag'
              }
              title={
                isOutOfStock
                  ? 'Item is out of stock'
                  : 'Add to shopping bag'
              }
            >
              {isAddedRecently ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};