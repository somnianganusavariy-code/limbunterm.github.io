import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Image as ImageIcon
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { InlineSectionEditBadge } from './cms/InlineSectionEditBadge';
import { HeroSlide, HeroSlideshowConfig } from '../types/cms';

export const Hero: React.FC = () => {
  const { content, setIsContactModalOpen } = useCms();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  const hero = content?.hero || {
    headlinePrefix: 'Design That',
    headlineHighlight: 'Builds Brands.',
    subtitle: 'I help ambitious brands stand out with bold, strategic and unforgettable graphic design, luxury packaging, and digital identities.',
    experienceBadge: '5+ Years of Excellence',
    primaryButtonText: "Let's Talk",
    primaryButtonLink: '#contact',
    secondaryButtonText: 'Explore Works',
    secondaryButtonLink: '#projects',
    portraitImage: '/src/assets/images/hero_designer_portrait_1793179168215.jpg',
    showAvailabilityBadge: true,
    availabilityText: 'Open for Selected Projects',
    slides: [],
    slideshowConfig: {
      enabled: true,
      autoplay: true,
      interval: 4000,
      transitionSpeed: 800,
      animationStyle: 'fade',
      aspectRatio: '4/5',
      objectFit: 'cover',
      position: 'center',
      showArrows: true,
      showDots: true
    }
  };

  // Get active slides list
  const slides: HeroSlide[] = (hero.slides && hero.slides.length > 0)
    ? [...hero.slides].sort((a, b) => a.order - b.order)
    : [
        {
          id: 'slide-fallback',
          url: hero.portraitImage || '/src/assets/images/hero_designer_portrait_1793179168215.jpg',
          alt: 'Designer Portrait',
          order: 1
        }
      ];

  const config: HeroSlideshowConfig = hero.slideshowConfig || {
    enabled: true,
    autoplay: true,
    interval: 4000,
    transitionSpeed: 800,
    animationStyle: 'fade',
    aspectRatio: '4/5',
    objectFit: 'cover',
    position: 'center',
    showArrows: true,
    showDots: true
  };

  // Make sure currentSlideIndex is valid
  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  // Autoplay timer
  useEffect(() => {
    if (!config.enabled || !config.autoplay || isPaused || slides.length <= 1) {
      return;
    }

    const intervalMs = Math.max(1500, config.interval || 4000);
    const timer = setInterval(() => {
      setSlideDirection('next');
      setCurrentSlideIndex(prev => (prev + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [config.enabled, config.autoplay, config.interval, isPaused, slides.length]);

  const handlePrevSlide = () => {
    setSlideDirection('prev');
    setCurrentSlideIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setSlideDirection('next');
    setCurrentSlideIndex(prev => (prev + 1) % slides.length);
  };

  const scrollToWork = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic aspect ratio class
  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '16/9':
        return 'aspect-[16/9]';
      case '1/1':
        return 'aspect-square';
      case '3/4':
        return 'aspect-[3/4]';
      case 'natural':
        return 'aspect-auto min-h-[420px] sm:min-h-[480px]';
      case '4/5':
      default:
        return 'aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]';
    }
  };

  // Dynamic object-fit and position class
  const getObjectFitClass = (fit: string) => (fit === 'contain' ? 'object-contain' : 'object-cover');
  const getObjectPositionClass = (pos: string) => {
    switch (pos) {
      case 'top':
        return 'object-top';
      case 'bottom':
        return 'object-bottom';
      case 'center':
      default:
        return 'object-center';
    }
  };

  // Motion variants depending on animationStyle
  const durationSec = Math.max(0.3, (config.transitionSpeed || 800) / 1000);

  const getAnimationVariants = () => {
    const style = config.animationStyle || 'fade';

    switch (style) {
      case 'slide-left':
        return {
          initial: { x: slideDirection === 'next' ? '100%' : '-100%', opacity: 0 },
          animate: { x: 0, opacity: 1, transition: { duration: durationSec, ease: 'easeOut' as const } },
          exit: { x: slideDirection === 'next' ? '-100%' : '100%', opacity: 0, transition: { duration: durationSec, ease: 'easeOut' as const } }
        };
      case 'slide-right':
        return {
          initial: { x: slideDirection === 'next' ? '-100%' : '100%', opacity: 0 },
          animate: { x: 0, opacity: 1, transition: { duration: durationSec, ease: 'easeOut' as const } },
          exit: { x: slideDirection === 'next' ? '100%' : '-100%', opacity: 0, transition: { duration: durationSec, ease: 'easeOut' as const } }
        };
      case 'zoom':
        return {
          initial: { scale: 1.15, opacity: 0 },
          animate: { scale: 1, opacity: 1, transition: { duration: durationSec, ease: 'easeOut' as const } },
          exit: { scale: 0.92, opacity: 0, transition: { duration: durationSec * 0.8, ease: 'easeIn' as const } }
        };
      case 'ken-burns':
        return {
          initial: { scale: 1.0, opacity: 0 },
          animate: { 
            scale: [1.0, 1.1],
            x: [0, -6],
            opacity: 1, 
            transition: { 
              opacity: { duration: 0.6 },
              scale: { duration: (config.interval || 4000) / 1000, ease: 'linear' as const },
              x: { duration: (config.interval || 4000) / 1000, ease: 'linear' as const }
            } 
          },
          exit: { opacity: 0, transition: { duration: 0.5 } }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: durationSec, ease: 'easeInOut' as const } },
          exit: { opacity: 0, transition: { duration: durationSec * 0.7, ease: 'easeInOut' as const } }
        };
    }
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <section id="hero" className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
      {/* Inline Section Edit Badge for Admin */}
      <InlineSectionEditBadge sectionId="sec-hero" sectionName="Hero Banner" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start space-y-6 sm:space-y-8"
          >
            {/* Availability Badge */}
            {hero.showAvailabilityBadge && (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
                <span className="text-xs font-semibold tracking-wide uppercase text-[#C2410C]">
                  {hero.availabilityText}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#EA580C]" />
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-950 tracking-tight leading-[1.08] text-balance">
              {hero.headlinePrefix} <br />
              <span className="text-zinc-950 inline-block">
                <span className="text-[#EA580C]">{hero.headlineHighlight}</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-600 max-w-xl font-normal leading-relaxed">
              {hero.subtitle}
            </p>

            {/* CTAs and Experience Badge */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToWork}
                className="inline-flex items-center gap-2.5 bg-[#EA580C] hover:bg-[#D94F04] text-white px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{hero.secondaryButtonText || 'View My Work'}</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </button>

              <button
                onClick={() => setIsContactModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-zinc-300 hover:border-zinc-900 text-zinc-900 text-base font-semibold transition-colors bg-white/60 hover:bg-white cursor-pointer"
              >
                <span>{hero.primaryButtonText || "Let's Talk"}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </button>

              {/* Experience Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-100 text-zinc-800 text-xs font-bold tracking-wide">
                <Award className="w-4 h-4 text-[#EA580C]" />
                <span>{hero.experienceBadge || '5+ Years of Excellence'}</span>
              </div>
            </div>

            {/* Highlighted Micro-metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-200/80 w-full max-w-lg">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 block">
                  {content?.about?.experienceYears || '5+'}
                </span>
                <span className="text-xs text-zinc-500 font-medium">Years Experience</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 block">
                  {content?.about?.completedProjects || '100+'}
                </span>
                <span className="text-xs text-zinc-500 font-medium">Projects Done</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 block">
                  {content?.about?.satisfiedClients || '50+'}
                </span>
                <span className="text-xs text-zinc-500 font-medium">Happy Clients</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Hero Graphic / Interactive Slideshow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Background Ambient Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-orange-300/40 via-zinc-200/40 to-transparent rounded-3xl filter blur-2xl -z-10" />

              {/* Card Container with Selected Aspect Ratio */}
              <div className={`relative rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 border border-zinc-800/80 ${getAspectRatioClass(config.aspectRatio)} group`}>
                
                {/* Slideshow Canvas */}
                <div className="relative w-full h-full overflow-hidden">
                  <AnimatePresence mode="popLayout" custom={slideDirection}>
                    <motion.div
                      key={currentSlide.id}
                      className="absolute inset-0 w-full h-full"
                      {...getAnimationVariants()}
                    >
                      <img
                        src={currentSlide.url}
                        alt={currentSlide.alt || 'Studio Design Showcase'}
                        className={`w-full h-full ${getObjectFitClass(config.objectFit)} ${getObjectPositionClass(config.position)}`}
                        loading="eager"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Ambient Gradient Overlay for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Manual Arrow Controls (If enabled and multiple slides) */}
                  {config.showArrows && slides.length > 1 && (
                    <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none z-20">
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        className="pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 opacity-70 hover:opacity-100 transition-all hover:scale-105 cursor-pointer"
                        title="Previous Slide"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        className="pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 opacity-70 hover:opacity-100 transition-all hover:scale-105 cursor-pointer"
                        title="Next Slide"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Top Slide Counter & Autoplay Indicator */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono font-bold">
                      {String(currentSlideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                    </span>
                    {config.autoplay && slides.length > 1 && (
                      <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-orange-400 text-[10px] font-bold flex items-center gap-1">
                        {isPaused ? <Pause className="w-2.5 h-2.5 text-zinc-400" /> : <Play className="w-2.5 h-2.5 fill-orange-400" />}
                        <span className="text-zinc-200">{isPaused ? 'Paused' : 'Auto'}</span>
                      </span>
                    )}
                  </div>

                  {/* Floating Bottom Card: Design Direction & Caption */}
                  <div className="absolute bottom-5 inset-x-5 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                        {currentSlide.caption || 'Studio Creative Direction'}
                      </span>
                      <div className="flex items-center text-xs font-semibold text-zinc-800 gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                        <span>High-Res Showcase</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium leading-relaxed truncate">
                      {currentSlide.alt || 'Elevating brand narratives through tactile print techniques and digital clarity.'}
                    </p>

                    {/* Pagination Dots (If enabled and multiple slides) */}
                    {config.showDots && slides.length > 1 && (
                      <div className="flex items-center justify-center gap-1.5 pt-2.5 mt-2 border-t border-zinc-100">
                        {slides.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSlideDirection(idx > currentSlideIndex ? 'next' : 'prev');
                              setCurrentSlideIndex(idx);
                            }}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              idx === currentSlideIndex
                                ? 'w-6 bg-[#EA580C]'
                                : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Floating Verified Quality Badge */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white rounded-2xl p-3 shadow-xl border border-zinc-200/80 flex items-center gap-3 z-30">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="pr-2">
                  <span className="text-xs font-bold text-zinc-950 block">High-End Systems</span>
                  <span className="text-[10px] text-zinc-500 font-medium">Bespoke Vector &amp; Print Specs</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
