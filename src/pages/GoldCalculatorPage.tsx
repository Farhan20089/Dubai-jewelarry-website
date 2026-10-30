import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Printer,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Info,
  Check,
  Scale,
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { GoldPurity, Product } from '../types';

export const GoldCalculatorPage: React.FC = () => {
  const { goldRates, settings } = useStoreData();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const [purity, setPurity] = useState<GoldPurity>('22K');
  const [weightUnit, setWeightUnit] = useState<'grams' | 'tolas'>('grams');
  const [weightInput, setWeightInput] = useState<number>(15.5);
  const [customRate, setCustomRate] = useState<number>(goldRates['22K'].ratePerGram);
  const [makingCharges, setMakingCharges] = useState<number>(450);
  const [stoneCharges, setStoneCharges] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  // Auto-fill rate when purity changes
  useEffect(() => {
    setCustomRate(goldRates[purity].ratePerGram);
  }, [purity, goldRates]);

  // Convert weight to grams for calculation (1 tola = 11.6638 grams)
  const weightInGrams = weightUnit === 'tolas' ? weightInput * 11.6638 : weightInput;

  // Formula calculations:
  // Gold Value = Weight (grams) × Gold Rate (per gram)
  // Final Price = Gold Value + Making Charges + Stone Charges - Discount
  const goldValue = Math.round(weightInGrams * customRate);
  const rawTotal = goldValue + Number(makingCharges) + Number(stoneCharges);
  const finalPrice = Math.max(0, rawTotal - Number(discount));
  const vatAmount = Math.round(finalPrice * (settings.taxPercent / 100));
  const grandTotalWithTax = finalPrice + vatAmount;

  const handleReset = () => {
    setPurity('22K');
    setWeightUnit('grams');
    setWeightInput(10.0);
    setCustomRate(goldRates['22K'].ratePerGram);
    setMakingCharges(350);
    setStoneCharges(0);
    setDiscount(0);
    showToast('Calculator reset to standard values', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddCalculatedToCart = () => {
    const customCalculatedProduct: Product = {
      id: `calc-item-${Date.now()}`,
      name: `Bespoke ${purity} Gold Creation (${weightInput}${weightUnit === 'tolas' ? ' tolas' : 'g'})`,
      sku: `DGJ-BESPOKE-${purity}-${Date.now().toString().slice(-4)}`,
      category: 'Custom Jewellery',
      collection: 'Dubai Collection',
      gender: 'Unisex',
      description: `Bespoke crafted jewellery item calculated using official market rate of AED ${customRate}/g. Gross gold weight ${weightInGrams.toFixed(2)}g.`,
      price: finalPrice,
      goldPurity: purity,
      weight: Number(weightInGrams.toFixed(2)),
      makingCharge: Number(makingCharges),
      stoneCharge: Number(stoneCharges),
      discountPercent: 0,
      stock: 10,
      images: ['/src/assets/images/craftsmanship_artisan_1790862790908.jpg'],
      tags: ['Bespoke', 'Calculator Item', purity],
      badge: 'EXCLUSIVE',
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      isExclusive: true,
      rating: 5.0,
      reviewsCount: 1,
      hallmarked: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addToCart(customCalculatedProduct, 1, {
      selectedPurity: purity,
    });

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header (No Print) */}
      <div className="no-print text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Calculator className="w-3.5 h-3.5" /> Deira Souk Valuation Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 mb-2">
          Gold Price Valuation Calculator
        </h1>
        <p className="text-xs text-stone-400">
          Compute transparent gold value, making charges, gemstone additions, and UAE VAT according to the official Souk fixing.
        </p>
      </div>

      {/* Main Grid: Form Inputs + Result Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Inputs (7 cols) (No Print) */}
        <div className="no-print lg:col-span-7 bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h2 className="text-base font-serif-luxury font-bold text-stone-100">
              Parameters &amp; Specifications
            </h2>
            <button
              onClick={handleReset}
              className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* 1. Gold Purity */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-2">
              1. Gold Alloy Purity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['24K', '22K', '21K', '18K'] as GoldPurity[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPurity(p)}
                  className={`py-2 rounded border text-xs font-semibold transition-all ${
                    purity === p
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Weight Unit & Input */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold uppercase text-stone-400">
                  2. Weight Unit
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setWeightUnit('grams')}
                  className={`py-2 rounded border text-xs font-medium ${
                    weightUnit === 'grams'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-stone-800 bg-stone-950 text-stone-400'
                  }`}
                >
                  Grams (g)
                </button>
                <button
                  onClick={() => setWeightUnit('tolas')}
                  className={`py-2 rounded border text-xs font-medium ${
                    weightUnit === 'tolas'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-stone-800 bg-stone-950 text-stone-400'
                  }`}
                >
                  Tolas (tola)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                Weight Value ({weightUnit})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* 3. Gold Rate per Gram (Auto-filled but adjustable) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold uppercase text-stone-400">
                3. Market Gold Rate per Gram (AED)
              </label>
              <span className="text-[11px] text-amber-500/90 font-mono">
                Souk Fixing: AED {goldRates[purity].ratePerGram}/g
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              value={customRate}
              onChange={(e) => setCustomRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {/* 4. Making Charges & Gemstones */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                4. Making Charges (AED)
              </label>
              <input
                type="number"
                step="10"
                value={makingCharges}
                onChange={(e) => setMakingCharges(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                5. Stone Charges (AED)
              </label>
              <input
                type="number"
                step="10"
                value={stoneCharges}
                onChange={(e) => setStoneCharges(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* 5. Discount */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
              6. Promotional Discount (AED)
            </label>
            <input
              type="number"
              step="10"
              value={discount}
              onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Right Output Card (5 cols) (Also serves as Print Slip!) */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-2xl flex flex-col justify-between print-container">
          <div>
            {/* Header */}
            <div className="pb-4 border-b border-stone-800">
              <span className="font-display font-bold text-base tracking-widest uppercase gold-text-gradient block">
                DUBAI GOLD &amp; JEWELLERS
              </span>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                Official Gold Valuation Assessment
              </span>
              <div className="text-[10px] text-stone-500 mt-1">
                Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · {goldRates.lastUpdatedTime}
              </div>
            </div>

            {/* Assessment Item Breakdown */}
            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>Selected Purity:</span>
                <span className="font-bold text-amber-400">{purity} Solid Gold</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Weight Calculated:</span>
                <span className="font-semibold text-stone-100 tabular-nums">
                  {weightInput} {weightUnit} ({weightInGrams.toFixed(2)}g)
                </span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Applicable Gold Rate:</span>
                <span className="font-semibold text-stone-100 tabular-nums">
                  AED {customRate.toFixed(2)}/g
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex justify-between text-stone-200">
                <span>Raw Gold Metal Value:</span>
                <span className="font-bold text-amber-300 tabular-nums">
                  {formatPrice(goldValue)}
                </span>
              </div>

              <div className="flex justify-between text-stone-400">
                <span>Atelier Making Charges:</span>
                <span className="tabular-nums font-semibold text-stone-200">
                  +{formatPrice(Number(makingCharges))}
                </span>
              </div>

              {Number(stoneCharges) > 0 && (
                <div className="flex justify-between text-stone-400">
                  <span>Gemstones &amp; Diamonds:</span>
                  <span className="tabular-nums font-semibold text-stone-200">
                    +{formatPrice(Number(stoneCharges))}
                  </span>
                </div>
              )}

              {Number(discount) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Deducted Discount:</span>
                  <span className="tabular-nums font-semibold">
                    -{formatPrice(Number(discount))}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-800 flex justify-between text-stone-400 text-[11px]">
                <span>UAE VAT (5%):</span>
                <span className="tabular-nums text-stone-300">{formatPrice(vatAmount)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 mt-2 mb-6">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                Estimated Net Acquisition Value
              </span>
              <div className="text-3xl font-bold text-amber-400 tabular-nums font-mono">
                {formatPrice(grandTotalWithTax)}
              </div>
              <span className="text-[10px] text-stone-500 block mt-1">
                Net weight {weightInGrams.toFixed(2)} grams · Hallmarked by DCL
              </span>
            </div>
          </div>

          {/* Action Buttons (Hidden on Print) */}
          <div className="no-print space-y-2.5 pt-2">
            <button
              onClick={handleAddCalculatedToCart}
              className={`w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                isAddedToCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950'
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-4 h-4" /> Added to Shopping Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add Calculated Item to Bag
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-2.5 px-4 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Calculation Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
