import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { LoadingSpinner } from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/auth' }: ProtectedRouteProps) {
  const { session, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />
  }

  if (!session) {
    // Save the attempted location for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <>{children}</>
}