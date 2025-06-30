import React from 'react'
import { cn } from '../../lib/utils'
import { Loader2, Sparkles } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'page' | 'inline'
  message?: string
  className?: string
  showLogo?: boolean
}

export function Loading({ 
  size = 'md', 
  variant = 'spinner',
  message,
  className,
  showLogo = false
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  if (variant === 'page') {
    return (
      <div className={cn("min-h-screen flex items-center justify-center bg-background", className)}>
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
          {message && <p className="text-muted-foreground">{message}</p>}
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Loader2 className={cn('animate-spin', sizeClasses[size])} />
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    )
  }

  // Default spinner variant
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      {showLogo && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Universe
          </span>
        </div>
      )}

      {/* Spinner */}
      <div className="relative">
        <Loader2 className={cn('animate-spin text-primary', spinnerSizes[size])} />
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
      </div>

      {/* Message */}
      {message && (
        <p className="text-muted-foreground font-medium text-center max-w-xs">
          {message}
        </p>
      )}

      {/* Progress dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
      </div>
    </div>
  )
}