import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ExternalLink, Building2 } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { InlineSectionEditBadge } from './cms/InlineSectionEditBadge';

export const TestimonialsSection: React.FC = () => {
  const { content } = useCms();

  const sectionConfig = content?.sections?.find(s => s.id === 'sec-testimonials');
  if (sectionConfig && !sectionConfig.enabled) {
    return null;
  }

  const brands = [...(content?.brands || [])]
    .filter(b => b.enabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="py-14 sm:py-20 bg-zinc-50/50 border-y border-zinc-200/60 relative">
      <InlineSectionEditBadge sectionId="sec-testimonials" sectionName="Clients & Testimonials" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block mb-2">
              {sectionConfig?.badge || 'Client Validation'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
              {sectionConfig?.title || 'Trusted by Global Clients'}<span className="text-[#EA580C]">.</span>
            </h2>
          </div>
          <p className="text-sm text-zinc-500 max-w-sm">
            {sectionConfig?.subtitle || 'Direct feedback from our brand partners across London, Zurich, and Tokyo.'}
          </p>
        </div>

        {/* Testimonials & Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {brands.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-orange-200" />
                </div>

                <p className="text-zinc-700 text-sm sm:text-base leading-relaxed italic mb-6">
                  &quot;{item.testimonialQuote || 'Exceptional craftsmanship and attention to detail. Highly recommended.'}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl object-contain bg-zinc-50 p-1 border border-zinc-200 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-orange-100 text-[#EA580C] font-extrabold text-xs flex items-center justify-center shrink-0 border border-orange-200">
                      {(item.authorName || item.name).substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-zinc-950 truncate">
                      {item.authorName || item.name}
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium truncate">
                      {item.authorRole || item.name}
                    </p>
                    {item.authorName && item.authorName !== item.name && (
                      <span className="text-[11px] text-[#EA580C] font-semibold block truncate">
                        {item.name}
                      </span>
                    )}
                  </div>
                </div>

                {item.websiteUrl && (
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-400 hover:text-[#EA580C] rounded-lg hover:bg-zinc-50 transition-colors"
                    title={`Visit ${item.name}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
