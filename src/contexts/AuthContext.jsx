import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication functions
  const signIn = async (email, password) => {
    // TODO: Implement actual authentication
    setCurrentUser({ email, id: 'user123' });
  };

  const signUp = async (email, password) => {
    // TODO: Implement actual authentication
    setCurrentUser({ email, id: 'user123' });
  };

  const signOut = async () => {
    setCurrentUser(null);
  };

  const signInWithGoogle = async () => {
    // TODO: Implement Google authentication
    setCurrentUser({ email: 'user@google.com', id: 'google123' });
  };

  useEffect(() => {
    // Check for existing session
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Update localStorage when user changes
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  const value = {
    currentUser,
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}