import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Gem,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useCurrency } from '../../context/CurrencyContext';

export const AdminDashboardOverview: React.FC = () => {
  const { products, orders, customers, goldRates } = useStoreData();
  const { formatPrice } = useCurrency();

  // Metrics
  const totalSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const lowStockProducts = products.filter((p) => p.stock <= 3);

  // Group orders by month/recent
  const recentOrders = orders.slice(0, 5);

  // Category counts
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Showroom Operations Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100 mt-0.5">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow"
          >
            + Add New Product
          </Link>
          <Link
            to="/admin/gold-rates"
            className="px-4 py-2 rounded-lg bg-stone-900 border border-stone-700 hover:border-amber-500 text-stone-200 text-xs font-semibold transition-colors"
          >
            Update Gold Rates
          </Link>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="p-5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider block">Total Sales</span>
            <div className="text-2xl font-bold text-amber-300 mt-1 tabular-nums">
              {formatPrice(totalSales)}
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">Lifetime demo revenue</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider block">Total Orders</span>
            <div className="text-2xl font-bold text-stone-100 mt-1 tabular-nums">
              {orders.length}
            </div>
            <span className="text-[11px] text-amber-400 mt-1 block">{pendingOrders} pending dispatch</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="p-5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider block">Showroom Items</span>
            <div className="text-2xl font-bold text-stone-100 mt-1 tabular-nums">
              {products.length}
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">Active catalog designs</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Gem className="w-6 h-6" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider block">Registered Patrons</span>
            <div className="text-2xl font-bold text-stone-100 mt-1 tabular-nums">
              {customers.length}
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">VIP client registry</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Grid: Low Stock Alert & Live Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low Stock Watch (6 cols) */}
        <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-100">
                Low Inventory Alerts ({lowStockProducts.length})
              </h2>
            </div>
            <Link to="/admin/products" className="text-xs text-amber-400 hover:underline">
              Manage Stock
            </Link>
          </div>

          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-stone-950 border border-stone-800/80 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-stone-900 overflow-hidden shrink-0 border border-stone-800">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <span className="font-semibold text-stone-200 block truncate">{p.name}</span>
                      <span className="text-stone-500 text-[11px]">{p.goldPurity} · {p.sku}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    p.stock === 0 ? 'bg-rose-950 text-rose-300 border border-rose-800/60' : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                  }`}>
                    {p.stock === 0 ? 'Sold Out' : `${p.stock} Left`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 py-6 text-center">
              All inventory levels in the Deira Souk vault are healthy.
            </p>
          )}
        </div>

        {/* Current Gold Souk Rates Widget (6 cols) */}
        <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-100">
                Active Souk Gold Fixing
              </h2>
            </div>
            <Link to="/admin/gold-rates" className="text-xs text-amber-400 hover:underline">
              Edit Fixing
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {(['24K', '22K', '21K', '18K'] as const).map((purity) => (
              <div key={purity} className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                <span className="text-amber-400 font-bold text-xs">{purity} Gold</span>
                <div className="text-lg font-bold text-stone-100 tabular-nums mt-0.5">
                  AED {goldRates[purity].ratePerGram.toFixed(2)}/g
                </div>
                <div className="text-[10px] text-stone-500">
                  Per Tola: AED {goldRates[purity].ratePerTola.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-stone-500 flex items-center justify-between pt-2 border-t border-stone-800">
            <span>Fixing effective date: {goldRates.effectiveDate}</span>
            <span>Last adjusted: {goldRates.lastUpdatedTime}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <h2 className="text-base font-serif-luxury font-bold text-stone-100">
            Recent Client Acquisitions
          </h2>
          <Link to="/admin/orders" className="text-xs text-amber-400 hover:underline font-semibold">
            View All ({orders.length}) Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Total Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-800/30 transition-colors">
                  <td className="py-3 font-mono font-bold text-amber-400">{ord.orderNumber}</td>
                  <td className="py-3">
                    <span className="font-semibold text-stone-200 block">{ord.customer.fullName}</span>
                    <span className="text-[10px] text-stone-500">{ord.customer.city}</span>
                  </td>
                  <td className="py-3 text-stone-400">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-stone-300">{ord.itemsCount} pieces</td>
                  <td className="py-3 font-bold text-amber-300 tabular-nums">
                    {formatPrice(ord.grandTotal)}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : ord.status === 'Shipped'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/order-success/${ord.id}`}
                      className="text-xs text-amber-400 hover:underline font-semibold"
                    >
                      Invoice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
