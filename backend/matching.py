import os
import json
from typing import List, Dict, Any, Optional

def normalize_school(school: str) -> str:
    s = (school or "").strip().lower()
    if "georgia state" in s or "gsu" in s:
        return "georgia state university"
    if "berkeley" in s:
        return "uc berkeley"
    if "nyu" in s or "stern" in s:
        return "nyu stern"
    if "michigan" in s:
        return "university of michigan"
    if "georgia tech" in s:
        return "georgia tech"
    if "stanford" in s:
        return "stanford university"
    if "mit" in s:
        return "mit"
    if "columbia" in s:
        return "columbia university"
    if "texas" in s or "ut austin" in s:
        return "ut austin"
    if "ucla" in s:
        return "ucla"
    if "harvard" in s:
        return "harvard university"
    return s

def compute_mentor_match(student: Dict[str, Any], mentor: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes match score, custom AI explanation, and prep questions
    linking student background/goals to mentor's experience.
    """
    student_school_norm = normalize_school(student.get("school", ""))
    mentor_school_norm = normalize_school(mentor.get("school", ""))
    
    student_major = (student.get("major") or "").strip().lower()
    student_target = (student.get("target_role") or student.get("goals") or "").strip().lower()
    student_challenges = [c.lower() for c in student.get("challenges", [])]
    
    mentor_role = mentor.get("role", "").lower()
    mentor_company = mentor.get("company", "").lower()
    mentor_challenges = [c.lower() for c in mentor.get("challenges_overcome", [])]
    mentor_strengths = [s.lower() for s in mentor.get("key_strengths", [])]
    
    score = 55.0  # base score
    reasons = []
    
    # 1. School Match (High weight)
    is_school_match = False
    if student_school_norm and mentor_school_norm and (student_school_norm in mentor_school_norm or mentor_school_norm in student_school_norm):
        score += 28.0
        is_school_match = True
        reasons.append(f"🎓 Alumni match from {mentor['school']} – knows the campus culture, recruiting pipeline, and specific coursework")
    
    # 2. Field / Target Role Match
    is_field_match = False
    field_keywords = {
        "software": ["software", "swe", "frontend", "backend", "fullstack", "developer", "coding", "cis"],
        "data": ["data", "analytics", "sql", "python", "machine learning", "ml", "ai"],
        "product": ["product", "pm", "apm", "strategy"],
        "finance": ["finance", "banking", "investment", "pe", "wall street", "quant", "trading"],
        "consulting": ["consulting", "case", "mckinsey", "deloitte", "bain", "bcg", "advisory"],
        "design": ["design", "ux", "ui", "product design", "figma"],
        "security": ["security", "cyber", "infosec", "soc", "cloud"]
    }
    
    for domain, kws in field_keywords.items():
        student_matches = any(kw in student_target or kw in student_major for kw in kws)
        mentor_matches = any(kw in mentor_role or any(kw in s for s in mentor_strengths) for kw in kws)
        if student_matches and mentor_matches:
            score += 18.0
            is_field_match = True
            break
            
    if is_field_match:
        reasons.append(f"💼 Direct career path alignment: currently {mentor['role']} at {mentor['company']}")
    elif any(s in student_target for s in ["internship", "resume", "interview"]):
        score += 8.0
        reasons.append(f"🚀 Proven expertise in underclassmen resume prep and internship recruiting")
        
    # 3. Always Free Mentorship perk
    score += 5.0
    reasons.append("🎁 100% Free Mentorship Session – Dedicated alumni giving back")

    # 4. Challenges Overcome Fit (Empathy & Relevance)
    matched_challenges = []
    for sc in student_challenges:
        for mc in mentor_challenges:
            words = [w for w in sc.split() if len(w) > 3]
            if any(w in mc for w in words):
                matched_challenges.append(mc)
                break
                
    if matched_challenges:
        score += 10.0
        reasons.append(f"🤝 Shared obstacle: {matched_challenges[0][:65]}...")
    else:
        reasons.append(f"💡 Overcame: {mentor['challenges_overcome'][0]}")
        score += 5.0

    # 5. Rating boost
    score += (mentor.get("rating", 4.8) - 4.5) * 10
    
    # Clamp score to 72% - 99%
    final_score = int(min(max(score, 72), 99))
    
    # Generate custom AI explanation narrative
    school_phrase = f"As a fellow {mentor['school']} alumnus," if is_school_match else f"As an experienced mentor from {mentor['school']},"
    explanation = (
        f"{school_phrase} {mentor['name']} has directly navigated the journey from college underclassman "
        f"to {mentor['role']} at {mentor['company']}. Having overcome \"{mentor['challenges_overcome'][0]}\", "
        f"they offer free 1-on-1 mentorship to help you bypass generic advice and land {student.get('target_role') or 'your target roles'}."
    )
    
    # Generate 3 tailor-made session preparation questions for the student
    prep_questions = [
        f"How did you leverage your campus coursework and projects at {mentor['school']} to impress recruiters at {mentor['company']}?",
        f"What is the single most common mistake you see 1st and 2nd year students make when applying for {mentor['role']} internships?",
        f"Can you walk me through how you overcame '{mentor['challenges_overcome'][0]}' and what advice you'd give me today?"
    ]
    
    return {
        "mentor": mentor,
        "match_score": final_score,
        "is_school_match": is_school_match,
        "reasons": reasons[:3],
        "ai_explanation": explanation,
        "prep_questions": prep_questions
    }

def rank_mentors_for_student(student_profile: Dict[str, Any], mentors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    ranked = []
    for m in mentors:
        match_data = compute_mentor_match(student_profile, m)
        ranked.append(match_data)
        
    # Sort descending by match_score, prioritizing school match
    ranked.sort(key=lambda x: (x["is_school_match"], x["match_score"]), reverse=True)
    return ranked
