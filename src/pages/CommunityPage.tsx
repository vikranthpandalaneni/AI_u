import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { getInitials } from '../lib/utils'
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Search,
  TrendingUp,
  Calendar,
  Award,
  Star,
  Plus,
  ExternalLink,
  Globe,
  Zap
} from 'lucide-react'

// Mock community data
const mockCommunityData = {
  stats: {
    totalMembers: 12547,
    activeToday: 1834,
    totalPosts: 8923,
    totalWorlds: 2156
  },
  featuredCreators: [
    {
      id: '1',
      name: 'TechGuru',
      avatar: '',
      title: 'AI Startup Advisor Creator',
      followers: 2340,
      worlds: 5,
      verified: true
    },
    {
      id: '2',
      name: 'PolyglotAI',
      avatar: '',
      title: 'Language Learning Expert',
      followers: 1890,
      worlds: 3,
      verified: true
    },
    {
      id: '3',
      name: 'ZenMaster',
      avatar: '',
      title: 'Mindfulness Coach',
      followers: 3120,
      worlds: 7,
      verified: false
    }
  ],
  discussions: [
    {
      id: '1',
      title: 'Best practices for AI world monetization',
      author: 'CryptoWiz',
      replies: 23,
      likes: 45,
      category: 'Business',
      timeAgo: '2 hours ago',
      trending: true
    },
    {
      id: '2',
      title: 'How to improve voice AI response quality',
      author: 'VoiceExpert',
      replies: 18,
      likes: 32,
      category: 'Technical',
      timeAgo: '4 hours ago',
      trending: false
    },
    {
      id: '3',
      title: 'Community showcase: Amazing worlds this week',
      author: 'CommunityMod',
      replies: 67,
      likes: 128,
      category: 'Showcase',
      timeAgo: '1 day ago',
      trending: true
    },
    {
      id: '4',
      title: 'NFT integration tutorial and examples',
      author: 'BlockchainDev',
      replies: 41,
      likes: 89,
      category: 'Tutorial',
      timeAgo: '2 days ago',
      trending: false
    }
  ],
  events: [
    {
      id: '1',
      title: 'AI World Building Workshop',
      date: '2024-02-15',
      time: '6:00 PM EST',
      attendees: 156,
      type: 'Workshop'
    },
    {
      id: '2',
      title: 'Community Showcase Friday',
      date: '2024-02-16',
      time: '7:00 PM EST',
      attendees: 89,
      type: 'Showcase'
    }
  ]
}

export function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'business', 'technical', 'showcase', 'tutorial', 'general']

  const filteredDiscussions = mockCommunityData.discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           discussion.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-muted-foreground">
              Connect with fellow AI world creators and share your experiences.
            </p>
          </div>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Discussion
          </Button>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{mockCommunityData.stats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{mockCommunityData.stats.activeToday.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Active Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{mockCommunityData.stats.totalPosts.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{mockCommunityData.stats.totalWorlds.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">AI Worlds</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="discussions" className="space-y-6">
              <TabsList>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="showcase">Showcase</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="discussions" className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Discussions List */}
                <div className="space-y-4">
                  {filteredDiscussions.map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold hover:text-primary cursor-pointer">
                                {discussion.title}
                              </h3>
                              {discussion.trending && (
                                <Badge variant="secondary" className="text-xs">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span>by {discussion.author}</span>
                              <span>•</span>
                              <span>{discussion.timeAgo}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {discussion.category}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {discussion.replies} replies
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {discussion.likes} likes
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="icon">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="showcase" className="space-y-6">
                <Card className="text-center py-12">
                  <CardContent>
                    <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <CardTitle className="mb-2">Community Showcase</CardTitle>
                    <CardDescription className="mb-4">
                      Discover amazing AI worlds created by our community members.
                    </CardDescription>
                    <Button>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Featured Worlds
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <div className="space-y-4">
                  {mockCommunityData.events.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold mb-2">{event.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {event.date} at {event.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {event.attendees} attending
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                          <Button>Join Event</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Creators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Featured Creators</CardTitle>
                <CardDescription>
                  Top contributors in our community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCommunityData.featuredCreators.map((creator) => (
                  <div key={creator.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback>
                        {getInitials(creator.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <div className="font-medium truncate">{creator.name}</div>
                        {creator.verified && (
                          <Star className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {creator.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {creator.followers.toLocaleString()} followers • {creator.worlds} worlds
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Be respectful and constructive in discussions</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Share knowledge and help fellow creators</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Keep content relevant to AI world building</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>No spam or self-promotion without value</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Discord Server
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Event Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}