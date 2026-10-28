import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dbManager } from './db';
import { generateToken, verifyToken } from './auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanBase}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max to support high-res images and video reels
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg\+xml|svg|gif|mp4|webm|ogg|quicktime|mov/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image (JPG, PNG, WebP, SVG, GIF) and video (MP4, WebM, MOV) files are allowed.'));
  }
});

// Middleware for Admin Protection
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }

  (req as any).adminUser = verified;
  next();
}

export const apiRouter = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get published live website content
apiRouter.get('/public/content', (_req: Request, res: Response) => {
  const content = dbManager.getPublishedContent();
  res.json({
    success: true,
    data: content,
    totalViews: dbManager.getTotalViews()
  });
});

// Submit client inquiry (Contact form)
apiRouter.post('/public/inquiries', (req: Request, res: Response) => {
  const { clientName, email, company, service, budget, timeline, message } = req.body;
  if (!clientName || !email || !message) {
    return res.status(400).json({ error: 'Client name, email, and message are required.' });
  }

  const newInquiry = dbManager.addInquiry({
    clientName,
    email,
    company: company || '',
    service: service || 'General Inquiry',
    budget: budget || 'To be discussed',
    timeline: timeline || 'Flexible',
    message
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your project inquiry has been received. We will respond within 24 hours.',
    data: newInquiry
  });
});

// Increment portfolio view count
apiRouter.post('/public/views', (_req: Request, res: Response) => {
  const totalViews = dbManager.incrementViews();
  res.json({ success: true, totalViews });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Login with username or email + password
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required.' });
  }

  const isValid = dbManager.verifyAdmin(identifier, password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials. Default is admin / admin123' });
  }

  dbManager.updateLastLogin();
  const adminUser = dbManager.getAdminUser();
  const token = generateToken({ userId: adminUser.id, username: adminUser.username });

  res.json({
    success: true,
    message: 'Successfully authenticated as Administrator.',
    token,
    user: adminUser
  });
});

// Verify current session
apiRouter.get('/auth/me', requireAdmin, (_req: Request, res: Response) => {
  const adminUser = dbManager.getAdminUser();
  res.json({ success: true, user: adminUser });
});

// Update credentials (username, email, password)
apiRouter.post('/auth/change-credentials', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newUsername, newEmail, newPassword } = req.body;
  const adminUser = dbManager.getAdminUser();

  if (!currentPassword || !dbManager.verifyAdmin(adminUser.username, currentPassword)) {
    return res.status(400).json({ error: 'Current password verification failed.' });
  }

  const updated = dbManager.updateAdminCredentials(
    newUsername || adminUser.username,
    newEmail || adminUser.email,
    newPassword
  );

  res.json({
    success: true,
    message: 'Credentials updated successfully.',
    user: updated
  });
});

// ==========================================
// ADMIN CMS CONTENT MANAGEMENT
// ==========================================

// Get current working draft content + status
apiRouter.get('/admin/content', requireAdmin, (_req: Request, res: Response) => {
  const draftData = dbManager.getDraftContent();
  res.json({
    success: true,
    data: draftData.content,
    hasUnpublishedChanges: draftData.hasUnpublishedChanges
  });
});

// Save draft modifications (Save Draft)
apiRouter.put('/admin/content', requireAdmin, (req: Request, res: Response) => {
  const content = req.body;
  if (!content || typeof content !== 'object') {
    return res.status(400).json({ error: 'Invalid content payload' });
  }

  const result = dbManager.saveDraftContent(content);
  res.json({
    success: true,
    message: 'Draft saved successfully. Click "Publish" when ready to push changes to live website.',
    hasUnpublishedChanges: result.hasUnpublishedChanges
  });
});

// Publish draft to live public website
apiRouter.post('/admin/publish', requireAdmin, (_req: Request, res: Response) => {
  const result = dbManager.publishDraft();
  res.json({
    success: true,
    message: '🎉 Website published successfully! Live visitors now see the latest updates.',
    data: result.published
  });
});

// Revert/discard draft changes
apiRouter.post('/admin/revert', requireAdmin, (_req: Request, res: Response) => {
  const result = dbManager.revertDraft();
  res.json({
    success: true,
    message: 'Draft changes reverted to published state.',
    data: result.draft
  });
});

// ==========================================
// MEDIA LIBRARY MANAGEMENT
// ==========================================

// Get list of media files
apiRouter.get('/media', requireAdmin, (_req: Request, res: Response) => {
  const media = dbManager.getMedia();
  res.json({ success: true, data: media });
});

// Upload media file(s)
apiRouter.post('/media/upload', requireAdmin, upload.array('files', 10), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No image files uploaded.' });
  }

  const savedMediaList = files.map(file => {
    return dbManager.addMedia({
      id: `media-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      alt: path.basename(file.originalname, path.extname(file.originalname)).replace(/[-_]/g, ' ')
    });
  });

  res.status(201).json({
    success: true,
    message: `Successfully uploaded ${savedMediaList.length} image(s) to media library.`,
    data: savedMediaList
  });
});

// Delete media file
apiRouter.delete('/media/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const result = dbManager.deleteMedia(id);
  res.json({
    success: true,
    message: 'Image deleted from Media Library.',
    data: result
  });
});

// ==========================================
// INQUIRIES MANAGEMENT
// ==========================================

// Get inquiries
apiRouter.get('/admin/inquiries', requireAdmin, (_req: Request, res: Response) => {
  const inquiries = dbManager.getInquiries();
  res.json({ success: true, data: inquiries });
});

// Update inquiry status
apiRouter.put('/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const updated = dbManager.updateInquiryStatus(id, status, notes);
  res.json({
    success: true,
    message: 'Inquiry updated.',
    data: updated
  });
});

// Delete inquiry
apiRouter.delete('/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  dbManager.deleteInquiry(id);
  res.json({
    success: true,
    message: 'Inquiry removed.'
  });
});
