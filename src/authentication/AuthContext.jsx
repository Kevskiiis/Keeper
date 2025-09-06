// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await axios.get('/api/login/status', {
          withCredentials: true
        });
        setIsAuthenticated(res.data.isAuthenticated);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
