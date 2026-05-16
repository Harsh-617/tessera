import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

const MOCK_TIMELINE = [
  {
    id: 'new',
    type: 'Weekly Sync',
    time: 'Today, 10:42 AM',
    note: 'Discussed the Q3 technical roadmap. The team is making good progress on the microservices migration but highlighted a bottleneck in DevOps bandwidth. Advised hiring a dedicated SRE contractor for 3 months.',
    author: 'Elena R.',
    isNew: true,
  },
  {
    id: 'past1',
    type: 'Code Review Session',
    time: 'Oct 12, 2023',
    note: 'Pair programming with lead engineer to refactor the payment processing module. Identified several race conditions.',
  },
  {
    id: 'past2',
    type: 'Introduction Call',
    time: 'Sep 28, 2023',
    note: 'Initial alignment meeting. Set expectations for bi-weekly check-ins and established primary communication channels via Slack.',
  },
]

export default function CheckIn() {
  const { id } = useParams()
  const [type, setType] = useState('')
  const [notes, setNotes] = useState('')
  const [followUp, setFollowUp] = useState(false)
  const [showToast, setShowToast] = useState(true)
  const [timeline, setTimeline] = useState(MOCK_TIMELINE)
  const [submitted, setSubmitted] = useState(true)

  const handleSubmit = () => {
    if (!type) return
    const entry = {
      id: Date.now().toString(),
      type: { sync: 'Weekly Sync', review: 'Code Review', strategy: 'Strategy Call' }[type],
      time: 'Just Now',
      note: notes || '—',
      author: 'Admin',
      isNew: true,
    }
    setTimeline([entry, ...timeline.map(t => ({ ...t, isNew: false }))])
    setSubmitted(true)
    setShowToast(true)
    setType('')
    setNotes('')
    setFollowUp(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-sidebar-width overflow-y-auto bg-background p-container-padding">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Header */}
          <div className="md:col-span-12 flex justify-between items-end mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to={`/admin/links/${id}`}
                  className="text-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  BACK
                </Link>
                <span className="text-on-surface-variant text-label-caps">/</span>
                <span className="text-label-caps text-on-surface-variant">MENTORSHIP SESSION</span>
                <span className="text-label-caps text-on-surface-variant px-1.5 py-0.5 rounded border border-outline-variant bg-surface">
                  ACTIVE
                </span>
              </div>
              <h1 className="text-title-lg text-on-surface">Elena Rodriguez / TechNova Inc.</h1>
            </div>
          </div>

          {/* Left Col */}
          <div className="md:col-span-5 flex flex-col gap-6">

            {/* Log Check-in Form */}
            <div className="bg-surface border border-outline-variant rounded p-4">
              <h3 className="text-title-md text-on-surface border-b border-outline-variant pb-2 mb-4">Log Check-in</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full bg-surface border border-outline-variant text-on-surface text-body-md rounded h-9 px-3 focus:border-primary focus:outline-none appearance-none"
                  >
                    <option value="" disabled>Select interaction type</option>
                    <option value="sync">Weekly Sync</option>
                    <option value="review">Code Review</option>
                    <option value="strategy">Strategy Call</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add discussion points..."
                    className="w-full bg-surface border border-outline-variant text-on-surface text-body-md rounded p-3 min-h-[100px] focus:border-primary focus:outline-none placeholder:text-outline resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="followup"
                    type="checkbox"
                    checked={followUp}
                    onChange={e => setFollowUp(e.target.checked)}
                    className="w-4 h-4 rounded border-outline-variant bg-surface text-primary focus:ring-0"
                  />
                  <label htmlFor="followup" className="text-body-md text-on-surface-variant">Requires follow-up</label>
                </div>
                <button
                  onClick={handleSubmit}
                  className="btn-active w-full bg-primary text-[#131313] text-title-md rounded h-9 hover:opacity-90 transition-opacity mt-2"
                >
                  Log Entry
                </button>
              </div>
            </div>

            {/* Startup Context */}
            <div className="bg-surface border border-outline-variant rounded p-4">
              <h3 className="text-title-md text-on-surface border-b border-outline-variant pb-2 mb-4">Startup Context</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <span className="block text-label-caps text-on-surface-variant">STAGE</span>
                  <span className="text-body-md text-on-surface">Series A</span>
                </div>
                <div>
                  <span className="block text-label-caps text-on-surface-variant">CURRENT FOCUS</span>
                  <span className="text-body-md text-on-surface">Scaling backend infrastructure, Series B prep</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col - Activity Feed */}
          <div className="md:col-span-7 flex flex-col min-h-[600px]">

            {/* Success Toast */}
            {showToast && (
              <div className="bg-[#052e16] border border-[#22c55e] rounded p-3 mb-4 flex items-start gap-3 relative overflow-hidden">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#22c55e] rounded-full blur-xl opacity-20" />
                <span className="material-symbols-outlined text-[#22c55e] mt-0.5">check_circle</span>
                <div>
                  <p className="text-title-md text-[#f0fdf4]">Check-in logged successfully.</p>
                  <p className="text-body-md text-[#bbf7d0] opacity-80">Timeline updated.</p>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="ml-auto text-[#22c55e] hover:text-[#f0fdf4] transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}

            {/* Feed Container */}
            <div className="bg-surface border border-outline-variant rounded flex-1 flex flex-col">
              <div className="p-4 border-b border-outline-variant flex justify-between items-center sticky top-0 z-10 rounded-t bg-surface">
                <h3 className="text-title-md text-on-surface">Activity Timeline</h3>
                <button className="px-2 py-1 text-label-sm border border-outline-variant rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                  Filter
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                <div className="relative border-l border-outline-variant ml-3 pl-6 space-y-8">
                  {timeline.map(entry => (
                    entry.isNew ? (
                      <div key={entry.id} className="relative animate-highlight border-l-2 -ml-[25px] pl-[23px] py-2 rounded-r">
                        <span className="absolute -left-[29px] top-3 h-3 w-3 rounded-full bg-primary ring-4 ring-surface" />
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-title-md text-on-surface flex items-center gap-2">
                            {entry.type}
                            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-[#22c55e] text-[#22c55e] rounded bg-[#22c55e]/10">
                              Just Now
                            </span>
                          </h4>
                          <span className="text-label-sm text-on-surface-variant">{entry.time}</span>
                        </div>
                        <p className="text-body-md text-on-surface-variant mb-2">{entry.note}</p>
                        {entry.author && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 text-[10px] uppercase tracking-wider border border-outline-variant rounded text-on-surface-variant bg-surface-container-lowest">
                              <span className="material-symbols-outlined text-[12px] align-middle mr-1">person</span>
                              {entry.author}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key={entry.id} className="relative">
                        <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-outline-variant bg-surface" />
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-title-md text-on-surface">{entry.type}</h4>
                          <span className="text-label-sm text-on-surface-variant">{entry.time}</span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant">{entry.note}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
