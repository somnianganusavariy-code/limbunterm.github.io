import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { InlineSectionEditBadge } from './cms/InlineSectionEditBadge';

export const CtaBanner: React.FC = () => {
  const { content, setIsContactModalOpen } = useCms();

  const sectionConfig = content?.sections?.find(s => s.id === 'sec-cta');
  if (sectionConfig && !sectionConfig.enabled) {
    return null;
  }

  const cta = content?.cta || {
    badge: "Let's Work Together",
    title: "Have a project in mind? Let's create something bold.",
    subtitle: "Currently accepting selected brand identity, editorial design, and packaging commissions for upcoming quarters.",
    buttonText: "Let's Discuss Your Project",
    buttonLink: "#contact"
  };

  return (
    <section className="py-12 sm:py-16 relative">
      <InlineSectionEditBadge sectionId="sec-cta" sectionName="CTA Banner" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Vibrant Orange Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#EA580C] text-white rounded-[32px] p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8"
        >
          {/* Background graphical circle rings */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full border border-white/15 pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />

          {/* Left Content */}
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-100 block">
              {cta.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {cta.title}
            </h2>
            <p className="text-orange-100/90 text-sm sm:text-base font-normal max-w-lg pt-1">
              {cta.subtitle}
            </p>
          </div>

          {/* Right Action Button & Response Indicator */}
          <div className="relative z-10 flex flex-col sm:items-start lg:items-end gap-3 shrink-0">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="inline-flex items-center justify-center gap-3 bg-[#18181B] hover:bg-black text-white px-7 py-4 rounded-full text-sm sm:text-base font-bold shadow-xl transition-all hover:scale-103 active:scale-98 cursor-pointer"
            >
              <span>{cta.buttonText}</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </div>
            </button>

            <div className="flex items-center gap-2 text-xs text-orange-100 font-medium px-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Usually replies within 24 hours</span>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
