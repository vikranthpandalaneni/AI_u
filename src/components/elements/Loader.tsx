// CREATED: Reusable loader component
import React from 'react'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function Loader({ size = 'md', className, text }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={cn('animate-spin', sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  )
}