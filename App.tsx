import React from 'react';
import { CmsProvider, useCms } from './context/CmsContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { MetricsSection } from './components/MetricsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CtaBanner } from './components/CtaBanner';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectLightboxModal } from './components/ProjectLightboxModal';
import { ContactModal } from './components/ContactModal';
import { FloatingBottomContact } from './components/FloatingBottomContact';
import { CmsDashboard } from './components/cms/CmsDashboard';
import { AdminLoginModal } from './components/cms/AdminLoginModal';
import { MediaLibraryModal } from './components/cms/MediaLibraryModal';
import { ToastContainer } from './components/cms/ToastContainer';
import { PublishBar } from './components/cms/PublishBar';

const PortfolioMain: React.FC = () => {
  const { currentView, content, isLoading } = useCms();

  if (isLoading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#EA580C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-zinc-600">Connecting to CMS Engine...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'cms_dashboard') {
    return <CmsDashboard />;
  }

  // Sort sections by dynamic order from CMS database
  const sortedSections = [...(content.sections || [])].sort((a, b) => a.order - b.order);

  const renderSection = (section: (typeof sortedSections)[0]) => {
    if (!section.enabled) return null;

    switch (section.type) {
      case 'hero':
        return <Hero key={section.id} />;
      case 'services':
        return <ServicesSection key={section.id} />;
      case 'projects':
        return <ProjectsSection key={section.id} />;
      case 'metrics':
        return <MetricsSection key={section.id} />;
      case 'testimonials':
        return <TestimonialsSection key={section.id} />;
      case 'cta':
        return <CtaBanner key={section.id} />;
      case 'contact':
        return <ContactSection key={section.id} />;
      case 'custom':
        return (
          <section key={section.id} className="py-14 sm:py-20 border-t border-zinc-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                {section.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950">
                {section.title}
              </h2>
              <p className="text-sm text-zinc-600 max-w-xl mx-auto">
                {section.subtitle}
              </p>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#1E1E1E]">
      <Header />
      
      <main className="flex-1">
        {sortedSections.map(sec => renderSection(sec))}
      </main>

      <Footer />

      {/* Floating Bottom Contact Bar */}
      <FloatingBottomContact />

      {/* Interactive Modals */}
      <ProjectLightboxModal />
      <ContactModal />
      <AdminLoginModal />
      <MediaLibraryModal />
      <ToastContainer />
      <PublishBar />
    </div>
  );
};

export default function App() {
  return (
    <CmsProvider>
      <PortfolioMain />
    </CmsProvider>
  );
}
