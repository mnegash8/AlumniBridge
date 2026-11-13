import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Lock, GraduationCap, ArrowRight, UserCheck, Sparkles, User, ChevronRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState('student'); // 'student' | 'alumni'
  
  // OAuth Dialog State
  const [oauthDialog, setOauthDialog] = useState(null); // null | { provider: 'google' | 'github' | 'university_sso', step: 'consent' | 'authorizing' }
  const [selectedAccount, setSelectedAccount] = useState('mohammed');
  const [customEmail, setCustomEmail] = useState('');

  // Google Sign-In specific states (matching Google's exact web sign-in UI)
  const [googleStep, setGoogleStep] = useState('email'); // 'email' | 'password'
  const [googleCustomEmail, setGoogleCustomEmail] = useState('mnegash.edu@gmail.com');
  const [googlePassword, setGooglePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // Traditional form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('Georgia State University');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger OAuth flow
  const startOAuthFlow = (provider) => {
    if (provider === 'google') {
      // Displays the exact 2-column Google Sign-In interface to create/login the account for our website
      setGoogleStep('email');
      setGoogleCustomEmail('mnegash.edu@gmail.com');
      setGooglePassword('');
    } else if (provider === 'github') {
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

  // Complete Google Sign In & Account Creation for AlumniBridge
  const handleGoogleSubmit = async (userEmailToUse) => {
    const finalEmail = (userEmailToUse || googleCustomEmail || 'mnegash.edu@gmail.com').trim();
    const rawName = finalEmail.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = rawName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || "Mohammed Negash";

    setOauthDialog({ provider: 'google', step: 'authorizing' });

    try {
      const res = await fetch('http://localhost:8000/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          name: formattedName.includes('Mnegash') ? 'Mohammed Negash' : formattedName,
          email: finalEmail,
          school: 'Georgia State University',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          role
        })
      });

      if (!res.ok) throw new Error('Google authorization failed');
      const data = await res.json();
      
      // Save session in localStorage
      localStorage.setItem('ab_token', data.access_token);
      localStorage.setItem('ab_user', JSON.stringify(data.user));

      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Google authorization error. Please try again.');
    } finally {
      setOauthDialog(null);
    }
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
      alert(err.message || 'Error logging in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        style={{
          maxWidth: oauthDialog?.provider === 'google' ? '740px' : '520px',
          padding: oauthDialog?.provider === 'google' ? '44px 44px 36px' : '36px',
          background: oauthDialog?.provider === 'google' ? '#1f1f1f' : 'var(--bg-card)',
          borderRadius: oauthDialog?.provider === 'google' ? '28px' : '16px',
          border: oauthDialog?.provider === 'google' ? '1px solid #3c4043' : '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} style={{ top: '20px', right: '20px' }}>
          <X size={20} />
        </button>

        {/* EXACT GOOGLE SIGN-IN EXPERIENCE (2-COLUMN LAYOUT) */}
        {oauthDialog?.provider === 'google' ? (
          <div className="animate-fade-in" style={{ fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.25fr',
              gap: '40px',
              alignItems: 'start'
            }}>
              {/* LEFT COLUMN: Google Logo & Heading */}
              <div>
                <svg viewBox="0 0 48 48" width="48" height="48" style={{ display: 'block', marginBottom: '20px' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>

                <h1 style={{
                  fontSize: '2.1rem',
                  fontWeight: 400,
                  color: '#e8eaed',
                  margin: '0 0 10px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}>
                  {googleStep === 'password' ? 'Welcome' : 'Sign in'}
                </h1>

                <p style={{ fontSize: '1rem', color: '#e8eaed', margin: '0 0 6px' }}>
                  Use your Google Account
                </p>

                <p style={{ fontSize: '0.86rem', color: '#9aa0a6', margin: '0' }}>
                  to create or access your student account on <strong style={{ color: '#fff' }}>AlumniBridge</strong>
                </p>
              </div>

              {/* RIGHT COLUMN: Interactive Input Area */}
              <div>
                {/* STEP 1: Email or Phone Input */}
                {googleStep === 'email' && (
                  <div>
                    {/* Outlined Material Input Field */}
                    <div style={{
                      position: 'relative',
                      border: isInputFocused ? '2px solid #8ab4f8' : '1px solid #8e918f',
                      borderRadius: '4px',
                      padding: '12px 14px',
                      background: 'transparent',
                      marginTop: '6px',
                      transition: 'border 0.2s ease'
                    }}>
                      <label style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '10px',
                        background: '#1f1f1f',
                        padding: '0 4px',
                        fontSize: '0.75rem',
                        color: isInputFocused ? '#8ab4f8' : '#9aa0a6',
                        fontWeight: 500
                      }}>
                        Email or phone
                      </label>
                      <input
                        type="text"
                        autoFocus
                        value={googleCustomEmail}
                        onChange={(e) => setGoogleCustomEmail(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        placeholder="mnegash.edu@gmail.com"
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: '#e8eaed',
                          fontSize: '1rem',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && googleCustomEmail.trim()) {
                            setGoogleStep('password');
                          }
                        }}
                      />
                    </div>

                    <div style={{ marginTop: '9px', textAlign: 'left' }}>
                      <a
                        href="#forgot"
                        onClick={(e) => e.preventDefault()}
                        style={{ fontSize: '0.84rem', color: '#8ab4f8', textDecoration: 'none', fontWeight: 500 }}
                      >
                        Forgot email?
                      </a>
                    </div>

                    <p style={{
                      fontSize: '0.84rem',
                      color: '#9aa0a6',
                      lineHeight: 1.45,
                      marginTop: '28px',
                      marginBottom: '28px'
                    }}>
                      Not your computer? Use Guest mode to sign in privately.{' '}
                      <a href="#guest" onClick={(e) => e.preventDefault()} style={{ color: '#8ab4f8', textDecoration: 'none' }}>
                        Learn more about using Guest mode
                      </a>
                    </p>

                    {/* Bottom Action Buttons */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '32px'
                    }}>
                      <a
                        href="#create"
                        onClick={(e) => {
                          e.preventDefault();
                          setGoogleCustomEmail('mnegash.edu@gmail.com');
                          setGoogleStep('password');
                        }}
                        style={{
                          fontSize: '0.88rem',
                          color: '#8ab4f8',
                          textDecoration: 'none',
                          fontWeight: 500
                        }}
                      >
                        Create account
                      </a>

                      <button
                        type="button"
                        style={{
                          background: '#8ab4f8',
                          color: '#001d35',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '10px 24px',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'opacity 0.2s ease',
                          opacity: googleCustomEmail.trim() ? 1 : 0.6
                        }}
                        disabled={!googleCustomEmail.trim()}
                        onClick={() => {
                          if (!googleCustomEmail.trim()) return;
                          setGoogleStep('password');
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Password Input */}
                {googleStep === 'password' && (
                  <div>
                    {/* User account chip with back option */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 12px 4px 6px',
                        borderRadius: '16px',
                        border: '1px solid #5f6368',
                        marginBottom: '24px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setGoogleStep('email')}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#7c3aed',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}>
                        M
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#e8eaed' }}>{googleCustomEmail}</span>
                    </div>

                    <div style={{
                      position: 'relative',
                      border: isInputFocused ? '2px solid #8ab4f8' : '1px solid #8e918f',
                      borderRadius: '4px',
                      padding: '12px 14px',
                      background: 'transparent',
                      transition: 'border 0.2s ease'
                    }}>
                      <label style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '10px',
                        background: '#1f1f1f',
                        padding: '0 4px',
                        fontSize: '0.75rem',
                        color: isInputFocused ? '#8ab4f8' : '#9aa0a6',
                        fontWeight: 500
                      }}>
                        Enter your password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoFocus
                        placeholder="••••••••"
                        value={googlePassword}
                        onChange={(e) => setGooglePassword(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: '#e8eaed',
                          fontSize: '1rem',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleGoogleSubmit(googleCustomEmail);
                          }
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                      <input
                        type="checkbox"
                        id="show-pass-check"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <label htmlFor="show-pass-check" style={{ fontSize: '0.82rem', color: '#e8eaed', cursor: 'pointer' }}>
                        Show password
                      </label>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '36px'
                    }}>
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8ab4f8',
                          fontSize: '0.88rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          padding: '8px 0'
                        }}
                        onClick={() => setGoogleStep('email')}
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        style={{
                          background: '#8ab4f8',
                          color: '#001d35',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '10px 28px',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        disabled={oauthDialog.step === 'authorizing'}
                        onClick={() => handleGoogleSubmit(googleCustomEmail)}
                      >
                        {oauthDialog.step === 'authorizing' ? 'Signing in...' : 'Sign in'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Google Footer info bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #3c4043',
              marginTop: '32px',
              paddingTop: '16px',
              fontSize: '0.78rem',
              color: '#9aa0a6'
            }}>
              <span>English (United States)</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span>Help</span>
                <span>Privacy</span>
                <span>Terms</span>
              </div>
            </div>
          </div>
        ) : oauthDialog ? (
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
          /* Standard Sign In / Sign Up Screen */
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
                {authMode === 'login' ? 'Welcome back to AlumniBridge' : 'Create your student account'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                {authMode === 'login'
                  ? 'Sign in to access your matched alumni mentors and booked sessions.'
                  : 'Join to receive free outcome-based mentorship from alumni.'}
              </p>
            </div>

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

            {/* Primary OAuth Login Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
              {/* Google */}
              <button
                id="btn-oauth-google"
                type="button"
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px 18px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.92rem',
                  fontWeight: 600
                }}
                onClick={() => startOAuthFlow('google')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              {/* University SSO */}
              <button
                id="btn-oauth-sso"
                type="button"
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px 18px',
                  background: 'rgba(6, 182, 212, 0.08)',
                  borderColor: 'rgba(6, 182, 212, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.92rem',
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
                  padding: '12px 18px',
                  fontSize: '0.92rem',
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
              margin: '20px 0',
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
                  placeholder="mnegash.edu@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
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
                style={{ width: '100%', padding: '12px' }}
              >
                {authMode === 'login' ? 'Sign In with Email' : 'Create Free Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
