import React from 'react';
import { GraduationCap, Users, Calendar, Sparkles, Award, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  bookingsCount,
  onOpenJudgeModal,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand" onClick={() => setActiveTab('match')}>
          <div className="brand-icon">
            <GraduationCap size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">AlumniBridge</span>
              <span className="brand-tag">AI Mentorship</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              1st & 2nd Year Students ✕ Alumni
            </div>
          </div>
        </div>

        <nav className="nav-links">
          <button
            id="nav-btn-match"
            className={`nav-item ${activeTab === 'match' ? 'active' : ''}`}
            onClick={() => setActiveTab('match')}
          >
            <Sparkles size={16} />
            <span>Find Mentors</span>
          </button>

          <button
            id="nav-btn-explore"
            className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Users size={16} />
            <span>Browse All (500)</span>
          </button>

          {currentUser && (
            <button
              id="nav-btn-bookings"
              className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <Calendar size={16} />
              <span>My Bookings</span>
              {bookingsCount > 0 && (
                <span style={{
                  background: '#10b981',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  padding: '1px 6px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {bookingsCount}
                </span>
              )}
            </button>
          )}
        </nav>

        <div className="nav-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6366f1&color=fff`}
                  alt={currentUser.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-glow)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
                    {currentUser.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                    {currentUser.school || 'GSU'}
                  </span>
                </div>
              </div>

              <button
                id="btn-logout"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                onClick={onLogout}
                title="Log Out"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              id="btn-login-open"
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={onOpenAuthModal}
            >
              <LogIn size={15} />
              <span>Log In</span>
            </button>
          )}

          <button
            id="judge-pitch-btn"
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem', borderColor: 'rgba(99, 102, 241, 0.4)' }}
            onClick={onOpenJudgeModal}
          >
            <Award size={16} color="#818cf8" />
            <span>Judge Pitch</span>
          </button>
        </div>
      </div>
    </header>
  );
}
