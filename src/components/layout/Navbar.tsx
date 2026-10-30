import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency, CURRENCIES } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { GoldTicker } from './GoldTicker';
import { CurrencyCode } from '../../types';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { totalWishlistCount } = useWishlist();
  const { currentCurrency, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, isAuthenticated, logout, isAdminAuthenticated } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'Gold Rates', path: '/gold-rates' },
    { name: 'Gold Calculator', path: '/gold-calculator' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 shadow-lg transition-colors">
      {/* Top Gold Ticker */}
      <GoldTicker />

      {/* Main 3-Zone Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Zone 1: Single Text Element Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded text-stone-300 hover:text-white hover:bg-stone-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link
              to="/"
              className="group flex flex-col items-start select-none"
            >
              <span className="font-display tracking-[0.22em] text-lg sm:text-xl font-bold uppercase gold-text-gradient leading-none transition-transform group-hover:scale-[1.01]">
                DUBAI GOLD & JEWELLERS
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400 mt-1 font-sans">
                Haute Joaillerie · Deira Souk
              </span>
            </Link>
          </div>

          {/* Zone 2: 4-6 Text Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors py-1 relative ${
                    isActive
                      ? 'text-amber-400 font-semibold'
                      : 'text-stone-300 hover:text-amber-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Actions (Search, Currency, Theme, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch || (() => navigate('/shop'))}
              className="p-2 rounded-full text-stone-300 hover:text-amber-400 hover:bg-stone-900 transition-colors"
              aria-label="Search catalogue"
              title="Search jewellery"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold text-stone-300 hover:text-amber-400 hover:bg-stone-900 transition-colors border border-stone-800"
                aria-label="Select currency"
              >
                <span>{currentCurrency}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {currencyMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-stone-900 border border-stone-800 rounded-lg shadow-2xl py-1 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-800">
                    Select Currency
                  </div>
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrency(code);
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-800 transition-colors ${
                        currentCurrency === code
                          ? 'text-amber-400 font-bold bg-amber-500/10'
                          : 'text-stone-300'
                      }`}
                    >
                      <span>{CURRENCIES[code].label}</span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {CURRENCIES[code].symbol}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-stone-300 hover:text-amber-400 hover:bg-stone-900 transition-colors"
              aria-label="Toggle dark/light mode"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full text-stone-300 hover:text-amber-400 hover:bg-stone-900 transition-colors"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-stone-300 hover:text-amber-400 hover:bg-stone-900 transition-colors"
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-[10px] font-black flex items-center justify-center tabular-nums shadow">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-2 rounded-full text-stone-300 hover:text-amber-400 hover:bg-stone-900 transition-colors border border-stone-800"
                aria-label="User Account Menu"
                title="Account"
              >
                <User className="w-4 h-4" />
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-lg shadow-2xl py-1 z-50 animate-in fade-in"
                  onClick={() => setAccountMenuOpen(false)}
                >
                  {isAuthenticated && currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-stone-800">
                        <div className="text-xs font-semibold text-stone-100 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-stone-400 truncate">
                          {currentUser.email}
                        </div>
                      </div>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-xs text-stone-300 hover:bg-stone-800 hover:text-amber-400"
                      >
                        My Account & Profile
                      </Link>
                      <Link
                        to="/account/orders"
                        className="block px-4 py-2 text-xs text-stone-300 hover:bg-stone-800 hover:text-amber-400"
                      >
                        Order History
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-stone-800"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-stone-800"
                      >
                        Customer Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-xs text-stone-300 hover:bg-stone-800"
                      >
                        Create New Account
                      </Link>
                    </>
                  )}

                  {/* Admin Entrance */}
                  <div className="border-t border-stone-800 mt-1 pt-1">
                    <Link
                      to={isAdminAuthenticated ? '/admin' : '/admin/login'}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs text-amber-500/90 hover:bg-stone-800 hover:text-amber-300"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>{isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Portal Login'}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-950 px-4 py-4 space-y-3 animate-in slide-in-from-top-3">
          {/* Currency selection on mobile */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <span className="text-xs text-stone-400">Display Currency:</span>
            <div className="flex gap-1">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    currentCurrency === code
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-900 text-stone-400'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded text-sm font-medium text-stone-200 hover:bg-stone-900 hover:text-amber-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 rounded bg-stone-900 text-xs text-amber-400 font-semibold border border-stone-800"
            >
              <Shield className="w-4 h-4" /> Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
