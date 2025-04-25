import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import axios from 'axios';

// Configure axios to point to your Laravel backend
axios.defaults.baseURL = 'https://avocatlawoffice.com/testauthgoogle/public';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for existing session on component mount
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
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      localStorage.removeItem('accessToken');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Sign in with Google via Firebase
      const result = await signInWithPopup(auth, googleProvider);
      
      // 2. Get Google ID token
      const idToken = await result.user.getIdToken();
      
      // 3. Send token to your Laravel API
      const response = await axios.post('/api/login/google', {
        token: idToken,
      });

      // 4. Store the Passport token and update UI
      localStorage.setItem('accessToken', response.data.accessToken);
      setUser(response.data.user);
      
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
      // 1. Logout from Laravel
      await axios.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // 2. Logout from Firebase
      await firebaseSignOut(auth);

      // 3. Clear local state
      localStorage.removeItem('accessToken');
      setUser(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Google Login with Laravel API</h1>
      </header>

      <main>
        {error && <div className="error">{error}</div>}

        {user ? (
          <div className="profile">
            <h2>Welcome, {user.name}!</h2>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout} disabled={loading}>
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        ) : (
          <button onClick={handleGoogleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        )}
      </main>

      <style jsx>{`
        .App {
          text-align: center;
          padding: 2rem;
        }
        .error {
          color: red;
          margin: 1rem 0;
        }
        .profile {
          margin: 2rem auto;
          max-width: 400px;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        button {
          padding: 0.5rem 1rem;
          background: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default App;