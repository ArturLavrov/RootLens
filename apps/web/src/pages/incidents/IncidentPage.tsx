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
          {/* Left widgets column */}
          <div className="w-full lg:w-64 flex flex-col gap-4">
            <div className="bg-[#071022] rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-100">Participants (7)</h3>
                <button className="text-xs px-2 py-1 rounded bg-violet-600 text-white">Invite</button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar name="Alex Johnson" size={40} src="/assets/img/avatar-alex.png" />
                  <div>
                    <div className="text-sm text-slate-100 font-medium">Alex Johnson</div>
                    <div className="text-xs text-slate-400">On-call · SRE</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar name="Samantha Lee" size={40} src="/assets/img/avatar-samantha.png" />
                  <div>
                    <div className="text-sm text-slate-100 font-medium">Samantha Lee</div>
                    <div className="text-xs text-slate-400">Backend Engineer</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar name="Priya Nair" size={40} src="/assets/img/avatar-priya.png" />
                  <div>
                    <div className="text-sm text-slate-100 font-medium">Priya Nair</div>
                    <div className="text-xs text-slate-400">Frontend Engineer</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar name="Mark Rivera" size={40} src="/assets/img/avatar-mark.png" />
                  <div>
                    <div className="text-sm text-slate-100 font-medium">Mark Rivera</div>
                    <div className="text-xs text-slate-400">Product Owner</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-slate-400 mb-2">Other participants</div>
                <div className="flex -space-x-2 items-center">
                  <Avatar name="Sam" size={28} src="/assets/img/avatar-sam.png" />
                  <Avatar name="Dev" size={28} src="/assets/img/avatar-dev.png" />
                  <Avatar name="Ops" size={28} src="/assets/img/avatar-ops.png" />
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-xs text-slate-200 flex items-center justify-center">+3</div>
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
                  value={(window as any).__rl_incident_description || ''}
                  onChange={(e) => { (window as any).__rl_incident_description = e.target.value; const ev = new Event('rl:desc:change'); window.dispatchEvent(ev) }}
                  placeholder="Describe the incident, observed behavior, and any important context."
                  className="w-full h-32 bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100 resize-vertical"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Attachments</label>
                <div className="flex items-center gap-2">
                  <input id="rl-attach-input" type="file" multiple className="text-sm text-slate-200" />
                  <button id="rl-attach-clear" className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-200">Clear</button>
                </div>

                <div id="rl-attach-list" className="mt-3 text-sm text-slate-400 space-y-2"></div>
                <div className="mt-3 text-xs text-slate-500">Attach screenshots, logs or other files. Files are stored locally in the browser for this demo.</div>
              </div>

              <script dangerouslySetInnerHTML={{__html: `
                (function(){
                  const input = document.getElementById('rl-attach-input');
                  const clearBtn = document.getElementById('rl-attach-clear');
                  const list = document.getElementById('rl-attach-list');
                  if(!input||!list) return;
                  const filesState = (window as any).__rl_files = (window as any).__rl_files || [];

                  function render() {
                    list.innerHTML = '';
                    filesState.forEach((f:any, idx:number) => {
                      const row = document.createElement('div');
                      row.className = 'flex items-center justify-between bg-slate-900/20 px-3 py-2 rounded';
                      const left = document.createElement('div');
                      left.className = 'flex items-center gap-3';
                      const name = document.createElement('div');
                      name.className = 'text-slate-100';
                      name.textContent = f.name + ' (' + Math.round(f.size/1024) + ' KB)';
                      left.appendChild(name);
                      row.appendChild(left);
                      const rm = document.createElement('button');
                      rm.className = 'text-xs px-2 py-1 rounded bg-slate-800 text-slate-200';
                      rm.textContent = 'Remove';
                      rm.addEventListener('click', ()=>{ filesState.splice(idx,1); render(); });
                      row.appendChild(rm);
                      list.appendChild(row);
                    });
                  }

                  input.addEventListener('change', (e:any)=>{
                    const fl = Array.from(e.target.files || []);
                    for(const f of fl) filesState.push(f);
                    render();
                    input.value = '';
                  });

                  clearBtn?.addEventListener('click', ()=>{ filesState.length = 0; render(); });

                  render();
                })();
              `}} />
            </div>

            <div className="bg-[#071022] rounded-lg p-4 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100 mb-3">Mitigation steps</h3>

              <div id="rl-mitigation-table-wrapper" className="overflow-x-auto" style={{display: 'none'}}>
                <table className="w-full text-sm table-fixed">
                  <thead>
                    <tr className="text-slate-400 text-left">
                      <th className="w-12 px-2">&nbsp;</th>
                      <th className="px-2">Step</th>
                      <th className="w-28 px-2">Status</th>
                      <th className="w-20 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="rl-mitigation-tbody" className="text-slate-200"></tbody>
                </table>
              </div>

              <form id="rl-mitigation-form" className="mt-3 flex gap-2 items-center" onSubmit={(e) => { e.preventDefault(); const input = document.getElementById('rl-mitigation-input') as HTMLInputElement | null; if (input) { const v = input.value.trim(); if (v) { try { if (typeof (window as any).__addMitigation === 'function') { (window as any).__addMitigation(v); } else { try { window.dispatchEvent(new CustomEvent('rl:addMitigation', { detail: v })); } catch(e){} setTimeout(()=>{ if (typeof (window as any).__addMitigation === 'function') { try { (window as any).__addMitigation(v); } catch(e){} } }, 150); } } catch(err){ /* swallow */ } } input.value = ''; } }}>
                <input id="rl-mitigation-input" placeholder="Add step..." className="flex-1 bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100 text-sm" />
                <button className="text-xs px-3 py-2 rounded bg-violet-600 text-white">Add</button>
              </form>

              <script dangerouslySetInnerHTML={{__html: `
                (function(){
                  const wrapper = document.getElementById('rl-mitigation-table-wrapper');
                  const tbody = document.getElementById('rl-mitigation-tbody');
                  if(!tbody) return;
                  const storageKey = 'rl_mitigations_v1';
                  let state = [];
                  try {
                    const raw = localStorage.getItem(storageKey);
                    state = raw ? JSON.parse(raw) : [];
                  } catch(e) { state = []; }

                  function persist(){ try{ localStorage.setItem(storageKey, JSON.stringify(state)); }catch(e){} }
                  function updateWrapper(){ if(!wrapper) return; wrapper.style.display = state.length ? '' : 'none'; }

                  function render(){
                    tbody.innerHTML = '';
                    state.forEach((s:any, idx:number)=>{
                      const tr = document.createElement('tr');
                      tr.className = 'align-top border-t border-slate-800';

                      const tdCb = document.createElement('td');
                      tdCb.className = 'px-2 py-3';
                      const cb = document.createElement('input');
                      cb.type = 'checkbox';
                      cb.checked = !!s.done;
                      cb.addEventListener('change', ()=>{ state[idx].done = cb.checked; render(); persist(); updateWrapper(); });
                      tdCb.appendChild(cb);
                      tr.appendChild(tdCb);

                      const tdText = document.createElement('td');
                      tdText.className = 'px-2 py-3';
                      const txt = document.createElement('div');
                      txt.className = 'text-slate-100';
                      txt.textContent = s.text;
                      if(s.done) txt.style.textDecoration = 'line-through';
                      tdText.appendChild(txt);
                      tr.appendChild(tdText);

                      const tdStatus = document.createElement('td');
                      tdStatus.className = 'px-2 py-3 text-slate-300';
                      tdStatus.textContent = s.done ? 'Done' : 'TODO';
                      tr.appendChild(tdStatus);

                      const tdAct = document.createElement('td');
                      tdAct.className = 'px-2 py-3';
                      const rm = document.createElement('button');
                      rm.className = 'text-xs px-2 py-1 rounded bg-slate-800 text-slate-200';
                      rm.textContent = 'Remove';
                      rm.addEventListener('click', ()=>{ state.splice(idx,1); render(); persist(); updateWrapper(); });
                      tdAct.appendChild(rm);
                      tr.appendChild(tdAct);

                      tbody.appendChild(tr);
                    });
                    updateWrapper();
                    persist();
                  }

                  function __addMitigation_internal(text:any){ if(!text) return; state.push({text: String(text), done:false}); render(); }
                  (window as any).__addMitigation = __addMitigation_internal;
                  window.addEventListener('rl:addMitigation', function(e:any){ __addMitigation_internal(e && e.detail ? e.detail : e); });

                  render();
                })();
              `}} />
            </div>
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
