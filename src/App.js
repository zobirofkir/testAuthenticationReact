import React from 'react';
import { useAuth } from './hooks/useAuth';

function App() {

  const { user, loading, error, handleGoogleLogin, handleLogout } = useAuth();

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

    </div>
  );
}

export default App;