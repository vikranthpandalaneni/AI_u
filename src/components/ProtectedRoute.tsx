import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoadingSpinner } from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/auth' }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />
  }

  if (!user) {
    // Save the attempted location for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <>{children}</>
}