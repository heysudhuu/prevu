'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Building2, 
  Sparkles, 
  Layers, 
  FileArchive, 
  CheckCircle2, 
  Calculator, 
  Bell, 
  Flame, 
  ArrowRight,
  TrendingUp,
  HeartHandshake
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function UpcomingFeaturesRoadmap() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [voted, setVoted] = useState(false)

  const upcomingDepartments = [
    { id: 'ECE', name: 'Electronics & Comm. (ECE)', icon: '⚡', progress: '80% Collected' },
    { id: 'ME', name: 'Mechanical Engineering (ME)', icon: '⚙️', progress: '65% Collected' },
    { id: 'CIVIL', name: 'Civil Engineering (CE)', icon: '🏗️', progress: '60% Collected' },
    { id: 'BIOTECH', name: 'Biotechnology (BT)', icon: '🧬', progress: '50% Collected' },
    { id: 'BCA_MCA', name: 'BCA / MCA Computer Apps', icon: '💻', progress: '75% Collected' },
    { id: 'MGMT', name: 'USB - MBA & BBA Management', icon: '📈', progress: '55% Collected' },
    { id: 'PHARMACY', name: 'UIPS - Pharmacy & Pharma', icon: '💊', progress: '45% Collected' },
    { id: 'LAW_AHS', name: 'UILS Law & Allied Health', icon: '⚖️', progress: '40% Collected' },
  ]

  const upcomingFeatures = [
    {
      icon: Building2,
      tag: 'Next Major Update',
      title: 'Multi-Department & All-Branch Vault',
      description: 'Expanding beyond BE-CSE to ECE, Mechanical, Civil, Biotech, Management, Pharmacy, and Computer Applications.',
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400'
    },
    {
      icon: FileArchive,
      tag: 'Convenience',
      title: '1-Click Semester Question Paper ZIP Bundle',
      description: 'Download all MST-1, MST-2, and EST question papers for an entire semester in a single organized ZIP folder.',
      color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400'
    },
    {
      icon: CheckCircle2,
      tag: 'High Demand',
      title: 'Verified Solutions & Numerical Answer Keys',
      description: 'Step-by-step verified handwritten and typed answers for tough mathematics, algorithmic, and coding questions.',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400'
    },
    {
      icon: Flame,
      tag: 'Smart Study',
      title: 'PYQ Question Predictor & Frequency Heatmap',
      description: 'See which 5-mark and 10-mark questions and syllabus units are repeated most frequently across 2021–2026 exams.',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400'
    },
    {
      icon: Calculator,
      tag: 'Academic Planner',
      title: 'CU CGPA / SGPA Target Calculator',
      description: 'Calculate the exact EST marks you need based on your MST-1 and MST-2 internal assessment to score your dream GPA.',
      color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400'
    },
    {
      icon: Bell,
      tag: 'Real-Time Alerts',
      title: 'Exam Countdown & Telegram/WhatsApp Pings',
      description: 'Get notified 24 hours before your MST and EST exams with direct 1-click links to the relevant subject revision papers.',
      color: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400'
    }
  ]

  const handleBranchVote = (branchId: string) => {
    setSelectedBranch(branchId)
    setVoted(true)
  }

  return (
    <section className="py-24 bg-gradient-to-b from-prevu-bg via-prevu-surface/40 to-prevu-bg border-t border-prevu-surface-light relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 space-y-16">
        
        {/* ========================================================================= */}
        {/* 1. SPECIAL CALLOUT BANNER: EXPANDING TO ALL DEPARTMENTS */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-purple-950/40 via-prevu-surface to-indigo-950/40 border border-purple-500/40 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>To All Chandigarh University Students</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Currently focusing on BE-CSE — but <span className="text-gradient-purple">more branches are arriving soon!</span>
              </h2>

              <p className="text-sm text-prevu-text-muted leading-relaxed">
                Don&apos;t be sad if you&apos;re not from Computer Science! We are student volunteers actively digitizing, verifying, and gathering question papers for <strong>ECE, Mechanical, Civil, Biotech, Management, Pharmacy, and Computer Applications</strong>. We are working hard so every single student at CU has free access to exam prep.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Button size="lg" className="text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/25" asChild>
                <Link href="/upload">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Contribute Your Branch Papers</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-xs sm:text-sm font-semibold border-purple-500/30 hover:border-purple-500 text-purple-300" asChild>
                <Link href="/dashboard?tab=requests">
                  <span>Request Missing Papers</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>

          </div>

          {/* Department Pipeline Chips & Voting */}
          <div className="mt-8 pt-6 border-t border-purple-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Upcoming Department Vault Pipeline</span>
              </span>
              <span className="text-[11px] text-prevu-text-muted">
                {voted ? '✓ Vote recorded! We are prioritizing your branch.' : 'Click your branch to prioritize its launch'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {upcomingDepartments.map((dept) => {
                const isSelected = selectedBranch === dept.id
                return (
                  <button
                    key={dept.id}
                    onClick={() => handleBranchVote(dept.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-400 text-white shadow-md shadow-purple-500/20 scale-[1.02]'
                        : 'bg-prevu-bg/70 border-prevu-surface-light hover:border-purple-500/40 text-prevu-text-muted hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{dept.icon}</span>
                      <span className="text-[10px] font-mono text-purple-300 font-semibold bg-purple-500/15 px-1.5 py-0.5 rounded">
                        {dept.progress}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {dept.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. UPCOMING FEATURES & ROADMAP SHOWCASE */}
        {/* ========================================================================= */}
        <div className="space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Prevu Roadmap & What&apos;s Coming Next</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Exciting features we are building for you
            </h2>

            <p className="text-sm text-prevu-text-muted leading-relaxed">
              We are constantly innovating to build the ultimate study companion for Chandigarh University students. Here is a sneak peek at our upcoming updates:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full border-prevu-surface-light bg-gradient-to-b from-prevu-surface to-prevu-surface/80 hover:border-purple-500/40 transition-all shadow-xl flex flex-col justify-between p-6 rounded-3xl">
                    <CardContent className="p-0 space-y-4">
                      
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center border shadow-md`}>
                          <Icon className="w-6 h-6" />
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-prevu-surface-light text-prevu-text-muted border border-prevu-surface-light/80 uppercase">
                          {feature.tag}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-prevu-text-muted leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
