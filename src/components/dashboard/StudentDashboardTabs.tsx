'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  Bookmark, 
  HelpCircle, 
  Upload, 
  Search, 
  X,
  FileQuestion,
  MessageSquarePlus,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { ResourceCard } from '@/components/ResourceCard'
import ExamCountdownWidget from './ExamCountdownWidget'
import AcademicCalendarModal from './AcademicCalendarModal'
import ExamBlueprintModal from './ExamBlueprintModal'
import RecentlyViewedBar from './RecentlyViewedBar'
import SavedPapersList from './SavedPapersList'
import PaperRequestsBoard from './PaperRequestsBoard'

interface StudentDashboardTabsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userProfile: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  myResources: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  savedResources: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paperRequests: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  liveResources?: any[]
}

type TabType = 'browse' | 'saved' | 'requests' | 'my-uploads'

export default function StudentDashboardTabs({
  userProfile,
  myResources,
  savedResources,
  paperRequests,
  liveResources = []
}: StudentDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('browse')
  
  // Dashboard in-page search & filter states
  const userSem = userProfile?.current_semester || 1
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSemester, setSelectedSemester] = useState<number | 'ALL'>(userSem)
  const [selectedPattern, setSelectedPattern] = useState<string>('ALL')

  // Filter live resources
  const filteredLiveResources = liveResources.filter(r => {
    const term = searchQuery.toLowerCase().trim()
    const matchesSearch = !term ||
      r.subjects?.name?.toLowerCase().includes(term) ||
      r.subjects?.code?.toLowerCase().includes(term) ||
      r.exam_types?.name?.toLowerCase().includes(term) ||
      String(r.exam_year || '').includes(term)

    const matchesSem = selectedSemester === 'ALL' || r.subjects?.semester === selectedSemester
    const matchesPattern = selectedPattern === 'ALL' || r.exam_types?.name === selectedPattern

    return matchesSearch && matchesSem && matchesPattern
  })

  const savedResourceIds = savedResources.map(s => s.id)

  return (
    <div className="space-y-6">
      
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-prevu-surface-light pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'browse'
              ? 'bg-prevu-accent text-white shadow-lg shadow-prevu-accent/25'
              : 'text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light/40'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Live Question Papers & Browse</span>
          {liveResources.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
              {liveResources.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-prevu-accent text-white shadow-lg shadow-prevu-accent/25'
              : 'text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light/40'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Papers</span>
          {savedResources.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
              {savedResources.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-prevu-accent text-white shadow-lg shadow-prevu-accent/25'
              : 'text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light/40'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Paper Requests</span>
          {paperRequests.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
              {paperRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my-uploads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'my-uploads'
              ? 'bg-prevu-accent text-white shadow-lg shadow-prevu-accent/25'
              : 'text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light/40'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>My Contributions</span>
          {myResources.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
              {myResources.length}
            </span>
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* TAB 1: LIVE QUESTION PAPERS & IN-DASHBOARD BROWSING */}
      {/* ------------------------------------------------------------ */}
      {activeTab === 'browse' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Quick Feature Action Bar (Calendar & Exam Pattern Modal Buttons) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-gradient-to-r from-prevu-surface via-prevu-surface/90 to-prevu-surface border border-prevu-surface-light shadow-xl">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-prevu-accent" />
                <span>Quick Academic Tools & Blueprints</span>
              </h2>
              <p className="text-xs text-prevu-text-muted mt-0.5">
                Check official CU exam dates, practical evaluations, and MST/EST question blueprints anytime.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <AcademicCalendarModal semester={userSem} />
              <ExamBlueprintModal semester={userSem} />
            </div>
          </div>

          {/* Exam Countdown Widget */}
          <ExamCountdownWidget semester={userSem} />

          {/* In-Dashboard Search & Browsing Bar */}
          <div className="space-y-4 p-5 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light shadow-xl">
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted group-focus-within:text-prevu-accent transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search papers by subject name, course code (e.g. 23CST-201), or year..."
                  className="w-full pl-10 pr-10 py-2.5 bg-prevu-bg border border-prevu-surface-light hover:border-prevu-accent/50 focus:border-prevu-accent rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-prevu-text p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Full Archive Link */}
              <Button variant="outline" size="sm" asChild className="h-10 text-xs border-prevu-surface-light shrink-0 font-semibold">
                <Link href="/browse">
                  <span>Open Full Archive Page</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 text-prevu-accent" />
                </Link>
              </Button>
            </div>

            {/* Semester & Exam Pattern Filter Pills */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-prevu-surface-light/60">
              
              {/* Semester Switcher */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-prevu-text-muted shrink-0 mr-1">
                  Semester:
                </span>
                <button
                  onClick={() => setSelectedSemester('ALL')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    selectedSemester === 'ALL'
                      ? 'bg-prevu-accent text-white'
                      : 'bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
                  }`}
                >
                  All
                </button>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSemester(s)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                      selectedSemester === s
                        ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/20'
                        : 'bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text hover:border-prevu-accent/30'
                    }`}
                  >
                    Sem {s} {userSem === s && '⭐'}
                  </button>
                ))}
              </div>

              {/* Pattern Filter Pills */}
              <div className="flex items-center gap-1.5 shrink-0 text-xs">
                {['ALL', 'MST1', 'MST2', 'EST'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedPattern(type)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedPattern === type
                        ? type === 'EST'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
                    }`}
                  >
                    {type === 'ALL' && 'All Types'}
                    {type === 'MST1' && '⚡ MST 1'}
                    {type === 'MST2' && '⚡ MST 2'}
                    {type === 'EST' && '🎓 EST'}
                  </button>
                ))}
              </div>

            </div>

          </div>

          {/* Live Papers Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Verified Question Papers</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                  {filteredLiveResources.length} Available
                </span>
              </h3>
            </div>

            {filteredLiveResources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLiveResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    isBookmarked={savedResourceIds.includes(resource.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-prevu-surface-light bg-prevu-surface/60 rounded-3xl p-8 space-y-3 max-w-md mx-auto shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-prevu-surface border border-prevu-surface-light flex items-center justify-center mx-auto text-prevu-text-muted">
                  <FileQuestion className="w-7 h-7 text-prevu-accent" />
                </div>
                <h4 className="text-base font-bold text-white">No papers found</h4>
                <p className="text-xs text-prevu-text-muted leading-relaxed">
                  {searchQuery 
                    ? `No papers match "${searchQuery}". You can post a paper request to your batchmates!`
                    : "No question papers found for this semester filter."
                  }
                </p>
                <div className="pt-2">
                  <Button size="sm" onClick={() => setActiveTab('requests')} className="text-xs bg-prevu-accent text-white font-bold">
                    <MessageSquarePlus className="w-3.5 h-3.5 mr-1.5" /> Request this Paper
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Recently Viewed History */}
          <RecentlyViewedBar />

        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* TAB 2: SAVED PAPERS & BOOKMARKS */}
      {/* ------------------------------------------------------------ */}
      {activeTab === 'saved' && (
        <div className="space-y-4 animate-fade-in">
          <SavedPapersList resources={savedResources} />
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* TAB 3: PAPER REQUESTS BOARD */}
      {/* ------------------------------------------------------------ */}
      {activeTab === 'requests' && (
        <div className="space-y-4 animate-fade-in">
          <PaperRequestsBoard requests={paperRequests} />
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* TAB 4: MY UPLOADS & CONTRIBUTIONS */}
      {/* ------------------------------------------------------------ */}
      {activeTab === 'my-uploads' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between pb-3 border-b border-prevu-surface-light">
            <div>
              <h2 className="text-base font-bold text-white">My Contributed Question Papers</h2>
              <p className="text-xs text-prevu-text-muted">Track the approval status of question papers you uploaded to Prevu.</p>
            </div>
            <Button size="sm" asChild className="text-xs font-bold">
              <Link href="/upload">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload New Paper
              </Link>
            </Button>
          </div>

          {myResources.length === 0 ? (
            <div className="text-center py-16 border border-prevu-surface-light bg-prevu-surface/60 rounded-3xl p-8 space-y-3 max-w-md mx-auto shadow-xl">
              <Upload className="w-10 h-10 text-prevu-text-muted mx-auto" />
              <h3 className="text-base font-bold text-white">You haven&apos;t uploaded any papers yet</h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Help your juniors and classmates by sharing previous year question papers or notes from your exams!
              </p>
              <Button size="sm" asChild className="mt-2 text-xs font-bold">
                <Link href="/upload">Contribute Your First Paper</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myResources.map((resource) => (
                <Card key={resource.id} className="border-prevu-surface-light bg-prevu-surface/90 shadow-lg">
                  <CardHeader className="pb-3 border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/25">
                        {resource.exam_types?.name}
                      </span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        resource.status === 'approved' 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                          : resource.status === 'rejected'
                          ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {resource.status === 'approved' ? '✓ Approved & Live' : resource.status === 'rejected' ? '✕ Rejected' : '⏳ Under Review'}
                      </span>
                    </div>

                    <CardTitle className="text-base font-bold text-white">
                      {resource.subjects?.name}
                    </CardTitle>
                    <p className="text-xs text-prevu-text-muted font-mono mt-0.5">
                      {resource.subjects?.code} • Sem {resource.subjects?.semester} • {resource.exam_year}
                    </p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  )
}
