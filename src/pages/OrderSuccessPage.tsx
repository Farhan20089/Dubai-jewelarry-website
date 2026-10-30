import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Printer,
  MessageCircle,
  Truck,
  ShieldCheck,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { useCurrency } from '../context/CurrencyContext';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, settings } = useStoreData();
  const { formatPrice } = useCurrency();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-stone-950">
        <h2 className="text-2xl font-serif-luxury font-bold text-stone-100 mb-2">
          Order Not Found
        </h2>
        <p className="text-xs text-stone-400 mb-6">
          Unable to locate acquisition record. Please check your account history.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded bg-amber-600 text-stone-950 font-bold text-xs uppercase"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappConfirmMsg = `Hello Dubai Gold & Jewellers, I have placed Order *${order.orderNumber}*.
Recipient: ${order.customer.fullName}
Total: AED ${order.grandTotal.toLocaleString()}
Status: ${order.status}
Please confirm dispatch and provide armored courier handover details.`;

  const whatsappHref = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    whatsappConfirmMsg
  )}`;

  return (
    <div className="min-h-screen bg-stone-950 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Success Hero Header (hidden on print) */}
      <div className="no-print text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Acquisition Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 mt-1 mb-2">
          Thank You for Your Patronage
        </h1>
        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
          Order <strong>{order.orderNumber}</strong> has been secured and registered with our Deira Souk vault.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded bg-stone-900 border border-stone-700 hover:border-amber-500 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors shadow"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Official Invoice</span>
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded bg-emerald-950/80 border border-emerald-700/60 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold flex items-center gap-2 transition-colors shadow"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Order Notification</span>
          </a>

          <Link
            to="/shop"
            className="px-5 py-2.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            Continue Curating
          </Link>
        </div>
      </div>

      {/* Official Tax Invoice Container (Formatted for both screen & printer) */}
      <div className="print-container bg-stone-900 border border-stone-800 rounded-xl p-6 sm:p-10 shadow-2xl text-stone-200">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-stone-800 gap-4">
          <div>
            <span className="font-display text-xl font-bold tracking-widest uppercase gold-text-gradient block">
              DUBAI GOLD &amp; JEWELLERS
            </span>
            <span className="text-[10px] uppercase tracking-widest text-stone-400 block mt-0.5">
              Deira Gold Souk · Official Tax Invoice
            </span>
            <div className="text-[11px] text-stone-400 mt-2 space-y-0.5">
              <p>{settings.storeAddress}</p>
              <p>Phone: {settings.storePhone} · TRN: 100294819200003</p>
            </div>
          </div>

          <div className="sm:text-right text-xs">
            <div className="text-base font-bold text-amber-400 font-mono">
              INVOICE #{order.orderNumber}
            </div>
            <div className="text-stone-400 mt-1">
              Date: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="text-stone-400">
              Payment: <span className="font-semibold text-stone-200 capitalize">{order.paymentMethod.replace('_', ' ')}</span>
            </div>
            <div className="mt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Status: {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Handover info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-stone-800 text-xs">
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-stone-400 text-[10px] mb-1">
              Billed &amp; Delivered To
            </h4>
            <p className="font-bold text-stone-100 text-sm">{order.customer.fullName}</p>
            <p className="text-stone-300 mt-0.5">{order.customer.address}</p>
            <p className="text-stone-300">{order.customer.city}, {order.customer.country}</p>
            <p className="text-stone-400 mt-1">Mobile: {order.customer.phone} · {order.customer.email}</p>
          </div>

          <div className="sm:text-right">
            <h4 className="font-semibold uppercase tracking-wider text-stone-400 text-[10px] mb-1">
              Transit &amp; Verification
            </h4>
            <p className="text-stone-300">Tracking Code: <span className="font-mono text-amber-400 font-bold">{order.trackingNumber}</span></p>
            <p className="text-stone-300">Carrier: Insured Security Armored Express</p>
            <p className="text-stone-300">Estimated Arrival: {order.estimatedDelivery}</p>
            <p className="text-emerald-400 text-[11px] mt-1 flex items-center sm:justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> DCL Hallmarking Certificate Attached
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6 border-b border-stone-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 text-[10px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Jewellery Piece</th>
                <th className="pb-3 font-semibold text-center">Purity</th>
                <th className="pb-3 font-semibold text-center">Weight (g)</th>
                <th className="pb-3 font-semibold text-center">Qty</th>
                <th className="pb-3 font-semibold text-right">Unit Price</th>
                <th className="pb-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {order.items.map((item, idx) => (
                <tr key={idx} className="py-2.5">
                  <td className="py-3">
                    <span className="font-semibold text-stone-100 block">{item.product.name}</span>
                    <span className="text-[10px] text-stone-400">SKU: {item.product.sku}</span>
                    {item.engravingText && (
                      <span className="text-[10px] text-amber-400 block">
                        Engraved: &ldquo;{item.engravingText}&rdquo;
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-center text-amber-400 font-semibold">{item.selectedPurity}</td>
                  <td className="py-3 text-center tabular-nums text-stone-300">{item.product.weight}</td>
                  <td className="py-3 text-center tabular-nums font-semibold">{item.quantity}</td>
                  <td className="py-3 text-right tabular-nums text-stone-300">{formatPrice(item.unitPrice)}</td>
                  <td className="py-3 text-right tabular-nums font-bold text-amber-300">{formatPrice(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start gap-6 text-xs">
          <div className="max-w-xs text-[11px] text-stone-400 space-y-1">
            <p className="font-semibold text-stone-200">Official Authenticity Guarantee:</p>
            <p>
              Dubai Gold &amp; Jewellers certifies that all precious metal content complies with UAE Federal Quality and Conformity laws. Retain this invoice for guaranteed lifetime buyback and exchange.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal</span>
              <span className="tabular-nums font-semibold text-stone-200">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({order.couponCode || 'Promotional'})</span>
                <span className="tabular-nums font-semibold">-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            {order.giftPackagingCharge > 0 && (
              <div className="flex justify-between text-stone-400">
                <span>Gift Packaging</span>
                <span className="tabular-nums text-stone-200">{formatPrice(order.giftPackagingCharge)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-400">
              <span>Insured Transit</span>
              <span className="tabular-nums text-stone-200">
                {order.shippingCharge === 0 ? 'Complimentary' : formatPrice(order.shippingCharge)}
              </span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>UAE VAT (5%)</span>
              <span className="tabular-nums text-stone-200">{formatPrice(order.taxAmount)}</span>
            </div>
            <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline text-sm">
              <span className="font-bold text-stone-100">Total Amount</span>
              <span className="text-xl font-bold text-amber-400 tabular-nums font-mono">
                {formatPrice(order.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Footer Seal */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-stone-500 gap-2">
          <span>Official Document Generated by Dubai Gold &amp; Jewellers ERP</span>
          <span>Certified Gold Souk Merchant · License #DXB-559281-GLD</span>
        </div>
      </div>
    </div>
  );
};
