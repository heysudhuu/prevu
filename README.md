<div align="center">

# 🎓 Prevu
### Chandigarh University • BE-CSE Digital Academic Vault & Peer Network

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Security-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

<p align="center">
  <strong>Study Smarter. Together.</strong><br>
  Prevu is the student-built academic engine for Chandigarh University (BE-CSE), connecting students with verified previous year question papers (PYQs), topper study material, exam blueprints, and real-time peer doubt-solving.
</p>

[Explore Vault](https://prevu.vercel.app) • [Request Papers](https://prevu.vercel.app/requests) • [View Directory](https://prevu.vercel.app/subjects)

---

</div>

## 📖 Table of Contents
- [What is Prevu?](#-what-is-prevu)
- [Why We Built It](#-why-we-built-it)
- [What We Serve](#-what-we-serve)
- [How We Serve (Architecture & Technology)](#-how-we-serve-architecture--technology)
- [Key Features Breakdown](#-key-features-breakdown)
- [Project Architecture & Directory Layout](#-project-architecture--directory-layout)
- [Getting Started Locally](#-getting-started-locally)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 What is Prevu?

**Prevu** is a modern, student-driven academic platform custom-tailored for the **Bachelor of Engineering in Computer Science (BE-CSE)** community at **Chandigarh University**. 

Instead of searching through fragmented WhatsApp groups, expired Telegram channels, and chaotic Google Drive folders the night before exams, Prevu serves as the central campus command center:
1. **Find Any Paper in Seconds:** Filter question papers by Semester (1 through 8), Exam Type (MST-1, MST-2, End-Term), Academic Year, and Branch specialization.
2. **Crowdsource Peer Help:** Post academic doubts or request missing papers, getting answers directly from fellow batchmates and seniors.
3. **Verified Knowledge:** Every contribution undergoes moderation through the Admin Department to ensure clarity, correctness, and authenticity.

---

## 🎯 Why We Built It

Every semester, thousands of engineering students at Chandigarh University face the same hurdles:
* **Scattered Resources:** Important PYQs and lecture notes are trapped across hundreds of private chat groups.
* **Bad Quality Scans:** Unreadable phone photographs of papers circulated minutes before exam hall entry.
* **Campus Wi-Fi Reliability:** Slow connections during exam days make heavy file drives impossible to open.
* **Lack of Context:** Question papers without syllabus tags or marking blueprints leave students guessing which questions frequently repeat.

**Prevu was created to solve this permanently.** We democratize academic materials so that every student—regardless of whether they have senior connections or topper notes—has equal access to top-tier preparation material.

---

## 📦 What We Serve

| Resource Category | Description | Coverage |
| :--- | :--- | :--- |
| **Previous Year Papers (PYQs)** | High-resolution PDF scans of MST-1, MST-2, and EST examinations. | Semesters 1 to 8 (Core & Electives) |
| **Curriculum Blueprints** | Question distribution patterns, unit marks breakdown, and high-frequency topics. | Core BE-CSE Syllabus |
| **Topper Notes & Handouts** | Handwritten notes, formula cheat-sheets, and lab manual references. | Branch specializations (AI/ML, DS, Cloud) |
| **Peer Doubt Hub** | Collaborative Q&A threads where batchmates share verified answers. | All registered students |
| **Offline Study Vault** | In-browser caching and batch downloads for offline exam prep. | Desktop & Mobile PWA |

---

## ⚙️ How We Serve (Architecture & Technology)

Prevu is engineered on a modern, reactive stack designed for sub-second page loads and high reliability:

```mermaid
graph TD
    Client[Next.js 16 Client / PWA] -->|Server Actions / RSC| NextServer[Next.js App Router Server]
    Client -->|Client SDK Auth| FirebaseClient[Firebase Auth Client]
    NextServer -->|Verify Session JWT| FirebaseAdmin[Firebase Admin SDK]
    NextServer -->|Postgres SQL / RLS| SupabaseDB[(Supabase PostgreSQL)]
    NextServer -->|Asset Storage CDN| SupabaseStorage[Supabase Cloud Storage]
    NextServer -->|Cohort Alerts| NotificationEngine[Smart Notification Engine]
    NotificationEngine -->|Targeted Pings| Batchmates[Enrolled Batchmates Inbox]
```

### 🛠️ Core Technology Stack

* **Frontend Framework:** [Next.js 16](https://nextjs.org/) (App Router with React Server Components)
* **UI Library:** [React 19](https://react.dev/)
* **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/) with custom glassmorphic tokens and dark mode palette
* **Animations & Micro-interactions:** [Framer Motion 13](https://www.framer.com/motion/) & Three.js ([@react-three/fiber](https://docs.pmnd.rs/react-three-fiber))
* **Database & Persistence:** [Supabase](https://supabase.com/) (Managed PostgreSQL, Row Level Security, relational triggers)
* **Storage:** Supabase Storage (Secure PDF and avatar buckets with public CDN)
* **Authentication:** [Firebase Authentication](https://firebase.google.com/) (Email/Password, Google OAuth, session cookies, and `@cuchd.in` campus email verification)
* **Icons & Assets:** [Lucide React](https://lucide.dev/)

---

## ✨ Key Features Breakdown

### 1. 🪪 Digital Student ID Card & Academic Profile
* Real-time interactive identity card with photo upload.
* Separates **Login Identity** from **University Identity** with optional `@cuchd.in` email linking.
* Dynamic **Semester Curriculum Deck** previewing current subjects.
* Enforces fair username modification quotas (max 3 edits).

### 2. 🔔 Smart Cohort-Based Notifications
* When a student asks a doubt or requests a question paper, Prevu's notification engine **automatically targets enrolled batchmates in the exact same semester**.
* Header notification bell with live unread counter badges and instant *"Mark All as Read"* controls.
* Respects quiet controls and custom student preferences.

### 3. 🤝 Community Request & Bounty Board
* Searchable board for missing question papers and student doubts.
* Batchmates can upload solutions or files, which are verified by the Admin Department before public publication.
* Earns contributor Karma and Hall of Fame recognition.

### 4. 🎓 Welcome Family Onboarding
* Personalized welcome alerts upon account registration.
* Celebratory first-visit modal highlighting core academic pillars.
* Dismissible dashboard quick-action banner directing students straight to their semester PYQs.

### 5. ⚠️ Danger Zone & Student Data Autonomy
* Complete user agency over their profile with an interactive departure modal.
* Collects anonymous feedback reasons (*Graduated*, *Found materials*, *Privacy*, etc.).
* Enforces explicit confirmation challenge (`DELETE`) and cleanly cascades data across Supabase and Firebase.

---

## 📂 Project Architecture & Directory Layout

```
Prevu/
├── src/
│   ├── app/                        # Next.js 16 App Router Pages & Actions
│   │   ├── admin/                  # Department Moderation Portal
│   │   ├── browse/                 # Multi-filter Question Paper Explorer
│   │   ├── dashboard/              # Student Academic Workspace & Stats
│   │   ├── exam-prep/              # MST & EST Countdown Readiness Gauge
│   │   ├── profile/                # Digital Student ID & Danger Zone Actions
│   │   ├── requests/               # Community Requests & Doubt Board
│   │   ├── upload/                 # Student Contribution Flow
│   │   ├── vault/                  # Offline Resource Cache & PWA
│   │   └── layout.tsx              # Global Theme & Navigation Layout
│   ├── components/                 # Modular Design System
│   │   ├── auth/                   # Authentication forms & Sign-in modals
│   │   ├── community/              # Doubt boards & peer rating widgets
│   │   ├── dashboard/              # Welcome modals, banners & exam tickers
│   │   ├── notifications/          # SmartExamAlertsModal & unread badge
│   │   ├── profile/                # ProfileForm & DeleteAccountModal
│   │   └── ui/                     # Cards, Buttons, and Inputs
│   ├── lib/                        # Core Utilities & SDK Providers
│   │   ├── firebase/               # Client and Admin Firebase instances
│   │   ├── notifications.ts        # Smart cohort dispatch engine
│   │   └── auth/                   # Role-based access control (RBAC)
│   └── utils/
│       └── supabase/               # Supabase SSR and Admin database clients
├── public/                         # Static icons, banners, and PWA assets
├── package.json                    # Dependencies and build scripts
└── README.md                       # Repository Documentation
```

---

## 🚀 Getting Started Locally

Follow these steps to set up Prevu on your local machine:

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (version 18.18 or higher recommended)
* `npm` or `pnpm`
* A [Supabase](https://supabase.com/) project
* A [Firebase](https://firebase.google.com/) project with Authentication enabled

### 2. Clone the Repository
```bash
git clone https://github.com/heysudhuu/prevu.git
cd prevu
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory and populate it with your credentials:

```env
# Next.js Public Config
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Supabase Database & Storage
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Super Admin Authorization
SUPER_ADMIN_EMAIL=your_admin_email@cuchd.in
```

### 5. Run the Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore Prevu.

---

## 🤝 Contributing

Prevu is built **by students, for students**. Contributions are enthusiastically welcomed!

1. **Fork the Repository**
2. **Create a Feature Branch:** `git checkout -b feature/AmazingFeature`
3. **Commit your Changes:** `git commit -m 'feat: Add amazing student feature'`
4. **Push to the Branch:** `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for the students of Chandigarh University.</sub>
</div>
