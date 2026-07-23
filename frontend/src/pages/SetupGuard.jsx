import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSuperAdmin } from '../utils/api';
import { isAuthenticated, getUserRole } from '../utils/auth';

export default function SetupGuard() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking'); // 'checking' | 'error'

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      if (role === 'SUPER_ADMIN') {
        navigate('/dashboard', { replace: true });
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/salesperson-dashboard', { replace: true });
      }
      return;
    }

    checkSuperAdmin()
      .then((exists) => {
        if (exists) {
          navigate('/login', { replace: true });
        } else {
          navigate('/setup', { replace: true });
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, [navigate]);

  if (status === 'error') {
    return (
      <div className="guard-screen">
        <div className="guard-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#dc2626' }}>
            Cannot reach server
          </h2>
          <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: '#4b5563' }}>
            Make sure the backend is running and try refreshing the page.
          </p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render absolutely nothing during initial check (no flashy loaders)
  return null;
}
