import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Inquiry, InquiryStatus, ServiceItem, StudioProfile } from '../types';
import { INITIAL_PROJECTS, INITIAL_INQUIRIES, SERVICES_LIST, INITIAL_STUDIO_PROFILE } from '../data/initialData';

interface PortfolioContextType {
  currentView: 'portfolio' | 'dashboard';
  setCurrentView: (view: 'portfolio' | 'dashboard') => void;
  openForWork: boolean;
  setOpenForWork: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Projects
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  likeProject: (id: string) => void;
  incrementProjectViews: (id: string) => void;
  addProject: (newProject: Omit<Project, 'id' | 'views' | 'likes'>) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Editing Modals
  editingProject: Project | null;
  setEditingProject: (project: Project | null) => void;
  isProjectEditorOpen: boolean;
  setIsProjectEditorOpen: (open: boolean) => void;
  isStudioProfileEditorOpen: boolean;
  setIsStudioProfileEditorOpen: (open: boolean) => void;

  // Studio Profile
  studioProfile: StudioProfile;
  updateStudioProfile: (updated: Partial<StudioProfile>) => void;

  // Owner Mode & Security (View-Only vs Owner Editing)
  isOwnerMode: boolean;
  setIsOwnerMode: (mode: boolean) => void;
  isPinModalOpen: boolean;
  setIsPinModalOpen: (open: boolean) => void;
  ownerPin: string;
  setOwnerPin: (pin: string) => void;
  unlockOwnerMode: (pin: string) => boolean;
  lockOwnerMode: () => void;

  // Inquiries
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  selectedServiceForInquiry: string;
  openContactWithService: (serviceName?: string) => void;
  inquiries: Inquiry[];
  addInquiry: (inquiryData: {
    clientName: string;
    email: string;
    company?: string;
    service: string;
    budget: string;
    timeline: string;
    message: string;
  }) => void;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  deleteInquiry: (id: string) => void;
  exportInquiriesCSV: () => void;
  simulateVisitor: () => void;
  totalPortfolioViews: number;
  unreadInquiriesCount: number;
  activeServicePreview: ServiceItem | null;
  setActiveServicePreview: (service: ServiceItem | null) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'portfolio' | 'dashboard'>('portfolio');
  const [openForWork, setOpenForWork] = useState<boolean>(true);

  // Owner authentication state: View-Only by default unless authenticated
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(() => {
    try {
      // If URL explicitly forces view-only
      if (typeof window !== 'undefined' && window.location.search.includes('readonly=true')) {
        return false;
      }
      const saved = localStorage.getItem('talmeez_is_owner');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [ownerPin, setOwnerPin] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('talmeez_owner_pin');
      return saved || '1234';
    } catch {
      return '1234';
    }
  });

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('talmeez_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Studio Profile state
  const [studioProfile, setStudioProfile] = useState<StudioProfile>(() => {
    try {
      const saved = localStorage.getItem('talmeez_studio_profile');
      return saved ? { ...INITIAL_STUDIO_PROFILE, ...JSON.parse(saved) } : INITIAL_STUDIO_PROFILE;
    } catch {
      return INITIAL_STUDIO_PROFILE;
    }
  });

  // Selected project for high-res gallery lightbox
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Project Editor Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false);
  const [isStudioProfileEditorOpen, setIsStudioProfileEditorOpen] = useState(false);

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem('talmeez_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  // Total Portfolio Visits
  const [totalPortfolioViews, setTotalPortfolioViews] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('talmeez_total_views');
      return saved ? parseInt(saved, 10) : 13240;
    } catch {
      return 13240;
    }
  });

  // Contact modal state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState('Brand Identity');
  const [activeServicePreview, setActiveServicePreview] = useState<ServiceItem | null>(null);

  // Sync projects
  useEffect(() => {
    localStorage.setItem('talmeez_projects', JSON.stringify(projects));
  }, [projects]);

  // Sync studio profile
  useEffect(() => {
    localStorage.setItem('talmeez_studio_profile', JSON.stringify(studioProfile));
  }, [studioProfile]);

  // Sync inquiries
  useEffect(() => {
    localStorage.setItem('talmeez_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Sync owner auth
  useEffect(() => {
    localStorage.setItem('talmeez_is_owner', isOwnerMode ? 'true' : 'false');
  }, [isOwnerMode]);

  useEffect(() => {
    localStorage.setItem('talmeez_owner_pin', ownerPin);
  }, [ownerPin]);

  // Sync total views
  useEffect(() => {
    localStorage.setItem('talmeez_total_views', totalPortfolioViews.toString());
  }, [totalPortfolioViews]);

  // Owner PIN functions
  const unlockOwnerMode = (pin: string): boolean => {
    if (pin.trim() === ownerPin.trim()) {
      setIsOwnerMode(true);
      setIsPinModalOpen(false);
      return true;
    }
    return false;
  };

  const lockOwnerMode = () => {
    setIsOwnerMode(false);
    setCurrentView('portfolio');
  };

  // Increment view count on project click/lightbox open
  const incrementProjectViews = (id: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, views: p.views + 1 } : p))
    );
    setTotalPortfolioViews(prev => prev + 1);
  };

  const likeProject = (id: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  // Add new project
  const addProject = (newProjectData: Omit<Project, 'id' | 'views' | 'likes'>) => {
    const newProj: Project = {
      ...newProjectData,
      id: `proj-${Date.now()}`,
      views: 1,
      likes: 0
    };
    setProjects(prev => [newProj, ...prev]);
  };

  // Update existing project
  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
    if (selectedProject?.id === id) {
      setSelectedProject(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  // Delete project
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  // Update studio profile
  const updateStudioProfile = (updated: Partial<StudioProfile>) => {
    setStudioProfile(prev => ({ ...prev, ...updated }));
  };

  const openContactWithService = (serviceName?: string) => {
    if (serviceName) {
      setSelectedServiceForInquiry(serviceName);
    }
    setIsContactModalOpen(true);
  };

  const addInquiry = (inquiryData: {
    clientName: string;
    email: string;
    company?: string;
    service: string;
    budget: string;
    timeline: string;
    message: string;
  }) => {
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      clientName: inquiryData.clientName,
      email: inquiryData.email,
      company: inquiryData.company || 'Direct Client',
      service: inquiryData.service,
      budget: inquiryData.budget,
      timeline: inquiryData.timeline,
      message: inquiryData.message,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };

    setInquiries(prev => [newInquiry, ...prev]);
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries(prev =>
      prev.map(item => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(item => item.id !== id));
  };

  const exportInquiriesCSV = () => {
    const headers = ['ID,Client Name,Email,Company,Service,Budget,Timeline,Date,Status'];
    const rows = inquiries.map(i =>
      `"${i.id}","${i.clientName}","${i.email}","${i.company || ''}","${i.service}","${i.budget}","${i.timeline}","${i.date}","${i.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `talmeez_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const simulateVisitor = () => {
    const randomIndex = Math.floor(Math.random() * projects.length);
    const targetProject = projects[randomIndex];
    if (targetProject) {
      incrementProjectViews(targetProject.id);
    }
  };

  const unreadInquiriesCount = inquiries.filter(i => i.status === 'New').length;

  return (
    <PortfolioContext.Provider
      value={{
        currentView,
        setCurrentView,
        openForWork,
        setOpenForWork,
        projects,
        selectedProject,
        setSelectedProject,
        likeProject,
        incrementProjectViews,
        addProject,
        updateProject,
        deleteProject,
        editingProject,
        setEditingProject,
        isProjectEditorOpen,
        setIsProjectEditorOpen,
        isStudioProfileEditorOpen,
        setIsStudioProfileEditorOpen,
        studioProfile,
        updateStudioProfile,
        isOwnerMode,
        setIsOwnerMode,
        isPinModalOpen,
        setIsPinModalOpen,
        ownerPin,
        setOwnerPin,
        unlockOwnerMode,
        lockOwnerMode,
        isContactModalOpen,
        setIsContactModalOpen,
        selectedServiceForInquiry,
        openContactWithService,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        exportInquiriesCSV,
        simulateVisitor,
        totalPortfolioViews,
        unreadInquiriesCount,
        activeServicePreview,
        setActiveServicePreview
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
