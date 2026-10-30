import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Gem,
  ShoppingBag,
  TrendingUp,
  Users,
  Tag,
  Star,
  Mail,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { adminSession, isAdminAuthenticated, adminLogout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected route check
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: Gem },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Gold Rates', path: '/admin/gold-rates', icon: TrendingUp },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-stone-900 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <span className="font-display font-bold text-sm tracking-widest text-amber-400">
            DUBAI GOLD ADMIN
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded text-stone-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-stone-900/95 border-r border-stone-800 flex flex-col justify-between shrink-0 z-30`}
      >
        <div>
          {/* Admin Header Brand */}
          <div className="p-6 border-b border-stone-800/80 hidden md:block">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] tracking-widest font-bold uppercase text-amber-500">
                Showroom Operations
              </span>
            </div>
            <h1 className="font-display font-bold text-base tracking-wider text-stone-100 uppercase">
              Dubai Gold &amp; Jewellers
            </h1>
            <p className="text-[11px] text-stone-400 mt-1">Management Portal v1.0</p>
          </div>

          {/* Links list */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User info & exit actions */}
        <div className="p-4 border-t border-stone-800/80 bg-stone-950/40">
          <div className="mb-3 px-2">
            <div className="text-xs font-semibold text-stone-200">
              {adminSession?.username || 'Showroom Executive'}
            </div>
            <div className="text-[10px] text-stone-500 uppercase tracking-wider">
              {adminSession?.role || 'Administrator'}
            </div>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded text-xs text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Customer Store</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-rose-400 hover:bg-stone-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-stone-950 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
