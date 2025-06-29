import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { ChatInterface } from '../components/chat/ChatInterface'
import { useWorldStore } from '../stores/worldStore'
import { useAuthStore } from '../stores/authStore'
import { formatDate, getInitials } from '../lib/utils'
import {
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  Coins,
  Sparkles,
  Globe,
  Mic,
  Video,
  Languages,
  ExternalLink,
  Crown,
  Lock
} from 'lucide-react'

export function WorldViewPage() {
  const { slug } = useParams<{ slug: string }>()
  const { currentWorld, fetchWorld, loading } = useWorldStore()
  const { user } = useAuthStore()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchWorld(slug)
    }
  }, [slug, fetchWorld])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!currentWorld) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">World Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The world you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/explore">Explore Other Worlds</Link>
          </Button>
        </div>
      </div>
    )
  }

  const features = currentWorld.features || {}
  const theme = currentWorld.theme || { color: 'blue', mode: 'light' }
  const isOwner = user?.id === currentWorld.user_id
  const isPremium = !currentWorld.public && !isOwner && !isSubscribed

  const themeClasses = {
    purple: 'from-purple-600 to-pink-600',
    blue: 'from-blue-600 to-cyan-600',
    green: 'from-green-600 to-emerald-600',
    pink: 'from-pink-600 to-rose-600',
    orange: 'from-orange-600 to-yellow-600',
    red: 'from-red-600 to-pink-600'
  }

  const gradientClass = themeClasses[theme.color as keyof typeof themeClasses] || themeClasses.blue

  if (isPremium && showPaywall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container max-w-2xl py-20">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Premium World</CardTitle>
              <CardDescription>
                This world requires a subscription to access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold">$9.99<span className="text-lg text-muted-foreground">/month</span></div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Unlimited AI conversations</span>
                </div>
                {features.voice && (
                  <div className="flex items-center justify-center gap-2">
                    <Mic className="w-4 h-4" />
                    <span>Voice AI interactions</span>
                  </div>
                )}
                {features.video && (
                  <div className="flex items-center justify-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>Video AI agents</span>
                  </div>
                )}
                {features.events && (
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Exclusive events access</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => setIsSubscribed(true)}>
                  Subscribe Now
                </Button>
                <Button variant="outline" onClick={() => setShowPaywall(false)}>
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.mode === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/explore">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">{currentWorld.title}</h1>
                {currentWorld.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {currentWorld.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            {!currentWorld.public && !isOwner && (
              <Button onClick={() => setShowPaywall(true)}>
                <Lock className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <Card className="mb-6">
              <div className={`h-32 bg-gradient-to-r ${gradientClass} rounded-t-lg`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{currentWorld.title}</h2>
                    {currentWorld.description && (
                      <p className="text-muted-foreground">{currentWorld.description}</p>
                    )}
                  </div>
                  {currentWorld.public && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Public
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {features.chat && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      AI Chat
                    </Badge>
                  )}
                  {features.voice && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Mic className="w-3 h-3" />
                      Voice AI
                    </Badge>
                  )}
                  {features.video && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Video Agents
                    </Badge>
                  )}
                  {features.nft && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      NFTs
                    </Badge>
                  )}
                  {features.events && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Events
                    </Badge>
                  )}
                  {features.translations && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Languages className="w-3 h-3" />
                      Multi-Language
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Created {formatDate(currentWorld.created_at)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    1.2K members
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    5.8K messages
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Chat Interface */}
            {features.chat && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    AI Chat
                  </CardTitle>
                  <CardDescription>
                    Start a conversation with the AI assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ChatInterface worldId={currentWorld.id} className="h-96 border-0" />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {getInitials("World Creator")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">World Creator</div>
                    <div className="text-sm text-muted-foreground">AI Enthusiast</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {features.voice && (
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">Voice AI</div>
                      <div className="text-sm text-muted-foreground">Natural voice conversations</div>
                    </div>
                  </div>
                )}
                
                {features.video && (
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium">Video Agents</div>
                      <div className="text-sm text-muted-foreground">Interactive video AI</div>
                    </div>
                  </div>
                )}

                {features.nft && (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">NFT Identities</div>
                      <div className="text-sm text-muted-foreground">Mint unique NFTs</div>
                    </div>
                  </div>
                )}

                {features.events && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Live Events</div>
                      <div className="text-sm text-muted-foreground">Virtual meetups</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Visits</span>
                  <span className="font-medium">12.5K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Users</span>
                  <span className="font-medium">1.2K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Messages Sent</span>
                  <span className="font-medium">5.8K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Session</span>
                  <span className="font-medium">8m 32s</span>
                </div>
              </CardContent>
            </Card>

            {/* Built with AI Universe */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Built with AI Universe</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Create your own AI-powered world in minutes
                </p>
                <Button size="sm" asChild>
                  <Link to="/create-world">
                    Start Building
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}