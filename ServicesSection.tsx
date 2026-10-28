import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, Globe, Sparkles, PenTool, ArrowUpRight, Check, X, ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { CmsService } from '../types/cms';
import { InlineSectionEditBadge } from './cms/InlineSectionEditBadge';

export const ServicesSection: React.FC = () => {
  const { content, setIsContactModalOpen, setSelectedServiceForInquiry } = useCms();
  const [activeModalService, setActiveModalService] = useState<CmsService | null>(null);

  const sectionConfig = content?.sections?.find(s => s.id === 'sec-services');
  if (sectionConfig && !sectionConfig.enabled) {
    return null;
  }

  const services = [...(content?.services || [])]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .filter(s => s.enabled);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-5 h-5 text-white" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-white" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-white" />;
      default:
        return <Sparkles className="w-5 h-5 text-white" />;
    }
  };

  const handleOpenContact = (serviceTitle: string) => {
    setSelectedServiceForInquiry(serviceTitle);
    setIsContactModalOpen(true);
    setActiveModalService(null);
  };

  return (
    <section id="services" className="py-12 sm:py-16 relative">
      <InlineSectionEditBadge sectionId="sec-services" sectionName="Services" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek Dark Rounded Container */}
        <div className="bg-[#141416] text-white rounded-[32px] p-6 sm:p-10 lg:p-14 shadow-2xl border border-zinc-800 relative overflow-hidden">
          
          {/* Subtle ambient light gradient */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-zinc-800/80">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block mb-2">
                {sectionConfig?.badge || 'Services'}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                {sectionConfig?.title || 'What I Do'}<span className="text-[#EA580C]">.</span>
              </h2>
            </div>
            <div className="flex items-center gap-3 text-zinc-400 text-sm max-w-sm">
              <p className="leading-relaxed">
                {sectionConfig?.subtitle || 'Design solutions that are user-focused, strategy-driven and visually powerful.'}
              </p>
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Service Grid from CMS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative bg-[#1E1E22] hover:bg-[#25252A] p-6 sm:p-7 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-[#EA580C] transition-colors duration-300">
                      {getServiceIcon(service.iconName)}
                    </div>

                    <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200">
                      From {service.startingPrice}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#EA580C] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1 group/btn cursor-pointer"
                  >
                    <span>View Scope</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleOpenContact(service.title)}
                    className="text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer"
                  >
                    Request Quote
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Scope Details Modal */}
      <AnimatePresence>
        {activeModalService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setActiveModalService(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-zinc-900 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-zinc-800 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EA580C] flex items-center justify-center">
                    {getServiceIcon(activeModalService.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{activeModalService.title}</h3>
                    <span className="text-xs text-[#EA580C] font-semibold">Starting at {activeModalService.startingPrice}</span>
                  </div>
                </div>
                <button onClick={() => setActiveModalService(null)} className="p-2 text-zinc-400 hover:text-white rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {activeModalService.description}
                </p>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Deliverables &amp; Inclusions
                  </h4>
                  <ul className="space-y-2">
                    {activeModalService.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-[#EA580C] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveModalService(null)}
                  className="px-4 py-2 rounded-full border border-zinc-700 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  Close
                </button>
                <button
                  onClick={() => handleOpenContact(activeModalService.title)}
                  className="px-6 py-2.5 rounded-full bg-[#EA580C] text-white text-xs font-bold shadow hover:bg-[#D94F04] transition-colors"
                >
                  Book This Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
