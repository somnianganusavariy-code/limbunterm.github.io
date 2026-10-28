import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Search, 
  Copy, 
  ExternalLink,
  Layers,
  Sparkles,
  Video,
  Play,
  RotateCw,
  Film,
  Calendar,
  HardDrive
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { CmsMediaItem } from '../../types/cms';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export const MediaLibraryModal: React.FC = () => {
  const { 
    isMediaModalOpen, 
    closeMediaModal, 
    mediaItems, 
    uploadMediaFiles, 
    deleteMediaItem, 
    checkMediaUsage,
    selectMediaCallback,
    showToast
  } = useCms();

  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemUrl, setSelectedItemUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<CmsMediaItem | null>(null);
  const [previewingVideoUrl, setPreviewingVideoUrl] = useState<string | null>(null);
  const [replacingItemId, setReplacingItemId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  if (!isMediaModalOpen) return null;

  const isVideo = (item: CmsMediaItem) => {
    return (
      item.mimeType?.startsWith('video/') ||
      /\.(mp4|webm|mov|ogg)$/i.test(item.url) ||
      /\.(mp4|webm|mov|ogg)$/i.test(item.filename)
    );
  };

  const filteredMedia = mediaItems
    .filter(item => {
      if (mediaTypeFilter === 'image') return !isVideo(item);
      if (mediaTypeFilter === 'video') return isVideo(item);
      return true;
    })
    .filter(item => 
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.alt && item.alt.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => 
      /\.(jpg|jpeg|png|webp|svg|gif|mp4|webm|mov|ogg)$/i.test(f.name) || 
      f.type.startsWith('image/') || 
      f.type.startsWith('video/')
    );

    if (validFiles.length === 0) {
      setUploadError('Invalid format: Please choose image (JPG, PNG, WebP, SVG) or video (MP4, WebM, MOV) files.');
      showToast('Please select valid image or video files.', 'error');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 12 : prev));
    }, 150);

    try {
      const uploaded = await uploadMediaFiles(validFiles);
      clearInterval(interval);
      setUploadProgress(100);

      if (uploaded.length > 0) {
        setActiveTab('library');
        if (selectMediaCallback && uploaded[0]) {
          setSelectedItemUrl(uploaded[0].url);
        }
      } else {
        setUploadError('Upload failed. Please check server limits.');
      }
    } catch (err: any) {
      clearInterval(interval);
      setUploadError(err?.message || 'Error uploading files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('Asset URL copied to clipboard!', 'info');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleSelectConfirm = () => {
    if (selectedItemUrl && selectMediaCallback) {
      selectMediaCallback(selectedItemUrl);
      closeMediaModal();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  const getFileBadge = (item: CmsMediaItem) => {
    const ext = item.filename.split('.').pop()?.toUpperCase() || (isVideo(item) ? 'VIDEO' : 'IMG');
    return ext;
  };

  // Warning check for media deletion
  const warningsForDeletion = itemToDelete ? checkMediaUsage(itemToDelete.url) : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <div className="fixed inset-0" onClick={closeMediaModal} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 bg-white text-zinc-900 rounded-[28px] max-w-5xl w-full shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[88vh] max-h-[850px]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#EA580C] flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-zinc-950">
                  Media Assets Library
                </h3>
                <p className="text-xs text-zinc-500">
                  Upload images and videos (JPG, PNG, WebP, MP4, WebM) with persistent storage and usage protection.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-200/80 p-1 rounded-xl text-xs font-bold text-zinc-700">
                <button
                  type="button"
                  onClick={() => setActiveTab('library')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'library' ? 'bg-white text-zinc-950 shadow-xs' : 'hover:text-zinc-950'
                  }`}
                >
                  Library ({mediaItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'upload' ? 'bg-white text-zinc-950 shadow-xs' : 'hover:text-zinc-950'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Files</span>
                </button>
              </div>

              <button
                onClick={closeMediaModal}
                className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hidden input for replacing a single file */}
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={async e => {
              if (e.target.files && e.target.files[0]) {
                const uploaded = await uploadMediaFiles([e.target.files[0]]);
                if (uploaded.length > 0 && replacingItemId) {
                  showToast('Replacement asset uploaded. Select it to update your target section.', 'success');
                  setSelectedItemUrl(uploaded[0].url);
                }
                setReplacingItemId(null);
              }
            }}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'upload' ? (
              <div className="h-full flex flex-col justify-center items-center">
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  className="w-full max-w-xl p-10 border-2 border-dashed border-zinc-300 hover:border-[#EA580C] rounded-3xl bg-zinc-50/60 hover:bg-orange-50/20 transition-all flex flex-col items-center text-center cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,video/mp4,video/webm,video/quicktime,video/ogg"
                    className="hidden"
                    onChange={e => e.target.files && handleFiles(e.target.files)}
                  />

                  <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#EA580C] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                    <Upload className="w-8 h-8" />
                  </div>

                  <h4 className="text-base font-extrabold text-zinc-900 mb-1">
                    Drag &amp; drop images or videos here, or click to browse
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mb-4 leading-relaxed">
                    Supported: JPG, JPEG, PNG, WebP, SVG, MP4, WebM, MOV. Upload multiple files simultaneously up to 100MB each.
                  </p>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-xs text-zinc-600 font-semibold shadow-2xs">
                    <HardDrive className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Persistent Server Storage</span>
                  </div>

                  {uploadError && (
                    <div className="w-full max-w-md mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                      {uploadError}
                    </div>
                  )}

                  {isUploading && (
                    <div className="w-full max-w-xs mt-6 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-zinc-700">
                        <span>Uploading &amp; Saving to Disk...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#EA580C] transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search & Media Type Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-100">
                  
                  {/* Type Filter Tabs */}
                  <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMediaTypeFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        mediaTypeFilter === 'all' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      All ({mediaItems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTypeFilter('image')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        mediaTypeFilter === 'image' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Images ({mediaItems.filter(m => !isVideo(m)).length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTypeFilter('video')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        mediaTypeFilter === 'video' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Videos ({mediaItems.filter(m => isVideo(m)).length})</span>
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative max-w-xs w-full">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search file name..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {/* Grid */}
                {filteredMedia.length === 0 ? (
                  <div className="py-20 text-center text-zinc-400">
                    <Layers className="w-12 h-12 mx-auto stroke-1 mb-2 text-zinc-300" />
                    <p className="text-sm font-semibold text-zinc-600">No media assets found</p>
                    <p className="text-xs text-zinc-400 mt-1">Upload new images or videos using the "Upload Files" tab</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredMedia.map(item => {
                      const isSelected = selectedItemUrl === item.url;
                      const isItemVideo = isVideo(item);
                      const usageCount = checkMediaUsage(item.url).length;

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItemUrl(item.url)}
                          className={`group relative rounded-2xl overflow-hidden border transition-all cursor-pointer bg-white flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#EA580C] ring-2 ring-[#EA580C]/20 shadow-md'
                              : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="aspect-square bg-zinc-900 overflow-hidden relative">
                            {isItemVideo ? (
                              <div className="w-full h-full relative group/video">
                                <video
                                  src={item.url}
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setPreviewingVideoUrl(item.url);
                                    }}
                                    className="p-3 rounded-full bg-white/90 text-zinc-900 hover:scale-110 shadow-lg transition-transform"
                                    title="Play Video"
                                  >
                                    <Play className="w-5 h-5 fill-zinc-900 ml-0.5" />
                                  </button>
                                </div>
                                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[9px] font-bold text-white flex items-center gap-1 shadow-xs">
                                  <Video className="w-3 h-3 text-[#EA580C]" />
                                  <span>{getFileBadge(item)}</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <img
                                  src={item.url}
                                  alt={item.alt || item.filename}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white shadow-xs">
                                  {getFileBadge(item)}
                                </div>
                              </>
                            )}

                            {isSelected && (
                              <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-md z-10">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            )}

                            {usageCount > 0 && (
                              <span 
                                className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[9px] font-bold tracking-wide backdrop-blur-xs shadow-xs z-10"
                                title={`Used in ${usageCount} website section(s)`}
                              >
                                In Use ({usageCount})
                              </span>
                            )}

                            {/* Quick Action Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-10">
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleCopy(item.url);
                                }}
                                className="p-2 rounded-xl bg-white text-zinc-800 hover:text-[#EA580C] shadow transition-colors"
                                title="Copy asset URL"
                              >
                                {copiedUrl === item.url ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setReplacingItemId(item.id);
                                  replaceInputRef.current?.click();
                                }}
                                className="p-2 rounded-xl bg-white text-zinc-800 hover:text-[#EA580C] shadow transition-colors"
                                title="Replace file"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>

                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="p-2 rounded-xl bg-white text-zinc-800 hover:text-[#EA580C] shadow transition-colors"
                                title="Open full media"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setItemToDelete(item);
                                }}
                                className="p-2 rounded-xl bg-white text-red-600 hover:bg-red-50 shadow transition-colors"
                                title="Delete media asset"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="p-3 bg-white">
                            <p className="text-xs font-bold text-zinc-900 truncate" title={item.filename}>
                              {item.filename}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mt-1">
                              <span>{formatSize(item.size)}</span>
                              <span>{formatDate(item.uploadedAt)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50/80 flex items-center justify-between shrink-0">
            <div className="text-xs text-zinc-500">
              {selectedItemUrl ? (
                <span className="truncate max-w-sm block">Selected: <strong className="text-zinc-800 font-mono">{selectedItemUrl}</strong></span>
              ) : (
                <span>Click any image or video to select it for use</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeMediaModal}
                className="px-4 py-2 rounded-full border border-zinc-300 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
              >
                Close
              </button>

              {selectMediaCallback && (
                <button
                  type="button"
                  disabled={!selectedItemUrl}
                  onClick={handleSelectConfirm}
                  className="px-5 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] disabled:opacity-40 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Use Selected Media
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Full Preview Modal */}
      {previewingVideoUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="fixed inset-0" onClick={() => setPreviewingVideoUrl(null)} />
          <div className="relative z-10 max-w-3xl w-full bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 p-2">
            <div className="flex justify-between items-center px-4 py-2 text-white">
              <span className="text-xs font-bold font-mono truncate">{previewingVideoUrl}</span>
              <button onClick={() => setPreviewingVideoUrl(null)} className="p-1 hover:text-red-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <video
              src={previewingVideoUrl}
              controls
              autoPlay
              className="w-full max-h-[70vh] rounded-xl bg-black"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation with Website Section Usage Warning */}
      <ConfirmDeleteModal
        isOpen={!!itemToDelete}
        title="Media Asset"
        itemName={itemToDelete?.filename || ''}
        warningTitle={warningsForDeletion.length > 0 ? `Warning: File is used in ${warningsForDeletion.length} section(s)!` : undefined}
        warningList={warningsForDeletion}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            deleteMediaItem(itemToDelete.id);
            setItemToDelete(null);
            showToast('Media file permanently deleted.', 'info');
          }
        }}
      />
    </AnimatePresence>
  );
};
