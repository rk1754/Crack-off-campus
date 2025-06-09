import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface UploadResponse {
  success: boolean;
  resumeUrl: string;
  publicId: string;
  message: string;
}

export const useResumeUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadResume = async (file: File): Promise<string | null> => {
    if (!file) {
      toast.error('Please select a file to upload');
      return null;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      return null;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2 MB limit');
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post<UploadResponse>(
        'https://api.crackoffcampus.com/api/v1/resume-upload/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          },
        }
      );

      if (response.data.success) {
        toast.success('Resume uploaded successfully');
        return response.data.resumeUrl;
      } else {
        toast.error(response.data.message || 'Upload failed');
        return null;
      }
    } catch (error: any) {
      console.error('Resume upload error:', error);
      toast.error(
        error?.response?.data?.message || 
        error.message || 
        'Failed to upload resume'
      );
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadResume,
    isUploading,
    uploadProgress,
  };
};
