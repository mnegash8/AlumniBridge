import json
import random
import os

FIRST_NAMES = [
    "DeMarcus", "Sarah", "Marcus", "Priya", "Alex", "Emily", "David", "Jordan", "Ananya", "Carlos",
    "Olivia", "Brandon", "Maya", "Aaliyah", "James", "Elena", "Kevin", "Fatima", "Ethan", "Chloe",
    "Darius", "Hannah", "Mateo", "Sophia", "Liam", "Zoe", "Tariq", "Jessica", "Noah", "Grace",
    "Andre", "Maya", "Lucas", "Amina", "Daniel", "Kayla", "Sean", "Isabella", "Malik", "Rachel",
    "Rohan", "Natalie", "Dante", "Mia", "Gabriel", "Leila", "Brian", "Jasmine", "Justin", "Amara",
    "Tyrone", "Samantha", "Hassan", "Victoria", "Devon", "Avery", "Kofi", "Lily", "Travis", "Brooke",
    "Jerome", "Nadia", "Austin", "Camila", "Jaylen", "Amber", "Christian", "Kendra", "Elijah", "Destiny",
    "Tenzin", "Sydney", "Derrick", "Paige", "Kareem", "Valerie", "Isaiah", "Morgan", "Trevor", "Kiara"
]

LAST_NAMES = [
    "Jenkins", "Chen", "Adebayo", "Patel", "Rivera", "Zhao", "Kim", "Taylor", "Rao", "Mendez",
    "Bennett", "Lee", "Washington", "Brooks", "Johnson", "Williams", "Smith", "Brown", "Jones", "Davis",
    "Miller", "Wilson", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris",
    "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright",
    "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall",
    "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
    "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers"
]

SCHOOLS_WEIGHTED = [
    # Strong Georgia State University & Atlanta presence
    ("Georgia State University", 85),
    ("Georgia Tech", 45),
    ("Emory University", 25),
    ("UC Berkeley", 45),
    ("NYU Stern", 40),
    ("University of Michigan", 40),
    ("Stanford University", 30),
    ("MIT", 25),
    ("Columbia University", 30),
    ("UT Austin", 30),
    ("UCLA", 30),
    ("Harvard University", 20),
    ("UNC Chapel Hill", 20),
    ("University of Florida", 20),
    ("Carnegie Mellon University", 15)
]

MAJORS_AND_CAREERS = [
    # Computer Science & Software
    {
        "major": "Computer Science",
        "roles": [
            ("Software Engineer II", "Google", ["Software Engineering", "Full-Stack Dev", "LeetCode", "System Design"]),
            ("Software Engineer", "Mailchimp (Intuit)", ["Python", "API Design", "Atlanta Tech", "Web Development"]),
            ("Backend Engineer", "Stripe", ["Distributed Systems", "Java", "FinTech", "System Architecture"]),
            ("Frontend Engineer", "Airbnb", ["React", "TypeScript", "UI Engineering", "Design Systems"]),
            ("iOS Engineer", "Apple", ["Swift", "Mobile Architecture", "App Store Release", "UI/UX"]),
            ("Full-Stack Engineer", "The Home Depot", ["Enterprise Cloud", "React", "Retail Tech", "Atlanta Tech"]),
            ("Software Engineer", "Microsoft", ["C# / .NET", "Azure Cloud", "Data Structures", "Big Tech Prep"]),
            ("Platform Engineer", "Uber", ["Go", "Microservices", "High-Throughput Systems", "Kubernetes"])
        ]
    },
    # Computer Information Systems (CIS) & IT
    {
        "major": "Computer Information Systems (CIS)",
        "roles": [
            ("Cloud Solutions Architect", "Deloitte", ["AWS Cloud", "Enterprise Architecture", "Consulting", "CIS Careers"]),
            ("IT Risk & Cybersecurity Analyst", "EY", ["Cybersecurity", "Risk Advisory", "SOC Compliance", "Security Auditing"]),
            ("Systems Analyst", "Delta Air Lines", ["Aviation Tech", "SQL", "Systems Integration", "Atlanta Corporate"]),
            ("Salesforce Technical Consultant", "Slalom", ["CRM Tech", "Salesforce Apex", "Business Process", "Consulting Prep"])
        ]
    },
    # AI / Machine Learning & Data Science
    {
        "major": "Data Science & Statistics",
        "roles": [
            ("Machine Learning Engineer", "Anthropic", ["LLMs", "PyTorch", "AI Safety", "Research to Production"]),
            ("Data Scientist", "Spotify", ["SQL", "A/B Testing", "Python", "Product Analytics"]),
            ("Quantitative Research Analyst", "Jane Street", ["Probability", "Math Brainteasers", "C++", "Algorithmic Trading"]),
            ("Business Intelligence Engineer", "Amazon", ["Tableau", "Data Warehousing", "ETL Pipelines", "Data Storytelling"])
        ]
    },
    # Finance, Banking & Real Estate
    {
        "major": "Finance & Economics",
        "roles": [
            ("Investment Banking Analyst", "Goldman Sachs", ["Financial Modeling", "M&A Valuation", "Wall Street Networking", "DCF Models"]),
            ("Private Equity Associate", "Blackstone", ["LBO Models", "Due Diligence", "Deal Sourcing", "PE Recruitment"]),
            ("Corporate Financial Analyst", "The Coca-Cola Company", ["FP&A", "Corporate Budgeting", "Excel Mastery", "Atlanta Corporate"]),
            ("Venture Capital Analyst", "Bessemer Venture Partners", ["Startup Sourcing", "Cap Tables", "Pitch Deck Teardowns", "Early-Stage Tech"])
        ]
    },
    # Management Consulting & Strategy
    {
        "major": "Business Administration & Strategy",
        "roles": [
            ("Management Consultant", "McKinsey & Company", ["Case Interviews", "Market Sizing", "Executive Synthesis", "Consulting 101"]),
            ("Strategy & Operations Lead", "DoorDash", ["Unit Economics", "Market Launch", "SQL Analysis", "Growth Strategy"]),
            ("Supply Chain Consultant", "Accenture", ["Logistics Tech", "ERP Systems", "Operations Strategy", "Case Prep"])
        ]
    },
    # Product Management & UX Design
    {
        "major": "Human-Computer Interaction & Design",
        "roles": [
            ("Associate Product Manager", "Microsoft", ["Product Sense", "Feature Specs", "User Research", "Agile Roadmap"]),
            ("Product Designer", "Figma", ["Design Systems", "Figma", "User Journey Mapping", "Portfolio Polish"]),
            ("UX Researcher", "Meta", ["User Interviews", "Usability Testing", "Quantitative UX", "Product Strategy"])
        ]
    },
    # Pre-Med, Healthcare & Biology
    {
        "major": "Biology & Pre-Med",
        "roles": [
            ("Clinical Research Coordinator", "Emory Healthcare", ["Clinical Trials", "IRB Protocols", "Pre-Med Timeline", "Research Lab Prep"]),
            ("Healthcare Consultant", "Deloitte Life Sciences", ["Pre-Med Pivot", "Pharma Strategy", "Biotech Commercialization", "Case Interviews"]),
            ("Biomedical Informatics Analyst", "CDC", ["Epidemiology", "Public Health Data", "R / SAS", "Government Careers"])
        ]
    },
    # Pre-Law, Public Policy & Communications
    {
        "major": "Political Science & Public Policy",
        "roles": [
            ("Public Policy Analyst", "Brookings Institution", ["Policy Memos", "Legislative Tracking", "Pre-Law Prep", "Government Fellowship"]),
            ("Corporate Paralegal", "King & Spalding", ["Legal Research", "LSAT Prep", "Contract Review", "Law School Applications"]),
            ("Communications Strategist", "Edelman", ["Crisis PR", "Brand Storytelling", "Media Relations", "Campaign Strategy"])
        ]
    },
    # Environmental Science & Sustainability
    {
        "major": "Environmental Science & ESG",
        "roles": [
            ("Sustainability & ESG Consultant", "Deloitte", ["Carbon Accounting", "Corporate ESG", "Renewable Energy", "Green Careers"]),
            ("Climate Tech Operations Lead", "Watershed", ["Climate Policy", "GHG Protocols", "Startup Scaling", "Impact Roles"])
        ]
    }
]

CHALLENGES_POOL = [
    "Navigated recruitment as a commuter student balancing a 20+ hr/week job",
    "First-generation college student with zero corporate/industry connections",
    "Overcame low sophomore GPA turnaround (3.0 to 3.8) through tactical networking",
    "Switched majors midway through sophomore year behind the traditional recruitment cycle",
    "Faced 40+ ghosted applications freshman year before learning how to beat ATS filters",
    "Broke into tech without a Computer Science degree through public open-source projects",
    "Transferred from a community college with no initial university alumni network",
    "Conquered severe imposter syndrome during high-pressure behavioral and technical screens",
    "Landed high-paying Big Tech/Wall St roles from a public state school without Ivy pedigree",
    "Balanced varsity athletics / campus student government with rigorous STEM coursework"
]

def generate_mentors(target_count=500):
    mentors = []
    
    # Expand school selection pool based on weights
    school_pool = []
    for school, weight in SCHOOLS_WEIGHTED:
        school_pool.extend([school] * weight)
        
    mentor_id_counter = 1
    
    while len(mentors) < target_count:
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        name = f"{first} {last}"
        school = random.choice(school_pool)
        category = random.choice(MAJORS_AND_CAREERS)
        major = category["major"]
        role_info = random.choice(category["roles"])
        role, company, strengths = role_info
        
        grad_year = random.choice([2019, 2020, 2021, 2022, 2023, 2024])
        rating = round(random.uniform(4.88, 5.0), 2)
        review_count = random.randint(12, 48)
        
        # Pick 2-3 distinct challenges
        challenges = random.sample(CHALLENGES_POOL, 3)
        
        # Tailored bio
        school_shorthand = "GSU" if "Georgia State" in school else school.split()[0]
        bio = (
            f"{school_shorthand} alum ('{str(grad_year)[-2:]}) currently working as {role} at {company}. "
            f"Passionate about helping first- and second-year underclassmen navigate {major.lower()} coursework, "
            f"overcome '{challenges[0].lower()}', and secure their first summer internships."
        )
        
        # Free outcome-based services
        services = [
            {
                "id": f"s_{mentor_id_counter}_1",
                "title": f"{school_shorthand} Résumé Roast & ATS Optimization",
                "duration": "30 mins",
                "price": 0,
                "description": f"Detailed review of your {major.lower()} resume bullets and formatting tailored to pass recruiter ATS screens at {company} and peer firms.",
                "deliverable": "Annotated PDF + bullet rewrites"
            },
            {
                "id": f"s_{mentor_id_counter}_2",
                "title": f"First Internship & Recruiting Roadmap",
                "duration": "45 mins",
                "price": 0,
                "description": f"Personalized strategy for landing underclassman internships, cold emailing alumni, and balancing classwork.",
                "deliverable": f"Target company list + outreach templates for {role}"
            },
            {
                "id": f"s_{mentor_id_counter}_3",
                "title": f"Mock Interview & Feedback ({role.split()[0]} Focus)",
                "duration": "60 mins",
                "price": 0,
                "description": f"Realistic practice interview drilling questions asked at {company} with live rubrics and actionable feedback.",
                "deliverable": "Rubric scorecard + solution notes"
            }
        ]
        
        # Available slots
        day_options = ["Tomorrow", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        time_options = ["4:00 PM EST", "5:00 PM EST", "5:30 PM EST", "6:00 PM EST", "6:30 PM EST", "7:00 PM EST"]
        random_days = random.sample(day_options, 3)
        available_slots = [{"date": d, "time": random.choice(time_options)} for d in random_days]
        
        # Avatar URL with initials fallback
        avatar_color = random.choice(["6366f1", "06b6d4", "10b981", "3b82f6", "8b5cf6", "ec4899"])
        avatar_url = f"https://ui-avatars.com/api/?name={first}+{last}&background={avatar_color}&color=fff&size=200&bold=true"
        
        mentor_obj = {
            "id": f"m{mentor_id_counter}",
            "name": name,
            "school": school,
            "major": major,
            "graduation_year": grad_year,
            "role": role,
            "company": company,
            "bio": bio,
            "avatar": avatar_url,
            "challenges_overcome": challenges,
            "key_strengths": strengths,
            "price_hourly": 0,
            "rating": rating,
            "review_count": review_count,
            "services": services,
            "available_slots": available_slots
        }
        
        mentors.append(mentor_obj)
        mentor_id_counter += 1

    return mentors

if __name__ == "__main__":
    generated = generate_mentors(500)
    out_path = os.path.join(os.path.dirname(__file__), "mentors_500.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(generated, f, indent=2)
    print(f"Successfully generated {len(generated)} mentors to {out_path}")
