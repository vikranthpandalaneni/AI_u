import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { LoadingSpinner } from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/auth' }: ProtectedRouteProps) {
  const { user, loading, initialized } = useAuthStore()
  const location = useLocation()

  // Show loading while auth is initializing or loading
  if (!initialized || loading) {
    return <LoadingSpinner message="Checking authentication..." />
  }

  // Redirect to auth if no user
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <>{children}</>
}