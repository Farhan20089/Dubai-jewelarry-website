import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  Truck,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStoreData } from '../context/StoreDataContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';

export const CustomerAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, updateProfile, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { orders } = useStoreData();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const isOrdersRoute = location.pathname.includes('/orders');
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>(
    isOrdersRoute ? 'orders' : 'profile'
  );

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '');

  // Add Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Dubai');
  const [newPostal, setNewPostal] = useState('00000');
  const [newCountry, setNewCountry] = useState('United Arab Emirates');

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Find orders matching this user or email
  const userOrders = orders.filter(
    (o) =>
      (o.userId && o.userId === currentUser.id) ||
      o.customer.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: nameInput, phone: phoneInput });
    setIsEditingProfile(false);
    showToast('Profile information updated.', 'success');
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    addAddress({
      street: newStreet,
      city: newCity,
      postalCode: newPostal,
      country: newCountry,
      isDefault: currentUser.addresses.length === 0,
    });

    setIsAddingAddress(false);
    setNewStreet('');
    showToast('New shipping address saved.', 'success');
  };

  return (
    <div className="min-h-screen bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="mb-8 pb-4 border-b border-stone-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-1">
            Private Patron Suite
          </span>
          <h1 className="text-3xl font-serif-luxury font-bold text-stone-100">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">{currentUser.email}</p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded bg-stone-900 border border-stone-800 hover:border-rose-700 text-stone-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation (3 cols) */}
        <aside className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'profile'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-900/60 text-stone-300 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Patron Profile
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-900/60 text-stone-300 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" /> Acquisition Orders
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-950 text-stone-300">
              {userOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'addresses'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-900/60 text-stone-300 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" /> Shipping Addresses
          </button>

          <Link
            to="/wishlist"
            className="w-full text-left px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 bg-stone-900/60 text-stone-300 hover:bg-stone-900 hover:text-white transition-colors block"
          >
            <Heart className="w-4 h-4" /> View Wishlist
          </Link>
        </aside>

        {/* Right Content Area (9 cols) */}
        <div className="lg:col-span-9 bg-stone-900 border border-stone-800 rounded-xl p-6 sm:p-8 shadow-2xl">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <div>
                  <h2 className="text-xl font-serif-luxury font-bold text-stone-100">
                    Personal Information
                  </h2>
                  <p className="text-xs text-stone-400">
                    Registered patron details associated with certified hallmark certificates.
                  </p>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setNameInput(currentUser.name);
                      setPhoneInput(currentUser.phone);
                      setIsEditingProfile(true);
                    }}
                    className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" /> Edit Profile
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded bg-stone-800 text-stone-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 uppercase block mb-1">Legal Name</span>
                    <span className="font-semibold text-stone-200 text-sm">{currentUser.name}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 uppercase block mb-1">Email Address</span>
                    <span className="font-semibold text-stone-200 text-sm">{currentUser.email}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 uppercase block mb-1">Phone / WhatsApp</span>
                    <span className="font-semibold text-stone-200 text-sm font-mono">{currentUser.phone}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 uppercase block mb-1">Patron Since</span>
                    <span className="font-semibold text-stone-200 text-sm">{currentUser.registeredAt}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <div className="pb-4 border-b border-stone-800 mb-6">
                <h2 className="text-xl font-serif-luxury font-bold text-stone-100">
                  Acquisition Order History
                </h2>
                <p className="text-xs text-stone-400">
                  Track insured courier shipments, view official invoices, and inspect hallmark data.
                </p>
              </div>

              {userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800/80 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-400 font-mono text-sm">
                              {ord.orderNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                                  : ord.status === 'Shipped'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500">
                            Placed on {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/order-success/${ord.id}`}
                            className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-400" />
                            <span>View Tax Invoice</span>
                          </Link>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="space-y-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <span className="text-stone-400 font-semibold">{item.quantity}x</span>
                              <span className="text-stone-200">{item.product.name}</span>
                              <span className="text-amber-400 font-semibold">({item.selectedPurity})</span>
                            </div>
                            <span className="text-stone-100 font-semibold tabular-nums">
                              {formatPrice(item.totalPrice)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer tracking and grand total */}
                      <div className="pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-400 gap-2">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-amber-500" />
                          <span>
                            Tracking: <strong className="font-mono text-stone-200">{ord.trackingNumber}</strong>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-stone-400 mr-2">Grand Total:</span>
                          <span className="text-sm font-bold text-amber-300 tabular-nums">
                            {formatPrice(ord.grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center bg-stone-950 rounded-xl border border-stone-800 text-stone-400 text-xs">
                  You haven&rsquo;t placed an acquisition order yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <div>
                  <h2 className="text-xl font-serif-luxury font-bold text-stone-100">
                    Saved Shipping Addresses
                  </h2>
                  <p className="text-xs text-stone-400">
                    Armored courier delivery destinations across UAE.
                  </p>
                </div>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="px-3.5 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddressSubmit} className="mb-6 p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    New Delivery Destination
                  </h3>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Street / Villa Address *</label>
                    <input
                      type="text"
                      required
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="e.g. Villa 12, Arabian Ranches"
                      className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">City / Emirate</label>
                      <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={newPostal}
                        onChange={(e) => setNewPostal(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Country</label>
                      <input
                        type="text"
                        value={newCountry}
                        onChange={(e) => setNewCountry(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 rounded bg-stone-800 text-stone-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-stone-100 text-xs flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {addr.city}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-300">{addr.street}</p>
                      <p className="text-xs text-stone-400">{addr.city}, {addr.country}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs mt-3">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-amber-400 hover:underline text-[11px]"
                        >
                          Make Default
                        </button>
                      ) : (
                        <span className="text-stone-500 text-[11px]">Primary Destination</span>
                      )}

                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-stone-500 hover:text-rose-400 p-1"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
