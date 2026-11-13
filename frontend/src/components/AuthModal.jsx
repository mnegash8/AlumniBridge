import React, { useState } from 'react';
import { X, Lock, Mail, User, GraduationCap, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('mnegash.edu@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Mohammed Negash');
  const [school, setSchool] = useState('Georgia State University');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const endpoint = authMode === 'signup' ? 'signup' : 'login';

    try {
      const res = await fetch(`http://localhost:8000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: authMode === 'signup' ? name : (name || email.split('@')[0]),
          school: school || 'Georgia State University',
          role: 'student'
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Authentication failed');
      }

      const data = await res.json();
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

  const handleDemoLogin = async (demoName, demoEmail, demoSchool) => {
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: demoEmail,
          password: 'password123',
          name: demoName,
          school: demoSchool,
          role: 'student'
        })
      });

      if (!res.ok) throw new Error('Demo login failed');
      const data = await res.json();
      localStorage.setItem('ab_token', data.access_token);
      localStorage.setItem('ab_user', JSON.stringify(data.user));

      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        style={{
          maxWidth: '460px',
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
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
          <h2 style={{ fontSize: '1.6rem', color: '#f8fafc' }}>
            {authMode === 'login' ? 'Sign In to Your Account' : 'Create Student Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            {authMode === 'login'
              ? 'Enter your email and password to access your alumni matches.'
              : 'Join to receive 100% free outcome-based mentorship from alumni.'}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '22px'
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
            onClick={() => setAuthMode('login')}
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
            onClick={() => setAuthMode('signup')}
          >
            Create Account
          </button>
        </div>

        {/* Regular Login / Password Form */}
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
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                placeholder="••••••••"
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
              ? 'Processing...'
              : authMode === 'login'
              ? 'Sign In with Email'
              : 'Create Free Account'}
          </button>
        </form>

        {/* 1-Click Fast Demo Presets */}
        <div style={{
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            1-Click Demo Logins
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.82rem',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.03)'
              }}
              onClick={() => handleDemoLogin('Mohammed Negash', 'mnegash.edu@gmail.com', 'Georgia State University')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  M
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>Mohammed Negash</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>mnegash.edu@gmail.com</span>
                </div>
              </div>
              <span style={{ color: '#38bdf8', fontSize: '0.75rem' }}>GSU</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.82rem',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.03)'
              }}
              onClick={() => handleDemoLogin('DeMarcus Cole', 'dcole12@gmail.com', 'Georgia State University')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  D
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>DeMarcus Cole</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>dcole12@gmail.com</span>
                </div>
              </div>
              <span style={{ color: '#38bdf8', fontSize: '0.75rem' }}>GSU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
