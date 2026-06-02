import React, { useState } from 'react'
import Avatar from '../../shared/components/ui/Avatar'

export default function CreateIncidentModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated?: (inc?: any) => void }) {
  if (!open) return null

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('CRITICAL')
  const [environment, setEnvironment] = useState('PROD')
  const [startTime, setStartTime] = useState('')
  const [clients, setClients] = useState<string[]>([])
  const [clientInput, setClientInput] = useState('')

  function getLogo(name: string) {
    const domain = `${name.replace(/\s+/g, '').toLowerCase()}.com`
    return `https://logo.clearbit.com/${domain}`
  }

  function addClientsFromText(text: string) {
    const parts = text.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length === 0) return
    setClients((prev) => {
      const next = [...prev]
      for (const p of parts) if (!next.includes(p)) next.push(p)
      return next
    })
  }

  function handleClientKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addClientsFromText(clientInput)
      setClientInput('')
    }
  }

  function removeClient(idx: number) {
    setClients((prev) => prev.filter((_, i) => i !== idx))
  }

  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const affected_clients = clients.map((c) => ({ id: c.replace(/\s+/g, '-').toLowerCase(), name: c }))
    const payload = {
      title,
      severity,
      description: `${title} (declared via UI)`,
      env: environment,
      affected_clients,
      affects_all_clients: false
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.status === 201 || res.ok) {
        console.log('Incident created')
        let data = null
        try { data = await res.json() } catch (_) { /* no json */ }
        if (onCreated) onCreated(data)
        onClose()
      } else {
        const text = await res.text()
        console.error('Failed to create incident', res.status, text)
        alert('Failed to create incident: ' + res.status)
      }
    } catch (err) {
      console.error('Failed to call API', err)
      alert('Network error when creating incident')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-[92%] max-w-3xl bg-[#071022] border border-slate-800 rounded-lg p-6 shadow-lg z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Declare Incident</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">✕</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100" placeholder="Brief incident title" />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100 h-24" placeholder="Describe the incident and impact" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Severity</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100">
                <option>CRITICAL</option>
                <option>HIGH</option>
                <option>MEDIUM</option>
                <option>LOW</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Environment</label>
              <select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100">
                <option value="PROD">PROD</option>
                <option value="QA">QA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Start time</label>
            <input value={startTime} onChange={(e) => setStartTime(e.target.value)} type="datetime-local" className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100" />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Affected clients</label>

            <div className="flex flex-wrap gap-2 mb-2">
              {clients.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-800 text-slate-100 px-2 py-1 rounded-full ring-1 ring-slate-900">
                  <div className="w-6 h-6 overflow-hidden rounded-full">
                    <Avatar name={c} size={24} src={getLogo(c)} />
                  </div>
                  <span className="text-xs">{c}</span>
                  <button type="button" onClick={() => removeClient(idx)} className="ml-1 text-slate-400 hover:text-slate-200 text-xs">✕</button>
                </div>
              ))}

              <input
                value={clientInput}
                onChange={(e) => setClientInput(e.target.value)}
                onKeyDown={handleClientKeyDown}
                onBlur={() => { addClientsFromText(clientInput); setClientInput('') }}
                placeholder="Type a client and press Enter or paste a comma list"
                className="bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100 flex-1 min-w-[160px]"
              />
            </div>

            <p className="text-xs text-slate-500 mt-1">Tip: paste a long list — UI adapts and shows chips with logos.</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-violet-600 text-white">Declare incident</button>
          </div>
        </form>
      </div>
    </div>
  )
}
