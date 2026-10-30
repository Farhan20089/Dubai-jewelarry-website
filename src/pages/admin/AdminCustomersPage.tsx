import React, { useState } from 'react';
import { Users, Mail, Phone, MapPin, ShoppingBag, Search } from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useCurrency } from '../../context/CurrencyContext';

export const AdminCustomersPage: React.FC = () => {
  const { customers, orders } = useStoreData();
  const { formatPrice } = useCurrency();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Patron Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
            Registered Customers ({customers.length})
          </h1>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patrons..."
            className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                <th className="p-4 font-semibold">Patron Name</th>
                <th className="p-4 font-semibold">Contact Email</th>
                <th className="p-4 font-semibold">Phone (WhatsApp)</th>
                <th className="p-4 font-semibold">Registered</th>
                <th className="p-4 font-semibold">Orders Count</th>
                <th className="p-4 font-semibold">Total Acquisitions</th>
                <th className="p-4 font-semibold">Primary Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filtered.map((cust) => {
                const custOrders = orders.filter(
                  (o) =>
                    (o.userId && o.userId === cust.id) ||
                    o.customer.email.toLowerCase() === cust.email.toLowerCase()
                );
                const totalSpent = custOrders.reduce((sum, o) => sum + o.grandTotal, 0);
                const primaryAddr = cust.addresses.find((a) => a.isDefault) || cust.addresses[0];

                return (
                  <tr key={cust.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-stone-100 block">{cust.name}</span>
                      <span className="text-[10px] text-amber-500 font-mono">ID: {cust.id}</span>
                    </td>
                    <td className="p-4 text-stone-300 font-mono">{cust.email}</td>
                    <td className="p-4 text-stone-300 font-mono">{cust.phone}</td>
                    <td className="p-4 text-stone-400">{cust.registeredAt}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800 font-semibold">
                        {custOrders.length} Orders
                      </span>
                    </td>
                    <td className="p-4 font-bold text-amber-300 tabular-nums">
                      {formatPrice(totalSpent)}
                    </td>
                    <td className="p-4 text-stone-400 truncate max-w-[200px]">
                      {primaryAddr ? `${primaryAddr.street}, ${primaryAddr.city}` : 'No address saved'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
