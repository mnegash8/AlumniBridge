import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Sparkles, User, GraduationCap, CheckCircle2, Copy, Check, Download, ExternalLink, Video, Play, Pause, Mic, Zap, FileText, Target, ListChecks, Lightbulb, Trash2 } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

export default function BookingsView({ bookings = [], onFindMentors, currentUser, onBookingDeleted }) {
  const [copiedQuestion, setCopiedQuestion] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const toggleAudioPlay = (id) => {
    setPlayingAudioId((prev) => (prev === id ? null : id));
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestion(id);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  const handleDelete = async (bookingId) => {
    if (confirmDeleteId !== bookingId) {
      setConfirmDeleteId(bookingId);
      setTimeout(() => {
        setConfirmDeleteId((curr) => (curr === bookingId ? null : curr));
      }, 4000);
      return;
    }

    setDeletingId(bookingId);
    try {
      const url = currentUser?.username
        ? `http://localhost:8000/api/bookings/${bookingId}?username=${encodeURIComponent(currentUser.username)}`
        : `http://localhost:8000/api/bookings/${bookingId}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to cancel booking');
      }
      if (onBookingDeleted) {
        onBookingDeleted(bookingId);
      }
    } catch (err) {
      console.error(err);
      alert('Could not cancel booking. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '680px', margin: '40px auto' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#818cf8'
        }}>
          <Calendar size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No Mentorship Bookings Yet</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
          Upload your resume or load a sample student profile to discover and book sessions with alumni mentors.
        </p>
        <button className="btn-primary" onClick={onFindMentors}>
          <Sparkles size={16} /> Find Matched Alumni
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>
            {currentUser?.name ? `${currentUser.name}'s Mentorship Sessions` : 'My Confirmed Mentorship Sessions'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {currentUser?.username
              ? `Linked to account @${currentUser.username} • ${currentUser.school || 'Georgia State University'}`
              : 'Review upcoming appointments and review your personalized AI session prep questions.'}
          </p>
        </div>
        <button className="btn-secondary" onClick={onFindMentors}>
          + Book Another Session
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {bookings.map((b) => (
          <div key={b.id} className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    color: '#38bdf8',
                    background: 'rgba(6, 182, 212, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {b.id}
                  </span>
                  {b.username && (
                    <span style={{
                      fontSize: '0.74rem',
                      color: '#a5b4fc',
                      background: 'rgba(99, 102, 241, 0.12)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(99, 102, 241, 0.25)'
                    }}>
                      @{b.username}
                    </span>
                  )}
                  {b.session_format === 'ASYNC_REVIEW' ? (
                    <span style={{
                      background: 'rgba(2, 132, 199, 0.15)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Zap size={11} /> No-Schedule Async
                    </span>
                  ) : (
                    <span className="badge badge-match">
                      <CheckCircle2 size={12} /> {b.payment_status}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginTop: '6px' }}>{b.service_title}</h3>
                <div style={{ color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>
                  with Mentor: {b.mentor_name}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    FREE ($0)
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    style={{
                      background: confirmDeleteId === b.id ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: confirmDeleteId === b.id ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid var(--border-subtle)',
                      color: confirmDeleteId === b.id ? '#f87171' : 'var(--text-muted)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.74rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title="Cancel and remove this booking"
                  >
                    <Trash2 size={12} />
                    <span>
                      {deletingId === b.id
                        ? 'Removing...'
                        : confirmDeleteId === b.id
                        ? 'Confirm Cancel?'
                        : 'Cancel'}
                    </span>
                  </button>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                  <Calendar size={13} /> {b.session_date} • <Clock size={13} /> {b.session_time}
                </div>
              </div>
            </div>

            {/* Student metadata */}
            <div style={{
              display: 'flex',
              gap: '16px',
              fontSize: '0.82rem',
              color: 'var(--text-dim)',
              margin: '14px 0',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <span><strong>Student:</strong> {b.student_name}</span>
              <span>•</span>
              <span><strong>Email:</strong> {b.student_email}</span>
              <span>•</span>
              <span><strong>School:</strong> {b.student_school}</span>
            </div>

            {/* Format-Specific Action or Async Review Display */}
            {b.session_format === 'ASYNC_REVIEW' ? (
              <div style={{ marginTop: '14px' }}>
                {/* Voice Note Player */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  marginBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                      <Mic size={16} color="#38bdf8" />
                      <span>{b.async_feedback?.audio_note_title || `Voice Note Feedback from ${b.mentor_name}`}</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Feedback Ready
                    </span>
                  </div>

                  {/* Audio Waveform Interactive Player */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                      onClick={() => toggleAudioPlay(b.id)}
                      title={playingAudioId === b.id ? "Pause Voice Note" : "Play Voice Note"}
                    >
                      {playingAudioId === b.id ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                    </button>

                    {/* Waveform graphic bars */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '3px', height: '32px' }}>
                      {[10, 22, 16, 28, 14, 20, 26, 12, 18, 24, 30, 16, 22, 14, 28, 18, 22, 12, 24, 28, 16, 20, 14, 22, 26].map((h, i) => (
                        <span
                          key={i}
                          style={{
                            flex: 1,
                            height: playingAudioId === b.id ? `${Math.max(6, (h + ((i % 4) * 3)))}px` : `${h}px`,
                            background: playingAudioId === b.id && i < 16 ? '#38bdf8' : 'rgba(255, 255, 255, 0.22)',
                            borderRadius: '2px',
                            transition: 'all 0.15s ease'
                          }}
                        />
                      ))}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {playingAudioId === b.id ? '0:42 / 1:42' : (b.async_feedback?.audio_duration || '1:42')}
                    </div>
                  </div>

                  {/* Summary Transcript */}
                  <p style={{
                    fontSize: '0.84rem',
                    color: '#e2e8f0',
                    marginTop: '12px',
                    lineHeight: 1.5,
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    borderLeft: '3px solid #38bdf8'
                  }}>
                    <strong>Mentor Advice:</strong> “{b.async_feedback?.coach_summary || 'Reviewed your resume bullets. Solid technical foundation, but your quantified impact needs to follow the Google X-Y-Z formula to pass ATS screens.'}”
                  </p>
                </div>

                {/* Line-by-Line Bullet Rewrites */}
                {b.async_feedback?.bullet_rewrites && b.async_feedback.bullet_rewrites.length > 0 && (
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '12px' }}>
                      <FileText size={16} />
                      <span>Alumni Line-by-Line Bullet Rewrites</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {b.async_feedback.bullet_rewrites.map((rw, rIdx) => (
                        <div
                          key={rIdx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '12px'
                          }}
                        >
                          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                            {rw.section}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#f87171', marginBottom: '4px', textDecoration: 'line-through' }}>
                            <span style={{ fontWeight: 600 }}>Original:</span> {rw.original}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 600, marginBottom: '6px' }}>
                            <span style={{ fontWeight: 600 }}>Suggested:</span> {rw.suggestion}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            <strong>Mentor Tip:</strong> {rw.mentor_tip}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Quick Calendar & Room Action Bar for Live Calls */
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '14px'
              }}>
                <a
                  href={generateGoogleCalendarUrl({
                    mentorName: b.mentor_name,
                    serviceTitle: b.service_title,
                    sessionDate: b.session_date,
                    sessionTime: b.session_time,
                    prepQuestions: b.prep_questions,
                    sessionFocus: b.session_focus,
                    bookingId: b.id
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#38bdf8',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink size={13} />
                  <span>Google Calendar</span>
                </a>

                <button
                  type="button"
                  className="btn-secondary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onClick={() => downloadIcsFile({
                    mentorName: b.mentor_name,
                    serviceTitle: b.service_title,
                    sessionDate: b.session_date,
                    sessionTime: b.session_time,
                    prepQuestions: b.prep_questions,
                    sessionFocus: b.session_focus,
                    bookingId: b.id
                  })}
                >
                  <Download size={13} />
                  <span>Download .ics</span>
                </button>

                <a
                  href="https://meet.google.com/ab-mentorship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-emerald"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    marginLeft: 'auto'
                  }}
                >
                  <Video size={13} />
                  <span>Join Virtual Room</span>
                </a>
              </div>
            )}

            {/* What to Talk About & Focus On */}
            {(() => {
              const focus = b.session_focus || {
                mentor_welcome: `Hey ${b.student_name?.split(' ')[0] || 'there'}! Looking forward to our session. As an alum from ${b.student_school || 'your university'}, I know how competitive recruitment can feel. Here is our exact focus roadmap for our ${b.service_title} session.`,
                key_focus_areas: [
                  `Reviewing your ${b.student_major || 'major'} coursework and projects to pass recruiter screenings.`,
                  `Overcoming state university friction from ${b.student_school || 'your university'} to land competitive tech & corporate roles.`,
                  `Actionable interview preparation, recruiter screening patterns, and cold outreach strategy.`
                ],
                discussion_agenda: [
                  {
                    phase: "Part 1 (First 5-10 mins)",
                    title: "Icebreaker & Background Alignment",
                    focus: `Connect on shared university experiences. Clarify your career targets and learn how ${b.mentor_name} navigated their career.`
                  },
                  {
                    phase: "Part 2 (15-25 mins)",
                    title: `Tactical Focus: ${b.service_title}`,
                    focus: `Live screen-share and review. ${b.mentor_name} will roast bullet points, flag ATS risks, and rewrite low-impact statements with high-yield metrics.`
                  },
                  {
                    phase: "Part 3 (Final 5-10 mins)",
                    title: "7-Day Action Plan & Next Steps",
                    focus: `Agree on 3 immediate revisions to complete this week, and establish next steps for follow-up.`
                  }
                ],
                mentor_pro_tip: `“Don't hesitate to ask candid questions about salary, company culture, or balancing school with recruiting. As alumni, we're here to give you the honest playbook!” — ${b.mentor_name}`
              };

              return (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  marginTop: '14px',
                  marginBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
                      <Target size={16} />
                      <span>What to Talk About & Focus On with {b.mentor_name}</span>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      color: '#6ee7b7',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      Session Roadmap
                    </span>
                  </div>

                  {/* Mentor Note */}
                  <p style={{
                    fontSize: '0.82rem',
                    color: '#f1f5f9',
                    lineHeight: 1.45,
                    fontStyle: 'italic',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    borderLeft: '3px solid #38bdf8',
                    margin: '0 0 12px 0'
                  }}>
                    “{focus.mentor_welcome}”
                  </p>

                  {/* Focus Areas */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ListChecks size={13} color="#38bdf8" /> Key Discussion Focus Areas:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {focus.key_focus_areas.map((fa, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                          <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                          <span>{fa}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discussion Agenda */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '8px',
                    marginBottom: '10px'
                  }}>
                    {focus.discussion_agenda.map((ag, aIdx) => (
                      <div key={aIdx} style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '8px 10px'
                      }}>
                        <div style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700 }}>
                          {ag.phase}
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                          {ag.title}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '3px 0 0 0', lineHeight: 1.3 }}>
                          {ag.focus}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Alumni Pro Tip */}
                  {focus.mentor_pro_tip && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '0.76rem',
                      color: '#fef3c7'
                    }}>
                      <Lightbulb size={14} color="#fbbf24" style={{ flexShrink: 0 }} />
                      <span>{focus.mentor_pro_tip}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* AI Session Prep Questions for this booking */}
            {b.prep_questions && b.prep_questions.length > 0 && (
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '10px',
                padding: '14px 18px',
                marginTop: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
                  <Sparkles size={14} /> AI Recommended Questions for this Call:
                </div>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {b.prep_questions.map((q, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', color: '#e2e8f0' }}>
                      <span>• {q}</span>
                      <button
                        className="btn-secondary"
                        style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                        onClick={() => copyText(q, `${b.id}-${idx}`)}
                      >
                        {copiedQuestion === `${b.id}-${idx}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
