# ACADEMIC PROJECT SYNOPSIS
## KUK AlumConnect: Institutional Alumni Networking & Career Ecosystem

---

### **PROJECT METADATA**
* **University:** Kurukshetra University, Kurukshetra (KUK)
* **Department:** Department of Computer Science & Engineering
* **Degree Program:** Bachelor of Technology (B.Tech) in Computer Science & Engineering
* **Project Title:** KUK AlumConnect
* **Submitted By:** Shivam Prakash
* **Technology Stack:** MERN Stack (MongoDB, Express.js, React.js, Node.js) with Socket.io WebSockets
* **Academic Year:** 2025 – 2026

---

## 1. INTRODUCTION & BACKGROUND

### 1.1 Role of Alumni Networks in Higher Education
An active and engaged alumni network is one of the most critical assets of any higher education institution. Alumni serve as a bridge between academic education and the evolving demands of industry. They provide current students with career guidance, industry mentorship, job placement referrals, internship opportunities, and valuable insight into corporate environments.

### 1.2 Context at Kurukshetra University (KUK)
At Kurukshetra University, thousands of students graduate each year across technical and professional streams. However, interactions between current students and alumni are currently fragmented across informal channels such as WhatsApp groups, LinkedIn connections, and unofficial social media pages. This fragmentation leads to unverified profiles, lost referral notices, and poor engagement.

### 1.3 Scope of the Project
**KUK AlumConnect** is a centralized web platform designed specifically for Kurukshetra University. It establishes a secure institutional gateway where verified students, alumni, and administrators interact. The platform integrates a verified directory, job referral engine, real-time private messaging, discussion forums, and university crowdfunding modules.

---

## 2. PROBLEM STATEMENT & NEED FOR THE PLATFORM

### 2.1 Limitations of Existing Channels
Current communication methods pose several key challenges for students and alumni:
* **Unverified Identities:** On public social networks, students cannot easily verify whether a profile genuinely belongs to a KUK graduate.
* **Lost Opportunities:** Internship postings and job referrals shared in informal chat groups quickly get buried under daily messages.
* **Privacy Concerns:** Alumni are often reluctant to share personal contact numbers on public forums due to spam or unsolicited requests.
* **Lack of Institutional Hub:** Alumni lack a formal platform to view campus developments, post job openings, or support university initiatives financially.

### 2.2 Comparative Analysis

| Feature Parameter | Generic Social Media / WhatsApp | KUK AlumConnect Platform |
| :--- | :--- | :--- |
| **Identity Verification** | Unverified public profiles | University verified Student/Alumni roles |
| **Directory Search** | Basic keyword search | Multi-criteria search by Batch, Branch, Company & City |
| **Job & Referral Portal** | Informal text posts | Dedicated portal with status tracking |
| **Real-Time Communication** | Requires personal phone numbers | In-app WebSocket chat preserving privacy |
| **Crowdfunding & Support** | Not supported | Dedicated campaigns for scholarships & research |

---

## 3. PROJECT OBJECTIVES & METHODOLOGY

### 3.1 Primary Objectives
* Build a secure user authentication system supporting role-based access for Students, Alumni, and Admins.
* Develop an intuitive Alumni Directory with real-time multi-field search and filtering capabilities.
* Create a structured Job & Internship Referral Portal allowing alumni to post opportunities and students to apply directly.
* Integrate a real-time 1-on-1 private messaging system powered by WebSockets.
* Implement a Community Discussion Forum for career Q&A, domain discussions, and university announcements.
* Provide a transparent Crowdfunding module for alumni contributions toward campus initiatives.

### 3.2 Development Methodology
The project follows an Agile Software Development lifecycle. Development was divided into iterative sprints:
1. **Requirement Analysis & Data Modeling:** Schema design for MongoDB and REST API contracts.
2. **Core Backend Development:** Authentication, Directory routes, and Database indexing.
3. **Frontend Component Engineering:** Responsive React interface with Tailwind CSS styling.
4. **Real-Time Integration:** Socket.io integration for instant chat notifications and messaging.
5. **Testing & Deployment:** Functional verification, security audits, and deployment optimization.

---

## 4. HARDWARE & SOFTWARE REQUIREMENTS

### 4.1 Software Requirements
* **Operating System:** Windows 10/11, Linux, or macOS
* **Runtime Environment:** Node.js (v18.x or higher)
* **Frontend Framework:** React 18, Vite, Tailwind CSS
* **Backend Framework:** Express.js framework on Node.js
* **Database Engine:** MongoDB Atlas (NoSQL Document Store)
* **Real-Time Protocol:** Socket.io (WebSocket client & server)
* **Version Control:** Git & GitHub

### 4.2 Minimum Hardware Requirements
* **Processor:** Dual-Core Intel Core i3 / AMD Ryzen 3 or higher
* **Memory (RAM):** Minimum 4 GB (8 GB recommended for development environment)
* **Storage:** 20 GB available disk space
* **Network:** High-speed internet connection for cloud database access and WebSocket transmission

---

## 5. SYSTEM ARCHITECTURE & MODULE BREAKDOWN

### 5.1 System Architecture Overview
KUK AlumConnect is structured as a client-server architecture. The React frontend handles user interactions and renders responsive pages, communicating with the Express backend via RESTful APIs. WebSockets provide a full-duplex communication channel for instant messaging. Data persistence is managed by MongoDB Atlas.

### 5.2 Key System Modules

#### 5.2.1 Authentication & Profile Management
* Role-based access control (Student, Alumni, Admin).
* Profile customization including academic details (Branch, Batch), professional details (Current Company, Role, Designation), location, and social links.

#### 5.2.2 Smart Alumni Directory
* Real-time search with multi-field filtering by Branch, Batch year, Employer Company, and City location.
* Direct action buttons to initiate instant 1-on-1 chat.

#### 5.2.3 Job & Internship Referral Engine
* Alumni post detailed job openings with requirements and application links.
* Students submit applications with cover letters and track status updates (Pending, Reviewed, Interviewing, Accepted/Rejected).

#### 5.2.4 Real-Time Private Messaging
* Instant 1-on-1 messaging using Socket.io WebSockets.
* In-app notifications and persistent message history stored securely in MongoDB.

#### 5.2.5 Discussion Forum & Noticeboard
* Categorized discussion threads for career guidance, interview experiences, technical topics, and official university announcements.

#### 5.2.6 Institutional Crowdfunding
* Alumni donate to specific university campaigns such as Student Scholarships, Innovation Grants, and Infrastructure Development.

---

## 6. DATABASE DESIGN & ENTITY RELATIONSHIPS

The system utilizes MongoDB for flexible document storage. Core entities include:

* **User Entity:** Stores account credentials, role (student/alumni/admin), academic branch, batch year, company, designation, location, and social links.
* **Job Entity:** Contains job title, company name, location, job description, requirements, auto-generated Job ID, poster details, and timestamp.
* **Application Entity:** Connects applicant users with Job entries, holding cover letter text, resume link, and application status.
* **Message Entity:** Records sender ID, recipient ID, message content, read status, and delivery timestamps.
* **Forum Post Entity:** Stores post title, content body, category tag, author ID, upvotes/downvotes array, and nested comments.
* **Donation Entity:** Captures campaign details, goal amount, collected funds, donor contributions, and status.

---

## 7. APPLICATION SCREENSHOTS & WORKFLOW

### **Figure 7.1: Smart Alumni Directory & Search Filter**
![Alumni Directory](file:///c:/Users/shiva/OneDrive/Desktop/Alum-Connect-main/screenshot_directory.png)
*Figure 7.1: Search and multi-criteria filtering by Batch, Branch, Company, and Location with direct messaging actions.*

---

### **Figure 7.2: Alumni Dashboard Overview**
![Alumni Dashboard](file:///c:/Users/shiva/OneDrive/Desktop/Alum-Connect-main/screenshot_dashboard.png)
*Figure 7.2: Overview of recent announcements, network interactions, job applications, and quick user actions.*

---

### **Figure 7.3: Job & Internship Referral Portal**
![Job Referral Portal](file:///c:/Users/shiva/OneDrive/Desktop/Alum-Connect-main/screenshot_jobs.png)
*Figure 7.3: Job openings listed by alumni with detailed specifications and single-click application workflow.*

---

### **Figure 7.4: Community Discussion Forum**
![Discussion Forum](file:///c:/Users/shiva/OneDrive/Desktop/Alum-Connect-main/screenshot_forum.png)
*Figure 7.4: Category-filtered discussion boards for career guidance, technical Q&A, and campus updates.*

---

## 8. SECURITY & TESTING STRATEGY

### 8.1 Security & Data Privacy Measures
* **Password Encryption:** Passwords are hashed using salted Bcrypt before database storage.
* **Authentication Security:** Secure session handling with HTTP-only cookies and protected API middleware routes.
* **Input Sanitization:** API request payloads are sanitized to protect against cross-site scripting (XSS) and injection attacks.
* **Role Verification:** Route authorization guards ensure students, alumni, and admins can only access authorized endpoints.

### 8.2 Testing Strategy
* **Unit Testing:** Verified isolated backend utility functions and model methods.
* **API Testing:** Executed automated REST endpoint tests for login, search query parameters, and job posting pipelines.
* **User Acceptance Testing (UAT):** Conducted usability tests with students and alumni to confirm workflow simplicity and UI responsiveness.

---

## 9. IMPLEMENTATION TIMELINE

| Phase | Description | Key Deliverables | Duration |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Requirement Analysis & Setup | Project Scope, Stack Finalization, Git Setup | Week 1–2 |
| **Phase 2** | DB Design & Backend APIs | MongoDB Schemas, Express REST APIs | Week 3–4 |
| **Phase 3** | Frontend UI Development | React Views, Components, Tailwind Styling | Week 5–6 |
| **Phase 4** | Real-Time Chat & Features | Socket.io Integration, Jobs & Forum Modules | Week 7–8 |
| **Phase 5** | Testing & Final Documentation | Bug Fixing, Performance Optimization, Synopsis & Report | Week 9–10 |

---

## 10. CONCLUSION & FUTURE SCOPE

### 10.1 Conclusion
KUK AlumConnect provides a comprehensive, secure, and user-friendly digital platform tailored for Kurukshetra University. By unifying verified alumni profiles, structured job referrals, real-time messaging, and community discussions, the system bridges the gap between current students and alumni, establishing a long-term ecosystem for career advancement and academic support.

### 10.2 Future Scope
* **AI-Powered Mentorship Matching:** Automatic recommendations connecting students with alumni based on shared skills, career interests, and academic backgrounds.
* **Integrated Video Conferencing:** WebRTC integration for seamless 1-on-1 virtual mock interviews and career counseling.
* **Native Mobile Applications:** Cross-platform React Native mobile app for iOS and Android.
* **University Database Integration:** Automated roll number and degree verification against central university records.

---
*Submitted for B.Tech CSE Project — Kurukshetra University, Kurukshetra*
