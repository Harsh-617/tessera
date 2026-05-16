import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import Login from './pages/auth/Login'
import RoleSelection from './pages/auth/RoleSelection'
import MentorSetup from './pages/onboarding/MentorSetup'
import StartupSetup from './pages/onboarding/StartupSetup'

import Dashboard from './pages/admin/Dashboard'
import MatchExplorer from './pages/admin/MatchExplorer'
import AdminLinkDetail from './pages/admin/LinkDetail'
import Programmes from './pages/admin/Programmes'
import ProgrammeDetail from './pages/admin/ProgrammeDetail'
import ProgrammeSetup from './pages/admin/ProgrammeSetup'
import DnaLibrary from './pages/admin/DnaLibrary'
import Actors from './pages/admin/Actors'

import MentorHome from './pages/mentor/MentorHome'
import MentorLinkDetail from './pages/mentor/LinkDetail'
import MentorProfile from './pages/mentor/Profile'

import StartupHome from './pages/startup/StartupHome'
import StartupLinkDetail from './pages/startup/LinkDetail'
import StartupProfile from './pages/startup/Profile'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth()
  if (loading) return <div>Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />
  return children
}

function RoleHome() {
  const { role } = useAuth()
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />
  if (role === 'mentor') return <Navigate to="/mentor" replace />
  if (role === 'startup') return <Navigate to="/startup" replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/role-selection" element={<RoleSelection />} />

      {/* Onboarding */}
      <Route path="/onboarding/mentor" element={<ProtectedRoute allowedRoles={['mentor']}><MentorSetup /></ProtectedRoute>} />
      <Route path="/onboarding/startup" element={<ProtectedRoute allowedRoles={['startup']}><StartupSetup /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/match/:programmeId" element={<ProtectedRoute allowedRoles={['admin']}><MatchExplorer /></ProtectedRoute>} />
      <Route path="/admin/links/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminLinkDetail /></ProtectedRoute>} />
      <Route path="/admin/programmes" element={<ProtectedRoute allowedRoles={['admin']}><Programmes /></ProtectedRoute>} />
      <Route path="/admin/programmes/new" element={<ProtectedRoute allowedRoles={['admin']}><ProgrammeSetup /></ProtectedRoute>} />
      <Route path="/admin/programmes/:id" element={<ProtectedRoute allowedRoles={['admin']}><ProgrammeDetail /></ProtectedRoute>} />
      <Route path="/admin/dna" element={<ProtectedRoute allowedRoles={['admin']}><DnaLibrary /></ProtectedRoute>} />
      <Route path="/admin/actors" element={<ProtectedRoute allowedRoles={['admin']}><Actors /></ProtectedRoute>} />

      {/* Mentor */}
      <Route path="/mentor" element={<ProtectedRoute allowedRoles={['mentor']}><MentorHome /></ProtectedRoute>} />
      <Route path="/mentor/links/:id" element={<ProtectedRoute allowedRoles={['mentor']}><MentorLinkDetail /></ProtectedRoute>} />
      <Route path="/mentor/profile" element={<ProtectedRoute allowedRoles={['mentor']}><MentorProfile /></ProtectedRoute>} />

      {/* Startup */}
      <Route path="/startup" element={<ProtectedRoute allowedRoles={['startup']}><StartupHome /></ProtectedRoute>} />
      <Route path="/startup/links/:id" element={<ProtectedRoute allowedRoles={['startup']}><StartupLinkDetail /></ProtectedRoute>} />
      <Route path="/startup/profile" element={<ProtectedRoute allowedRoles={['startup']}><StartupProfile /></ProtectedRoute>} />

      {/* Root redirect based on role */}
      <Route path="/" element={<ProtectedRoute><RoleHome /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
