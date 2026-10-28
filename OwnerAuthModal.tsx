import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, KeyRound, Shield, Check, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const OwnerAuthModal: React.FC = () => {
  const { 
    isPinModalOpen, 
    setIsPinModalOpen, 
    unlockOwnerMode, 
    ownerPin, 
    setOwnerPin,
    isOwnerMode,
    lockOwnerMode,
    setCurrentView
  } = usePortfolio();

  const [inputPin, setInputPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);
  const [newPin, setNewPin] = useState('');

  if (!isPinModalOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = unlockOwnerMode(inputPin);
    if (success) {
      setInputPin('');
      setCurrentView('dashboard');
    } else {
      setErrorMsg('Incorrect PIN. The default studio PIN is 1234.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      setOwnerPin(newPin.trim());
      setShowChangePin(false);
      setNewPin('');
      alert('Studio PIN successfully updated!');
    } else {
      alert('Please enter at least 4 digits/characters for your PIN.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <div className="fixed inset-0" onClick={() => setIsPinModalOpen(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 bg-white text-zinc-900 rounded-[28px] max-w-md w-full shadow-2xl border border-zinc-200 overflow-hidden p-6 sm:p-8"
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                  Studio Security
                </span>
                <h3 className="text-lg font-bold text-zinc-950">
                  {isOwnerMode ? 'Studio Mode Active' : 'Owner Verification'}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setIsPinModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-5 space-y-4">
            {isOwnerMode ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Owner Editing Access Unlocked
                  </p>
                  <p className="text-zinc-600">
                    You have full permission to upload images, edit projects, change studio copy, and manage lead inquiries.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      lockOwnerMode();
                      setIsPinModalOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    Lock Studio (Switch to View-Only Mode)
                  </button>

                  <button
                    onClick={() => setShowChangePin(!showChangePin)}
                    className="w-full text-center text-xs text-[#EA580C] hover:underline font-medium py-1"
                  >
                    {showChangePin ? 'Hide PIN change' : 'Change Studio PIN'}
                  </button>

                  {showChangePin && (
                    <form onSubmit={handleChangePin} className="pt-2 flex items-center gap-2">
                      <input
                        type="password"
                        placeholder="New PIN (min 4 chars)"
                        value={newPin}
                        onChange={e => setNewPin(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-300 outline-none focus:border-[#EA580C]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-semibold bg-[#EA580C] text-white rounded-lg"
                      >
                        Save
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleUnlock} className="space-y-4">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Enter your studio passcode to access the management dashboard, upload new project images, and edit portfolio details.
                </p>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Studio PIN
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      autoFocus
                      required
                      placeholder="Default PIN: 1234"
                      value={inputPin}
                      onChange={e => setInputPin(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] text-sm outline-none font-mono tracking-widest"
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMsg}</span>
                    </p>
                  )}
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-700">Quick tip:</span> Default passcode is <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-900 font-bold">1234</code>. Public visitors without this PIN only have view-only access.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#EA580C] hover:bg-[#D94F04] text-white rounded-full font-bold text-sm shadow-sm transition-all"
                >
                  Unlock Studio Dashboard
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
