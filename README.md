# AlumniBridge

> **AI-powered mentorship platform connecting first- and second-year college students with alumni who have been where they are.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

*“Our app helps students find alumni who have been where they are. Students upload their resume and share their goals, and AI recommends relevant mentors from their school with clear reasons for each match. Students can then book 100% free sessions focused on a specific outcome, such as improving their resume or preparing for their first technical screening.”*

---

##  Key Features

1. ** PDF Resume Parsing with `pypdf`**
   - Automatically extracts university, coursework, technical skills, standing (Freshman/Sophomore), and stated career goals from uploaded `.pdf` documents.
2. ** AI Matching & Empathy Reasoning Engine**
   - Scores candidates across school affinity, career trajectory, and shared hurdles.
   - Explains *why* each mentor is a match (e.g. overcoming low sophomore GPA, commuting while working, non-target recruitment).
3. ** Georgia State University (GSU) & Top Feeder Schools Supported**
   - Features 14 realistic alumni mentors spanning **Google, Mailchimp, Deloitte, Blackstone, Anthropic, Stripe, Jane Street, McKinsey, and Spotify**.
4. ** 100% Free Outcome-Focused Sessions**
   - Compare sessions like *Panther Resume Roast*, *Internship Gameplan*, or *Mock Technical Screens* ($0 / Free).
5. **🤖 AI Session Prep Toolkit**
   - Generates 3 tailored questions specifically customized to the mentor’s background for the student to ask on the call.
6. **🔐 SQLite-Backed Authentication & Persistence**
   - SHA-256 password hashing with cryptographic salts; strict credential verification against the SQLite database.
7. **📅 1-Click Google Calendar & `.ics` Sync**
   - Instant calendar integration with pre-filled Google Meet links, session deliverables, and AI prep questions.
8. **👤 Account-Linked Mentorship Bookings**
   - Bookings are strictly tied to the logged-in student account with private dashboard access.

---

## Architecture

```
                                  ┌───────────────────────────────┐
                                  │   React + Vite Frontend UI    │
                                  │   (Glassmorphism / Step Flow) │
                                  └───────────────┬───────────────┘
                                                  │ HTTP / JSON / Multipart
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │     FastAPI Backend (Python)  │
                                  └───────┬───────────────┬───────┘
                                          │               │
                 ┌────────────────────────┴─────┐         │
                 ▼                              ▼         ▼
     ┌───────────────────────┐      ┌─────────────────────────┐
     │ pypdf Resume Parsing  │      │ AI Heuristic Matcher    │
     │ (University & Skills) │      │ (Scores + Explanations) │
     └───────────────────────┘      └───────────┬─────────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │      SQLite DB        │
                                    │ (Mentors & Bookings)  │
                                    └───────────────────────┘
```

---

## Quick Start Guide

### 1. Start the Backend API (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pypdf python-multipart reportlab
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API runs at: `http://localhost:8000` (Docs at `/docs`)

### 2. Start the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Web app runs at: `http://localhost:5173`

---

## Team & Authors

- **Mohammed Negash**
- **Roger Guiberto**
- **Akshitha Podichetty**
- **Yahwensi Legesse**

---

## 🛠️ Built with
- **Frontend**: React, Vanilla CSS, Lucide Icons, Canvas Confetti, Vite
- **Backend**: Python 3, FastAPI, SQLite3, pypdf, reportlab
- **Demo Assets**: Pre-generated PDF resumes for Georgia State University, UC Berkeley, and NYU Stern
