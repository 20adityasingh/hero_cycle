import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../utils/auth';

// Wraps any protected route — redirects to login if token missing or expired
export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      removeToken();
      navigate('/login', { replace: true, state: { sessionExpired: true } });
    }
  }, [navigate]);

  if (!isAuthenticated()) return null;

  return children;
}
