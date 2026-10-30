import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { Coupon } from '../../types';

export const AdminCouponsPage: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon } = useStoreData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(1500);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [isActive, setIsActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountPercent(10);
    setMinOrderAmount(2000);
    setExpiryDate('2026-12-31');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountPercent(c.discountPercent);
    setMinOrderAmount(c.minOrderAmount);
    setExpiryDate(c.expiryDate);
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    if (editingCoupon) {
      updateCoupon({
        ...editingCoupon,
        code: code.trim().toUpperCase(),
        discountPercent: Number(discountPercent),
        minOrderAmount: Number(minOrderAmount),
        expiryDate,
        isActive,
      });
      showToast(`Coupon ${code.toUpperCase()} updated.`, 'success');
    } else {
      addCoupon({
        code: code.trim().toUpperCase(),
        discountPercent: Number(discountPercent),
        minOrderAmount: Number(minOrderAmount),
        expiryDate,
        isActive,
      });
      showToast(`Coupon ${code.toUpperCase()} created.`, 'success');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Promotions &amp; Concessions
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
            Coupon Management ({coupons.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promotional Coupon</span>
        </button>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                <th className="p-4 font-semibold">Coupon Code</th>
                <th className="p-4 font-semibold">Discount %</th>
                <th className="p-4 font-semibold">Min Order Requirement</th>
                <th className="p-4 font-semibold">Expiry Date</th>
                <th className="p-4 font-semibold">Times Claimed</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-stone-800/30 transition-colors">
                  <td className="p-4 font-bold text-amber-300 text-sm">
                    {c.code}
                  </td>
                  <td className="p-4 text-emerald-400 font-bold font-sans">
                    {c.discountPercent}% OFF
                  </td>
                  <td className="p-4 text-stone-300 font-sans tabular-nums">
                    AED {c.minOrderAmount.toLocaleString()}
                  </td>
                  <td className="p-4 text-stone-400">{c.expiryDate}</td>
                  <td className="p-4 text-stone-300 font-sans tabular-nums">{c.usageCount} times</td>
                  <td className="p-4 font-sans">
                    <button
                      onClick={() => toggleCoupon(c.id)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                        c.isActive
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : 'bg-stone-950 text-stone-500 border border-stone-800'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="p-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded bg-stone-800 text-stone-300 hover:text-white"
                        title="Edit coupon"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete coupon ${c.code}?`)) {
                            deleteCoupon(c.id);
                            showToast(`Coupon ${c.code} deleted.`, 'info');
                          }
                        }}
                        className="p-1.5 rounded bg-stone-800 text-stone-400 hover:text-rose-400"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-serif-luxury font-bold text-stone-100 pb-2 border-b border-stone-800">
              {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Coupon'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. DUBAI10"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 uppercase font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase">Min Order (AED)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className="text-stone-300">Set Coupon Active Immediately</span>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-stone-800 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold uppercase tracking-wider"
                >
                  {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
