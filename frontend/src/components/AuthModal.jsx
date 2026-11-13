import React, { useState } from 'react';
import { X, Lock, User, GraduationCap, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('Georgia State University');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const endpoint = authMode === 'signup' ? 'signup' : 'login';

    try {
      const res = await fetch(`http://localhost:8000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          password,
          name: authMode === 'signup' ? name : undefined,
          school: authMode === 'signup' ? school : undefined,
          role: 'student'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Save valid token and user
      localStorage.setItem('ab_token', data.access_token);
      localStorage.setItem('ab_user', JSON.stringify(data.user));

      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        style={{
          maxWidth: '440px',
          padding: '36px 32px',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.12)',
            color: '#a5b4fc',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '10px'
          }}>
            <Sparkles size={13} /> AlumniBridge Student Access
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>
            {authMode === 'login' ? 'Sign In to AlumniBridge' : 'Create an Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
            {authMode === 'login'
              ? 'Enter your registered username and password to log in.'
              : 'Create an account to save your profile and book free mentorship.'}
          </p>
        </div>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            marginBottom: '16px',
            textAlign: 'left'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '8px',
              background: authMode === 'login' ? 'var(--primary)' : 'transparent',
              color: authMode === 'login' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.15s ease'
            }}
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
            }}
          >
            Log In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '8px',
              background: authMode === 'signup' ? 'var(--primary)' : 'transparent',
              color: authMode === 'signup' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 0.15s ease'
            }}
            onClick={() => {
              setAuthMode('signup');
              setErrorMsg('');
            }}
          >
            Create Account
          </button>
        </div>

        {/* Username & Password Form */}
        <form onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} /> Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Mohammed Negash"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={14} /> University / College
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Georgia State University"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> Username
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={authMode === 'signup' ? 'Choose a username (e.g. mnegash)' : 'Enter your username'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder={authMode === 'signup' ? 'Min 6 characters' : 'Enter password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 600 }}
          >
            {isSubmitting
              ? 'Verifying...'
              : authMode === 'login'
              ? 'Log In'
              : 'Create Account'}
          </button>
        </form>

      </div>
    </div>
  );
}
