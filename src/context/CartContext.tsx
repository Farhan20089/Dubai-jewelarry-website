import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, Product, CartCustomization, Coupon } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../services/storage';
import { useStoreData } from './StoreDataContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, customization?: CartCustomization) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  isGiftPackaging: boolean;
  setIsGiftPackaging: (val: boolean) => void;

  // Computed Totals in AED
  subtotal: number;
  discountAmount: number;
  shippingCharge: number;
  giftPackagingCharge: number;
  taxAmount: number;
  grandTotal: number;
  totalItemsCount: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { coupons, settings } = useStoreData();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    getStorageItem<CartItem[]>(STORAGE_KEYS.CART, [])
  );

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isGiftPackaging, setIsGiftPackaging] = useState<boolean>(false);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CART, cartItems);
  }, [cartItems]);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1, customization?: CartCustomization) => {
      if (product.stock <= 0) {
        showToast(`"${product.name}" is currently out of stock`, 'error');
        return;
      }

      // Calculate unit price adjusted for purity or discount
      let unitPrice = product.price;
      if (product.discountPercent > 0) {
        unitPrice = product.price * (1 - product.discountPercent / 100);
      }

      // Adjust price if customized purity differs from base
      const selectedPurity = customization?.selectedPurity || product.goldPurity;
      if (selectedPurity !== product.goldPurity) {
        const purityMultiplier: Record<string, number> = {
          '24K': 1.08,
          '22K': 1.0,
          '21K': 0.96,
          '18K': 0.84,
        };
        const baseMul = purityMultiplier[product.goldPurity] || 1.0;
        const targetMul = purityMultiplier[selectedPurity] || 1.0;
        unitPrice = Math.round((unitPrice / baseMul) * targetMul);
      }

      const cartItemId = `${product.id}-${selectedPurity}-${customization?.selectedSize || 'default'}-${customization?.chainLength || 'default'}-${customization?.engravingText ? 'engr' : 'no'}`;

      setCartItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === cartItemId);
        if (existingIndex > -1) {
          const current = prev[existingIndex];
          const newQty = Math.min(product.stock, current.quantity + quantity);
          const updated = [...prev];
          updated[existingIndex] = {
            ...current,
            quantity: newQty,
            totalPrice: unitPrice * newQty,
          };
          return updated;
        } else {
          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            product,
            quantity: Math.min(product.stock, quantity),
            selectedPurity,
            selectedSize: customization?.selectedSize,
            chainLength: customization?.chainLength,
            engravingText: customization?.engravingText,
            giftPackaging: customization?.isGiftPackaging ?? false,
            unitPrice,
            totalPrice: unitPrice * Math.min(product.stock, quantity),
          };
          return [...prev, newItem];
        }
      });

      showToast(`Added ${quantity} × ${product.name} to cart`, 'success');
    },
    [showToast]
  );

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(cartItemId);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === cartItemId) {
            const safeQty = Math.min(item.product.stock, quantity);
            return {
              ...item,
              quantity: safeQty,
              totalPrice: item.unitPrice * safeQty,
            };
          }
          return item;
        })
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  // Coupon handling
  const applyCoupon = useCallback(
    (code: string): { success: boolean; message: string } => {
      const cleanCode = code.trim().toUpperCase();
      const found = coupons.find(
        (c) => c.code.toUpperCase() === cleanCode && c.isActive
      );

      if (!found) {
        return { success: false, message: 'Invalid or inactive promotional coupon code.' };
      }

      // Check expiry
      if (new Date(found.expiryDate) < new Date()) {
        return { success: false, message: 'This coupon code has expired.' };
      }

      // Check min order
      const rawSubtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
      if (rawSubtotal < found.minOrderAmount) {
        return {
          success: false,
          message: `Minimum order of AED ${found.minOrderAmount} required for coupon ${cleanCode}.`,
        };
      }

      setAppliedCoupon(found);
      showToast(`Coupon ${cleanCode} applied (${found.discountPercent}% OFF)!`, 'success');
      return { success: true, message: `Coupon applied: ${found.discountPercent}% discount.` };
    },
    [coupons, cartItems, showToast]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  }, [showToast]);

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
  }, [appliedCoupon, subtotal]);

  const isFreeShipping = useMemo(() => {
    return subtotal >= settings.freeShippingThreshold || subtotal === 0;
  }, [subtotal, settings.freeShippingThreshold]);

  const amountNeededForFreeShipping = useMemo(() => {
    return Math.max(0, settings.freeShippingThreshold - subtotal);
  }, [subtotal, settings.freeShippingThreshold]);

  const shippingCharge = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return isFreeShipping ? 0 : settings.shippingCharge;
  }, [cartItems.length, isFreeShipping, settings.shippingCharge]);

  const giftPackagingCharge = useMemo(() => {
    if (cartItems.length === 0) return 0;
    const hasItemGift = cartItems.some((i) => i.giftPackaging);
    return isGiftPackaging || hasItemGift ? settings.giftPackagingFee : 0;
  }, [cartItems, isGiftPackaging, settings.giftPackagingFee]);

  const taxAmount = useMemo(() => {
    if (cartItems.length === 0) return 0;
    const taxableBase = Math.max(0, subtotal - discountAmount);
    return Math.round((taxableBase * (settings.taxPercent / 100)) * 100) / 100;
  }, [cartItems.length, subtotal, discountAmount, settings.taxPercent]);

  const grandTotal = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return Math.max(0, subtotal - discountAmount) + shippingCharge + giftPackagingCharge + taxAmount;
  }, [cartItems.length, subtotal, discountAmount, shippingCharge, giftPackagingCharge, taxAmount]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isGiftPackaging,
        setIsGiftPackaging,
        subtotal,
        discountAmount,
        shippingCharge,
        giftPackagingCharge,
        taxAmount,
        grandTotal,
        totalItemsCount,
        isFreeShipping,
        amountNeededForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
