import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../services/storage';
import { useToast } from './ToastContext';
import { useStoreData } from './StoreDataContext';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  totalWishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const { products } = useStoreData();

  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    getStorageItem<string[]>(STORAGE_KEYS.WISHLIST, ['prod-1', 'prod-7'])
  );

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.WISHLIST, wishlistIds);
  }, [wishlistIds]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      const name = product ? product.name : 'Item';

      setWishlistIds((prev) => {
        if (prev.includes(productId)) {
          showToast(`Removed "${name}" from wishlist`, 'info');
          return prev.filter((id) => id !== productId);
        } else {
          showToast(`Added "${name}" to wishlist`, 'success');
          return [...prev, productId];
        }
      });
    },
    [products, showToast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast('Item removed from wishlist', 'info');
    },
    [showToast]
  );

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
    showToast('Wishlist cleared', 'info');
  }, [showToast]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        totalWishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
