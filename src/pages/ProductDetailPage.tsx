import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Check,
  ArrowRight,
  ZoomIn,
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/common/ProductCard';
import { JewelleryCustomizer } from '../components/common/JewelleryCustomizer';
import { ImageFallback } from '../components/common/ImageFallback';
import { Product, GoldPurity } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, settings, reviews, addReview, addToRecentlyViewed } = useStoreData();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const product = products.find((p) => p.id === id);

  // States
  const [selectedImg, setSelectedImg] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPurity, setSelectedPurity] = useState<GoldPurity>('22K');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [chainLength, setChainLength] = useState<string>('20"');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Delivery Estimator
  const [postalInput, setPostalInput] = useState<string>('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  // Customizer Modal
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  // Review Form
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Add to recently viewed on mount
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product.id);
      setSelectedPurity(product.goldPurity);
      if (product.availableSizes && product.availableSizes.length > 0) {
        setSelectedSize(product.availableSizes[0]);
      }
      setSelectedImg(0);
      window.scrollTo(0, 0);
    }
  }, [id, product, addToRecentlyViewed]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-stone-950">
        <h2 className="text-2xl font-serif-luxury font-bold text-stone-100 mb-2">
          Jewellery Piece Not Found
        </h2>
        <p className="text-xs text-stone-400 mb-6">
          The requested item is either retired or does not exist in our current catalogue.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs uppercase tracking-wider"
        >
          Return to Showroom
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  // Pricing calculations
  const discountAmount =
    product.discountPercent > 0 ? (product.price * product.discountPercent) / 100 : 0;
  const finalUnitPrice = Math.max(0, product.price - discountAmount);

  // Handle Add To Cart
  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, {
      selectedPurity,
      selectedSize: selectedSize || undefined,
      chainLength:
        product.category.toLowerCase().includes('chain') ||
        product.category.toLowerCase().includes('necklace')
          ? chainLength
          : undefined,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Handle Buy Now (add and route straight to checkout)
  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, {
      selectedPurity,
      selectedSize: selectedSize || undefined,
    });
    navigate('/checkout');
  };

  // WhatsApp Order Link
  const whatsappOrderMessage = `Hello Dubai Gold & Jewellers, I would like to place an order for:
*${product.name}*
SKU: ${product.sku}
Purity: ${selectedPurity}
Weight: ${product.weight}g
Price: AED ${finalUnitPrice.toLocaleString()}
Quantity: ${quantity}
${selectedSize ? `Size: ${selectedSize}` : ''}
Please confirm availability and dispatch to my location.`;

  const whatsappLink = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    whatsappOrderMessage
  )}`;

  // Delivery check handler
  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalInput.trim()) return;
    setDeliveryEstimate('Estimated delivery: 2–3 business days via Insured Secure Courier (UAE)');
  };

  // Submit review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewText) return;

    addReview({
      productId: product.id,
      productName: product.name,
      customerName: reviewAuthor,
      customerEmail: reviewEmail || 'client@dubaigold.com',
      rating: reviewRating,
      reviewText,
      verifiedPurchase: true,
    });

    setReviewSubmitted(true);
    showToast('Your review has been submitted successfully.', 'success');
    setReviewText('');
    setReviewAuthor('');
  };

  // Product reviews
  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === 'approved');

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-amber-400 transition-colors">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-amber-400 transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-stone-200 truncate">{product.name}</span>
      </div>

      {/* Main Contiguous Purchase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        {/* Left Column: Gallery (7 Cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
          {/* Main Selected Image with Zoom */}
          <div
            className="relative flex-1 aspect-square rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shadow-xl cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <ImageFallback
              src={product.images[selectedImg] || product.images[0]}
              alt={product.name}
              fallbackTitle={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'hover:scale-105'
              }`}
            />
            {product.badge && (
              <span className="absolute top-4 left-4 text-xs font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded px-2.5 py-1 backdrop-blur-md">
                {product.badge}
              </span>
            )}
            <div className="absolute bottom-4 right-4 p-2 rounded-full bg-stone-950/70 border border-stone-700 text-stone-300 pointer-events-none">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>

          {/* Thumbnails (Vertical on desktop) */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`w-18 h-18 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImg === idx
                      ? 'border-amber-500 shadow-lg'
                      : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <ImageFallback
                    src={img}
                    alt={`${product.name} angle ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module (5 Cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Top metadata */}
            <div className="flex items-center justify-between gap-2 text-xs text-stone-400 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-semibold uppercase">{product.goldPurity} Gold</span>
                <span>·</span>
                <span>{product.collection}</span>
              </div>
              <span className="font-mono text-stone-500">SKU: {product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100 mb-3 leading-snug">
              {product.name}
            </h1>

            {/* Star Rating */}
            <div className="flex items-center gap-3 text-xs mb-5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-700'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-stone-200 tabular-nums">{product.rating}</span>
              <a
                href="#reviews"
                onClick={() => setActiveTab('reviews')}
                className="text-amber-400 hover:underline"
              >
                ({product.reviewsCount} verified reviews)
              </a>
            </div>

            {/* Price Box with Detailed Breakdown */}
            <div className="p-4 bg-stone-900/80 rounded-xl border border-stone-800 mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-amber-300 tabular-nums">
                  {formatPrice(finalUnitPrice)}
                </span>
                {product.discountPercent > 0 && (
                  <span className="text-sm text-stone-500 line-through tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Formula Breakdown: Gold Value + Making Charges + Stone Charges */}
              <div className="pt-3 border-t border-stone-800/80 grid grid-cols-3 gap-2 text-[11px] text-stone-400">
                <div>
                  <span className="text-stone-500 block">Gold Weight</span>
                  <span className="text-stone-200 font-semibold">{product.weight}g ({product.goldPurity})</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Making Charge</span>
                  <span className="text-stone-200 font-semibold">{formatPrice(product.makingCharge)}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Gemstone / VAT</span>
                  <span className="text-stone-200 font-semibold">
                    {product.stoneCharge > 0 ? formatPrice(product.stoneCharge) : 'Included'}
                  </span>
                </div>
              </div>
            </div>

            {/* Purity Selector */}
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase text-stone-300 mb-2 tracking-wider">
                Select Gold Purity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['24K', '22K', '21K', '18K'] as GoldPurity[]).map((purity) => (
                  <button
                    key={purity}
                    onClick={() => setSelectedPurity(purity)}
                    className={`py-2 rounded border text-xs font-semibold transition-all ${
                      selectedPurity === purity
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {purity}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector if available */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold uppercase text-stone-300 tracking-wider">
                    Ring / Bangle Size
                  </label>
                  <span className="text-[11px] text-amber-400 cursor-pointer hover:underline">
                    Sizing Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded border text-xs font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                          : 'border-stone-800 bg-stone-900 text-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chain Length if chain/necklace */}
            {(product.category.toLowerCase().includes('chain') ||
              product.category.toLowerCase().includes('necklace')) && (
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase text-stone-300 mb-1.5 tracking-wider">
                  Chain Length
                </label>
                <div className="flex gap-2">
                  {['18"', '20"', '22"', '24"'].map((len) => (
                    <button
                      key={len}
                      onClick={() => setChainLength(len)}
                      className={`px-3 py-1.5 rounded border text-xs font-semibold transition-all ${
                        chainLength === len
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                          : 'border-stone-800 bg-stone-900 text-stone-400'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Stock */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-stone-800 rounded-lg bg-stone-900">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-stone-400 hover:text-white"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 text-sm font-semibold text-stone-100 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3.5 py-2 text-stone-400 hover:text-white disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="text-xs">
                {isOutOfStock ? (
                  <span className="text-rose-400 font-semibold block">Out of Stock</span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} available in Deira Souk)
                  </span>
                )}
                <span className="text-[11px] text-stone-500">Hallmark verified by DCL</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Cluster */}
          <div className="space-y-3 pt-4 border-t border-stone-800">
            <div className="flex gap-3">
              {/* Primary Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isOutOfStock
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 active:scale-95'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Shopping Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-3 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-rose-400 transition-colors"
                aria-label="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-500 transition-colors shadow"
            >
              Buy Now with Instant Checkout
            </button>

            {/* WhatsApp Ordering & Bespoke Atelier */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-lg bg-emerald-950/70 border border-emerald-700/60 hover:bg-emerald-900/80 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Order on WhatsApp</span>
              </a>

              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="py-2.5 px-3 rounded-lg bg-stone-900 border border-amber-600/40 hover:border-amber-500 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Bespoke Atelier</span>
              </button>
            </div>

            {/* Delivery Estimator Form (Requirement #61) */}
            <div className="pt-4 border-t border-stone-800/80">
              <form onSubmit={handleCheckDelivery} className="flex gap-2">
                <input
                  type="text"
                  value={postalInput}
                  onChange={(e) => setPostalInput(e.target.value)}
                  placeholder="Enter UAE City or Postal Code"
                  className="flex-1 px-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200"
                >
                  Estimate Delivery
                </button>
              </form>
              {deliveryEstimate && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  {deliveryEstimate}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Shipping, Reviews */}
      <div id="reviews" className="mb-16">
        <div className="flex border-b border-stone-800 gap-6 text-sm font-semibold mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Description &amp; Story
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Atelier Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Security &amp; Insured Shipping
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Patron Reviews ({productReviews.length})
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'desc' && (
          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-stone-300 leading-relaxed space-y-4">
            <p>{product.description}</p>
            <p>
              Handcrafted in our historic atelier overlooking the Dubai Creek. Each filigree wire is hand-twisted, soldered, and finished by master goldsmiths holding multigenerational lineage in Middle Eastern gold artistry.
            </p>
          </div>
        )}

        {/* Tab 2: Specifications Table */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-stone-900 border border-stone-800 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Metal &amp; Alloy</span>
                <span className="text-stone-100 font-semibold">{product.goldPurity} Solid Yellow Gold</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Gross Weight</span>
                <span className="text-stone-100 font-semibold tabular-nums">{product.weight} grams</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Making Charges</span>
                <span className="text-stone-100 font-semibold tabular-nums">{formatPrice(product.makingCharge)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Gemstone Charges</span>
                <span className="text-stone-100 font-semibold tabular-nums">
                  {product.stoneCharge > 0 ? formatPrice(product.stoneCharge) : 'N/A (All-Gold)'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-stone-900 border border-stone-800 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Hallmark Authority</span>
                <span className="text-emerald-400 font-semibold">Dubai Central Laboratories (DCL)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Certificate Dossier</span>
                <span className="text-stone-100 font-mono">{product.certificateNumber || 'DCL-DXB-CERTIFIED'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Dimensions</span>
                <span className="text-stone-100">{product.dimensions || 'Standard Dubai Sizing'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-stone-400">Origin Atelier</span>
                <span className="text-stone-100 font-semibold">Deira Gold Souk, Dubai</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Shipping */}
        {activeTab === 'shipping' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-300">
            <div className="p-4 rounded-lg bg-stone-900 border border-stone-800">
              <ShieldCheck className="w-5 h-5 text-amber-400 mb-2" />
              <h4 className="font-semibold text-stone-100 text-sm mb-1">Armored Transit</h4>
              <p className="text-stone-400 leading-relaxed">
                All consignments over AED 2,000 travel via specialized security transport with tamper-evident serial-coded packaging.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-stone-900 border border-stone-800">
              <Truck className="w-5 h-5 text-amber-400 mb-2" />
              <h4 className="font-semibold text-stone-100 text-sm mb-1">Complimentary Courier</h4>
              <p className="text-stone-400 leading-relaxed">
                Complimentary UAE next-day delivery on orders exceeding AED 2,000. Flat rate of AED 75 for standard delivery.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-stone-900 border border-stone-800">
              <RotateCcw className="w-5 h-5 text-amber-400 mb-2" />
              <h4 className="font-semibold text-stone-100 text-sm mb-1">Lifetime Buyback</h4>
              <p className="text-stone-400 leading-relaxed">
                Guaranteed market buyback on gold weight at official Souk rates, plus free lifetime cleaning and inspection.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews & Write Review */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Reviews List */}
            {productReviews.length > 0 ? (
              <div className="space-y-4">
                {productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-lg bg-stone-900 border border-stone-800 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-100 text-sm">{rev.customerName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                            Verified Patron
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500">{rev.date}</span>
                    </div>

                    <div className="flex items-center text-amber-400 mb-3">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed">{rev.reviewText}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-stone-900/50 rounded-lg border border-stone-800 text-stone-400 text-xs">
                No customer reviews yet. Be the first patron to share your experience.
              </div>
            )}

            {/* Write Review Form */}
            <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
              <h3 className="text-base font-serif-luxury font-bold text-stone-100 mb-1">
                Write a Patron Review
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                Share your impressions of craftsmanship, weight, and presentation.
              </p>

              {reviewSubmitted ? (
                <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> Thank you. Your review has been added to our records.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder="e.g. Fatima Al-Hashimi"
                        className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        placeholder="e.g. fatima@example.com"
                        className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Your Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-amber-400"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'fill-amber-400' : 'text-stone-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-stone-400 ml-2">{reviewRating} of 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Review Impressions</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Describe the craftsmanship, luster, packaging, and wearability..."
                      className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider shadow"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-stone-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                Curated Recommendations
              </span>
              <h2 className="text-2xl font-serif-luxury font-bold text-stone-100 mt-1">
                You May Also Admire
              </h2>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold uppercase tracking-wider"
            >
              View More in {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Jewellery Customizer Modal */}
      <JewelleryCustomizer
        product={product}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </div>
  );
};
