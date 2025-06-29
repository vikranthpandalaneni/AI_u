// CREATED: Global loading page component with AI Universe logo and animated loader
import React from 'react'
import { Sparkles } from 'lucide-react'

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {/* AI Universe Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Universe
          </span>
        </div>

        {/* Animated Loader */}
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        {/* Loading Message */}
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}