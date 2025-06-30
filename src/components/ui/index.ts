// Unified UI Component Exports
// Single source of truth for all UI components

// Core UI Components
export { Button } from './button'
export { Input } from './input'
export { Label } from './label'
export { Textarea } from './textarea'

// Layout Components
export { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './card'
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog'

// Data Display
export { Avatar, AvatarFallback, AvatarImage } from './avatar'
export { Badge } from './badge'
export { Progress } from './progress'

// Form Components
export { Switch } from './switch'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

// Navigation
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu'

// Feedback
export { Loading } from './Loading'

// Re-export design system
export { designSystem, getColor, getSpacing, getFontSize } from '../../lib/design-system'