import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { Dashboard } from './pages/Dashboard'
import { CreateWorldPage } from './pages/CreateWorldPage'
import { WorldViewPage } from './pages/WorldViewPage'
import { ExplorePage } from './pages/ExplorePage'
import { EventsPage } from './pages/EventsPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'

// App content component that uses auth context
function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/w/:slug" element={<WorldViewPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/create-world" element={
        <ProtectedRoute>
          <CreateWorldPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner message="Loading AI Universe..." />}>
            <AppContent />
          </Suspense>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App