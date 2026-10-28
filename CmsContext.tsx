import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  CmsFullContent, 
  CmsProduct, 
  CmsSection, 
  CmsService, 
  CmsNavigationItem, 
  CmsMediaItem, 
  CmsInquiry, 
  AdminUser, 
  WebsiteSettings, 
  ContactSettings, 
  HeroContent, 
  HeroSlide,
  HeroSlideshowConfig,
  AboutContent, 
  CtaContent,
  CmsCategory,
  CmsBrand,
  ProjectLayoutType,
  InquiryStatus
} from '../types/cms';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface CmsContextType {
  // Content & Modes
  content: CmsFullContent;
  setContent: React.Dispatch<React.SetStateAction<CmsFullContent>>;
  isDraftMode: boolean;
  setIsDraftMode: (mode: boolean) => void;
  hasUnpublishedChanges: boolean;
  isLoading: boolean;
  totalViews: number;

  // View & CMS Navigation
  currentView: 'portfolio' | 'cms_dashboard';
  setCurrentView: (view: 'portfolio' | 'cms_dashboard') => void;
  cmsTab: 'overview' | 'homepage' | 'sections' | 'products' | 'services' | 'clients' | 'navigation' | 'media' | 'contact' | 'settings' | 'inquiries' | 'security';
  setCmsTab: (tab: any) => void;
  jumpToEditSection: (sectionId: string) => void;

  // Authentication
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  login: (identifier: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateCredentials: (currPass: string, newUsername: string, newEmail: string, newPass?: string) => Promise<void>;

  // Save / Publish System
  saveDraft: (contentOverride?: Partial<CmsFullContent>) => Promise<boolean>;
  publishLive: () => Promise<boolean>;
  revertDraft: () => Promise<boolean>;
  isSaving: boolean;
  isPublishing: boolean;

  // Quick Partial Updaters
  updateSettings: (updates: Partial<WebsiteSettings>) => void;
  updateContact: (updates: Partial<ContactSettings>) => void;
  updateHero: (updates: Partial<HeroContent>) => void;
  updateAbout: (updates: Partial<AboutContent>) => void;
  updateCta: (updates: Partial<CtaContent>) => void;
  updateNavigation: (items: CmsNavigationItem[]) => void;
  updateSection: (sectionId: string, updates: Partial<CmsSection>) => void;
  reorderSections: (newSections: CmsSection[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  deleteSection: (sectionId: string) => void;
  addSection: (newSec: CmsSection) => void;

  // Hero Slideshow Management
  addHeroSlide: (url: string, alt?: string) => void;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (slides: HeroSlide[]) => void;
  updateHeroSlideshowConfig: (updates: Partial<HeroSlideshowConfig>) => void;

  // Products (Works)
  updateProduct: (id: string, updates: Partial<CmsProduct>) => void;
  addProduct: (product: Omit<CmsProduct, 'id' | 'views' | 'likes'>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (products: CmsProduct[]) => void;
  toggleProductVisibility: (id: string) => void;
  toggleProductFeatured: (id: string) => void;
  setProjectDisplayLayout: (layout: ProjectLayoutType) => void;
  selectedProductForDetail: CmsProduct | null;
  setSelectedProductForDetail: (prod: CmsProduct | null) => void;

  // Categories
  addCategory: (name: string, slug?: string) => void;
  updateCategory: (id: string, updates: Partial<CmsCategory>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (newCats: CmsCategory[]) => void;

  // Clients / Brands
  addClient: (client: Omit<CmsBrand, 'id'>) => void;
  updateClient: (id: string, updates: Partial<CmsBrand>) => void;
  deleteClient: (id: string) => void;
  reorderClients: (newClients: CmsBrand[]) => void;
  toggleClientVisibility: (id: string) => void;

  // Services
  updateService: (id: string, updates: Partial<CmsService>) => void;
  addService: (service: Omit<CmsService, 'id'>) => void;
  deleteService: (id: string) => void;
  reorderServices: (newServices: CmsService[]) => void;
  toggleServiceVisibility: (serviceId: string) => void;

  // Media Library
  mediaItems: CmsMediaItem[];
  fetchMedia: () => Promise<void>;
  uploadMediaFiles: (files: File[]) => Promise<CmsMediaItem[]>;
  deleteMediaItem: (id: string) => Promise<void>;
  checkMediaUsage: (mediaUrl: string) => string[];
  isMediaModalOpen: boolean;
  openMediaModal: (onSelect: (url: string) => void) => void;
  closeMediaModal: () => void;
  selectMediaCallback: ((url: string) => void) | null;

  // Inquiries
  inquiries: CmsInquiry[];
  submitClientInquiry: (data: { clientName: string; email: string; company?: string; service: string; budget: string; timeline: string; message: string }) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus, notes?: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  selectedServiceForInquiry: string;
  setSelectedServiceForInquiry: (service: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<CmsFullContent | null>(null);
  const [isDraftMode, setIsDraftMode] = useState<boolean>(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalViews, setTotalViews] = useState<number>(13240);
  const [currentView, setCurrentView] = useState<'portfolio' | 'cms_dashboard'>('portfolio');
  const [cmsTab, setCmsTab] = useState<any>('overview');

  // Authentication
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('cms_admin_token');
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('cms_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Modals & Selectors
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectMediaCallback, setSelectMediaCallback] = useState<((url: string) => void) | null>(null);
  const [mediaItems, setMediaItems] = useState<CmsMediaItem[]>([]);
  const [inquiries, setInquiries] = useState<CmsInquiry[]>([]);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<CmsProduct | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState('Brand Identity');

  // Saving / Publishing Flags
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch Public or Draft Content
  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      if (adminToken && isDraftMode) {
        // Fetch draft content from server
        const res = await fetch('/api/admin/content', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const json = await res.json();
          setContent(json.data);
          setHasUnpublishedChanges(json.hasUnpublishedChanges);
          setIsLoading(false);
          return;
        }
      }

      // Default: fetch public published content
      const res = await fetch('/api/public/content');
      if (res.ok) {
        const json = await res.json();
        setContent(json.data);
        if (json.totalViews) setTotalViews(json.totalViews);
      }
    } catch (err) {
      console.error('Failed to fetch CMS content:', err);
    } finally {
      setIsLoading(false);
    }
  }, [adminToken, isDraftMode]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Fetch Media Items
  const fetchMedia = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/media', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setMediaItems(json.data);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    }
  }, [adminToken]);

  // Fetch Inquiries
  const fetchInquiries = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setInquiries(json.data);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      fetchMedia();
      fetchInquiries();
    }
  }, [adminToken, fetchMedia, fetchInquiries]);

  // Login handler
  const login = async (identifier: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Login failed', 'error');
        return false;
      }

      setAdminToken(data.token);
      setAdminUser(data.user);
      localStorage.setItem('cms_admin_token', data.token);
      localStorage.setItem('cms_admin_user', JSON.stringify(data.user));
      setIsLoginModalOpen(false);
      showToast(`Welcome back, ${data.user.username}! Admin privileges enabled.`, 'success');

      // Switch to draft mode so admin sees working changes
      setIsDraftMode(true);
      return true;
    } catch {
      showToast('Connection error during login.', 'error');
      return false;
    }
  };

  const logout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('cms_admin_token');
    localStorage.removeItem('cms_admin_user');
    setIsDraftMode(false);
    setCurrentView('portfolio');
    showToast('Logged out of Admin Dashboard.', 'info');
  };

  const updateCredentials = async (currPass: string, newUsername: string, newEmail: string, newPass?: string) => {
    if (!adminToken) return;
    const res = await fetch('/api/auth/change-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        currentPassword: currPass,
        newUsername,
        newEmail,
        newPassword: newPass
      })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Failed to update credentials.', 'error');
      throw new Error(data.error);
    }

    setAdminUser(data.user);
    localStorage.setItem('cms_admin_user', JSON.stringify(data.user));
    showToast('Account credentials successfully updated!', 'success');
  };

  // Save Draft (saves current in-memory content to server draft)
  const saveDraft = async (contentOverride?: Partial<CmsFullContent>): Promise<boolean> => {
    if (!adminToken) {
      setIsLoginModalOpen(true);
      return false;
    }
    setIsSaving(true);
    const toSave = contentOverride ? { ...content, ...contentOverride } : content;
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(toSave)
      });
      const data = await res.json();
      if (res.ok) {
        setHasUnpublishedChanges(true);
        showToast('Draft saved successfully! Ready to preview or publish.', 'success');
        return true;
      } else {
        showToast(data.error || 'Failed to save draft.', 'error');
        return false;
      }
    } catch {
      showToast('Network error while saving draft.', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Live (pushes draft to public website)
  const publishLive = async (): Promise<boolean> => {
    if (!adminToken) {
      setIsLoginModalOpen(true);
      return false;
    }
    setIsPublishing(true);
    try {
      // First save current content as draft
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(content)
      });

      // Now publish
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setHasUnpublishedChanges(false);
        showToast('🚀 Website Published! Changes are now live for all visitors.', 'success');
        return true;
      } else {
        showToast(data.error || 'Failed to publish website.', 'error');
        return false;
      }
    } catch {
      showToast('Network error while publishing.', 'error');
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  // Revert Draft
  const revertDraft = async (): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch('/api/admin/revert', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setContent(data.data);
        setHasUnpublishedChanges(false);
        showToast('Draft changes reverted to published state.', 'info');
        return true;
      }
      return false;
    } catch {
      showToast('Error reverting draft.', 'error');
      return false;
    }
  };

  // Quick Partial Updaters that update memory state and mark changes
  const updateSettings = (updates: Partial<WebsiteSettings>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return { ...prev, settings: { ...prev.settings, ...updates } };
    });
    setHasUnpublishedChanges(true);
  };

  const updateContact = (updates: Partial<ContactSettings>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return { ...prev, contact: { ...prev.contact, ...updates } };
    });
    setHasUnpublishedChanges(true);
  };

  const updateHero = (updates: Partial<HeroContent>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return { ...prev, hero: { ...prev.hero, ...updates } };
    });
    setHasUnpublishedChanges(true);
  };

  const updateAbout = (updates: Partial<AboutContent>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return { ...prev, about: { ...prev.about, ...updates } };
    });
    setHasUnpublishedChanges(true);
  };

  const updateCta = (updates: Partial<CtaContent>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return { ...prev, cta: { ...prev.cta, ...updates } };
    });
    setHasUnpublishedChanges(true);
  };

  const updateNavigation = (items: CmsNavigationItem[]) => {
    setContent(prev => {
      if (!prev) return prev!;
      return { ...prev, navigation: items };
    });
    setHasUnpublishedChanges(true);
  };

  const updateSection = (sectionId: string, updates: Partial<CmsSection>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        sections: prev.sections.map(s => (s.id === sectionId ? { ...s, ...updates } : s))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const reorderSections = (newSections: CmsSection[]) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        sections: newSections.map((s, idx) => ({ ...s, order: idx + 1 }))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        sections: prev.sections.map(s => (s.id === sectionId ? { ...s, enabled: !s.enabled } : s))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const deleteSection = (sectionId: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId)
      };
    });
    setHasUnpublishedChanges(true);
  };

  const addSection = (newSec: CmsSection) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        sections: [...prev.sections, newSec]
      };
    });
    setHasUnpublishedChanges(true);
  };

  // Products
  const updateProduct = (id: string, updates: Partial<CmsProduct>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        products: prev.products.map(p => (p.id === id ? { ...p, ...updates } : p))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const addProduct = (productData: Omit<CmsProduct, 'id' | 'views' | 'likes'>) => {
    const newProd: CmsProduct = {
      ...productData,
      id: `proj-${Date.now()}`,
      views: 1,
      likes: 0
    };
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        products: [newProd, ...prev.products]
      };
    });
    setHasUnpublishedChanges(true);
  };

  const deleteProduct = (id: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        products: prev.products.filter(p => p.id !== id)
      };
    });
    setHasUnpublishedChanges(true);
  };

  const reorderProducts = (newProducts: CmsProduct[]) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        products: newProducts.map((p, idx) => ({ ...p, order: idx + 1 }))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const toggleProductVisibility = (id: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        products: prev.products.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const toggleProductFeatured = (id: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        products: prev.products.map(p => (p.id === id ? { ...p, featured: !p.featured } : p))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const setProjectDisplayLayout = (layout: ProjectLayoutType) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        projectDisplayLayout: layout
      };
    });
    setHasUnpublishedChanges(true);
  };

  // Hero Slideshow Management
  const addHeroSlide = (url: string, alt?: string, caption?: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      const currentSlides = prev.hero.slides || [];
      const newSlide: HeroSlide = {
        id: `slide-${Date.now()}-${Math.round(Math.random() * 1000)}`,
        url,
        alt: alt || 'Studio Showcase Graphic',
        caption: caption || '',
        order: currentSlides.length + 1
      };
      const updatedSlides = [...currentSlides, newSlide];
      return {
        ...prev,
        hero: {
          ...prev.hero,
          portraitImage: prev.hero.portraitImage || url,
          slides: updatedSlides
        }
      };
    });
    setHasUnpublishedChanges(true);
  };

  const updateHeroSlide = (id: string, updates: Partial<HeroSlide>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slides: (prev.hero.slides || []).map(s => (s.id === id ? { ...s, ...updates } : s))
        }
      };
    });
    setHasUnpublishedChanges(true);
  };

  const deleteHeroSlide = (id: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      const filtered = (prev.hero.slides || []).filter(s => s.id !== id);
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slides: filtered.map((s, idx) => ({ ...s, order: idx + 1 })),
          portraitImage: filtered.length > 0 ? filtered[0].url : prev.hero.portraitImage
        }
      };
    });
    setHasUnpublishedChanges(true);
  };

  const reorderHeroSlides = (newSlides: HeroSlide[]) => {
    setContent(prev => {
      if (!prev) return prev!;
      const reordered = newSlides.map((s, idx) => ({ ...s, order: idx + 1 }));
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slides: reordered,
          portraitImage: reordered.length > 0 ? reordered[0].url : prev.hero.portraitImage
        }
      };
    });
    setHasUnpublishedChanges(true);
  };

  const updateHeroSlideshowConfig = (updates: Partial<HeroSlideshowConfig>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slideshowConfig: {
            ...prev.hero.slideshowConfig,
            ...updates
          }
        }
      };
    });
    setHasUnpublishedChanges(true);
  };

  // Categories Management
  const addCategory = (name: string, slug?: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      const existing = prev.categories || [];
      const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newCat: CmsCategory = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        slug: cleanSlug || `cat-${Date.now()}`,
        enabled: true,
        order: existing.length + 1
      };
      return {
        ...prev,
        categories: [...existing, newCat]
      };
    });
    setHasUnpublishedChanges(true);
  };

  const updateCategory = (id: string, updates: Partial<CmsCategory>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        categories: (prev.categories || []).map(c => (c.id === id ? { ...c, ...updates } : c))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const deleteCategory = (id: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      const catToDelete = (prev.categories || []).find(c => c.id === id);
      if (!catToDelete) return prev;
      return {
        ...prev,
        categories: (prev.categories || []).filter(c => c.id !== id),
        products: prev.products.map(p => (p.category === catToDelete.name ? { ...p, category: 'Graphic Design' } : p))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const reorderCategories = (newCats: CmsCategory[]) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        categories: newCats.map((c, idx) => ({ ...c, order: idx + 1 }))
      };
    });
    setHasUnpublishedChanges(true);
  };

  // Clients / Brands Management
  const addClient = (clientData: Omit<CmsBrand, 'id'>) => {
    setContent(prev => {
      if (!prev) return prev!;
      const existing = prev.brands || [];
      const newClient: CmsBrand = {
        ...clientData,
        id: `brand-${Date.now()}`,
        order: existing.length + 1
      };
      return {
        ...prev,
        brands: [...existing, newClient]
      };
    });
    setHasUnpublishedChanges(true);
  };

  const updateClient = (id: string, updates: Partial<CmsBrand>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        brands: (prev.brands || []).map(b => (b.id === id ? { ...b, ...updates } : b))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const deleteClient = (id: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        brands: (prev.brands || []).filter(b => b.id !== id)
      };
    });
    setHasUnpublishedChanges(true);
  };

  const reorderClients = (newClients: CmsBrand[]) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        brands: newClients.map((b, idx) => ({ ...b, order: idx + 1 }))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const toggleClientVisibility = (id: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        brands: (prev.brands || []).map(b => (b.id === id ? { ...b, enabled: !b.enabled } : b))
      };
    });
    setHasUnpublishedChanges(true);
  };

  // Check Media Usage across all website sections
  const checkMediaUsage = (mediaUrl: string): string[] => {
    if (!content || !mediaUrl) return [];
    const usages: string[] = [];

    // Hero banner
    if (content.hero?.portraitImage === mediaUrl) {
      usages.push('Hero Banner (Primary Portrait)');
    }
    content.hero?.slides?.forEach((slide, idx) => {
      if (slide.url === mediaUrl) {
        usages.push(`Hero Banner (Slide #${idx + 1})`);
      }
    });

    // Products
    content.products?.forEach(p => {
      if (p.image === mediaUrl) {
        usages.push(`Project: "${p.title}" (Cover Visual)`);
      }
      if (p.gallery?.includes(mediaUrl)) {
        usages.push(`Project: "${p.title}" (Gallery Asset)`);
      }
    });

    // Services
    content.services?.forEach(s => {
      if (s.imageUrl === mediaUrl) {
        usages.push(`Service: "${s.title}" (Cover Image)`);
      }
    });

    // Clients
    content.brands?.forEach(b => {
      if (b.logoUrl === mediaUrl) {
        usages.push(`Client: "${b.name}" (Logo / Brand Image)`);
      }
    });

    // Website Settings
    if (content.settings?.logoUrl === mediaUrl) {
      usages.push('Website Settings (Brand Logo)');
    }
    if (content.settings?.faviconUrl === mediaUrl) {
      usages.push('Website Settings (Favicon)');
    }

    return usages;
  };

  // Services
  const updateService = (id: string, updates: Partial<CmsService>) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        services: prev.services.map(s => (s.id === id ? { ...s, ...updates } : s))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const addService = (serviceData: Omit<CmsService, 'id'>) => {
    const newService: CmsService = {
      ...serviceData,
      id: `srv-${Date.now()}`
    };
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        services: [...prev.services, newService]
      };
    });
    setHasUnpublishedChanges(true);
  };

  const deleteService = (id: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        services: prev.services.filter(s => s.id !== id)
      };
    });
    setHasUnpublishedChanges(true);
  };

  const reorderServices = (newServices: CmsService[]) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        services: newServices.map((s, idx) => ({ ...s, order: idx + 1 }))
      };
    });
    setHasUnpublishedChanges(true);
  };

  const toggleServiceVisibility = (serviceId: string) => {
    setContent(prev => {
      if (!prev) return prev!;
      return {
        ...prev,
        services: prev.services.map(s => (s.id === serviceId ? { ...s, enabled: !s.enabled } : s))
      };
    });
    setHasUnpublishedChanges(true);
  };

  // Media Library Upload with client compression helper
  const uploadMediaFiles = async (files: File[]): Promise<CmsMediaItem[]> => {
    if (!adminToken) {
      showToast('Admin login required to upload images.', 'error');
      return [];
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setMediaItems(prev => [...data.data, ...prev]);
        showToast(`Uploaded ${data.data.length} image(s) to Media Library.`, 'success');
        return data.data;
      } else {
        showToast(data.error || 'Image upload failed.', 'error');
        return [];
      }
    } catch {
      showToast('Network error while uploading images.', 'error');
      return [];
    }
  };

  const deleteMediaItem = async (id: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setMediaItems(prev => prev.filter(m => m.id !== id));
        showToast('Image removed from Media Library.', 'info');
      }
    } catch {
      showToast('Error deleting image.', 'error');
    }
  };

  const openMediaModal = (onSelect: (url: string) => void) => {
    setSelectMediaCallback(() => onSelect);
    setIsMediaModalOpen(true);
  };

  const closeMediaModal = () => {
    setIsMediaModalOpen(false);
    setSelectMediaCallback(null);
  };

  // Inquiries
  const submitClientInquiry = async (data: { clientName: string; email: string; company?: string; service: string; budget: string; timeline: string; message: string }) => {
    const res = await fetch('/api/public/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) {
      showToast(json.error || 'Failed to submit inquiry.', 'error');
      throw new Error(json.error);
    }
    showToast('Your project brief has been submitted successfully!', 'success');
    if (adminToken) {
      fetchInquiries();
    }
  };

  const updateInquiryStatus = async (id: string, status: InquiryStatus, notes?: string) => {
    if (!adminToken) return;
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status, notes })
    });
    if (res.ok) {
      setInquiries(prev => prev.map(i => (i.id === id ? { ...i, status, notes: notes !== undefined ? notes : i.notes } : i)));
      showToast('Inquiry status updated.', 'success');
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!adminToken) return;
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.ok) {
      setInquiries(prev => prev.filter(i => i.id !== id));
      showToast('Inquiry deleted.', 'info');
    }
  };

  const jumpToEditSection = (sectionId: string) => {
    if (!adminToken) {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentView('cms_dashboard');
    if (sectionId === 'sec-hero') setCmsTab('homepage');
    else if (sectionId === 'sec-projects') setCmsTab('products');
    else if (sectionId === 'sec-services') setCmsTab('services');
    else if (sectionId === 'sec-contact') setCmsTab('contact');
    else setCmsTab('sections');
  };

  return (
    <CmsContext.Provider
      value={{
        content: content!,
        setContent: setContent as any,
        isDraftMode,
        setIsDraftMode,
        hasUnpublishedChanges,
        isLoading,
        totalViews,
        currentView,
        setCurrentView,
        cmsTab,
        setCmsTab,
        jumpToEditSection,
        isAdminLoggedIn: !!adminToken,
        adminUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        login,
        logout,
        updateCredentials,
        saveDraft,
        publishLive,
        revertDraft,
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
        selectedProductForDetail,
        setSelectedProductForDetail,
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
        fetchMedia,
        uploadMediaFiles,
        deleteMediaItem,
        checkMediaUsage,
        isMediaModalOpen,
        openMediaModal,
        closeMediaModal,
        selectMediaCallback,
        inquiries,
        submitClientInquiry,
        updateInquiryStatus,
        deleteInquiry,
        isContactModalOpen,
        setIsContactModalOpen,
        selectedServiceForInquiry,
        setSelectedServiceForInquiry,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
