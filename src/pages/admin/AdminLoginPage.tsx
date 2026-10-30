import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEMO_ADMIN_CONFIG } from '../../data/seedData';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin, isAdminAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect
  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await adminLogin(email, password);
    setIsLoading(false);

    if (res.success) {
      showToast('Admin session authorized.', 'success');
      navigate('/admin');
    } else {
      showToast(res.error || 'Invalid admin credentials', 'error');
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_ADMIN_CONFIG.email);
    setPassword(DEMO_ADMIN_CONFIG.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-950">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-500">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 block mb-1">
            Showroom Vault Control
          </span>
          <h1 className="text-2xl font-serif-luxury font-bold text-stone-100">
            Admin Staff Authentication
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Sign in to manage inventory, gold fixings, customer orders, and coupons.
          </p>
        </div>

        {/* 1-Click Demo Fill Pill */}
        <div className="mb-6 p-3 rounded-lg bg-stone-950 border border-amber-600/30 text-xs text-stone-300">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" /> Demo Admin Access
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold"
            >
              Fill Credentials
            </button>
          </div>
          <div className="text-[11px] text-stone-400 font-mono">
            Email: {DEMO_ADMIN_CONFIG.email} <br />
            Password: {DEMO_ADMIN_CONFIG.password}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dubaigold.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-lg flex items-center justify-center gap-2 transition-all mt-6"
          >
            <span>{isLoading ? 'Authenticating...' : 'Enter Admin Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-800 text-center text-xs text-stone-500">
          <Link to="/" className="text-stone-400 hover:text-amber-400 transition-colors">
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
