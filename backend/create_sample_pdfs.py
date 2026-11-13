import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

DIR = os.path.join(os.path.dirname(__file__), "sample_resumes")
os.makedirs(DIR, exist_ok=True)

def create_gsu_pdf():
    pdf_path = os.path.join(DIR, "DeMarcus_Cole_Georgia_State_Resume.pdf")
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    # Title
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, "DeMarcus Cole")
    
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 68, "dcole12@student.gsu.edu | (404) 555-0198 | Atlanta, GA | github.com/demarcus-cole")
    
    c.setLineWidth(1)
    c.line(50, height - 76, width - 50, height - 76)
    
    # Education
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 98, "EDUCATION")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 114, "Georgia State University (GSU)")
    c.setFont("Helvetica", 10)
    c.drawRightString(width - 50, height - 114, "Expected May 2027")
    c.drawString(50, height - 128, "Bachelor of Science in Computer Science | Minor in Mathematics (Sophomore)")
    c.drawString(50, height - 142, "Relevant Coursework: Principles of Computer Science I & II (Java), Data Structures (CSC 3410), Systems-Level Programming")
    
    # Technical Projects
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 168, "TECHNICAL PROJECTS")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 184, "MARTA Transit Route Optimizer & Alert System")
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(290, height - 184, "Python, FastAPI, React, Leaflet.js")
    c.setFont("Helvetica", 9)
    c.drawString(60, height - 198, "• Engineered full-stack transit tracker helping 400+ GSU commuter students navigate Atlanta rail and bus delays.")
    c.drawString(60, height - 212, "• Consumed MARTA public GTFS real-time API feeds with sub-second polling and WebSocket push alerts.")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 232, "Atlanta Community Pantry Inventory Platform")
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(290, height - 232, "Node.js, PostgreSQL, Docker")
    c.setFont("Helvetica", 9)
    c.drawString(60, height - 246, "• Built open-source stock distribution tool connecting local Atlanta food drives with student volunteers.")
    c.drawString(60, height - 260, "• Deployed RESTful API handling automated weekly inventory reconciliation reports.")
    
    # Experience
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 286, "EXPERIENCE & CAMPUS INVOLVEMENT")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 302, "GSU Campus Technology Store & Support")
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(270, height - 302, "Student Technician (20 hrs/week)")
    c.setFont("Helvetica", 9)
    c.drawString(60, height - 316, "• Diagnosed hardware and software troubleshooting issues across 80+ student laptops weekly.")
    c.drawString(60, height - 330, "• Active Member: Association for Computing Machinery (ACM @ GSU), ColorStack GSU Chapter")
    
    # Skills
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 354, "SKILLS")
    c.setFont("Helvetica", 9)
    c.drawString(50, height - 370, "Languages: Java, Python, JavaScript, TypeScript, SQL, HTML/CSS")
    c.drawString(50, height - 384, "Frameworks & Tools: React, FastAPI, Git, Docker, Linux, REST APIs")
    
    c.save()
    print("Created:", pdf_path)

def create_cs_pdf():
    pdf_path = os.path.join(DIR, "Jordan_Miller_UC_Berkeley_Resume.pdf")
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, "Jordan Miller")
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 68, "jordan.miller@berkeley.edu | (510) 555-0192 | Berkeley, CA")
    c.setLineWidth(1)
    c.line(50, height - 76, width - 50, height - 76)
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 98, "EDUCATION")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 114, "University of California, Berkeley (UC Berkeley)")
    c.setFont("Helvetica", 10)
    c.drawRightString(width - 50, height - 114, "Expected May 2027")
    c.drawString(50, height - 128, "B.S. in Electrical Engineering & Computer Sciences (EECS)")
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 158, "PROJECTS")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 174, "Gitlet Version Control System")
    c.setFont("Helvetica", 9)
    c.drawString(60, height - 188, "• Designed and implemented a miniature version-control system from scratch handling commits and merges.")
    c.save()
    print("Created:", pdf_path)

def create_finance_pdf():
    pdf_path = os.path.join(DIR, "Samantha_Cruz_NYU_Stern_Resume.pdf")
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, "Samantha Cruz")
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 68, "samantha.cruz@stern.nyu.edu | (212) 555-0819 | New York, NY")
    c.setLineWidth(1)
    c.line(50, height - 76, width - 50, height - 76)
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 98, "EDUCATION")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 114, "New York University (NYU Stern)")
    c.setFont("Helvetica", 10)
    c.drawRightString(width - 50, height - 114, "Expected May 2028")
    c.drawString(50, height - 128, "B.S. in Finance & Econometrics (Freshman)")
    c.save()
    print("Created:", pdf_path)

if __name__ == "__main__":
    create_gsu_pdf()
    create_cs_pdf()
    create_finance_pdf()
