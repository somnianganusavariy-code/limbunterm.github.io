import React from 'react';
import { motion } from 'motion/react';
import { Smile, ThumbsUp, Star, Globe } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { InlineSectionEditBadge } from './cms/InlineSectionEditBadge';

export const MetricsSection: React.FC = () => {
  const { content } = useCms();

  const sectionConfig = content?.sections?.find(s => s.id === 'sec-metrics');
  if (sectionConfig && !sectionConfig.enabled) {
    return null;
  }

  const about = content?.about || {
    experienceYears: '5+',
    completedProjects: '100+',
    satisfiedClients: '50+',
    countriesServed: '10+'
  };

  const metrics = [
    {
      value: about.experienceYears,
      label: 'Years Experience',
      icon: Smile,
      desc: 'Senior Graphic Design'
    },
    {
      value: about.completedProjects,
      label: 'Projects Completed',
      icon: ThumbsUp,
      desc: 'Global Brands & Startups'
    },
    {
      value: about.satisfiedClients,
      label: 'Happy Clients',
      icon: Star,
      desc: 'Retained Partnerships'
    },
    {
      value: about.countriesServed,
      label: 'Countries Worked',
      icon: Globe,
      desc: 'International Scope'
    }
  ];

  return (
    <section id="about" className="py-10 sm:py-14 relative">
      <InlineSectionEditBadge sectionId="sec-metrics" sectionName="Metrics & Experience" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Warm Soft Container */}
        <div className="bg-[#FFF8F3] border border-orange-200/70 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-orange-200/60">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`flex flex-col items-center text-center p-3 ${index > 0 ? 'pt-6 sm:pt-3' : ''}`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-orange-100/90 text-[#EA580C] flex items-center justify-center mb-3 shadow-xs">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>

                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono tracking-tight">
                    {metric.value}
                  </span>

                  <span className="text-sm font-semibold text-zinc-800 mt-1">
                    {metric.label}
                  </span>

                  <span className="text-xs text-zinc-500 mt-0.5">
                    {metric.desc}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
