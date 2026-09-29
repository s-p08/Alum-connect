import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Image
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class HumanSynopsisCanvas(canvas.Canvas):
    """
    Two-pass canvas for adding running headers and 'Page X of Y' footers.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8.5)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Running Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 11 * inch - 36, "KUK AlumConnect — Academic Project Synopsis")
            self.drawRightString(8.5 * inch - 54, 11 * inch - 36, "Kurukshetra University")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

        # Running Footer (All pages)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawString(54, 36, "Submitted by: Shivam Prakash | B.Tech CSE Project")
        self.drawRightString(8.5 * inch - 54, 36, page_str)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(54, 48, 8.5 * inch - 54, 48)
        
        self.restoreState()

def build_human_synopsis(pdf_path="project_synopsis.pdf"):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Color Palette
    navy = colors.HexColor("#1E3A8A")
    blue = colors.HexColor("#2563EB")
    dark_text = colors.HexColor("#1E293B")
    light_bg = colors.HexColor("#F8FAFC")
    border_color = colors.HexColor("#CBD5E1")

    # Typography Styles
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=navy,
        alignment=1, # Center
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=blue,
        alignment=1, # Center
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=navy,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceBefore=9,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=dark_text,
        spaceAfter=6,
        alignment=4 # Justified
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=dark_text,
        leftIndent=15,
        spaceAfter=4
    )

    caption_style = ParagraphStyle(
        'CaptionStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#64748B"),
        alignment=1, # Center
        spaceBefore=4,
        spaceAfter=10
    )

    story = []

    # ---------------------------------------------------------
    # HEADER & METADATA
    # ---------------------------------------------------------
    story.append(Paragraph("KURUKSHETRA UNIVERSITY, KURUKSHETRA", ParagraphStyle('InstHeader', fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=navy, alignment=1, spaceAfter=2)))
    story.append(Paragraph("DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", ParagraphStyle('DeptHeader', fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=colors.HexColor("#475569"), alignment=1, spaceAfter=8)))
    story.append(HRFlowable(width="100%", thickness=1.5, color=blue, spaceAfter=10))

    story.append(Paragraph("ACADEMIC PROJECT SYNOPSIS", title_style))
    story.append(Paragraph("KUK AlumConnect: Institutional Alumni Networking & Career Ecosystem", subtitle_style))

    # Metadata Table
    meta_table_data = [
        [Paragraph("<b>Project Title:</b>", body_style), Paragraph("KUK AlumConnect", body_style),
         Paragraph("<b>Submitted By:</b>", body_style), Paragraph("Shivam Prakash", body_style)],
        [Paragraph("<b>Degree Program:</b>", body_style), Paragraph("B.Tech (Computer Science & Engg)", body_style),
         Paragraph("<b>Institution:</b>", body_style), Paragraph("Kurukshetra University (KUK)", body_style)],
        [Paragraph("<b>Tech Stack:</b>", body_style), Paragraph("MERN Stack + WebSockets", body_style),
         Paragraph("<b>Academic Year:</b>", body_style), Paragraph("2025 – 2026", body_style)]
    ]
    meta_table = Table(meta_table_data, colWidths=[95, 155, 95, 155])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), light_bg),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # 1. INTRODUCTION & BACKGROUND
    # ---------------------------------------------------------
    story.append(Paragraph("1. INTRODUCTION & BACKGROUND", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6))
    
    story.append(Paragraph("1.1 Role of Alumni Networks in Higher Education", h2_style))
    story.append(Paragraph(
        "An active and engaged alumni network is one of the most critical assets of any higher education institution. Alumni serve as a bridge between academic education and the evolving demands of industry. They provide current students with career guidance, industry mentorship, job placement referrals, internship opportunities, and valuable insight into corporate environments.", body_style))

    story.append(Paragraph("1.2 Context at Kurukshetra University (KUK)", h2_style))
    story.append(Paragraph(
        "At Kurukshetra University, thousands of students graduate each year across technical and professional streams. However, interactions between current students and alumni are currently fragmented across informal channels such as WhatsApp groups, LinkedIn connections, and unofficial social media pages. This fragmentation leads to unverified profiles, lost referral notices, and poor engagement.", body_style))

    story.append(Paragraph("1.3 Scope of the Project", h2_style))
    story.append(Paragraph(
        "<b>KUK AlumConnect</b> is a centralized web platform designed specifically for Kurukshetra University. It establishes a secure institutional gateway where verified students, alumni, and administrators interact. The platform integrates a verified directory, job referral engine, real-time private messaging, discussion forums, and university crowdfunding modules.", body_style))

    # ---------------------------------------------------------
    # 2. PROBLEM STATEMENT & NEED
    # ---------------------------------------------------------
    story.append(Paragraph("2. PROBLEM STATEMENT & NEED FOR THE PLATFORM", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6))

    story.append(Paragraph("2.1 Limitations of Existing Channels", h2_style))
    story.append(Paragraph(
        "Current communication methods pose several key challenges for students and alumni:", body_style))
    
    issues = [
        "<b>Unverified Identities:</b> On public social networks, students cannot easily verify whether a profile genuinely belongs to a KUK graduate.",
        "<b>Lost Opportunities:</b> Internship postings and job referrals shared in informal chat groups quickly get buried under daily messages.",
        "<b>Privacy Concerns:</b> Alumni are often reluctant to share personal contact numbers on public forums due to spam or unsolicited requests.",
        "<b>Lack of Institutional Hub:</b> Alumni lack a formal platform to view campus developments, post job openings, or support university initiatives financially."
    ]
    for issue in issues:
        story.append(Paragraph(f"• {issue}", bullet_style))

    story.append(Spacer(1, 4))
    story.append(Paragraph("2.2 Comparative Analysis", h2_style))

    comp_data = [
        [Paragraph("<b>Feature Parameter</b>", body_style), Paragraph("<b>Generic Social Media / WhatsApp</b>", body_style), Paragraph("<b>KUK AlumConnect Platform</b>", body_style)],
        [Paragraph("<b>Identity Verification</b>", body_style), Paragraph("Unverified public profiles", body_style), Paragraph("University verified Student/Alumni roles", body_style)],
        [Paragraph("<b>Directory Search</b>", body_style), Paragraph("Basic keyword search", body_style), Paragraph("Multi-criteria by Batch, Branch, Company & City", body_style)],
        [Paragraph("<b>Job & Referral Portal</b>", body_style), Paragraph("Informal text posts", body_style), Paragraph("Dedicated portal with status tracking", body_style)],
        [Paragraph("<b>Real-Time Communication</b>", body_style), Paragraph("Requires personal phone numbers", body_style), Paragraph("In-app WebSocket chat preserving privacy", body_style)],
        [Paragraph("<b>Crowdfunding & Support</b>", body_style), Paragraph("Not supported", body_style), Paragraph("Dedicated campaigns for scholarships & research", body_style)]
    ]
    comp_table = Table(comp_data, colWidths=[120, 180, 200])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # 3. PROJECT OBJECTIVES & METHODOLOGY
    # ---------------------------------------------------------
    story.append(Paragraph("3. PROJECT OBJECTIVES & METHODOLOGY", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6))

    story.append(Paragraph("3.1 Primary Objectives", h2_style))
    objectives = [
        "<b>Verified User Authentication:</b> Build a secure login system supporting role-based access for Students, Alumni, and Admins.",
        "<b>Searchable Alumni Directory:</b> Develop an intuitive directory with real-time multi-field search and filtering capabilities.",
        "<b>Job & Internship Portal:</b> Create a structured portal allowing alumni to post opportunities and students to apply directly.",
        "<b>Real-Time Chat Engine:</b> Integrate 1-on-1 private messaging powered by Socket.io WebSockets.",
        "<b>Community Forum:</b> Implement discussion boards for career Q&A, domain discussions, and campus updates.",
        "<b>Institutional Crowdfunding:</b> Provide a transparent funding module for alumni contributions toward campus initiatives."
    ]
    for obj in objectives:
        story.append(Paragraph(f"• {obj}", bullet_style))

    story.append(Paragraph("3.2 Development Methodology", h2_style))
    story.append(Paragraph(
        "The project follows an Agile Software Development lifecycle. Development was divided into iterative sprints: Requirement Gathering, Backend API & Database Schema Design, React Component Architecture, Real-Time Socket Integration, and End-to-End System Testing.", body_style))

    story.append(Spacer(1, 8))

    # ---------------------------------------------------------
    # 4. HARDWARE & SOFTWARE REQUIREMENTS
    # ---------------------------------------------------------
    story.append(Paragraph("4. HARDWARE & SOFTWARE REQUIREMENTS", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6))

    story.append(Paragraph("4.1 Software Requirements", h2_style))
    sw_reqs = [
        "<b>Operating System:</b> Windows 10/11, Linux, or macOS",
        "<b>Runtime Environment:</b> Node.js (v18.x or higher)",
        "<b>Frontend Framework:</b> React 18, Vite, Tailwind CSS",
        "<b>Backend Framework:</b> Express.js framework on Node.js",
        "<b>Database Engine:</b> MongoDB Atlas (NoSQL Document Store)",
        "<b>Real-Time Protocol:</b> Socket.io (WebSocket client & server)",
        "<b>Version Control:</b> Git & GitHub"
    ]
    for sw in sw_reqs:
        story.append(Paragraph(f"• {sw}", bullet_style))

    story.append(Paragraph("4.2 Minimum Hardware Requirements", h2_style))
    hw_reqs = [
        "<b>Processor:</b> Dual-Core Intel Core i3 / AMD Ryzen 3 or higher",
        "<b>Memory (RAM):</b> Minimum 4 GB (8 GB recommended for development environment)",
        "<b>Storage:</b> 20 GB available disk space",
        "<b>Network Connection:</b> Broadband internet connection for cloud database access"
    ]
    for hw in hw_reqs:
        story.append(Paragraph(f"• {hw}", bullet_style))

    story.append(Spacer(1, 8))

    # ---------------------------------------------------------
    # 5. SYSTEM ARCHITECTURE & MODULE BREAKDOWN
    # ---------------------------------------------------------
    story.append(Paragraph("5. SYSTEM ARCHITECTURE & MODULE BREAKDOWN", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6))

    story.append(Paragraph("5.1 System Architecture Overview", h2_style))
    story.append(Paragraph(
        "KUK AlumConnect is structured as a scalable client-server architecture. The React frontend handles user interactions and renders responsive pages, communicating with the Express backend via RESTful APIs. WebSockets provide a full-duplex communication channel for real-time messaging, while MongoDB handles persistent data storage.", body_style))

    story.append(Paragraph("5.2 Key System Modules", h2_style))
    modules = [
        "<b>5.2.1 Authentication & Profile Management:</b> Role-based access control (Student, Alumni, Admin). User profiles display academic details, current company, designation, location, and social links.",
        "<b>5.2.2 Smart Alumni Directory:</b> Real-time search with multi-field filtering by Branch, Batch year, Employer Company, and City location with one-click chat initiation.",
        "<b>5.2.3 Job & Internship Referral Engine:</b> Alumni post job openings with specifications. Students submit cover letters and track application status (Pending, Reviewed, Interviewing, Accepted/Rejected).",
        "<b>5.2.4 Real-Time Private Messaging:</b> Instant 1-on-1 WebSocket chat preserving user phone privacy with persistent chat history.",
        "<b>5.2.5 Discussion Forum & Noticeboard:</b> Categorized discussion boards for career guidance, interview experiences, and official announcements.",
        "<b>5.2.6 Institutional Crowdfunding:</b> Dedicated donation portal enabling alumni to fund student scholarships, research projects, and campus grants."
    ]
    for mod in modules:
        story.append(Paragraph(f"• {mod}", bullet_style))

    story.append(Spacer(1, 8))

    # ---------------------------------------------------------
    # 6. DATABASE DESIGN & ENTITY RELATIONSHIPS
    # ---------------------------------------------------------
    story.append(Paragraph("6. DATABASE DESIGN & CORE ENTITIES", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6))
    story.append(Paragraph(
        "The system utilizes MongoDB for flexible document storage. Core entities include:", body_style))

    entities = [
        "<b>User Entity:</b> Stores account credentials, role (student/alumni/admin), academic branch, batch year, company, designation, location, and social links.",
        "<b>Job Entity:</b> Contains job title, company name, location, job description, requirements, auto-generated Job ID, poster details, and timestamp.",
        "<b>Application Entity:</b> Connects applicant users with Job entries, holding cover letter text, resume link, and application status.",
        "<b>Message Entity:</b> Records sender ID, recipient ID, message content, read status, and delivery timestamps.",
        "<b>Forum Post Entity:</b> Stores post title, content body, category tag, author ID, upvotes/downvotes array, and nested comments.",
        "<b>Donation Entity:</b> Captures campaign details, goal amount, collected funds, donor contributions, and status."
    ]
    for ent in entities:
        story.append(Paragraph(f"• {ent}", bullet_style))

    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # 7. APPLICATION SCREENSHOTS
    # ---------------------------------------------------------
    story.append(Paragraph("7. APPLICATION SCREENSHOTS & WORKFLOW", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6))

    # Screenshot 1: Directory
    if os.path.exists('screenshot_directory.png'):
        img1 = Image('screenshot_directory.png', width=5.0 * inch, height=2.8 * inch)
        story.append(KeepTogether([
            img1,
            Paragraph("<b>Figure 7.1: Smart Alumni Directory & Search Filter</b> — Multi-criteria search by Batch, Branch, Company, and Location with direct messaging actions.", caption_style)
        ]))
        story.append(Spacer(1, 6))

    # Screenshot 2: Dashboard
    if os.path.exists('screenshot_dashboard.png'):
        img2 = Image('screenshot_dashboard.png', width=5.0 * inch, height=2.8 * inch)
        story.append(KeepTogether([
            img2,
            Paragraph("<b>Figure 7.2: Alumni Dashboard Overview</b> — View of recent announcements, network interactions, job applications, and quick user actions.", caption_style)
        ]))
        story.append(Spacer(1, 6))

    # Screenshot 3: Jobs
    if os.path.exists('screenshot_jobs.png'):
        img3 = Image('screenshot_jobs.png', width=5.0 * inch, height=2.8 * inch)
        story.append(KeepTogether([
            img3,
            Paragraph("<b>Figure 7.3: Job & Internship Referral Portal</b> — Job openings listed by alumni with single-click application workflow.", caption_style)
        ]))
        story.append(Spacer(1, 6))

    # Screenshot 4: Forum
    if os.path.exists('screenshot_forum.png'):
        img4 = Image('screenshot_forum.png', width=5.0 * inch, height=2.8 * inch)
        story.append(KeepTogether([
            img4,
            Paragraph("<b>Figure 7.4: Community Discussion Forum</b> — Category-filtered discussion boards for career guidance and campus updates.", caption_style)
        ]))
        story.append(Spacer(1, 6))

    # ---------------------------------------------------------
    # 8. SECURITY & TESTING STRATEGY
    # ---------------------------------------------------------
    story.append(Paragraph("8. SECURITY & TESTING STRATEGY", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6))

    story.append(Paragraph("8.1 Security & Data Privacy Measures", h2_style))
    sec_points = [
        "<b>Password Encryption:</b> Passwords are hashed using salted Bcrypt before database storage.",
        "<b>Authentication Security:</b> Secure session handling with HTTP-only cookies and protected API middleware routes.",
        "<b>Input Sanitization:</b> API request payloads are sanitized to protect against cross-site scripting (XSS) and injection attacks.",
        "<b>Role Verification:</b> Route authorization guards ensure users access only authorized endpoints."
    ]
    for sp in sec_points:
        story.append(Paragraph(f"• {sp}", bullet_style))

    story.append(Paragraph("8.2 Testing Strategy", h2_style))
    test_points = [
        "<b>Unit Testing:</b> Verified isolated backend utility functions and model methods.",
        "<b>API Testing:</b> Automated REST endpoint tests for login, search query parameters, and job posting pipelines.",
        "<b>User Acceptance Testing (UAT):</b> Usability tests conducted with students and alumni to confirm workflow simplicity."
    ]
    for tp in test_points:
        story.append(Paragraph(f"• {tp}", bullet_style))

    story.append(Spacer(1, 8))

    # ---------------------------------------------------------
    # 9. IMPLEMENTATION TIMELINE
    # ---------------------------------------------------------
    story.append(Paragraph("9. IMPLEMENTATION TIMELINE", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6))

    plan_data = [
        [Paragraph("<b>Phase</b>", body_style), Paragraph("<b>Description</b>", body_style), Paragraph("<b>Key Deliverables</b>", body_style), Paragraph("<b>Duration</b>", body_style)],
        [Paragraph("<b>Phase 1</b>", body_style), Paragraph("Requirement Analysis & Setup", body_style), Paragraph("Project Scope & Stack Setup", body_style), Paragraph("Week 1–2", body_style)],
        [Paragraph("<b>Phase 2</b>", body_style), Paragraph("DB Design & Backend APIs", body_style), Paragraph("MongoDB Schemas, REST APIs", body_style), Paragraph("Week 3–4", body_style)],
        [Paragraph("<b>Phase 3</b>", body_style), Paragraph("Frontend UI Development", body_style), Paragraph("React Views, Tailwind Styling", body_style), Paragraph("Week 5–6", body_style)],
        [Paragraph("<b>Phase 4</b>", body_style), Paragraph("Real-Time Chat & Features", body_style), Paragraph("Socket.io, Jobs & Forum Modules", body_style), Paragraph("Week 7–8", body_style)],
        [Paragraph("<b>Phase 5</b>", body_style), Paragraph("Testing & Final Documentation", body_style), Paragraph("Bug Fixing, Synopsis & Report", body_style), Paragraph("Week 9–10", body_style)]
    ]
    plan_table = Table(plan_data, colWidths=[65, 170, 185, 80])
    plan_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(plan_table)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # 10. CONCLUSION & FUTURE SCOPE
    # ---------------------------------------------------------
    story.append(Paragraph("10. CONCLUSION & FUTURE SCOPE", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6))
    
    story.append(Paragraph("10.1 Conclusion", h2_style))
    story.append(Paragraph(
        "KUK AlumConnect provides a comprehensive, secure, and user-friendly digital platform tailored for Kurukshetra University. By unifying verified alumni profiles, structured job referrals, real-time messaging, and community discussions, the system bridges the gap between current students and alumni, establishing a long-term ecosystem for career advancement and academic support.", body_style))

    story.append(Paragraph("10.2 Future Scope", h2_style))
    future_points = [
        "<b>AI-Powered Mentorship Matching:</b> Automatic recommendations connecting students with alumni based on shared skills and career goals.",
        "<b>Integrated Video Conferencing:</b> WebRTC integration for 1-on-1 virtual mock interviews and counseling.",
        "<b>Native Mobile Applications:</b> Cross-platform React Native mobile app for iOS and Android.",
        "<b>University Database Integration:</b> Automated roll number verification against central university records."
    ]
    for fp in future_points:
        story.append(Paragraph(f"• {fp}", bullet_style))

    # Build PDF with custom NumberedCanvas
    doc.build(story, canvasmaker=HumanSynopsisCanvas)
    print(f"Human-styled synopsis PDF successfully built: {os.path.abspath(pdf_path)}")

if __name__ == "__main__":
    build_human_synopsis()
