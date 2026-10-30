/**
 * LocalStorage Service for Dubai Gold & Jewellers
 * Provides robust type-safe persistence with fallback defaults and graceful error recovery.
 */

export const STORAGE_KEYS = {
  PRODUCTS: 'dgj_products_v1',
  CATEGORIES: 'dgj_categories_v1',
  COLLECTIONS: 'dgj_collections_v1',
  CART: 'dgj_cart_v1',
  WISHLIST: 'dgj_wishlist_v1',
  GOLD_RATES: 'dgj_gold_rates_v1',
  GOLD_RATE_HISTORY: 'dgj_gold_rate_history_v1',
  COUPONS: 'dgj_coupons_v1',
  REVIEWS: 'dgj_reviews_v1',
  ORDERS: 'dgj_orders_v1',
  CUSTOMERS: 'dgj_customers_v1',
  CURRENT_USER: 'dgj_current_user_v1',
  ADMIN_SESSION: 'dgj_admin_session_v1',
  MESSAGES: 'dgj_contact_messages_v1',
  SUBSCRIBERS: 'dgj_subscribers_v1',
  SETTINGS: 'dgj_settings_v1',
  THEME: 'dgj_theme_v1',
  CURRENCY: 'dgj_currency_v1',
  RECENTLY_VIEWED: 'dgj_recently_viewed_v1',
  COMPARE_LIST: 'dgj_compare_list_v1',
  INITIALIZED: 'dgj_seeded_v1',
} as const;

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
