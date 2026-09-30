import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import PrevuMascot from "@/components/animations/PrevuMascot";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-prevu-bg text-prevu-text">
        {children}
        <PWAProvider />
        <SiteAnalyticsTracker />
        <PrevuMascot />
        <AuthListener />
        <Analytics />
      </body>
    </html>
  );
}
