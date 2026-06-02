import React from 'react'

export default function CreateIncidentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-[92%] max-w-3xl bg-[#071022] border border-slate-800 rounded-lg p-6 shadow-lg z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Declare Incident</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">✕</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Title</label>
            <input required className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100" placeholder="Brief incident title" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Severity</label>
              <select className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Environment</label>
              <input className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100" placeholder="Production / Staging" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Start time</label>
            <input type="datetime-local" className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100" />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Affected clients</label>
            <input className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100" placeholder="Comma-separated client names (e.g. Spotify, Google)" />
            <p className="text-xs text-slate-500 mt-1">Tip: paste a long list — UI will adapt and show +N overflow.</p>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Participants</label>
            <input className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-slate-100" placeholder="Names, comma-separated" />
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
