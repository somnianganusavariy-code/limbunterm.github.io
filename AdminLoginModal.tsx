import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, KeyRound, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, setCurrentView, setCmsTab } = useCms();
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter both username/email and password.');
      return;
    }
    setError('');
    setLoading(true);
    const success = await login(identifier, password);
    setLoading(false);
    if (success) {
      setCurrentView('cms_dashboard');
      setCmsTab('overview');
    }
  };

  const fillDemo = () => {
    setIdentifier('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="fixed inset-0" onClick={() => setIsLoginModalOpen(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 bg-white text-zinc-900 rounded-[28px] max-w-md w-full shadow-2xl border border-zinc-200 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 sm:px-8 pt-8 pb-5 flex items-start justify-between border-b border-zinc-100 bg-zinc-50/60">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 text-[#EA580C] flex items-center justify-center shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] block">
                  Protected Admin Area
                </span>
                <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight">
                  Studio CMS Login
                </h3>
              </div>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <p className="text-xs text-zinc-500 leading-relaxed">
              Log in to access the comprehensive Content Management System to update website sections, products, media library, and contact channels.
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Admin Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="admin or email@domain.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Quick Demo Helper */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs">
              <div className="text-amber-900">
                <span className="font-bold">Default Credentials:</span>
                <span className="font-mono ml-1 text-amber-800">admin / admin123</span>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="text-[11px] font-bold text-[#EA580C] hover:underline"
              >
                Auto Fill
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold tracking-wide shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Enter Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
