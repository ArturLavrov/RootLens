import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../../shared/components/layout/AppShell'
import Avatar from '../../shared/components/ui/Avatar'
import CreateIncidentModal from './CreateIncidentModal'

function InviteModal({ open, onClose, onAdd, existing } : { open:boolean; onClose: ()=>void; onAdd: (items:any[])=>void; existing:any[] }) {
  if(!open) return null;
  const SUGGESTED = [
    { name: 'Alex Johnson', title: 'SRE', src: '/assets/img/avatar-alex.png' },
    { name: 'Samantha Lee', title: 'Backend Engineer', src: '/assets/img/avatar-samantha.png' },
    { name: 'Priya Nair', title: 'Frontend Engineer', src: '/assets/img/avatar-priya.png' },
    { name: 'Mark Rivera', title: 'Product Owner', src: '/assets/img/avatar-mark.png' },
    { name: 'Sam Ortiz', title: 'Developer', src: '/assets/img/avatar-sam.png' },
    { name: 'Dev Ops', title: 'Operator', src: '/assets/img/avatar-dev.png' },
    { name: 'Olga Petrova', title: 'QA', src: undefined }
  ];
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<any[]>([]);
  React.useEffect(()=>{ if(!open){ setQuery(''); setSelected([]); } }, [open]);
  const lower = query.trim().toLowerCase();
  const filtered = SUGGESTED.filter(s => s.name.toLowerCase().includes(lower) || s.title.toLowerCase().includes(lower));
  function toggle(item:any){ const exists = selected.find(s=>s.name===item.name); if(exists) setSelected(sel=>sel.filter(s=>s.name!==item.name)); else setSelected(sel=>[...sel,item]); }
  function doAdd(){ if(selected.length) onAdd(selected); else if(query.trim()) onAdd([{ name: query.trim(), title: '', src: undefined }]); }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#071022] rounded-lg p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-slate-100">Invite participants</div>
          <button onClick={onClose} className="text-slate-400">✕</button>
        </div>
        <div className="mb-3">
          <input autoFocus value={query} onChange={(e)=>setQuery((e.target as HTMLInputElement).value)} placeholder="Search people" className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100 text-sm" />
        </div>
        <div className="mb-3">
          <div className="text-xs text-slate-400 mb-2">Suggested</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filtered.map((s,idx)=>{
              const already = existing.find(e=>e.name===s.name);
              const isSel = !!selected.find(ss=>ss.name===s.name);
              return (
                <div key={idx} className={`flex items-center justify-between px-2 py-2 rounded ${already ? 'opacity-50' : 'hover:bg-slate-900/20'}`}>
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size={36} src={s.src} />
                    <div>
                      <div className="text-sm text-slate-100">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.title}</div>
                    </div>
                  </div>
                  <div>
                    {already ? <div className="text-xs text-slate-400">Added</div> : (
                      <button type="button" onClick={()=>toggle(s)} className={`text-xs px-2 py-1 rounded ${isSel? 'bg-slate-700 text-white':'bg-slate-800 text-slate-200'}`}>
                        {isSel? 'Selected': 'Select'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="mb-3">
          <div className="text-xs text-slate-400 mb-2">Selected</div>
          <div className="flex flex-wrap gap-2">
            {selected.map((s,idx)=> (
              <div key={idx} className="bg-slate-800 px-2 py-1 rounded flex items-center gap-2 text-sm">
                <div className="text-slate-100">{s.name}</div>
                <button onClick={()=>setSelected(sel=>sel.filter(x=>x.name!==s.name))} className="text-xs text-slate-400">✕</button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-xs px-3 py-2 rounded bg-slate-800 text-slate-200">Cancel</button>
          <button onClick={()=>{ doAdd(); onClose(); }} className="text-xs px-3 py-2 rounded bg-violet-600 text-white">Add</button>
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error: any}> {
  constructor(props: any) {
    super(props)
    this.state = { error: null }
  }
  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught error in IncidentPage:', error, info)
    this.setState({ error })
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6">
          <div className="bg-red-900 text-red-100 rounded p-4">An error occurred while rendering the Incident page. Check the browser console for details.</div>
        </div>
      )
    }
    return this.props.children as any
  }
}

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

  // Incident description state (controlled React state so textarea is editable)
  const [description, setDescription] = React.useState<string>(() => (window as any).__rl_incident_description || '');
  React.useEffect(() => { try { (window as any).__rl_incident_description = description; const ev = new Event('rl:desc:change'); window.dispatchEvent(ev);} catch(e){} }, [description]);

  // Editable title state
  const [title, setTitle] = React.useState<string>(() => (window as any).__rl_incident_title || '');
  React.useEffect(() => { try { (window as any).__rl_incident_title = title; } catch (e) {} }, [title]);

  // Participants state & invite modal
  const [participants, setParticipants] = React.useState(() => ([
    { name: 'Alex Johnson', title: 'On-call · SRE', src: '/assets/img/avatar-alex.png' },
    { name: 'Samantha Lee', title: 'Backend Engineer', src: '/assets/img/avatar-samantha.png' },
    { name: 'Priya Nair', title: 'Frontend Engineer', src: '/assets/img/avatar-priya.png' },
    { name: 'Mark Rivera', title: 'Product Owner', src: '/assets/img/avatar-mark.png' },
  ]));
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [participantsLoading, setParticipantsLoading] = React.useState(false);
  const [participantToRemove, setParticipantToRemove] = React.useState<any | null>(null);

  async function fetchIncidents() {
    setLoadingIncidents(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/incidents', { headers: { Accept: 'application/json' } })
      if (!res.ok) return
      const data = await res.json()
      const mapped = (data || []).map((it: any) => ({
        // keep both GUID (id) and public_id; UI shows public id but store GUID as guid
        id: it.public_id || it.id,
        guid: it.id,
        public_id: it.public_id,
        title: it.title,
        severity: (function(s){ const v = (s||'').toLowerCase(); if(v==='critical' || v==='high') return 'High'; if(v==='medium') return 'Medium'; return 'Low' })(it.severity),
        environment: it.env || it.environment || 'Production',
        startTime: it.reported_date || it.created_on || it.reported_at || ''
      }))
      setIncidents(mapped)
      // store GUID for current route in localStorage for quick access
      const found = mapped.find(m => m.guid === incId || m.id === incId || m.public_id === incId)
      if(found && found.guid){
        setGuidId(found.guid)
        try{ localStorage.setItem(`rl_incident_guid_${incId}`, found.guid); }catch(e){}
      }
      const total = (data && (data.total || data.count || (data.meta && data.meta.total))) || mapped.length
      setTotalIncidents(total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingIncidents(false)
    }
  }

  React.useEffect(() => { fetchIncidents() }, [])

  const [saving, setSaving] = React.useState(false);
  const [guidId, setGuidId] = React.useState<string | undefined>(() => {
    try{ const k = localStorage.getItem(`rl_incident_guid_${window.location.pathname.split('/').pop()}`); return k || undefined }catch(e){ return undefined }
  });

  React.useEffect(()=>{
    // whenever guidId changes persist for the current route param
    try{ if(guidId) localStorage.setItem(`rl_incident_guid_${incId}`, guidId); }catch(e){}
  }, [guidId, incId]);

  // Fetch participants for the current incident from backend when GUID becomes available
  async function fetchParticipantsForIncident(guid?: string){
    setParticipantsLoading(true)
    try{
      const useGuid = guid || guidId || (incId && (()=>{ try{ return localStorage.getItem(`rl_incident_guid_${incId}`) }catch(e){return null} })());
      if(!useGuid){ setParticipantsLoading(false); return }
      const res = await fetch(`http://127.0.0.1:8000/api/v1/incidents/${useGuid}`, { headers: { Accept: 'application/json' } })
      if(!res.ok){ console.warn('Failed to fetch incident details', res.status); setParticipantsLoading(false); return }
      const data = await res.json()
      const ps = (data.participants || []).map((p:any) => ({ name: p.name || p.display_name || p.email || p.id, title: (p.title || ''), src: undefined, email: p.email, id: p.id }))
      setParticipants(ps)
    }catch(e){ console.error('fetchParticipantsForIncident error', e) }finally{ setParticipantsLoading(false) }
  }

  React.useEffect(()=>{
    fetchParticipantsForIncident()
  }, [guidId, incId])

  async function saveIncident({ participants: participantsOverride, title: titleOverride }: { participants?: any[]; title?: string } = {}){
    if(!incId) return;
    setSaving(true);
    try{
      const useGuid = guidId || (current && (current.guid || current.id));
      if(!useGuid){
        alert('Cannot save: incident GUID not available');
        setSaving(false);
        return;
      }

      const titleToUse = titleOverride ?? title ?? (current && current.title) ?? `Incident ${incId}`;
      const participantsToUse = participantsOverride ?? participants ?? [];

      const payload = {
        id: useGuid,
        title: titleToUse,
        severity: current.severity || 'Low',
        description,
        env: current.environment || 'Production',
        affected_clients: [],
        participants: participantsToUse.map((p:any) => ({ id: (p.name||'').toLowerCase().replace(/\s+/g,'-'), name: p.name, email: (p.email || (p.name? p.name.split(" ").join('.').toLowerCase()+"@example.com": '')) })),
        affects_all_clients: true,
      };
      const res = await fetch(`http://127.0.0.1:8000/api/v1/incidents/${useGuid}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if(res.ok){
        const data = await res.json();
        // update local incident state if needed
        setGuidId(useGuid);
        // persist title locally
        try{ localStorage.setItem(`rl_incident_title_${useGuid}`, titleToUse); }catch(e){}
        alert('Incident saved');
      } else if(res.status === 400){
        const err = await res.json().catch(()=>({ detail: 'Bad request' }));
        alert('Save failed: '+ (err.detail || JSON.stringify(err)));
      } else {
        const err = await res.text().catch(()=>null);
        alert('Save failed with status '+res.status+': '+err);
      }
    }catch(e){
      console.error(e);
      alert('Save error: '+String(e));
    }finally{ setSaving(false); }
  }

  const current = incidents.find(i => i.guid === incId || i.id === incId || i.public_id === incId) || { title: '', severity: 'Low', environment: '', startTime: '' }

  React.useEffect(()=>{
    // keep editable title in sync when incident loaded/changed
    try{ setTitle(current.title || `Incident ${incId}`); }catch(e){}
  }, [incidents, incId]);

  // Debug: log types to help locate "can't convert Component to primitive type"
  React.useEffect(()=>{
    try{
      const badParticipant = participants.find(p => typeof p.name !== 'string')
      if(badParticipant){
        console.error('Participant with non-string name detected', badParticipant)
      }
      if(typeof title !== 'string') console.error('Title is non-string', title)
      if(current && typeof current.title !== 'string') console.error('current.title is non-string', current.title)
    }catch(e){ console.error('debug check failed', e) }
  }, [participants, title, current])

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
                  <input value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} onBlur={() => { saveIncident({ title }); }} className="text-2xl font-semibold text-slate-100 bg-transparent border-0 focus:outline-none" />
                  <div className="text-sm text-slate-400 bg-slate-800 px-2 py-1 rounded">ID: {incId}</div>
                  <span className="ml-2 inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-red-600 text-white">{(current.severity || 'Low')}</span>
                </div>

                <div className="mt-3 text-sm text-slate-400 flex flex-wrap items-center gap-2">
                  <span className="bg-slate-800 px-2 py-1 rounded">Env: {current.environment || '—'}</span>
                  <span className="bg-slate-800 px-2 py-1 rounded">Started: {formatDate(current.startTime)}</span>
                  <span className="bg-slate-800 px-2 py-1 rounded">Status: Investigating</span>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left widgets column */}
          <div className="w-full lg:w-64 flex flex-col gap-4">
            <div className="bg-[#071022] rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-100">Participants ({participants.length})</h3>
                <button onClick={() => setInviteOpen(true)} className="text-xs px-2 py-1 rounded bg-violet-600 text-white">Invite</button>
              </div>

              <div className="space-y-3">
                {participantsLoading ? (
                  <div className="text-sm text-slate-400">Loading participants...</div>
                ) : participants.length === 0 ? (
                  <div className="text-sm text-slate-400">No participants yet.</div>
                ) : (
                  participants.slice(0,4).map((p, i) => (
                    <div key={i} tabIndex={0} className="group flex items-center justify-between gap-3 rounded px-2 py-1 focus-within:ring-2 focus-within:ring-violet-600">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.name} size={40} src={p.src} />
                        <div>
                          <div className="text-sm text-slate-100 font-medium">{p.name}</div>
                          <div className="text-xs text-slate-400">{p.title}</div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                        <button aria-label={`Remove ${p.name}`} title={`Remove ${p.name}`} onClick={() => setParticipantToRemove(p)} className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-red-600 text-slate-200">✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4">
                <div className="text-xs text-slate-400 mb-2">Other participants</div>
                <div className="flex -space-x-2 items-center">
                  {participants.slice(4,7).map((p,i)=> <Avatar key={i} name={p.name} size={28} src={p.src} />)}
                  {participants.length > 7 ? <div className="w-7 h-7 rounded-full bg-slate-800 text-xs text-slate-200 flex items-center justify-center">+{participants.length-7}</div> : null}
                </div>
              </div>
            </div>

            <div className="bg-[#071022] rounded-lg p-4 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100 mb-3">Related links</h3>
              <ul className="text-sm text-slate-400 space-y-3">
                <li className="flex items-center gap-3">
                  {/* Slack multicolor mark */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x="3" y="3" width="6" height="6" rx="2" fill="#611f69" />
                    <rect x="15" y="3" width="6" height="6" rx="2" fill="#ecb22e" />
                    <rect x="3" y="15" width="6" height="6" rx="2" fill="#36c5f0" />
                    <rect x="15" y="15" width="6" height="6" rx="2" fill="#e01e5a" />
                  </svg>
                  <a className="text-slate-200 hover:underline" href={`https://slack.com/app_redirect?channel=inc-${incId}`} target="_blank" rel="noopener noreferrer">#inc-{incId}</a>
                </li>

                <li className="flex items-center gap-3">
                  {/* Microsoft Teams simplified mark */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x="2" y="4" width="7" height="16" rx="2" fill="#6264A7" />
                    <circle cx="17" cy="9" r="4" fill="#6264A7" />
                    <path d="M15 11V7l3 2-3 2z" fill="#fff" opacity="0.95" />
                  </svg>
                  <a className="text-slate-200 hover:underline" href={`https://teams.microsoft.com/l/call/0/0?users=incident-${incId}@example.com`} target="_blank" rel="noopener noreferrer">Join call</a>
                </li>

                <li className="flex items-center gap-3">
                  {/* PagerDuty simplified mark */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <circle cx="12" cy="12" r="10" fill="#FF7A00" />
                    <path d="M12 7c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-1.1.9-2 2-2z" fill="#fff" />
                  </svg>
                  <a className="text-slate-200 hover:underline" href={`https://yourcompany.pagerduty.com/incidents/${incId}`} target="_blank" rel="noopener noreferrer">{incId}</a>
                </li>

              </ul>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-[#071022] rounded-lg p-4 border border-slate-800">
              <h2 className="text-lg font-semibold text-slate-100 mb-3">Incident details</h2>

              <div className="mb-4">
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the incident, observed behavior, and any important context."
                  className="w-full h-32 bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100 resize-vertical"
                />
                <div className="mt-3 flex justify-end">
                  <button onClick={async ()=>{ await saveIncident(); }} disabled={saving} className={`text-sm px-3 py-2 rounded ${saving? 'bg-slate-700 text-slate-300':'bg-violet-600 text-white'}`}>
                    {saving? 'Saving...':'Save'}
                  </button>
                </div>
              </div>

<Attachments />            </div>

            <Mitigations />
          </div>

          <aside className="w-full lg:w-80 flex flex-col gap-4">
            {/* Chat assistant aside (matches mockup) */}
            <div className="bg-[#071022] rounded-lg p-3 border border-slate-800 flex flex-col h-[640px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src="/assets/img/logo.png" alt="RootLens" className="w-8 h-8 rounded" />
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


            {/* Chat state and handlers implemented via a small embedded component */}
            <ChatWidget imgs={imgs} setMainIdx={setMainIdx} />
          </aside>
        </div>

        <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} onAdd={async (items:any[]) => { const newParticipants = (() => { const prev = participants; const names = new Set(prev.map(p=>p.name)); const toAdd = items.filter(i => !names.has(i.name)).map(i=>({ name: i.name, title: i.title || '', src: i.src || undefined })); return [...prev, ...toAdd]; })(); setParticipants(newParticipants); setInviteOpen(false); try{ await saveIncident({ participants: newParticipants }); }catch(e){ console.error('Auto-save after invite failed', e); } }} existing={participants} />

        <ConfirmRemoveModal item={participantToRemove} onClose={() => setParticipantToRemove(null)} onConfirm={async () => { if(participantToRemove){ const newList = participants.filter(p => p.name !== participantToRemove.name); setParticipants(newList); setParticipantToRemove(null); try{ await saveIncident({ participants: newList }); }catch(e){ console.error('Auto-save after remove failed', e); } } }} />

        <CreateIncidentModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={() => fetchIncidents()} />
      </div>
    </AppShell>
  )
}

function Attachments(){
  const [files, setFiles] = React.useState<File[]>(() => (window as any).__rl_files || []);
  const [urls, setUrls] = React.useState<string[]>(() => (window as any).__rl_file_urls || []);

  React.useEffect(()=>{ (window as any).__rl_files = files; (window as any).__rl_file_urls = urls; }, [files, urls]);

  React.useEffect(()=>{
    // revoke urls on unmount
    return () => { urls.forEach(u=>{ try{ URL.revokeObjectURL(u); }catch(e){} }); };
  }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement>){
    const fl = Array.from(e.target.files || []);
    const newUrls = fl.map(f => URL.createObjectURL(f));
    setFiles(prev => [...prev, ...fl]);
    setUrls(prev => [...prev, ...newUrls]);
    e.currentTarget.value = '';
  }
  function removeAt(idx:number){
    setFiles(prev => { const copy = [...prev]; copy.splice(idx,1); return copy; });
    setUrls(prev => { const copy = [...prev]; const u = copy.splice(idx,1); try{ if(u && u[0]) URL.revokeObjectURL(u[0]); }catch(e){} return copy; });
  }
  function clearAll(){
    urls.forEach(u=>{ try{ URL.revokeObjectURL(u); }catch(e){} });
    setFiles([]); setUrls([]);
  }

  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">Attachments</label>
      <div className="flex items-center gap-2">
        <input id="rl-attach-input" type="file" multiple onChange={onChange} className="text-sm text-slate-200" />
        <button type="button" onClick={clearAll} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-200">Clear</button>
      </div>

      <div id="rl-attach-list" className="mt-3 text-sm text-slate-400 space-y-2">
        {files.map((f, idx) => (
          <div key={idx} className="flex items-center justify-between bg-slate-900/20 px-3 py-2 rounded">
            <div className="flex items-center gap-3">
              {f.type.startsWith('image/') ? (
                <img src={urls[idx]} className="w-10 h-10 object-cover rounded" alt="thumb" />
              ) : (
                <div className="w-10 h-10 rounded bg-slate-900/40 flex items-center justify-center text-xs text-slate-200">{(f.name||'').split('.').pop()?.toUpperCase() || 'FILE'}</div>
              )}
              <div className="text-slate-100">{f.name} ({Math.round(f.size/1024)} KB)</div>
            </div>
            <button type="button" onClick={()=>removeAt(idx)} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-200">Remove</button>
          </div>
        ))}
      </div>

      <div id="rl-attach-thumbs" className="mt-3 flex items-center gap-2 overflow-x-auto">
        {files.map((f, idx) => (
          <div key={idx} className="flex flex-col items-center text-xs text-slate-200">
            {f.type.startsWith('image/') ? (
              <img src={urls[idx]} className="w-20 h-14 object-cover rounded" alt="thumb" />
            ) : (
              <div className="w-20 h-14 rounded bg-slate-900/40 flex items-center justify-center text-sm text-slate-200">{(f.name||'').split('.').pop()?.toUpperCase() || 'FILE'}</div>
            )}
            <div className="mt-1 text-xs text-slate-300 truncate" style={{maxWidth: 90}}>{f.name}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-slate-500">Attach screenshots, logs or other files. Files are stored locally in the browser for this demo.</div>
    </div>
  )
}

function Mitigations(){
  const storageKey = 'rl_mitigations_v1';
  const [items, setItems] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch(e){ return []; }
  });
  const [text, setText] = React.useState('');

  React.useEffect(()=>{ try{ localStorage.setItem(storageKey, JSON.stringify(items)); }catch(e){} }, [items]);

  function add(e:any){ if(e && e.preventDefault) e.preventDefault(); const v = (text||'').trim(); if(!v) return; setItems(prev=>[...prev, { text: v, done: false }]); setText(''); }
  function remove(idx:number){ setItems(prev => prev.filter((_,i)=> i!==idx)); }
  function toggle(idx:number){ setItems(prev => prev.map((it,i)=> i===idx ? { ...it, done: !it.done } : it)); }

  return (
    <div className="bg-[#071022] rounded-lg p-4 border border-slate-800">
      <h3 className="text-sm font-semibold text-slate-100 mb-3">Mitigation steps</h3>

      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="text-slate-400 text-left">
                <th className="w-12 px-2">&nbsp;</th>
                <th className="px-2">Step</th>
                <th className="w-28 px-2">Status</th>
                <th className="w-20 px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {items.map((it:any, idx:number) => (
                <tr key={idx} className="align-top border-t border-slate-800">
                  <td className="px-2 py-3">
                    <input type="checkbox" checked={!!it.done} onChange={() => toggle(idx)} />
                  </td>
                  <td className="px-2 py-3">
                    <div className="text-slate-100" style={{ textDecoration: it.done ? 'line-through' : 'none' }}>{it.text}</div>
                  </td>
                  <td className="px-2 py-3 text-slate-300">{it.done ? 'Done' : 'TODO'}</td>
                  <td className="px-2 py-3">
                    <button type="button" onClick={() => remove(idx)} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-200">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-slate-400">No mitigation steps yet. Add the first step below.</div>
      )}

      <form onSubmit={add} className="mt-3 flex gap-2 items-center">
        <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Add step..." className="flex-1 bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100 text-sm" />
        <button className="text-xs px-3 py-2 rounded bg-violet-600 text-white">Add</button>
      </form>
    </div>
  )
}

function ConfirmRemoveModal({ item, onClose, onConfirm } : { item:any|null; onClose: ()=>void; onConfirm: ()=>void }) {
  if(!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-[#071022] rounded-lg p-4 border border-slate-800">
        <div className="text-sm text-slate-100 mb-3">Remove {item.name} from this incident?</div>
        <div className="text-xs text-slate-400 mb-4">This will remove the participant from the incident workspace.</div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-xs px-3 py-2 rounded bg-slate-800 text-slate-200">Cancel</button>
          <button onClick={() => { onConfirm(); }} className="text-xs px-3 py-2 rounded bg-red-600 text-white">Remove</button>
        </div>
      </div>
    </div>
  );
}

function ChatWidget({ imgs, setMainIdx }: { imgs: string[]; setMainIdx: (n: number) => void }) {
  React.useEffect(() => {
    const container = document.getElementById('rl-chat-container')
    const form = document.getElementById('rl-chat-form') as HTMLFormElement | null
    const input = document.getElementById('rl-chat-input') as HTMLInputElement | null
    const sendBtn = document.getElementById('rl-chat-send') as HTMLButtonElement | null

    const messages: { id: number; sender: 'user' | 'assistant'; html: string }[] = [
      { id: 0, sender: 'assistant', html: '<div class="text-xs text-slate-400">Hello — ask me about this incident. I can suggest similar incidents and mitigation steps.</div>' }
    ]

    function escapeHtml(s: string) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

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
        bubble.innerHTML = m.html
        el.appendChild(bubble)
        wrapper.appendChild(el)
      })
      container.appendChild(wrapper)
      const end = document.createElement('div')
      end.id = 'rl-chat-end'
      container.appendChild(end)
      end.scrollIntoView({ behavior: 'smooth' })

      // attach preview button handlers
      const btns = container.querySelectorAll('.rl-preview-btn')
      btns.forEach(b => {
        // avoid attaching duplicate handlers
        const existing = (b as any).__rl_handler
        if (existing) return
        const handler = (e: Event) => {
          const idx = parseInt((b as HTMLElement).getAttribute('data-img') || '0', 10)
          setMainIdx(idx)
        }
        ;(b as any).__rl_handler = handler
        b.addEventListener('click', handler)
      })
    }

    renderMessages()

    function synthSimilar() {
      // Simple mocked similar-incident results; replace with real search later
      const items = [
        { id: 'INC-101', title: 'Database connection timeout', severity: 'High', imgIdx: 0 },
        { id: 'INC-087', title: 'API 503 spike', severity: 'Medium', imgIdx: 1 },
        { id: 'INC-045', title: 'Background job failure', severity: 'Low', imgIdx: 2 }
      ]

      let html = '<div class="text-sm font-semibold text-slate-100 mb-2">Similar incidents</div><div class="space-y-2">'
      items.forEach(it => {
        html += `<div class="flex items-center justify-between bg-slate-900/20 px-3 py-2 rounded">` +
                `<div>` +
                  `<div class="text-sm text-slate-100 font-medium">${it.title}</div>` +
                  `<div class="text-xs text-slate-400">ID: ${it.id} · ${it.severity}</div>` +
                `</div>` +
                `<button data-img="${it.imgIdx}" class="rl-preview-btn text-xs px-2 py-1 rounded bg-slate-800 text-slate-200">Preview</button>` +
                `</div>`
      })
      html += '</div>'
      return html
    }

    function synthMitigations() {
      return '<div class="text-sm font-semibold text-slate-100 mb-2">Proposed steps</div>' +
             '<ol class="list-decimal list-inside text-sm text-slate-400 space-y-1">' +
             '<li>Collect logs and traces for the affected services to identify the root cause.</li>' +
             '<li>Isolate the impacted instances and reroute traffic if possible.</li>' +
             '<li>Apply a hotfix or rollback the last deployment if correlated with the issue.</li>' +
             '<li>Scale up resources temporarily and monitor system metrics closely.</li>' +
             '<li>After stabilizing, perform a post-incident review and follow-up remediation.</li>' +
             '</ol>'
    }

    function doSend(text: string) {
      if (!text) return
      messages.push({ id: Date.now(), sender: 'user', html: `<div class="inline-block">${escapeHtml(text)}</div>` })
      renderMessages()

      // Mock assistant reply composed of similar incidents + mitigations
      setTimeout(() => {
        const replyHtml = `<div>${synthSimilar()}<div class="mt-3">${synthMitigations()}</div></div>`
        messages.push({ id: Date.now() + 1, sender: 'assistant', html: replyHtml })
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
