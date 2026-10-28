import React from 'react';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { TelegramIcon, FacebookIcon, getTelegramUrl, getFacebookUrl, getPhoneUrl } from './SocialIcons';
import { InlineSectionEditBadge } from './cms/InlineSectionEditBadge';

export const Footer: React.FC = () => {
  const { content, setCurrentView, setIsContactModalOpen, setSelectedServiceForInquiry } = useCms();

  const siteName = content?.settings?.siteName || 'LIM Bunterm';
  const contact = content?.contact || {
    email: 'limbunterm17@gmail.com',
    phone: '+855 12 345 678',
    telegram: 'https://t.me/limbunterm',
    facebook: 'https://facebook.com/limbunterm',
    address: 'Phnom Penh & Worldwide Remote'
  };

  const settings = content?.settings || {
    footerCopyright: '© 2026 LIM Bunterm. All rights reserved.',
    footerDisclaimer: 'Designing bold brands that make impact. Specializing in high-end brand identities, sensory packaging, and modern editorial systems.',
    privacyPolicy: 'All client data is encrypted and protected under non-disclosure agreements.',
    termsConditions: 'Standard international graphic design, licensing, and milestone delivery contract terms apply.',
    refundPolicy: 'Milestone-based signoffs with satisfaction guarantees.'
  };

  const handleLinkClick = (id: string) => {
    setCurrentView('portfolio');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const telegramUrl = getTelegramUrl(contact.telegram);
  const facebookUrl = getFacebookUrl(contact.facebook);
  const phoneUrl = getPhoneUrl(contact.phone);

  const cleanTelegramHandle = contact.telegram 
    ? (contact.telegram.replace(/^https?:\/\/t\.me\//, '@').replace(/^@?/, '@')) 
    : '@limbunterm';

  const cleanFacebookHandle = contact.facebook
    ? contact.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '')
    : 'limbunterm';

  return (
    <footer className="bg-[#121214] text-white pt-16 pb-12 border-t border-zinc-800 relative">
      <InlineSectionEditBadge sectionId="sec-contact" sectionName="Footer & Contact Channels" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Brand & Mission (cols 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <button
              onClick={() => {
                setCurrentView('portfolio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-2xl font-extrabold tracking-tight text-white font-sans hover:opacity-90 transition-opacity"
            >
              {siteName}<span className="text-[#EA580C]">.</span>
            </button>

            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              {settings.footerDisclaimer}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-zinc-400">
              {['X / Twitter', 'Instagram', 'LinkedIn', 'Behance', 'Dribbble'].map((platform, idx) => (
                <a
                  key={idx}
                  href={`#${platform.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); alert(`Visiting ${platform} profile: @${siteName.toLowerCase().replace(/\s+/g, '')}`); }}
                  className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-[#EA580C] hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
                  title={platform}
                >
                  {platform.substring(0, 2)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (cols 6-7) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-white transition-colors cursor-pointer">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors cursor-pointer">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('projects')} className="hover:text-white transition-colors cursor-pointer">
                  Work
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services (cols 8-9) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              {(content?.services || []).slice(0, 4).map(srv => (
                <li key={srv.id}>
                  <button 
                    onClick={() => {
                      setSelectedServiceForInquiry(srv.title);
                      setIsContactModalOpen(true);
                    }} 
                    className="hover:text-white transition-colors cursor-pointer text-left truncate block max-w-[150px]"
                  >
                    {srv.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (cols 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-sm text-zinc-400">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-[#EA580C] transition-colors">
                <Mail className="w-4 h-4 text-[#EA580C] shrink-0" />
                <span className="truncate">{contact.email}</span>
              </a>
              <a href={phoneUrl} className="flex items-center gap-2 hover:text-[#EA580C] transition-colors">
                <Phone className="w-4 h-4 text-[#EA580C] shrink-0" />
                <span>{contact.phone}</span>
              </a>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#229ED9] transition-colors">
                <TelegramIcon className="w-4 h-4 text-[#229ED9] shrink-0" />
                <span className="truncate">Telegram ({cleanTelegramHandle})</span>
              </a>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#1877F2] transition-colors">
                <FacebookIcon className="w-4 h-4 text-[#1877F2] shrink-0" />
                <span className="truncate">Facebook Profile</span>
              </a>
              <p className="text-xs text-zinc-500 pt-1">
                {contact.address}
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* CENTER OF BOTTOM: DEDICATED DIRECT CONTACT (TELEGRAM, FACEBOOK, PHONE) */}
        {/* ========================================================================= */}
        <div className="py-12 border-b border-zinc-800/80 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-4xl px-2 sm:px-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#EA580C] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
              Direct Quick Contact
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Connect Directly With Me
            </h3>
            
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto mb-8">
              Available for immediate messaging, project consulting, and direct voice calls across Telegram, Facebook, and Phone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              
              {/* Telegram Button */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center sm:flex-col sm:text-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-[#229ED9] hover:bg-[#229ED9]/10 transition-all duration-300 text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#229ED9]/15 text-[#229ED9] flex items-center justify-center shrink-0 group-hover:bg-[#229ED9] group-hover:text-white transition-colors duration-300 shadow-inner">
                  <TelegramIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1 sm:w-full">
                  <div className="flex items-center sm:justify-center gap-1.5 font-bold text-white text-sm group-hover:text-[#229ED9] transition-colors">
                    <span>Telegram</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#229ED9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-1">
                    {cleanTelegramHandle}
                  </p>
                  <span className="mt-2 hidden sm:inline-block text-[11px] font-semibold text-[#229ED9] bg-[#229ED9]/10 px-2.5 py-0.5 rounded-full">
                    Chat Now
                  </span>
                </div>
              </a>

              {/* Facebook Button */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center sm:flex-col sm:text-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-[#1877F2] hover:bg-[#1877F2]/10 transition-all duration-300 text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/15 text-[#1877F2] flex items-center justify-center shrink-0 group-hover:bg-[#1877F2] group-hover:text-white transition-colors duration-300 shadow-inner">
                  <FacebookIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1 sm:w-full">
                  <div className="flex items-center sm:justify-center gap-1.5 font-bold text-white text-sm group-hover:text-[#1877F2] transition-colors">
                    <span>Facebook</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#1877F2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-1">
                    {cleanFacebookHandle}
                  </p>
                  <span className="mt-2 hidden sm:inline-block text-[11px] font-semibold text-[#1877F2] bg-[#1877F2]/10 px-2.5 py-0.5 rounded-full">
                    Message Page
                  </span>
                </div>
              </a>

              {/* Phone Button */}
              <a
                href={phoneUrl}
                className="group relative flex items-center sm:flex-col sm:text-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-[#EA580C] hover:bg-[#EA580C]/10 transition-all duration-300 text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EA580C]/15 text-[#EA580C] flex items-center justify-center shrink-0 group-hover:bg-[#EA580C] group-hover:text-white transition-colors duration-300 shadow-inner">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1 sm:w-full">
                  <div className="flex items-center sm:justify-center gap-1.5 font-bold text-white text-sm group-hover:text-[#EA580C] transition-colors">
                    <span>Direct Phone</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#EA580C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-1">
                    {contact.phone}
                  </p>
                  <span className="mt-2 hidden sm:inline-block text-[11px] font-semibold text-[#EA580C] bg-[#EA580C]/10 px-2.5 py-0.5 rounded-full">
                    Call Directly
                  </span>
                </div>
              </a>

            </div>
          </div>
        </div>

        {/* Bottom Legal & Centered Quick Contact Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <p className="order-2 md:order-1 text-center md:text-left">
            {settings.footerCopyright}
          </p>

          {/* Centered Quick Contact Bar at bottom */}
          <div className="order-1 md:order-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-zinc-500 text-xs hidden sm:inline font-medium mr-1">Direct Contact:</span>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-[#229ED9] hover:text-white text-zinc-300 border border-zinc-700/60 transition-colors font-medium shadow-2xs"
            >
              <TelegramIcon className="w-3.5 h-3.5 text-[#229ED9]" />
              <span>Telegram</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-[#1877F2] hover:text-white text-zinc-300 border border-zinc-700/60 transition-colors font-medium shadow-2xs"
            >
              <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />
              <span>Facebook</span>
            </a>
            <a
              href={phoneUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-[#EA580C] hover:text-white text-zinc-300 border border-zinc-700/60 transition-colors font-medium shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>{contact.phone}</span>
            </a>
          </div>

          <div className="order-3 flex items-center justify-center gap-6">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert(`Privacy Policy: ${settings.privacyPolicy}`); }} className="hover:text-zinc-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert(`Terms & Conditions: ${settings.termsConditions}`); }} className="hover:text-zinc-400 transition-colors">
              Terms &amp; Conditions
            </a>
            <a href="#refund" onClick={(e) => { e.preventDefault(); alert(`Refund Policy: ${settings.refundPolicy}`); }} className="hover:text-zinc-400 transition-colors">
              Refund Policy
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
