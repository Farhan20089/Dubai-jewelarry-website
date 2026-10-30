import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { StoreDataProvider } from './context/StoreDataContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { AdminLayout } from './components/layout/AdminLayout';
import { SearchModal } from './components/common/SearchModal';
import { CompareDrawer } from './components/common/CompareDrawer';

// Customer Store Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { GoldRatesPage } from './pages/GoldRatesPage';
import { GoldCalculatorPage } from './pages/GoldCalculatorPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Portal Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminGoldRatesPage } from './pages/admin/AdminGoldRatesPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Shell wrapper (provides Navbar, Footer, MobileNav, SearchModal, CompareDrawer)
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-stone-950 text-stone-100">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <CompareDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <StoreDataProvider>
          <CurrencyProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <BrowserRouter>
                    <ScrollToTop />
                    <Routes>
                      {/* Customer Store Routes */}
                      <Route
                        path="/"
                        element={
                          <CustomerLayout>
                            <HomePage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/shop"
                        element={
                          <CustomerLayout>
                            <ShopPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/category/:category"
                        element={
                          <CustomerLayout>
                            <ShopPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/product/:id"
                        element={
                          <CustomerLayout>
                            <ProductDetailPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/collections"
                        element={
                          <CustomerLayout>
                            <CollectionsPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/collection/:slug"
                        element={
                          <CustomerLayout>
                            <CollectionDetailPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/gold-rates"
                        element={
                          <CustomerLayout>
                            <GoldRatesPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/gold-calculator"
                        element={
                          <CustomerLayout>
                            <GoldCalculatorPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/cart"
                        element={
                          <CustomerLayout>
                            <CartPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/wishlist"
                        element={
                          <CustomerLayout>
                            <WishlistPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <CustomerLayout>
                            <CheckoutPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/order-success/:id"
                        element={
                          <CustomerLayout>
                            <OrderSuccessPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/account"
                        element={
                          <CustomerLayout>
                            <CustomerAccountPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/account/orders"
                        element={
                          <CustomerLayout>
                            <CustomerAccountPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/account/profile"
                        element={
                          <CustomerLayout>
                            <CustomerAccountPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/login"
                        element={
                          <CustomerLayout>
                            <LoginPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <CustomerLayout>
                            <RegisterPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/about"
                        element={
                          <CustomerLayout>
                            <AboutPage />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/contact"
                        element={
                          <CustomerLayout>
                            <ContactPage />
                          </CustomerLayout>
                        }
                      />

                      {/* Admin Portal Authentication */}
                      <Route path="/admin/login" element={<AdminLoginPage />} />

                      {/* Admin Dashboard Protected Shell */}
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardOverview />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="customers" element={<AdminCustomersPage />} />
                        <Route path="gold-rates" element={<AdminGoldRatesPage />} />
                        <Route path="coupons" element={<AdminCouponsPage />} />
                        <Route path="reviews" element={<AdminReviewsPage />} />
                        <Route path="messages" element={<AdminMessagesPage />} />
                        <Route path="analytics" element={<AdminAnalyticsPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                      </Route>

                      {/* Fallback to home */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </BrowserRouter>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </CurrencyProvider>
        </StoreDataProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
