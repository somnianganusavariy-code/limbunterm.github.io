import React from 'react';
import { Mail, Phone, ArrowRight, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { TelegramIcon, FacebookIcon, getTelegramUrl, getFacebookUrl, getPhoneUrl } from './SocialIcons';
import { InlineSectionEditBadge } from './cms/InlineSectionEditBadge';

export const ContactSection: React.FC = () => {
  const { content, setIsContactModalOpen } = useCms();

  const sectionConfig = content?.sections?.find(s => s.id === 'sec-contact');
  if (sectionConfig && !sectionConfig.enabled) {
    return null;
  }

  const contact = content?.contact || {
    email: 'limbunterm17@gmail.com',
    phone: '+855 12 345 678',
    telegram: 'https://t.me/limbunterm',
    facebook: 'https://facebook.com/limbunterm',
    address: 'Phnom Penh & Worldwide Remote'
  };

  const telegramUrl = getTelegramUrl(contact.telegram);
  const facebookUrl = getFacebookUrl(contact.facebook);
  const phoneUrl = getPhoneUrl(contact.phone);

  const cleanTelegramHandle = contact.telegram 
    ? (contact.telegram.replace(/^https?:\/\/t\.me\//, '@').replace(/^@?/, '@')) 
    : '@limbunterm';

  return (
    <section id="contact" className="py-14 sm:py-20 border-t border-zinc-200/80 relative">
      <InlineSectionEditBadge sectionId="sec-contact" sectionName="Contact" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block">
              {sectionConfig?.badge || 'Contact & Inquiries'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight">
              {sectionConfig?.title || 'Ready to elevate your visual identity?'}
            </h2>
            <p className="text-zinc-600 text-base leading-relaxed max-w-xl">
              {sectionConfig?.subtitle || 'Whether you need end-to-end luxury packaging, brand identity guidelines, or editorial print direction, get in touch to discuss your timeline and vision.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Email */}
              <a 
                href={`mailto:${contact.email}`} 
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 hover:border-[#EA580C] transition-colors group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-zinc-400 block font-medium">Direct Email</span>
                  <span className="text-sm font-bold text-zinc-900 group-hover:text-[#EA580C] transition-colors truncate block">{contact.email}</span>
                </div>
              </a>

              {/* Phone */}
              <a 
                href={phoneUrl} 
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 hover:border-[#EA580C] transition-colors group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-zinc-400 block font-medium">Direct Phone</span>
                  <span className="text-sm font-bold text-zinc-900 group-hover:text-[#EA580C] transition-colors truncate block">{contact.phone}</span>
                </div>
              </a>

              {/* Telegram */}
              <a 
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 hover:border-[#229ED9] transition-colors group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#229ED9] flex items-center justify-center shrink-0">
                  <TelegramIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-medium">Telegram Channel</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#229ED9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <span className="text-sm font-bold text-zinc-900 group-hover:text-[#229ED9] transition-colors truncate block">{cleanTelegramHandle}</span>
                </div>
              </a>

              {/* Facebook */}
              <a 
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 hover:border-[#1877F2] transition-colors group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1877F2] flex items-center justify-center shrink-0">
                  <FacebookIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-medium">Facebook Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#1877F2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <span className="text-sm font-bold text-zinc-900 group-hover:text-[#1877F2] transition-colors truncate block">Direct Message</span>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-zinc-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-2">
                Fast-Track Project Brief
              </span>
              <h3 className="text-2xl font-bold text-white mb-3">
                Send a Project Request
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Fill out our guided client intake form with your project scope, budget bracket, and timeline to receive an itemized estimate.
              </p>
            </div>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className="w-full bg-[#EA580C] hover:bg-[#D94F04] text-white py-4 px-6 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 hover:scale-101 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Intake Form</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
