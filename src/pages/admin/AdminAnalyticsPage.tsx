import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  DollarSign,
  Gem,
  Award,
  Scale,
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useCurrency } from '../../context/CurrencyContext';

export const AdminAnalyticsPage: React.FC = () => {
  const { products, orders, categories, goldRates } = useStoreData();
  const { formatPrice } = useCurrency();

  const totalSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;

  // Category sales & inventory distribution
  const categoryStats: Record<string, { count: number; value: number }> = {};
  products.forEach((p) => {
    if (!categoryStats[p.category]) {
      categoryStats[p.category] = { count: 0, value: 0 };
    }
    categoryStats[p.category].count += 1;
    categoryStats[p.category].value += p.price * p.stock;
  });

  // Purity distribution
  const purityCounts: Record<string, number> = { '24K': 0, '22K': 0, '21K': 0, '18K': 0 };
  products.forEach((p) => {
    if (purityCounts[p.goldPurity] !== undefined) {
      purityCounts[p.goldPurity] += 1;
    }
  });

  // Top selling products by order frequency
  const productSalesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.product.name,
          quantity: 0,
          revenue: 0,
        };
      }
      productSalesMap[item.productId].quantity += item.quantity;
      productSalesMap[item.productId].revenue += item.totalPrice;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-stone-800">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Commercial Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
          Executive Analytics &amp; Revenue Reports
        </h1>
        <p className="text-xs text-stone-400 mt-0.5">
          Real-time metrics computed directly from persistent LocalStorage transactions.
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
          <span className="text-xs text-stone-400 uppercase tracking-wider block">Cumulative Gross Sales</span>
          <div className="text-3xl font-bold text-amber-300 tabular-nums mt-1 font-mono">
            {formatPrice(totalSales)}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">From {orders.length} total orders</span>
        </div>

        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
          <span className="text-xs text-stone-400 uppercase tracking-wider block">Average Acquisition Value</span>
          <div className="text-3xl font-bold text-stone-100 tabular-nums mt-1 font-mono">
            {formatPrice(averageOrderValue)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">AOV per client invoice</span>
        </div>

        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
          <span className="text-xs text-stone-400 uppercase tracking-wider block">Total Vault Valuation</span>
          <div className="text-3xl font-bold text-stone-100 tabular-nums mt-1 font-mono">
            {formatPrice(
              products.reduce((acc, p) => acc + p.price * p.stock, 0)
            )}
          </div>
          <span className="text-[11px] text-amber-400 mt-1 block">Physical inventory in stock</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Share */}
        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
          <h2 className="text-base font-serif-luxury font-bold text-stone-100 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-500" />
            Inventory Value by Jewellery Category
          </h2>

          <div className="space-y-3">
            {Object.entries(categoryStats).map(([catName, stats]) => {
              const maxVal = Math.max(...Object.values(categoryStats).map((s) => s.value)) || 1;
              const pct = Math.round((stats.value / maxVal) * 100);
              return (
                <div key={catName} className="text-xs space-y-1">
                  <div className="flex justify-between text-stone-300">
                    <span className="font-semibold">{catName} ({stats.count} designs)</span>
                    <span className="tabular-nums font-mono text-amber-300">{formatPrice(stats.value)}</span>
                  </div>
                  <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Purity Share */}
        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-5">
          <h2 className="text-base font-serif-luxury font-bold text-stone-100 flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-500" />
            Gold Alloy Purity Breakdown
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {(['24K', '22K', '21K', '18K'] as const).map((purity) => {
              const count = purityCounts[purity] || 0;
              const pct = Math.round((count / (products.length || 1)) * 100);
              return (
                <div key={purity} className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-amber-400 font-bold text-sm block">{purity} Gold</span>
                  <div className="text-2xl font-bold text-stone-100 mt-1 tabular-nums">
                    {count} <span className="text-xs font-normal text-stone-500">items</span>
                  </div>
                  <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden mt-3 border border-stone-800">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 block">{pct}% of showroom catalogue</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 5 Revenue Pieces */}
      <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
        <h2 className="text-base font-serif-luxury font-bold text-stone-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Leading Acquired Masterpieces
        </h2>

        {topProducts.length > 0 ? (
          <div className="divide-y divide-stone-800 text-xs">
            {topProducts.map((p, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-stone-100 block">{p.name}</span>
                    <span className="text-[11px] text-stone-400">{p.quantity} units acquired</span>
                  </div>
                </div>
                <span className="font-bold text-amber-300 font-mono text-sm tabular-nums">
                  {formatPrice(p.revenue)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 py-4 text-center">
            Acquisition data will populate as orders are completed in the storefront.
          </p>
        )}
      </div>
    </div>
  );
};
