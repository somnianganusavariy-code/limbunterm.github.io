export interface WebsiteSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  badgeText: string;
  footerCopyright: string;
  footerDisclaimer: string;
  privacyPolicy: string;
  termsConditions: string;
  refundPolicy: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  telegram: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  behance: string;
  dribbble: string;
  address: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  workingHours: string;
}

export interface HeroSlide {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  order: number;
}

export type HeroAnimationStyle = 'fade' | 'slide-left' | 'slide-right' | 'zoom' | 'ken-burns';
export type HeroAspectRatio = '4/5' | '16/9' | '1/1' | 'natural' | '3/4';
export type HeroObjectFit = 'cover' | 'contain';
export type HeroPosition = 'center' | 'top' | 'bottom';

export interface HeroSlideshowConfig {
  enabled: boolean;
  autoplay: boolean;
  interval: number; // slide duration in ms (e.g. 4000)
  transitionSpeed: number; // in ms (e.g. 800)
  animationStyle: HeroAnimationStyle;
  aspectRatio: HeroAspectRatio;
  objectFit: HeroObjectFit;
  position: HeroPosition;
  showArrows: boolean;
  showDots: boolean;
}

export interface HeroContent {
  headlinePrefix: string;
  headlineHighlight: string;
  subtitle: string;
  experienceBadge: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  portraitImage: string;
  slides: HeroSlide[];
  slideshowConfig: HeroSlideshowConfig;
  showAvailabilityBadge: boolean;
  availabilityText: string;
}

export interface AboutContent {
  headline: string;
  story: string;
  experienceYears: string;
  completedProjects: string;
  satisfiedClients: string;
  countriesServed: string;
  skillsList: string[];
}

export interface CtaContent {
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface CmsNavigationItem {
  id: string;
  label: string;
  target: string;
  enabled: boolean;
  order: number;
  isExternal?: boolean;
}

export interface CmsSection {
  id: string;
  name: string;
  type: 'hero' | 'services' | 'projects' | 'metrics' | 'testimonials' | 'cta' | 'contact' | 'custom';
  enabled: boolean;
  order: number;
  title: string;
  subtitle: string;
  badge: string;
  customHtml?: string;
  customImage?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface CmsProduct {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  image: string;
  gallery?: string[];
  summary: string;
  description: string;
  views: number;
  likes: number;
  featured: boolean;
  enabled: boolean;
  order: number;
  colorPalette: string[];
  deliverables: string[];
  tags: string[];
}

export interface CmsService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  imageUrl?: string;
  startingPrice: string;
  deliverables: string[];
  enabled: boolean;
  order: number;
}

export interface CmsBrand {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  testimonialQuote?: string;
  authorName?: string;
  authorRole?: string;
  rating?: number;
  enabled: boolean;
  order: number;
}

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  order: number;
}

export interface CmsMediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  uploadedAt: string;
  alt: string;
}

export type InquiryStatus = 'New' | 'In Discussion' | 'Booked' | 'Archived';

export interface CmsInquiry {
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

export type ProjectLayoutType = 'grid-2' | 'grid-3' | 'masonry' | 'showcase';

export interface CmsFullContent {
  settings: WebsiteSettings;
  contact: ContactSettings;
  hero: HeroContent;
  about: AboutContent;
  cta: CtaContent;
  navigation: CmsNavigationItem[];
  sections: CmsSection[];
  products: CmsProduct[];
  services: CmsService[];
  brands: CmsBrand[];
  categories: CmsCategory[];
  projectDisplayLayout?: ProjectLayoutType;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  lastLogin?: string;
}

