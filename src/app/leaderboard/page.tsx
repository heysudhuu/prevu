import Header from '@/components/Header'
import { getLeaderboard } from './actions'
import { Trophy, Medal, Sparkles, CheckCircle, ArrowRight, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const contributors = await getLeaderboard()
  const topThree = contributors.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg">
      <Header />

      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-5xl space-y-10">
          
          {/* Header Banner */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25">
              <Trophy className="w-3.5 h-3.5" />
              <span>Campus Contributor Hall of Fame</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Top Student Contributors
            </h1>

            <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
              Recognizing the students who help peers ace exams by archiving previous year papers, Blueprints, and solutions.
            </p>
          </div>

          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              {/* Rank 2 (Silver) */}
              {topThree[1] ? (
                <div className="p-6 rounded-3xl bg-prevu-surface border border-prevu-surface-light shadow-xl flex flex-col items-center text-center space-y-3 relative order-2 md:order-1 self-end md:min-h-[320px] justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-400/15 border border-zinc-400/30 flex items-center justify-center text-zinc-300 text-xl font-bold font-mono">
                    #2
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                      <span>@{topThree[1].username}</span>
                      {topThree[1].cu_verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </h3>
                    <p className="text-xs text-prevu-text-muted">{topThree[1].name}</p>
                  </div>
                  <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${topThree[1].badge.color}`}>
                    {topThree[1].badge.icon} {topThree[1].badge.title}
                  </div>
                  <div className="pt-1 text-xs font-mono text-zinc-400">
                    <strong className="text-white text-sm">{topThree[1].approvedUploads}</strong> papers uploaded • <strong className="text-amber-400">{topThree[1].karma}</strong> pts
                  </div>
                  {topThree[1].contributions && topThree[1].contributions.length > 0 && (
                    <div className="pt-2 flex flex-wrap justify-center gap-1.5 w-full">
                      {topThree[1].contributions.slice(0, 2).map((paper) => (
                        <span key={paper.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                          <FileText className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{paper.title}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : <div className="hidden md:block order-1" />}

              {/* Rank 1 (Gold) */}
              {topThree[0] && (
                <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-950/30 via-prevu-surface to-prevu-surface border-2 border-amber-500/50 shadow-2xl shadow-amber-950/30 flex flex-col items-center text-center space-y-3.5 relative order-1 md:order-2 md:-translate-y-4 md:min-h-[350px] justify-center">
                  <div className="absolute -top-3 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black shadow-lg">
                    Semester MVP
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-2xl font-bold font-mono">
                    👑
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
                      <span>@{topThree[0].username}</span>
                      {topThree[0].cu_verified && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    </h3>
                    <p className="text-xs text-prevu-text-muted">{topThree[0].name}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${topThree[0].badge.color}`}>
                    {topThree[0].badge.icon} {topThree[0].badge.title}
                  </div>
                  <div className="pt-1 text-xs font-mono text-prevu-text-muted">
                    <strong className="text-white text-base">{topThree[0].approvedUploads}</strong> papers uploaded • <strong className="text-amber-300 text-base">{topThree[0].karma}</strong> pts
                  </div>
                  {topThree[0].contributions && topThree[0].contributions.length > 0 && (
                    <div className="pt-2 flex flex-wrap justify-center gap-1.5 w-full">
                      {topThree[0].contributions.slice(0, 2).map((paper) => (
                        <span key={paper.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-200">
                          <FileText className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{paper.title}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] ? (
                <div className="p-6 rounded-3xl bg-prevu-surface border border-prevu-surface-light shadow-xl flex flex-col items-center text-center space-y-3 relative order-3 self-end md:min-h-[300px] justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-800/15 border border-amber-700/30 flex items-center justify-center text-amber-600 text-xl font-bold font-mono">
                    #3
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                      <span>@{topThree[2].username}</span>
                      {topThree[2].cu_verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </h3>
                    <p className="text-xs text-prevu-text-muted">{topThree[2].name}</p>
                  </div>
                  <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${topThree[2].badge.color}`}>
                    {topThree[2].badge.icon} {topThree[2].badge.title}
                  </div>
                  <div className="pt-1 text-xs font-mono text-amber-600">
                    <strong className="text-white text-sm">{topThree[2].approvedUploads}</strong> papers uploaded • <strong className="text-amber-400">{topThree[2].karma}</strong> pts
                  </div>
                  {topThree[2].contributions && topThree[2].contributions.length > 0 && (
                    <div className="pt-2 flex flex-wrap justify-center gap-1.5 w-full">
                      {topThree[2].contributions.slice(0, 2).map((paper) => (
                        <span key={paper.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-900/20 border border-amber-700/40 text-amber-200">
                          <FileText className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{paper.title}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : <div className="hidden md:block order-3" />}
            </div>
          )}

          {/* Full Table */}
          <div className="p-5 sm:p-6 rounded-3xl bg-prevu-surface border border-prevu-surface-light shadow-xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Medal className="w-4 h-4 text-prevu-accent" />
              All Ranked Contributors
            </h2>

            {contributors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-prevu-surface-light text-prevu-text-muted uppercase text-[10px] tracking-wider font-mono">
                      <th className="pb-3 px-2">Rank</th>
                      <th className="pb-3 px-4">Student &amp; Contributed Papers</th>
                      <th className="pb-3 px-4">Branch</th>
                      <th className="pb-3 px-4">Badge</th>
                      <th className="pb-3 px-4 text-right">Papers</th>
                      <th className="pb-3 px-4 text-right">Karma</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-prevu-surface-light/60">
                    {contributors.map((c, index) => (
                      <tr key={c.id} className="hover:bg-prevu-surface-light/40 transition-colors">
                        <td className="py-3.5 px-2 font-mono font-bold text-prevu-text-muted align-top">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white">@{c.username}</span>
                            {c.cu_verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <p className="text-[11px] text-prevu-text-muted">{c.name}</p>

                          {/* Contributed Materials / PYQs under username */}
                          {c.contributions && c.contributions.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {c.contributions.map((paper) => (
                                <Link
                                  key={paper.id}
                                  href={`/browse?search=${encodeURIComponent(paper.subject)}`}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-prevu-bg/90 border border-prevu-surface-light hover:border-prevu-accent/50 text-zinc-300 hover:text-white transition-colors group/item"
                                  title={`${paper.title} • ${paper.subject}`}
                                >
                                  <FileText className="w-2.5 h-2.5 text-prevu-accent/80 group-hover/item:text-prevu-accent shrink-0" />
                                  <span className="truncate max-w-[130px] sm:max-w-[180px]">{paper.title}</span>
                                </Link>
                              ))}
                              {c.approvedUploads > c.contributions.length && (
                                <span className="text-[10px] text-prevu-text-muted font-mono self-center">
                                  +{c.approvedUploads - c.contributions.length} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="text-[10px] text-prevu-text-muted/80 font-mono mt-1">
                              Active in doubt threads &amp; peer verification
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-prevu-text-muted font-mono align-top">{c.branch}</td>
                        <td className="py-3.5 px-4 align-top">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.badge.color}`}>
                            <span>{c.badge.icon}</span>
                            <span>{c.badge.title}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-white align-top">
                          {c.approvedUploads}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400 align-top">
                          {c.karma}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-prevu-text-muted text-xs space-y-2">
                <p>No papers approved yet. Be the very first student on the leaderboard!</p>
              </div>
            )}
          </div>

          {/* Contributor Badges Legend (#3 & #12) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Prevu Contributor Tier Badges
                </h3>
                <p className="text-xs text-prevu-text-muted mt-0.5">
                  Unlock prestigious badges on your student profile by uploading papers, fulfilling community bounties, and vouching for paper accuracy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <span>👑</span> <span>Campus Legend</span>
                </div>
                <p className="text-[11px] text-prevu-text-muted leading-snug">
                  150+ Karma. Top tier contributor recognized across university faculties.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <span>🛡️</span> <span>Vault Guardian</span>
                </div>
                <p className="text-[11px] text-prevu-text-muted leading-snug">
                  90+ Karma. Senior student vouching for syllabus accuracy & paper authentications.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                  <span>⚡</span> <span>Bounty Hunter</span>
                </div>
                <p className="text-[11px] text-prevu-text-muted leading-snug">
                  50+ Karma. Earned by archiving missing PYQs requested on the Bounty Board.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                  <span>⭐</span> <span>Semester Hero</span>
                </div>
                <p className="text-[11px] text-prevu-text-muted leading-snug">
                  25+ Karma. Uploaded approved papers that saved batchmates during exam week.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-prevu-surface to-indigo-950/40 border border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Want to climb the ranks?
              </h3>
              <p className="text-xs text-prevu-text-muted">
                Earn 25 karma points for every approved question paper, plus extra XP for fulfilling missing PYQ bounties.
              </p>
            </div>

            <Button size="sm" asChild className="font-bold bg-prevu-accent text-white shadow-lg shadow-prevu-accent/20 shrink-0">
              <Link href="/upload">
                Contribute Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>

        </div>
      </main>
    </div>
  )
}
