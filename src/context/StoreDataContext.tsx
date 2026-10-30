import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Category,
  Collection,
  GoldRatesState,
  GoldRateHistoryEntry,
  Coupon,
  Review,
  Order,
  CustomerUser,
  StoreSettings,
  ContactMessage,
  OrderStatus,
} from '../types';
import {
  getStorageItem,
  setStorageItem,
  clearStorage,
  STORAGE_KEYS,
} from '../services/storage';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_GOLD_RATES,
  INITIAL_GOLD_RATE_HISTORY,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
} from '../data/seedData';

interface StoreDataContextType {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  goldRates: GoldRatesState;
  goldRateHistory: GoldRateHistoryEntry[];
  coupons: Coupon[];
  reviews: Review[];
  orders: Order[];
  customers: CustomerUser[];
  contactMessages: ContactMessage[];
  settings: StoreSettings;
  subscribers: string[];
  recentlyViewedIds: string[];
  compareIds: string[];

  // Mutations
  updateGoldRates: (newRates: Partial<GoldRatesState>) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => Product;
  updateProductStock: (id: string, stock: number) => void;

  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;

  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  toggleCoupon: (id: string) => void;

  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  addSubscriber: (email: string) => boolean;
  updateSettings: (settings: StoreSettings) => void;

  addToRecentlyViewed: (productId: string) => void;
  toggleCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  resetDemoData: () => void;
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() =>
    getStorageItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
  );

  // Categories & Collections
  const [categories, setCategories] = useState<Category[]>(() =>
    getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );

  const [collections] = useState<Collection[]>(() =>
    getStorageItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS)
  );

  // Gold Rates
  const [goldRates, setGoldRates] = useState<GoldRatesState>(() =>
    getStorageItem<GoldRatesState>(STORAGE_KEYS.GOLD_RATES, INITIAL_GOLD_RATES)
  );

  const [goldRateHistory, setGoldRateHistory] = useState<GoldRateHistoryEntry[]>(() =>
    getStorageItem<GoldRateHistoryEntry[]>(STORAGE_KEYS.GOLD_RATE_HISTORY, INITIAL_GOLD_RATE_HISTORY)
  );

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    getStorageItem<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS)
  );

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() =>
    getStorageItem<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS)
  );

  // Orders
  const [orders, setOrders] = useState<Order[]>(() =>
    getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );

  // Customers
  const [customers, setCustomers] = useState<CustomerUser[]>(() =>
    getStorageItem<CustomerUser[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS)
  );

  // Messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() =>
    getStorageItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, [
      {
        id: 'msg-1',
        name: 'Sarah Jenkins',
        email: 's.jenkins@londonlux.co.uk',
        phone: '+44 7700 900122',
        message: 'Inquiring regarding custom bridal set commissioning for December wedding in Dubai. Can we schedule a virtual showroom walkthrough?',
        date: '2026-09-29T11:20:00Z',
        isRead: false,
      },
      {
        id: 'msg-2',
        name: 'Adnan Al-Khatib',
        email: 'adnan.k@kuwaittower.net',
        phone: '+965 9912 3456',
        message: 'Looking for 100g 24K gold bullion bars for urgent delivery to Dubai hotel. Do you accept wire transfer upon arrival?',
        date: '2026-09-30T14:45:00Z',
        isRead: true,
      },
    ])
  );

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() =>
    getStorageItem<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );

  // Subscribers
  const [subscribers, setSubscribers] = useState<string[]>(() =>
    getStorageItem<string[]>(STORAGE_KEYS.SUBSCRIBERS, ['vip@dubaigold.com', 'collector@sheikhjewels.ae'])
  );

  // Recently Viewed & Compare
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() =>
    getStorageItem<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, ['prod-1', 'prod-2', 'prod-6'])
  );

  const [compareIds, setCompareIds] = useState<string[]>(() =>
    getStorageItem<string[]>(STORAGE_KEYS.COMPARE_LIST, [])
  );

  // Sync to localStorage
  useEffect(() => { setStorageItem(STORAGE_KEYS.PRODUCTS, products); }, [products]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.CATEGORIES, categories); }, [categories]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.GOLD_RATES, goldRates); }, [goldRates]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.GOLD_RATE_HISTORY, goldRateHistory); }, [goldRateHistory]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.COUPONS, coupons); }, [coupons]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.REVIEWS, reviews); }, [reviews]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.CUSTOMERS, customers); }, [customers]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.MESSAGES, contactMessages); }, [contactMessages]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.SUBSCRIBERS, subscribers); }, [subscribers]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, recentlyViewedIds); }, [recentlyViewedIds]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.COMPARE_LIST, compareIds); }, [compareIds]);

  // Recalculate dynamic product base prices when gold rates change or update products
  const updateGoldRates = useCallback((newRatesPartial: Partial<GoldRatesState>) => {
    setGoldRates((prev) => {
      const updated = {
        ...prev,
        ...newRatesPartial,
        lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' GST',
      };

      // Add to history
      const todayStr = new Date().toISOString().split('T')[0];
      const historyItem: GoldRateHistoryEntry = {
        id: 'grh-' + Date.now(),
        date: todayStr,
        timestamp: new Date().toISOString(),
        rate24K: updated['24K'].ratePerGram,
        rate22K: updated['22K'].ratePerGram,
        rate21K: updated['21K'].ratePerGram,
        rate18K: updated['18K'].ratePerGram,
        note: 'Admin manual rate update',
      };

      setGoldRateHistory((h) => [...h.slice(-30), historyItem]);
      return updated;
    });
  }, []);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const duplicateProduct = useCallback((id: string): Product => {
    const existing = products.find((p) => p.id === id);
    if (!existing) throw new Error('Product not found');
    const duplicate: Product = {
      ...existing,
      id: 'prod-' + Date.now(),
      name: `${existing.name} (Copy)`,
      sku: `${existing.sku}-CPY`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [duplicate, ...prev]);
    return duplicate;
  }, [products]);

  const updateProductStock = useCallback((id: string, stock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p))
    );
  }, []);

  const addReview = useCallback((reviewData: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'approved', // Auto-approved for smooth demo flow
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const productReviews = reviews.filter((r) => r.productId === p.id);
          const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0) + reviewData.rating;
          const newAvg = Number((totalRating / (productReviews.length + 1)).toFixed(2));
          return {
            ...p,
            rating: newAvg,
            reviewsCount: p.reviewsCount + 1,
          };
        }
        return p;
      })
    );
  }, [reviews]);

  const approveReview = useCallback((id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  }, []);

  const deleteReview = useCallback((id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addCoupon = useCallback((couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: 'coup-' + Date.now(),
      usageCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  }, []);

  const updateCoupon = useCallback((updated: Coupon) => {
    setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const deleteCoupon = useCallback((id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const toggleCoupon = useCallback((id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  }, []);

  const createOrder = useCallback((order: Order) => {
    // 1. Add order
    setOrders((prev) => [order, ...prev]);

    // 2. Reduce stock of products
    setProducts((prev) =>
      prev.map((p) => {
        const matchingItem = order.items.find((item) => item.productId === p.id);
        if (matchingItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - matchingItem.quantity),
          };
        }
        return p;
      })
    );

    // 3. Increment coupon usage if used
    if (order.couponCode) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.code.toUpperCase() === order.couponCode?.toUpperCase()
            ? { ...c, usageCount: c.usageCount + 1 }
            : c
        )
      );
    }

    // 4. Update or add customer record
    setCustomers((prev) => {
      const existingCust = prev.find((c) => c.email.toLowerCase() === order.customer.email.toLowerCase());
      if (existingCust) {
        return prev.map((c) =>
          c.id === existingCust.id
            ? {
                ...c,
                totalOrders: (c as any).totalOrders ? (c as any).totalOrders + 1 : 1,
                totalSpent: (c as any).totalSpent ? (c as any).totalSpent + order.grandTotal : order.grandTotal,
              }
            : c
        );
      } else {
        const newCust: CustomerUser = {
          id: 'cust-' + Date.now(),
          name: order.customer.fullName,
          email: order.customer.email,
          phone: order.customer.phone,
          registeredAt: new Date().toISOString().split('T')[0],
          addresses: [
            {
              id: 'addr-' + Date.now(),
              street: order.customer.address,
              city: order.customer.city,
              postalCode: order.customer.postalCode,
              country: order.customer.country,
              isDefault: true,
            },
          ],
        };
        return [newCust, ...prev];
      }
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }, []);

  const addContactMessage = useCallback((msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      date: new Date().toISOString(),
      isRead: false,
    };
    setContactMessages((prev) => [newMsg, ...prev]);
  }, []);

  const markMessageRead = useCallback((id: string) => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const addSubscriber = useCallback((email: string): boolean => {
    const clean = email.trim().toLowerCase();
    if (!clean || subscribers.includes(clean)) return false;
    setSubscribers((prev) => [...prev, clean]);
    return true;
  }, [subscribers]);

  const updateSettings = useCallback((newSettings: StoreSettings) => {
    setSettings(newSettings);
  }, []);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  }, []);

  const toggleCompare = useCallback((productId: string): boolean => {
    let wasAdded = false;
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        return prev; // capped at 3
      }
      wasAdded = true;
      return [...prev, productId];
    });
    return wasAdded;
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const resetDemoData = useCallback(() => {
    clearStorage();
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setGoldRates(INITIAL_GOLD_RATES);
    setGoldRateHistory(INITIAL_GOLD_RATE_HISTORY);
    setCoupons(INITIAL_COUPONS);
    setReviews(INITIAL_REVIEWS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setSettings(INITIAL_SETTINGS);
    setRecentlyViewedIds(['prod-1', 'prod-2', 'prod-6']);
    setCompareIds([]);
  }, []);

  return (
    <StoreDataContext.Provider
      value={{
        products,
        categories,
        collections,
        goldRates,
        goldRateHistory,
        coupons,
        reviews,
        orders,
        customers,
        contactMessages,
        settings,
        subscribers,
        recentlyViewedIds,
        compareIds,

        updateGoldRates,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        updateProductStock,

        addReview,
        approveReview,
        deleteReview,

        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCoupon,

        createOrder,
        updateOrderStatus,

        addContactMessage,
        markMessageRead,
        deleteMessage,

        addSubscriber,
        updateSettings,

        addToRecentlyViewed,
        toggleCompare,
        removeFromCompare,
        clearCompare,

        resetDemoData,
      }}
    >
      {children}
    </StoreDataContext.Provider>
  );
};

export const useStoreData = (): StoreDataContextType => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error('useStoreData must be used within a StoreDataProvider');
  }
  return context;
};
