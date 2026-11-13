import React from 'react';
import { GraduationCap, Users, Calendar, Sparkles, Award } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, bookingsCount, onOpenJudgeModal }) {
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
            <span>Browse All (12)</span>
          </button>

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
        </nav>

        <div className="nav-actions">
          <button
            id="judge-pitch-btn"
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem', borderColor: 'rgba(99, 102, 241, 0.4)' }}
            onClick={onOpenJudgeModal}
          >
            <Award size={16} color="#818cf8" />
            <span>Judge Demo & Pitch</span>
          </button>
        </div>
      </div>
    </header>
  );
}
