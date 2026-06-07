import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../../shared/components/layout/AppShell'
import Avatar from '../../shared/components/ui/Avatar'
import CreateIncidentModal from './CreateIncidentModal'

function IncidentPage() {
  const { incId } = useParams<{ incId: string }>()
  const navigate = useNavigate()
  const imgs = [
    '/assets/img/incident_page.png',
    '/assets/img/incidents_page_fix.png',
    '/assets/img/create_incident_page_fixed.png',
    '/assets/img/declare_incident_popup.png'
  ]

  const [mainIdx, setMainIdx] = React.useState(0)
  const [showCreateModal, setShowCreateModal] = React.useState(false)

  const [incidents, setIncidents] = React.useState<any[]>([])
  const [loadingIncidents, setLoadingIncidents] = React.useState(false)
  const [totalIncidents, setTotalIncidents] = React.useState<number>(0)

  async function fetchIncidents() {
    setLoadingIncidents(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/incidents', { headers: { Accept: 'application/json' } })
      if (!res.ok) return
      const data = await res.json()
      const mapped = (data || []).map((it: any) => ({
        id: it.public_id || it.id,
        title: it.title,
        severity: (function(s){ const v = (s||'').toLowerCase(); if(v==='critical' || v==='high') return 'High'; if(v==='medium') return 'Medium'; return 'Low' })(it.severity),
        environment: it.env || it.environment || 'Production',
        startTime: it.reported_date || it.created_on || it.reported_at || ''
      }))
      setIncidents(mapped)
      const total = (data && (data.total || data.count || (data.meta && data.meta.total))) || mapped.length
      setTotalIncidents(total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingIncidents(false)
    }
  }

  React.useEffect(() => { fetchIncidents() }, [])

  const current = incidents.find(i => i.id === incId) || { title: '', severity: 'Low', environment: '', startTime: '' }

  function formatDate(iso?: string) {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      if (isNaN(d.getTime())) return iso
      return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch (e) { return iso }
  }

  return (
    <AppShell>
      <div className="p-6">
        {/* Header (matched to mockup) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-start lg:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-slate-100">{current.title || `Incident ${incId}`}</h1>
                  <div className="text-sm text-slate-400 bg-slate-800 px-2 py-1 rounded">ID: {incId}</div>
                  <span className="ml-2 inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-red-600 text-white">{(current.severity || 'Low')}</span>
                </div>

                <div className="mt-3 text-sm text-slate-400 flex flex-wrap items-center gap-2">
                  <span className="bg-slate-800 px-2 py-1 rounded">Env: {current.environment || '—'}</span>
                  <span className="bg-slate-800 px-2 py-1 rounded">Started: {formatDate(current.startTime)}</span>
                  <span className="bg-slate-800 px-2 py-1 rounded">Status: Investigating</span>
                </div>

                <div className="mt-3 text-sm text-slate-500">Use the thumbnails to the right to preview the screens. This header matches mockup spacing and CTA placement.</div>
              </div>
            </div>
          </div>

        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-[#071022] rounded-lg p-4 border border-slate-800">
            <div className="w-full h-[640px] flex items-center justify-center bg-slate-900/20 rounded overflow-hidden">
              <img src={imgs[mainIdx]} alt="Incident screen" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="mt-3 text-sm text-slate-400">Showing screen {mainIdx + 1} of {imgs.length} — mapped to incident {incId} for preview purposes.</div>
          </div>

          <aside className="w-full lg:w-80 flex flex-col gap-4">
            {/* Chat assistant aside (matches mockup) */}
            <div className="bg-[#071022] rounded-lg p-3 border border-slate-800 flex flex-col h-[640px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src="/assets/img/rootlens-logo-32.png" alt="RootLens" className="w-8 h-8 rounded" />
                  <div>
                    <div className="text-sm font-semibold text-slate-100">RootLens Assistant</div>
                    <div className="text-xs text-slate-400">Ask questions about this incident</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">Online</div>
              </div>

              <div className="flex-1 overflow-y-auto px-1 pb-2" id="rl-chat-container">
                {/* Messages list */}
                <div className="space-y-3">
                  {/* initial system message */}
                  <div className="text-xs text-slate-400">Tip: Ask the assistant about timeline, impact, or recommended next steps.</div>
                </div>
              </div>

              <div className="mt-3">
                <form id="rl-chat-form" className="flex gap-2" onSubmit={(e) => { e.preventDefault(); /* handled by inline script below */ }}>
                  <input id="rl-chat-input" placeholder="Ask RootLens..." className="flex-1 bg-slate-900/20 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none" />
                  <button id="rl-chat-send" className="px-3 py-2 rounded bg-violet-600 text-white text-sm">Send</button>
                </form>
              </div>

              {/* Inline script-like behavior implemented with React effects attached below */}
            </div>

            <div className="text-xs text-slate-500">This is a demo chat UI; backend integration can be wired to /api/v1/assistant.</div>

            {/* Chat state and handlers implemented via a small embedded component */}
            <ChatWidget imgs={imgs} setMainIdx={setMainIdx} />
          </aside>
        </div>

        <CreateIncidentModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={() => fetchIncidents()} />
      </div>
    </AppShell>
  )
}

function ChatWidget({ imgs, setMainIdx }: { imgs: string[]; setMainIdx: (n: number) => void }) {
  React.useEffect(() => {
    const container = document.getElementById('rl-chat-container')
    const form = document.getElementById('rl-chat-form') as HTMLFormElement | null
    const input = document.getElementById('rl-chat-input') as HTMLInputElement | null
    const sendBtn = document.getElementById('rl-chat-send') as HTMLButtonElement | null

    const messages: { id: number; sender: 'user' | 'assistant'; text: string }[] = [
      { id: 0, sender: 'assistant', text: 'Hello — ask me about this incident.' }
    ]

    function renderMessages() {
      if (!container) return
      container.innerHTML = ''
      const wrapper = document.createElement('div')
      wrapper.className = 'space-y-3'
      messages.forEach(m => {
        const el = document.createElement('div')
        el.className = m.sender === 'user' ? 'text-right' : ''
        const bubble = document.createElement('div')
        bubble.className = m.sender === 'user' ? 'inline-block bg-slate-700 text-white px-3 py-2 rounded' : 'inline-block bg-slate-800 text-slate-200 px-3 py-2 rounded'
        bubble.textContent = m.text
        el.appendChild(bubble)
        wrapper.appendChild(el)
      })
      container.appendChild(wrapper)
      const end = document.createElement('div')
      end.id = 'rl-chat-end'
      container.appendChild(end)
      end.scrollIntoView({ behavior: 'smooth' })
    }

    renderMessages()

    function doSend(text: string) {
      if (!text) return
      messages.push({ id: Date.now(), sender: 'user', text })
      renderMessages()

      // Mock assistant reply (replace with real API call later)
      setTimeout(() => {
        const reply = `RootLens (demo): I can help with timeline and impact. You asked: "${text}"`
        messages.push({ id: Date.now() + 1, sender: 'assistant', text: reply })
        renderMessages()
      }, 700)
    }

    function onSubmit(e: Event) {
      e.preventDefault()
      if (!input) return
      const t = input.value.trim()
      if (!t) return
      input.value = ''
      doSend(t)
    }

    form?.addEventListener('submit', onSubmit)
    sendBtn?.addEventListener('click', (e) => { e.preventDefault(); if (input) { const t = input.value.trim(); if (t) { input.value = ''; doSend(t) } } })

    return () => {
      form?.removeEventListener('submit', onSubmit)
    }
  }, [imgs, setMainIdx])

  return null
}

export default IncidentPage
