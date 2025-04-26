import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import axios from 'axios';

axios.defaults.baseURL = 'https://avocatlawoffice.com/livex/public';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      localStorage.removeItem('accessToken');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const response = await axios.post('/api/auth/login/google', {
        token: idToken,
      });

      localStorage.setItem('accessToken', response.data.data.accessToken);
      setUser(response.data.data.user);
      
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      await firebaseSignOut(auth);
      localStorage.removeItem('accessToken');
      setUser(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    user, 
    loading, 
    error, 
    handleGoogleLogin, 
    handleLogout 
  };
};