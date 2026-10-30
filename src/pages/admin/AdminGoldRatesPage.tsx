import React, { useState } from 'react';
import { TrendingUp, Save, Clock, History, AlertCircle } from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { GoldPurity } from '../../types';

export const AdminGoldRatesPage: React.FC = () => {
  const { goldRates, goldRateHistory, updateGoldRates } = useStoreData();
  const { showToast } = useToast();

  const [rate24K, setRate24K] = useState(goldRates['24K'].ratePerGram);
  const [rate22K, setRate22K] = useState(goldRates['22K'].ratePerGram);
  const [rate21K, setRate21K] = useState(goldRates['21K'].ratePerGram);
  const [rate18K, setRate18K] = useState(goldRates['18K'].ratePerGram);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();

    const computeMetrics = (perGram: number, purity: GoldPurity, prevRate: number) => ({
      purity,
      ratePerGram: perGram,
      ratePer10Gram: Number((perGram * 10).toFixed(2)),
      ratePerTola: Number((perGram * 11.6638).toFixed(2)),
      lastUpdated: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} GST`,
      changePercent: Number((((perGram - prevRate) / prevRate) * 100).toFixed(2)),
    });

    updateGoldRates({
      '24K': computeMetrics(rate24K, '24K', goldRates['24K'].ratePerGram),
      '22K': computeMetrics(rate22K, '22K', goldRates['22K'].ratePerGram),
      '21K': computeMetrics(rate21K, '21K', goldRates['21K'].ratePerGram),
      '18K': computeMetrics(rate18K, '18K', goldRates['18K'].ratePerGram),
      effectiveDate: new Date().toISOString().split('T')[0],
    });

    showToast('Daily Gold Souk fixing successfully broadcast across store.', 'success');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Souk Market Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
            Gold Rate Fixing Management
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Adjust official daily bullion fixings. Dynamic calculations cascade immediately to product cards and the gold calculator.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Last fixing: {goldRates.lastUpdatedTime}</span>
        </div>
      </div>

      {/* Rate Editing Cards */}
      <form onSubmit={handleSaveRates} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 24K */}
          <div className="p-5 rounded-xl bg-stone-900 border border-amber-600/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg text-amber-400">24K Bullion</span>
              <span className="text-[10px] text-stone-400 font-semibold">99.9% Pure</span>
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Rate / Gram (AED)</label>
              <input
                type="number"
                step="0.1"
                required
                value={rate24K}
                onChange={(e) => setRate24K(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-bold text-stone-100 bg-stone-950 border border-stone-800 rounded font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="text-[11px] text-stone-500 space-y-0.5 pt-2 border-t border-stone-800">
              <div>10 Grams: AED {(rate24K * 10).toFixed(2)}</div>
              <div>Per Tola: AED {(rate24K * 11.6638).toFixed(2)}</div>
            </div>
          </div>

          {/* 22K */}
          <div className="p-5 rounded-xl bg-stone-900 border border-amber-600/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg text-amber-400">22K Souk</span>
              <span className="text-[10px] text-stone-400 font-semibold">91.6% Fine</span>
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Rate / Gram (AED)</label>
              <input
                type="number"
                step="0.1"
                required
                value={rate22K}
                onChange={(e) => setRate22K(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-bold text-stone-100 bg-stone-950 border border-stone-800 rounded font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="text-[11px] text-stone-500 space-y-0.5 pt-2 border-t border-stone-800">
              <div>10 Grams: AED {(rate22K * 10).toFixed(2)}</div>
              <div>Per Tola: AED {(rate22K * 11.6638).toFixed(2)}</div>
            </div>
          </div>

          {/* 21K */}
          <div className="p-5 rounded-xl bg-stone-900 border border-stone-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg text-amber-400">21K Gulf</span>
              <span className="text-[10px] text-stone-400 font-semibold">87.5% Gulf</span>
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Rate / Gram (AED)</label>
              <input
                type="number"
                step="0.1"
                required
                value={rate21K}
                onChange={(e) => setRate21K(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-bold text-stone-100 bg-stone-950 border border-stone-800 rounded font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="text-[11px] text-stone-500 space-y-0.5 pt-2 border-t border-stone-800">
              <div>10 Grams: AED {(rate21K * 10).toFixed(2)}</div>
              <div>Per Tola: AED {(rate21K * 11.6638).toFixed(2)}</div>
            </div>
          </div>

          {/* 18K */}
          <div className="p-5 rounded-xl bg-stone-900 border border-stone-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg text-amber-400">18K High Gold</span>
              <span className="text-[10px] text-stone-400 font-semibold">75.0% Fine</span>
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Rate / Gram (AED)</label>
              <input
                type="number"
                step="0.1"
                required
                value={rate18K}
                onChange={(e) => setRate18K(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-bold text-stone-100 bg-stone-950 border border-stone-800 rounded font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="text-[11px] text-stone-500 space-y-0.5 pt-2 border-t border-stone-800">
              <div>10 Grams: AED {(rate18K * 10).toFixed(2)}</div>
              <div>Per Tola: AED {(rate18K * 11.6638).toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Broadcast Updated Rates to Store</span>
          </button>
        </div>
      </form>

      {/* Historical Log Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
          <History className="w-4 h-4 text-amber-500" />
          <h2 className="text-base font-serif-luxury font-bold text-stone-100">
            Historical Fixing Audit Log
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">24K / Gram</th>
                <th className="pb-3 font-semibold">22K / Gram</th>
                <th className="pb-3 font-semibold">21K / Gram</th>
                <th className="pb-3 font-semibold">18K / Gram</th>
                <th className="pb-3 font-semibold">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono">
              {goldRateHistory.slice().reverse().map((h) => (
                <tr key={h.id} className="hover:bg-stone-800/30 transition-colors">
                  <td className="py-2.5 text-stone-200">{h.date}</td>
                  <td className="py-2.5 font-bold text-amber-300">AED {h.rate24K.toFixed(2)}</td>
                  <td className="py-2.5 text-stone-200">AED {h.rate22K.toFixed(2)}</td>
                  <td className="py-2.5 text-stone-200">AED {h.rate21K.toFixed(2)}</td>
                  <td className="py-2.5 text-stone-200">AED {h.rate18K.toFixed(2)}</td>
                  <td className="py-2.5 text-stone-500 font-sans">{h.note || 'Official fixing'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
