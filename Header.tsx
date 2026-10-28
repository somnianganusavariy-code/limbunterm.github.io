import React, { useState } from 'react';
import { ArrowUpRight, Menu, X, LayoutDashboard, Share2, Check, Lock, Unlock, ShieldCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export const Header: React.FC = () => {
  const { 
    content,
    currentView, 
    setCurrentView, 
    isAdminLoggedIn, 
    setIsLoginModalOpen,
    setIsContactModalOpen,
    inquiries
  } = useCms();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const siteName = content?.settings?.siteName || 'LIM Bunterm';
  const navigationItems = (content?.navigation || []).filter(item => item.enabled);
  const unreadCount = inquiries.filter(i => i.status === 'New').length;

  const handleNavClick = (target: string) => {
    if (target.startsWith('#')) {
      const id = target.substring(1);
      if (currentView !== 'portfolio') {
        setCurrentView('portfolio');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(target, '_blank');
    }
    setMobileMenuOpen(false);
  };

  const handleAdminDashboardClick = () => {
    if (isAdminLoggedIn) {
      setCurrentView(currentView === 'portfolio' ? 'cms_dashboard' : 'portfolio');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const copyViewOnlyLink = () => {
    const origin = window.location.origin;
    const viewOnlyUrl = `${origin}?readonly=true`;
    navigator.clipboard.writeText(viewOnlyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBFBFA]/90 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6 sm:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setCurrentView('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl font-extrabold tracking-tight text-zinc-900 font-sans hover:opacity-90 transition-opacity flex items-center"
          >
            {siteName}<span className="text-[#EA580C]">.</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links from CMS */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.target)}
              className="transition-colors whitespace-nowrap hover:text-zinc-950 font-medium"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Share View-Only Link Button */}
          <button
            onClick={copyViewOnlyLink}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-all shadow-2xs"
            title="Copy shareable link for clients (View-Only)"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>Share View-Only</span>
              </>
            )}
          </button>

          {/* Admin CMS / Studio Dashboard Button */}
          <button
            onClick={handleAdminDashboardClick}
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-full border transition-all ${
              currentView === 'cms_dashboard'
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : isAdminLoggedIn
                  ? 'bg-orange-50 text-[#EA580C] border-orange-200 hover:bg-orange-100'
                  : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
            }`}
            title={isAdminLoggedIn ? "Open Studio CMS Dashboard (Admin)" : "Admin CMS Login"}
          >
            {isAdminLoggedIn ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span className="whitespace-nowrap">
              {currentView === 'cms_dashboard' 
                ? 'Back to Website' 
                : isAdminLoggedIn 
                  ? 'Studio Dashboard' 
                  : 'Admin Login'}
            </span>
            {unreadCount > 0 && currentView !== 'cms_dashboard' && (
              <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
            )}
          </button>

          {/* Primary CTA: "Let's Talk ->" */}
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-[#D94F04] text-white px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span className="whitespace-nowrap">Let&apos;s Talk</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-700 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-[#FBFBFA] px-6 py-5 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-3 text-base font-medium text-zinc-800">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.target)}
                className="text-left py-2 hover:text-[#EA580C] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-200 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleAdminDashboardClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-300 bg-white text-zinc-800 text-sm font-semibold"
            >
              {isAdminLoggedIn ? <ShieldCheck className="w-4 h-4 text-[#EA580C]" /> : <Lock className="w-4 h-4 text-zinc-500" />}
              <span>{currentView === 'cms_dashboard' ? 'Back to Website' : isAdminLoggedIn ? 'Studio CMS Dashboard' : 'Admin Login'}</span>
            </button>

            <button
              onClick={() => {
                setIsContactModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#EA580C] text-white text-sm font-semibold shadow"
            >
              <span>Let&apos;s Discuss Your Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
