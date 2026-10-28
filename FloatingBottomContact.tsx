import React, { useState } from 'react';
import { Phone, ChevronUp, ChevronDown, MessageCircle } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { TelegramIcon, FacebookIcon, getTelegramUrl, getFacebookUrl, getPhoneUrl } from './SocialIcons';

export const FloatingBottomContact: React.FC = () => {
  const { content, currentView, isAdminLoggedIn } = useCms();
  const [isMinimized, setIsMinimized] = useState(false);

  // Only show on public portfolio view
  if (currentView !== 'portfolio') return null;

  const contact = content?.contact || {
    phone: '+855 12 345 678',
    telegram: 'https://t.me/limbunterm',
    facebook: 'https://facebook.com/limbunterm'
  };

  const telegramUrl = getTelegramUrl(contact.telegram);
  const facebookUrl = getFacebookUrl(contact.facebook);
  const phoneUrl = getPhoneUrl(contact.phone);

  const bottomPositionClass = isAdminLoggedIn 
    ? 'bottom-16 sm:bottom-16' 
    : 'bottom-4 sm:bottom-6';

  return (
    <div 
      className={`fixed ${bottomPositionClass} left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300`}
      role="region"
      aria-label="Direct Quick Contact Bar"
    >
      <div className="pointer-events-auto flex items-center bg-[#18181B]/95 backdrop-blur-md text-white rounded-full p-1.5 sm:p-2 border border-zinc-700/80 shadow-2xl transition-all">
        
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Expand contact shortcuts"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Contact Channels</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 pl-2 sm:pl-3 pr-1 hidden md:inline">
              Contact:
            </span>

            {/* Telegram Link */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-[#229ED9] text-zinc-200 hover:text-white text-xs font-semibold transition-all duration-200 group shadow-xs"
              title="Chat on Telegram"
            >
              <TelegramIcon className="w-3.5 h-3.5 text-[#229ED9] group-hover:text-white transition-colors" />
              <span>Telegram</span>
            </a>

            {/* Facebook Link */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-[#1877F2] text-zinc-200 hover:text-white text-xs font-semibold transition-all duration-200 group shadow-xs"
              title="Connect on Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2] group-hover:text-white transition-colors" />
              <span>Facebook</span>
            </a>

            {/* Phone Link */}
            <a
              href={phoneUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600/90 hover:bg-[#EA580C] text-white text-xs font-semibold transition-all duration-200 shadow-xs"
              title={`Call ${contact.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span className="hidden xs:inline">Call:</span>
              <span>{contact.phone}</span>
            </a>

            {/* Minimize toggle */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors ml-0.5 cursor-pointer"
              title="Minimize contact bar"
              aria-label="Minimize"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
