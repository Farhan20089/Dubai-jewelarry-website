import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      showToast('Logged in successfully.', 'success');
      navigate('/account');
    } else {
      showToast(res.error || 'Failed to login', 'error');
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    await login('fatima.h@gmail.com', 'password123');
    setIsLoading(false);
    showToast('Logged in as Fatima Al-Hashimi (Demo VIP Customer)', 'success');
    navigate('/account');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-950">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="font-display font-bold text-lg tracking-widest uppercase gold-text-gradient block">
            DUBAI GOLD &amp; JEWELLERS
          </span>
          <h1 className="text-2xl font-serif-luxury font-bold text-stone-100 mt-2 mb-1">
            Sign In to Your Vault
          </h1>
          <p className="text-xs text-stone-400">
            Access your order tracking, bespoke commissions, and saved addresses.
          </p>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="mb-6 p-3 rounded-lg bg-stone-950 border border-amber-600/30 text-[11px] text-stone-400 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong>Demo Authentication Notice:</strong> This application uses browser LocalStorage as its demo database. No real passwords or sensitive credentials are transmitted over external networks.
          </span>
        </div>

        {/* 1-Click Quick Demo Login Button */}
        <button
          onClick={handleQuickDemoLogin}
          type="button"
          className="w-full mb-6 py-2.5 px-4 rounded-lg bg-stone-950 hover:bg-stone-800 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>1-Click VIP Demo Login (Fatima Al-Hashimi)</span>
        </button>

        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-800" />
          </div>
          <span className="relative px-3 bg-stone-900 text-[10px] uppercase font-bold text-stone-500">
            Or sign in with email
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. fatima.h@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold uppercase text-stone-400">Password</label>
              <span className="text-[11px] text-stone-500 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
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
            className="w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-lg flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-800 text-center text-xs text-stone-400">
          <span>New patron? </span>
          <Link to="/register" className="text-amber-400 hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
