import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '../pages/dashboard/DashboardPage'
import IncidentsPage from '../pages/incidents/IncidentsPage'
import InvestigationsPage from '../pages/investigations/InvestigationsPage'
import PostmortemsPage from '../pages/postmortems/PostmortemsPage'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/investigations" element={<InvestigationsPage />} />
        <Route path="/postmortems" element={<PostmortemsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
