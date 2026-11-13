import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ResumeUpload from './components/ResumeUpload';
import ProfileReview from './components/ProfileReview';
import MentorList from './components/MentorList';
import BookingModal from './components/BookingModal';
import BookingsView from './components/BookingsView';
import JudgeModal from './components/JudgeModal';
import AuthModal from './components/AuthModal';
import { Sparkles, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:8000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('match'); // 'match' | 'explore' | 'bookings'
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Review, 3: Recommendations
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ab_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [allMentors, setAllMentors] = useState([]);
  const [rankedMatches, setRankedMatches] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial mentors & bookings and prompt login if not authenticated
  useEffect(() => {
    fetchMentors();
    fetchBookings(currentUser);
    if (!currentUser) {
      setIsAuthModalOpen(true);
    }
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await fetch(`${API_BASE}/mentors`);
      if (res.ok) {
        const data = await res.json();
        setAllMentors(data.mentors || []);
      }
    } catch (e) {
      console.warn('API fetch mentors error:', e);
    }
  };

  const fetchBookings = async (user = currentUser) => {
    try {
      const url = user?.username
        ? `${API_BASE}/bookings?username=${encodeURIComponent(user.username)}`
        : `${API_BASE}/bookings`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.warn('API fetch bookings error:', e);
    }
  };

  // Step 1: Handle parsed resume from PDF or Text
  const handleProfileParsed = (parsedData) => {
    setStudentProfile(parsedData);
    setCurrentStep(2);
  };

  // Handle Preset Selection (e.g. Jordan Miller, Samantha Cruz)
  const handleSelectPreset = async (presetId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/samples`);
      if (res.ok) {
        const data = await res.json();
        const profile = data.sample_profiles?.find((p) => p.id === presetId);
        if (profile) {
          setStudentProfile(profile);
          setCurrentStep(2);
          setActiveTab('match');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Confirm Profile and Trigger Match
  const handleProfileConfirm = async (confirmedProfile) => {
    setIsLoading(true);
    setStudentProfile(confirmedProfile);
    try {
      const res = await fetch(`${API_BASE}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(confirmedProfile)
      });
      if (!res.ok) throw new Error('Matching failed');
      const data = await res.json();
      setRankedMatches(data.matches || []);
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
      alert('Error fetching matches. Showing all available mentors.');
      setRankedMatches(allMentors.map((m) => ({ mentor: m, match_score: 85 })));
      setCurrentStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    fetchBookings(user);
    if (!studentProfile) {
      setStudentProfile({
        name: user.name,
        school: user.school || "Georgia State University",
        major: "Computer Science",
        year_standing: "Sophomore",
        grad_year: 2027,
        target_role: "Software Engineering Intern",
        goals: "Connect with alumni mentors from my university for resume roasts and technical interview preparation.",
        max_budget: 0,
        challenges: [
          "Commuter student balancing work and campus recruitment",
          "First-generation college student with no industry connections"
        ],
        skills: ["Python", "Java", "Problem Solving", "Git"]
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ab_token');
    localStorage.removeItem('ab_user');
    setCurrentUser(null);
    setBookings([]);
    setIsAuthModalOpen(true);
  };

  // Handle Booking Success
  const handleBookingSuccess = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
        bookingsCount={bookings.length}
        onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Stepper Bar (Only in Match flow) */}
      {activeTab === 'match' && (
        <div className="stepper-bar">
          <div
            className={`step-node ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="step-number">{currentStep > 1 ? '✓' : '1'}</div>
            <span className="step-title">Upload Resume & Goals</span>
          </div>

          <ChevronRight size={16} color="var(--border-subtle)" />

          <div
            className={`step-node ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}
            onClick={() => studentProfile && setCurrentStep(2)}
          >
            <div className="step-number">{currentStep > 2 ? '✓' : '2'}</div>
            <span className="step-title">Confirm Profile & School</span>
          </div>

          <ChevronRight size={16} color="var(--border-subtle)" />

          <div
            className={`step-node ${currentStep === 3 ? 'active' : ''}`}
          >
            <div className="step-number">3</div>
            <span className="step-title">AI Matches & Reasons</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'match' && (
          <>
            {currentStep === 1 && (
              <ResumeUpload
                onProfileParsed={handleProfileParsed}
                onSelectPreset={handleSelectPreset}
                isLoading={isLoading}
              />
            )}

            {currentStep === 2 && (
              <ProfileReview
                initialData={studentProfile}
                onConfirm={handleProfileConfirm}
                onBack={() => setCurrentStep(1)}
                isLoading={isLoading}
              />
            )}

            {currentStep === 3 && (
              <MentorList
                matches={rankedMatches.length > 0 ? rankedMatches : allMentors.map((m) => ({ mentor: m, match_score: 88 }))}
                studentProfile={studentProfile}
                onSelectMentor={(item) => setSelectedMentorForBooking(item)}
                onEditProfile={() => setCurrentStep(2)}
              />
            )}
          </>
        )}

        {/* Explore All 12 Mentors Tab */}
        {activeTab === 'explore' && (
          <MentorList
            matches={allMentors.map((m) => ({
              mentor: m,
              match_score: 90,
              reasons: [
                `Verified alumni from ${m.school}`,
                `${m.role} at ${m.company}`,
                `Overcame: ${m.challenges_overcome?.[0] || 'Competitive recruitment'}`
              ],
              ai_explanation: `${m.name} is a ${m.school} graduate currently working as ${m.role} at ${m.company}.`
            }))}
            studentProfile={studentProfile}
            onSelectMentor={(item) => setSelectedMentorForBooking(item)}
            onEditProfile={() => {
              setActiveTab('match');
              setCurrentStep(2);
            }}
          />
        )}

        {/* My Bookings Tab */}
        {activeTab === 'bookings' && (
          <BookingsView
            bookings={bookings}
            currentUser={currentUser}
            onFindMentors={() => {
              setActiveTab('match');
              setCurrentStep(1);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(8, 12, 22, 0.6)',
        color: 'var(--text-dim)',
        fontSize: '0.82rem'
      }}>
        <div>
          AlumniBridge • Built by{' '}
          <strong style={{ color: '#e2e8f0' }}>Mohammed Negash</strong>,{' '}
          <strong style={{ color: '#e2e8f0' }}>Roger Guiberto</strong>,{' '}
          <strong style={{ color: '#e2e8f0' }}>Akshitha Podichetty</strong>, and{' '}
          <strong style={{ color: '#e2e8f0' }}>Yahwensi Legesse</strong>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        mentorData={selectedMentorForBooking}
        studentProfile={studentProfile}
        currentUser={currentUser}
        isOpen={!!selectedMentorForBooking}
        onClose={() => setSelectedMentorForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Judge Pitch & Demo Modal */}
      <JudgeModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {/* Login & Signup Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
