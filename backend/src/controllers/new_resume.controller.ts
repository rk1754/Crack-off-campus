import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

// Directory where static templates are stored
const TEMPLATE_DIR = path.join(__dirname, '../static/templates');

// Subscription types
const SUBSCRIPTION_RESUME = 'resume';
const SUBSCRIPTION_TEMPLATES = 'other_templates';

// Helper to check subscription
function hasSubscription(user: any, requiredType: string): boolean {
  if (!user?.subscription_type) {
    return false; // Handle case where user or subscription_type is undefined
  }
  if (requiredType === SUBSCRIPTION_RESUME) {
    return ['resume', 'booster', 'standard', 'basic'].includes(user.subscription_type);
  }
  return ['other_templates', 'booster', 'standard', 'basic'].includes(user.subscription_type);
}

// Download Resume Template
export const downloadResumeTemplate = (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized: User not authenticated.' });
    return;
  }

  if (!hasSubscription(user, SUBSCRIPTION_RESUME)) {
    res.status(403).json({ error: 'Resume template requires resume subscription (99 rs).' });
    return;
  }

  const filePath = path.join(TEMPLATE_DIR, 'resume_template.pdf');
  // Remove debug log for production
  // console.log('File path:', filePath);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found.' });
    return;
  }

  // Set headers for file download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="resume_template.pdf"');

  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res).on('error', (err) => {
    console.error('Error streaming file:', err);
    res.status(500).json({ error: 'Failed to download the file.' });
  });
};


// Download HR Email Template
export const downloadHrEmailTemplate = (req: Request, res: Response) => {
    const user = req.user;
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'HR email template requires templates subscription (49 rs).' });
        return;
    }

    const filePath = path.join(TEMPLATE_DIR, 'hr_email_template.pdf');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found.' });
        return;
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="hr_email_template.pdf"');

    // Send the file
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
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'Referral template requires templates subscription (49 rs).' });
        return;
    }

    const filePath = path.join(TEMPLATE_DIR, 'referral_template.pdf');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found.' });
        return;
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="referral_template.pdf"');

    // Send the file
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
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'Cold mail template requires templates subscription (49 rs).' });
        return;
    }

    const filePath = path.join(TEMPLATE_DIR, 'cold_mail_template.pdf');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found.' });
        return;
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cold_mail_template.pdf"');

    // Send the file
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
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'Cover letter template requires templates subscription (49 rs).' });
        return;
    }

    const filePath = path.join(TEMPLATE_DIR, 'cover_letter_template.pdf');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found.' });
        return;
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cover_letter_template.pdf"');

    // Send the file
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).json({ error: 'Failed to download the file.' });
        }
    });
};