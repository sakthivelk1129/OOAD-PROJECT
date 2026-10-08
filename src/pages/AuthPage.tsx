import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  UtensilsCrossed,
  User,
  ChefHat,
  Bike,
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AuthPage: React.FC<{ isRegister?: boolean }> = ({ isRegister = false }) => {
  const { switchRole, navigate, users, updateUserProfile, showToast } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(isRegister);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (isRegisterMode) {
      showToast(`Account registered as ${role.toUpperCase()}: ${name}`);
      switchRole(role);
      updateUserProfile({ name: name || 'New User', email, phone, role });
    } else {
      // Find matching user or fallback to role
      const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        switchRole(matched.role, matched.id);
      } else {
        switchRole(role);
      }
    }
  };

  const handleQuickLogin = (targetRole: UserRole, emailHint: string) => {
    switchRole(targetRole);
    if (targetRole === 'customer') navigate('/');
    else if (targetRole === 'restaurant') navigate('/restaurant-dashboard');
    else if (targetRole === 'delivery') navigate('/delivery-dashboard');
    else if (targetRole === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-500/25">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            {isRegisterMode ? 'Create a QuickBite Account' : 'Welcome back to QuickBite'}
          </h1>
          <p className="text-xs text-zinc-500">
            {isRegisterMode
              ? 'Join as a customer, restaurant partner, or delivery partner'
              : 'Sign in to access your orders, dashboard, and settings'}
          </p>
        </div>

        {/* 1-Click Fast Evaluator Demo Logins */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-orange-200/80 p-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Instant Demo 1-Click Access</span>
          </div>
          <p className="text-[11px] text-orange-800">
            Select any role to test the live user experience immediately:
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer', 'alex@example.com')}
              className="p-2.5 rounded-xl bg-white border border-orange-200/80 hover:border-orange-400 hover:shadow-xs transition-all text-left flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-zinc-900 group-hover:text-orange-600 truncate">Customer</p>
                <p className="text-[10px] text-zinc-400 truncate">Alex Rivera</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('restaurant', 'marco@bellanapoli.com')}
              className="p-2.5 rounded-xl bg-white border border-orange-200/80 hover:border-orange-400 hover:shadow-xs transition-all text-left flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <ChefHat className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-zinc-900 group-hover:text-amber-600 truncate">Restaurant</p>
                <p className="text-[10px] text-zinc-400 truncate">Chef Marco</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('delivery', 'rajesh@fleet.com')}
              className="p-2.5 rounded-xl bg-white border border-orange-200/80 hover:border-orange-400 hover:shadow-xs transition-all text-left flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Bike className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-zinc-900 group-hover:text-emerald-600 truncate">Delivery</p>
                <p className="text-[10px] text-zinc-400 truncate">Rajesh Rider</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin@quickbite.io')}
              className="p-2.5 rounded-xl bg-white border border-orange-200/80 hover:border-orange-400 hover:shadow-xs transition-all text-left flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-zinc-900 group-hover:text-indigo-600 truncate">Admin</p>
                <p className="text-[10px] text-zinc-400 truncate">Elena Operations</p>
              </div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Select Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['customer', 'restaurant', 'delivery', 'admin'] as const).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={`px-3 py-2 text-xs rounded-xl font-bold capitalize transition-colors ${
                          role === r
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Full Name / Entity Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 555-019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>{isRegisterMode ? 'Register Account' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-zinc-500 border-t border-zinc-100">
            {isRegisterMode ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegisterMode(false)}
                  className="font-bold text-orange-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setIsRegisterMode(true)}
                  className="font-bold text-orange-600 hover:underline"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
