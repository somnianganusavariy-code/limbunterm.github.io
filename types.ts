export type ProjectCategory = 
  | 'All'
  | 'Graphic Design'
  | 'Brand Identity'
  | 'Packaging'
  | 'Editorial'
  | 'UI/UX';

export interface Project {
  id: string;
  title: string;
  category: 'Graphic Design' | 'Brand Identity' | 'Packaging' | 'Editorial' | 'UI/UX';
  client: string;
  year: string;
  image: string;
  summary: string;
  description: string;
  views: number;
  likes: number;
  featured: boolean;
  colorPalette: string[];
  deliverables: string[];
  tags: string[];
}

export type InquiryStatus = 'New' | 'In Discussion' | 'Booked' | 'Archived';

export interface Inquiry {
  id: string;
  clientName: string;
  email: string;
  company?: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  date: string;
  status: InquiryStatus;
  notes?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  avatar: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Layout' | 'Globe' | 'Sparkles' | 'PenTool';
  deliverables: string[];
  startingPrice: string;
}

export interface AnalyticsStats {
  totalVisitors: number;
  totalProjectViews: number;
  totalInquiries: number;
  conversionRate: number;
  estimatedPipeline: number;
}

export interface StudioProfile {
  designerName: string;
  brandTitle: string;
  headlinePrefix: string;
  headlineHighlight: string;
  subtitle: string;
  experienceBadge: string;
  email: string;
  phone: string;
  telegram?: string;
  facebook?: string;
  location: string;
  workingHours: string;
  metricYears: string;
  metricProjects: string;
  metricClients: string;
  metricCountries: string;
}
