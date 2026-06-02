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

const SAMPLE_INCIDENTS: Incident[] = [
  { id: 'INC-050', title: 'Payment failures in EU region', severity: 'High', environment: 'Production', startTime: 'Nov 1, 14:12', clients: ['Spotify','Apple','Google','Microsoft','Amazon','Netflix','Uber','Airbnb','Salesforce','Stripe','PayPal','Square','Slack','Zoom','Dropbox','Atlassian','Hubspot','Shopify','Mailchimp','Reddit','Pinterest','TikTok','Snapchat','Twitch','Discord','Oracle','SAP','IBM','Cisco','Meta','WhatsApp','GitHub','Bitbucket','DigitalOcean','Heroku','Linode','Vercel','Netlify','Cloudflare','Fastly','Akamai','Zendesk','Okta','Auth0','NewRelic','Datadog','Sentry','Elastic','Kubernetes'], participants: ['Jane Doe','Alex P.','Maria L'] },
  { id: 'INC-049', title: 'High latency on order service', severity: 'Medium', environment: 'Production', startTime: 'Oct 31, 09:44', clients: ['Shopify'], participants: ['Tom K','Sara','Liam B.'] },
  { id: 'INC-048', title: 'RabbitMQ consumer lag', severity: 'High', environment: 'Production', startTime: 'Oct 30, 18:22', clients: ['AWS'], participants: ['Olivia R.','Noah S.','Emma G.'] },
  { id: 'INC-047', title: 'Redis cluster performance drop', severity: 'Medium', environment: 'Production', startTime: 'Oct 29, 11:03', clients: ['RedisLabs'], participants: ['Lucas H.','Alex P.','Maria L'] },
  { id: 'INC-046', title: 'DNS resolution errors', severity: 'Low', environment: 'Production', startTime: 'Oct 28, 10:51', clients: ['Zoom'], participants: ['Jane Doe','Tom K'] },
]

function SeverityBadge({ severity }: { severity: Incident['severity'] }) {
  if (severity === 'High') return <span className="px-2 py-1 rounded text-xs bg-red-600">High</span>
  if (severity === 'Medium') return <span className="px-2 py-1 rounded text-xs bg-orange-600">Medium</span>
  return <span className="px-2 py-1 rounded text-xs bg-green-600">Low</span>
}

export default function IncidentsPage() {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = React.useState(false)

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
                {SAMPLE_INCIDENTS.map((inc) => (
                  <tr key={inc.id} role="button" onClick={() => navigate(`/incidents/${inc.id}`)} className="border-t border-slate-800 cursor-pointer hover:bg-slate-800/40 hover:border-slate-600">
                    <td className="py-3 font-semibold text-slate-100 w-24">{inc.id}</td>

                    <td className="py-3 text-slate-400">{inc.title}</td>

                    <td className="py-3"><SeverityBadge severity={inc.severity} /></td>

                    <td className="py-3 text-slate-300">{inc.environment}</td>

                    <td className="py-3 text-slate-300">{inc.startTime}</td>

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
              <div className="text-xs text-slate-500">Showing {SAMPLE_INCIDENTS.length} recent incidents</div>
            </div>
          </div>
        </div>

        <CreateIncidentModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
      </div>
    </AppShell>
  )
}
