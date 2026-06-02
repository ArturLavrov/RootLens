import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AppShell from '../../shared/components/layout/AppShell'
import ProgressBar from '../../shared/components/ui/ProgressBar'
import LineChart from '../../shared/components/ui/LineChart'
import Avatar from '../../shared/components/ui/Avatar'
import Table from '../../shared/components/ui/Table'
import Sparkline from '../../shared/components/ui/Sparkline'
import Dropdown from '../../shared/components/ui/Dropdown'

  function getLogo(name: string) {
    const domain = `${name.replace(/\s+/g, '').toLowerCase()}.com`
    return `https://logo.clearbit.com/${domain}`
  }

  function formatDateShort(iso?: string) {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      if (isNaN(d.getTime())) return iso
      return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return iso
    }
  }

type Interval = 'date' | 'month' | 'year'

type ChartData = { labels: string[]; data: number[] }

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randAround(base: number, variance = 0.25) {
  const factor = 1 + (Math.random() * 2 - 1) * variance
  return Math.max(0, Math.round(base * factor))
}

function formatDateDaysAgo(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(5, 10) // MM-DD
}

export default function DashboardPage() {
  const [rangeDays, setRangeDays] = useState<number>(90)

  const navigate = useNavigate()

  const hours = new Date().getHours()
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening'

  const [chartData, setChartData] = useState<ChartData>({ labels: [], data: [] })
  const [topCards, setTopCards] = useState<any[]>([])
  const [families, setFamilies] = useState<{ name: string; percent: number }[]>([])
  const [recentIncidents, setRecentIncidents] = useState<any[]>([])
  const [services, setServices] = useState<{ name: string; count: number }[]>([])
  const [totalIncidents, setTotalIncidents] = useState<number>(0)

  // regenerate range-dependent data when rangeDays changes (top cards, families, services)
  useEffect(() => {
    // simulate totals and derived widgets based on selected range
    const avgPerDay = Math.max(3, Math.round(rangeDays / 5))
    const total = randAround(avgPerDay * Math.min(rangeDays, 180), 0.25)

    const cards = [
      { title: 'Total Incidents', value: String(total), trend: { up: Math.random() > 0.4, pct: rand(2, 28) }, spark: Array.from({ length: 12 }, () => randAround(Math.round(total / 12), 0.4)) },
      { title: 'High Severity', value: String(Math.round(total * 0.18)), trend: { up: Math.random() > 0.6, pct: rand(1, 12) }, spark: Array.from({ length: 12 }, () => randAround(Math.round(total * 0.18 / 12 || 1), 0.5)) },
      { title: 'MTTR', value: `${rand(45, 160)}m`, trend: { up: Math.random() > 0.5, pct: rand(1, 20) }, spark: Array.from({ length: 12 }, () => rand(60, 160)) },
      { title: 'Recurring Patterns', value: String(Math.max(1, Math.round(total * 0.08))), trend: { up: Math.random() > 0.5, pct: rand(1, 10) }, spark: Array.from({ length: 12 }, () => randAround(Math.max(1, Math.round(total * 0.08 / 12)), 0.6)) },
    ]

    // failure families distribution
    const familyNames = ['Retry Amplification', 'Dependency Saturation', 'Queue Backpressure', 'Misconfigured Timeouts']
    let remaining = 100
    const fams = familyNames.map((n, idx) => {
      const max = Math.max(5, remaining - (familyNames.length - idx - 1) * 5)
      const p = idx === familyNames.length - 1 ? remaining : Math.min(max, rand(8, Math.round(remaining * (0.2 + Math.random() * 0.5))))
      remaining -= p
      return { name: n, percent: p }
    })

    // services distribution
    const svcNames = ['checkout-api', 'payment-service', 'notification-worker', 'user-service', 'search-index']
    const svcs = svcNames.map((n) => ({ name: n, count: randAround(Math.max(1, Math.round((total / svcNames.length) * (0.5 + Math.random())))) }))
    svcs.sort((a, b) => b.count - a.count)

    setTopCards(cards)
    setFamilies(fams)
    setServices(svcs)
    setTotalIncidents(total)
  }, [rangeDays])

  // chart data depends on the global rangeDays selector now
  useEffect(() => {
    const labels: string[] = []
    const data: number[] = []

    if (rangeDays <= 31) {
      // show daily points for the last N days
      const points = Math.min(rangeDays, 30)
      for (let i = points - 1; i >= 0; i--) {
        labels.push(formatDateDaysAgo(i))
        data.push(randAround(Math.max(1, Math.round(rangeDays / 6)), 0.6))
      }
    } else {
      // aggregate monthly for larger ranges
      const points = Math.min(12, Math.ceil(rangeDays / 30))
      for (let i = points - 1; i >= 0; i--) {
        const now = new Date()
        const m = new Date(now.getFullYear(), now.getMonth() - i, 1)
        labels.push(m.toLocaleString(undefined, { month: 'short' }))
        data.push(randAround(Math.max(5, Math.round(rangeDays / Math.max(1, points) / 3)), 0.4))
      }
    }

    setChartData({ labels, data })
  }, [rangeDays])

  // recent incidents should come from the API (show latest 5)
  useEffect(() => {
    async function loadRecent() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/incidents', { headers: { Accept: 'application/json' } })
        if (!res.ok) {
          console.error('Failed to fetch recent incidents', res.status)
          return
        }
        const data = await res.json()
        // sort by created_on / reported_date desc
        data.sort((a: any, b: any) => {
          const ta = new Date(a.created_on || a.reported_date || 0).getTime()
          const tb = new Date(b.created_on || b.reported_date || 0).getTime()
          return tb - ta
        })
        const slice = (data || []).slice(0, 5)
        const mapped = slice.map((it: any) => ({
          id: it.public_id || it.id,
          title: it.title || it.description || 'Untitled',
          sev: (function(s){ const v = (s||'').toLowerCase(); if(v==='critical' || v==='high') return 'High'; if(v==='medium') return 'Medium'; return 'Low' })(it.severity),
          environment: it.env || it.environment || 'PROD',
          startTime: it.reported_date || it.created_on || '',
          clients: (it.affected_clients || []).map((c:any) => (c.name || c.id)),
          service: it.primary_service || (it.communication_channels && it.communication_channels[0] && it.communication_channels[0].display_name) || '',
          family: it.failure_family || it.root_cause || '',
          time: (function(dateStr){ if(!dateStr) return ''; try{ const d=new Date(dateStr); const diffMs=Date.now()-d.getTime(); const diffMin=Math.round(diffMs/60000); if(diffMin<60) return `${diffMin}m ago`; if(diffMin<60*24) return `${Math.round(diffMin/60)}h ago`; return `${Math.round(diffMin/60/24)}d ago`; }catch(e){ return dateStr } })(it.reported_date || it.created_on),
          participants: (it.participants || []).map((p:any)=>p.display_name || p.email || '')
        }))
        setRecentIncidents(mapped)
      } catch (err) {
        console.error('Error loading recent incidents', err)
      }
    }

    loadRecent()
  }, [])

  const shownCount = recentIncidents.length

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 space-y-6">

          {/* Greeting + range selector */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-100">{greeting}</h2>
              <div className="text-sm text-slate-400">Here’s your incident overview</div>
            </div>

            <div className="flex items-center gap-2">
              <Dropdown
                options={[
                  { label: 'Last 30 days', value: 30 },
                  { label: 'Last 90 days', value: 90 },
                  { label: 'Last 180 days', value: 180 },
                ]}
                value={rangeDays}
                onChange={(v) => setRangeDays(Number(v))}
                buttonClassName="px-3 py-1 rounded text-sm bg-slate-700 text-white"
                menuClassName="w-44"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topCards.map((card) => (
              <div key={card.title} className="bg-[#0f1724] p-4 rounded-lg shadow-inner flex flex-col justify-between">
                <div>
                  <div className="text-sm text-slate-400">{card.title}</div>
                  <div className="text-2xl font-semibold mt-2">{card.value}</div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-sm ${card.trend.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span className={`text-xs ${card.trend.up ? 'rotate-0' : 'rotate-180'}`}>{card.trend.up ? '▲' : '▲'}</span>
                    <span className="font-medium">{card.trend.pct}%</span>
                    <span className="text-xs text-slate-500">vs {rangeDays}d</span>
                  </div>
                  <div className="w-32">
                    <Sparkline data={(card.spark || []).slice(-12)} stroke={card.trend.up ? '#10b981' : '#f43f5e'} width={120} height={34} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0f1724] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Top Failure Families</h3>
              <div className="space-y-4">
                {families.map((f) => (
                  <ProgressBar key={f.name} label={f.name} percent={f.percent} />
                ))}
              </div>
            </div>

            <div className="bg-[#0f1724] p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold mb-0">Incidents over time</h3>
                <div className="flex items-center gap-2" />
              </div>

              <div className="mt-2">
                <LineChart data={chartData.data} labels={chartData.labels} height={160} />
              </div>
            </div>
          </div>

          <div className="bg-[#0f1724] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Recent Incidents</h3>
            <div>
              {/* Reusable table component */}
              <Table
                columns={[
                  { header: 'ID', accessor: 'id', className: 'font-semibold text-slate-100 w-24 whitespace-nowrap' },
                  { header: 'Title', accessor: 'title', className: 'text-slate-400 pl-8' },
                  { header: 'Severity', render: (row:any) => <span className={`px-2 py-1 rounded text-xs ${row.sev === 'High' ? 'bg-red-600' : row.sev === 'Medium' ? 'bg-orange-600' : 'bg-green-600'}`}>{row.sev}</span> },
                  { header: 'Environment', accessor: 'environment' },
                  { header: 'Start Time', render: (row:any) => formatDateShort(row.startTime) },
                  { header: 'Affected Clients', render: (row:any) => (
                      <div className="flex items-center">
                        <div className="flex -space-x-2 overflow-hidden max-w-[320px]">
                          {(row.clients || []).slice(0,6).map((c:string, idx:number) => (
                            <div key={idx} className="ring-1 ring-slate-900 rounded-full overflow-hidden" title={c}>
                              <Avatar name={c} size={28} src={getLogo(c)} />
                            </div>
                          ))}
                        </div>
                        { (row.clients || []).length > 6 && (
                          <div className="ml-3 text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded-full ring-1 ring-slate-900" title={(row.clients || []).slice(6).join(', ')}>
                            +{(row.clients || []).length - 6}
                          </div>
                        )}
                      </div>
                    ) },
                  { header: 'Participants', render: (row:any) => (
                      <div className="flex -space-x-2 items-center">
                        {(row.participants || []).map((p:string, idx:number) => (
                          <div key={idx} className="ring-1 ring-slate-900 rounded-full overflow-hidden">
                            <Avatar name={p} size={32} />
                          </div>
                        ))}
                      </div>
                    ) }
                ]}
                data={recentIncidents}
                onRowClick={(row:any) => navigate(`/incidents/${row.id}`)}
              />

              <div className="mt-3 flex items-center justify-between">
                <Link to="/incidents" className="px-3 py-2 border border-slate-700 bg-transparent rounded text-sm text-slate-200 hover:bg-slate-800/40" aria-label="View all incidents">View all incidents</Link>
                <div className="text-xs text-slate-500">Showing {shownCount} of {totalIncidents} incidents</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0f1724] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Most Affected Services</h3>
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="w-full">
                    <ProgressBar label={s.name} percent={Math.round((s.count / Math.max(1, services[0]?.count || 1)) * 100)} />
                  </div>
                  <div className="ml-3 w-12 text-right text-sm text-slate-400">{s.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  )
}
