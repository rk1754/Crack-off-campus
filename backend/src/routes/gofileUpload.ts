import express, { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

const router = express.Router();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

// Upload file to Gofile
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
      return;
    }

    // Create form data for Gofile API
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('token', 'gVsmPar8khN8SAt6YjJCylSXWa75MWiK');

    // Upload to Gofile
    const gofileResponse = await axios.post('https://upload.gofile.io/uploadfile', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (gofileResponse.data.status === 'ok') {
      res.json({
        success: true,
        resumeUrl: gofileResponse.data.data.downloadPage,
        message: 'File uploaded successfully to Gofile'
      });
    } else {
      throw new Error(gofileResponse.data.message || 'Upload to Gofile failed');
    }

  } catch (error: any) {
    console.error('Gofile upload error:', error);
      // Handle specific errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File size exceeds 2MB limit'
      });
      return;
    }
    
    if (error.message === 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.') {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload file to Gofile'
    });
  }
});

export default router;
