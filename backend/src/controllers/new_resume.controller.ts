import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

// Directory where static templates are stored
const TEMPLATE_DIR = path.join(__dirname, '../static/templates');

// Subscription types
const SUBSCRIPTION_RESUME = 'resume';
const SUBSCRIPTION_TEMPLATES = 'other_templates';

// Helper to check subscription or boolean access
function hasResumeAccess(user: any): boolean {
  // Check subscription type or boolean column
  const types = [
    user?.subscription_type,
    user?.subscription_type_2,
  ].filter(Boolean);

  return (
    (types.includes('resume') ||
      types.includes('booster') ||
      types.includes('standard')) ||
    user?.resume === true
  );
}

function hasTemplateAccess(user: any): boolean {
  // Check subscription type or boolean columns for any template
  const types = [
    user?.subscription_type,
    user?.subscription_type_2,
  ].filter(Boolean);

  return (
    (types.includes('other_templates') ||
      types.includes('booster') ||
      types.includes('standard') ||
      types.includes('basic')) ||
    user?.referral === true ||
    user?.cold_mail === true ||
    user?.cover_letter === true ||
    user?.hr_mail === true
  );
}

// Individual boolean checks for each template
function hasReferralAccess(user: any): boolean {
  return hasTemplateAccess(user) || user?.referral === true;
}
function hasColdMailAccess(user: any): boolean {
  return hasTemplateAccess(user) || user?.cold_mail === true;
}
function hasCoverLetterAccess(user: any): boolean {
  return hasTemplateAccess(user) || user?.cover_letter === true;
}
function hasHrMailAccess(user: any): boolean {
  return hasTemplateAccess(user) || user?.hr_mail === true;
}

// Download Resume Template
export const downloadResumeTemplate = (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized: User not authenticated.' });
    return;
  }

  if (!hasResumeAccess(user)) {
    res.status(403).json({ error: 'Resume template requires resume subscription or purchase.' });
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
  if (!hasHrMailAccess(user)) {
    res.status(403).json({ error: 'HR email template requires subscription or purchase.' });
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
  if (!hasReferralAccess(user)) {
    res.status(403).json({ error: 'Referral template requires subscription or purchase.' });
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
  if (!hasColdMailAccess(user)) {
    res.status(403).json({ error: 'Cold mail template requires subscription or purchase.' });
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
  if (!hasCoverLetterAccess(user)) {
    res.status(403).json({ error: 'Cover letter template requires subscription or purchase.' });
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