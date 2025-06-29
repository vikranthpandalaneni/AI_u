import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { WorldCard } from '../components/world/WorldCard'
import { useWorldStore } from '../stores/worldStore'
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Users,
  Sparkles,
  Calendar,
  Globe,
  Crown,
  Zap
} from 'lucide-react'

const CATEGORIES = [
  'All',
  'Business',
  'Education', 
  'Entertainment',
  'Health & Wellness',
  'Technology',
  'Art & Design',
  'Gaming',
  'Social'
]

const FILTERS = [
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'new', label: 'New', icon: Clock },
  { id: 'popular', label: 'Popular', icon: Star },
  { id: 'premium', label: 'Premium', icon: Crown }
]

// Mock featured worlds data
const FEATURED_WORLDS = [
  {
    id: '1',
    title: 'AI Startup Advisor',
    description: 'Get personalized advice for your startup journey from an AI mentor trained on successful entrepreneur experiences.',
    slug: 'ai-startup-advisor',
    user_id: '1',
    theme: { color: 'blue', mode: 'light' },
    features: { chat: true, voice: true, video: false, nft: false },
    public: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    user: {
      name: 'TechGuru',
      email: 'techguru@example.com',
      avatar_url: ''
    },
    stats: {
      views: 12500,
      likes: 890,
      messages: 3400,
      subscribers: 450
    }
  },
  {
    id: '2',
    title: 'Language Learning Buddy',
    description: 'Practice conversations in 50+ languages with an AI tutor that adapts to your learning style.',
    slug: 'language-learning-buddy',
    user_id: '2',
    theme: { color: 'green', mode: 'light' },
    features: { chat: true, voice: true, video: true, translations: true },
    public: true,
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
    user: {
      name: 'PolyglotAI',
      email: 'polyglot@example.com',
      avatar_url: ''
    },
    stats: {
      views: 8300,
      likes: 620,
      messages: 5200,
      subscribers: 380
    }
  },
  {
    id: '3',
    title: 'Meditation & Mindfulness',
    description: 'Guided meditation sessions with AI voice coaching and personalized mindfulness practices.',
    slug: 'meditation-mindfulness',
    user_id: '3',
    theme: { color: 'purple', mode: 'light' },
    features: { chat: true, voice: true, events: true },
    public: true,
    created_at: '2024-01-08T09:15:00Z',
    updated_at: '2024-01-08T09:15:00Z',
    user: {
      name: 'ZenMaster',
      email: 'zen@example.com',
      avatar_url: ''
    },
    stats: {
      views: 15700,
      likes: 1200,
      messages: 2800,
      subscribers: 680
    }
  },
  {
    id: '4',
    title: 'Crypto Trading Assistant',
    description: 'AI-powered cryptocurrency analysis and trading insights with real-time market data.',
    slug: 'crypto-trading-assistant',
    user_id: '4',
    theme: { color: 'orange', mode: 'dark' },
    features: { chat: true, crypto: true, nft: true },
    public: false,
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    user: {
      name: 'CryptoWiz',
      email: 'crypto@example.com',
      avatar_url: ''
    },
    stats: {
      views: 9800,
      likes: 540,
      messages: 1900,
      subscribers: 290
    }
  },
  {
    id: '5',
    title: 'Creative Writing Workshop',
    description: 'Collaborate with AI to write stories, poems, and scripts. Get feedback and inspiration.',
    slug: 'creative-writing-workshop',
    user_id: '5',
    theme: { color: 'pink', mode: 'light' },
    features: { chat: true, events: true, social: true },
    public: true,
    created_at: '2024-01-05T11:20:00Z',
    updated_at: '2024-01-05T11:20:00Z',
    user: {
      name: 'WordSmith',
      email: 'writer@example.com',
      avatar_url: ''
    },
    stats: {
      views: 6400,
      likes: 420,
      messages: 3100,
      subscribers: 210
    }
  },
  {
    id: '6',
    title: 'Fitness & Nutrition Coach',
    description: 'Personalized workout plans and nutrition advice from an AI health expert.',
    slug: 'fitness-nutrition-coach',
    user_id: '6',
    theme: { color: 'red', mode: 'light' },
    features: { chat: true, voice: true, events: true },
    public: true,
    created_at: '2024-01-03T08:00:00Z',
    updated_at: '2024-01-03T08:00:00Z',
    user: {
      name: 'FitGuru',
      email: 'fitness@example.com',
      avatar_url: ''
    },
    stats: {
      views: 11200,
      likes: 780,
      messages: 4500,
      subscribers: 520
    }
  }
]

export function ExplorePage() {
  const { worlds, fetchWorlds, loading } = useWorldStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedFilter, setSelectedFilter] = useState('trending')
  const [filteredWorlds, setFilteredWorlds] = useState(FEATURED_WORLDS)

  useEffect(() => {
    fetchWorlds() // Fetch public worlds
  }, [fetchWorlds])

  useEffect(() => {
    let filtered = FEATURED_WORLDS

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(world => 
        world.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        world.description.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(world =>
        world.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        world.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort by filter
    switch (selectedFilter) {
      case 'trending':
        filtered.sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
        break
      case 'new':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => (b.stats?.likes || 0) - (a.stats?.likes || 0))
        break
      case 'premium':
        filtered = filtered.filter(world => !world.public)
        break
    }

    setFilteredWorlds(filtered)
  }, [searchQuery, selectedCategory, selectedFilter])

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Explore AI Worlds
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing AI-powered experiences created by our community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search worlds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-2">
            {FILTERS.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className="flex items-center gap-2"
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        {selectedFilter === 'trending' && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorlds.slice(0, 3).map((world, index) => (
                <Card key={world.id} className="relative overflow-hidden group hover:shadow-lg transition-all">
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      #{index + 1} Trending
                    </Badge>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold">{world.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {world.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {world.stats?.subscribers}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {world.stats?.views}
                        </span>
                      </div>
                      <Button size="sm" asChild>
                        <Link to={`/w/${world.slug}`}>Visit</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-muted-foreground">Total Worlds</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">12.5K</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">89K</div>
              <div className="text-sm text-muted-foreground">AI Interactions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">Live Events</div>
            </CardContent>
          </Card>
        </div>

        {/* All Worlds Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedFilter === 'trending' ? 'All Worlds' : 
               selectedFilter === 'new' ? 'Newest Worlds' :
               selectedFilter === 'popular' ? 'Most Popular' :
               'Premium Worlds'}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredWorlds.length} worlds found
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-32 bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded mb-4" />
                    <div className="h-8 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredWorlds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorlds.map((world) => (
                <WorldCard key={world.id} world={world} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <CardTitle className="mb-2">No worlds found</CardTitle>
                <CardDescription className="mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </CardDescription>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                  setSelectedFilter('trending')
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready to Create Your Own World?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of creators building amazing AI-powered experiences. 
              Start with our no-code platform and launch in minutes.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/create-world">
                Start Building Free
                <Sparkles className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}