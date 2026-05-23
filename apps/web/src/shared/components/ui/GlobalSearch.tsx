import React, { useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type ResultItem = {
  id: string
  title: string
  subtitle?: string
  meta?: string
}

type Group = {
  title: string
  items: ResultItem[]
}

export default function GlobalSearch() {
  const id = useId()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Group[]>([])

  // mocked dataset
  const MOCK_INCIDENTS: ResultItem[] = [
    { id: 'INC-150', title: 'Payment failures in EU region', subtitle: 'checkout-api', meta: '2h ago' },
    { id: 'INC-149', title: 'High latency on order service', subtitle: 'payment-service', meta: '1d ago' },
    { id: 'INC-148', title: 'RabbitMQ consumer lag', subtitle: 'notification-worker', meta: '2d ago' },
  ]
  const MOCK_INVESTIGATIONS: ResultItem[] = [
    { id: 'INV-010', title: 'Order-retry investigation', subtitle: 'checkout-api', meta: '3d ago' },
    { id: 'INV-009', title: 'Cache warmup analysis', subtitle: 'search-index', meta: '10d ago' },
  ]
  const MOCK_POSTMORTEMS: ResultItem[] = [
    { id: 'PM-07', title: 'EU Payment outage', subtitle: 'postmortem', meta: '2026-05-01' },
  ]

  // keybindings: Cmd/Ctrl+K to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k'
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault()
        setOpen((s) => !s)
        setQuery('')
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // clicking outside or blur handled by backdrop

  // searches are triggered explicitly by user (Enter or Search button)
  useEffect(() => {
    if (!open) return
    // reset state when opening
    setResults([])
    setLoading(false)
  }, [open])

  const exampleQueries = ['payment outage', 'checkout-api', 'retry amplification']

  const performSearch = () => {
    // explicit search action; show loading and return static hardcoded results
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    setResults([])

    // simulate server search latency
    setTimeout(() => {
      setResults([
        { title: 'Incidents', items: MOCK_INCIDENTS },
      ])
      setLoading(false)
    }, 800)
  }

  const onSelect = (item: ResultItem, group: string) => {
    setOpen(false)
    // navigate to different pages based on group/type
    if (group === 'Incidents') navigate(`/incidents/${item.id}`)
    else if (group === 'Investigations') navigate(`/investigations/${item.id}`)
    else if (group === 'Postmortems') navigate(`/postmortems/${item.id}`)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative w-full max-w-3xl">
        <div className="bg-[#07101a] border border-slate-800 rounded-xl shadow-xl overflow-hidden">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <input
                autoFocus
                value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') performSearch(); }}
              placeholder="Search incidents, investigations, postmortems... (Cmd/Ctrl+K)"
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none py-2 px-3 text-sm"
              aria-label="Global search"
            />
            <button onClick={performSearch} className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded text-sm">Search</button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {exampleQueries.map((q) => (
                <button key={q} onClick={() => setQuery(q)} className="text-xs bg-slate-800/40 px-2 py-1 rounded text-slate-300">{q}</button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 max-h-80 overflow-auto">
            {loading ? (
              <div className="p-6 flex items-center justify-center text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-transparent border-slate-500 rounded-full animate-spin" />
                  <div>Searching across RootLence…</div>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {results.map((g) => (
                  <div key={g.title}>
                    <div className="text-xs text-slate-500 font-medium mb-2">{g.title}</div>
                    {g.items.length === 0 ? (
                      <div className="text-sm text-slate-500">No results</div>
                    ) : (
                      <ul className="space-y-1">
                        {g.items.map((it) => (
                          <li key={it.id}> 
                            <button
                              onClick={() => onSelect(it, g.title)}
                              className="w-full text-left px-3 py-2 rounded hover:bg-slate-800/40 flex items-center justify-between"
                            >
                              <div>
                                <div className="text-sm font-semibold text-slate-100">{it.title}</div>
                                <div className="text-xs text-slate-400">{it.subtitle} • {it.meta}</div>
                              </div>
                              <div className="text-xs text-slate-500">{it.id}</div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
