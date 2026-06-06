import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '../pages/dashboard/DashboardPage'
import IncidentsPage from '../pages/incidents/IncidentsPage'
import InvestigationsPage from '../pages/investigations/InvestigationsPage'
import PostmortemsPage from '../pages/postmortems/PostmortemsPage'
const IncidentPage = React.lazy(() => import('../pages/incidents/IncidentPage').then(mod => {
  const comp = (mod && (mod as any).default) || (mod as any)
  if (!comp) throw new Error('Lazy import for IncidentPage did not resolve to a component')
  return { default: comp }
}) );

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/incidents/:incId" element={<React.Suspense fallback={<div className="p-6">Loading...</div>}><IncidentPage /></React.Suspense>} />
        <Route path="/investigations" element={<InvestigationsPage />} />
        <Route path="/postmortems" element={<PostmortemsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
