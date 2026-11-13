import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Gift,
  Sparkles,
  Copy,
  Check,
  Award,
  ArrowRight,
  Download,
  ExternalLink,
  Video,
  Zap,
  Mic,
  FileText,
  MessageSquare,
  Target,
  Lightbulb,
  ListChecks
} from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

export default function BookingModal({
  mentorData,
  studentProfile,
  currentUser,
  isOpen,
  onClose,
  onBookingSuccess
}) {
  if (!isOpen || !mentorData) return null;

  const mentor = mentorData.mentor || mentorData;
  const services = mentor.services || [];
  const slots = mentor.available_slots || [
    { date: "Tomorrow", time: "5:00 PM EST" },
    { date: "Thursday", time: "6:30 PM EST" }
  ];

  const [selectedService, setSelectedService] = useState(services[0] || null);
  const [selectedSlot, setSelectedSlot] = useState(slots[0] || null);
  const [sessionFormat, setSessionFormat] = useState('LIVE_CALL'); // 'LIVE_CALL' | 'ASYNC_REVIEW'
  const [studentNotes, setStudentNotes] = useState('');
  const [studentEmail, setStudentEmail] = useState(
    currentUser?.email || studentProfile?.email || (currentUser?.name ? `${currentUser.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com` : 'student@gmail.com')
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Reset modal state whenever opened for a mentor
  useEffect(() => {
    if (isOpen) {
      setBookingConfirmed(null);
      setIsSubmitting(false);
      setSessionFormat('LIVE_CALL');
      setSelectedService(services[0] || null);
      setSelectedSlot(slots[0] || null);
      setStudentNotes('');
    }
  }, [isOpen, mentor?.id]);

  const handleModalClose = () => {
    setBookingConfirmed(null);
    onClose();
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) return;
    if (sessionFormat === 'LIVE_CALL' && !selectedSlot) return;
    setIsSubmitting(true);

    const payload = {
      mentor_id: mentor.id,
      service_id: selectedService.id,
      student_name: currentUser?.name || studentProfile?.name || "Student Applicant",
      student_email: studentEmail || currentUser?.email || "student@gmail.com",
      student_school: currentUser?.school || studentProfile?.school || mentor.school,
      student_major: studentProfile?.major || mentor.major,
      session_date: sessionFormat === 'LIVE_CALL' ? selectedSlot?.date : "Within 48h",
      session_time: sessionFormat === 'LIVE_CALL' ? selectedSlot?.time : "Flexible Async",
      student_goals: studentProfile?.target_role || studentProfile?.goals || "",
      student_notes: studentNotes,
      username: currentUser?.username || undefined,
      session_format: sessionFormat
    };

    try {
      const res = await fetch('http://localhost:8000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error('Failed to create booking');
      }
      const data = await res.json();
      setBookingConfirmed(data);
      onBookingSuccess(data.booking);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      alert('Error finalizing free booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyQuestion = (q, idx) => {
    navigator.clipboard.writeText(q);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={handleModalClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleModalClose}>
          <X size={20} />
        </button>

        {!bookingConfirmed ? (
          <div>
            {/* Mentor Summary Header */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <img
                src={mentor.avatar}
                alt={mentor.name}
                style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=6366f1&color=fff&size=128`;
                }}
              />
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>Mentorship with {mentor.name}</h2>
                <div style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                  {mentor.role} @ {mentor.company} • {mentor.school} '{mentor.graduation_year?.toString().slice(-2)}
                </div>
              </div>
            </div>

            {/* Format Selector: Live Call vs No-Schedule Async */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              padding: '4px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '10px',
              marginBottom: '20px',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                type="button"
                onClick={() => setSessionFormat('LIVE_CALL')}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: sessionFormat === 'LIVE_CALL' ? 'var(--primary)' : 'transparent',
                  color: sessionFormat === 'LIVE_CALL' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Video size={15} />
                <span>Live 1-on-1 Call</span>
              </button>

              <button
                type="button"
                onClick={() => setSessionFormat('ASYNC_REVIEW')}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: sessionFormat === 'ASYNC_REVIEW' ? '#0284c7' : 'transparent',
                  color: sessionFormat === 'ASYNC_REVIEW' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Zap size={15} color={sessionFormat === 'ASYNC_REVIEW' ? '#38bdf8' : 'currentColor'} />
                <span>⚡ No-Schedule Review</span>
              </button>
            </div>

            {/* Step 1: Compare Free Services */}
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                1. Select an Outcome-Focused Service (100% Free)
              </div>
              <div className="services-compare-grid">
                {services.map((srv) => {
                  const isSelected = selectedService?.id === srv.id;
                  return (
                    <div
                      key={srv.id}
                      id={`service-select-${srv.id}`}
                      className={`service-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedService(srv)}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.94rem', color: '#ffffff' }}>
                            {srv.title}
                          </span>
                          <span style={{
                            fontWeight: 800,
                            color: '#10b981',
                            fontFamily: 'var(--font-mono)'
                          }}>
                            FREE
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          ⏱️ {srv.duration}
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '8px', lineHeight: '1.4' }}>
                          {srv.description}
                        </p>
                      </div>

                      <div style={{
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px solid var(--border-subtle)',
                        fontSize: '0.75rem',
                        color: '#6ee7b7'
                      }}>
                        📦 <strong>Deliverable:</strong> {srv.deliverable}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Available Time Slot OR Async Guarantee */}
            {sessionFormat === 'LIVE_CALL' ? (
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                  2. Select an Available Time Slot
                </div>
                <div className="slots-grid">
                  {slots.map((s, idx) => {
                    const isSelected = selectedSlot?.date === s.date && selectedSlot?.time === s.time;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`slot-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedSlot(s)}
                      >
                        <div>📅 {s.date}</div>
                        <div style={{ marginTop: '2px', fontWeight: 700 }}>{s.time}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{
                marginTop: '18px',
                padding: '16px',
                background: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                  <Zap size={18} />
                  <span>No Calendar Coordination Required</span>
                </div>
                <p style={{ fontSize: '0.83rem', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.5 }}>
                  Busy alumni review your resume or essay whenever they have 5 minutes. {mentor.name} will record a voice note and provide line-by-line bullet rewrites.
                </p>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '10px',
                  fontSize: '0.78rem',
                  color: '#94a3b8'
                }}>
                  <span>⏱️ <strong>Turnaround:</strong> Within 48 hours</span>
                  <span>🎧 <strong>Deliverable:</strong> Voice Note + Annotated Rewrites</span>
                </div>
              </div>
            )}

            {/* Step 3: Student Details & Notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  Student Account
                  {currentUser?.username && (
                    <span style={{ color: '#38bdf8', fontSize: '0.74rem', marginLeft: '6px' }}>
                      (@{currentUser.username})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={currentUser?.name || studentProfile?.name || 'Student Applicant'}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Student Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">
                  {sessionFormat === 'ASYNC_REVIEW'
                    ? `Resume bullets, essay prompt, or specific questions for ${mentor.name} (Optional)`
                    : 'Specific topics or questions for this call (Optional)'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={sessionFormat === 'ASYNC_REVIEW'
                    ? 'e.g. Please critique my second experience bullet, or review my GSU scholarship essay intro...'
                    : 'e.g. Please review my project section or ask how to prepare for technical screens...'}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Free Mentorship Benefit Box */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#10b981', fontWeight: 700 }}>
                  <Gift size={18} /> 100% Free Mentorship
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Alumni give back voluntarily • No credit card or fee required
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Session Fee</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  $0.00 FREE
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <button
                id="confirm-booking-pay-btn"
                className="btn-emerald"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                style={{ padding: '14px 32px', fontSize: '1rem', width: '100%' }}
              >
                <CheckCircle2 size={18} />
                <span>
                  {isSubmitting
                    ? 'Submitting...'
                    : sessionFormat === 'ASYNC_REVIEW'
                    ? `Request Free Async Review from ${mentor.name}`
                    : `Confirm Free Mentorship Session with ${mentor.name}`}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Booking Confirmed State */
          <div className="animate-fade-in confirmed-box">
            <div className="confirmed-icon">
              <CheckCircle2 size={40} />
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              Free Mentorship Session Confirmed!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Your calendar invite and session preparation guide have been generated.
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '16px 20px',
              margin: '20px auto',
              maxWidth: '520px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              textAlign: 'left'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>BOOKING REF</span>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                  {bookingConfirmed.booking?.id}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ALUMNI MENTOR</span>
                <div style={{ fontWeight: 600 }}>{mentor.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>SERVICE</span>
                <div style={{ fontWeight: 600 }}>{bookingConfirmed.service?.title}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TIME & DATE</span>
                <div style={{ fontWeight: 600 }}>
                  {bookingConfirmed.booking?.session_date} @ {bookingConfirmed.booking?.session_time}
                </div>
              </div>
            </div>

            {/* What to Talk About & Focus On Section */}
            {(() => {
              const focus = bookingConfirmed.booking?.session_focus || {
                mentor_welcome: `Hey ${currentUser?.name?.split(' ')[0] || studentProfile?.name?.split(' ')[0] || 'there'}! Looking forward to connecting. As an alum from ${mentor.school}, I know how competitive recruitment can feel. Here is our exact focus roadmap for our ${bookingConfirmed.service?.title} session.`,
                key_focus_areas: [
                  `Reviewing your ${studentProfile?.major || mentor.major} coursework and projects to pass recruiter screenings at ${mentor.company}.`,
                  `Overcoming state university friction from ${studentProfile?.school || mentor.school} to land competitive roles like at ${mentor.company}.`,
                  `Actionable interview preparation, recruiter screening patterns, and cold outreach strategy.`
                ],
                discussion_agenda: [
                  {
                    phase: "Part 1 (First 5-10 mins)",
                    title: "Icebreaker & Background Alignment",
                    focus: `Connect on shared university experiences at ${mentor.school}. Clarify your career targets and learn how ${mentor.name} navigated their path to ${mentor.company}.`
                  },
                  {
                    phase: "Part 2 (15-25 mins)",
                    title: `Tactical Focus: ${bookingConfirmed.service?.title}`,
                    focus: `Live screen-share and review. ${mentor.name} will roast bullet points, flag ATS risks, and rewrite low-impact statements with high-yield metrics.`
                  },
                  {
                    phase: "Part 3 (Final 5-10 mins)",
                    title: "7-Day Action Plan & Next Steps",
                    focus: `Agree on 3 immediate revisions to complete this week, and establish next steps for follow-up.`
                  }
                ],
                mentor_pro_tip: `“Don't hesitate to ask candid questions about salary, company culture, or balancing school with recruiting. As alumni, we're here to give you the honest playbook!” — ${mentor.name}`
              };

              return (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '14px',
                  padding: '20px',
                  margin: '18px 0',
                  textAlign: 'left'
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '0.96rem' }}>
                      <Target size={18} />
                      <span>What to Talk About & Focus On with {mentor.name}</span>
                    </div>
                    <span style={{
                      fontSize: '0.74rem',
                      color: '#6ee7b7',
                      background: 'rgba(16, 185, 129, 0.12)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      fontWeight: 600
                    }}>
                      Personalized Roadmap
                    </span>
                  </div>

                  {/* Mentor's Note */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    borderLeft: '3px solid #38bdf8',
                    marginBottom: '14px'
                  }}>
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=6366f1&color=fff&size=64`;
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                        Message from {mentor.name} ({mentor.role} @ {mentor.company}):
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#f1f5f9', lineHeight: 1.45, margin: 0, fontStyle: 'italic' }}>
                        "{focus.mentor_welcome}"
                      </p>
                    </div>
                  </div>

                  {/* Key Focus Topics */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ListChecks size={14} color="#38bdf8" /> Key Topics to Focus On:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {focus.key_focus_areas.map((area, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                          <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>✓</span>
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3-Part Discussion Agenda */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#818cf8" /> Recommended Session Agenda:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
                      {focus.discussion_agenda.map((ag, i) => (
                        <div key={i} style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          padding: '10px 12px'
                        }}>
                          <div style={{ fontSize: '0.74rem', color: '#818cf8', fontWeight: 700 }}>
                            {ag.phase}
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                            {ag.title}
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.35, margin: '4px 0 0 0' }}>
                            {ag.focus}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mentor Pro-Tip */}
                  {focus.mentor_pro_tip && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      color: '#fef3c7'
                    }}>
                      <Lightbulb size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
                      <span style={{ lineHeight: 1.4 }}>{focus.mentor_pro_tip}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* AI Session Prep Guide */}
            <div className="prep-questions-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: 700, fontSize: '0.9rem' }}>
                <Sparkles size={18} />
                <span>AI-Generated Session Preparation Guide</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Ask these high-impact questions during your call with {mentor.name} to make the most of your free session:
              </p>

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(bookingConfirmed.booking?.prep_questions || []).map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <span style={{ fontSize: '0.86rem', color: '#f1f5f9' }}>
                      <strong>Q{idx + 1}:</strong> {q}
                    </span>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      onClick={() => copyQuestion(q, idx)}
                      title="Copy question"
                    >
                      {copiedIndex === idx ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sync to Calendar OR Async Confirmation Section */}
            {bookingConfirmed.booking?.session_format === 'ASYNC_REVIEW' ? (
              <div style={{
                marginTop: '18px',
                padding: '16px 20px',
                background: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', fontWeight: 700, color: '#38bdf8' }}>
                  <Zap size={18} />
                  <span>No-Schedule Review Queued</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.5 }}>
                  {mentor.name} has received your request. Feedback containing an audio voice note and annotated bullet rewrites will be available directly on your <strong>My Bookings</strong> dashboard.
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '10px',
                  fontSize: '0.78rem',
                  color: '#6ee7b7'
                }}>
                  <CheckCircle2 size={14} />
                  <span>Turnaround Guarantee: Feedback delivered within 48 hours</span>
                </div>
              </div>
            ) : (
              <div style={{
                marginTop: '18px',
                padding: '16px 20px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '12px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                    <Calendar size={18} color="#818cf8" />
                    <span>Add to Your Calendar</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600 }}>
                    Includes Google Meet Link
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <a
                    href={generateGoogleCalendarUrl({
                      mentorName: mentor.name,
                      mentorCompany: mentor.company,
                      serviceTitle: bookingConfirmed.service?.title,
                      sessionDate: bookingConfirmed.booking?.session_date,
                      sessionTime: bookingConfirmed.booking?.session_time,
                      prepQuestions: bookingConfirmed.booking?.prep_questions,
                      sessionFocus: bookingConfirmed.booking?.session_focus,
                      bookingId: bookingConfirmed.booking?.id
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.84rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <ExternalLink size={15} />
                    <span>Google Calendar</span>
                  </a>

                  <button
                    type="button"
                    className="btn-secondary"
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.84rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onClick={() => downloadIcsFile({
                      mentorName: mentor.name,
                      mentorCompany: mentor.company,
                      serviceTitle: bookingConfirmed.service?.title,
                      sessionDate: bookingConfirmed.booking?.session_date,
                      sessionTime: bookingConfirmed.booking?.session_time,
                      prepQuestions: bookingConfirmed.booking?.prep_questions,
                      sessionFocus: bookingConfirmed.booking?.session_focus,
                      bookingId: bookingConfirmed.booking?.id
                    })}
                  >
                    <Download size={15} />
                    <span>Download .ics</span>
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="btn-primary" onClick={handleModalClose}>
                Done & View Mentors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
