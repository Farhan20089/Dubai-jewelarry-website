import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsLoading(true);
    const res = await register(name, email, phone, password);
    setIsLoading(false);

    if (res.success) {
      showToast('Account created successfully! Welcome to Dubai Gold & Jewellers.', 'success');
      navigate('/account');
    } else {
      showToast(res.error || 'Failed to create account', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-950">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="font-display font-bold text-lg tracking-widest uppercase gold-text-gradient block">
            DUBAI GOLD &amp; JEWELLERS
          </span>
          <h1 className="text-2xl font-serif-luxury font-bold text-stone-100 mt-2 mb-1">
            Create Patron Account
          </h1>
          <p className="text-xs text-stone-400">
            Enjoy complimentary hallmark tracking, private previews, and express checkout.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
              Full Legal Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Mansour"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. tariq@outlook.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
              Mobile Phone (WhatsApp) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-400 mb-1">
              Password
            </label>
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

          <div className="flex items-center gap-2 text-[11px] text-stone-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Saved securely in your browser demo vault.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-lg flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-50"
          >
            <span>{isLoading ? 'Creating...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-800 text-center text-xs text-stone-400">
          <span>Already registered? </span>
          <Link to="/login" className="text-amber-400 hover:underline font-semibold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
