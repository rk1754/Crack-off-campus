import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

// Directory where static templates are stored
const TEMPLATE_DIR = path.join(__dirname, '../static/templates');

// Helper type guard for user booleans
function isUserWithResourceFlags(user: any): user is {
  resume?: boolean | null;
  referral?: boolean | null;
  cold_mail?: boolean | null;
  cover_letter?: boolean | null;
  hr_mail?: boolean | null;
  linkedin?: boolean | null;
  cv?: boolean | null;
  roadmaps?: boolean | null;
  interview?: boolean | null;
  job?: boolean | null;
} {
  return typeof user === 'object' && user !== null;
}

// Helper to check access for individual resources based on user.model.ts booleans
function hasResourceAccess(user: any, resource: string): boolean {
  if (!isUserWithResourceFlags(user)) return false;
  switch (resource) {
    case 'resume':
      // Debug log
      console.log('Checking resume access:', user.resume);
      return user.resume === true;
    case 'referral':
      console.log('Checking referral access:', user.referral);
      return user.referral === true;
    case 'cold_mail':
      console.log('Checking cold_mail access:', user.cold_mail);
      return user.cold_mail === true;
    case 'cover_letter':
      console.log('Checking cover_letter access:', user.cover_letter);
      return user.cover_letter === true;
    case 'hr_mail':
      console.log('Checking hr_mail access:', user.hr_mail);
      return user.hr_mail === true;
    case 'linkedin':
      console.log('Checking linkedin access:', user.linkedin);
      return user.linkedin === true;
    case 'cv':
      console.log('Checking cv access:', user.cv);
      return user.cv === true;
    case 'roadmaps':
      console.log('Checking roadmaps access:', user.roadmaps);
      return user.roadmaps === true;
    case 'interview':
      console.log('Checking interview access:', user.interview);
      return user.interview === true;
    case 'job':
      console.log('Checking job access:', user.job);
      return user.job === true;
    default:
      return false;
  }
}

// Download Resume Template
export const downloadResumeTemplate = (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized: User not authenticated.' });
    return;
  }

  if (!hasResourceAccess(user, 'resume')) {
    res.status(403).json({ error: 'Resume template requires purchase or access.' });
    return;
  }

  const filePath = path.join(TEMPLATE_DIR, 'resume_template.pdf');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found.' });
    return;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="resume_template.pdf"');
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res).on('error', (err) => {
    console.error('Error streaming file:', err);
    res.status(500).json({ error: 'Failed to download the file.' });
  });
};

// Download HR Email Template
export const downloadHrEmailTemplate = (req: Request, res: Response) => {
  const user = req.user;
  if (!hasResourceAccess(user, 'hr_mail')) {
    res.status(403).json({ error: 'HR email template requires purchase or access.' });
    return;
  }

  const filePath = path.join(TEMPLATE_DIR, 'hr_email_template.pdf');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found.' });
    return;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="hr_email_template.pdf"');
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({ error: 'Failed to download the file.' });
    }
  });
};

// Download Referral Template
export const downloadReferralTemplate = (req: Request, res: Response) => {
  const user = req.user;
  if (!hasResourceAccess(user, 'referral')) {
    res.status(403).json({ error: 'Referral template requires purchase or access.' });
    return;
  }

  const filePath = path.join(TEMPLATE_DIR, 'referral_template.pdf');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found.' });
    return;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="referral_template.pdf"');
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({ error: 'Failed to download the file.' });
    }
  });
};

// Download Cold Mail Template
export const downloadColdMailTemplate = (req: Request, res: Response) => {
  const user = req.user;
  if (!hasResourceAccess(user, 'cold_mail')) {
    res.status(403).json({ error: 'Cold mail template requires purchase or access.' });
    return;
  }

  const filePath = path.join(TEMPLATE_DIR, 'cold_mail_template.pdf');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found.' });
    return;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="cold_mail_template.pdf"');
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({ error: 'Failed to download the file.' });
    }
  });
};

// Download Cover Letter Template
export const downloadCoverLetterTemplate = (req: Request, res: Response) => {
  const user = req.user;
  if (!hasResourceAccess(user, 'cover_letter')) {
    res.status(403).json({ error: 'Cover letter template requires purchase or access.' });
    return;
  }

  const filePath = path.join(TEMPLATE_DIR, 'cover_letter_template.pdf');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found.' });
    return;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="cover_letter_template.pdf"');
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({ error: 'Failed to download the file.' });
    }
  });
};