import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  Search,
  Settings,
  Plus,
  TrendingUp,
  Users,
  Zap,
  Globe
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface SidebarProps {
  className?: string
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null
  },
  {
    name: 'Create World',
    href: '/create-world',
    icon: Plus,
    badge: 'New'
  },
  {
    name: 'Explore',
    href: '/explore',
    icon: Search,
    badge: null
  },
  {
    name: 'Events',
    href: '/events',
    icon: Calendar,
    badge: null
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
    badge: null
  },
  {
    name: 'Community',
    href: '/community',
    icon: Users,
    badge: null
  }
]

const integrations = [
  { name: 'AI Chat', icon: Sparkles, status: 'active' },
  { name: 'Voice AI', icon: Zap, status: 'active' },
  { name: 'Blockchain', icon: Globe, status: 'beta' },
  { name: 'Events', icon: Calendar, status: 'active' }
]

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            AI Universe
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Integrations
          </h2>
          <div className="space-y-1">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between px-4 py-2 text-sm"
              >
                <div className="flex items-center">
                  <integration.icon className="mr-2 h-4 w-4" />
                  {integration.name}
                </div>
                <Badge 
                  variant={integration.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {integration.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="px-3 py-2">
          <Link to="/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}