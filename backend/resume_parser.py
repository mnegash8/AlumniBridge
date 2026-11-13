import io
import re
from typing import Dict, Any, List
from pypdf import PdfReader

SAMPLE_STUDENT_PROFILES = [
    {
        "id": "sample_gsu_cs",
        "name": "DeMarcus Cole",
        "school": "Georgia State University",
        "major": "Computer Science",
        "grad_year": 2027,
        "year_standing": "Sophomore",
        "target_role": "Software Engineering Intern",
        "goals": "Refine my resume for Atlanta tech and remote SWE internships, learn how to manage recruiting while working part-time, and practice coding interview questions.",
        "max_budget": 0,
        "challenges": [
            "Commuter student balancing 20 hours/week part-time work",
            "Lack of prior professional tech internship experience",
            "Navigating tech recruitment from a state university"
        ],
        "skills": ["Python", "Java", "SQL", "Git", "React", "Data Structures"]
    },
    {
        "id": "sample_cs_berkeley",
        "name": "Jordan Miller",
        "school": "UC Berkeley",
        "major": "Computer Science & Data Science",
        "grad_year": 2027,
        "year_standing": "Sophomore",
        "target_role": "Software Engineering & AI Intern",
        "goals": "Refine my resume with Google X-Y-Z bullet points, learn how to crack first-round technical screenings, and prepare for summer applications.",
        "max_budget": 0,
        "challenges": [
            "First-generation college student with no industry connections",
            "Lack of prior professional tech internship experience",
            "Nervous about data structures coding interviews"
        ],
        "skills": ["Python", "Java", "Git", "Data Structures", "HTML/CSS"]
    },
    {
        "id": "sample_finance_nyu",
        "name": "Samantha Cruz",
        "school": "NYU Stern",
        "major": "Finance & Econometrics",
        "grad_year": 2028,
        "year_standing": "Freshman",
        "target_role": "Investment Banking & Corporate Finance",
        "goals": "Format my high school & freshman club resume for investment banking OCR scanners, and learn cold emailing strategies for Wall Street alumni.",
        "max_budget": 0,
        "challenges": [
            "Switching into finance track early without high GPA cushion",
            "Cold outreach anxiety when messaging alumni on LinkedIn",
            "Unsure which clubs and case competitions matter"
        ],
        "skills": ["Excel", "Financial Accounting", "PowerPoint", "Economics"]
    },
    {
        "id": "sample_pm_michigan",
        "name": "Aiden Vance",
        "school": "University of Michigan",
        "major": "Information Science",
        "grad_year": 2027,
        "year_standing": "Sophomore",
        "target_role": "Associate Product Manager / UI-UX",
        "goals": "Turn course projects into portfolio case studies to land a sophomore product management or design internship.",
        "max_budget": 0,
        "challenges": [
            "No technical CS degree for tech APM roles",
            "Struggling to articulate product sense and metrics on resume",
            "Need guidance on building standout side projects"
        ],
        "skills": ["Figma", "User Research", "Agile", "SQL", "Product Analytics"]
    }
]

KNOWN_SCHOOLS = [
    "Georgia State University", "Georgia State", "GSU",
    "UC Berkeley", "University of California, Berkeley",
    "NYU Stern", "New York University", "NYU",
    "University of Michigan", "Michigan",
    "Georgia Tech", "Georgia Institute of Technology",
    "Stanford University", "Stanford",
    "MIT", "Massachusetts Institute of Technology",
    "Columbia University", "Columbia",
    "UT Austin", "University of Texas at Austin",
    "UCLA", "University of California, Los Angeles",
    "Harvard University", "Harvard"
]

KNOWN_MAJORS = [
    ("Computer Science", ["computer science", "cs", "software", "eecs"]),
    ("Computer Information Systems", ["computer information", "cis", "informatics", "information systems"]),
    ("Data Science", ["data science", "statistics", "analytics", "applied math"]),
    ("Finance & Economics", ["finance", "economics", "econ", "business", "stern", "robinson", "accounting"]),
    ("Information Science", ["information", "informatics", "hci"]),
    ("Design & HCI", ["design", "product design", "graphic design", "ux", "ui"]),
    ("Pre-Med / Biology", ["biology", "pre-med", "biomedical", "neuroscience", "chemistry"]),
    ("Engineering", ["mechanical engineering", "electrical engineering", "bioengineering"])
]

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(pdf_bytes))
    text_content = []
    for page in reader.pages:
        t = page.extract_text()
        if t:
            text_content.append(t)
    return "\n".join(text_content)

def parse_resume_text(text: str) -> Dict[str, Any]:
    lower_text = text.lower()
    
    # 1. School detection
    detected_school = "Georgia State University"
    for school in KNOWN_SCHOOLS:
        if school.lower() in lower_text:
            if "georgia state" in school.lower() or "gsu" in school.lower():
                detected_school = "Georgia State University"
            elif "berkeley" in school.lower():
                detected_school = "UC Berkeley"
            elif "nyu" in school.lower() or "new york university" in school.lower():
                detected_school = "NYU Stern"
            elif "michigan" in school.lower():
                detected_school = "University of Michigan"
            elif "georgia tech" in school.lower():
                detected_school = "Georgia Tech"
            elif "stanford" in school.lower():
                detected_school = "Stanford University"
            elif "mit" in school.lower() or "massachusetts institute" in school.lower():
                detected_school = "MIT"
            elif "columbia" in school.lower():
                detected_school = "Columbia University"
            elif "texas" in school.lower() or "ut austin" in school.lower():
                detected_school = "UT Austin"
            elif "ucla" in school.lower():
                detected_school = "UCLA"
            elif "harvard" in school.lower():
                detected_school = "Harvard University"
            else:
                detected_school = school
            break
            
    # 2. Major detection
    detected_major = "Computer Science"
    for major_name, keywords in KNOWN_MAJORS:
        if any(kw in lower_text for kw in keywords):
            detected_major = major_name
            break
            
    # 3. Year Standing / Grad Year
    detected_year = "Sophomore"
    detected_grad = 2027
    if "freshman" in lower_text or "class of 2028" in lower_text or "2028" in lower_text:
        detected_year = "Freshman"
        detected_grad = 2028
    elif "sophomore" in lower_text or "class of 2027" in lower_text or "2027" in lower_text:
        detected_year = "Sophomore"
        detected_grad = 2027
    elif "junior" in lower_text or "2026" in lower_text:
        detected_year = "Junior"
        detected_grad = 2026

    # 4. Target Role derivation
    if "data" in detected_major.lower() or "statistics" in lower_text:
        target_role = "Data Science & Analytics Intern"
        suggested_goals = "Build production-level Python/SQL data projects and improve resume impact bullets."
    elif "finance" in detected_major.lower() or "economics" in lower_text:
        target_role = "Finance & Consulting Analyst"
        suggested_goals = "Polish resume for consulting & finance OCR screens, and connect with school alumni."
    elif "design" in detected_major.lower() or "ux" in lower_text:
        target_role = "Product Design & UX Intern"
        suggested_goals = "Transform class projects into engaging portfolio case studies with user research metrics."
    else:
        target_role = "Software Engineering Intern"
        suggested_goals = "Optimize resume with quantifiable impact, practice coding interviews, and land sophomore summer internship."

    # 5. Extract Skills
    common_skills = [
        "Python", "Java", "C++", "JavaScript", "TypeScript", "React", "HTML/CSS",
        "SQL", "Git", "Linux", "Machine Learning", "PyTorch", "Excel",
        "Figma", "Data Structures", "Algorithms", "AWS"
    ]
    detected_skills = [s for s in common_skills if s.lower() in lower_text]
    if not detected_skills:
        detected_skills = ["Python", "Git", "Problem Solving", "Team Collaboration"]

    challenges = [
        "First-time applicant navigating competitive recruitment cycles",
        "Translating coursework into industry-relevant project bullets",
        "Building confidence during technical and behavioral interviews"
    ]

    return {
        "extracted_name": "Student Applicant",
        "school": detected_school,
        "major": detected_major,
        "year_standing": detected_year,
        "grad_year": detected_grad,
        "target_role": target_role,
        "goals": suggested_goals,
        "max_budget": 0,
        "skills": detected_skills,
        "challenges": challenges,
        "raw_preview": text[:400].strip()
    }
