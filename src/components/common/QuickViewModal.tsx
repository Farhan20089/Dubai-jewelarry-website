import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Star, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { ImageFallback } from './ImageFallback';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !product) return null;

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const finalUnitPrice = product.discountPercent > 0
    ? product.price * (1 - product.discountPercent / 100)
    : product.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors border border-stone-700"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Image side */}
        <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-between bg-stone-950/50 border-b md:border-b-0 md:border-r border-stone-800">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-stone-950 mb-3 border border-stone-800/80">
            <ImageFallback
              src={product.images[selectedImgIndex] || product.images[0]}
              alt={product.name}
              fallbackTitle={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 text-[11px] font-semibold tracking-wider px-2 py-0.5 uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail list if multiple */}
          {product.images.length > 1 && (
            <div className="flex gap-2 w-full justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-14 h-14 rounded overflow-hidden border-2 transition-all ${
                    selectedImgIndex === idx
                      ? 'border-amber-500 scale-105'
                      : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <ImageFallback
                    src={img}
                    alt={`${product.name} thumb ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info side */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header tags */}
            <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
              <span className="text-amber-400 font-semibold uppercase">{product.goldPurity} Gold</span>
              <span>·</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h2 className="text-xl font-serif-luxury font-bold text-stone-100 mb-2 leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs mb-3">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="font-semibold text-stone-200">{product.rating}</span>
              <span className="text-stone-500">({product.reviewsCount} verified reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-amber-300 tabular-nums">
                {formatPrice(finalUnitPrice)}
              </span>
              {product.discountPercent > 0 && (
                <span className="text-sm text-stone-500 line-through tabular-nums">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-stone-950/60 rounded-lg border border-stone-800 text-xs mb-4">
              <div>
                <span className="text-stone-500 block">Gold Purity</span>
                <span className="font-medium text-stone-200">{product.goldPurity} Certified</span>
              </div>
              <div>
                <span className="text-stone-500 block">Gross Weight</span>
                <span className="font-medium text-stone-200">{product.weight} grams</span>
              </div>
              <div>
                <span className="text-stone-500 block">Making Charge</span>
                <span className="font-medium text-stone-200">{formatPrice(product.makingCharge)}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Stock Status</span>
                <span className={`font-medium ${isOutOfStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs text-stone-300 leading-relaxed mb-4 line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Action Row */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-stone-700 rounded bg-stone-950">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-2 text-sm font-semibold text-stone-100 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1.5 text-stone-400 hover:text-white disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-2 px-4 rounded font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-md'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-2.5 rounded border border-stone-700 bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-rose-400 transition-colors"
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* View Full Product link */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs text-stone-400">
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Dubai Hallmarked
              </span>
              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Full Specifications <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
