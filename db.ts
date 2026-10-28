import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword, verifyPassword } from './auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DB_FILE = path.resolve(DATA_DIR, 'cms-database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface DatabaseSchema {
  version: number;
  published: any;
  draft: any;
  hasUnpublishedChanges: boolean;
  admin: {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    salt: string;
    lastLogin?: string;
  };
  media: Array<{
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
  }>;
  inquiries: Array<{
    id: string;
    clientName: string;
    email: string;
    company?: string;
    service: string;
    budget: string;
    timeline: string;
    message: string;
    date: string;
    status: 'New' | 'In Discussion' | 'Booked' | 'Archived';
    notes?: string;
  }>;
  totalViews: number;
}

const DEFAULT_INITIAL_CONTENT = {
  settings: {
    siteName: 'LIM Bunterm',
    siteDescription: 'Interactive animated portfolio website showcasing brand identity, packaging, and graphic design with high-resolution gallery, client inquiry dashboard, and direct contact via Telegram, Facebook, and Phone.',
    logoUrl: '',
    faviconUrl: '',
    badgeText: 'Creative Design Studio & Art Direction',
    footerCopyright: '© 2026 LIM Bunterm. All rights reserved.',
    footerDisclaimer: 'Crafting bespoke digital products, brand identities, and sensory packaging for visionary leaders worldwide.',
    privacyPolicy: 'All client information, communications, and project assets are kept strictly confidential under non-disclosure agreements.',
    termsConditions: 'Standard international graphic design, licensing, and milestone delivery contract terms apply to all commissioned work.',
    refundPolicy: 'Full milestone-based satisfaction guarantees with clear signoff phases before final vector source deliveries.'
  },
  contact: {
    email: 'limbunterm17@gmail.com',
    phone: '+855 12 345 678',
    telegram: 'https://t.me/limbunterm',
    facebook: 'https://facebook.com/limbunterm',
    instagram: 'https://instagram.com/limbunterm',
    tiktok: 'https://tiktok.com/@limbunterm',
    linkedin: 'https://linkedin.com/in/limbunterm',
    behance: 'https://behance.net/limbunterm',
    dribbble: 'https://dribbble.com/limbunterm',
    address: 'Phnom Penh, Cambodia & Worldwide Remote',
    googleMapsUrl: 'https://maps.google.com/?q=Phnom+Penh',
    googleMapsEmbed: '',
    workingHours: 'Mon - Fri: 09:00 - 18:00 (GMT+7)'
  },
  hero: {
    headlinePrefix: 'Design That',
    headlineHighlight: 'Builds Brands.',
    subtitle: 'I help ambitious brands stand out with bold, strategic and unforgettable graphic design, luxury packaging, and digital identities.',
    experienceBadge: '5+ Years of Excellence',
    primaryButtonText: "Let's Talk",
    primaryButtonLink: '#contact',
    secondaryButtonText: 'Explore Works',
    secondaryButtonLink: '#projects',
    portraitImage: '/src/assets/images/hero_designer_portrait_1793179168215.jpg',
    slides: [
      { id: 'slide-1', url: '/src/assets/images/hero_designer_portrait_1793179168215.jpg', alt: 'Designer Creative Portrait', order: 1 },
      { id: 'slide-2', url: '/src/assets/images/project_packaging_boxes_1793179168555.jpg', alt: 'Luxury Packaging Boxes', order: 2 },
      { id: 'slide-3', url: '/src/assets/images/project_brand_identity_1793179169105.jpg', alt: 'Axon Brand Identity Suite', order: 3 },
      { id: 'slide-4', url: '/src/assets/images/project_luxury_shopping_bag_1793179170621.jpg', alt: 'Tactile Gold Embossed Paper Bag', order: 4 },
      { id: 'slide-5', url: '/src/assets/images/project_editorial_magazine_1793179170586.jpg', alt: 'Swiss Editorial Magazine', order: 5 }
    ],
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
    },
    showAvailabilityBadge: true,
    availabilityText: 'Available for Q1/Q2 Projects'
  },
  about: {
    headline: 'Merging disciplined Swiss typography with tactile luxury packaging aesthetics.',
    story: 'Over the last 5 years, I have partnered with international fashion labels, tech disruptors, and artisanal skincare houses to build memorable identities from scratch. Every project begins with strategic research and ends in meticulously crafted vector precision.',
    experienceYears: '5+',
    completedProjects: '100+',
    satisfiedClients: '50+',
    countriesServed: '10+',
    skillsList: ['Brand Strategy', 'Visual Identity Systems', 'Packaging Engineering', 'Foil Stamping & Embossing', 'Editorial Layouts', 'UI/UX Design']
  },
  cta: {
    badge: 'Fast-Track Onboarding',
    title: 'Ready to elevate your visual identity?',
    subtitle: 'Whether you need end-to-end luxury packaging, brand identity guidelines, or editorial print direction, get in touch to discuss your timeline and vision.',
    buttonText: 'Open Project Intake Form',
    buttonLink: '#contact'
  },
  navigation: [
    { id: 'nav-1', label: 'Home', target: '#hero', enabled: true, order: 1 },
    { id: 'nav-2', label: 'Services', target: '#services', enabled: true, order: 2 },
    { id: 'nav-3', label: 'Work', target: '#projects', enabled: true, order: 3 },
    { id: 'nav-4', label: 'About', target: '#about', enabled: true, order: 4 },
    { id: 'nav-5', label: 'Contact', target: '#contact', enabled: true, order: 5 }
  ],
  sections: [
    { id: 'sec-hero', name: 'Hero Banner', type: 'hero', enabled: true, order: 1, title: 'Hero Banner', subtitle: 'Main landing fold with designer portrait', badge: 'Introduction' },
    { id: 'sec-services', name: 'Services & Capabilities', type: 'services', enabled: true, order: 2, title: 'Tailored Creative Services', subtitle: 'Strategic capabilities designed to scale brand equity and sales conversion', badge: 'What I Deliver' },
    { id: 'sec-projects', name: 'Featured Works / Portfolio', type: 'projects', enabled: true, order: 3, title: 'Selected Works', subtitle: 'A curated gallery of recent brand identity, packaging, and editorial assignments', badge: 'Portfolio Showcase' },
    { id: 'sec-metrics', name: 'Experience & Metrics', type: 'metrics', enabled: true, order: 4, title: 'Quantifiable Track Record', subtitle: 'Numbers that demonstrate relentless commitment to quality and client growth', badge: 'Key Milestones' },
    { id: 'sec-testimonials', name: 'Client Testimonials', type: 'testimonials', enabled: true, order: 5, title: 'What Visionary Founders Say', subtitle: 'Direct feedback from our brand partners across London, Zurich, and Tokyo', badge: 'Client Validation' },
    { id: 'sec-cta', name: 'Call To Action', type: 'cta', enabled: true, order: 6, title: 'Ready to collaborate?', subtitle: 'Book a discovery sprint or request an itemized project estimate', badge: 'Next Step' },
    { id: 'sec-contact', name: 'Contact & Channels', type: 'contact', enabled: true, order: 7, title: 'Direct Contact & Inquiries', subtitle: 'Reach out via Telegram, Facebook, Phone, or send a detailed brief', badge: 'Get In Touch' }
  ],
  projectDisplayLayout: 'showcase' as const,
  products: [
    {
      id: 'proj-1',
      title: 'Aura Skincare Packaging & Box System',
      category: 'Packaging',
      client: 'Aura Botanicals London',
      year: '2026',
      image: '/src/assets/images/project_packaging_boxes_1793179168555.jpg',
      summary: 'Luxury matte navy & eco-craft unboxing experience with metallic copper foil finish.',
      description: 'A comprehensive structural packaging suite designed for high-end organic skincare. Developed custom die-cuts, tactile blind debossing, sustainable soy ink seals, and tamper-evident branded adhesive ribbons for global e-commerce and boutique distribution.',
      views: 1842,
      likes: 312,
      featured: true,
      enabled: true,
      order: 1,
      colorPalette: ['#1A2536', '#C79A73', '#D6B995', '#F5EBE1', '#0F1622'],
      deliverables: ['Custom Box Die-Cuts', 'Debossed Foil Sleeves', 'Product Labels', 'Retail Display Guidelines'],
      tags: ['Packaging', 'Luxury', 'Print Finish', 'Sustainable']
    },
    {
      id: 'proj-2',
      title: 'Axon Technologies Visual Identity & Brand System',
      category: 'Brand Identity',
      client: 'Axon Tech Labs',
      year: '2026',
      image: '/src/assets/images/project_brand_identity_1793179169105.jpg',
      summary: 'High-energy kinetic identity system with vibrant signal orange and architectural typography.',
      description: 'Complete brand overhaul for an enterprise cloud computation network. Delivered a unified graphic design language including bespoke wordmark geometry, physical stationery, organic cotton merchandise, event lanyards, and digital design system tokenization.',
      views: 2450,
      likes: 489,
      featured: true,
      enabled: true,
      order: 2,
      colorPalette: ['#EA580C', '#27272A', '#F4F4F5', '#FFFFFF', '#71717A'],
      deliverables: ['Dynamic Logo Suite', 'Stationery Kit', 'Merch & Tote Design', 'Brand Guidelines Manual'],
      tags: ['Brand Identity', 'Stationery', 'Typography', 'Tech']
    },
    {
      id: 'proj-3',
      title: 'Aurélia Luxury Retail Paper Bag & Embossed Embellishment',
      category: 'Graphic Design',
      client: 'Maison Aurélia Haute Couture',
      year: '2025',
      image: '/src/assets/images/project_luxury_shopping_bag_1793179170621.jpg',
      summary: 'Tactile textured black card stock with hot-stamped gold foil heraldic crest.',
      description: 'Bespoke packaging and shopping bag execution for luxury boutique flagship stores. Features custom micro-pattern geometric blind embossing, grosgrain cotton ribbon handles, and gold edge-gilded structural folds.',
      views: 1620,
      likes: 275,
      featured: true,
      enabled: true,
      order: 3,
      colorPalette: ['#121214', '#D4AF37', '#2A2A2E', '#F3EFE6'],
      deliverables: ['Retail Shopping Bags', 'Blind Emboss Patterns', 'Foil Stamp Tooling', 'Materials Specification'],
      tags: ['Graphic Design', 'Foil Stamping', 'Luxury', 'Editorial']
    },
    {
      id: 'proj-4',
      title: 'Swiss Modernist Vision: Editorial Magazine & Poster System',
      category: 'Editorial',
      client: 'Zurich Design Archive',
      year: '2026',
      image: '/src/assets/images/project_editorial_magazine_1793179170586.jpg',
      summary: 'Rigorous Swiss grid monograph exploring typography, asymmetry, and modern structures.',
      description: 'An experimental 120-page design publication paying homage to Josef Müller-Brockmann and modern graphic syntax. Crafted custom type specimen layouts, dual-color duotone imagery, poster inserts, and screen-printed jacket.',
      views: 3105,
      likes: 620,
      featured: true,
      enabled: true,
      order: 4,
      colorPalette: ['#EA580C', '#18181B', '#E4E4E7', '#FAFAFA'],
      deliverables: ['120-Page Publication', 'B1 Exhibition Posters', 'Editorial Grid System', 'Binding Specs'],
      tags: ['Editorial', 'Swiss Style', 'Typography', 'Print']
    },
    {
      id: 'proj-5',
      title: 'Talmeez Contemporary Portfolio Architecture',
      category: 'UI/UX',
      client: 'Design Studio Showcase',
      year: '2026',
      image: '/public/assets/aistudio/Contemporary_Figma_Portfolio_Website_Template_d7a28fd7.jpg',
      summary: 'Full-bleed responsive layout with smooth transitions, analytics engine, and client inquiry portal.',
      description: 'The contemporary digital portfolio framework built to display high-resolution creative works seamlessly on both mobile smartphones and ultra-wide desktop monitors, featuring real-time view tracking and client inquiry management.',
      views: 4210,
      likes: 890,
      featured: true,
      enabled: true,
      order: 5,
      colorPalette: ['#EA580C', '#1E1E1E', '#FFFFFF', '#FBFBFA'],
      deliverables: ['Figma System Components', 'Mobile Responsive Views', 'Interactive Motion Specs', 'Analytics Dashboard UI'],
      tags: ['UI/UX', 'Portfolio', 'Interactive', 'Motion']
    }
  ],
  services: [
    {
      id: 'srv-1',
      title: 'UI/UX Design',
      description: 'Craft intuitive, user-focused digital interfaces and scalable design systems that convert.',
      iconName: 'Layout',
      startingPrice: '$2,500',
      deliverables: ['Wireframing & Prototypes', 'Mobile & Web UI', 'Design Systems & Tokens', 'Interaction Specs'],
      enabled: true,
      order: 1
    },
    {
      id: 'srv-2',
      title: 'Web Design',
      description: 'High-impact responsive websites built with modern aesthetics, fast loading speeds, and micro-animations.',
      iconName: 'Globe',
      startingPrice: '$3,000',
      deliverables: ['Responsive Web Layouts', 'Landing Page Optimization', 'Interactive Prototypes', 'Asset Production'],
      enabled: true,
      order: 2
    },
    {
      id: 'srv-3',
      title: 'Brand Identity',
      description: 'Distinctive visual identities, bespoke logomarks, typography rules, and strategic brand guidelines.',
      iconName: 'Sparkles',
      startingPrice: '$3,500',
      deliverables: ['Logo & Mark Development', 'Color & Type Strategy', 'Stationery & Collateral', 'Comprehensive Brandbook'],
      enabled: true,
      order: 3
    },
    {
      id: 'srv-4',
      title: 'Graphic Design',
      description: 'Sensory packaging, exhibition editorial layouts, retail print materials, and bold digital visuals.',
      iconName: 'PenTool',
      startingPrice: '$2,000',
      deliverables: ['Luxury Packaging & Die-cuts', 'Editorial & Publications', 'Poster & Marketing Collateral', 'Print Production Specs'],
      enabled: true,
      order: 4
    }
  ],
  brands: [
    {
      id: 'brand-1',
      name: 'Orin Retail & Goods',
      logoUrl: '',
      testimonialQuote: 'LIM Bunterm has a unique ability to understand our brand ethos and translate it into visuals that truly connect with high-value customers. The packaging redesign increased our online conversion by 48%.',
      authorName: 'John Snow',
      authorRole: 'Founder, Orin Retail & Goods',
      rating: 5,
      enabled: true,
      order: 1
    },
    {
      id: 'brand-2',
      name: 'Axon Tech Labs',
      logoUrl: '',
      testimonialQuote: 'Working with Bunterm was seamless. The brand identity system for Axon received immediate praise from our investors and clients alike. Highly disciplined typography and exceptional delivery.',
      authorName: 'Elena Vance',
      authorRole: 'Chief Brand Officer, Axon Tech Labs',
      rating: 5,
      enabled: true,
      order: 2
    },
    {
      id: 'brand-3',
      name: 'Aura Botanicals',
      logoUrl: '',
      testimonialQuote: 'Every graphic detail was meticulously crafted, from the tactile foil specifications to the unboxing rhythm. Bunterm is hands down the most reliable graphic designer we have collaborated with.',
      authorName: 'Marcus Chen',
      authorRole: 'Creative Director, Aura Botanicals',
      rating: 5,
      enabled: true,
      order: 3
    }
  ],
  categories: [
    { id: 'cat-all', name: 'All', slug: 'all', enabled: true, order: 1 },
    { id: 'cat-brand', name: 'Brand Identity', slug: 'brand-identity', enabled: true, order: 2 },
    { id: 'cat-packaging', name: 'Packaging', slug: 'packaging', enabled: true, order: 3 },
    { id: 'cat-graphic', name: 'Graphic Design', slug: 'graphic-design', enabled: true, order: 4 },
    { id: 'cat-editorial', name: 'Editorial', slug: 'editorial', enabled: true, order: 5 },
    { id: 'cat-uiux', name: 'UI/UX', slug: 'ui-ux', enabled: true, order: 6 }
  ]
};

const INITIAL_MEDIA = [
  {
    id: 'media-1',
    filename: 'hero_designer_portrait.jpg',
    originalName: 'hero_designer_portrait.jpg',
    url: '/src/assets/images/hero_designer_portrait_1793179168215.jpg',
    size: 245000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-10-25T10:00:00.000Z',
    alt: 'Designer Portrait in Studio'
  },
  {
    id: 'media-2',
    filename: 'project_packaging_boxes.jpg',
    originalName: 'project_packaging_boxes.jpg',
    url: '/src/assets/images/project_packaging_boxes_1793179168555.jpg',
    size: 389000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-10-25T10:05:00.000Z',
    alt: 'Luxury Packaging Boxes'
  },
  {
    id: 'media-3',
    filename: 'project_brand_identity.jpg',
    originalName: 'project_brand_identity.jpg',
    url: '/src/assets/images/project_brand_identity_1793179169105.jpg',
    size: 420000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-10-25T10:10:00.000Z',
    alt: 'Axon Brand Identity Stationery'
  },
  {
    id: 'media-4',
    filename: 'project_editorial_magazine.jpg',
    originalName: 'project_editorial_magazine.jpg',
    url: '/src/assets/images/project_editorial_magazine_1793179170586.jpg',
    size: 512000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-10-25T10:15:00.000Z',
    alt: 'Swiss Modernist Editorial Magazine'
  },
  {
    id: 'media-5',
    filename: 'project_luxury_shopping_bag.jpg',
    originalName: 'project_luxury_shopping_bag.jpg',
    url: '/src/assets/images/project_luxury_shopping_bag_1793179170621.jpg',
    size: 345000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-10-25T10:20:00.000Z',
    alt: 'Luxury Retail Embossed Shopping Bag'
  }
];

const INITIAL_INQUIRIES = [
  {
    id: 'inq-101',
    clientName: 'Sophia Lindqvist',
    email: 'sophia@nordicaudio.se',
    company: 'Nordic Audio Systems',
    service: 'Brand Identity & Packaging',
    budget: '$5k - $10k',
    timeline: '3 - 4 weeks',
    message: 'We are launching a new line of minimalist wireless studio monitors and need a cohesive visual identity, packaging die-cuts, and product unboxing collateral.',
    date: '2026-10-27',
    status: 'New' as const,
    notes: 'Needs samples of tactile deboss card stock sent to Stockholm studio.'
  },
  {
    id: 'inq-102',
    clientName: 'David Kalu',
    email: 'david@meridianroasters.com',
    company: 'Meridian Specialty Coffee',
    service: 'Packaging & Print Design',
    budget: '$2k - $5k',
    timeline: 'Within 2 weeks',
    message: 'Looking to redesign our specialty coffee bean bags and retail boxes with foil-stamped elements and custom origin stickers.',
    date: '2026-10-25',
    status: 'In Discussion' as const,
    notes: 'Discovery call held on Zoom. Sent portfolio deck.'
  },
  {
    id: 'inq-103',
    clientName: 'Camille Benoit',
    email: 'c.benoit@lumieremag.fr',
    company: 'Lumière Quarterly Magazine',
    service: 'Editorial & Graphic Design',
    budget: '$5k - $10k',
    timeline: '1 - 2 months',
    message: 'Seeking an art director to redesign our biannual architectural print journal and curate the typography hierarchy for issue #14.',
    date: '2026-10-20',
    status: 'Booked' as const,
    notes: 'Contract executed. Initial moodboard delivery due next Monday.'
  }
];

class DatabaseManager {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
  }

  private migrateContent(content: any): boolean {
    if (!content || typeof content !== 'object') return false;
    let modified = false;

    // Migrate Hero Slides
    if (!content.hero) {
      content.hero = JSON.parse(JSON.stringify(DEFAULT_INITIAL_CONTENT.hero));
      modified = true;
    } else {
      if (!Array.isArray(content.hero.slides) || content.hero.slides.length === 0) {
        content.hero.slides = [
          {
            id: 'slide-1',
            url: content.hero.portraitImage || '/src/assets/images/hero_designer_portrait_1793179168215.jpg',
            alt: 'Hero Visual 1',
            order: 1
          },
          {
            id: 'slide-2',
            url: '/src/assets/images/project_packaging_boxes_1793179168555.jpg',
            alt: 'Packaging Showcase',
            order: 2
          },
          {
            id: 'slide-3',
            url: '/src/assets/images/project_brand_identity_1793179169105.jpg',
            alt: 'Brand Identity Showcase',
            order: 3
          }
        ];
        modified = true;
      }
      if (!content.hero.slideshowConfig) {
        content.hero.slideshowConfig = {
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
        modified = true;
      }
    }

    // Remove price from all products
    if (Array.isArray(content.products)) {
      content.products.forEach((prod: any) => {
        if ('price' in prod) {
          delete prod.price;
          modified = true;
        }
      });
    }

    // Ensure Categories
    if (!Array.isArray(content.categories) || content.categories.length === 0) {
      content.categories = JSON.parse(JSON.stringify(DEFAULT_INITIAL_CONTENT.categories));
      modified = true;
    }

    // Ensure Project Display Layout
    if (!content.projectDisplayLayout) {
      content.projectDisplayLayout = 'showcase';
      modified = true;
    }

    return modified;
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        let changed = false;
        if (parsed.published && this.migrateContent(parsed.published)) changed = true;
        if (parsed.draft && this.migrateContent(parsed.draft)) changed = true;
        if (changed) {
          this.saveToDisk(parsed);
        }
        return parsed;
      }
    } catch (err) {
      console.error('Error loading database, re-initializing default:', err);
    }

    const { hash, salt } = hashPassword('admin123');

    const initialDb: DatabaseSchema = {
      version: 1,
      published: JSON.parse(JSON.stringify(DEFAULT_INITIAL_CONTENT)),
      draft: JSON.parse(JSON.stringify(DEFAULT_INITIAL_CONTENT)),
      hasUnpublishedChanges: false,
      admin: {
        id: 'admin-1',
        username: 'admin',
        email: 'limbunterm17@gmail.com',
        passwordHash: hash,
        salt: salt,
        lastLogin: new Date().toISOString()
      },
      media: INITIAL_MEDIA,
      inquiries: INITIAL_INQUIRIES,
      totalViews: 13240
    };

    this.saveToDisk(initialDb);
    return initialDb;
  }

  private saveToDisk(data: DatabaseSchema): void {
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  public getPublishedContent() {
    return this.db.published;
  }

  public getDraftContent() {
    return {
      content: this.db.draft,
      hasUnpublishedChanges: this.db.hasUnpublishedChanges
    };
  }

  public saveDraftContent(newContent: any) {
    this.db.draft = { ...this.db.draft, ...newContent };
    this.db.hasUnpublishedChanges = true;
    this.saveToDisk(this.db);
    return { success: true, hasUnpublishedChanges: true };
  }

  public publishDraft() {
    this.db.published = JSON.parse(JSON.stringify(this.db.draft));
    this.db.hasUnpublishedChanges = false;
    this.saveToDisk(this.db);
    return { success: true, published: this.db.published };
  }

  public revertDraft() {
    this.db.draft = JSON.parse(JSON.stringify(this.db.published));
    this.db.hasUnpublishedChanges = false;
    this.saveToDisk(this.db);
    return { success: true, draft: this.db.draft };
  }

  public getAdminUser() {
    return {
      id: this.db.admin.id,
      username: this.db.admin.username,
      email: this.db.admin.email,
      lastLogin: this.db.admin.lastLogin
    };
  }

  public verifyAdmin(identifier: string, pass: string): boolean {
    const isUserMatch = 
      this.db.admin.username.toLowerCase() === identifier.toLowerCase() ||
      this.db.admin.email.toLowerCase() === identifier.toLowerCase();
    if (!isUserMatch) return false;
    return verifyPassword(pass, this.db.admin.passwordHash, this.db.admin.salt);
  }

  public updateAdminCredentials(newUsername: string, newEmail: string, newPassword?: string) {
    this.db.admin.username = newUsername.trim() || this.db.admin.username;
    this.db.admin.email = newEmail.trim() || this.db.admin.email;
    if (newPassword && newPassword.trim()) {
      const { hash, salt } = hashPassword(newPassword.trim());
      this.db.admin.passwordHash = hash;
      this.db.admin.salt = salt;
    }
    this.saveToDisk(this.db);
    return this.getAdminUser();
  }

  public updateLastLogin() {
    this.db.admin.lastLogin = new Date().toISOString();
    this.saveToDisk(this.db);
  }

  public getMedia() {
    return this.db.media;
  }

  public addMedia(item: DatabaseSchema['media'][0]) {
    this.db.media.unshift(item);
    this.saveToDisk(this.db);
    return item;
  }

  public deleteMedia(id: string) {
    const item = this.db.media.find(m => m.id === id);
    if (item && item.url.startsWith('/uploads/')) {
      const filePath = path.resolve(__dirname, '..', 'public', item.url.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
    }
    this.db.media = this.db.media.filter(m => m.id !== id);
    this.saveToDisk(this.db);
    return { success: true };
  }

  public getInquiries() {
    return this.db.inquiries;
  }

  public addInquiry(inquiry: Omit<DatabaseSchema['inquiries'][0], 'id' | 'date' | 'status'>) {
    const newInquiry: DatabaseSchema['inquiries'][0] = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    this.db.inquiries.unshift(newInquiry);
    this.saveToDisk(this.db);
    return newInquiry;
  }

  public updateInquiryStatus(id: string, status: any, notes?: string) {
    this.db.inquiries = this.db.inquiries.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: status || item.status,
          notes: notes !== undefined ? notes : item.notes
        };
      }
      return item;
    });
    this.saveToDisk(this.db);
    return this.db.inquiries.find(i => i.id === id);
  }

  public deleteInquiry(id: string) {
    this.db.inquiries = this.db.inquiries.filter(i => i.id !== id);
    this.saveToDisk(this.db);
    return { success: true };
  }

  public incrementViews() {
    this.db.totalViews = (this.db.totalViews || 0) + 1;
    this.saveToDisk(this.db);
    return this.db.totalViews;
  }

  public getTotalViews() {
    return this.db.totalViews || 13240;
  }
}

export const dbManager = new DatabaseManager();
