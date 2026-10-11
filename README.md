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
  <strong>Prevu</strong> is an open-source, student-engineered academic management ecosystem designed to consolidate, index, and distribute verified examination materials, topper study references, curriculum blueprints, and real-time peer doubt-solving for undergraduate engineering students.
</p>

<p align="center">
  <a href="#-executive-summary">Executive Summary</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-core-platform-modules">Core Modules</a> •
  <a href="#-data-models--schema">Database Schema</a> •
  <a href="#-security--privacy-posture">Security</a> •
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
* **Smart Cohort Dispatch:** Doubts and missing paper requests automatically ping batchmates enrolled in the corresponding semester.
* **Institutional Verification Pipeline:** Submissions undergo rigorous administrative auditing before publication to eliminate spam, hallucinated solutions, and irrelevant materials.
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
    end

    subgraph PersistenceLayer [Data & Storage Tier]
        SupabasePostgres[(Supabase PostgreSQL 15)]
        SupabaseStorage[Encrypted Asset Storage CDN]
        AuditLog[(Administrative Audit Trail)]
    end

    PWA --> DOM
    DOM --> SW
    DOM <-->|ID Token Exchange| FirebaseAuth
    FirebaseAuth -->|Bearer Token| CookieEngine
    CookieEngine -->|Validate Session| Middleware
    Middleware --> RSC
    DOM -->|Mutations| ServerActions
    ServerActions --> FirebaseAdmin
    ServerActions --> SupabasePostgres
    ServerActions --> SupabaseStorage
    ServerActions --> CohortDispatcher
    CohortDispatcher -->|Targeted In-App Alerts| SupabasePostgres
    ServerActions --> AuditLog
```

### Architectural Highlights
1. **Server-Side Validation:** All write operations execute through strictly validated Server Actions (`'use server'`), ensuring authentication tokens, MIME types, and input sanitization execute server-side before persisting to the database.
2. **Dual-Layer Identity Federation:** Firebase manages authentication identity providers (Google OAuth & Email/Password), while Supabase PostgreSQL manages institutional attributes (University Student UID, `@cuchd.in` verification status, semester enrollment, and karma metrics).
3. **Optimistic UI with Dirty State Detection:** Complex views—such as the Digital Student ID Form and Exam Countdown Ticker—utilize client-side reactive states with dirty-checking to prevent data loss.

---

## ⚡ Core Platform Modules

### 1. 🗂️ Academic Resource Vault
* **Multi-Dimensional Query Engine:** Dynamic filtering by Academic Year, Semester (1 to 8), Exam Type (MST-1, MST-2, EST), Branch (`BE-CSE`, `AIML`, `Data Science`, `BCA`, `MCA`), and keyword search with PostgREST query sanitization.
* **In-Browser PDF Canvas:** Fast preview modal with zoom, fullscreen toggle, and dark-mode inverter, preventing unnecessary local file clutter.
* **Batch Downloader:** Built-in `JSZip` compression allows students to download entire semester revision packs with a single click.

### 2. 🔔 Smart Cohort Notification Engine
* **Targeted Peer Routing:** When a student posts an academic doubt or requests a question paper, the notification engine queries active users in the **same semester cohort** and inserts targeted notifications.
* **Live Unread Telemetry:** Navigation bell features reactive unread counter badges with polling fallback.
* **Student Quiet Hours & Preferences:** Students maintain granular control over countdown alerts and doubt pings directly from their settings modal.

### 3. 🪪 Digital Student ID & Academic Profile
* **Dual Identity System:** Clear separation between Firebase authentication email and institutional `@cuchd.in` campus email.
* **Reactive Curriculum Deck:** Automatically displays standard university course modules for the student's selected semester.
* **Username Governance:** Implements rate-limiting and quota tracking (maximum 3 username modifications per account lifetime) to prevent impersonation.

### 4. 🤝 Community Request & Bounty Board
* **Request Lifecycle:** Requests transition across `open` → `in_review` → `fulfilled`.
* **Peer Contribution:** Any registered batchmate can upload files, paste reference URLs, or write comprehensive step-by-step solutions.
* **Karma & Badging:** Contributors earn upvotes, verified scholar tags, and positions on the University Contributor Leaderboard.

### 5. 🛡️ Department Moderation Portal
* **Role-Based Access Control (RBAC):** Verified administrative routes protected at middleware and database levels.
* **Multi-Stage Moderation:** Admin Department reviews student submissions before public listing to verify PDF readability and subject alignment.
* **Audit Trail:** All approval, modification, and deletion events are immutably logged with admin identifiers.

### 6. ⚠️ Danger Zone & Privacy Autonomy
* **Right to be Forgotten:** Provides self-service account deletion directly in the profile settings.
* **Structured Exit Feedback:** Captures departure reasons (*Graduated*, *Exams Concluded*, *Privacy Concerns*, etc.) for product metrics.
* **Explicit Confirmation Guard:** Requires confirmation phrase matching (`DELETE`) before executing transactional cascading deletions across database and authentication providers.

---

## 🗄️ Database Schema & Data Models

Prevu runs on a fully indexed PostgreSQL schema with strict foreign key constraints and automated cascading deletions:

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
        text name
        text username UK
        text email UK
        text student_uid
        text branch
        integer current_semester
        text avatar_url
        boolean cu_verified
        text cu_email
        text role
        integer username_changes_left
        timestamp created_at
    }

    RESOURCES {
        uuid id PK
        integer subject_id FK
        integer exam_type_id FK
        integer exam_year
        text file_path
        text file_type
        text status
        text uploaded_by FK
        integer upvote_count
        timestamp created_at
    }

    PAPER_REQUESTS {
        serial id PK
        text requested_by FK
        text subject_name
        text exam_type
        integer exam_year
        integer semester
        text request_type
        text note
        text status
        integer upvotes
        timestamp created_at
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

## 💻 Tech Stack Summary

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16.3.3](https://nextjs.org/) (App Router, Server Actions, Dynamic Streaming) |
| **Client Library** | [React 19.2.8](https://react.dev/) & React DOM |
| **Styling & CSS** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Design System |
| **Motion & 3D** | [Framer Motion 13](https://www.framer.com/motion/), [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) |
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
