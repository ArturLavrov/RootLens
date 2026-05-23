import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import GlobalSearch from '../ui/GlobalSearch'

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<number>(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setNotifications(Math.floor(Math.random() * 10)) // mocked inbox count
    }, 400)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="min-h-screen flex bg-[#0b1220] text-slate-200">
      <aside className="w-64">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div className="relative w-96">
              <input
                placeholder="Search incidents, services, issues..."
                className="w-full bg-transparent text-slate-200 placeholder-slate-400 rounded px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                onFocus={() => {
                  // open global search when focusing the header input (optional)
                  const ev = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
                  window.dispatchEvent(ev)
                }}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-900/30 px-2 py-0.5 rounded">Ctrl/Cmd+K</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-md bg-slate-900/40" aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0" />
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                  {notifications}
                </span>
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">JD</div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>

        <footer className="text-sm text-slate-500 p-4 border-t border-slate-800">© RootLence — Prototype</footer>
      </div>

      <GlobalSearch />
    </div>
  )
}

export default AppShell
