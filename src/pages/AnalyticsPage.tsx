import React, { useState, useEffect } from 'react'
import { Layout } from '../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { useWorldStore } from '../stores/worldStore'
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Calendar,
  DollarSign,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalViews: 45672,
    totalUsers: 3421,
    totalMessages: 12890,
    totalRevenue: 2847.50,
    viewsChange: 12.5,
    usersChange: 8.3,
    messagesChange: -2.1,
    revenueChange: 23.7
  },
  topWorlds: [
    { name: 'AI Startup Advisor', views: 12500, users: 890, revenue: 1250.00 },
    { name: 'Language Learning Buddy', views: 8300, users: 620, revenue: 830.00 },
    { name: 'Meditation & Mindfulness', views: 15700, users: 1200, revenue: 567.50 }
  ],
  recentActivity: [
    { type: 'view', message: 'New user visited AI Startup Advisor', time: '2 minutes ago' },
    { type: 'message', message: '15 new messages in Language Learning Buddy', time: '5 minutes ago' },
    { type: 'revenue', message: 'New subscription to Meditation & Mindfulness', time: '12 minutes ago' },
    { type: 'user', message: '3 new users joined today', time: '1 hour ago' }
  ]
}

export function AnalyticsPage() {
  const { user } = useAuth()
  const { worlds, fetchWorlds } = useWorldStore()
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    if (user) {
      fetchWorlds(user.id)
    }
  }, [user, fetchWorlds])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-500" />
    )
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Track the performance of your AI worlds and understand your audience.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mockAnalytics.overview.totalViews)}</div>
              <div className="flex items-center text-xs">
                {getChangeIcon(mockAnalytics.overview.viewsChange)}
                <span className={getChangeColor(mockAnalytics.overview.viewsChange)}>
                  {Math.abs(mockAnalytics.overview.viewsChange)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mockAnalytics.overview.totalUsers)}</div>
              <div className="flex items-center text-xs">
                {getChangeIcon(mockAnalytics.overview.usersChange)}
                <span className={getChangeColor(mockAnalytics.overview.usersChange)}>
                  {Math.abs(mockAnalytics.overview.usersChange)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mockAnalytics.overview.totalMessages)}</div>
              <div className="flex items-center text-xs">
                {getChangeIcon(mockAnalytics.overview.messagesChange)}
                <span className={getChangeColor(mockAnalytics.overview.messagesChange)}>
                  {Math.abs(mockAnalytics.overview.messagesChange)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockAnalytics.overview.totalRevenue)}</div>
              <div className="flex items-center text-xs">
                {getChangeIcon(mockAnalytics.overview.revenueChange)}
                <span className={getChangeColor(mockAnalytics.overview.revenueChange)}>
                  {Math.abs(mockAnalytics.overview.revenueChange)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Performing Worlds */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Performing Worlds
                </CardTitle>
                <CardDescription>
                  Your most successful AI worlds by engagement and revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.topWorlds.map((world, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{world.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatNumber(world.views)} views • {formatNumber(world.users)} users
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(world.revenue)}</div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest events across your worlds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Export Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Insights
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chart Placeholder */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>
              Track your worlds' performance metrics over the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Interactive charts coming soon</p>
                <p className="text-sm text-muted-foreground">
                  Advanced analytics dashboard with detailed charts and insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}