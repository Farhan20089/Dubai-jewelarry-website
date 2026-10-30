import React, { useState } from 'react';
import { Settings, Save, RotateCcw, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { StoreSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useStoreData();
  const { showToast } = useToast();

  const [formSettings, setFormSettings] = useState<StoreSettings>({ ...settings });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormSettings((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    showToast('Storefront configurations saved successfully.', 'success');
  };

  const handlePerformReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
    showToast('Showroom demo database reset to factory seed values.', 'info');
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-stone-800">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Global Configurations
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
          Showroom &amp; Commerce Settings
        </h1>
        <p className="text-xs text-stone-400 mt-0.5">
          Configure branding, official WhatsApp order dispatch line, tax rates, and delivery thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Store & Contact Information */}
        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-serif-luxury font-bold text-stone-100 uppercase tracking-wider pb-2 border-b border-stone-800">
            Showroom Identity &amp; Contact Line
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase">Showroom Brand Name</label>
              <input
                type="text"
                name="storeName"
                value={formSettings.storeName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase">Official WhatsApp Order Line</label>
              <input
                type="text"
                name="whatsappNumber"
                value={formSettings.whatsappNumber}
                onChange={handleChange}
                placeholder="+971501234567"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 font-mono focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                Target phone number for all &ldquo;Order on WhatsApp&rdquo; buttons.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase">Customer Concierge Email</label>
              <input
                type="email"
                name="storeEmail"
                value={formSettings.storeEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase">Direct Telephone Line</label>
              <input
                type="text"
                name="storePhone"
                value={formSettings.storePhone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-400 mb-1 font-semibold uppercase">Flagship Showroom Address</label>
            <textarea
              rows={2}
              name="storeAddress"
              value={formSettings.storeAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-stone-400 mb-1 font-semibold uppercase">Operating Hours</label>
            <input
              type="text"
              name="openingHours"
              value={formSettings.openingHours}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Section 2: Commerce, VAT & Delivery Fees */}
        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-serif-luxury font-bold text-stone-100 uppercase tracking-wider pb-2 border-b border-stone-800">
            Fiscal &amp; Delivery Policies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase">UAE VAT (%)</label>
              <input
                type="number"
                step="0.5"
                name="taxPercent"
                value={formSettings.taxPercent}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase">Courier Fee (AED)</label>
              <input
                type="number"
                name="shippingCharge"
                value={formSettings.shippingCharge}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase">Free Shipping Min (AED)</label>
              <input
                type="number"
                step="500"
                name="freeShippingThreshold"
                value={formSettings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold uppercase">Gift Box Fee (AED)</label>
              <input
                type="number"
                name="giftPackagingFee"
                value={formSettings.giftPackagingFee}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-400 mb-1 font-semibold uppercase">Top Header Announcement Ribbon</label>
            <input
              type="text"
              name="announcementText"
              value={formSettings.announcementText}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Configurations</span>
          </button>
        </div>
      </form>

      {/* Dangerous Operations / Reset Demo Data */}
      <div className="p-6 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
          <AlertTriangle className="w-4 h-4" />
          <span>Demo Data Management</span>
        </div>
        <p className="text-xs text-stone-400 leading-relaxed">
          Restore the application back to pristine showroom demo seed data (30+ jewellery products, standard gold Souk fixings, verified patron reviews, and active coupons).
        </p>

        <div>
          {showResetConfirm ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-rose-300 font-semibold">Confirm database reset?</span>
              <button
                onClick={handlePerformReset}
                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase"
              >
                Yes, Reset All Data
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded bg-stone-800 text-stone-300 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded bg-stone-900 border border-rose-800 text-rose-300 hover:bg-rose-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Database to Seed Defaults</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
