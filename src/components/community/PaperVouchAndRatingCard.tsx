'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, Star, ThumbsUp, Check, Award, BarChart2, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { 
  hasUserVouched, 
  toggleSeniorVouch, 
  getPaperVouches, 
  getPaperRatingStats, 
  submitPaperRating, 
  getUserPaperRating,
  PaperRatingStats 
} from '@/lib/community/ratings'

interface PaperVouchAndRatingCardProps {
  paperId: string
  subjectName?: string
  examYear?: number
  className?: string
}

export default function PaperVouchAndRatingCard({
  paperId,
  subjectName = 'Question Paper',
  examYear = 2025,
  className = ''
}: PaperVouchAndRatingCardProps) {
  const [vouched, setVouched] = useState(false)
  const [totalVouches, setTotalVouches] = useState(3)
  const [stats, setStats] = useState<PaperRatingStats | null>(null)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [difficultyInput, setDifficultyInput] = useState<'easy' | 'moderate' | 'tough'>('moderate')
  const [accuracyInput, setAccuracyInput] = useState(5)
  const [qualityInput, setQualityInput] = useState(5)
  const [userRating, setUserRating] = useState<any>(null)

  const reloadData = () => {
    setVouched(hasUserVouched(paperId))
    setTotalVouches(getPaperVouches(paperId))
    setStats(getPaperRatingStats(paperId))
    setUserRating(getUserPaperRating(paperId))
  }

  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('prevu-community-updated', handleUpdate)
    return () => window.removeEventListener('prevu-community-updated', handleUpdate)
  }, [paperId])

  const handleVouchClick = () => {
    const res = toggleSeniorVouch(paperId)
    setVouched(res.vouched)
    setTotalVouches(res.total)
  }

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault()
    submitPaperRating(paperId, {
      difficulty: difficultyInput,
      accuracy: accuracyInput,
      quality: qualityInput
    })
    setIsRatingModalOpen(false)
    reloadData()
  }

  if (!stats) return null

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light shadow-xl space-y-4 ${className}`}>
      
      {/* Top Header: Senior Verified & Vouch Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-prevu-surface-light/60 pb-3">
        
        {/* Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Senior Verified Paper</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {totalVouches} Senior Vouches
              </span>
            </div>
            <p className="text-[10px] text-prevu-text-muted mt-0.5">
              Vouched by higher semester students as authentic CU exam paper
            </p>
          </div>
        </div>

        {/* Vouch Button */}
        <button
          onClick={handleVouchClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            vouched
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20'
              : 'bg-prevu-surface-light/60 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-amber-500/40'
          }`}
          title={vouched ? 'You vouched for this paper' : 'Vouch that this exact paper appeared in your batch'}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${vouched ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{vouched ? 'Vouched by You' : 'Vouch for Paper'}</span>
        </button>
      </div>

      {/* Ratings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        
        {/* Difficulty Metric */}
        <div className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light space-y-1">
          <span className="text-[10px] font-mono text-prevu-text-muted uppercase font-bold flex items-center gap-1">
            <BarChart2 className="w-3 h-3 text-purple-400" /> Exam Difficulty
          </span>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>{stats.dominantDifficulty}</span>
            <span className="text-[10px] font-mono text-purple-300 font-normal">
              ({stats.difficultyVotes.moderate} votes)
            </span>
          </div>
        </div>

        {/* Accuracy Metric */}
        <div className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light space-y-1">
          <span className="text-[10px] font-mono text-prevu-text-muted uppercase font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Syllabus Accuracy
          </span>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>{stats.averageAccuracy} / 5.0</span>
            <span className="text-yellow-400 text-xs">★</span>
          </div>
        </div>

        {/* Scan Quality & Rate Button */}
        <div className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono text-prevu-text-muted uppercase font-bold">
              Scan Legibility
            </span>
            <div className="text-sm font-bold text-white">
              {stats.averageQuality} / 5.0
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsRatingModalOpen(true)}
            className="text-xs h-7 px-2.5 border-purple-500/40 text-purple-300 hover:bg-purple-600/20 cursor-pointer"
          >
            {userRating ? 'Edit Rating' : 'Rate Paper'}
          </Button>
        </div>

      </div>

      {/* Interactive Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 rounded-3xl bg-[#11111a] border border-purple-500/40 shadow-2xl space-y-5 relative"
          >
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> Rate Question Paper
              </h3>
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="p-1 text-prevu-text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              
              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-prevu-text-muted uppercase mb-1.5">
                  Exam Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'moderate', 'tough'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficultyInput(d)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                        difficultyInput === d
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                          : 'bg-prevu-surface border-prevu-surface-light text-prevu-text-muted hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accuracy */}
              <div>
                <label className="block text-xs font-bold text-prevu-text-muted uppercase mb-1.5">
                  Does this match the actual exam? (1 to 5 Stars): <span className="text-amber-400">{accuracyInput} ★</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={accuracyInput}
                  onChange={(e) => setAccuracyInput(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Scan Legibility */}
              <div>
                <label className="block text-xs font-bold text-prevu-text-muted uppercase mb-1.5">
                  Scan & Text Legibility: <span className="text-cyan-400">{qualityInput} / 5</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={qualityInput}
                  onChange={(e) => setQualityInput(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-prevu-surface-light">
                <Button size="sm" variant="ghost" type="button" onClick={() => setIsRatingModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-purple-600 hover:bg-purple-500 text-xs font-bold">
                  Submit Anonymous Rating
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
