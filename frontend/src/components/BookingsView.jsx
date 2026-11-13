import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Sparkles, User, GraduationCap, CheckCircle2, Copy, Check, Download, ExternalLink, Video } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

export default function BookingsView({ bookings = [], onFindMentors }) {
  const [copiedQuestion, setCopiedQuestion] = useState(null);

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestion(id);
    setTimeout(() => setCopiedQuestion(null), 2000);
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
          <h2 style={{ fontSize: '1.6rem' }}>My Confirmed Mentorship Sessions</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Review upcoming appointments and review your personalized AI session prep questions.
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
                  <span className="badge badge-match">
                    <CheckCircle2 size={12} /> {b.payment_status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginTop: '6px' }}>{b.service_title}</h3>
                <div style={{ color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>
                  with Mentor: {b.mentor_name}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  FREE ($0)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
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

            {/* Quick Calendar & Room Action Bar */}
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
