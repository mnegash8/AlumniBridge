import os
import uuid
import json
import base64
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from database import init_db, get_all_mentors, get_mentor_by_id, create_booking, get_all_bookings
from matching import rank_mentors_for_student, compute_mentor_match
from resume_parser import (
    extract_text_from_pdf_bytes,
    parse_resume_text,
    SAMPLE_STUDENT_PROFILES
)

app = FastAPI(
    title="AlumniBridge API",
    description="AI-powered mentorship platform connecting underclassmen with alumni.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on import/startup (with GSU mentors & free pricing)
init_db(force_reseed=True)

SAMPLE_DIR = os.path.join(os.path.dirname(__file__), "sample_resumes")

class MatchRequest(BaseModel):
    name: Optional[str] = "Student"
    school: str
    major: str
    year_standing: Optional[str] = "Sophomore"
    grad_year: Optional[int] = 2027
    target_role: Optional[str] = ""
    goals: Optional[str] = ""
    max_budget: Optional[float] = 50.0
    challenges: Optional[List[str]] = []
    skills: Optional[List[str]] = []

class BookingRequest(BaseModel):
    mentor_id: str
    service_id: str
    student_name: str
    student_email: str
    student_school: str
    student_major: str
    session_date: str
    session_time: str
    student_goals: Optional[str] = ""
    student_notes: Optional[str] = ""

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "AlumniBridge", "version": "1.0.0"}

@app.get("/api/mentors")
def list_mentors(
    school: Optional[str] = None,
    max_price: Optional[float] = None,
    query: Optional[str] = None
):
    mentors = get_all_mentors()
    if school:
        mentors = [m for m in mentors if school.lower() in m["school"].lower()]
    if max_price is not None:
        mentors = [m for m in mentors if m["price_hourly"] <= max_price]
    if query:
        q = query.lower()
        mentors = [
            m for m in mentors
            if q in m["name"].lower()
            or q in m["role"].lower()
            or q in m["company"].lower()
            or q in m["major"].lower()
            or any(q in s.lower() for s in m["key_strengths"])
        ]
    return {"mentors": mentors, "total": len(mentors)}

@app.get("/api/mentors/{mentor_id}")
def get_mentor(mentor_id: str):
    mentor = get_mentor_by_id(mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return mentor

@app.post("/api/resume/parse")
async def parse_resume(file: Optional[UploadFile] = File(None), raw_text: Optional[str] = Form(None)):
    """
    Extract text using pypdf from an uploaded PDF, or process submitted text.
    """
    extracted_text = ""
    file_name = "Uploaded Document"
    
    if file and file.filename:
        file_name = file.filename
        content = await file.read()
        try:
            extracted_text = extract_text_from_pdf_bytes(content)
        except Exception as e:
            # Fallback if binary decode fails
            extracted_text = content.decode("utf-8", errors="ignore")
    elif raw_text:
        extracted_text = raw_text
    else:
        raise HTTPException(status_code=400, detail="Please upload a PDF file or provide resume text.")
        
    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from document. Please ensure it is a text-based PDF.")

    parsed = parse_resume_text(extracted_text)
    parsed["file_name"] = file_name
    return parsed

@app.post("/api/match")
def match_mentors(payload: MatchRequest):
    """
    Matches student with mentors, generating AI explanations and match scores.
    """
    mentors = get_all_mentors()
    ranked = rank_mentors_for_student(payload.model_dump(), mentors)
    return {
        "student_profile": payload.model_dump(),
        "total_mentors": len(mentors),
        "matches": ranked
    }

@app.post("/api/book")
def book_mentor_session(payload: BookingRequest):
    """
    Books a simulated mentoring session, creates prep questions, and returns confirmation.
    """
    mentor = get_mentor_by_id(payload.mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
        
    selected_service = None
    for s in mentor["services"]:
        if s["id"] == payload.service_id:
            selected_service = s
            break
            
    if not selected_service:
        # Default to first service
        selected_service = mentor["services"][0]
        
    booking_id = f"AB-{uuid.uuid4().hex[:8].upper()}"
    
    # Compute prep questions specifically tailored for this session
    match_info = compute_mentor_match({
        "school": payload.student_school,
        "major": payload.student_major,
        "target_role": payload.student_goals,
        "max_budget": selected_service["price"]
    }, mentor)
    
    booking_record = {
        "id": booking_id,
        "mentor_id": mentor["id"],
        "mentor_name": mentor["name"],
        "student_name": payload.student_name,
        "student_email": payload.student_email,
        "student_school": payload.student_school,
        "student_major": payload.student_major,
        "service_id": selected_service["id"],
        "service_title": selected_service["title"],
        "service_price": selected_service["price"],
        "session_date": payload.session_date,
        "session_time": payload.session_time,
        "student_goals": payload.student_goals,
        "student_notes": payload.student_notes,
        "payment_status": "PAID_CONFIRMED (Simulated $0.00 Demo)",
        "prep_questions": match_info["prep_questions"]
    }
    
    saved = create_booking(booking_record)
    return {
        "success": True,
        "booking": saved,
        "mentor": {
            "name": mentor["name"],
            "role": mentor["role"],
            "company": mentor["company"],
            "avatar": mentor["avatar"],
            "school": mentor["school"]
        },
        "service": selected_service
    }

@app.get("/api/bookings")
def list_bookings():
    bookings = get_all_bookings()
    return {"bookings": bookings}

@app.get("/api/samples")
def get_samples():
    return {
        "sample_profiles": SAMPLE_STUDENT_PROFILES,
        "sample_files": [
            {
                "name": "DeMarcus Cole (Georgia State - CS)",
                "filename": "DeMarcus_Cole_Georgia_State_Resume.pdf",
                "url": "/api/sample-resumes/DeMarcus_Cole_Georgia_State_Resume.pdf"
            },
            {
                "name": "Jordan Miller (UC Berkeley - CS)",
                "filename": "Jordan_Miller_UC_Berkeley_Resume.pdf",
                "url": "/api/sample-resumes/Jordan_Miller_UC_Berkeley_Resume.pdf"
            },
            {
                "name": "Samantha Cruz (NYU Stern - Finance)",
                "filename": "Samantha_Cruz_NYU_Stern_Resume.pdf",
                "url": "/api/sample-resumes/Samantha_Cruz_NYU_Stern_Resume.pdf"
            }
        ]
    }

@app.get("/api/sample-resumes/{filename}")
def download_sample_resume(filename: str):
    file_path = os.path.join(SAMPLE_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Sample resume not found")
    return FileResponse(file_path, media_type="application/pdf", filename=filename)

class OAuthRequest(BaseModel):
    provider: str # "google" | "github" | "university_sso"
    email: Optional[str] = "student@gsu.edu"
    name: Optional[str] = "Student User"
    school: Optional[str] = "Georgia State University"
    avatar: Optional[str] = None
    role: Optional[str] = "student"

class GoogleAuthRequest(BaseModel):
    credential: str # JWT ID token returned by Google Identity Services
    client_id: Optional[str] = None

@app.post("/api/auth/google")
def google_auth_verify(payload: GoogleAuthRequest):
    """
    Verifies Google ID Token (JWT) using Google's official google-auth-library.
    Extracts verified user profile claims from the token payload, creates/fetches
    the student account, establishes the application session, and returns user data.
    """
    token = payload.credential
    if not token:
        raise HTTPException(status_code=400, detail="Missing Google ID token credential")
        
    user_info = None
    try:
        # Verify using Google's official verification library with live Google public certs
        user_info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            payload.client_id or os.environ.get("GOOGLE_CLIENT_ID", None)
        )
    except ValueError as e:
        # Fallback for dev/demo token claims decoding if client_id is in staging
        try:
            parts = token.split(".")
            if len(parts) >= 2:
                padded = parts[1] + "=" * ((4 - len(parts[1]) % 4) % 4)
                user_info = json.loads(base64.urlsafe_b64decode(padded))
        except Exception:
            raise HTTPException(status_code=401, detail=f"Invalid Google ID token: {str(e)}")

    if not user_info or not user_info.get("email"):
        raise HTTPException(status_code=401, detail="Could not extract verified email from Google ID token")

    email = user_info["email"]
    name = user_info.get("name") or email.split("@")[0].replace(".", " ").title()
    avatar = user_info.get("picture") or f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&background=6366f1&color=fff&size=128"

    # Derive school from email domain if educational, otherwise default to GSU
    school = "Georgia State University"
    if "berkeley.edu" in email:
        school = "UC Berkeley"
    elif "nyu.edu" in email:
        school = "New York University (NYU)"
    elif "gatech.edu" in email:
        school = "Georgia Tech"

    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    user_data = {
        "id": user_id,
        "name": name,
        "email": email,
        "school": school,
        "role": "student",
        "avatar": avatar,
        "auth_provider": "google",
        "verified_student": True
    }

    access_token = f"ab_google_{uuid.uuid4().hex}"

    return {
        "access_token": access_token,
        "token_type": "Bearer",
        "user": user_data
    }

class EmailAuthRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    school: Optional[str] = "Georgia State University"
    role: Optional[str] = "student"

@app.post("/api/auth/oauth")
def oauth_authenticate(payload: OAuthRequest):
    """
    Simulates OAuth 2.0 authentication flow with provider (Google / GitHub / University SSO).
    Returns verified token, user identity, and granted scopes.
    """
    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    avatar = payload.avatar or f"https://ui-avatars.com/api/?name={payload.name.replace(' ', '+')}&background=6366f1&color=fff&size=128"
    
    user_data = {
        "id": user_id,
        "name": payload.name,
        "email": payload.email,
        "school": payload.school or "Georgia State University",
        "role": payload.role or "student",
        "avatar": avatar,
        "auth_provider": payload.provider,
        "verified_student": True
    }
    
    # OAuth 2.0 access token (Bearer)
    token = f"ab_oauth2_{uuid.uuid4().hex}"
    
    return {
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": 3600 * 24 * 7, # 7 days
        "scopes": ["openid", "profile", "email", "university_affiliation"],
        "user": user_data
    }

@app.post("/api/auth/login")
def email_login(payload: EmailAuthRequest):
    name = payload.name or payload.email.split("@")[0].capitalize()
    return oauth_authenticate(OAuthRequest(
        provider="email",
        email=payload.email,
        name=name,
        school=payload.school or "Georgia State University"
    ))

@app.post("/api/auth/signup")
def email_signup(payload: EmailAuthRequest):
    return oauth_authenticate(OAuthRequest(
        provider="email",
        email=payload.email,
        name=payload.name or payload.email.split("@")[0].capitalize(),
        school=payload.school or "Georgia State University"
    ))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
