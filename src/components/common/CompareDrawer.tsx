import React, { useState } from 'react';
import { X, Scale, ShoppingBag, Trash2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { ImageFallback } from './ImageFallback';

export const CompareDrawer: React.FC = () => {
  const { compareIds, removeFromCompare, clearCompare, products } = useStoreData();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  if (compareIds.length === 0) return null;

  const comparedProducts = compareIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <>
      {/* Floating comparison badge pill on bottom left */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 border border-amber-600/50 shadow-2xl text-amber-300 hover:text-white hover:bg-stone-800 transition-all font-medium text-xs backdrop-blur-md"
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Compare Pieces ({compareIds.length}/3)</span>
        </button>
      </div>

      {/* Compare Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-2xl p-6 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-serif-luxury font-bold text-stone-100">
                  Jewellery Comparison Matrix
                </h3>
                <span className="text-xs text-stone-500">
                  (Comparing {comparedProducts.length} of 3 maximum)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCompare}
                  className="text-xs text-stone-400 hover:text-rose-400 flex items-center gap-1 px-2.5 py-1 rounded bg-stone-950 border border-stone-800"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-white"
                  aria-label="Close compare modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Matrix Content */}
            <div className="overflow-x-auto py-4 flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-800">
                    <th className="p-3 text-stone-500 font-normal w-32">Attribute</th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="p-3 w-64 align-top">
                        <div className="relative mb-2">
                          <button
                            onClick={() => removeFromCompare(p.id)}
                            className="absolute -top-1 -right-1 p-1 bg-stone-950 rounded-full text-stone-400 hover:text-rose-400 border border-stone-700"
                            title="Remove from comparison"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="w-full aspect-[4/3] rounded bg-stone-950 overflow-hidden mb-2 border border-stone-800">
                            <ImageFallback
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Link
                            to={`/product/${p.id}`}
                            onClick={() => setIsOpen(false)}
                            className="font-medium text-stone-200 hover:text-amber-400 transition-colors line-clamp-1 block text-sm"
                          >
                            {p.name}
                          </Link>
                          <div className="text-amber-300 font-bold text-sm mt-1 tabular-nums">
                            {formatPrice(p.price)}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  <tr>
                    <td className="p-3 font-medium text-stone-400">Gold Purity</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-amber-300 font-semibold">
                        {p.goldPurity} Certified
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-stone-400">Gross Weight</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-stone-200 tabular-nums">
                        {p.weight} grams
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-stone-400">Making Charges</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-stone-300 tabular-nums">
                        {formatPrice(p.makingCharge)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-stone-400">Stone / Diamonds</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-stone-300 tabular-nums">
                        {p.stoneCharge > 0 ? formatPrice(p.stoneCharge) : 'Pure Gold (None)'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-stone-400">Category</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-stone-300">
                        {p.category}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-stone-400">Customer Rating</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-stone-200">
                        ⭐ {p.rating} / 5.0 ({p.reviewsCount})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-stone-400">Availability</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">
                        <span
                          className={`font-semibold ${
                            p.stock > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {p.stock > 0 ? `In Stock (${p.stock})` : 'Sold Out'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-stone-400">Action</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">
                        <button
                          onClick={() => {
                            addToCart(p, 1);
                          }}
                          disabled={p.stock <= 0}
                          className="w-full py-2 px-3 text-[11px] font-semibold uppercase tracking-wider rounded bg-amber-600 hover:bg-amber-500 text-stone-950 flex items-center justify-center gap-1.5 disabled:opacity-40 shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
