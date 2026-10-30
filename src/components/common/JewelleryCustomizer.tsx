import React, { useState } from 'react';
import { X, Sparkles, Gift, Check, ShoppingBag } from 'lucide-react';
import { Product, GoldPurity } from '../../types';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useStoreData } from '../../context/StoreDataContext';

interface JewelleryCustomizerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JewelleryCustomizer: React.FC<JewelleryCustomizerProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { settings } = useStoreData();

  const [selectedPurity, setSelectedPurity] = useState<GoldPurity>(
    product?.goldPurity || '22K'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.availableSizes?.[0] || '7'
  );
  const [chainLength, setChainLength] = useState<string>('20"');
  const [engravingText, setEngravingText] = useState<string>('');
  const [isGiftWrap, setIsGiftWrap] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  if (!isOpen || !product) return null;

  // Purity price multiplier
  const purityMultiplier: Record<GoldPurity, number> = {
    '24K': 1.08,
    '22K': 1.0,
    '21K': 0.96,
    '18K': 0.84,
  };

  const basePrice = product.price;
  const baseMul = purityMultiplier[product.goldPurity] || 1.0;
  const targetMul = purityMultiplier[selectedPurity] || 1.0;

  // Engraving fee (AED 75 if filled)
  const engravingFee = engravingText.trim().length > 0 ? 75 : 0;
  const giftFee = isGiftWrap ? settings.giftPackagingFee : 0;

  const adjustedPrice = Math.round((basePrice / baseMul) * targetMul) + engravingFee + giftFee;

  const handleApplyAndAddToCart = () => {
    addToCart(product, 1, {
      selectedPurity,
      selectedSize: product.availableSizes ? selectedSize : undefined,
      chainLength: product.category.toLowerCase().includes('chain') || product.category.toLowerCase().includes('necklace') ? chainLength : undefined,
      engravingText: engravingText.trim() || undefined,
      isGiftPackaging: isGiftWrap,
    });
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-600/40 rounded-xl overflow-hidden shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-950 text-stone-400 hover:text-white border border-stone-800"
          aria-label="Close customizer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-xs text-amber-400 uppercase tracking-widest font-semibold">
          <Sparkles className="w-4 h-4" /> Bespoke Atelier Customizer
        </div>
        <h2 className="text-xl font-serif-luxury font-bold text-stone-100 mb-1">
          {product.name}
        </h2>
        <p className="text-xs text-stone-400 mb-5">
          Personalize alloy purity, sizing, hand engraving, and luxury presentation box.
        </p>

        {/* 1. Gold Purity Selector */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase text-stone-300 mb-2 tracking-wider">
            1. Select Gold Purity
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['24K', '22K', '21K', '18K'] as GoldPurity[]).map((purity) => (
              <button
                key={purity}
                onClick={() => setSelectedPurity(purity)}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  selectedPurity === purity
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-bold shadow-md'
                    : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                <div className="text-sm font-semibold">{purity}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  {purity === '24K' ? '99.9% Pure' : purity === '22K' ? '91.6% Souk' : purity === '21K' ? '87.5% Gulf' : '75.0% Fine'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Sizing if applicable */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase text-stone-300 mb-2 tracking-wider">
              2. Select Size / Diameter
            </label>
            <div className="flex flex-wrap gap-2">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded border text-xs font-medium transition-all ${
                    selectedSize === size
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2b. Chain Length if chain/necklace */}
        {(product.category.toLowerCase().includes('chain') ||
          product.category.toLowerCase().includes('necklace')) && (
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase text-stone-300 mb-2 tracking-wider">
              2. Chain Length
            </label>
            <div className="flex gap-2">
              {['18"', '20"', '22"', '24"'].map((len) => (
                <button
                  key={len}
                  onClick={() => setChainLength(len)}
                  className={`px-3.5 py-1.5 rounded border text-xs font-medium transition-all ${
                    chainLength === len
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Laser Engraving */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold uppercase text-stone-300 tracking-wider">
              3. Precision Laser Engraving (+AED 75)
            </label>
            <span className="text-[11px] text-stone-500">{engravingText.length}/20 chars</span>
          </div>
          <input
            type="text"
            maxLength={20}
            value={engravingText}
            onChange={(e) => setEngravingText(e.target.value)}
            placeholder="e.g. Fatima & Tariq · 2026"
            className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
          />
          <p className="text-[11px] text-stone-500 mt-1">
            Carefully laser-inscribed on the interior rim or clasp plate by master craftsmen.
          </p>
        </div>

        {/* 4. Luxury Velvet Presentation Gift Packaging */}
        <div className="mb-6 p-3 rounded-lg bg-stone-950/80 border border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-200 block">
                Dubai Royal Velvet Gift Box (+AED {settings.giftPackagingFee})
              </span>
              <span className="text-[11px] text-stone-500">
                Lacquered wooden casket with gold ribbon and stamped certification card.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isGiftWrap}
            onChange={(e) => setIsGiftWrap(e.target.checked)}
            className="w-4 h-4 rounded border-stone-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
          />
        </div>

        {/* Total & Action */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 block">Customized Price</span>
            <span className="text-2xl font-bold text-amber-300 tabular-nums">
              {formatPrice(adjustedPrice)}
            </span>
          </div>

          <button
            onClick={handleApplyAndAddToCart}
            className={`px-5 py-2.5 rounded font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              isDone
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-lg'
            }`}
          >
            {isDone ? (
              <>
                <Check className="w-4 h-4" /> Customized & Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add Bespoke Piece
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
