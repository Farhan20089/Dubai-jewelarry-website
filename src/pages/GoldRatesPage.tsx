import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  Calendar,
  Calculator,
  Info,
  Scale,
  Sparkles,
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { useCurrency } from '../context/CurrencyContext';

export const GoldRatesPage: React.FC = () => {
  const { goldRates, goldRateHistory } = useStoreData();
  const { formatPrice } = useCurrency();
  const [selectedPurityForChart, setSelectedPurityForChart] = useState<'24K' | '22K' | '21K' | '18K'>('24K');

  const purities: Array<'24K' | '22K' | '21K' | '18K'> = ['24K', '22K', '21K', '18K'];

  // Historical data points for selected purity
  const historyData = goldRateHistory.map((h) => ({
    date: h.date,
    rate:
      selectedPurityForChart === '24K'
        ? h.rate24K
        : selectedPurityForChart === '22K'
        ? h.rate22K
        : selectedPurityForChart === '21K'
        ? h.rate21K
        : h.rate18K,
  }));

  // Min and Max for SVG scaling
  const rates = historyData.map((d) => d.rate);
  const minRate = Math.floor(Math.min(...rates) * 0.98);
  const maxRate = Math.ceil(Math.max(...rates) * 1.02);
  const range = maxRate - minRate || 1;

  // Chart coordinates
  const svgWidth = 800;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingY = 30;

  const points = historyData.map((d, index) => {
    const x = paddingX + (index / (historyData.length - 1 || 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((d.rate - minRate) / range) * (svgHeight - paddingY * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${points[0]} L ${points.join(' L ')} L ${svgWidth - paddingX},${svgHeight - paddingY} L ${paddingX},${svgHeight - paddingY} Z`;

  return (
    <div className="min-h-screen bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Clock className="w-3.5 h-3.5" /> Official Deira Souk Daily Fixing
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-stone-100 mb-3">
          Daily Dubai Gold Rates
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-2xl mx-auto">
          Authoritative bullion prices for 24 Karat pure investment bars, 22 Karat Souk jewellery, 21 Karat Arabian ornaments, and 18 Karat fine gold.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded bg-stone-900 border border-stone-800 text-[11px] text-stone-400">
          <Info className="w-3.5 h-3.5 text-amber-500" />
          <span>Market Rate — Updated Manually (Last fixed: {goldRates.lastUpdatedTime})</span>
        </div>
      </div>

      {/* 4 Purity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {purities.map((purity) => {
          const item = goldRates[purity];
          return (
            <div
              key={purity}
              className={`p-6 rounded-xl border transition-all ${
                selectedPurityForChart === purity
                  ? 'bg-stone-900 border-amber-500/80 shadow-xl shadow-amber-950/20'
                  : 'bg-stone-900/50 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-bold text-2xl text-amber-400">
                  {purity} Gold
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" />
                  +{item.changePercent}%
                </span>
              </div>

              {/* Rate per Gram */}
              <div className="mb-4">
                <span className="text-[11px] text-stone-400 block uppercase tracking-wider">
                  Rate Per Gram
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-stone-100 tabular-nums">
                  {formatPrice(item.ratePerGram)}
                </div>
              </div>

              {/* Metrics Table */}
              <div className="space-y-2 pt-3 border-t border-stone-800/80 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Per 10 Grams</span>
                  <span className="font-semibold text-stone-200 tabular-nums">
                    {formatPrice(item.ratePer10Gram)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Per Tola (11.66g)</span>
                  <span className="font-semibold text-amber-300 tabular-nums">
                    {formatPrice(item.ratePerTola)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400 text-[11px]">
                  <span>Purity Assay</span>
                  <span className="text-stone-300">
                    {purity === '24K' ? '99.9% Pure' : purity === '22K' ? '91.6% Fine' : purity === '21K' ? '87.5% Gulf' : '75.0% Fine'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPurityForChart(purity)}
                className={`mt-4 w-full py-1.5 rounded text-[11px] font-semibold transition-colors ${
                  selectedPurityForChart === purity
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {selectedPurityForChart === purity ? 'Viewing Trend Below' : 'View Price Trend'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Trend Chart */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 sm:p-8 mb-12 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-stone-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Historical Rate Trend — {selectedPurityForChart} Gold (AED / Gram)
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              7-day market fixing progression recorded in Deira Gold Souk ledger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 mr-1">Select Alloy:</span>
            {purities.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPurityForChart(p)}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  selectedPurityForChart === p
                    ? 'bg-amber-600 text-stone-950'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative w-full overflow-x-auto py-6">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-64 overflow-visible"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const yVal = paddingY + pct * (svgHeight - paddingY * 2);
              const rateVal = Math.round(maxRate - pct * range);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={yVal}
                    x2={svgWidth - paddingX}
                    y2={yVal}
                    stroke="#292524"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 8}
                    y={yVal + 4}
                    fill="#78716C"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    AED {rateVal}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area Fill */}
            <path d={areaD} fill="url(#goldGradient)" />

            {/* Main Trend Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Point Dots & Labels */}
            {historyData.map((d, index) => {
              const x = paddingX + (index / (historyData.length - 1 || 1)) * (svgWidth - paddingX * 2);
              const y = svgHeight - paddingY - ((d.rate - minRate) / range) * (svgHeight - paddingY * 2);
              return (
                <g key={index}>
                  <circle cx={x} cy={y} r="4" fill="#F59E0B" stroke="#1C1917" strokeWidth="2" />
                  <text
                    x={x}
                    y={y - 10}
                    fill="#FDE68A"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {d.rate.toFixed(1)}
                  </text>
                  <text
                    x={x}
                    y={svgHeight - 8}
                    fill="#A8A29E"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {d.date.substring(5)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* CTA Box to Gold Calculator */}
      <div className="p-8 rounded-xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
            Instant Estimation Tool
          </span>
          <h3 className="text-2xl font-serif-luxury font-bold text-stone-100">
            Calculate Jewellery Value with Live Rates
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-lg">
            Calculate the exact gold weight, making charges, and taxes for any custom ring, necklace, or investment bullion.
          </p>
        </div>

        <Link
          to="/gold-calculator"
          className="px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-stone-950 flex items-center gap-2 shadow-lg transition-all shrink-0"
        >
          <Calculator className="w-4 h-4" />
          <span>Launch Gold Price Calculator</span>
        </Link>
      </div>
    </div>
  );
};
