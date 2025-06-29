import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { WorldCard } from '../components/world/WorldCard'
import { useAuth } from '../contexts/AuthContext'
import { useWorldStore } from '../stores/worldStore'
import { formatCurrency } from '../lib/utils'
import {
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  MessageCircle,
  Calendar,
  Sparkles,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react'

// Mock data for demo
const mockStats = {
  totalViews: 12543,
  totalSubscribers: 89,
  monthlyRevenue: 245.50,
  activeWorlds: 3
}

const mockRecentActivity = [
  {
    id: '1',
    type: 'world_created',
    message: 'Created new world "AI Startup Advisor"',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'subscriber',
    message: 'New subscriber to "Language Learning Buddy"',
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    type: 'revenue',
    message: 'Earned $29 from Pro subscription',
    timestamp: '1 day ago'
  },
  {
    id: '4',
    type: 'event',
    message: 'Upcoming event: "AI World Building Workshop"',
    timestamp: '2 days ago'
  }
]

export function Dashboard() {
  const { user } = useAuth()
  const { worlds, loading, fetchWorlds } = useWorldStore()

  useEffect(() => {
    if (user) {
      fetchWorlds(user.id)
    }
  }, [user, fetchWorlds])

  const userWorlds = worlds.map(world => ({
    ...world,
    user: {
      name: user?.user_metadata?.name,
      avatar_url: user?.user_metadata?.avatar_url,
      email: user?.email || ''
    },
    stats: {
      views: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 500) + 50,
      messages: Math.floor(Math.random() * 1000) + 100,
      subscribers: Math.floor(Math.random() * 200) + 20
    }
  }))

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.user_metadata?.name || 'Creator'}! Here's what's happening with your AI worlds.
            </p>
          </div>
          
          <Button asChild>
            <Link to="/create-world">
              <Plus className="mr-2 h-4 w-4" />
              Create World
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalSubscribers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5</span> this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockStats.monthlyRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+23%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Worlds</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeWorlds}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">2</span> public, <span className="text-orange-600">1</span> private
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Worlds */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              
              <h2 className="text-2xl font-semibold">My Worlds</h2>
              <Button variant="outline" asChild>
                <Link to="/create-world">
                  <Plus className="mr-2 h-4 w-4" />
                  New World
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userWorlds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userWorlds.map((world) => (
                  <WorldCard key={world.id} world={world} variant="compact" />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <CardTitle className="mb-2">Create Your First AI World</CardTitle>
                  <CardDescription className="mb-4">
                    Start building amazing AI-powered experiences with our no-code platform.
                  </CardDescription>
                  <Button asChild>
                    <Link to="/create-world">
                      <Plus className="mr-2 h-4 w-4" />
                      Create World
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link to="/create-world">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New World
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/events">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Events
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Prompt */}
            {user?.user_metadata?.plan === 'free' && (
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    Upgrade to Pro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Unlock unlimited worlds, custom domains, and advanced features.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/pricing">
                      Upgrade Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}