// src/hooks/useGoogleAuth.ts

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider} from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import axios from 'axios';
import { login } from '@/redux/slices/userSlice';
import { toast } from 'sonner';
import { BACKEND_URL } from '@/redux/config';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signInWithGoogle = async (redirectPath = '/') => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get ID token from Firebase
      const idToken = await result.user.getIdToken();
      
      // Send token to backend for verification and user creation/authentication
      const response = await axios.post(`${BACKEND_URL}/auth/google`, {
        idToken,
      });
      
      if (response.data.success) {
        // Set user in Redux store
        dispatch(login({ user: response.data.user, token: response.data.token }));
        toast.success('Google sign-in successful!');
        navigate(redirectPath === '/profile' ? '/' : redirectPath);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error(error.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
};

export default useGoogleAuth;
