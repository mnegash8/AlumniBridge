import React, { useState, useEffect } from 'react';
import { Sparkles, Check, ArrowLeft, Gift, Target, GraduationCap, FileText, X, Plus, Code2 } from 'lucide-react';

const CHALLENGE_OPTIONS = [
  "Commuter student balancing work and campus recruitment",
  "First-generation college student with no industry connections",
  "Lack of prior professional tech/corporate internship experience",
  "Navigating competitive recruitment from a public state university",
  "Pivoting majors / starting recruitment late",
  "Failed initial coding or case interview screens",
  "Cold emailing & LinkedIn networking anxiety",
  "Imposter syndrome entering competitive recruiting cycles"
];

const SCHOOL_OPTIONS = [
  "Georgia State University",
  "UC Berkeley",
  "NYU Stern",
  "University of Michigan",
  "Georgia Tech",
  "Stanford University",
  "MIT",
  "Columbia University",
  "UT Austin",
  "UCLA",
  "Harvard University"
];

export default function ProfileReview({ initialData, onConfirm, onBack, isLoading }) {
  const [newSkillInput, setNewSkillInput] = useState('');
  const [profile, setProfile] = useState({
    name: initialData?.extracted_name || initialData?.name || "Student Applicant",
    school: initialData?.school || "Georgia State University",
    major: initialData?.major || "Computer Science",
    year_standing: initialData?.year_standing || "Sophomore",
    grad_year: initialData?.grad_year || 2027,
    target_role: initialData?.target_role || "Software Engineering Intern",
    goals: initialData?.goals || "Optimize my resume with quantifiable impact, practice coding interviews, and land sophomore summer tech internship.",
    max_budget: 0, // Free
    challenges: initialData?.challenges || [CHALLENGE_OPTIONS[0], CHALLENGE_OPTIONS[2]],
    skills: initialData?.skills || ["Python", "Java", "Git", "Problem Solving"]
  });

  // Keep state synchronized whenever a new resume is parsed or sample is selected
  useEffect(() => {
    if (initialData) {
      setProfile({
        name: initialData.extracted_name || initialData.name || "Student Applicant",
        school: initialData.school || "Georgia State University",
        major: initialData.major || "Computer Science",
        year_standing: initialData.year_standing || "Sophomore",
        grad_year: initialData.grad_year || 2027,
        target_role: initialData.target_role || "Software Engineering Intern",
        goals: initialData.goals || "Optimize my resume with quantifiable impact, practice coding interviews, and land sophomore summer tech internship.",
        max_budget: 0,
        challenges: initialData.challenges && initialData.challenges.length > 0 ? initialData.challenges : [CHALLENGE_OPTIONS[0], CHALLENGE_OPTIONS[2]],
        skills: initialData.skills && initialData.skills.length > 0 ? initialData.skills : ["Python", "Java", "Git", "Problem Solving"],
        raw_preview: initialData.raw_preview || "",
        file_name: initialData.file_name || ""
      });
    }
  }, [initialData]);

  const addSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile({ ...profile, skills: [...profile.skills, trimmed] });
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove)
    });
  };

  const toggleChallenge = (ch) => {
    if (profile.challenges.includes(ch)) {
      setProfile({
        ...profile,
        challenges: profile.challenges.filter((c) => c !== ch)
      });
    } else {
      setProfile({
        ...profile,
        challenges: [...profile.challenges, ch]
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(profile);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <button
        type="button"
        className="btn-secondary"
        style={{ marginBottom: '20px', padding: '6px 14px', fontSize: '0.85rem' }}
        onClick={onBack}
      >
        <ArrowLeft size={16} /> Change Resume / Upload
      </button>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.82rem', fontWeight: 700 }}>
              <Check size={16} /> Resume Parsed & Analyzed Successfully
            </div>
            <h2 style={{ fontSize: '1.6rem', marginTop: '4px' }}>Confirm Your Profile & Goals</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              We extracted your university, standing, and skills from your resume. Review and edit before matching.
            </p>
          </div>
          <span className="badge badge-school" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            <GraduationCap size={16} /> {profile.school}
          </span>
        </div>

        {/* AI Extracted Resume Summary Banner */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#10b981" />
            <span style={{ fontSize: '0.84rem', color: '#6ee7b7', fontWeight: 600 }}>
              AI Parsed: <strong>{profile.name}</strong> • <strong>{profile.school}</strong> ({profile.major})
            </span>
          </div>
          {profile.file_name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <FileText size={14} color="#38bdf8" />
              <span>Source: <strong style={{ color: '#cbd5e1' }}>{profile.file_name}</strong></span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-edit-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                id="input-student-name"
                type="text"
                className="form-input"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">University / School</label>
              <select
                id="select-student-school"
                className="form-select"
                value={profile.school}
                onChange={(e) => setProfile({ ...profile, school: e.target.value })}
              >
                {SCHOOL_OPTIONS.map((sch) => (
                  <option key={sch} value={sch}>{sch}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Major / Field of Study</label>
              <input
                id="input-student-major"
                type="text"
                className="form-input"
                value={profile.major}
                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Standing & Expected Grad</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  id="select-student-year"
                  className="form-select"
                  style={{ flex: 1 }}
                  value={profile.year_standing}
                  onChange={(e) => setProfile({ ...profile, year_standing: e.target.value })}
                >
                  <option value="Freshman">Freshman (1st Year)</option>
                  <option value="Sophomore">Sophomore (2nd Year)</option>
                  <option value="Junior">Junior (3rd Year)</option>
                </select>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: '90px' }}
                  value={profile.grad_year}
                  onChange={(e) => setProfile({ ...profile, grad_year: parseInt(e.target.value) || 2027 })}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Target Role / Career Focus</label>
              <input
                id="input-target-role"
                type="text"
                className="form-input"
                value={profile.target_role}
                onChange={(e) => setProfile({ ...profile, target_role: e.target.value })}
                placeholder="e.g. Software Engineering Intern, Consulting Analyst, Product Management"
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">What specific outcome are you seeking?</label>
              <textarea
                id="input-student-goals"
                className="form-textarea"
                value={profile.goals}
                onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
                rows={2}
                placeholder="e.g. Improving my resume for tech screens, learning how to cold-network, or planning my first sophomore project"
              />
            </div>

            {/* 100% Free Mentorship Banner */}
            <div className="form-group full-width">
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Gift size={20} color="#10b981" />
                  <div>
                    <div style={{ fontWeight: 700, color: '#6ee7b7', fontSize: '0.92rem' }}>
                      100% Free Mentorship Sessions ($0)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      All sessions and deliverables are fully free for college underclassmen.
                    </div>
                  </div>
                </div>
                <span className="badge badge-match" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                  Free Access Enabled
                </span>
              </div>
            </div>

            {/* Extracted Skills & Technologies */}
            <div className="form-group full-width">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                  <Code2 size={16} color="#10b981" /> Skills Extracted from Your Resume ({profile.skills.length})
                </label>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Click × to remove, or type new tools below
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '10px'
              }}>
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#bae6fd',
                      fontSize: '0.84rem',
                      fontWeight: 500
                    }}
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Remove skill"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                  placeholder="Add another skill (e.g. Docker, TypeScript, PyTorch, Figma)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={addSkill}
                >
                  <Plus size={15} /> Add Skill
                </button>
              </div>
            </div>

            {/* Challenges / Empathy Selectors */}
            <div className="form-group full-width">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={16} color="#38bdf8" /> Challenges You Want a Mentor to Understand (Select all that apply)
              </label>
              <div className="tags-selector">
                {CHALLENGE_OPTIONS.map((ch) => {
                  const isSelected = profile.challenges.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      className={`tag-pill ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleChallenge(ch)}
                    >
                      {isSelected ? '✓ ' : '+ '} {ch}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px', gap: '12px' }}>
            <button
              id="submit-match-btn"
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ padding: '14px 32px', fontSize: '1rem' }}
            >
              <Sparkles size={18} />
              <span>{isLoading ? 'Analyzing & Ranking Mentors...' : 'Generate AI Mentor Matches'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
