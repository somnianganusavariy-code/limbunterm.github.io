import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, Heart, Eye, ArrowUpRight, Check, Calendar, User, Tag, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export const ProjectLightboxModal: React.FC = () => {
  const { 
    selectedProductForDetail, 
    setSelectedProductForDetail, 
    setIsContactModalOpen, 
    setSelectedServiceForInquiry 
  } = useCms();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string>('');

  useEffect(() => {
    if (selectedProductForDetail) {
      setActiveMediaUrl(selectedProductForDetail.image);
      setZoomLevel(1);
      setHasLiked(false);
    }
  }, [selectedProductForDetail]);

  if (!selectedProductForDetail) return null;

  const handleClose = () => {
    setZoomLevel(1);
    setHasLiked(false);
    setSelectedProductForDetail(null);
  };

  const handleBookSimilar = () => {
    setSelectedServiceForInquiry(selectedProductForDetail.category);
    setIsContactModalOpen(true);
    handleClose();
  };

  const allImages = [
    selectedProductForDetail.image,
    ...(selectedProductForDetail.gallery || []).filter(img => img && img !== selectedProductForDetail.image)
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        
        {/* Click outside to close */}
        <div className="fixed inset-0" onClick={handleClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 bg-white text-zinc-900 rounded-[28px] max-w-5xl w-full shadow-2xl border border-zinc-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                {selectedProductForDetail.category}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-xs text-zinc-500 font-mono">{selectedProductForDetail.year}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center bg-zinc-100 rounded-full p-1 border border-zinc-200">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.25))}
                  disabled={zoomLevel <= 1}
                  className="p-1.5 rounded-full hover:bg-white text-zinc-600 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 text-[11px] font-mono text-zinc-600 font-semibold">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
                  disabled={zoomLevel >= 2.5}
                  className="p-1.5 rounded-full hover:bg-white text-zinc-600 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
            
            {/* Title & Client header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-100">
              <div className="space-y-1">
                <span className="text-xs text-zinc-400 font-medium">
                  Client: <strong className="text-zinc-900">{selectedProductForDetail.client}</strong>
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                  {selectedProductForDetail.title}
                </h2>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setHasLiked(!hasLiked)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                    hasLiked
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500' : ''}`} />
                  <span>{selectedProductForDetail.likes + (hasLiked ? 1 : 0)} Likes</span>
                </button>

                <button
                  onClick={handleBookSimilar}
                  className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-[#D94F04] text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Book Similar Work</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* High-Resolution Media Inspection Canvas */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center p-2 min-h-[360px] sm:min-h-[480px]">
              <div 
                className="overflow-auto max-h-[600px] w-full flex items-center justify-center"
                style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
              >
                <img
                  src={activeMediaUrl || selectedProductForDetail.image}
                  alt={selectedProductForDetail.title}
                  style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
                  className="max-h-[560px] w-auto object-contain rounded-2xl select-none"
                />
              </div>
            </div>

            {/* Gallery Thumbnail Selector (If multiple images) */}
            {allImages.length > 1 && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                  Project Gallery Views ({allImages.length} images) — Click thumbnail to inspect
                </span>
                <div className="flex flex-wrap gap-3">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveMediaUrl(imgUrl);
                        setZoomLevel(1);
                      }}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeMediaUrl === imgUrl
                          ? 'border-[#EA580C] ring-2 ring-orange-200 scale-105'
                          : 'border-zinc-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] font-bold py-0.5 text-center">
                          Cover
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Metadata Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
              
              {/* Left Case Narrative (cols 1-7) */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                  Project Brief &amp; Execution
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                  {selectedProductForDetail.description}
                </p>
                <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                  {selectedProductForDetail.summary}
                </p>

                {/* Color Palette Swatches */}
                {selectedProductForDetail.colorPalette && selectedProductForDetail.colorPalette.length > 0 && (
                  <div className="pt-4">
                    <span className="text-xs font-bold text-zinc-700 block mb-2">
                      Brand Color Tokens
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedProductForDetail.colorPalette.map((color, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-50 border border-zinc-200">
                          <span
                            className="w-5 h-5 rounded-md shadow-xs block border border-black/10"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-[10px] font-mono text-zinc-600 pr-1">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Deliverables & Specs (cols 8-12) */}
              <div className="lg:col-span-5 bg-zinc-50 rounded-2xl p-6 border border-zinc-200/80 space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                    Deliverables &amp; Formats
                  </h4>
                  <ul className="space-y-2">
                    {selectedProductForDetail.deliverables?.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2 text-xs font-semibold text-zinc-800">
                        <Check className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-zinc-200/70">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    Categories &amp; Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProductForDetail.tags?.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[11px] font-medium bg-white border border-zinc-200 text-zinc-700 px-2.5 py-1 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Modal Footer Bar */}
          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-zinc-500">
              Press ESC or click outside to dismiss
            </span>

            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-full border border-zinc-300 hover:bg-zinc-100 text-xs font-bold text-zinc-700 transition-colors cursor-pointer"
            >
              Done Viewing
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
