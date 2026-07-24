import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSuperAdmin, checkSuperAdmin } from '../utils/api';

export default function CreateSuperAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkSuperAdmin()
      .then((exists) => {
        if (exists) {
          navigate('/login', { replace: true });
        }
      })
      .catch(() => {
        // If server is unreachable, SetupGuard should have caught it, but if they navigated directly, let them stay or handle it
      });
  }, [navigate]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.username.trim()) e.username = 'Email Id is required.';
    else if (form.username.length < 3) e.username = 'Email Id must be at least 3 characters.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match.';
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
      await createSuperAdmin({
        name: form.name,
        username: form.username,
        password: form.password,
      });
      navigate('/login', { replace: true, state: { fromSetup: true } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card glass-panel">
        {/* Header */}
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

        <div className="auth-header">
          <div className="badge badge-orange">One-Time Setup</div>
          <h1 className="auth-title">Create Super Admin</h1>
          <p className="auth-subtitle">
            Set up the master account. This can only be done once.
          </p>
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
          {/* Full Name */}
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="setup-name">Full Name</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="setup-name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* Email Id */}
          <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
            <label htmlFor="setup-username">Email Id</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input 
                type="text" 
                id="setup-username"
                name="username"
                className="input-field with-icon"
                placeholder="Enter your email id"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          {/* Password */}
          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="setup-password">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="setup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="setup-confirm-password">Confirm Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <input
                id="setup-confirm-password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn-primary submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                Create Super Admin
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="auth-note">
          🔒 This setup page will no longer be accessible after completion.
        </p>
      </div>
    </div>
  );
}
