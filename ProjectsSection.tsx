import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Eye, 
  Sparkles, 
  LayoutGrid, 
  Grid3X3, 
  Columns2, 
  Layers
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { CmsProduct, ProjectLayoutType } from '../types/cms';
import { InlineSectionEditBadge } from './cms/InlineSectionEditBadge';

export const ProjectsSection: React.FC = () => {
  const { content, setSelectedProductForDetail } = useCms();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const sectionConfig = content?.sections?.find(s => s.id === 'sec-projects');
  if (sectionConfig && !sectionConfig.enabled) {
    return null;
  }

  const allProducts = (content?.products || [])
    .filter(p => p.enabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Dynamic categories from CMS database
  const activeCategories = (content?.categories || [])
    .filter(c => c.enabled)
    .sort((a, b) => a.order - b.order);

  // If no categories configured, fallback to standard
  const categoryTabs = activeCategories.length > 0 
    ? activeCategories.map(c => c.name)
    : ['All', 'Brand Identity', 'Packaging', 'Graphic Design', 'Editorial', 'UI/UX'];

  const filteredProjects = allProducts.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  const handleCardClick = (product: CmsProduct) => {
    setSelectedProductForDetail(product);
  };

  const currentLayout: ProjectLayoutType = content?.projectDisplayLayout || 'showcase';

  return (
    <section id="projects" className="py-14 sm:py-20 relative">
      <InlineSectionEditBadge sectionId="sec-projects" sectionName="Projects & Works" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block mb-2">
              {sectionConfig?.badge || 'Featured Work'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
              {sectionConfig?.title || 'Selected Projects'}<span className="text-[#EA580C]">.</span>
            </h2>
            {sectionConfig?.subtitle && (
              <p className="text-sm text-zinc-500 mt-2 max-w-xl">
                {sectionConfig.subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Dynamic Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-100 rounded-full border border-zinc-200/80 overflow-x-auto">
              {categoryTabs.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    activeCategory === category
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Project Display Layouts */}
        {displayedProjects.length === 0 ? (
          <div className="py-16 text-center bg-zinc-50 rounded-3xl border border-zinc-200">
            <Layers className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-zinc-800">No projects found in this category</h3>
            <p className="text-xs text-zinc-500 mt-1">Select "All" or another category tab above</p>
          </div>
        ) : (
          <>
            {/* LAYOUT 1: SHOWCASE (Editorial Alternating Split) */}
            {currentLayout === 'showcase' && (
              <div className="space-y-12 sm:space-y-16">
                <AnimatePresence mode="popLayout">
                  {displayedProjects.map((project, index) => {
                    const isEven = index % 2 === 1;

                    return (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        className="group relative rounded-3xl overflow-hidden bg-white border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-500"
                      >
                        <div className={`grid grid-cols-1 lg:grid-cols-12 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                          
                          {/* Visual Media Column */}
                          <div 
                            className={`lg:col-span-7 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[460px] overflow-hidden bg-zinc-100 relative cursor-pointer ${
                              isEven ? 'lg:order-2' : 'lg:order-1'
                            }`}
                            onClick={() => handleCardClick(project)}
                          >
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                              loading="lazy"
                            />

                            {/* Ambient Gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-zinc-900 text-xs font-bold shadow-lg">
                                <Eye className="w-4 h-4 text-[#EA580C]" />
                                <span>Inspect Full Case Study &amp; Gallery</span>
                              </span>
                            </div>

                            {project.featured && (
                              <div className="absolute top-4 left-4 z-10">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 text-white text-[11px] font-bold tracking-wide backdrop-blur-md border border-zinc-700/60 shadow">
                                  <Sparkles className="w-3 h-3 text-[#EA580C]" />
                                  <span>Featured Showcase</span>
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Metadata & Narrative Column */}
                          <div className={`lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between ${
                            isEven ? 'lg:order-1' : 'lg:order-2'
                          }`}>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                                <span>{project.category}</span>
                                <span className="font-mono">{project.year}</span>
                              </div>

                              <h3 
                                onClick={() => handleCardClick(project)}
                                className="text-2xl sm:text-3xl font-extrabold text-zinc-950 group-hover:text-[#EA580C] transition-colors cursor-pointer leading-tight"
                              >
                                {project.title}
                              </h3>

                              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                                {project.summary}
                              </p>

                              {/* Deliverables Tags */}
                              {project.deliverables && project.deliverables.length > 0 && (
                                <div className="pt-2">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                                    Deliverables &amp; Formats
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {project.deliverables.slice(0, 3).map((del, dIdx) => (
                                      <span
                                        key={dIdx}
                                        className="text-xs font-semibold px-3 py-1 rounded-lg bg-zinc-100 text-zinc-700"
                                      >
                                        {del}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Card Footer: Client & Action */}
                            <div className="pt-6 sm:pt-8 mt-6 border-t border-zinc-100 flex items-center justify-between">
                              <div>
                                <span className="text-[11px] text-zinc-400 block font-medium">Client / Partner</span>
                                <span className="text-sm font-bold text-zinc-900">{project.client}</span>
                              </div>

                              <button
                                onClick={() => handleCardClick(project)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-100 hover:bg-[#EA580C] text-zinc-900 hover:text-white transition-all text-xs font-bold cursor-pointer group/btn"
                              >
                                <span>Case Details</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              </button>
                            </div>

                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* LAYOUT 2: GRID 2-COLUMN */}
            {currentLayout === 'grid-2' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <AnimatePresence mode="popLayout">
                  {displayedProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      className="group bg-white rounded-3xl overflow-hidden border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div 
                        className="aspect-[16/10] bg-zinc-100 relative overflow-hidden cursor-pointer"
                        onClick={() => handleCardClick(project)}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-zinc-900 text-xs font-bold shadow">
                            <Eye className="w-3.5 h-3.5 text-[#EA580C]" /> View Case Study
                          </span>
                        </div>
                        {project.featured && (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-zinc-900/90 text-white text-[10px] font-bold tracking-wide backdrop-blur-md">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold uppercase text-zinc-400 mb-1">
                            <span>{project.category}</span>
                            <span className="font-mono">{project.year}</span>
                          </div>
                          <h3 
                            onClick={() => handleCardClick(project)}
                            className="text-xl font-extrabold text-zinc-950 group-hover:text-[#EA580C] transition-colors cursor-pointer"
                          >
                            {project.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 mt-1.5">
                            {project.summary}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-800">{project.client}</span>
                          <button
                            onClick={() => handleCardClick(project)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:underline"
                          >
                            <span>Explore</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* LAYOUT 3: GRID 3-COLUMN */}
            {currentLayout === 'grid-3' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {displayedProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div 
                        className="aspect-[4/3] bg-zinc-100 relative overflow-hidden cursor-pointer"
                        onClick={() => handleCardClick(project)}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {project.featured && (
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#EA580C] text-white text-[10px] font-bold shadow-xs">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                            <span>{project.category}</span>
                            <span>{project.year}</span>
                          </div>
                          <h4 
                            onClick={() => handleCardClick(project)}
                            className="text-base font-bold text-zinc-950 group-hover:text-[#EA580C] transition-colors cursor-pointer truncate mt-1"
                          >
                            {project.title}
                          </h4>
                          <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
                            {project.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                          <span className="text-zinc-600 truncate max-w-[140px]">{project.client}</span>
                          <button
                            onClick={() => handleCardClick(project)}
                            className="text-[#EA580C] font-bold hover:underline"
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* LAYOUT 4: MASONRY STYLE */}
            {currentLayout === 'masonry' && (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                <AnimatePresence mode="popLayout">
                  {displayedProjects.map((project, index) => {
                    const aspectRatios = ['aspect-[4/5]', 'aspect-[16/10]', 'aspect-[1/1]', 'aspect-[3/4]'];
                    const chosenAspect = aspectRatios[index % aspectRatios.length];

                    return (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="break-inside-avoid group bg-white rounded-3xl overflow-hidden border border-zinc-200/90 shadow-2xs hover:shadow-xl transition-all"
                      >
                        <div 
                          className={`${chosenAspect} bg-zinc-100 relative overflow-hidden cursor-pointer`}
                          onClick={() => handleCardClick(project)}
                        >
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-zinc-900 text-xs font-bold shadow">
                              <Eye className="w-3.5 h-3.5 text-[#EA580C]" /> View
                            </span>
                          </div>
                          {project.featured && (
                            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#EA580C] text-white text-[10px] font-bold shadow">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="p-5 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold uppercase text-zinc-400">
                            <span>{project.category}</span>
                            <span className="font-mono">{project.year}</span>
                          </div>
                          <h4 
                            onClick={() => handleCardClick(project)}
                            className="text-lg font-bold text-zinc-950 group-hover:text-[#EA580C] transition-colors cursor-pointer"
                          >
                            {project.title}
                          </h4>
                          <p className="text-xs text-zinc-600 line-clamp-2">
                            {project.summary}
                          </p>
                          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                            <span className="font-semibold text-zinc-800">{project.client}</span>
                            <button
                              onClick={() => handleCardClick(project)}
                              className="text-[#EA580C] font-bold hover:underline"
                            >
                              Case Study →
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

        {/* Load More Button */}
        {filteredProjects.length > visibleCount && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 3)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-zinc-300 hover:border-zinc-900 bg-white text-zinc-900 text-xs font-bold tracking-wide shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <span>Load More Projects ({filteredProjects.length - visibleCount} remaining)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
