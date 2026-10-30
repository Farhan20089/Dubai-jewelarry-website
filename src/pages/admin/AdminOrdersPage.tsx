import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Printer, Filter, CheckCircle2, Truck } from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { OrderStatus } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useStoreData();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order status updated to ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Fulfillment &amp; Security Transit
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
            Order Management ({orders.length})
          </h1>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Statuses ({orders.length})</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s} ({orders.filter((o) => o.status === s).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer Details</th>
                <th className="p-4 font-semibold">Date Placed</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Total Amount</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Current Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">
                    {ord.orderNumber}
                    <span className="block text-[10px] text-stone-500">{ord.trackingNumber}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-stone-200 block">{ord.customer.fullName}</span>
                    <span className="text-[10px] text-stone-400">{ord.customer.phone}</span>
                    <span className="text-[10px] text-stone-500 block truncate max-w-[180px]">
                      {ord.customer.city}, {ord.customer.country}
                    </span>
                  </td>
                  <td className="p-4 text-stone-400">
                    {new Date(ord.createdAt).toLocaleDateString()}
                    <span className="block text-[10px] text-stone-500">
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-stone-300 block">{ord.itemsCount} pieces</span>
                    <span className="text-[10px] text-stone-500 truncate block max-w-[140px]">
                      {ord.items[0]?.product.name}
                      {ord.items.length > 1 ? ` +${ord.items.length - 1} more` : ''}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-amber-300 tabular-nums">
                    {formatPrice(ord.grandTotal)}
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-stone-300 block">
                      {ord.paymentMethod.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className={`px-2.5 py-1 rounded text-xs font-bold uppercase cursor-pointer border ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800/80'
                          : ord.status === 'Shipped'
                          ? 'bg-blue-950 text-blue-300 border-blue-800/80'
                          : ord.status === 'Cancelled'
                          ? 'bg-rose-950 text-rose-300 border-rose-800/80'
                          : 'bg-amber-950 text-amber-300 border-amber-800/80'
                      }`}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st} className="bg-stone-900 text-stone-100">
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/order-success/${ord.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                      title="View Official Invoice"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Invoice</span>
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
