import express, { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

const router = express.Router();

// Configure multer for handling file uploads
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF, DOC, DOCX files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

// POST endpoint to upload file to Gofile
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file provided'
      });
      return;
    }

    // Create FormData for Gofile API
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('token', 'gVsmPar8khN8SAt6YjJCylSXWa75MWiK');

    // Make request to Gofile API
    const response = await axios.post('https://upload.gofile.io/uploadfile', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000, // 30 second timeout
    });    if (response.data.status === 'ok') {
      // Return success response with download URL
      res.json({
        success: true,
        downloadUrl: response.data.data.downloadPage,
        message: 'File uploaded successfully to Gofile'
      });
      return;
    } else {
      throw new Error(response.data.message || 'Upload failed');
    }

  } catch (error: any) {
    console.error('Gofile upload error:', error);
      // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      res.status(408).json({
        success: false,
        message: 'Upload timeout. Please try again.'
      });
      return;
    }
    
    if (error.response?.status === 401) {
      res.status(500).json({
        success: false,
        message: 'Invalid Gofile API token'
      });
      return;
    }
    
    if (error.response?.status === 413) {
      res.status(413).json({
        success: false,
        message: 'File too large for upload'
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
