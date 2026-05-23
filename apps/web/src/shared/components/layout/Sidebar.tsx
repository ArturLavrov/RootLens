import React from 'react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/incidents', label: 'Incidents', icon: '⚠️' },
  { to: '/investigations', label: 'Investigations', icon: '🔎' },
  { to: '/postmortems', label: 'Postmortems', icon: '📄' },
]

export default function Sidebar() {
  return (
    <div className="h-screen sticky top-0 bg-[#071020] border-r border-slate-800 text-slate-300 flex flex-col">
      <div className="px-4 py-6 flex items-center gap-3">
      <img src="/assets/img/logo.png" alt="RootLence logo" className="h-10 w-10 rounded-md object-cover" />
        <div>
          <div className="text-white font-semibold">RootLens</div>
          <div className="text-xs text-slate-400">Operational Intelligence</div>
        </div>
      </div>

      <nav className="mt-6 px-2 flex-1">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-3 py-2 rounded-md my-1 hover:bg-slate-800/50 ${isActive ? 'bg-slate-800/60 text-white' : 'text-slate-300'}`
            }
          >
            <span className="w-6 text-center">{it.icon}</span>
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-6">
        <div className="text-xs text-slate-400 mb-2">Quick Actions</div>
        <button className="w-full text-left px-3 py-2 bg-slate-900/40 rounded-md text-sm">New Investigation</button>
      </div>
    </div>
  )
}
