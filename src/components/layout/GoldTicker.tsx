import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Info } from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useCurrency } from '../../context/CurrencyContext';

export const GoldTicker: React.FC = () => {
  const { goldRates } = useStoreData();
  const { formatPrice } = useCurrency();

  const purities: Array<'24K' | '22K' | '21K' | '18K'> = ['24K', '22K', '21K', '18K'];

  return (
    <div className="bg-stone-950 border-b border-amber-900/30 text-stone-300 text-xs py-1.5 px-4 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Live Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-stone-200 tracking-wider text-[11px] uppercase">
              Dubai Gold Souk Fixing
            </span>
          </div>
          <span className="hidden sm:inline text-stone-600 text-[10px]">|</span>
          <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-stone-400">
            <Clock className="w-3 h-3 text-amber-500/80" /> {goldRates.lastUpdatedTime}
          </span>
        </div>

        {/* Middle: Horizontal Ticker items */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-[11px]">
          {purities.map((p) => {
            const item = goldRates[p];
            return (
              <div key={p} className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">{p}:</span>
                <span className="text-stone-100 font-semibold tabular-nums">
                  {formatPrice(item.ratePerGram)}/g
                </span>
                <span className="hidden md:inline text-stone-400 tabular-nums">
                  ({formatPrice(item.ratePerTola)}/tola)
                </span>
                <span className="text-emerald-400 font-medium text-[10px] flex items-center">
                  <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />
                  +{item.changePercent}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Quick link to Gold Calculator / Rates */}
        <div className="hidden sm:flex items-center gap-3 shrink-0 text-[11px]">
          <Link
            to="/gold-rates"
            className="text-stone-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
          >
            <span>Live Chart</span>
          </Link>
          <Link
            to="/gold-calculator"
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            Calculator →
          </Link>
        </div>
      </div>
    </div>
  );
};
