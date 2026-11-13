import React, { useState } from 'react';
import { Sparkles, GraduationCap, Building2, Star, CheckCircle, Search, Gift, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MentorList({
  matches = [],
  studentProfile = null,
  isBrowseMode = false,
  hasMatches = false,
  onSelectMentor,
  onEditProfile,
  onStartMatching
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(24);

  // Extract unique schools
  const availableSchools = Array.from(new Set(matches.map((m) => m.mentor?.school || m.school))).filter(Boolean);

  // Filter matches
  const filteredMatches = matches.filter((item) => {
    const mentor = item.mentor || item;

    // School filter
    if (selectedSchool !== 'ALL' && mentor.school !== selectedSchool) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = mentor.name.toLowerCase().includes(q);
      const inCompany = mentor.company.toLowerCase().includes(q);
      const inRole = mentor.role.toLowerCase().includes(q);
      const inSchool = mentor.school.toLowerCase().includes(q);
      const inMajor = mentor.major.toLowerCase().includes(q);
      const inStrengths = (mentor.key_strengths || []).some((s) => s.toLowerCase().includes(q));
      if (!inName && !inCompany && !inRole && !inSchool && !inMajor && !inStrengths) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* Top Banner with Student Summary (Only if student has parsed resume & matched) */}
      {studentProfile && hasMatches && (
        <div className="glass-panel" style={{
          padding: '18px 24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'rgba(99, 102, 241, 0.08)',
          borderColor: 'rgba(99, 102, 241, 0.25)'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>
              AI MATCHING RESULTS FOR
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {studentProfile.name} • <span style={{ color: '#38bdf8' }}>{studentProfile.school}</span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Target: {studentProfile.target_role || studentProfile.goals} • <span style={{ color: '#10b981', fontWeight: 700 }}>100% Free Mentorship</span>
            </div>
          </div>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            onClick={onEditProfile}
          >
            Adjust Preferences
          </button>
        </div>
      )}

      {/* If in Browse Mode and haven't matched yet, show invitation banner */}
      {isBrowseMode && !hasMatches && (
        <div className="glass-panel" style={{
          padding: '16px 22px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(14, 165, 233, 0.08) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8',
              flexShrink: 0
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                Want to see your personalized match scores?
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Upload your resume and confirm your details in the Match tab to generate AI-ranked match scores.
              </div>
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ fontSize: '0.84rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={onStartMatching}
          >
            <span>Match With Your Resume</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Header and Filter Controls */}
      <div className="recommendations-header">
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>
            {isBrowseMode && !hasMatches ? 'Browse Alumni Mentors' : 'Recommended Alumni Mentors'}{' '}
            <span style={{ color: '#818cf8', fontSize: '1.1rem' }}>({filteredMatches.length})</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {isBrowseMode && !hasMatches
              ? 'Explore verified alumni. Upload your resume and fill out your details in the Match tab to generate personalized match scores.'
              : 'All sessions are 100% free. Ranked by university affinity, career trajectory, and shared obstacles.'}
          </p>
        </div>

        <div className="filters-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={15} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search by company, role, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                width: '210px'
              }}
            />
          </div>

          <div style={{ height: '20px', width: '1px', background: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={15} color="var(--text-dim)" />
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL" style={{ background: '#0f172a' }}>All Universities</option>
              {availableSchools.map((sch) => (
                <option key={sch} value={sch} style={{ background: '#0f172a' }}>
                  {sch}
                </option>
              ))}
            </select>
          </div>

          <div style={{ height: '20px', width: '1px', background: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>
            <Gift size={14} /> Free Access
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="mentors-grid">
        {filteredMatches.slice(0, visibleCount).map((item, index) => {
          const mentor = item.mentor || item;
          const matchScore = typeof item.match_score === 'number' ? item.match_score : null;
          const isSchoolMatch = item.is_school_match || (studentProfile && studentProfile.school === mentor.school);
          const aiExplanation = item.ai_explanation || (
            `As a ${mentor.school} alum currently working at ${mentor.company}, ${mentor.name} understands the curriculum and recruiting paths available to students.`
          );
          const reasons = item.reasons || [
            `Alumni from ${mentor.school} with verified experience`,
            `Currently ${mentor.role} at ${mentor.company}`,
            `Offers 100% free resume review & prep sessions`
          ];

          return (
            <div
              key={mentor.id}
              id={`mentor-card-${mentor.id}`}
              className="glass-panel glass-panel-hover mentor-card"
            >
              {index === 0 && matchScore && <div className="top-match-banner" />}

              <div>
                <div className="mentor-header">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="mentor-avatar"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=6366f1&color=fff&size=128`;
                    }}
                  />
                  <div className="mentor-info">
                    <div className="mentor-name">
                      <span>{mentor.name}</span>
                      <ShieldCheck size={16} color="#10b981" title="Verified Alumni" />
                    </div>
                    <div className="mentor-role">
                      {mentor.role}
                    </div>
                    <div className="mentor-school-row">
                      <span className={`badge ${isSchoolMatch ? 'badge-school' : 'badge-company'}`}>
                        <GraduationCap size={13} /> {mentor.school} '{mentor.graduation_year?.toString().slice(-2)}
                      </span>
                      <span className="badge badge-company">
                        <Building2 size={13} /> {mentor.company}
                      </span>
                    </div>
                  </div>

                  {/* Match Score Badge (Only show if resume parsed and matched) */}
                  {matchScore ? (
                    <div className="match-score-badge">
                      <span className="match-score-pct">{matchScore}%</span>
                      <span className="match-score-label">Match</span>
                    </div>
                  ) : (
                    <span className="badge badge-company" style={{ fontSize: '0.74rem', padding: '5px 10px', color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.12)' }}>
                      Verified Alum
                    </span>
                  )}
                </div>

                {/* AI Explanation Box */}
                <div className="ai-reasoning-box" style={{ marginTop: '14px' }}>
                  <div className="ai-reasoning-header">
                    <Sparkles size={13} /> {matchScore ? 'Why this mentor is a fit' : 'Mentor Focus & Background'}
                  </div>
                  <div className="ai-reasoning-text">
                    {aiExplanation}
                  </div>
                  <div className="reasons-list">
                    {reasons.slice(0, 3).map((r, i) => (
                      <div key={i} className="reason-item">
                        <span style={{ color: '#10b981' }}>✓</span> {r}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empathy / Challenge Overcome Box */}
                {mentor.challenges_overcome && mentor.challenges_overcome.length > 0 && (
                  <div className="mentor-challenge-box" style={{ marginTop: '12px' }}>
                    <div className="mentor-challenge-label">Obstacle They Overcame:</div>
                    <div>"{mentor.challenges_overcome[0]}"</div>
                  </div>
                )}
              </div>

              {/* Services & Free Access Footer */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    AVAILABLE OUTCOMES
                  </span>
                  <span className="badge badge-match" style={{ fontSize: '0.72rem' }}>
                    100% Free ($0)
                  </span>
                </div>
                <div className="services-preview-list">
                  {(mentor.services || []).slice(0, 2).map((srv) => (
                    <div key={srv.id} className="service-preview-pill">
                      <span className="service-preview-title">{srv.title}</span>
                      <span className="service-preview-price" style={{ color: '#10b981' }}>FREE</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                    <Star size={15} color="#f59e0b" fill="#f59e0b" />
                    <strong>{mentor.rating}</strong>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>({mentor.review_count} reviews)</span>
                  </div>
                  <button
                    id={`book-mentor-${mentor.id}-btn`}
                    className="btn-emerald"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    onClick={() => onSelectMentor(item)}
                  >
                    <span>Book Free Session</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button for 500 Mentors */}
      {visibleCount < filteredMatches.length && (
        <div style={{ textAlign: 'center', margin: '36px 0 20px' }}>
          <button
            className="btn-secondary"
            style={{ padding: '12px 32px', fontSize: '0.94rem', borderRadius: '12px', borderColor: 'rgba(99, 102, 241, 0.4)' }}
            onClick={() => setVisibleCount((prev) => prev + 24)}
          >
            Load More Mentors (Showing {Math.min(visibleCount, filteredMatches.length)} of {filteredMatches.length})
          </button>
        </div>
      )}

      {filteredMatches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>No mentors found matching your search.</p>
          <button
            className="btn-secondary"
            style={{ marginTop: '12px' }}
            onClick={() => {
              setSelectedSchool('ALL');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
