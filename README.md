<div align="center">

# 🎓 PREVU
### Enterprise-Grade Academic Knowledge Base & Peer Intelligence Platform
**Engineered for Chandigarh University • Department of Computer Science & Engineering**

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Security-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br />

<p align="center">
  <strong>Prevu</strong> is an open-source, student-engineered academic management ecosystem designed to consolidate, index, and distribute verified examination materials, topper study references, curriculum blueprints, multi-modal resources (PDFs, Google Drive bundles, and YouTube recommendations), and real-time peer doubt-solving for undergraduate engineering students.
</p>

<p align="center">
  <a href="#-executive-summary">Executive Summary</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-core-platform-modules">Core Modules</a> •
  <a href="#-data-models--schema">Database Schema</a> •
  <a href="#-security--privacy-posture">Security</a> •
  <a href="#-platform-policies-terms--conditions">Policies & Terms</a> •
  <a href="#-local-development-setup">Setup Guide</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

</div>

<br />

## 📋 Executive Summary

### 1. Problem Statement
Academic resource distribution across large engineering universities is historically plagued by fragmentation:
* **High Information Entropy:** Examination papers and syllabus notes are scattered across ephemeral chat groups, expired storage links, and private student drives.
* **Low Signal-to-Noise Ratio:** Students frequently encounter corrupted files, unverified answer keys, and blurry handheld photographs moments before assessments.
* **Bandwidth & Connectivity Bottlenecks:** Exam weeks create high network concurrency on campus Wi-Fi, disabling access to high-latency external storage drives.
* **Syllabus Disconnect:** Question papers often circulate without context regarding syllabus mapping, unit weighting, or repeated question frequency.

### 2. The Prevu Solution
Prevu bridges institutional academic demands with modern cloud-native web engineering:
* **Centralized Metadata Indexing:** Every document is cataloged across a normalized relational taxonomy (Semester 1–8, Exam Cycle, Course Code, Subject ID, and Specialization Track).
* **Multi-Modal Contribution Engine:** Supports uploaded PDFs, full semester Google Drive folders, and curated YouTube video/playlist recommendations per subject.
* **Sleek Compact Navigation (~680px):** Floating Framer Motion capsule dock with instant semester switching and a top live exam countdown ticker strip.
* **Backlog Rescue Hub (Reappear Module):** Tailored remedial revision tracks featuring repeated questions banks, 80/20 crash notes, and passing blueprints.
* **Interactive Terminal Aesthetics:** Includes an autonomous/playable GitHub Contribution Snake Game on the commit heatmap and interactive developer consoles.
* **Smart Cohort Dispatch:** Doubts and missing paper requests automatically ping batchmates enrolled in the corresponding semester.
* **Offline-First Vault Architecture:** Progressive Web App (PWA) client caching ensures mission-critical study materials remain accessible during campus network outages.

---

## 🏛️ System Architecture

Prevu leverages a hybrid serverless architecture utilizing **Next.js 16 React Server Components (RSC)**, **Firebase Authentication**, and **Supabase (PostgreSQL with Row Level Security)**.

```mermaid
flowchart TB
    subgraph ClientLayer [Client & Edge Runtime]
        PWA[PWA Client / Desktop & Mobile]
        DOM[React 19 Interactive DOM]
        SW[Service Worker Offline Vault]
        Snake[Academic Commit Snake Engine]
    end

    subgraph AuthLayer [Identity & Security Boundary]
        FirebaseAuth[Firebase Auth Client]
        FirebaseAdmin[Firebase Admin SDK / JWT Verifier]
        CookieEngine[HttpOnly Secure Session Engine]
    end

    subgraph AppRouter [Next.js 16 Application Server]
        RSC[React Server Components]
        ServerActions[Secure Server Actions]
        Middleware[Edge RBAC Middleware]
        CohortDispatcher[Smart Cohort Dispatch Engine]
        LinkParser[GDrive & YouTube Link Parser]
    end

    subgraph PersistenceLayer [Data & Storage Tier]
        SupabasePostgres[(Supabase PostgreSQL 15)]
        SupabaseStorage[Encrypted Asset Storage CDN]
        AuditLog[(Administrative Audit Trail)]
    end

    PWA --> DOM
    DOM --> SW
    DOM --> Snake
    DOM <-->|ID Token Exchange| FirebaseAuth
    FirebaseAuth -->|Bearer Token| CookieEngine
    CookieEngine -->|Validate Session| Middleware
    Middleware --> RSC
    DOM -->|Mutations| ServerActions
    ServerActions --> FirebaseAdmin
    ServerActions --> LinkParser
    ServerActions --> SupabasePostgres
    ServerActions --> SupabaseStorage
    ServerActions --> CohortDispatcher
    CohortDispatcher -->|Targeted In-App Alerts| SupabasePostgres
    ServerActions --> AuditLog
```

### Architectural Highlights
1. **Server-Side Validation:** All write operations execute through strictly validated Server Actions (`'use server'`), ensuring authentication tokens, MIME types, and input sanitization execute server-side before persisting to the database.
2. **Dual-Layer Identity Federation:** Firebase manages authentication identity providers (Google OAuth & Email/Password), while Supabase PostgreSQL manages institutional attributes (University Student UID, `@cuchd.in` verification status, semester enrollment, and karma metrics).
3. **Hydration-Safe React 19 Components:** Pure client wrappers and deterministic client mount guards ensure 0 SSR/Client mismatch warnings across complex timers, animated docks, and snake game canvases.

---

## ⚡ Core Platform Modules

### 1. 🧭 Sleek Compact Navigation (~680px) & Live Exam Radar
* **Top Live Academic Radar Ribbon:** Displays active semester alerts with live pulsing radar dot (`🔴 CU Exam Radar // Odd Semester Active`) and embedded `<ExamCountdownTicker />` counting down days, hours, and minutes to the next exam (IST-1, PEST, EST).
* **Brand & Semester Compound:** `[>_ prevu / Sem 1 ▾]` allows one-click switching across all 8 semesters with local state synchronization.
* **Framer Motion Capsule Dock:** Sleek pill-shaped center navigation (`❪ Study Hub ▾ · CBT Arena ▾ · Reappear ▾ · Community · ⋯ ❫`) with spring-animated hover highlight (`layoutId="capsuleHighlight"`).
* **Integrated Actions Bar:** Global omni-search trigger (`[ 🔍 ⌘K ]`), smart notification alerts bell with live unread badge, admin console quick link, and gradient upload CTA.

### 2. 🛡️ Backlog Rescue Hub (Reappear Module)
Dedicated 4-pillar academic recovery suite for students sitting for remedial/reappear examinations:
* **Reappear PYQs & Solved Papers (`/reappear?tab=pyqs`):** High-frequency remedial exam papers with complete student derivation keys.
* **80/20 Reappear Crash Notes (`/reappear?tab=materials&filter=notes`):** One-night essential crash revision notes and high-yield formulas.
* **Reappear Questions Bank (`/reappear?tab=materials&filter=questions`):** Past remedial repeated questions organized by unit weighting.
* **Reappear Syllabus & Passing Plan (`/reappear?tab=materials&filter=syllabus`):** Unit-wise 24/60 pass threshold blueprint.
* **One-Click Remedial Upload:** Yellow accent action `[ ⇪ Upload Reappear Resource ]` that pre-selects the Reappear category and active semester.

### 3. 🌐 Multi-Modal Contribution Engine (`/upload`)
Students can contribute materials across 3 distinct contribution modalities:
* **Direct File Upload:** High-speed drag-and-drop PDF upload with client-side file size and MIME-type validation.
* **Google Drive Folders & Bundles:** Paste Google Drive links to share entire semester packages, topper note drives, and all-in-one bundles with automated link normalization and live metadata preview.
* **YouTube Video & Playlist Recommendations:** Curate top faculty lectures, NPTEL crash courses, or student video walkthroughs per subject with automated channel extraction and thumbnail preview.
* **Adaptive Resource Cards:** Resource listings dynamically render `Open in Google Drive ↗` or `Watch on YouTube ↗` buttons with matching brand badges.

### 4. 🐍 Interactive GitHub Contribution Snake Game
* **Autonomous AI Snake Mode:** Slithers continuously across the 48-column × 7-row academic commit heatmap, automatically hunting and eating green contribution squares (`#39d353` → `#0d1117`) and growing in length.
* **Playable Arcade Mode:** Lets students take manual control using Arrow Keys, WASD, or on-screen mobile D-Pad. Features toroidal screen wrap-around, score calculation, and persistent browser high scores.

### 5. 🎯 Prevu CBT Arena & Examination Simulator
* **High-Fidelity CBT Simulator:** Real-time exam practice environment replicating university Computer-Based Tests (Open Elective *Cyber Forensics & Digital Security* [FSO-307], Universal Human Values, Campus Aptitudes, and Core CS).
* **Configurable Parameters:** Students choose target question count and time limit (strictly enforced ceiling of 2 minutes/question).
* **Live Campus Leaderboard:** Dynamic student ranking with automatic upserting (reattempts immediately update with the student's latest score) to track study improvements over time.
* **Smart PDF-to-MCQ Parser:** Client-side regex engine that converts raw text and notes into structured single/multi-choice questions with options and explanations.

### 6. 🗄️ Academic Resource Vault
* **Multi-Dimensional Query Engine:** Dynamic filtering by Academic Year, Semester (1 to 8), Exam Type (MST-1, MST-2, EST), Branch (`BE-CSE`, `AIML`, `Data Science`, `BCA`, `MCA`), and keyword search.
* **In-Browser PDF Canvas:** Fast preview modal with zoom, fullscreen toggle, and dark-mode inverter, preventing unnecessary local file clutter.
* **Batch Downloader:** Built-in `JSZip` compression allows students to download entire semester revision packs with a single click.

### 7. 🔔 Smart Cohort Notification Engine
* **Targeted Peer Routing:** When a student posts an academic doubt or requests a question paper, the notification engine queries active users in the **same semester cohort** and inserts targeted notifications.
* **Live Unread Telemetry:** Navigation bell features reactive unread counter badges with polling fallback.

---

## 🗄️ Database Schema & Data Models

Prevu runs on a fully indexed PostgreSQL schema with strict foreign key constraints, Row Level Security (RLS), and automated cascading deletions:

```mermaid
erDiagram
    USERS ||--o{ RESOURCES : "uploads"
    USERS ||--o{ BOOKMARKS : "saves"
    USERS ||--o{ RESOURCE_UPVOTES : "upvotes"
    USERS ||--o{ PAPER_REQUESTS : "requests"
    USERS ||--o{ REQUEST_RESPONSES : "contributes"
    USERS ||--o{ STUDENT_NOTIFICATIONS : "receives"
    BRANCHES ||--o{ SUBJECTS : "contains"
    SUBJECTS ||--o{ RESOURCES : "classified_under"
    EXAM_TYPES ||--o{ RESOURCES : "categorized_by"
    PAPER_REQUESTS ||--o{ REQUEST_RESPONSES : "receives_help"

    USERS {
        text id PK
        text email
        text full_name
        text university_uid
        text role
        integer semester
        timestamp created_at
    }

    RESOURCES {
        uuid id PK
        text title
        text file_url
        text file_type
        integer semester
        uuid subject_id FK
        uuid exam_type_id FK
        text uploaded_by FK
        boolean is_approved
        boolean is_reappear
        text reappear_type
        text resource_link_type
        text external_url
        text youtube_video_id
        text thumbnail_url
        timestamp created_at
    }

    SUBJECTS {
        uuid id PK
        text name
        text code
        integer semester
        uuid branch_id FK
    }

    EXAM_TYPES {
        uuid id PK
        text name
        text code
    }

    STUDENT_NOTIFICATIONS {
        uuid id PK
        text user_id FK
        text title
        text message
        text type
        text link
        boolean is_read
        timestamp created_at
    }
```

---

## 🔒 Security & Privacy Posture

* **Zero Plaintext Credentials:** Authentication handled entirely by Firebase Auth; passwords never touch application servers.
* **Row Level Security (RLS):** Supabase database policies restrict write, update, and delete capabilities to verified resource owners and administrators.
* **Signed Storage Policies:** PDF uploads and image avatars are isolated in dedicated buckets with size and MIME validation (`application/pdf`, `image/*`).
* **PostgREST Query Sanitization:** Client-side search expressions undergo strict special character stripping (`[,()]`) to prevent SQL/PostgREST injection attacks.
* **Cookie Isolation:** Auth tokens are delivered inside encrypted, `HttpOnly`, `SameSite=Lax`, and `Secure` cookie jars.

---

## 📜 Platform Policies, Terms & Conditions

Prevu is committed to maintaining an ethical, transparent, and collaborative academic learning community. By accessing or using the Prevu platform, student tools, or services, all users agree to comply with the policies, terms, and codes of conduct outlined below.

### 1. 🤝 User Acceptance & Terms of Service (ToS)
* **Eligibility:** Prevu is intended primarily for students, scholars, researchers, and faculty members affiliated with Chandigarh University and collaborating academic institutions.
* **Account Responsibility:** Users are responsible for safeguarding their login credentials. Any activity originating from an authenticated account is the responsibility of that account holder.
* **Accuracy of Profile Details:** Students must provide accurate academic information (UID, semester enrollment, and branch) to facilitate proper cohort routing and verified contributor badging.

### 2. 🎓 Academic Integrity & Anti-Cheating Policy
* **Educational Purpose Only:** All resources, previous year question papers (PYQs), topper notes, syllabus blueprints, and CBT practice mocks available on Prevu are intended solely for preparation, revision, self-assessment, and academic research.
* **Strict Prohibition of Live Exam Leaking:** Students must **NEVER** upload, distribute, or request ongoing, live, or proctored question papers, midterm tests, or final examinations while an examination cycle is actively underway.
* **Zero Cheating Assistance:** Soliciting or providing real-time exam answers or proxy examination services through community requests is grounds for immediate account suspension.

### 3. 🎯 CBT Arena & Leaderboard Fair Play Policy
* **Honest Self-Assessment:** The Prevu CBT Arena is engineered to provide genuine examination practice under realistic time constraints. Users agree to attempt mock tests ethically without automated scripts or answer scrapers.
* **Leaderboard Governance:** Reattempting an exam updates the student's entry on the subject leaderboard with their **latest score and completion time** (upsert model). Automated botting to artificially inflate rankings will result in score invalidation.

### 4. 🛡️ Content Contribution, Moderation & Acceptable Use
* **Mandatory Administrative Audit:** All user-contributed question papers, Google Drive bundles, and study guides enter a moderation queue (`status: pending`) and require admin verification before public indexing.
* **Acceptable Content Guidelines:**
  * **Allowed:** Authentic previous year university question papers, self-authored lecture notes, formula sheets, open elective question banks, code snippets, and constructive doubt responses.
  * **Strictly Prohibited:** Commercial advertisements, malicious URLs, unverified leaked test material, or copyright-infringing commercial publications.

### 5. ⚖️ Intellectual Property, Copyright & Fair Use (DMCA)
* **Fair Use Doctrine:** Prevu operates under the principle of **Fair Dealing / Fair Use** (Section 52 of the Indian Copyright Act, 1957) for non-commercial educational instruction, personal study, and academic review.
* **Copyright Takedown Procedure:** Verified copyright holders can request takedowns by opening a GitHub Issue with resource identifiers. The administrative team will review and takedown verified infringing content within **24 to 48 hours**.

### 6. 🔐 Privacy, Identity & Data Autonomy (Right to be Forgotten)
* **No Sale of Student Data:** Prevu does not sell, rent, monetize, or broker student personal information to any third parties.
* **Self-Service Account Erasure:** Under the **Right to be Forgotten**, students can permanently delete their account and associated profile records at any time via Profile Settings with zero administrative lock-in.

### 7. 🏛️ Institutional Disclaimer & Limitation of Liability
* **Independent Student Initiative:** Prevu is an open-source, student-engineered academic platform developed independently by students. It is **not** an official entity, branch, or representative of the administrative board of Chandigarh University.
* **No Warranty:** All study materials, solutions, and CBT mock scores are provided on an **"as-is" and "as-available"** basis without warranty of any kind.

---

## 💻 Tech Stack Summary

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16.3.3](https://nextjs.org/) (App Router, Server Actions, Dynamic Streaming) |
| **Client Library** | [React 19.2.8](https://react.dev/) & React DOM |
| **Styling & CSS** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Design System |
| **Motion & Animations** | [Framer Motion 13](https://www.framer.com/motion/) (Gliding capsule dock & layout transitions) |
| **Iconography** | [Lucide React](https://lucide.dev/) |
| **Authentication** | [Firebase Client SDK 12.18](https://firebase.google.com/) & [Firebase Admin SDK 13.10](https://firebase.google.com/docs/admin/setup) |
| **Database & Storage** | [Supabase 2.112](https://supabase.com/) & [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs) |
| **Archive Compression** | [JSZip 3.10](https://stuk.github.io/jszip/) |
| **Analytics** | [Vercel Analytics 2.0](https://vercel.com/analytics) |
| **Language & Tooling** | [TypeScript 5.0](https://www.typescriptlang.org/), ESLint 9 |

---

## 🛠️ Local Development Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** `v18.18.0` or higher
* **npm** `v9.0.0` or higher (or `pnpm` / `yarn`)
* A configured **Supabase** project instance
* A configured **Firebase** project instance with Email/Password & Google Sign-In activated

### 2. Repository Cloning
```bash
git clone https://github.com/heysudhuu/prevu.git
cd prevu
```

### 3. Dependency Installation
```bash
npm install
```

### 4. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# ================================================================
# NEXT.JS APPLICATION CONFIGURATION
# ================================================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ================================================================
# FIREBASE AUTHENTICATION (CLIENT SDK)
# ================================================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# ================================================================
# FIREBASE ADMIN SDK (SERVER RUNTIME)
# ================================================================
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# ================================================================
# SUPABASE POSTGRESQL & OBJECT STORAGE
# ================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ================================================================
# SUPER ADMINISTRATOR PRIVILEGES
# ================================================================
SUPER_ADMIN_EMAIL=admin@cuchd.in
```

### 5. Running Development Server
```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### 6. Code Quality & Type Verification
Before submitting commits, run the automated verification suite:
```bash
# Verify TypeScript compile-time safety
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Validate production build bundle
npm run build
```

---

## 🚀 Deployment Guide

Prevu is fully optimized for single-click deployment on **Vercel** or **Netlify**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheysudhuu%2Fprevu)

1. Push your changes to GitHub.
2. Link your repository in [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Populate the Environment Variables in the project settings dashboard matching your `.env.local`.
4. Deploy!

---

## 👥 Contributing Guidelines

Prevu thrives because of contributions from students across all semesters. We welcome code contributions, UI/UX enhancements, and academic note donations.

1. **Fork** the project repository.
2. **Create your feature branch:**
   ```bash
   git checkout -b feature/SmartFlashcards
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'feat(flashcards): add active recall card deck for OS unit 2'
   ```
4. **Push to the remote branch:**
   ```bash
   git push origin feature/SmartFlashcards
   ```
5. **Open a Pull Request** describing your additions, test results, and UI screenshots.

---

## 📄 License & Attribution

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete details.

<div align="center">
  <br />
  <strong>Developed with ❤️ for the students of Chandigarh University.</strong><br />
  <sub>Not officially affiliated with Chandigarh University administration. Built independently as an open-source student initiative.</sub>
</div>
