import React from 'react'
import AppShell from '../../shared/components/layout/AppShell'

export default function IncidentPrototypePage() {
  const imgs = [
    '/assets/img/incident_page.png',
    '/assets/img/incidents_page_fix.png',
    '/assets/img/create_incident_page_fixed.png',
    '/assets/img/declare_incident_popup.png'
  ]

  return (
    <AppShell>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main preview */}
          <div className="flex-1 bg-[#071022] rounded-lg p-4 border border-slate-800 shadow-sm">
            <div className="text-sm text-slate-400 mb-3">Prototype — Incident UI</div>
            <div className="w-full h-[560px] flex items-center justify-center bg-slate-900/20 rounded overflow-hidden">
              <img src={imgs[0]} alt="Incident prototype" className="max-h-full max-w-full object-contain" />
            </div>
            <p className="mt-3 text-sm text-slate-400">This page presents a high-fidelity prototype of the incident UI. Use the thumbnails to the right to preview related screens: listing, create flow and the declare popup.</p>
          </div>

          {/* Thumbnails & actions */}
          <aside className="w-full lg:w-80 flex flex-col gap-4">
            <div className="bg-[#071022] rounded-lg p-3 border border-slate-800">
              <div className="grid grid-cols-1 gap-3">
                {imgs.slice(1).map((src, idx) => (
                  <div key={idx} className="h-36 bg-slate-900/10 rounded overflow-hidden border border-slate-800 flex items-center justify-center">
                    <img src={src} alt={`thumb-${idx}`} className="max-h-full max-w-full object-contain" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#071022] rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-slate-100">Interactions & Patterns</h3>
              <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
                <li>Primary action: Declare incident (prominent, violet).</li>
                <li>Table rows: clickable, hover highlight and subtle border.</li>
                <li>Cards and modals: dark surface, clear headings and compact forms.</li>
              </ul>
              <div className="mt-2 flex gap-2">
                <a href="/incidents" className="flex-1 text-center px-3 py-2 rounded bg-slate-800 text-slate-200 hover:bg-slate-700">Open Incidents (live)</a>
                <button className="px-3 py-2 rounded bg-violet-600 text-white">Preview Interaction</button>
              </div>
            </div>

            <div className="text-xs text-slate-500">Assets: taken from /assets/img to match mockups. This prototype uses existing shared UI components and app shell for consistency.</div>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
