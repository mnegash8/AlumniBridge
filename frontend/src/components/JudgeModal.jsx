import React from 'react';
import { X, Award, CheckCircle2, Bot, Layers, ArrowRight, Download } from 'lucide-react';

export default function JudgeModal({ isOpen, onClose, onSelectPreset }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.2)',
            padding: '8px',
            borderRadius: '10px',
            color: '#818cf8'
          }}>
            <Award size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Judge Demo & Hackathon Guide</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              AlumniBridge – Six-Hour Demo Architecture & Pitch
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', margin: '4px 0 14px' }}>
          <span style={{ fontSize: '0.78rem', color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase' }}>Built by:</span>
          {['Mohammed Negash', 'Roger Guiberto', 'Akshitha Podichetty', 'Yahwensi Legesse'].map((name) => (
            <span key={name} className="badge badge-company" style={{ fontSize: '0.8rem', color: '#f8fafc', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              👤 {name}
            </span>
          ))}
        </div>

        {/* Official Pitch Quote Box */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          borderLeft: '4px solid #6366f1',
          padding: '16px 20px',
          borderRadius: '8px',
          margin: '16px 0',
          fontSize: '0.96rem',
          lineHeight: '1.6',
          fontStyle: 'italic',
          color: '#e0e7ff'
        }}>
          “Our app helps students find alumni who have been where they are. Students upload their résumé and share their goals, and AI recommends relevant mentors from their school with clear reasons for each match. Students can then compare prices and book a session focused on a specific outcome, such as improving their résumé or planning their first project.”
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '20px 0' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} /> Verified Tech Stack
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" /> <strong>React + Vanilla CSS:</strong> Dynamic matching UI & booking flow
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" /> <strong>Python FastAPI:</strong> REST API & matching algorithms
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" /> <strong>pypdf:</strong> Real PDF resume text parsing
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" /> <strong>AI Reasoning Engine:</strong> Match explanation & prep questions
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#10b981" /> <strong>SQLite DB:</strong> 12 mentors, services, bookings storage
              </li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#10b981', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bot size={16} /> 6-Hour Demo Highlights
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>• <strong>14 Alumni Mentors:</strong> Mailchimp, Deloitte, Google, Blackstone, Microsoft, Anthropic, Stripe, Jane Street, McKinsey, etc.</li>
              <li>• <strong>Georgia State University (GSU) & Feeder Schools:</strong> Empathetic matches tailored to state school commuters and competitive universities alike.</li>
              <li>• <strong>100% Free for Students:</strong> Zero paywalls, removing cost barriers for underclassmen.</li>
              <li>• <strong>Outcome-focused Booking:</strong> Resume Roast, Strategy, Mock Interview with custom AI questions.</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '0.88rem', color: '#ffffff', marginBottom: '10px' }}>
            Instant Demo Profiles (Click to test instantly):
          </h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px', borderColor: 'rgba(56, 189, 248, 0.4)' }}
              onClick={() => {
                onSelectPreset('sample_gsu_cs');
                onClose();
              }}
            >
              🐾 DeMarcus Cole (Georgia State - Sophomore CS)
            </button>
            <button
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
              onClick={() => {
                onSelectPreset('sample_cs_berkeley');
                onClose();
              }}
            >
              🎓 Jordan Miller (UC Berkeley - Sophomore CS)
            </button>
            <button
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
              onClick={() => {
                onSelectPreset('sample_finance_nyu');
                onClose();
              }}
            >
              💼 Samantha Cruz (NYU Stern - Freshman Finance)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <button className="btn-primary" onClick={onClose}>
            Back to AlumniBridge
          </button>
        </div>
      </div>
    </div>
  );
}
