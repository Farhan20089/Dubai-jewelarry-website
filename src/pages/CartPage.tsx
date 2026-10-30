import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Gift,
  ShieldCheck,
  Tag,
  MessageCircle,
  Truck,
  Check,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useStoreData } from '../context/StoreDataContext';
import { ImageFallback } from '../components/common/ImageFallback';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isGiftPackaging,
    setIsGiftPackaging,
    subtotal,
    discountAmount,
    shippingCharge,
    giftPackagingCharge,
    taxAmount,
    grandTotal,
    isFreeShipping,
    amountNeededForFreeShipping,
  } = useCart();

  const { formatPrice } = useCurrency();
  const { settings, coupons } = useStoreData();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCodeInput('');
    }
  };

  // Pre-filled WhatsApp order for entire cart
  const cartSummaryItems = cartItems
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}* (${item.selectedPurity}, ${item.quantity}x) - AED ${item.totalPrice.toLocaleString()}`
    )
    .join('\n');

  const whatsappCheckoutMessage = `Hello Dubai Gold & Jewellers, I would like to order my shopping bag:
${cartSummaryItems}

Subtotal: AED ${subtotal.toLocaleString()}
${discountAmount > 0 ? `Discount: -AED ${discountAmount.toLocaleString()}` : ''}
${isGiftPackaging ? `Gift Box: AED ${settings.giftPackagingFee}` : ''}
*Total Amount: AED ${grandTotal.toLocaleString()}*

Please connect with me to finalize payment and courier dispatch.`;

  const whatsappHref = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    whatsappCheckoutMessage
  )}`;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-stone-950">
        <div className="w-20 h-20 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mb-6 text-amber-500/80">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif-luxury font-bold text-stone-100 mb-2">
          Your Jewellery Box is Waiting.
        </h1>
        <p className="text-xs text-stone-400 max-w-sm mx-auto mb-8 leading-relaxed">
          You haven&rsquo;t added any gold or diamond pieces yet. Explore our royal Deira Souk collections to discover your signature adornment.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 rounded font-semibold text-xs tracking-widest uppercase bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-xl transition-all"
        >
          Explore Showroom
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Title & Breadcrumb */}
      <div className="mb-8 pb-4 border-b border-stone-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-amber-400">Shopping Bag</span>
          </div>
          <h1 className="text-3xl font-serif-luxury font-bold text-stone-100">
            Shopping Bag ({cartItems.length} {cartItems.length === 1 ? 'Design' : 'Designs'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-rose-400 flex items-center gap-1 self-start sm:self-auto transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Bag
        </button>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="mb-8 p-4 rounded-xl bg-stone-900 border border-stone-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="flex items-center gap-1.5 text-stone-200 font-semibold">
            <Truck className="w-4 h-4 text-amber-400" />
            {isFreeShipping ? (
              <span className="text-emerald-400">You qualify for Complimentary Armed Delivery!</span>
            ) : (
              <span>
                Add <strong className="text-amber-400 font-bold">{formatPrice(amountNeededForFreeShipping)}</strong> more for Complimentary Delivery
              </span>
            )}
          </span>
          <span className="text-stone-400 text-[11px]">Free delivery on orders over AED {settings.freeShippingThreshold}</span>
        </div>
        <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800">
          <div
            className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500 rounded-full"
            style={{
              width: `${Math.min(100, (subtotal / settings.freeShippingThreshold) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Main Cart Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Itemized Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-stone-900/60 rounded-xl border border-stone-800 divide-y divide-stone-800/80 overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-stone-950 overflow-hidden shrink-0 border border-stone-800">
                    <ImageFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 mb-1">
                      <span className="text-amber-400 font-bold">{item.selectedPurity} Gold</span>
                      <span>·</span>
                      <span>{item.product.weight}g</span>
                      <span>·</span>
                      <span className="font-mono text-stone-500">{item.product.sku}</span>
                    </div>

                    <Link
                      to={`/product/${item.product.id}`}
                      className="text-sm font-semibold text-stone-100 hover:text-amber-400 transition-colors block truncate"
                    >
                      {item.product.name}
                    </Link>

                    {/* Customization Details Badges */}
                    <div className="flex flex-wrap gap-2 mt-1.5 text-[11px]">
                      {item.selectedSize && (
                        <span className="px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.chainLength && (
                        <span className="px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800">
                          Length: {item.chainLength}
                        </span>
                      )}
                      {item.engravingText && (
                        <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50">
                          Engraved: &ldquo;{item.engravingText}&rdquo;
                        </span>
                      )}
                      {item.giftPackaging && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Gift className="w-3 h-3" /> Gift Boxed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing, Quantity Stepper, and Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-800">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-stone-700 rounded bg-stone-950">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-stone-400 hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-stone-100 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="px-2.5 py-1 text-stone-400 hover:text-white disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-base font-bold text-amber-300 tabular-nums">
                      {formatPrice(item.totalPrice)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[10px] text-stone-500 tabular-nums">
                        {formatPrice(item.unitPrice)} each
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              ← Continue Curating Jewellery
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Summary Box */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl space-y-5">
            <h2 className="text-lg font-serif-luxury font-bold text-stone-100 pb-3 border-b border-stone-800">
              Order Summary
            </h2>

            {/* Gift Packaging Checkbox */}
            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-stone-200">
                  Dubai Velvet Gift Packaging (+AED {settings.giftPackagingFee})
                </span>
              </div>
              <input
                type="checkbox"
                checked={isGiftPackaging}
                onChange={(e) => setIsGiftPackaging(e.target.checked)}
                className="w-4 h-4 rounded border-stone-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            {/* Coupon Application */}
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-400 mb-1.5">
                Promotional Coupon Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedCoupon.code}</span>
                    <span className="text-[11px] text-emerald-400">({appliedCoupon.discountPercent}% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="e.g. WELCOME10, GOLD15"
                    className="flex-1 px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 uppercase placeholder:normal-case placeholder:text-stone-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold uppercase rounded"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-stone-800 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span className="tabular-nums font-semibold">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {giftPackagingCharge > 0 && (
                <div className="flex justify-between text-stone-300">
                  <span>Gift Box Presentation</span>
                  <span className="tabular-nums font-semibold">{formatPrice(giftPackagingCharge)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-300">
                <span>Insured Armed Courier</span>
                <span className="tabular-nums font-semibold">
                  {shippingCharge === 0 ? (
                    <span className="text-emerald-400">Free</span>
                  ) : (
                    formatPrice(shippingCharge)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>UAE VAT ({settings.taxPercent}%)</span>
                <span className="tabular-nums">{formatPrice(taxAmount)}</span>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-stone-100 block">Grand Total</span>
                  <span className="text-[10px] text-stone-500">Including all taxes &amp; hallmarks</span>
                </div>
                <span className="text-2xl font-bold text-amber-300 tabular-nums">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Checkout CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-lg bg-emerald-950/80 border border-emerald-700/60 hover:bg-emerald-900 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Instant Checkout on WhatsApp</span>
              </a>
            </div>

            {/* Trust Assurance */}
            <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>100% Certified Dubai Hallmarked Gold Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Fully insured white-glove security transit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
