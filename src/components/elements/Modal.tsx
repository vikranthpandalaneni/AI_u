// CREATED: Reusable modal component
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

interface ModalProps {
  trigger?: React.ReactNode
  title?: string
  description?: string
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

export function Modal({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  size = 'md',
  showCloseButton = true
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={sizeClasses[size]}>
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={() => onOpenChange?.(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}