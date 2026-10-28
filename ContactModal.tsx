import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export const ContactModal: React.FC = () => {
  const { 
    isContactModalOpen, 
    setIsContactModalOpen, 
    selectedServiceForInquiry, 
    submitClientInquiry, 
    content 
  } = useCms();

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState(selectedServiceForInquiry || 'Brand Identity');
  const [budget, setBudget] = useState('$5k - $10k');
  const [timeline, setTimeline] = useState('3 - 4 weeks');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedServiceForInquiry) {
      setService(selectedServiceForInquiry);
    }
  }, [selectedServiceForInquiry]);

  if (!isContactModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await submitClientInquiry({
        clientName,
        email,
        company,
        service,
        budget,
        timeline,
        message: message || 'Interested in starting a new design engagement.'
      });

      const generatedRef = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferenceId(generatedRef);
      setIsSubmitted(true);
    } catch {
      // error toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsContactModalOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
    }, 300);
  };

  const contact = content?.contact || {
    email: 'limbunterm17@gmail.com',
    phone: '+855 12 345 678',
    address: 'Phnom Penh & Worldwide Remote',
    workingHours: 'Mon - Fri: 09:00 - 18:00 (GMT+7)'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="fixed inset-0" onClick={handleClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 bg-white text-zinc-900 rounded-[28px] max-w-2xl w-full shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-100 bg-zinc-50/80 shrink-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                Project Intake
              </span>
              <h3 className="text-xl font-extrabold text-zinc-950">
                Start a Design Engagement
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 sm:p-8">
            {isSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-2xl font-extrabold text-zinc-950">
                  Brief Submitted Successfully!
                </h4>
                <p className="text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-zinc-900">{clientName}</strong>. Your project brief has been logged in our studio management portal.
                </p>
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 inline-block text-left text-xs space-y-1">
                  <div><strong>Reference ID:</strong> <span className="font-mono text-[#EA580C]">{referenceId}</span></div>
                  <div><strong>Service:</strong> {service}</div>
                  <div><strong>Budget:</strong> {budget}</div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
                  >
                    Return to Portfolio
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="text-xs text-zinc-500">
                  Fill in your project requirements below to receive an itemized proposal and production timeline.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="e.g. Atelier Goods"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Primary Service Focus
                    </label>
                    <select
                      value={service}
                      onChange={e => setService(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] bg-white"
                    >
                      {(content?.services || []).map(s => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                      <option value="General Brand Consulting">General Brand Consulting</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Budget Bracket
                    </label>
                    <select
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] bg-white"
                    >
                      <option value="$2k - $5k">$2,000 - $5,000</option>
                      <option value="$5k - $10k">$5,000 - $10,000</option>
                      <option value="$10k - $25k">$10,000 - $25,000</option>
                      <option value="$25k+">$25,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Target Delivery
                    </label>
                    <select
                      value={timeline}
                      onChange={e => setTimeline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] bg-white"
                    >
                      <option value="Within 2 weeks">Within 2 weeks (Rush)</option>
                      <option value="3 - 4 weeks">3 - 4 weeks (Standard)</option>
                      <option value="1 - 2 months">1 - 2 months</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Project Scope &amp; Details
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us about your brand vision, target market, deliverables, or inspiration..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] text-zinc-400">
                    Direct reply to {contact.email}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Brief...' : 'Submit Project Brief'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
