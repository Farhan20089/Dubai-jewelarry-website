export type GoldPurity = '24K' | '22K' | '21K' | '18K';

export type ProductBadge = 'NEW' | 'BEST SELLER' | 'EXCLUSIVE' | 'LIMITED' | null;

export type GenderCategory = 'Women' | 'Men' | 'Unisex' | 'Kids';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  collection: string;
  gender: GenderCategory;
  description: string;
  shortDescription?: string;
  price: number; // Base calculated or display price in AED
  goldPurity: GoldPurity;
  weight: number; // Weight in grams
  makingCharge: number; // Making charges in AED
  stoneCharge: number; // Gemstone/diamond charges in AED
  discountPercent: number; // Percentage discount
  stock: number;
  availableSizes?: string[]; // e.g. ['5', '6', '7', '8'] or ['16"', '18"', '20"']
  images: string[];
  tags: string[];
  badge: ProductBadge;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isExclusive: boolean;
  rating: number; // e.g. 4.9
  reviewsCount: number;
  dimensions?: string;
  certificateNumber?: string;
  hallmarked: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  bannerImage: string;
  featuredProductIds: string[];
}

export interface CartCustomization {
  selectedPurity?: GoldPurity;
  selectedSize?: string;
  chainLength?: string;
  engravingText?: string;
  isGiftPackaging?: boolean;
}

export interface CartItem {
  id: string; // Unique cart item ID (combines product id and customization)
  productId: string;
  product: Product;
  quantity: number;
  selectedPurity: GoldPurity;
  selectedSize?: string;
  chainLength?: string;
  engravingText?: string;
  giftPackaging: boolean;
  unitPrice: number;
  totalPrice: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface GoldRate {
  purity: GoldPurity;
  ratePerGram: number; // AED
  ratePer10Gram: number; // AED
  ratePerTola: number; // AED (1 tola = 11.6638 grams)
  lastUpdated: string;
  changePercent: number; // Daily percentage change e.g. +0.45 or -0.20
}

export interface GoldRatesState {
  '24K': GoldRate;
  '22K': GoldRate;
  '21K': GoldRate;
  '18K': GoldRate;
  effectiveDate: string;
  lastUpdatedTime: string;
}

export interface GoldRateHistoryEntry {
  id: string;
  date: string;
  timestamp: string;
  rate24K: number;
  rate22K: number;
  rate21K: number;
  rate18K: number;
  note?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number; // in AED
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1-5
  reviewText: string;
  date: string;
  status: 'pending' | 'approved';
  verifiedPurchase: boolean;
}

export interface CustomerAddress {
  id: string;
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  addresses: CustomerAddress[];
  defaultAddress?: CustomerAddress;
}

export interface CustomerOrderInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  orderNotes?: string;
}

export type PaymentMethod = 'cod' | 'bank_transfer' | 'demo_card';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerOrderInfo;
  userId?: string;
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingCharge: number;
  giftPackagingCharge: number;
  taxAmount: number; // VAT (e.g. 5% UAE standard)
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Completed' | 'Demo Paid';
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  whatsappNumber: string;
  storeAddress: string;
  openingHours: string;
  defaultCurrency: 'AED' | 'USD' | 'PKR';
  taxPercent: number; // Default 5% UAE VAT
  shippingCharge: number; // AED
  freeShippingThreshold: number; // AED
  giftPackagingFee: number; // AED
  instagramUrl: string;
  facebookUrl: string;
  announcementText: string;
}

export type CurrencyCode = 'AED' | 'USD' | 'PKR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateAgainstAED: number; // 1 AED in this currency
}

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  role: 'superadmin' | 'manager';
  loggedInAt: string;
}

export interface FilterState {
  category: string;
  collection: string;
  gender: string;
  purity: string;
  minPrice: number;
  maxPrice: number;
  minWeight: number;
  maxWeight: number;
  inStockOnly: boolean;
  searchQuery: string;
}

export type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'popular' | 'rating';
