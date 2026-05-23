import React from 'react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v8h8V3h-8zM3 21h8v-8H3v8z"/></svg>
  )},
  { to: '/incidents', label: 'Incidents', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
  )},
  { to: '/investigations', label: 'Investigations', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
  )},
  { to: '/postmortems', label: 'Postmortems', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h10M7 11h10M7 15h7M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  )},
]

export default function Sidebar({ collapsed, onToggle }: { collapsed?: boolean; onToggle?: () => void }) {
  return (
    <div className={`h-screen sticky top-0 bg-[#07101a] border-r border-slate-900 text-slate-300 flex flex-col transition-all duration-200 ease-in-out ${collapsed ? 'px-2' : 'px-4'}`}>

      {/* Logo */}
      <div className={`py-6 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center overflow-hidden">
            <img src="/assets/img/logo.png" alt="RootLens logo" className="h-10 w-10 object-cover" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-semibold">RootLens</div>
              <div className="text-xs text-slate-400">Operational Intelligence</div>
            </div>
          )}
        </div>
      </div>

      {/* Main menu */}
      <nav className="mt-2 px-1 flex-1">
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} end>
            {({ isActive }) => (
              <div className={`relative flex items-center w-full ${collapsed ? 'justify-center' : ''}`}>
                {isActive && !collapsed && (
                  <span className="absolute left-0 h-10 w-1 rounded-r-md bg-gradient-to-b from-purple-500 to-purple-600" />
                )}

                <div className={`flex items-center gap-3 w-full h-10 px-3 my-1 rounded-md transition-colors duration-150 ${isActive ? 'bg-slate-800/60 text-white' : 'text-slate-300 hover:bg-slate-800/40'} ${collapsed ? 'px-0' : ''}`} title={it.label}>
                  <div className={`flex items-center justify-center ${isActive ? 'text-purple-400' : 'text-slate-200'} rounded-md p-2 ${collapsed ? 'p-0' : ''}`}>
                    {it.icon}
                  </div>
                  {!collapsed && <div className="flex-1">{it.label}</div>}

                  {!collapsed && (
                    <div className="text-slate-500 text-sm">&nbsp;</div>
                  )}
                </div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

    

      {/* Toggle */}
      <div className="px-2 pb-4 mt-4">
        <button onClick={onToggle} aria-label="Toggle sidebar" className="w-full flex items-center justify-center p-2 rounded-md bg-slate-900/30 hover:bg-slate-900/50">
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-200" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 6l4 4-4 4"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-200" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 6l-4 4 4 4"/></svg>
          )}
        </button>
      </div>
    </div>
  )
}
