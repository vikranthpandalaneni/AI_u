import React from 'react'
import { Loader2, Sparkles } from 'lucide-react'

interface LoadingSpinnerProps {
  message?: string
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ 
  message = 'Loading...', 
  fullScreen = true,
  size = 'md'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* AI Universe Logo */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Universe
        </span>
      </div>

      {/* Spinner */}
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
      </div>

      {/* Message */}
      <p className="text-muted-foreground font-medium text-center max-w-xs">
        {message}
      </p>

      {/* Progress dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
      </div>
    </div>
  )

  if (!fullScreen) {
    return content
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
        {content}
      </div>
    </div>
  )
}