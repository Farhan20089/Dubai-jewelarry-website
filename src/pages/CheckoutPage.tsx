import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  Banknote,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreData } from '../context/StoreDataContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Order, PaymentMethod, CustomerOrderInfo } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    discountAmount,
    appliedCoupon,
    shippingCharge,
    giftPackagingCharge,
    taxAmount,
    grandTotal,
    clearCart,
  } = useCart();

  const { createOrder, settings } = useStoreData();
  const { formatPrice } = useCurrency();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [formData, setFormData] = useState<CustomerOrderInfo>({
    fullName: currentUser?.name || 'Fatima Al-Hashimi',
    email: currentUser?.email || 'fatima.h@gmail.com',
    phone: currentUser?.phone || '+971 50 882 1940',
    address: currentUser?.defaultAddress?.street || 'Villa 44, Al Khaleej Street',
    city: currentUser?.defaultAddress?.city || 'Dubai',
    postalCode: currentUser?.defaultAddress?.postalCode || '00000',
    country: currentUser?.defaultAddress?.country || 'United Arab Emirates',
    orderNotes: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'courier' | 'pickup'>('courier');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-stone-950">
        <h2 className="text-2xl font-serif-luxury font-bold text-stone-100 mb-2">
          Your shopping bag is empty.
        </h2>
        <p className="text-xs text-stone-400 mb-6">
          Add jewellery pieces before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider"
        >
          Return to Showroom
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
        showToast('Please complete all mandatory customer details.', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `DGJ-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customer: formData,
      userId: currentUser?.id,
      items: cartItems,
      itemsCount: cartItems.reduce((acc, i) => acc + i.quantity, 0),
      subtotal,
      discountAmount,
      couponCode: appliedCoupon?.code,
      shippingCharge: shippingMethod === 'pickup' ? 0 : shippingCharge,
      giftPackagingCharge,
      taxAmount,
      grandTotal: shippingMethod === 'pickup' ? grandTotal - shippingCharge : grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'demo_card' ? 'Demo Paid' : 'Pending',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      trackingNumber: `DXB-SEC-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    // Save order, decrease stock, clear cart
    setTimeout(() => {
      createOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      showToast(`Order ${orderNumber} placed successfully!`, 'success');
      navigate(`/order-success/${orderId}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header & Steps Indicator */}
      <div className="mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-1">
          Secure Insured Checkout
        </span>
        <h1 className="text-3xl font-serif-luxury font-bold text-stone-100 mb-6">
          Finalize Your Acquisition
        </h1>

        {/* Multi-step Breadcrumb */}
        <div className="flex items-center justify-center max-w-xl mx-auto">
          {[
            { num: 1, label: 'Customer Info' },
            { num: 2, label: 'Delivery' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Review' },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s.num
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span
                  className={`text-xs hidden sm:inline ${
                    step >= s.num ? 'text-stone-200 font-semibold' : 'text-stone-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div
                  className={`flex-1 h-[2px] mx-3 transition-colors ${
                    step > idx + 1 ? 'bg-amber-500' : 'bg-stone-800'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl">
          {/* STEP 1: Customer Details */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h2 className="text-base font-serif-luxury font-bold text-stone-100 pb-3 border-b border-stone-800">
                1. Customer &amp; Delivery Information
              </h2>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Fatima Al-Hashimi"
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. fatima@example.com"
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                    Mobile Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+971 50 123 4567"
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                  Street Address &amp; Villa/Apartment Number *
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. Villa 44, Al Khaleej Street, Palm Jumeirah"
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                    Emirate / City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Dubai"
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="00000"
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                  Delivery Notes / Gate Code (Optional)
                </label>
                <textarea
                  rows={2}
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  placeholder="Special instructions for armored courier reception..."
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  Continue to Delivery <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-base font-serif-luxury font-bold text-stone-100 pb-3 border-b border-stone-800">
                2. Shipping &amp; Handover Method
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod('courier')}
                  className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${
                    shippingMethod === 'courier'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-stone-800 bg-stone-950'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'courier'}
                    onChange={() => setShippingMethod('courier')}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-100 text-sm flex items-center gap-2">
                        <Truck className="w-4 h-4 text-amber-400" />
                        Armored Courier Delivery across UAE
                      </span>
                      <span className="text-xs font-bold text-amber-400 tabular-nums">
                        {shippingCharge === 0 ? 'Complimentary' : formatPrice(shippingCharge)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      White-glove armored transit with GPS monitoring, tamper seals, and verified ID check upon handover.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setShippingMethod('pickup')}
                  className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${
                    shippingMethod === 'pickup'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-stone-800 bg-stone-950'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'pickup'}
                    onChange={() => setShippingMethod('pickup')}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-100 text-sm flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        VIP Private Lounge Showroom Collection
                      </span>
                      <span className="text-xs font-bold text-emerald-400 uppercase">Free</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      Collect in person at our Deira Gold Souk VIP suite. Complimentary Arabic coffee and jewelry fitting.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded text-stone-400 hover:text-white text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-base font-serif-luxury font-bold text-stone-100 pb-3 border-b border-stone-800">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-stone-800 bg-stone-950'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-semibold text-stone-100 text-sm flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-amber-400" />
                      Cash on Delivery (COD) / Card on Handover
                    </span>
                    <p className="text-xs text-stone-400 mt-1">
                      Pay our security courier upon inspection and physical verification of gold hallmark and seals.
                    </p>
                  </div>
                </label>

                {/* Bank Wire */}
                <label
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-stone-800 bg-stone-950'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-semibold text-stone-100 text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      Direct Bank Wire Transfer (Dubai Islamic Bank)
                    </span>
                    <p className="text-xs text-stone-400 mt-1">
                      IBAN: AE28 0240 0012 3456 7890 001 · Dubai Gold &amp; Jewellers LLC. Dispatch upon clearance.
                    </p>
                  </div>
                </label>

                {/* Demo Card Payment */}
                <label
                  onClick={() => setPaymentMethod('demo_card')}
                  className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${
                    paymentMethod === 'demo_card'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-stone-800 bg-stone-950'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'demo_card'}
                    onChange={() => setPaymentMethod('demo_card')}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-100 text-sm flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        Online Card Payment
                      </span>
                      <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                        Demo Sandbox
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      Instant simulated authorization. No real transaction occurs in this demo environment.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded text-stone-400 hover:text-white text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  Review Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Place Order */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-base font-serif-luxury font-bold text-stone-100 pb-3 border-b border-stone-800">
                4. Final Order Verification
              </h2>

              <div className="space-y-4 text-xs">
                {/* Customer summary */}
                <div className="p-3.5 rounded-lg bg-stone-950 border border-stone-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-stone-400 font-semibold uppercase">Recipient</span>
                    <button onClick={() => setStep(1)} className="text-amber-400 hover:underline">Edit</button>
                  </div>
                  <div className="font-bold text-stone-200">{formData.fullName} ({formData.phone})</div>
                  <div className="text-stone-400">{formData.address}, {formData.city}, {formData.country}</div>
                  <div className="text-stone-400">{formData.email}</div>
                </div>

                {/* Handover & Payment summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 uppercase block mb-1">Handover</span>
                    <span className="font-semibold text-stone-200">
                      {shippingMethod === 'courier' ? 'Insured Armored Courier' : 'Showroom VIP Pickup'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 uppercase block mb-1">Payment Method</span>
                    <span className="font-semibold text-stone-200">
                      {paymentMethod === 'cod' ? 'Cash / Card on Delivery' : paymentMethod === 'bank_transfer' ? 'Bank Wire Transfer' : 'Online Demo Card'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-stone-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Official Hallmarking Guarantee
                </div>
                <p className="text-[11px] text-stone-400">
                  Your pieces will arrive sealed in official Dubai Gold &amp; Jewellers presentation cases accompanied by unique Dubai Central Laboratories certification numbers.
                </p>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded text-stone-400 hover:text-white text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {isSubmitting ? 'Securing Acquisition...' : 'Place Official Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl space-y-4 self-start">
          <h3 className="text-base font-serif-luxury font-bold text-stone-100 pb-3 border-b border-stone-800">
            Selected Creations ({cartItems.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-stone-950 overflow-hidden shrink-0 border border-stone-800">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-200 block truncate max-w-[160px]">
                      {item.product.name}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {item.selectedPurity} · {item.quantity}x
                    </span>
                  </div>
                </div>
                <span className="font-bold text-amber-300 tabular-nums">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-800 space-y-2 text-xs">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal</span>
              <span className="tabular-nums font-semibold text-stone-200">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Coupon ({appliedCoupon?.code})</span>
                <span className="tabular-nums font-semibold">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            {giftPackagingCharge > 0 && (
              <div className="flex justify-between text-stone-400">
                <span>Gift Box Presentation</span>
                <span className="tabular-nums font-semibold text-stone-200">{formatPrice(giftPackagingCharge)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-400">
              <span>Shipping &amp; Transit</span>
              <span className="tabular-nums font-semibold text-stone-200">
                {shippingMethod === 'pickup' || shippingCharge === 0 ? 'Free' : formatPrice(shippingCharge)}
              </span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>UAE VAT ({settings.taxPercent}%)</span>
              <span className="tabular-nums text-stone-200">{formatPrice(taxAmount)}</span>
            </div>
            <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-stone-100">Total Acquisition</span>
              <span className="text-xl font-bold text-amber-300 tabular-nums">
                {formatPrice(shippingMethod === 'pickup' ? grandTotal - shippingCharge : grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
