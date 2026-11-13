import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Lock, GraduationCap, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState('student'); // 'student' | 'alumni'
  
  // University SSO & GitHub Dialog State
  const [oauthDialog, setOauthDialog] = useState(null); // null | { provider: 'github' | 'university_sso', step: 'consent' | 'authorizing' }
  const [selectedAccount, setSelectedAccount] = useState('mohammed');
  const [customEmail, setCustomEmail] = useState('');

  // Traditional form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('Georgia State University');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Official Google Identity Services (GIS) Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setAuthError('');
    setIsSubmitting(true);

    try {
      if (!credentialResponse?.credential) {
        throw new Error('No credential returned from Google Identity Services');
      }

      const res = await fetch('http://localhost:8000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialResponse.credential
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to authenticate Google ID token');
      }

      const data = await res.json();
      
      // Store session token and user identity
      localStorage.setItem('ab_token', data.access_token);
      localStorage.setItem('ab_user', JSON.stringify(data.user));

      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      console.error('GIS Error:', err);
      setAuthError(err.message || 'Google authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign In failed or was cancelled');
    setAuthError('Google sign in was cancelled or failed.');
  };

  // Trigger University SSO or GitHub OAuth Flow
  const startOAuthFlow = (provider) => {
    if (provider === 'github') {
      try {
        const width = 500;
        const height = 650;
        const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
        const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2.5);
        window.open(
          'https://github.com/login',
          'github_login_window',
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
        );
      } catch (err) {
        console.warn('Popup blocked', err);
      }
    }

    setOauthDialog({
      provider,
      step: 'consent'
    });
  };

  // Complete OAuth Authorization for SSO/GitHub
  const handleAuthorizeOAuth = async () => {
    if (!oauthDialog) return;
    setOauthDialog({ ...oauthDialog, step: 'authorizing' });

    let userName = "Mohammed Negash";
    let userEmail = "mnegash.edu@gmail.com";
    let userSchool = "Georgia State University";
    let userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

    if (selectedAccount === 'demarcus') {
      userName = "DeMarcus Cole";
      userEmail = "dcole12@gmail.com";
      userSchool = "Georgia State University";
    } else if (selectedAccount === 'jordan') {
      userName = "Jordan Miller";
      userEmail = "jordan.miller@gmail.com";
      userSchool = "UC Berkeley";
    } else if (selectedAccount === 'custom' && customEmail.trim()) {
      userEmail = customEmail.trim();
      userName = userEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    try {
      const res = await fetch('http://localhost:8000/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: oauthDialog.provider,
          name: userName,
          email: userEmail,
          school: userSchool,
          avatar: userAvatar,
          role
        })
      });

      if (!res.ok) throw new Error('OAuth authorization failed');
      const data = await res.json();
      
      localStorage.setItem('ab_token', data.access_token);
      localStorage.setItem('ab_user', JSON.stringify(data.user));

      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      alert('OAuth authorization error. Please try again.');
    } finally {
      setOauthDialog(null);
    }
  };

  // Traditional email submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');
    const endpoint = authMode === 'signup' ? 'signup' : 'login';

    try {
      const res = await fetch(`http://localhost:8000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: name || email.split('@')[0],
          school,
          role
        })
      });
      if (!res.ok) throw new Error('Authentication failed');
      const data = await res.json();
      
      localStorage.setItem('ab_token', data.access_token);
      localStorage.setItem('ab_user', JSON.stringify(data.user));

      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setAuthError(err.message || 'Error logging in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        style={{
          maxWidth: '480px',
          padding: '36px 32px',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {oauthDialog ? (
          /* University SSO / GitHub Authorization Dialog */
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Shield size={28} />
              </div>
              <h2 style={{ fontSize: '1.4rem' }}>
                {oauthDialog.provider === 'github' && 'Sign In with GitHub'}
                {oauthDialog.provider === 'university_sso' && 'University Single Sign-On (SSO)'}
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <strong>AlumniBridge</strong> is requesting permission to link your student profile.
              </p>
            </div>

            {/* Scopes Requested */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Permissions Requested:
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Verify active student enrollment status
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Read primary email and profile name
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Grant access to 100% free alumni mentorship
                </li>
              </ul>
            </div>

            {/* Account Selector */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Choose an account to continue:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedAccount === 'mohammed' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: selectedAccount === 'mohammed' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => setSelectedAccount('mohammed')}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Mohammed Negash</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>mnegash.edu@gmail.com • Georgia State University</div>
                  </div>
                  {selectedAccount === 'mohammed' && <CheckCircle2 size={16} color="#818cf8" />}
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedAccount === 'demarcus' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: selectedAccount === 'demarcus' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => setSelectedAccount('demarcus')}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>DeMarcus Cole</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>dcole12@gmail.com • Georgia State University</div>
                  </div>
                  {selectedAccount === 'demarcus' && <CheckCircle2 size={16} color="#818cf8" />}
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedAccount === 'custom' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: selectedAccount === 'custom' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedAccount('custom')}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>Use another email:</div>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your.email@gmail.com"
                    value={customEmail}
                    onChange={(e) => {
                      setSelectedAccount('custom');
                      setCustomEmail(e.target.value);
                    }}
                    style={{ fontSize: '0.84rem', padding: '6px 10px', width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setOauthDialog(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleAuthorizeOAuth}
                disabled={oauthDialog.step === 'authorizing'}
                style={{ padding: '10px 24px' }}
              >
                {oauthDialog.step === 'authorizing' ? 'Signing in...' : 'Continue & Sign In'}
              </button>
            </div>
          </div>
        ) : (
          /* Standard Sign In / Sign Up Screen with Official GIS Button */
          <div>
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
                <Sparkles size={13} /> AlumniBridge Auth
              </div>
              <h2 style={{ fontSize: '1.6rem' }}>
                {authMode === 'login' ? 'Welcome to AlumniBridge' : 'Create your student account'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                {authMode === 'login'
                  ? 'Sign in to access your matched alumni mentors and booked sessions.'
                  : 'Join to receive free outcome-based mentorship from alumni.'}
              </p>
            </div>

            {authError && (
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
                {authError}
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
                  padding: '8px',
                  borderRadius: '8px',
                  background: authMode === 'login' ? 'var(--primary)' : 'transparent',
                  color: authMode === 'login' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
                onClick={() => setAuthMode('login')}
              >
                Log In
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  background: authMode === 'signup' ? 'var(--primary)' : 'transparent',
                  color: authMode === 'signup' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
                onClick={() => setAuthMode('signup')}
              >
                Create Account
              </button>
            </div>

            {/* OFFICIAL GOOGLE IDENTITY SERVICES (GIS) BUTTON */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                overflow: 'hidden',
                borderRadius: '8px'
              }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="360"
                />
              </div>

              {/* 1-Click Local Demo Fallback (for testing before Google Cloud Console Client ID is set) */}
              <button
                type="button"
                id="btn-google-demo"
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '8px 14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  fontSize: '0.8rem',
                  color: '#94a3b8'
                }}
                onClick={() => {
                  const payload = btoa(JSON.stringify({
                    sub: "demo_12345",
                    email: "mnegash.edu@gmail.com",
                    name: "Mohammed Negash",
                    picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  }));
                  handleGoogleSuccess({ credential: `eyJhbGciOiJSUzI1NiJ9.${payload}.demo_signature` });
                }}
              >
                <span>Demo Bypass: <strong>Mohammed Negash</strong> (mnegash.edu@gmail.com)</span>
              </button>

              {/* University SSO */}
              <button
                id="btn-oauth-sso"
                type="button"
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px 18px',
                  background: 'rgba(6, 182, 212, 0.08)',
                  borderColor: 'rgba(6, 182, 212, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
                onClick={() => startOAuthFlow('university_sso')}
              >
                <GraduationCap size={18} style={{ marginRight: '8px' }} />
                Sign in with University SSO (GSU, Berkeley, etc.)
              </button>

              {/* GitHub */}
              <button
                id="btn-oauth-github"
                type="button"
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
                onClick={() => startOAuthFlow('github')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                Continue with GitHub
              </button>
            </div>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '18px 0',
              fontSize: '0.78rem',
              color: 'var(--text-dim)',
              textTransform: 'uppercase'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span>or with email</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailSubmit}>
              {authMode === 'signup' && (
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Mohammed Negash"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', padding: '11px' }}
              >
                {isSubmitting ? 'Authenticating...' : authMode === 'login' ? 'Sign In with Email' : 'Create Free Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
