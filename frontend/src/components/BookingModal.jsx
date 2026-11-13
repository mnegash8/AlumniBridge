import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

export default function BookingModal({
  mentorData,
  studentProfile,
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
  const [studentNotes, setStudentNotes] = useState('');
  const [studentEmail, setStudentEmail] = useState(
    studentProfile?.email || (studentProfile?.name ? `${studentProfile.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com` : 'student@gmail.com')
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedSlot) return;
    setIsSubmitting(true);

    const payload = {
      mentor_id: mentor.id,
      service_id: selectedService.id,
      student_name: studentProfile?.name || "Student Applicant",
      student_email: studentEmail,
      student_school: studentProfile?.school || mentor.school,
      student_major: studentProfile?.major || mentor.major,
      session_date: selectedSlot.date,
      session_time: selectedSlot.time,
      student_goals: studentProfile?.target_role || studentProfile?.goals || "",
      student_notes: studentNotes
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
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
                <h2 style={{ fontSize: '1.4rem' }}>Book Free Mentorship Session with {mentor.name}</h2>
                <div style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                  {mentor.role} @ {mentor.company} • {mentor.school} '{mentor.graduation_year?.toString().slice(-2)}
                </div>
              </div>
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

            {/* Step 2: Available Time Slot */}
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

            {/* Step 3: Student Details & Notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
              <div className="form-group">
                <label className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentProfile?.name || 'Student Applicant'}
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
                <label className="form-label">Specific topics or questions for this call (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Please review my project section or ask how to prepare for technical screens..."
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
                    ? 'Confirming & Generating AI Prep Sheet...'
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

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="btn-primary" onClick={onClose}>
                Done & View Mentors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
