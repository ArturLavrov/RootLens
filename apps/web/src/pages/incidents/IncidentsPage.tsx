import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../shared/components/layout/AppShell'
import Avatar from '../../shared/components/ui/Avatar'
import CreateIncidentModal from './CreateIncidentModal'

type Incident = {
  id: string
  title: string
  severity: 'Low' | 'Medium' | 'High'
  environment: string
  startTime: string
  clients: string[]
  participants: string[]
}

const SAMPLE_INCIDENTS: Incident[] = []


function SeverityBadge({ severity }: { severity: Incident['severity'] }) {
  if (severity === 'High') return <span className="px-2 py-1 rounded text-xs bg-red-600">High</span>
  if (severity === 'Medium') return <span className="px-2 py-1 rounded text-xs bg-orange-600">Medium</span>
  return <span className="px-2 py-1 rounded text-xs bg-green-600">Low</span>
}

export default function IncidentsPage() {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [incidents, setIncidents] = React.useState<Incident[]>(SAMPLE_INCIDENTS)
  const [loadingIncidents, setLoadingIncidents] = React.useState(false)
  const [totalIncidents, setTotalIncidents] = React.useState<number>(0)

  async function fetchIncidents() {
    setLoadingIncidents(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/incidents', { headers: { Accept: 'application/json' } })
      if (!res.ok) {
        console.error('Failed to fetch incidents', res.status)
        return
      }
      const data = await res.json()
      // Map API response to local Incident type
      const mapped: Incident[] = (data || []).map((it: any) => ({
        id: it.public_id || it.id,
        title: it.title,
        severity: (function(s){ const v = (s||'').toLowerCase(); if(v==='critical' || v==='high') return 'High'; if(v==='medium') return 'Medium'; return 'Low' })(it.severity),
        environment: it.env || it.environment || 'Production',
        startTime: it.reported_date || it.created_on || '',
        clients: (it.affected_clients || []).map((c: any) => c.name || c.id),
        participants: (it.participants || []).map((p: any) => p.display_name || p.email || '')
      }))
      setIncidents(mapped)
      // Prefer explicit total from API when available, otherwise fallback to mapped length
      const total = (data && (data.total || data.count || (data.meta && data.meta.total))) || mapped.length
      setTotalIncidents(total)
    } catch (err) {
      console.error('Error fetching incidents', err)
    } finally {
      setLoadingIncidents(false)
    }
  }

  React.useEffect(() => { fetchIncidents() }, [])

  const LOGO_MAP: Record<string,string> = {
    Spotify: 'spotify.com',
    Apple: 'apple.com',
    Google: 'google.com',
    Microsoft: 'microsoft.com',
    Amazon: 'amazon.com',
    Netflix: 'netflix.com',
    Uber: 'uber.com',
    Airbnb: 'airbnb.com',
    Salesforce: 'salesforce.com',
    Stripe: 'stripe.com',
    PayPal: 'paypal.com',
    Square: 'squareup.com',
    Slack: 'slack.com',
    Zoom: 'zoom.us',
    Dropbox: 'dropbox.com',
    Atlassian: 'atlassian.com',
    Hubspot: 'hubspot.com',
    Shopify: 'shopify.com',
    Mailchimp: 'mailchimp.com',
    Reddit: 'reddit.com',
    Pinterest: 'pinterest.com',
    TikTok: 'tiktok.com',
    Snapchat: 'snapchat.com',
    Twitch: 'twitch.tv',
    Discord: 'discord.com',
    Oracle: 'oracle.com',
    SAP: 'sap.com',
    IBM: 'ibm.com',
    Cisco: 'cisco.com',
    Meta: 'meta.com',
    WhatsApp: 'whatsapp.com',
    GitHub: 'github.com',
    Bitbucket: 'bitbucket.org',
    DigitalOcean: 'digitalocean.com',
    Heroku: 'heroku.com',
    Linode: 'linode.com',
    Vercel: 'vercel.com',
    Netlify: 'netlify.com',
    Cloudflare: 'cloudflare.com',
    Fastly: 'fastly.com',
    Akamai: 'akamai.com',
    Zendesk: 'zendesk.com',
    Okta: 'okta.com',
    Auth0: 'auth0.com',
    NewRelic: 'newrelic.com',
    Datadog: 'datadog.com',
    Sentry: 'sentry.io',
    Elastic: 'elastic.co',
    Kubernetes: 'kubernetes.io',
    RedisLabs: 'redis.com'
  }

  function getLogo(domainName: string) {
    const key = domainName.trim()
    const domain = LOGO_MAP[key] ?? `${key.replace(/\s+/g,'').toLowerCase()}.com`
    return `https://logo.clearbit.com/${domain}`
  }

  function formatDate(iso?: string) {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      if (isNaN(d.getTime())) return iso
      return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return iso
    }
  }

  return (
    <AppShell>
      <div className="p-6">
        <div className="flex items-center justify-end mb-4">
          <button onClick={() => setShowCreateModal(true)} className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded">+ Declare Incident</button>
        </div>

        <div className="bg-[#0f1724] p-4 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead>
                <tr className="text-slate-400">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Severity</th>
                  <th className="pb-2">Environment</th>
                  <th className="pb-2">Start Time</th>
                  <th className="pb-2">Affected Clients</th>
                  <th className="pb-2">Participants</th>
                </tr>
              </thead>

              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id} role="button" onClick={() => navigate(`/incidents/${inc.id}`)} className="border-t border-slate-800 cursor-pointer hover:bg-slate-800/40 hover:border-slate-600">
                    <td className="py-3 font-semibold text-slate-100 w-24 whitespace-nowrap">{inc.id}</td>

                    <td className="py-3 text-slate-400 pl-8">{inc.title}</td>

                    <td className="py-3"><SeverityBadge severity={inc.severity} /></td>

                    <td className="py-3 text-slate-300">{inc.environment}</td>

                    <td className="py-3 text-slate-300">{formatDate(inc.startTime)}</td>

                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="flex -space-x-2 overflow-hidden max-w-[320px]">
                          {inc.clients.slice(0, 6).map((c, idx) => (
                            <div key={idx} className="ring-1 ring-slate-900 rounded-full overflow-hidden" title={c}>
                              <Avatar name={c} size={28} src={getLogo(c)} />
                            </div>
                          ))}
                        </div>

                        {inc.clients.length > 6 && (
                          <div className="ml-3 text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded-full ring-1 ring-slate-900" title={inc.clients.slice(6).join(', ')}>
                            +{inc.clients.length - 6}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3">
                      <div className="flex -space-x-2 items-center">
                        {inc.participants.map((p, idx) => (
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

            <div className="mt-3 flex items-center justify-end">
              <div className="text-xs text-slate-500">Showing {incidents.length} of {totalIncidents} incidents</div>
            </div>
          </div>
        </div>

        <CreateIncidentModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={() => fetchIncidents()} />
      </div>
    </AppShell>
  )
}

