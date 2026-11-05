import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AuthListener from "@/components/auth/AuthListener";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prevu | BE-CSE Exam Resources",
  description: "Student-run repository of Previous Year Questions (PYQs), notes, and exam-pattern references for BE-CSE at Chandigarh University.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-512.svg",
    apple: "/icon-512.svg",
  },
};

import { Analytics } from "@vercel/analytics/next";
import { SiteAnalyticsTracker } from "@/components/analytics/SiteAnalyticsTracker";
import PWAProvider from "@/components/pwa/PWAProvider";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import GlobalCommandPalette from "@/components/search/GlobalCommandPalette";
import GlobalAcademicChatbot from "@/components/ai/GlobalAcademicChatbot";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('prevu-theme')||'terminal-git';document.documentElement.className=document.documentElement.className.replace(/\\btheme-\\S+/g,'').trim();document.documentElement.classList.add('theme-'+t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#010409] text-[#e6edf3] pb-16 md:pb-0 relative">
        {children}
        <GlobalCommandPalette />
        <MobileBottomNav />
        <PWAProvider />
        <SiteAnalyticsTracker />
        <GlobalAcademicChatbot />
        <AuthListener />
        <Analytics />
      </body>
    </html>
  );
}
