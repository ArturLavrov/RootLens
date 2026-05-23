import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AppShell from '../../shared/components/layout/AppShell'
import ProgressBar from '../../shared/components/ui/ProgressBar'
import LineChart from '../../shared/components/ui/LineChart'
import Avatar from '../../shared/components/ui/Avatar'
import Sparkline from '../../shared/components/ui/Sparkline'
import Dropdown from '../../shared/components/ui/Dropdown'

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

  // recent incidents should remain stable and always show latest 5
  useEffect(() => {
    const names = ['Jane Doe', 'Alex P.', 'Maria L', 'Tom K', 'Sara', 'Liam B.', 'Olivia R.', 'Noah S.', 'Emma G.', 'Lucas H.']
    const fams = ['Retry Amplification', 'Dependency Saturation', 'Queue Backpressure', 'Misconfigured Timeouts']
    const svcs = ['checkout-api', 'payment-service', 'notification-worker', 'user-service']

    const recent: any[] = []
    for (let i = 0; i < 5; i++) {
      const idNum = 150 - i
      const sev = ['High', 'Medium', 'Low'][rand(0, 2)]
      const svc = svcs[i % svcs.length]
      const fam = fams[i % fams.length]
      const time = i === 0 ? '2h ago' : `${i}d ago`

      // pick 4-6 participants per incident (random sample)
      const count = rand(4, 6)
      const shuffled = [...names].sort(() => Math.random() - 0.5)
      const participants = shuffled.slice(0, count)

      recent.push({ id: `INC-${String(idNum).padStart(3, '0')}`, title: `${fam} observed in ${svc}`, sev, service: svc, family: fam, time, participants })
    }
    setRecentIncidents(recent)
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead>
                  <tr className="text-slate-400">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Incident</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Service</th>
                    <th className="pb-2">Failure Family</th>
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncidents.map((it) => (
                    <tr key={it.id} role="button" onClick={() => navigate(`/incidents/${it.id}`)} className="border-t border-slate-800 cursor-pointer hover:bg-slate-800/40 hover:border-slate-600">
                      <td className="py-3 font-semibold text-slate-100 w-24">{it.id}</td>

                      <td className="py-3 text-slate-400">{it.title}</td>

                      <td className="py-3"><span className={`px-2 py-1 rounded text-xs ${it.sev === 'High' ? 'bg-red-600' : it.sev === 'Medium' ? 'bg-orange-600' : 'bg-green-600'}`}>{it.sev}</span></td>

                      <td className="py-3 text-slate-300">{it.service}</td>

                      <td className="py-3 text-slate-300">{it.family}</td>

                      <td className="py-3 text-slate-300">{it.time}</td>

                      <td className="py-3">
                        <div className="flex -space-x-2 items-center">
                          {it.participants.map((p: string, idx: number) => (
                            <div key={idx} className="ring-1 ring-slate-900 rounded-full overflow-hidden">
                              <Avatar name={p} size={32} />
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
