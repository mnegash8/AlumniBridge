import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "alumnibridge.db")

INITIAL_MENTORS: List[Dict[str, Any]] = [
    {
        "id": "m13",
        "name": "DeMarcus Jenkins",
        "school": "Georgia State University",
        "major": "Computer Science",
        "graduation_year": 2022,
        "role": "Software Engineer II",
        "company": "Mailchimp (Intuit)",
        "bio": "GSU CS alum and former commuter student. Balanced a 25hr/wk job while building full-stack applications in downtown Atlanta. Landed a sophomore summer SWE internship and converted to full-time at Mailchimp. Dedicated to helping fellow Panthers break into tech.",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Navigated recruitment as a GSU commuter student balancing work and academics",
            "Cracked tech industry from a non-target state school through GitHub projects",
            "Mastered data structures & system design without expensive bootcamps"
        ],
        "key_strengths": ["Software Engineering", "Full-Stack Dev", "Commuter Student Success", "Atlanta Tech Scene"],
        "price_hourly": 0,
        "rating": 4.98,
        "review_count": 32,
        "services": [
            {
                "id": "s13_1",
                "title": "Panther Resume Roast & ATS Optimization",
                "duration": "30 mins",
                "price": 0,
                "description": "Line-by-line review of your projects and coursework tailored to pass Big Tech and Atlanta startup ATS filters.",
                "deliverable": "Annotated PDF + bullet rewrites"
            },
            {
                "id": "s13_2",
                "title": "Commuter Student Tech Career Roadmap",
                "duration": "45 mins",
                "price": 0,
                "description": "How to maximize career fairs, hackathons, and remote outreach while managing classes and work.",
                "deliverable": "Atlanta & Remote target tech companies list + cold outreach scripts"
            },
            {
                "id": "s13_3",
                "title": "Mock Technical Interview (LeetCode & Web)",
                "duration": "60 mins",
                "price": 0,
                "description": "Realistic technical screening with live code feedback, communication tips, and complexity analysis.",
                "deliverable": "Technical evaluation scorecard"
            }
        ],
        "available_slots": [
            {"date": "Tomorrow", "time": "5:00 PM EST"},
            {"date": "Thursday", "time": "6:30 PM EST"},
            {"date": "Saturday", "time": "1:00 PM EST"}
        ]
    },
    {
        "id": "m14",
        "name": "Aaliyah Brooks",
        "school": "Georgia State University",
        "major": "Computer Information Systems (Robinson College of Business)",
        "graduation_year": 2023,
        "role": "Technology & Cloud Consultant",
        "company": "Deloitte",
        "bio": "Robinson College of Business graduate who leveraged campus leadership and case competitions at GSU to land Big 4 technology consulting. Passionate about guiding first-gen Panthers into high-paying enterprise consulting.",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Secured Big 4 consulting offer without coming from an Ivy/private feeder school",
            "Bridged business coursework with practical cloud data skills",
            "Mastered consulting behavioral and case interviews through peer prep"
        ],
        "key_strengths": ["Technology Consulting", "Big 4 Recruiting", "Robinson College Mentorship", "Case Interviews"],
        "price_hourly": 0,
        "rating": 4.95,
        "review_count": 25,
        "services": [
            {
                "id": "s14_1",
                "title": "Consulting & Tech Resume Polish",
                "duration": "30 mins",
                "price": 0,
                "description": "Reframe campus activities, leadership, and coursework for Deloitte/Big 4 recruiter screens.",
                "deliverable": "Consulting-ready resume overhaul"
            },
            {
                "id": "s14_2",
                "title": "Case Interview & Behavioral Strategy",
                "duration": "45 mins",
                "price": 0,
                "description": "Live practice drilling the STAR method and technology strategy frameworks.",
                "deliverable": "Consulting behavioral framework cheat-sheet"
            }
        ],
        "available_slots": [
            {"date": "Tomorrow", "time": "4:00 PM EST"},
            {"date": "Friday", "time": "5:30 PM EST"},
            {"date": "Sunday", "time": "2:00 PM EST"}
        ]
    },
    {
        "id": "m1",
        "name": "Sarah Chen",
        "school": "UC Berkeley",
        "major": "Electrical Engineering & Computer Sciences",
        "graduation_year": 2022,
        "role": "Software Engineer II",
        "company": "Google",
        "bio": "First-gen college student who failed 20+ coding interviews before cracking Big Tech. Passionate about helping sophomores land their first SWE internship through structured project portfolios and practical LeetCode strategies.",
        "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "First-generation college student with no industry connections",
            "Failed 20+ initial coding screenings freshman year",
            "Turned small course projects into resume focal points"
        ],
        "key_strengths": ["Software Engineering", "Resume Polish", "LeetCode Patterns", "First-Gen Mentorship"],
        "price_hourly": 0,
        "rating": 4.9,
        "review_count": 28,
        "services": [
            {
                "id": "s1_1",
                "title": "Resume Roast & Big Tech Formatting",
                "duration": "30 mins",
                "price": 0,
                "description": "Line-by-line review of your resume bullets with Google X-Y-Z formula to beat ATS systems.",
                "deliverable": "Annotated PDF + bullet rewrites"
            },
            {
                "id": "s1_2",
                "title": "First SWE Internship Gameplan",
                "duration": "45 mins",
                "price": 0,
                "description": "Customized strategy for landing sophomore summer internships without prior work experience.",
                "deliverable": "Curated target company list & outreach script"
            },
            {
                "id": "s1_3",
                "title": "Mock Technical Interview (Data Structures)",
                "duration": "60 mins",
                "price": 0,
                "description": "Real interview question asked at Google with live feedback on communication and edge cases.",
                "deliverable": "Rubric scorecard + solution notes"
            }
        ],
        "available_slots": [
            {"date": "Tomorrow", "time": "4:00 PM EST"},
            {"date": "Tomorrow", "time": "6:30 PM EST"},
            {"date": "Thursday", "time": "5:00 PM EST"},
            {"date": "Saturday", "time": "11:00 AM EST"}
        ]
    },
    {
        "id": "m2",
        "name": "Marcus Adebayo",
        "school": "NYU Stern",
        "major": "Finance & Economics",
        "graduation_year": 2021,
        "role": "Private Equity Associate (ex-Goldman Sachs)",
        "company": "Blackstone",
        "bio": "Pivoted from Pre-Med to Finance at the start of sophomore year with a 3.1 GPA. Secured a bulge-bracket IB offer and transitioned to megafund PE.",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Pivoted majors late sophomore year behind the recruitment cycle",
            "Overcame low early college GPA (3.1) through aggressive networking",
            "Cracked Wall Street without coming from a finance family"
        ],
        "key_strengths": ["Investment Banking", "Wall Street Networking", "Financial Modeling", "Career Pivots"],
        "price_hourly": 0,
        "rating": 5.0,
        "review_count": 34,
        "services": [
            {
                "id": "s2_1",
                "title": "Wall Street Resume Restructure",
                "duration": "30 mins",
                "price": 0,
                "description": "Transform your business/club experience into high-impact investment banking bullets.",
                "deliverable": "WSO-standard resume template tailored to you"
            },
            {
                "id": "s2_2",
                "title": "Cold Emailing & Alumni Networking Playbook",
                "duration": "45 mins",
                "price": 0,
                "description": "The exact cold email templates and phone call scripts I used to get 50+ banker chats.",
                "deliverable": "3 customizable cold outreach templates"
            }
        ],
        "available_slots": [
            {"date": "Wednesday", "time": "7:00 PM EST"},
            {"date": "Friday", "time": "6:00 PM EST"},
            {"date": "Sunday", "time": "2:00 PM EST"}
        ]
    },
    {
        "id": "m3",
        "name": "Priya Patel",
        "school": "University of Michigan",
        "major": "Information Science & Business",
        "graduation_year": 2023,
        "role": "Associate Product Manager",
        "company": "Microsoft",
        "bio": "Landed Microsoft APM without a traditional Computer Science degree. Mentored 40+ undergrads on crafting user-focused side projects, building case study decks, and acing product sense interviews.",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Broke into Product Management without technical CS degree",
            "Self-taught product specs and user research methods",
            "Stood out among thousands of applicants through a public portfolio"
        ],
        "key_strengths": ["Product Management", "Side Project Strategy", "Product Sense", "Case Interviews"],
        "price_hourly": 0,
        "rating": 4.95,
        "review_count": 22,
        "services": [
            {
                "id": "s3_1",
                "title": "Product Resume & Portfolio Audit",
                "duration": "30 mins",
                "price": 0,
                "description": "Reframe your projects into genuine product management case studies with metrics.",
                "deliverable": "Figma / Notion portfolio template + edits"
            },
            {
                "id": "s3_2",
                "title": "Product Sense & Case Teardown",
                "duration": "45 mins",
                "price": 0,
                "description": "Live practice answering 'How would you improve Spotify for college students?' with framework.",
                "deliverable": "CIRCLES framework cheat sheet"
            }
        ],
        "available_slots": [
            {"date": "Tomorrow", "time": "5:30 PM EST"},
            {"date": "Thursday", "time": "4:00 PM EST"}
        ]
    },
    {
        "id": "m4",
        "name": "Alex Rivera",
        "school": "Georgia Tech",
        "major": "Computer Science (Intelligence Thread)",
        "graduation_year": 2022,
        "role": "Machine Learning Engineer",
        "company": "Anthropic",
        "bio": "Community college transfer student who transitioned into AI/ML research. Published at undergrad workshops, interned at top AI labs, and now builds safety & evaluation pipelines.",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Transferred from community college with zero alumni network",
            "Struggled to find professor research labs accepting sophomores",
            "Self-funded through freelance dev while building PyTorch projects"
        ],
        "key_strengths": ["Machine Learning", "AI Research", "Transfer Student Mentorship", "PyTorch / LLMs"],
        "price_hourly": 0,
        "rating": 4.9,
        "review_count": 19,
        "services": [
            {
                "id": "s4_1",
                "title": "AI Project & GitHub Deep-Dive",
                "duration": "45 mins",
                "price": 0,
                "description": "Transform a basic toy ML tutorial into an impressive, recruiter-ready research project.",
                "deliverable": "Project architecture review & GitHub README guide"
            }
        ],
        "available_slots": [
            {"date": "Wednesday", "time": "6:00 PM EST"},
            {"date": "Friday", "time": "5:00 PM EST"}
        ]
    },
    {
        "id": "m5",
        "name": "Emily Zhao",
        "school": "Stanford University",
        "major": "Symbolic Systems (HCI)",
        "graduation_year": 2021,
        "role": "Senior Product Designer",
        "company": "Stripe",
        "bio": "Switched from pre-law/humanities to Product Design. Overcame severe imposter syndrome, built a design portfolio in 4 months, and secured design internships at top Silicon Valley firms.",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Switched disciplines without formal art/design school background",
            "Severe imposter syndrome entering tech as non-coder",
            "Overcame rejections by shifting focus to business impact in UX"
        ],
        "key_strengths": ["UX/UI Design", "Design Portfolios", "Figma", "Design Interview Prep"],
        "price_hourly": 0,
        "rating": 5.0,
        "review_count": 27,
        "services": [
            {
                "id": "s5_1",
                "title": "Portfolio Critique & Case Study Polish",
                "duration": "45 mins",
                "price": 0,
                "description": "Deep-dive feedback on your 1-2 key case studies. Clear problem statements and visual polish.",
                "deliverable": "Actionable Loom video or PDF markup"
            }
        ],
        "available_slots": [
            {"date": "Tomorrow", "time": "3:00 PM EST"},
            {"date": "Thursday", "time": "6:00 PM EST"}
        ]
    },
    {
        "id": "m6",
        "name": "David Kim",
        "school": "MIT",
        "major": "Mathematics & Computer Science",
        "graduation_year": 2022,
        "role": "Quantitative Trader",
        "company": "Jane Street",
        "bio": "Never attended international math olympiads, yet landed a sophomore summer quantitative trading internship through systematic mental math, probability practice, and mock trading games.",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "No high school competition math pedigree",
            "Tackled intimidating quantitative finance recruiting cycles",
            "Mastered fast mental math and expected value games under pressure"
        ],
        "key_strengths": ["Quantitative Finance", "Probability & Brainteasers", "Math/CS Course Selection", "Trading Interviews"],
        "price_hourly": 0,
        "rating": 4.96,
        "review_count": 31,
        "services": [
            {
                "id": "s6_1",
                "title": "Quant Probability & Brainteaser Drills",
                "duration": "45 mins",
                "price": 0,
                "description": "Live practice on dice, cards, expected value, and Bayes Theorem questions asked in quant interviews.",
                "deliverable": "Customized probability drills practice bank"
            }
        ],
        "available_slots": [
            {"date": "Wednesday", "time": "8:00 PM EST"},
            {"date": "Saturday", "time": "10:00 AM EST"}
        ]
    },
    {
        "id": "m7",
        "name": "Jordan Taylor",
        "school": "Columbia University",
        "major": "Economics & Public Health",
        "graduation_year": 2023,
        "role": "Healthcare & Life Sciences Consultant",
        "company": "McKinsey & Company",
        "bio": "Former Pre-Med student who re-channeled health expertise into management consulting, learning case frameworks in 8 weeks.",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Walked away from Pre-Med path after sophomore year",
            "Learned market sizing and profitability cases from scratch"
        ],
        "key_strengths": ["Management Consulting", "Case Interviewing", "Pre-Med Career Pivots"],
        "price_hourly": 0,
        "rating": 4.9,
        "review_count": 24,
        "services": [
            {
                "id": "s7_1",
                "title": "Case Interview 101: Structure & Math",
                "duration": "60 mins",
                "price": 0,
                "description": "Walk through a real MBB healthcare case. Practice structuring, business math, and synthesis.",
                "deliverable": "Detailed performance scorecard"
            }
        ],
        "available_slots": [
            {"date": "Tomorrow", "time": "7:00 PM EST"},
            {"date": "Friday", "time": "4:00 PM EST"}
        ]
    },
    {
        "id": "m8",
        "name": "Ananya Rao",
        "school": "UT Austin",
        "major": "Statistics & Data Science",
        "graduation_year": 2022,
        "role": "Data Scientist",
        "company": "Spotify",
        "bio": "Applied to 80+ internships freshman year and got zero replies. Rebuilt strategy around open-source music data sets, landed sophomore analytics work, and converted to Spotify full-time.",
        "avatar": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Faced 80+ cold application rejections as an underclassman",
            "Discovered how to build portfolio projects recruiters actually click",
            "Bridged the gap between theoretical stats and production SQL/Python"
        ],
        "key_strengths": ["Data Science", "SQL & Python", "A/B Testing", "Resume Storytelling"],
        "price_hourly": 0,
        "rating": 4.92,
        "review_count": 21,
        "services": [
            {
                "id": "s8_1",
                "title": "Data Science Resume & Portfolio Review",
                "duration": "30 mins",
                "price": 0,
                "description": "Audit your data projects to highlight measurable impact, business metrics, and clean code.",
                "deliverable": "Project rubric & resume markup"
            }
        ],
        "available_slots": [
            {"date": "Wednesday", "time": "5:30 PM EST"},
            {"date": "Thursday", "time": "6:30 PM EST"}
        ]
    },
    {
        "id": "m9",
        "name": "Carlos Mendez",
        "school": "UCLA",
        "major": "Computer Science",
        "graduation_year": 2021,
        "role": "Security Engineer",
        "company": "CrowdStrike",
        "bio": "First-generation Latino engineer who worked part-time at campus IT while studying. Built hands-on cybersecurity home labs, earned certifications, and secured top security roles.",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Balanced 25 hours/week campus work with rigorous CS curriculum",
            "Built home labs that replaced commercial internship experience"
        ],
        "key_strengths": ["Cybersecurity", "Cloud Security", "First-Gen Students", "Hands-on Projects"],
        "price_hourly": 0,
        "rating": 4.97,
        "review_count": 18,
        "services": [
            {
                "id": "s9_1",
                "title": "Cybersecurity Career & Lab Blueprint",
                "duration": "45 mins",
                "price": 0,
                "description": "How to set up home labs (AWS/Linux) proving real-world security skills.",
                "deliverable": "Curated lab setup guide + certification priority list"
            }
        ],
        "available_slots": [
            {"date": "Tomorrow", "time": "6:00 PM EST"},
            {"date": "Friday", "time": "7:00 PM EST"}
        ]
    },
    {
        "id": "m10",
        "name": "Olivia Bennett",
        "school": "Harvard University",
        "major": "Government & Economics",
        "graduation_year": 2022,
        "role": "Venture Capital Associate",
        "company": "Bessemer Venture Partners",
        "bio": "Passionate about early-stage technology startups. Started a collegiate venture scout club, sourced deals as a sophomore, and joined a premier global VC firm upon graduation.",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Broke into venture capital world as an undergrad",
            "Learned how to pitch deal memos without an MBA"
        ],
        "key_strengths": ["Venture Capital", "Startup Ecosystem", "Deal Memos & Sourcing"],
        "price_hourly": 0,
        "rating": 4.94,
        "review_count": 20,
        "services": [
            {
                "id": "s10_1",
                "title": "VC Investment Memo & Thesis Workshop",
                "duration": "45 mins",
                "price": 0,
                "description": "How to write a 1-page startup evaluation memo that gets junior investors noticed by partners.",
                "deliverable": "Real VC memo template + example"
            }
        ],
        "available_slots": [
            {"date": "Wednesday", "time": "4:30 PM EST"},
            {"date": "Thursday", "time": "5:30 PM EST"}
        ]
    },
    {
        "id": "m11",
        "name": "Brandon Lee",
        "school": "UC Berkeley",
        "major": "Cognitive Science & Computer Science Minor",
        "graduation_year": 2023,
        "role": "Frontend Engineer",
        "company": "Airbnb",
        "bio": "Found pure algorithms daunting early on, so shifted focus to building beautiful, responsive web applications. Got hired directly out of college by demonstrating polished UI craft and open source contributions.",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Struggled with abstract theoretical CS courses early on",
            "Proved technical capability through interactive deployed web apps"
        ],
        "key_strengths": ["Frontend Development", "React / TypeScript", "Web Projects", "Portfolio Reviews"],
        "price_hourly": 0,
        "rating": 4.98,
        "review_count": 29,
        "services": [
            {
                "id": "s11_1",
                "title": "Frontend Portfolio & Code Review",
                "duration": "45 mins",
                "price": 0,
                "description": "Live review of your React / Next.js web application code, accessibility, and UI responsiveness.",
                "deliverable": "GitHub PR review comments + styling tips"
            }
        ],
        "available_slots": [
            {"date": "Tomorrow", "time": "2:00 PM EST"},
            {"date": "Friday", "time": "3:00 PM EST"}
        ]
    },
    {
        "id": "m12",
        "name": "Maya Washington",
        "school": "University of Michigan",
        "major": "Environmental Science & Business",
        "graduation_year": 2022,
        "role": "Sustainability & ESG Consultant",
        "company": "Deloitte",
        "bio": "Passionate about bridging corporate strategy and climate impact. Helped undergrads find niche environmental consulting and corporate sustainability analyst roles that typically fly under the radar.",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        "challenges_overcome": [
            "Found few standard career fairs dedicated to sustainability",
            "Pivoted academic research into commercial consulting propositions"
        ],
        "key_strengths": ["Sustainability Consulting", "ESG Strategy", "Niche Career Paths"],
        "price_hourly": 0,
        "rating": 4.89,
        "review_count": 16,
        "services": [
            {
                "id": "s12_1",
                "title": "Sustainability Resume & Career Map",
                "duration": "30 mins",
                "price": 0,
                "description": "Format your environmental, policy, or business experience for top consulting & corporate teams.",
                "deliverable": "ESG-focused resume review + target firm list"
            }
        ],
        "available_slots": [
            {"date": "Wednesday", "time": "6:30 PM EST"},
            {"date": "Sunday", "time": "4:00 PM EST"}
        ]
    }
]

def init_db(force_reseed: bool = True):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Mentors table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mentors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        school TEXT NOT NULL,
        major TEXT NOT NULL,
        graduation_year INTEGER NOT NULL,
        role TEXT NOT NULL,
        company TEXT NOT NULL,
        bio TEXT NOT NULL,
        avatar TEXT NOT NULL,
        challenges_overcome TEXT NOT NULL,
        key_strengths TEXT NOT NULL,
        price_hourly INTEGER NOT NULL,
        rating REAL NOT NULL,
        review_count INTEGER NOT NULL,
        services TEXT NOT NULL,
        available_slots TEXT NOT NULL
    )
    """)
    
    # Bookings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        mentor_id TEXT NOT NULL,
        mentor_name TEXT NOT NULL,
        student_name TEXT NOT NULL,
        student_email TEXT NOT NULL,
        student_school TEXT NOT NULL,
        student_major TEXT NOT NULL,
        service_id TEXT NOT NULL,
        service_title TEXT NOT NULL,
        service_price INTEGER NOT NULL,
        session_date TEXT NOT NULL,
        session_time TEXT NOT NULL,
        student_goals TEXT,
        student_notes TEXT,
        payment_status TEXT NOT NULL,
        prep_questions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Re-seed mentors to apply updates
    if force_reseed:
        cursor.execute("DELETE FROM mentors")
        
        # Load 500 mentors from mentors_500.json if present
        json_path = os.path.join(os.path.dirname(__file__), "mentors_500.json")
        mentors_to_seed = INITIAL_MENTORS
        if os.path.exists(json_path):
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    mentors_to_seed = json.load(f)
            except Exception as e:
                print("Error loading mentors_500.json:", e)
                
        for m in mentors_to_seed:
            cursor.execute("""
            INSERT INTO mentors (
                id, name, school, major, graduation_year, role, company, bio, avatar,
                challenges_overcome, key_strengths, price_hourly, rating, review_count,
                services, available_slots
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                m["id"],
                m["name"],
                m["school"],
                m["major"],
                m["graduation_year"],
                m["role"],
                m["company"],
                m["bio"],
                m["avatar"],
                json.dumps(m["challenges_overcome"]),
                json.dumps(m["key_strengths"]),
                m["price_hourly"],
                m["rating"],
                m["review_count"],
                json.dumps(m["services"]),
                json.dumps(m["available_slots"])
            ))
        conn.commit()
    conn.close()

def get_all_mentors() -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM mentors")
    rows = cursor.fetchall()
    mentors = []
    for r in rows:
        mentors.append({
            "id": r["id"],
            "name": r["name"],
            "school": r["school"],
            "major": r["major"],
            "graduation_year": r["graduation_year"],
            "role": r["role"],
            "company": r["company"],
            "bio": r["bio"],
            "avatar": r["avatar"],
            "challenges_overcome": json.loads(r["challenges_overcome"]),
            "key_strengths": json.loads(r["key_strengths"]),
            "price_hourly": r["price_hourly"],
            "rating": r["rating"],
            "review_count": r["review_count"],
            "services": json.loads(r["services"]),
            "available_slots": json.loads(r["available_slots"])
        })
    conn.close()
    return mentors

def get_mentor_by_id(mentor_id: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM mentors WHERE id = ?", (mentor_id,))
    r = cursor.fetchone()
    conn.close()
    if not r:
        return None
    return {
        "id": r["id"],
        "name": r["name"],
        "school": r["school"],
        "major": r["major"],
        "graduation_year": r["graduation_year"],
        "role": r["role"],
        "company": r["company"],
        "bio": r["bio"],
        "avatar": r["avatar"],
        "challenges_overcome": json.loads(r["challenges_overcome"]),
        "key_strengths": json.loads(r["key_strengths"]),
        "price_hourly": r["price_hourly"],
        "rating": r["rating"],
        "review_count": r["review_count"],
        "services": json.loads(r["services"]),
        "available_slots": json.loads(r["available_slots"])
    }

def create_booking(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO bookings (
        id, mentor_id, mentor_name, student_name, student_email,
        student_school, student_major, service_id, service_title,
        service_price, session_date, session_time, student_goals,
        student_notes, payment_status, prep_questions
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["id"],
        data["mentor_id"],
        data["mentor_name"],
        data["student_name"],
        data["student_email"],
        data.get("student_school", ""),
        data.get("student_major", ""),
        data["service_id"],
        data["service_title"],
        0, # Always $0 Free for students
        data["session_date"],
        data["session_time"],
        data.get("student_goals", ""),
        data.get("student_notes", ""),
        data.get("payment_status", "100% FREE (Alumni Mentorship)"),
        json.dumps(data.get("prep_questions", []))
    ))
    conn.commit()
    conn.close()
    return data

def get_all_bookings() -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookings ORDER BY created_at DESC")
    rows = cursor.fetchall()
    bookings = []
    for r in rows:
        bookings.append({
            "id": r["id"],
            "mentor_id": r["mentor_id"],
            "mentor_name": r["mentor_name"],
            "student_name": r["student_name"],
            "student_email": r["student_email"],
            "student_school": r["student_school"],
            "student_major": r["student_major"],
            "service_id": r["service_id"],
            "service_title": r["service_title"],
            "service_price": 0,
            "session_date": r["session_date"],
            "session_time": r["session_time"],
            "student_goals": r["student_goals"],
            "student_notes": r["student_notes"],
            "payment_status": r["payment_status"],
            "prep_questions": json.loads(r["prep_questions"]) if r["prep_questions"] else [],
            "created_at": r["created_at"]
        })
    conn.close()
    return bookings
