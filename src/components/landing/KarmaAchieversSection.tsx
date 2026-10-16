import React from 'react'
import Link from 'next/link'
import { Trophy, Award, Sparkles, ArrowRight, Flame, ShieldCheck, CheckCircle2, Star } from 'lucide-react'
import { getLeaderboard, LeaderboardUser } from '@/app/leaderboard/actions'
import { CollaboratorBadge, CollaboratorAvatar } from '@/components/ui/CollaboratorBadge'
import { Button } from '@/components/ui/Button'

export default async function KarmaAchieversSection() {
  const allContributors = await getLeaderboard()

  // Default fallback contributors if table is empty
  const fallbackContributors: LeaderboardUser[] = [
    {
      id: 'mock-1',
      name: 'Yashasvi Dabas',
      username: 'yashasvee',
      branch: 'BE-CSE',
      cu_verified: true,
      role: 'student',
      approvedUploads: 3,
      karma: 90,
      badge: { title: 'Vault Guardian', color: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30', icon: '🛡️' }
    },
    {
      id: 'mock-2',
      name: 'Sudhanshu Yadav',
      username: 'sudhu',
      branch: 'BE-CSE',
      cu_verified: true,
      role: 'student',
      approvedUploads: 2,
      karma: 65,
      badge: { title: 'Bounty Hunter', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', icon: '⚡' }
    },
    {
      id: 'mock-3',
      name: '6 Sigma',
      username: 'py77164961',
      branch: 'BE-CSE',
      cu_verified: false,
      role: 'student',
      approvedUploads: 2,
      karma: 50,
      badge: { title: 'Bounty Hunter', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', icon: '⚡' }
    }
  ]

  const contributors = allContributors.length > 0 ? allContributors.slice(0, 4) : fallbackContributors
  const topOne = contributors[0]
  const otherRankers = contributors.slice(1, 4)

  return (
    <section className="py-20 bg-gradient-to-b from-prevu-bg via-[#0c0c14] to-prevu-bg border-b border-prevu-surface-light relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -z-10 h-[350px] w-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 -z-10 h-[350px] w-[500px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Hall of Fame</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Top Karma Achievers &amp; Collaborators
            </h2>
            <p className="text-xs sm:text-sm text-prevu-text-muted mt-1 max-w-2xl leading-relaxed">
              Recognizing the outstanding students who upload exam papers, share verified notes, and help peers ace assessments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-prevu-accent hover:text-white transition-colors py-1.5 px-3 rounded-xl bg-prevu-surface border border-prevu-surface-light hover:border-prevu-accent/40 shadow-sm"
            >
              <span>View Full Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Podium Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-10">
          
          {/* Rank 1 Feature Card (Takes 5 columns) */}
          {topOne && (
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-amber-950/30 via-prevu-surface to-prevu-surface border-2 border-amber-500/50 shadow-2xl shadow-amber-950/20 relative flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/30 flex items-center gap-1">
                    <span>👑</span>
                    <span>#1 Campus Leader</span>
                  </span>
                  <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    MVP Contributor
                  </span>
                </div>

                <div className="flex items-center gap-4 my-4">
                  <CollaboratorAvatar 
                    name={topOne.name}
                    karma={topOne.karma}
                    rank={1}
                    isVerified={topOne.cu_verified}
                    size={64}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      <span>@{topOne.username}</span>
                      {topOne.cu_verified && (
                        <span title="CU Verified">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-prevu-text-muted mt-0.5">{topOne.name}</p>
                    <div className="mt-2">
                      <CollaboratorBadge karma={topOne.karma} rank={1} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-prevu-bg/70 border border-prevu-surface-light text-center">
                  <div>
                    <span className="text-2xl font-extrabold text-amber-300 font-mono block">
                      {topOne.karma}
                    </span>
                    <span className="text-[10px] font-mono text-prevu-text-muted uppercase">Karma Points</span>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-white font-mono block">
                      {topOne.approvedUploads}
                    </span>
                    <span className="text-[10px] font-mono text-prevu-text-muted uppercase">Papers Archived</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-prevu-surface-light/60 flex items-center justify-between text-xs">
                <span className="text-prevu-text-muted font-mono text-[11px]">Department: {topOne.branch || 'BE-CSE'}</span>
                <Link
                  href={`/browse?search=${encodeURIComponent(topOne.username)}`}
                  className="text-amber-400 hover:text-white font-semibold flex items-center gap-1"
                >
                  <span>View Contributions</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Other Top Collaborators (Takes 7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              {otherRankers.map((user, idx) => {
                const rankNumber = idx + 2
                return (
                  <div
                    key={user.id}
                    className="p-4 sm:p-5 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-prevu-accent/50 shadow-md hover:shadow-xl transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center justify-center w-8 text-center font-mono font-bold text-sm text-prevu-text-muted group-hover:text-white">
                        #{rankNumber}
                      </div>

                      <CollaboratorAvatar 
                        name={user.name}
                        karma={user.karma}
                        rank={rankNumber}
                        isVerified={user.cu_verified}
                        size={46}
                      />

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white group-hover:text-prevu-accent transition-colors">
                            @{user.username}
                          </span>
                          {user.cu_verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-prevu-text-muted">{user.name}</span>
                          <span className="text-prevu-surface-light">•</span>
                          <span className="text-[11px] font-mono text-purple-300">
                            {user.approvedUploads} papers shared
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <CollaboratorBadge karma={user.karma} rank={rankNumber} size="sm" />
                      <div className="text-xs font-mono font-bold text-white mt-1">
                        {user.karma} pts
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Motivation Banner for New Users */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-prevu-surface to-purple-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Want your profile badge in the Hall of Fame?
                  </h4>
                </div>
                <p className="text-[11px] text-prevu-text-muted leading-relaxed">
                  Earn <strong className="text-amber-400">+50 Karma</strong> per approved paper, answer bounties, and climb the university rankings.
                </p>
              </div>

              <Button size="sm" className="bg-prevu-accent hover:bg-prevu-accent-hover text-white text-xs font-bold shrink-0 shadow-md shadow-purple-600/30" asChild>
                <Link href="/upload">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Upload &amp; Earn Karma
                </Link>
              </Button>
            </div>

          </div>
        </div>

        {/* Live Karma Points Scoring Formula Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-300 flex items-center justify-center font-bold text-sm shrink-0">📄</span>
            <div>
              <span className="font-bold text-white block">+50 Karma</span>
              <span className="text-[10px] text-prevu-text-muted">Approved Exam Paper</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-cyan-500/15 text-cyan-300 flex items-center justify-center font-bold text-sm shrink-0">📚</span>
            <div>
              <span className="font-bold text-white block">+25 Karma</span>
              <span className="text-[10px] text-prevu-text-muted">Handwritten Notes</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">🤝</span>
            <div>
              <span className="font-bold text-white block">+25 Karma</span>
              <span className="text-[10px] text-prevu-text-muted">Peer Bounty Answered</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">🛡️</span>
            <div>
              <span className="font-bold text-white block">+15 Karma</span>
              <span className="text-[10px] text-prevu-text-muted">CU Email Verified</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
