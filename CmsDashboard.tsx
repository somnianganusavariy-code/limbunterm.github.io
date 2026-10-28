import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Layers, 
  Package, 
  Briefcase, 
  Users,
  Menu as MenuIcon, 
  Image as ImageIcon, 
  PhoneCall, 
  Settings as SettingsIcon, 
  Inbox, 
  ShieldCheck, 
  LogOut, 
  Eye, 
  EyeOff, 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Upload, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Download,
  Search,
  Filter,
  X,
  Lock,
  Globe,
  Share2,
  Video,
  Play,
  RotateCw,
  Star,
  Columns2,
  Grid3X3,
  Sliders,
  Tag,
  Palette
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { 
  CmsProduct, 
  CmsService, 
  CmsSection, 
  CmsNavigationItem, 
  InquiryStatus, 
  CmsBrand, 
  CmsCategory, 
  HeroSlide,
  ProjectLayoutType,
  HeroAnimationStyle,
  HeroAspectRatio,
  HeroObjectFit,
  HeroPosition,
  CmsMediaItem
} from '../../types/cms';
import { TelegramIcon, FacebookIcon } from '../SocialIcons';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export const CmsDashboard: React.FC = () => {
  const { 
    content, 
    setCurrentView, 
    cmsTab, 
    setCmsTab, 
    adminUser, 
    logout, 
    updateCredentials,
    saveDraft, 
    publishLive, 
    revertDraft, 
    hasUnpublishedChanges, 
    isSaving, 
    isPublishing,
    updateSettings, 
    updateContact, 
    updateHero, 
    updateAbout, 
    updateCta,
    updateNavigation, 
    updateSection, 
    reorderSections, 
    toggleSectionVisibility, 
    deleteSection, 
    addSection,
    // Hero Slides
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    reorderHeroSlides,
    updateHeroSlideshowConfig,
    // Products
    updateProduct, 
    addProduct, 
    deleteProduct,
    reorderProducts,
    toggleProductVisibility,
    toggleProductFeatured,
    setProjectDisplayLayout,
    // Categories
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    // Clients
    addClient,
    updateClient,
    deleteClient,
    reorderClients,
    toggleClientVisibility,
    // Services
    updateService, 
    addService, 
    deleteService,
    reorderServices,
    toggleServiceVisibility,
    // Media Library
    mediaItems, 
    openMediaModal, 
    uploadMediaFiles, 
    deleteMediaItem,
    checkMediaUsage,
    // Inquiries
    inquiries, 
    updateInquiryStatus, 
    deleteInquiry,
    totalViews,
    showToast
  } = useCms();

  // Local state for Product Editing Modal / Form
  const [editingProduct, setEditingProduct] = useState<CmsProduct | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productGalleryList, setProductGalleryList] = useState<string[]>([]);

  // Local state for Category Manager
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<CmsCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CmsCategory | null>(null);

  // Local state for Service Editing
  const [editingService, setEditingService] = useState<CmsService | null>(null);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);

  // Local state for Client / Brand Editing
  const [editingClient, setEditingClient] = useState<CmsBrand | null>(null);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);

  // Deletion Confirmation Modal States
  const [serviceToDelete, setServiceToDelete] = useState<CmsService | null>(null);
  const [clientToDelete, setClientToDelete] = useState<CmsBrand | null>(null);
  const [productToDelete, setProductToDelete] = useState<CmsProduct | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<CmsSection | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<any | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<CmsMediaItem | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<HeroSlide | null>(null);

  // Media Library tab local filter
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');

  // Local state for Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(adminUser?.username || 'admin');
  const [newEmail, setNewEmail] = useState(adminUser?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState(false);

  // Local state for Custom Section Form
  const [isCustomSectionOpen, setIsCustomSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionSubtitle, setNewSectionSubtitle] = useState('');
  const [newSectionBadge, setNewSectionBadge] = useState('');

  // Local state for Inquiries filter
  const [inquiryFilter, setInquiryFilter] = useState<'All' | InquiryStatus>('All');
  const [inquirySearch, setInquirySearch] = useState('');

  // Mobile sidebar drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // File upload refs
  const heroMultiUploadRef = useRef<HTMLInputElement>(null);
  const replaceHeroSlideRef = useRef<HTMLInputElement>(null);
  const [replacingSlideId, setReplacingSlideId] = useState<string | null>(null);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F6F4] text-zinc-900">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#EA580C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-zinc-700">Loading Studio CMS Engine...</p>
        </div>
      </div>
    );
  }

  // Sidebar Menu Items with Clients added
  const menuItems = [
    { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
    { id: 'homepage', label: 'Homepage & Hero', icon: Home },
    { id: 'sections', label: 'Sections Manager', icon: Layers },
    { id: 'products', label: 'Projects & Works', icon: Package },
    { id: 'services', label: 'Services Catalog', icon: Briefcase },
    { id: 'clients', label: 'Clients & Reviews', icon: Users },
    { id: 'navigation', label: 'Navigation Menu', icon: MenuIcon },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'contact', label: 'Contact & Social', icon: PhoneCall },
    { id: 'settings', label: 'Website Settings', icon: SettingsIcon },
    { id: 'inquiries', label: 'Client Inquiries', icon: Inbox, badge: inquiries.filter(i => i.status === 'New').length },
    { id: 'security', label: 'Security & Account', icon: ShieldCheck }
  ];

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCredentials(currentPassword, newUsername, newEmail, newPassword || undefined);
      setSecuritySuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setSecuritySuccess(false), 3000);
    } catch {}
  };

  const handleExportCSV = () => {
    const headers = ['ID,Client Name,Email,Company,Service,Timeline,Date,Status,Notes'];
    const rows = inquiries.map(i =>
      `"${i.id}","${i.clientName}","${i.email}","${i.company || ''}","${i.service}","${i.timeline}","${i.date}","${i.status}","${(i.notes || '').replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `client_inquiries_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Inquiries CSV exported successfully.', 'success');
  };

  // Safe slides list
  const heroSlides: HeroSlide[] = (content.hero?.slides && content.hero.slides.length > 0)
    ? [...content.hero.slides].sort((a, b) => a.order - b.order)
    : [
        {
          id: 'slide-1',
          url: content.hero?.portraitImage || '/src/assets/images/hero_designer_portrait_1793179168215.jpg',
          alt: 'Hero Primary Graphic',
          order: 1
        }
      ];

  const slideshowConfig = content.hero?.slideshowConfig || {
    enabled: true,
    autoplay: true,
    interval: 4000,
    transitionSpeed: 800,
    animationStyle: 'fade' as HeroAnimationStyle,
    aspectRatio: '4/5' as HeroAspectRatio,
    objectFit: 'cover' as HeroObjectFit,
    position: 'center' as HeroPosition,
    showArrows: true,
    showDots: true
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] text-zinc-900 flex flex-col">
      
      {/* Top CMS Header */}
      <header className="sticky top-0 z-40 bg-zinc-950 text-white border-b border-zinc-800 shadow-md">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
                {content.settings.siteName}<span className="text-[#EA580C]">.</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#EA580C] text-[11px] font-bold uppercase tracking-wider">
                CMS Studio
              </span>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Live Site */}
            <button
              onClick={() => setCurrentView('portfolio')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">View Website</span>
            </button>

            {/* Save Draft */}
            <button
              onClick={() => saveDraft()}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            {/* Publish Live */}
            <button
              onClick={() => publishLive()}
              disabled={isPublishing}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'Publishing...' : 'Publish Live'}</span>
              {hasUnpublishedChanges && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />
              )}
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-full bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 transition-colors ml-1 cursor-pointer"
              title="Log out of CMS"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main CMS Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <aside
          className={`fixed lg:static inset-y-16 left-0 z-30 w-64 bg-white border-r border-zinc-200 flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto flex-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Website Management
            </span>

            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = cmsTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCmsTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EA580C] text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-[#EA580C]' : 'bg-[#EA580C] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Admin User Footer in Sidebar */}
          <div className="p-4 border-t border-zinc-200 bg-zinc-50/80">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-xs font-bold text-zinc-900 block truncate">
                  {adminUser?.username}
                </span>
                <span className="text-[10px] text-zinc-500 block truncate">
                  {adminUser?.email}
                </span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" title="Active Admin Session" />
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Central Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full pb-24">
          
          {/* TAB 1: OVERVIEW */}
          {cmsTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                    Studio Overview &amp; Control Center
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Manage your portfolio content, projects, clients, uploaded assets, and client inquiries without touching code.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCmsTab('homepage')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 hover:border-zinc-300 text-xs font-bold text-zinc-800 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Edit Hero Banner</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductGalleryList([]);
                      setIsProductFormOpen(true);
                      setCmsTab('products');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Project</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                hasUnpublishedChanges
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${hasUnpublishedChanges ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                  <div>
                    <h4 className="text-sm font-bold">
                      {hasUnpublishedChanges ? 'You have draft edits waiting to be published' : 'Website is fully in sync with live visitors'}
                    </h4>
                    <p className="text-xs opacity-80 mt-0.5">
                      {hasUnpublishedChanges 
                        ? 'Edits are saved in the draft database. Click "Publish Live" to push changes to your public domain.' 
                        : 'Any changes you make in this dashboard are saved to drafts and can be pushed live with one click.'}
                    </p>
                  </div>
                </div>

                {hasUnpublishedChanges && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => publishLive()}
                      className="px-4 py-1.5 rounded-full bg-[#EA580C] text-white text-xs font-bold shadow hover:bg-[#D94F04] transition-all cursor-pointer"
                    >
                      Publish Changes Now
                    </button>
                  </div>
                )}
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
                  <span className="text-xs text-zinc-400 font-medium block">Total Portfolio Views</span>
                  <div className="text-2xl font-extrabold text-zinc-950 mt-1">
                    {totalViews.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Live Visitor Tracker
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
                  <span className="text-xs text-zinc-400 font-medium block">Published Projects</span>
                  <div className="text-2xl font-extrabold text-zinc-950 mt-1">
                    {content.products.filter(p => p.enabled).length}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium mt-1 block">
                    {content.products.length} Total Projects
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
                  <span className="text-xs text-zinc-400 font-medium block">Media Library Assets</span>
                  <div className="text-2xl font-extrabold text-zinc-950 mt-1">
                    {mediaItems.length}
                  </div>
                  <span className="text-[11px] text-[#EA580C] font-semibold mt-1 block">
                    Images &amp; Videos Stored
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
                  <span className="text-xs text-zinc-400 font-medium block">Clients &amp; Partners</span>
                  <div className="text-2xl font-extrabold text-zinc-950 mt-1">
                    {(content.brands || []).length}
                  </div>
                  <span className="text-[11px] text-amber-600 font-bold mt-1 block">
                    {(content.brands || []).filter(b => b.enabled).length} Active on Live Site
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOMEPAGE & HERO BANNER EDITOR */}
          {cmsTab === 'homepage' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Hero Portrait / Banner Graphic Editor
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Manage multi-image slideshows, transitions, animation styles, duration, aspect ratios, and narrative copy.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => saveDraft()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold shadow cursor-pointer transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('portfolio')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Preview Site</span>
                  </button>
                  <button
                    onClick={() => publishLive()}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Live</span>
                  </button>
                </div>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={heroMultiUploadRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={async e => {
                  if (e.target.files && e.target.files.length > 0) {
                    const uploaded = await uploadMediaFiles(Array.from(e.target.files));
                    uploaded.forEach(item => {
                      addHeroSlide(item.url, item.alt || item.filename);
                    });
                    showToast(`Added ${uploaded.length} slide(s) to Hero banner!`, 'success');
                  }
                }}
              />

              <input
                ref={replaceHeroSlideRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async e => {
                  if (e.target.files && e.target.files[0] && replacingSlideId) {
                    const uploaded = await uploadMediaFiles([e.target.files[0]]);
                    if (uploaded.length > 0) {
                      updateHeroSlide(replacingSlideId, { url: uploaded[0].url });
                      showToast('Hero slide image replaced.', 'success');
                    }
                    setReplacingSlideId(null);
                  }
                }}
              />

              {/* Section 1: Hero Slides Gallery & Management */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900">Hero Slides Gallery</h3>
                      <p className="text-xs text-zinc-500">
                        Upload single or multiple images, reorder sequence, replace, or set captions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => heroMultiUploadRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 text-[#EA580C] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Images</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        openMediaModal(url => {
                          addHeroSlide(url, 'Studio Showcase Image');
                          showToast('Slide added from Media Library!', 'success');
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Choose From Media Library</span>
                    </button>
                  </div>
                </div>

                {/* Slides Preview Cards */}
                <div className="space-y-3">
                  {heroSlides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Order Controls */}
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => {
                              const newArr = [...heroSlides];
                              const temp = newArr[index - 1];
                              newArr[index - 1] = newArr[index];
                              newArr[index] = temp;
                              reorderHeroSlides(newArr);
                            }}
                            className="p-1 rounded-md bg-white border border-zinc-200 hover:bg-zinc-100 disabled:opacity-30 text-zinc-600 transition-colors cursor-pointer"
                            title="Move slide up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === heroSlides.length - 1}
                            onClick={() => {
                              const newArr = [...heroSlides];
                              const temp = newArr[index + 1];
                              newArr[index + 1] = newArr[index];
                              newArr[index] = temp;
                              reorderHeroSlides(newArr);
                            }}
                            className="p-1 rounded-md bg-white border border-zinc-200 hover:bg-zinc-100 disabled:opacity-30 text-zinc-600 transition-colors cursor-pointer"
                            title="Move slide down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 shrink-0 relative group">
                          <img
                            src={slide.url}
                            alt={slide.alt || 'Slide preview'}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 text-white rounded text-[10px] font-mono font-bold">
                            #{index + 1}
                          </span>
                        </div>

                        {/* Slide Inputs */}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={slide.caption || ''}
                              onChange={e => updateHeroSlide(slide.id, { caption: e.target.value })}
                              placeholder="Badge / Category (e.g. Creative Direction)"
                              className="px-3 py-1 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-800 w-full sm:w-1/2 outline-none focus:border-[#EA580C]"
                            />
                            {index === 0 && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                                Primary Cover
                              </span>
                            )}
                          </div>

                          <input
                            type="text"
                            value={slide.alt || ''}
                            onChange={e => updateHeroSlide(slide.id, { alt: e.target.value })}
                            placeholder="Slide subtitle or description..."
                            className="px-3 py-1 rounded-lg border border-zinc-200 text-xs text-zinc-600 w-full outline-none focus:border-[#EA580C]"
                          />
                        </div>
                      </div>

                      {/* Slide Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Replace image */}
                        <button
                          type="button"
                          onClick={() => {
                            setReplacingSlideId(slide.id);
                            replaceHeroSlideRef.current?.click();
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 cursor-pointer transition-colors"
                          title="Upload replacement image"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Replace</span>
                        </button>

                        {/* Replace from Media Library */}
                        <button
                          type="button"
                          onClick={() => {
                            openMediaModal(url => {
                              updateHeroSlide(slide.id, { url });
                              showToast('Hero slide image updated.', 'success');
                            });
                          }}
                          className="p-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                          title="Pick from Media Library"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#EA580C]" />
                        </button>

                        {/* Delete Slide */}
                        <button
                          type="button"
                          disabled={heroSlides.length <= 1}
                          onClick={() => setSlideToDelete(slide)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30 cursor-pointer transition-colors"
                          title="Delete slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Slideshow Animation & Display Controls */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-2xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Slideshow &amp; Animation Configuration</h3>
                    <p className="text-xs text-zinc-500">
                      Configure autoplay, transition styles (Fade, Slide, Zoom, Ken Burns), speed, and aspect ratio.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                  
                  {/* Animation Style */}
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Transition Animation Style *
                    </label>
                    <select
                      value={slideshowConfig.animationStyle}
                      onChange={e => updateHeroSlideshowConfig({ animationStyle: e.target.value as HeroAnimationStyle })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm font-semibold bg-white outline-none focus:border-[#EA580C] cursor-pointer"
                    >
                      <option value="fade">Fade (Smooth crossfade)</option>
                      <option value="slide-left">Slide Left (Horizontal sweep left)</option>
                      <option value="slide-right">Slide Right (Horizontal sweep right)</option>
                      <option value="zoom">Zoom In (Dynamic scale &amp; reveal)</option>
                      <option value="ken-burns">Ken Burns Effect (Cinematic subtle pan &amp; zoom)</option>
                    </select>
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Image Display Aspect Ratio
                    </label>
                    <select
                      value={slideshowConfig.aspectRatio}
                      onChange={e => updateHeroSlideshowConfig({ aspectRatio: e.target.value as HeroAspectRatio })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm font-semibold bg-white outline-none focus:border-[#EA580C] cursor-pointer"
                    >
                      <option value="4/5">Portrait (4:5) — Recommended for Studio</option>
                      <option value="16/9">Cinema Widescreen (16:9)</option>
                      <option value="1/1">Square (1:1)</option>
                      <option value="3/4">Classic (3:4)</option>
                      <option value="natural">Natural Auto Height</option>
                    </select>
                  </div>

                  {/* Object Fit & Position */}
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Image Fit &amp; Positioning
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={slideshowConfig.objectFit}
                        onChange={e => updateHeroSlideshowConfig({ objectFit: e.target.value as HeroObjectFit })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white outline-none focus:border-[#EA580C]"
                      >
                        <option value="cover">Fit: Cover</option>
                        <option value="contain">Fit: Contain</option>
                      </select>
                      <select
                        value={slideshowConfig.position}
                        onChange={e => updateHeroSlideshowConfig({ position: e.target.value as HeroPosition })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white outline-none focus:border-[#EA580C]"
                      >
                        <option value="center">Align: Center</option>
                        <option value="top">Align: Top</option>
                        <option value="bottom">Align: Bottom</option>
                      </select>
                    </div>
                  </div>

                  {/* Slide Duration */}
                  <div>
                    <div className="flex justify-between font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      <span>Slide Duration</span>
                      <span className="text-[#EA580C] font-mono">{(slideshowConfig.interval / 1000).toFixed(1)}s</span>
                    </div>
                    <input
                      type="range"
                      min={2000}
                      max={12000}
                      step={500}
                      value={slideshowConfig.interval}
                      onChange={e => updateHeroSlideshowConfig({ interval: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#EA580C] cursor-pointer"
                    />
                    <span className="text-[10px] text-zinc-400">Time each image remains visible</span>
                  </div>

                  {/* Transition Speed */}
                  <div>
                    <div className="flex justify-between font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      <span>Transition Animation Speed</span>
                      <span className="text-[#EA580C] font-mono">{slideshowConfig.transitionSpeed}ms</span>
                    </div>
                    <input
                      type="range"
                      min={300}
                      max={2000}
                      step={100}
                      value={slideshowConfig.transitionSpeed}
                      onChange={e => updateHeroSlideshowConfig({ transitionSpeed: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#EA580C] cursor-pointer"
                    />
                    <span className="text-[10px] text-zinc-400">Duration of slide transition effect</span>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={slideshowConfig.autoplay}
                        onChange={e => updateHeroSlideshowConfig({ autoplay: e.target.checked })}
                        className="w-4 h-4 text-[#EA580C] rounded focus:ring-[#EA580C]"
                      />
                      <span className="font-bold text-zinc-800 text-xs">Enable Automatic Slideshow (Autoplay)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={slideshowConfig.showArrows}
                        onChange={e => updateHeroSlideshowConfig({ showArrows: e.target.checked })}
                        className="w-4 h-4 text-[#EA580C] rounded focus:ring-[#EA580C]"
                      />
                      <span className="font-semibold text-zinc-700 text-xs">Show Prev / Next Navigation Arrows</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={slideshowConfig.showDots}
                        onChange={e => updateHeroSlideshowConfig({ showDots: e.target.checked })}
                        className="w-4 h-4 text-[#EA580C] rounded focus:ring-[#EA580C]"
                      />
                      <span className="font-semibold text-zinc-700 text-xs">Show Slide Pagination Dots</span>
                    </label>
                  </div>

                </div>
              </div>

              {/* Section 3: Narrative & Button Copy */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-2xs space-y-5">
                <h3 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">
                  Hero Text &amp; CTAs
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Headline Prefix
                    </label>
                    <input
                      type="text"
                      value={content.hero.headlinePrefix}
                      onChange={e => updateHero({ headlinePrefix: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Headline Highlight (Colored)
                    </label>
                    <input
                      type="text"
                      value={content.hero.headlineHighlight}
                      onChange={e => updateHero({ headlineHighlight: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Hero Subtitle Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={content.hero.subtitle}
                    onChange={e => updateHero({ subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Primary Button Text
                    </label>
                    <input
                      type="text"
                      value={content.hero.primaryButtonText}
                      onChange={e => updateHero({ primaryButtonText: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Secondary Button Text
                    </label>
                    <input
                      type="text"
                      value={content.hero.secondaryButtonText}
                      onChange={e => updateHero({ secondaryButtonText: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Experience Badge Text
                    </label>
                    <input
                      type="text"
                      value={content.hero.experienceBadge}
                      onChange={e => updateHero({ experienceBadge: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SECTIONS MANAGER */}
          {cmsTab === 'sections' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Website Sections Manager
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Reorder sections, toggle visibility on/off, edit section headlines, or add custom sections.
                  </p>
                </div>

                <button
                  onClick={() => setIsCustomSectionOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Section</span>
                </button>
              </div>

              {/* Add Custom Section Modal */}
              {isCustomSectionOpen && (
                <div className="p-6 rounded-3xl bg-white border border-zinc-300 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-zinc-900">Create New Website Section</h3>
                    <button onClick={() => setIsCustomSectionOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Section Badge (e.g. Innovation)"
                      value={newSectionBadge}
                      onChange={e => setNewSectionBadge(e.target.value)}
                      className="px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Section Title"
                      value={newSectionTitle}
                      onChange={e => setNewSectionTitle(e.target.value)}
                      className="px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Subtitle"
                      value={newSectionSubtitle}
                      onChange={e => setNewSectionSubtitle(e.target.value)}
                      className="px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsCustomSectionOpen(false)}
                      className="px-4 py-1.5 rounded-full border border-zinc-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!newSectionTitle) return;
                        addSection({
                          id: `sec-custom-${Date.now()}`,
                          name: newSectionTitle,
                          type: 'custom',
                          enabled: true,
                          order: content.sections.length + 1,
                          title: newSectionTitle,
                          subtitle: newSectionSubtitle,
                          badge: newSectionBadge || 'Custom'
                        });
                        setIsCustomSectionOpen(false);
                        setNewSectionTitle('');
                        setNewSectionSubtitle('');
                        setNewSectionBadge('');
                        showToast('Custom section created!', 'success');
                      }}
                      className="px-5 py-1.5 rounded-full bg-[#EA580C] text-white text-xs font-bold cursor-pointer"
                    >
                      Add Section
                    </button>
                  </div>
                </div>
              )}

              {/* Sections List */}
              <div className="space-y-3">
                {content.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          disabled={index === 0}
                          onClick={() => {
                            const newArr = [...content.sections];
                            const temp = newArr[index - 1];
                            newArr[index - 1] = newArr[index];
                            newArr[index] = temp;
                            reorderSections(newArr);
                          }}
                          className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                          title="Move section up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === content.sections.length - 1}
                          onClick={() => {
                            const newArr = [...content.sections];
                            const temp = newArr[index + 1];
                            newArr[index + 1] = newArr[index];
                            newArr[index] = temp;
                            reorderSections(newArr);
                          }}
                          className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                          title="Move section down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-zinc-400">#{index + 1}</span>
                          <h4 className="text-sm font-bold text-zinc-900">{section.name}</h4>
                          <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                            {section.type}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 max-w-md">
                          Title: &quot;{section.title}&quot; • Subtitle: &quot;{section.subtitle}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        onClick={() => toggleSectionVisibility(section.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          section.enabled
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                        }`}
                      >
                        {section.enabled ? 'Visible on Website' : 'Hidden'}
                      </button>

                      {section.type === 'custom' && (
                        <button
                          onClick={() => setSectionToDelete(section)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS & WORKS MANAGEMENT */}
          {cmsTab === 'products' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Projects &amp; Works Management
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Control display layouts, categories, multi-image galleries, and featured flags. (Price / budget field removed).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductGalleryList([]);
                      setIsProductFormOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Project</span>
                  </button>
                </div>
              </div>

              {/* Layout Switcher & Display Options */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-zinc-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      Public Website Project Display Layout
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Select how portfolio projects render on the public website.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'showcase', label: 'Showcase (Editorial Split)' },
                      { id: 'grid-2', label: '2-Column Grid' },
                      { id: 'grid-3', label: '3-Column Grid' },
                      { id: 'masonry', label: 'Masonry Wall' }
                    ].map(layout => (
                      <button
                        key={layout.id}
                        onClick={() => {
                          setProjectDisplayLayout(layout.id as ProjectLayoutType);
                          showToast(`Public website layout set to ${layout.label}.`, 'success');
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          (content.projectDisplayLayout || 'showcase') === layout.id
                            ? 'bg-[#EA580C] text-white shadow-xs'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {layout.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Management Component */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-zinc-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">Category Management</h3>
                    <p className="text-xs text-zinc-500">
                      Add, rename, or delete categories. The public filter automatically updates.
                    </p>
                  </div>

                  {/* Add New Category form */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="New category name (e.g. 3D Motion)..."
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newCategoryName.trim()) {
                          addCategory(newCategoryName.trim());
                          setNewCategoryName('');
                          showToast('Category added.', 'success');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-zinc-300 text-xs outline-none focus:border-[#EA580C] w-48 sm:w-60"
                    />
                    <button
                      type="button"
                      disabled={!newCategoryName.trim()}
                      onClick={() => {
                        if (newCategoryName.trim()) {
                          addCategory(newCategoryName.trim());
                          setNewCategoryName('');
                          showToast('Category added.', 'success');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Categories Badge List */}
                <div className="flex flex-wrap items-center gap-2">
                  {(content.categories || []).map((cat, idx) => {
                    const count = content.products.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
                    const isAll = cat.name.toLowerCase() === 'all';

                    return (
                      <div
                        key={cat.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800"
                      >
                        <span>{cat.name}</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-zinc-200 text-zinc-700 text-[10px] font-mono">
                          {isAll ? content.products.length : count}
                        </span>

                        {!isAll && (
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => {
                                const newName = prompt('Enter new category name:', cat.name);
                                if (newName && newName.trim()) {
                                  updateCategory(cat.id, { name: newName.trim() });
                                  showToast('Category renamed.', 'success');
                                }
                              }}
                              className="text-zinc-400 hover:text-zinc-700 p-0.5"
                              title="Rename category"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCategoryToDelete(cat)}
                              className="text-zinc-400 hover:text-red-600 p-0.5"
                              title="Delete category"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Create / Edit Project Form Modal */}
              {isProductFormOpen && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-300 shadow-xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <h3 className="text-lg font-bold text-zinc-900">
                      {editingProduct ? `Edit "${editingProduct.title}"` : 'Add New Project / Case Study'}
                    </h3>
                    <button
                      onClick={() => setIsProductFormOpen(false)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      const form = e.target as any;
                      const prodData = {
                        title: form.title.value.trim(),
                        category: form.category.value,
                        client: form.client.value.trim(),
                        year: form.year.value.trim(),
                        image: form.image.value.trim(),
                        gallery: productGalleryList,
                        summary: form.summary.value.trim(),
                        description: form.description.value.trim(),
                        featured: form.featured.checked,
                        enabled: form.enabled.checked,
                        order: editingProduct ? editingProduct.order : content.products.length + 1,
                        colorPalette: form.colorPalette.value.split(',').map((s: string) => s.trim()).filter(Boolean),
                        deliverables: form.deliverables.value.split(',').map((s: string) => s.trim()).filter(Boolean),
                        tags: form.tags.value.split(',').map((s: string) => s.trim()).filter(Boolean)
                      };

                      if (editingProduct) {
                        updateProduct(editingProduct.id, prodData);
                        showToast('Project updated successfully.', 'success');
                      } else {
                        addProduct(prodData);
                        showToast('New project created and added to catalog.', 'success');
                      }
                      setIsProductFormOpen(false);
                      setEditingProduct(null);
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Project Title *
                        </label>
                        <input
                          name="title"
                          type="text"
                          required
                          defaultValue={editingProduct?.title || ''}
                          placeholder="e.g. Aura Skincare Packaging System"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          defaultValue={editingProduct?.category || (content.categories[1]?.name || 'Packaging')}
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] bg-white cursor-pointer"
                        >
                          {content.categories.filter(c => c.name.toLowerCase() !== 'all').map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Client / Brand Name
                        </label>
                        <input
                          name="client"
                          type="text"
                          defaultValue={editingProduct?.client || 'Independent Client'}
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Release Year
                        </label>
                        <input
                          name="year"
                          type="text"
                          defaultValue={editingProduct?.year || '2026'}
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    {/* Primary Image Selector */}
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Primary Cover Image URL *
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="product-image-input"
                          name="image"
                          type="text"
                          required
                          defaultValue={editingProduct?.image || '/src/assets/images/project_packaging_boxes_1793179168555.jpg'}
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            openMediaModal(url => {
                              const el = document.getElementById('product-image-input') as HTMLInputElement;
                              if (el) el.value = url;
                            });
                          }}
                          className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold whitespace-nowrap hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          Pick Media
                        </button>
                      </div>
                    </div>

                    {/* Additional Gallery Images */}
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-800 uppercase tracking-wider">
                          Additional Gallery Images ({productGalleryList.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            openMediaModal(url => {
                              if (!productGalleryList.includes(url)) {
                                setProductGalleryList([...productGalleryList, url]);
                              }
                            });
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Gallery Image</span>
                        </button>
                      </div>

                      {productGalleryList.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {productGalleryList.map((gUrl, gIdx) => (
                            <div key={gIdx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 group">
                              <img src={gUrl} alt="Gallery item" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setProductGalleryList(productGalleryList.filter((_, i) => i !== gIdx))}
                                className="absolute inset-0 bg-red-600/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Short Summary (Card Preview)
                      </label>
                      <input
                        name="summary"
                        type="text"
                        defaultValue={editingProduct?.summary || 'Luxury packaging and bespoke unboxing experience.'}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        Full Detailed Case Study Description
                      </label>
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={editingProduct?.description || 'Structural packaging suite engineered with high tactile debossing and hot foil stamped tooling.'}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Deliverables (comma separated)
                        </label>
                        <input
                          name="deliverables"
                          type="text"
                          defaultValue={editingProduct?.deliverables?.join(', ') || 'Custom Die-Cuts, Debossed Sleeves, Product Labels'}
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Tags (comma separated)
                        </label>
                        <input
                          name="tags"
                          type="text"
                          defaultValue={editingProduct?.tags?.join(', ') || 'Packaging, Luxury, Print Finish'}
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    <input
                      name="colorPalette"
                      type="hidden"
                      defaultValue={editingProduct?.colorPalette?.join(', ') || '#1A2536, #C79A73, #D6B995'}
                    />

                    {/* Flags */}
                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                        <input
                          name="featured"
                          type="checkbox"
                          defaultChecked={editingProduct ? editingProduct.featured : true}
                          className="w-4 h-4 text-[#EA580C] rounded"
                        />
                        <span>Mark as Featured</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                        <input
                          name="enabled"
                          type="checkbox"
                          defaultChecked={editingProduct ? editingProduct.enabled : true}
                          className="w-4 h-4 text-[#EA580C] rounded"
                        />
                        <span>Visible on Public Website</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                      <button
                        type="button"
                        onClick={() => setIsProductFormOpen(false)}
                        className="px-5 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white font-bold shadow transition-colors cursor-pointer"
                      >
                        {editingProduct ? 'Save Project Changes' : 'Publish New Project'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Projects List Grid with Reorder, Show/Hide, and Featured Controls */}
              <div className="space-y-3">
                {([...content.products].sort((a, b) => (a.order || 0) - (b.order || 0))).map((product, index, sortedArr) => (
                  <div
                    key={product.id}
                    className={`bg-white p-5 rounded-2xl border transition-all ${
                      product.enabled ? 'border-zinc-200 shadow-2xs' : 'border-zinc-200/60 bg-zinc-50/70 opacity-70'
                    } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            const newArr = [...sortedArr];
                            const temp = newArr[index - 1];
                            newArr[index - 1] = newArr[index];
                            newArr[index] = temp;
                            reorderProducts(newArr);
                            showToast('Project moved up.', 'info');
                          }}
                          className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                          title="Move project up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === sortedArr.length - 1}
                          onClick={() => {
                            const newArr = [...sortedArr];
                            const temp = newArr[index + 1];
                            newArr[index + 1] = newArr[index];
                            newArr[index] = temp;
                            reorderProducts(newArr);
                            showToast('Project moved down.', 'info');
                          }}
                          className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                          title="Move project down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Thumbnail */}
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 relative">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        {product.featured && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#EA580C] text-white text-[9px] font-bold">
                            ★
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-zinc-400">#{index + 1}</span>
                          <h4 className="text-sm font-bold text-zinc-950 truncate">{product.title}</h4>
                          <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 truncate max-w-lg">
                          Client: {product.client} • Year: {product.year}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Featured toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          toggleProductFeatured(product.id);
                          showToast(product.featured ? 'Removed from featured.' : 'Marked as featured.', 'info');
                        }}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          product.featured
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800'
                        }`}
                        title={product.featured ? 'Featured on website' : 'Click to feature'}
                      >
                        <Star className={`w-3.5 h-3.5 ${product.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>

                      {/* Show/Hide visibility */}
                      <button
                        type="button"
                        onClick={() => {
                          toggleProductVisibility(product.id);
                          showToast(product.enabled ? `"${product.title}" hidden.` : `"${product.title}" visible.`, 'info');
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          product.enabled
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'
                        }`}
                        title={product.enabled ? 'Visible on website' : 'Hidden from website'}
                      >
                        {product.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{product.enabled ? 'Visible' : 'Hidden'}</span>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(product);
                          setProductGalleryList(product.gallery || []);
                          setIsProductFormOpen(true);
                        }}
                        className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                        title="Edit project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: SERVICES CATALOG */}
          {cmsTab === 'services' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Services &amp; Capabilities
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Manage service offerings, upload custom icons or images, reorder sequence, and toggle live visibility.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingService(null);
                    setIsServiceFormOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Service Form */}
              {isServiceFormOpen && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-300 shadow-xl space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                    <h3 className="text-base font-bold text-zinc-900">
                      {editingService ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <button 
                      onClick={() => {
                        setIsServiceFormOpen(false);
                        setEditingService(null);
                      }} 
                      className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      const form = e.target as any;
                      const srvData = {
                        title: form.title.value.trim(),
                        description: form.description.value.trim(),
                        iconName: form.iconName.value,
                        imageUrl: form.imageUrl.value.trim() || undefined,
                        startingPrice: form.startingPrice.value.trim(),
                        deliverables: form.deliverables.value.split(',').map((s: string) => s.trim()).filter(Boolean),
                        enabled: form.enabled.checked,
                        order: editingService ? editingService.order : content.services.length + 1
                      };
                      if (editingService) {
                        updateService(editingService.id, srvData);
                        showToast('Service updated successfully.', 'success');
                      } else {
                        addService(srvData);
                        showToast('New service added to catalog.', 'success');
                      }
                      setIsServiceFormOpen(false);
                      setEditingService(null);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Service Title *</label>
                        <input
                          name="title"
                          type="text"
                          required
                          defaultValue={editingService?.title || ''}
                          placeholder="e.g. Brand Identity & Strategy"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Starting Price / Rate</label>
                        <input
                          name="startingPrice"
                          type="text"
                          defaultValue={editingService?.startingPrice || '$2,500'}
                          placeholder="e.g. $3,000 or Retainer"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Description</label>
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={editingService?.description || ''}
                        placeholder="Comprehensive description of the service..."
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm resize-none outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Icon Style</label>
                        <select
                          name="iconName"
                          defaultValue={editingService?.iconName || 'Layout'}
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm bg-white outline-none focus:border-[#EA580C] cursor-pointer"
                        >
                          <option value="Layout">Layout (UI/UX & Product Design)</option>
                          <option value="Globe">Globe (Web & Digital Presence)</option>
                          <option value="Sparkles">Sparkles (Brand Identity & Direction)</option>
                          <option value="PenTool">PenTool (Graphic & Packaging)</option>
                          <option value="Palette">Palette (Visual Arts & Guidelines)</option>
                          <option value="Package">Package (Print & Merchandise)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">
                          Custom Cover Image (Optional)
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="service-image-input"
                            name="imageUrl"
                            type="text"
                            defaultValue={editingService?.imageUrl || ''}
                            placeholder="Optional image URL or pick from media"
                            className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              openMediaModal(url => {
                                const el = document.getElementById('service-image-input') as HTMLInputElement;
                                if (el) el.value = url;
                              });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white font-semibold cursor-pointer"
                          >
                            Media
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Deliverables (comma separated)</label>
                      <input
                        name="deliverables"
                        type="text"
                        defaultValue={editingService?.deliverables?.join(', ') || ''}
                        placeholder="Logo System, Brand Guidelines, Typography"
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="enabled"
                          defaultChecked={editingService ? editingService.enabled : true}
                          className="w-4 h-4 text-[#EA580C] rounded border-zinc-300 focus:ring-[#EA580C]"
                        />
                        <span className="font-bold text-zinc-800 text-xs">Active &amp; Visible on Public Website</span>
                      </label>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsServiceFormOpen(false);
                            setEditingService(null);
                          }}
                          className="px-4 py-2 rounded-full border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white font-bold text-xs shadow transition-colors cursor-pointer"
                        >
                          {editingService ? 'Save Changes' : 'Create Service'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Services List with Reorder, Show/Hide, Edit, and Delete */}
              <div className="space-y-3">
                {([...content.services].sort((a, b) => (a.order || 0) - (b.order || 0))).map((srv, index, sortedArr) => (
                  <div 
                    key={srv.id} 
                    className={`bg-white p-5 rounded-2xl border transition-all ${
                      srv.enabled ? 'border-zinc-200 shadow-2xs' : 'border-zinc-200/60 bg-zinc-50/70 opacity-75'
                    } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            const newArr = [...sortedArr];
                            const temp = newArr[index - 1];
                            newArr[index - 1] = newArr[index];
                            newArr[index] = temp;
                            reorderServices(newArr);
                            showToast('Service order moved up.', 'info');
                          }}
                          className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                          title="Move service up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === sortedArr.length - 1}
                          onClick={() => {
                            const newArr = [...sortedArr];
                            const temp = newArr[index + 1];
                            newArr[index + 1] = newArr[index];
                            newArr[index] = temp;
                            reorderServices(newArr);
                            showToast('Service order moved down.', 'info');
                          }}
                          className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                          title="Move service down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-zinc-400">#{index + 1}</span>
                          <h4 className="text-base font-bold text-zinc-950">{srv.title}</h4>
                          <span className="text-xs font-bold text-[#EA580C] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                            {srv.startingPrice}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            srv.enabled 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-zinc-200 text-zinc-600'
                          }`}>
                            {srv.enabled ? 'Visible' : 'Hidden'}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {srv.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {srv.deliverables?.map((d, i) => (
                            <span key={i} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md font-medium">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          toggleServiceVisibility(srv.id);
                          showToast(srv.enabled ? `"${srv.title}" hidden from website.` : `"${srv.title}" visible on website.`, 'info');
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          srv.enabled
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'
                        }`}
                      >
                        {srv.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{srv.enabled ? 'Visible' : 'Hidden'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingService(srv);
                          setIsServiceFormOpen(true);
                        }}
                        className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                        title="Edit service details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setServiceToDelete(srv)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Delete service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5b: CLIENT MANAGEMENT */}
          {cmsTab === 'clients' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Client &amp; Brand Management
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Add new clients, upload client logos, edit testimonial quotes, reorder, or toggle live visibility.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingClient(null);
                    setIsClientFormOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Client</span>
                </button>
              </div>

              {/* Client Create / Edit Modal */}
              {isClientFormOpen && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-300 shadow-xl space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                    <h3 className="text-base font-bold text-zinc-900">
                      {editingClient ? `Edit "${editingClient.name}"` : 'Add New Client Partner'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsClientFormOpen(false);
                        setEditingClient(null);
                      }}
                      className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      const form = e.target as any;
                      const clientData = {
                        name: form.name.value.trim(),
                        logoUrl: form.logoUrl.value.trim() || undefined,
                        websiteUrl: form.websiteUrl.value.trim() || undefined,
                        testimonialQuote: form.testimonialQuote.value.trim(),
                        authorName: form.authorName.value.trim(),
                        authorRole: form.authorRole.value.trim(),
                        rating: parseInt(form.rating.value, 10) || 5,
                        enabled: form.enabled.checked,
                        order: editingClient ? editingClient.order : (content.brands || []).length + 1
                      };

                      if (editingClient) {
                        updateClient(editingClient.id, clientData);
                        showToast('Client partner updated.', 'success');
                      } else {
                        addClient(clientData);
                        showToast('New client partner added.', 'success');
                      }
                      setIsClientFormOpen(false);
                      setEditingClient(null);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Company / Client Name *</label>
                        <input
                          name="name"
                          type="text"
                          required
                          defaultValue={editingClient?.name || ''}
                          placeholder="e.g. Orin Retail & Goods"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Client Website URL (Optional)</label>
                        <input
                          name="websiteUrl"
                          type="url"
                          defaultValue={editingClient?.websiteUrl || ''}
                          placeholder="https://clientwebsite.com"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    {/* Logo / Image Picker */}
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">
                        Client Logo or Avatar URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="client-logo-input"
                          name="logoUrl"
                          type="text"
                          defaultValue={editingClient?.logoUrl || ''}
                          placeholder="Image URL or choose from Media Library"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            openMediaModal(url => {
                              const el = document.getElementById('client-logo-input') as HTMLInputElement;
                              if (el) el.value = url;
                            });
                          }}
                          className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold whitespace-nowrap hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          Select Image
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Contact Person Name</label>
                        <input
                          name="authorName"
                          type="text"
                          defaultValue={editingClient?.authorName || ''}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Role / Designation</label>
                        <input
                          name="authorRole"
                          type="text"
                          defaultValue={editingClient?.authorRole || ''}
                          placeholder="e.g. Founder & Creative Director"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Rating</label>
                        <select
                          name="rating"
                          defaultValue={editingClient?.rating || 5}
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm bg-white outline-none focus:border-[#EA580C] cursor-pointer"
                        >
                          <option value="5">★★★★★ (5 Stars)</option>
                          <option value="4">★★★★☆ (4 Stars)</option>
                          <option value="3">★★★☆☆ (3 Stars)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Testimonial Quote</label>
                      <textarea
                        name="testimonialQuote"
                        rows={3}
                        defaultValue={editingClient?.testimonialQuote || ''}
                        placeholder="What did the client say about your design, delivery, and collaboration?"
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm resize-none outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="enabled"
                          defaultChecked={editingClient ? editingClient.enabled : true}
                          className="w-4 h-4 text-[#EA580C] rounded border-zinc-300 focus:ring-[#EA580C]"
                        />
                        <span className="font-bold text-zinc-800 text-xs">Visible in Public Testimonials</span>
                      </label>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsClientFormOpen(false);
                            setEditingClient(null);
                          }}
                          className="px-4 py-2 rounded-full border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white font-bold text-xs shadow transition-colors cursor-pointer"
                        >
                          {editingClient ? 'Save Client Changes' : 'Create Client'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Clients List */}
              <div className="space-y-3">
                {([...(content.brands || [])].sort((a, b) => (a.order || 0) - (b.order || 0))).map((client, index, sortedArr) => (
                  <div
                    key={client.id}
                    className={`bg-white p-5 rounded-2xl border transition-all ${
                      client.enabled ? 'border-zinc-200 shadow-2xs' : 'border-zinc-200/60 bg-zinc-50/70 opacity-75'
                    } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            const newArr = [...sortedArr];
                            const temp = newArr[index - 1];
                            newArr[index - 1] = newArr[index];
                            newArr[index] = temp;
                            reorderClients(newArr);
                            showToast('Client moved up.', 'info');
                          }}
                          className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === sortedArr.length - 1}
                          onClick={() => {
                            const newArr = [...sortedArr];
                            const temp = newArr[index + 1];
                            newArr[index + 1] = newArr[index];
                            newArr[index] = temp;
                            reorderClients(newArr);
                            showToast('Client moved down.', 'info');
                          }}
                          className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 text-zinc-700 transition-colors cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Logo or Initials */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 shrink-0 flex items-center justify-center p-1">
                        {client.logoUrl ? (
                          <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-extrabold text-[#EA580C] text-sm">
                            {client.name.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-zinc-400">#{index + 1}</span>
                          <h4 className="text-base font-bold text-zinc-950">{client.name}</h4>
                          <span className="text-xs font-bold text-amber-500">
                            {'★'.repeat(client.rating || 5)}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-2 italic">
                          &quot;{client.testimonialQuote}&quot;
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Contact: <strong>{client.authorName}</strong> ({client.authorRole})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          toggleClientVisibility(client.id);
                          showToast(client.enabled ? `"${client.name}" hidden.` : `"${client.name}" visible.`, 'info');
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          client.enabled
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'
                        }`}
                      >
                        {client.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{client.enabled ? 'Visible' : 'Hidden'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingClient(client);
                          setIsClientFormOpen(true);
                        }}
                        className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                        title="Edit client"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setClientToDelete(client)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Delete client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: NAVIGATION */}
          {cmsTab === 'navigation' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Navigation &amp; Menu Manager
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Manage the website header links, order, targets, and visibility.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newItem: CmsNavigationItem = {
                      id: `nav-${Date.now()}`,
                      label: 'Custom Link',
                      target: '#',
                      enabled: true,
                      order: content.navigation.length + 1
                    };
                    updateNavigation([...content.navigation, newItem]);
                    showToast('New menu item added.', 'success');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Menu Link</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xs divide-y divide-zinc-100">
                {content.navigation.map((item, idx) => (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-600 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={e => {
                            const newNav = content.navigation.map(n => n.id === item.id ? { ...n, label: e.target.value } : n);
                            updateNavigation(newNav);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-900"
                        />
                        <input
                          type="text"
                          value={item.target}
                          onChange={e => {
                            const newNav = content.navigation.map(n => n.id === item.id ? { ...n, target: e.target.value } : n);
                            updateNavigation(newNav);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-600 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          const newNav = content.navigation.map(n => n.id === item.id ? { ...n, enabled: !n.enabled } : n);
                          updateNavigation(newNav);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                          item.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {item.enabled ? 'Enabled' : 'Disabled'}
                      </button>

                      <button
                        onClick={() => {
                          const newNav = content.navigation.filter(n => n.id !== item.id);
                          updateNavigation(newNav);
                        }}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MEDIA ASSETS LIBRARY */}
          {cmsTab === 'media' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Media Asset Library
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Upload images and videos, preview files, filter by type, and check live website section usage.
                  </p>
                </div>

                <button
                  onClick={() => openMediaModal(() => {})}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Open Full Uploader</span>
                </button>
              </div>

              {/* Type Filter & Search */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMediaTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      mediaTypeFilter === 'all' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    All Media ({mediaItems.length})
                  </button>
                  <button
                    onClick={() => setMediaTypeFilter('image')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      mediaTypeFilter === 'image' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Images ({mediaItems.filter(m => !m.mimeType?.startsWith('video/') && !/\.(mp4|webm|mov)$/i.test(m.url)).length})
                  </button>
                  <button
                    onClick={() => setMediaTypeFilter('video')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      mediaTypeFilter === 'video' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Videos ({mediaItems.filter(m => m.mimeType?.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(m.url)).length})
                  </button>
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search media files..."
                    value={mediaSearchQuery}
                    onChange={e => setMediaSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Dropzone */}
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={async e => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    await uploadMediaFiles(Array.from(e.dataTransfer.files));
                  }
                }}
                className="p-8 border-2 border-dashed border-zinc-300 rounded-3xl bg-white text-center flex flex-col items-center justify-center hover:border-[#EA580C] transition-colors cursor-pointer"
                onClick={() => openMediaModal(() => {})}
              >
                <Upload className="w-10 h-10 text-zinc-400 mb-2" />
                <h4 className="text-sm font-bold text-zinc-800">Drag &amp; drop images or videos here to upload</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Supports JPG, PNG, WebP, SVG, MP4, WebM with persistent server storage</p>
              </div>

              {/* Media Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaItems
                  .filter(m => {
                    const isVid = m.mimeType?.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(m.url);
                    if (mediaTypeFilter === 'image') return !isVid;
                    if (mediaTypeFilter === 'video') return isVid;
                    return true;
                  })
                  .filter(m => m.filename.toLowerCase().includes(mediaSearchQuery.toLowerCase()))
                  .map(item => {
                    const isVid = item.mimeType?.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(item.url);
                    const usages = checkMediaUsage(item.url);

                    return (
                      <div key={item.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-2xs group flex flex-col justify-between">
                        <div className="aspect-square bg-zinc-900 relative">
                          {isVid ? (
                            <video src={item.url} muted playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                          )}

                          {usages.length > 0 && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[9px] font-bold z-10">
                              In Use ({usages.length})
                            </span>
                          )}

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                showToast('URL copied to clipboard!', 'success');
                              }}
                              className="p-2 rounded-xl bg-white text-zinc-800 hover:text-[#EA580C] shadow cursor-pointer"
                              title="Copy URL"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setMediaToDelete(item)}
                              className="p-2 rounded-xl bg-white text-red-600 hover:bg-red-50 shadow transition-colors cursor-pointer"
                              title="Delete media file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="p-3">
                          <p className="text-xs font-bold text-zinc-900 truncate" title={item.filename}>{item.filename}</p>
                          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{(item.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>
          )}

          {/* TAB 8: CONTACT & SOCIAL */}
          {cmsTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Contact Channels &amp; Social Links
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Manage direct contact links for Telegram, Facebook, Phone, and social platforms.
                  </p>
                </div>

                <button
                  onClick={() => saveDraft()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Contact Details</span>
                </button>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-2xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
                    Primary Instant Contact (Bottom of Site)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                        Telegram (Link or Username)
                      </label>
                      <input
                        type="text"
                        value={content.contact.telegram}
                        onChange={e => updateContact({ telegram: e.target.value })}
                        placeholder="https://t.me/limbunterm or @username"
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                        Facebook (Profile or Page URL)
                      </label>
                      <input
                        type="text"
                        value={content.contact.facebook}
                        onChange={e => updateContact({ facebook: e.target.value })}
                        placeholder="https://facebook.com/limbunterm"
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                        Direct Phone Number
                      </label>
                      <input
                        type="text"
                        value={content.contact.phone}
                        onChange={e => updateContact({ phone: e.target.value })}
                        placeholder="+855 12 345 678"
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
                    Email, Address &amp; Social Platforms
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Studio Email</label>
                      <input
                        type="email"
                        value={content.contact.email}
                        onChange={e => updateContact({ email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Operating / Working Hours</label>
                      <input
                        type="text"
                        value={content.contact.workingHours}
                        onChange={e => updateContact({ workingHours: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Physical Studio Address</label>
                      <input
                        type="text"
                        value={content.contact.address}
                        onChange={e => updateContact({ address: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Google Maps Link</label>
                      <input
                        type="text"
                        value={content.contact.googleMapsUrl}
                        onChange={e => updateContact({ googleMapsUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 9: WEBSITE SETTINGS */}
          {cmsTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Website Settings &amp; Legal
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Configure website title, description, logo, footer text, and legal terms.
                  </p>
                </div>

                <button
                  onClick={() => saveDraft()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Settings</span>
                </button>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-2xs space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                      Website Name / Brand Title *
                    </label>
                    <input
                      type="text"
                      value={content.settings.siteName}
                      onChange={e => updateSettings({ siteName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                      Header Badge Text
                    </label>
                    <input
                      type="text"
                      value={content.settings.badgeText}
                      onChange={e => updateSettings({ badgeText: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={content.settings.siteDescription}
                    onChange={e => updateSettings({ siteDescription: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: INQUIRIES */}
          {cmsTab === 'inquiries' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                    Client Inquiries &amp; Project Briefs
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Manage client submissions from the public website contact form.
                  </p>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-800 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Export to CSV</span>
                </button>
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200">
                <div className="flex items-center gap-2">
                  {(['All', 'New', 'In Discussion', 'Booked', 'Archived'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setInquiryFilter(filter)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        inquiryFilter === filter
                          ? 'bg-zinc-900 text-white shadow-2xs'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search client name..."
                    value={inquirySearch}
                    onChange={e => setInquirySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Inquiries List */}
              <div className="space-y-3">
                {inquiries
                  .filter(i => (inquiryFilter === 'All' ? true : i.status === inquiryFilter))
                  .filter(i => 
                    i.clientName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                    i.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                    (i.company && i.company.toLowerCase().includes(inquirySearch.toLowerCase()))
                  )
                  .map(inquiry => (
                    <div
                      key={inquiry.id}
                      className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-zinc-950">{inquiry.clientName}</h4>
                            <span className="text-xs text-zinc-500">• {inquiry.email}</span>
                            {inquiry.company && (
                              <span className="text-xs font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-md">
                                {inquiry.company}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Received on {inquiry.date} • Service: <strong className="text-zinc-700">{inquiry.service}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={inquiry.status}
                            onChange={e => updateInquiryStatus(inquiry.id, e.target.value as InquiryStatus)}
                            className="px-3 py-1 rounded-full text-xs font-bold border border-zinc-300 bg-zinc-50 outline-none cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Booked">Booked</option>
                            <option value="Archived">Archived</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => setInquiryToDelete(inquiry)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-700 leading-relaxed">
                        &quot;{inquiry.message}&quot;
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                        <span>Timeline: <strong>{inquiry.timeline}</strong></span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 11: SECURITY & ACCOUNT */}
          {cmsTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-zinc-200">
                <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                  Security &amp; Admin Access
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Change administrator username, email, and password.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-2xs max-w-xl space-y-6">
                {securitySuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Credentials updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSecuritySubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Admin Username</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Admin Email</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div className="pt-2 border-t border-zinc-100">
                    <label className="block font-bold text-zinc-700 uppercase mb-1">New Password (optional)</label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep existing password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">
                      Current Password (Required for confirmation) *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white font-bold shadow transition-colors cursor-pointer"
                    >
                      Update Credentials
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Confirmation Dialogs for Permanent Deletion */}
      <ConfirmDeleteModal
        isOpen={!!serviceToDelete}
        title="Service"
        itemName={serviceToDelete?.title || ''}
        onCancel={() => setServiceToDelete(null)}
        onConfirm={() => {
          if (serviceToDelete) {
            deleteService(serviceToDelete.id);
            setServiceToDelete(null);
            showToast('Service permanently deleted from database.', 'info');
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={!!clientToDelete}
        title="Client Partner"
        itemName={clientToDelete?.name || ''}
        onCancel={() => setClientToDelete(null)}
        onConfirm={() => {
          if (clientToDelete) {
            deleteClient(clientToDelete.id);
            setClientToDelete(null);
            showToast('Client permanently deleted from database.', 'info');
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={!!categoryToDelete}
        title="Category"
        itemName={categoryToDelete?.name || ''}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={() => {
          if (categoryToDelete) {
            deleteCategory(categoryToDelete.id);
            setCategoryToDelete(null);
            showToast('Category deleted. Any assigned projects were safely reassigned.', 'info');
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={!!productToDelete}
        title="Project"
        itemName={productToDelete?.title || ''}
        onCancel={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
            showToast('Project permanently removed from database.', 'info');
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={!!slideToDelete}
        title="Hero Slide"
        itemName={slideToDelete?.caption || slideToDelete?.alt || 'Slide'}
        onCancel={() => setSlideToDelete(null)}
        onConfirm={() => {
          if (slideToDelete) {
            deleteHeroSlide(slideToDelete.id);
            setSlideToDelete(null);
            showToast('Slide removed from Hero banner.', 'info');
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={!!sectionToDelete}
        title="Custom Section"
        itemName={sectionToDelete?.name || ''}
        onCancel={() => setSectionToDelete(null)}
        onConfirm={() => {
          if (sectionToDelete) {
            deleteSection(sectionToDelete.id);
            setSectionToDelete(null);
            showToast('Custom section deleted.', 'info');
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={!!inquiryToDelete}
        title="Client Inquiry"
        itemName={inquiryToDelete ? `${inquiryToDelete.clientName} (${inquiryToDelete.email})` : ''}
        onCancel={() => setInquiryToDelete(null)}
        onConfirm={() => {
          if (inquiryToDelete) {
            deleteInquiry(inquiryToDelete.id);
            setInquiryToDelete(null);
            showToast('Inquiry permanently removed.', 'info');
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={!!mediaToDelete}
        title="Media Asset"
        itemName={mediaToDelete?.filename || ''}
        warningTitle={mediaToDelete && checkMediaUsage(mediaToDelete.url).length > 0 ? `Warning: In use by ${checkMediaUsage(mediaToDelete.url).length} website section(s)!` : undefined}
        warningList={mediaToDelete ? checkMediaUsage(mediaToDelete.url) : []}
        onCancel={() => setMediaToDelete(null)}
        onConfirm={() => {
          if (mediaToDelete) {
            deleteMediaItem(mediaToDelete.id);
            setMediaToDelete(null);
            showToast('Media file permanently deleted.', 'info');
          }
        }}
      />

    </div>
  );
};
