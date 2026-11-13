import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, CheckCircle2, ArrowRight, Download, RefreshCw, Gift } from 'lucide-react';

export default function ResumeUpload({ onProfileParsed, onSelectPreset, presets = [], isLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [rawText, setRawText] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setUploadError('');
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Please upload a PDF file (.pdf).');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/resume/parse', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to parse resume');
      }
      const data = await res.json();
      onProfileParsed(data);
    } catch (err) {
      console.error(err);
      setUploadError(err.message || 'Error parsing PDF resume. You can use our sample presets below!');
    }
  };

  const handleTextSubmit = async () => {
    if (!rawText.trim()) return;
    setUploadError('');
    const formData = new FormData();
    formData.append('raw_text', rawText);

    try {
      const res = await fetch('http://localhost:8000/api/resume/parse', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to parse resume text');
      }
      const data = await res.json();
      onProfileParsed(data);
    } catch (err) {
      setUploadError(err.message || 'Error parsing resume text');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="hero-header">
        <div className="hero-pill">
          <Gift size={14} color="#10b981" />
          <span style={{ color: '#6ee7b7' }}>100% Free Alumni Mentorship for Underclassmen</span>
        </div>
        <h1 className="hero-title">
          Connect with Alumni who have <span className="gradient-accent">walked your path</span>.
        </h1>
        <p className="hero-desc">
          Upload your résumé and share your goals. Our AI matches you with alumni from your school — including{' '}
          <strong style={{ color: '#38bdf8' }}>Georgia State University</strong>, UC Berkeley, NYU, and more — who
          overcame the exact same hurdles to give you free guidance.
        </p>
      </div>

      <div className="glass-panel upload-card-wrapper">
        {!showPasteArea ? (
          <div>
            <div
              id="resume-dropzone"
              className={`dropzone-area ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              <div className="dropzone-icon">
                {isLoading ? <RefreshCw className="animate-spin" size={32} /> : <UploadCloud size={32} />}
              </div>
              <h3 className="dropzone-title">
                {isLoading ? 'Extracting Resume Insights with pypdf...' : 'Drop your résumé here or click to browse'}
              </h3>
              <p className="dropzone-subtitle">
                Text-based PDF format (.pdf) • Analyzes university, coursework, target roles, and strengths
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                  Select PDF File
                </span>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', background: 'transparent' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPasteArea(true);
                  }}
                >
                  Or paste text
                </button>
              </div>
            </div>

            {uploadError && (
              <div style={{
                marginTop: '14px',
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                fontSize: '0.86rem'
              }}>
                {uploadError}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Paste Resume Content:</span>
              <button
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                onClick={() => setShowPasteArea(false)}
              >
                Back to PDF Dropzone
              </button>
            </div>
            <textarea
              className="form-textarea"
              style={{ minHeight: '140px' }}
              placeholder="Paste your education, skills, projects, and goals here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
            <button className="btn-primary" onClick={handleTextSubmit}>
              Analyze Resume Text
            </button>
          </div>
        )}

        {/* 1-Click Demo Profiles Section */}
        <div className="presets-section">
          <div className="presets-label">
            ⚡ 1-Click Demo Student Profiles (Including Georgia State University)
          </div>
          <div className="presets-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {/* Georgia State University Preset */}
            <div
              id="preset-gsu"
              className="preset-card cursor-pointer"
              onClick={() => onSelectPreset('sample_gsu_cs')}
              style={{ borderColor: 'rgba(56, 189, 248, 0.4)', background: 'rgba(6, 182, 212, 0.08)' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="preset-name">DeMarcus Cole</div>
                  <span className="badge badge-match" style={{ fontSize: '0.72rem' }}>Sophomore</span>
                </div>
                <div className="preset-school" style={{ color: '#38bdf8' }}>
                  Georgia State University • CS
                </div>
                <div className="preset-target">Target: Software Engineering Intern • Commuter Student</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Load GSU Profile</span> <ArrowRight size={14} />
              </div>
            </div>

            <div
              id="preset-berkeley"
              className="preset-card cursor-pointer"
              onClick={() => onSelectPreset('sample_cs_berkeley')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="preset-name">Jordan Miller</div>
                  <span className="badge badge-school" style={{ fontSize: '0.72rem' }}>Sophomore</span>
                </div>
                <div className="preset-school">UC Berkeley • EECS & CS</div>
                <div className="preset-target">Target: Big Tech SWE Internships</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#818cf8', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Load Profile</span> <ArrowRight size={14} />
              </div>
            </div>

            <div
              id="preset-nyu"
              className="preset-card cursor-pointer"
              onClick={() => onSelectPreset('sample_finance_nyu')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="preset-name">Samantha Cruz</div>
                  <span className="badge badge-school" style={{ fontSize: '0.72rem' }}>Freshman</span>
                </div>
                <div className="preset-school">NYU Stern • Finance</div>
                <div className="preset-target">Target: Wall Street IB & PE</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#818cf8', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Load Profile</span> <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Sample PDF Download Helper */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
            flexWrap: 'wrap'
          }}>
            <span>Download Sample PDFs to test drag-and-drop:</span>
            <a
              href="http://localhost:8000/api/sample-resumes/DeMarcus_Cole_Georgia_State_Resume.pdf"
              download
              target="_blank"
              rel="noreferrer"
              style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline', fontWeight: 600 }}
            >
              <Download size={13} /> DeMarcus (Georgia State) PDF
            </a>
            <span>•</span>
            <a
              href="http://localhost:8000/api/sample-resumes/Jordan_Miller_UC_Berkeley_Resume.pdf"
              download
              target="_blank"
              rel="noreferrer"
              style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
            >
              <Download size={13} /> Jordan (Berkeley) PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
