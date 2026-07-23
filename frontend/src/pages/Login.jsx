import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as loginApi, checkSuperAdmin } from '../utils/api';
import { saveToken, removeToken, isAuthenticated, getUserRole } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromSetup = location.state?.fromSetup;
  const sessionExpired = location.state?.sessionExpired;

  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If already authenticated go to correct dashboard
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

    // Verify if super admin exists; if not, go to setup page
    checkSuperAdmin()
      .then((exists) => {
        if (!exists) {
          navigate('/setup', { replace: true });
        }
      })
      .catch(() => {
        // Handle gracefully if endpoint fails
      });
  }, [navigate]);

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await loginApi({ username: form.username, password: form.password });
      saveToken(data.token);
      
      const role = getUserRole();
      if (role === 'SUPER_ADMIN') {
        navigate('/dashboard', { replace: true });
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/salesperson-dashboard', { replace: true });
      }
    } catch (err) {
      removeToken();
      setServerError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card glass-panel">
        {/* Brand */}
        <div className="auth-brand">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="18.5" cy="17.5" r="3.5" />
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              <path d="M12 17.5V14l-3-3 4-3 2 3h3" />
            </svg>
          </div>
          <span className="brand-name">HERO<span className="brand-highlight">CYCLE</span></span>
        </div>

        {/* Session expired / setup success banners */}
        {sessionExpired && (
          <div className="alert-warning">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <path d="M12 9v4m0 4h.01" />
            </svg>
            Your session has expired. Please log in again.
          </div>
        )}
        {fromSetup && !sessionExpired && (
          <div className="alert-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Super Admin created! You can now log in.
          </div>
        )}

        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to the Hero Cycle admin panel.</p>
        </div>

        {serverError && (
          <div className="alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Username */}
          <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
            <label htmlFor="login-username">Username</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="login-username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
              />
            </div>
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          {/* Password */}
          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button type="button" className="toggle-pwd" onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <path d="m1 1 22 22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
