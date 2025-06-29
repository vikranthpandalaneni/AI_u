import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Plus,
  Search,
  Filter,
  Video,
  Mic,
  Globe,
  Star,
  ExternalLink,
  Ticket,
  Coffee
} from 'lucide-react'

// Mock events data
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'AI World Building Workshop',
    description: 'Learn how to create engaging AI-powered experiences with our expert team. Perfect for beginners and advanced creators.',
    type: 'workshop',
    startTime: '2024-02-15T18:00:00Z',
    endTime: '2024-02-15T20:00:00Z',
    ticketPrice: 0,
    attendees: 156,
    maxAttendees: 200,
    host: 'AI Universe Team',
    worldTitle: 'AI Universe Academy',
    features: ['video', 'chat', 'screen-share'],
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Crypto & NFT Integration Masterclass',
    description: 'Deep dive into blockchain integration for AI worlds. Learn about NFT minting, crypto payments, and DeFi features.',
    type: 'conference',
    startTime: '2024-02-18T16:00:00Z',
    endTime: '2024-02-18T18:30:00Z',
    ticketPrice: 29.99,
    attendees: 89,
    maxAttendees: 150,
    host: 'CryptoWiz',
    worldTitle: 'Blockchain Academy',
    features: ['video', 'chat', 'nft-rewards'],
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Voice AI Demo & Q&A',
    description: 'Experience the latest in voice AI technology and ask questions to our development team.',
    type: 'meetup',
    startTime: '2024-02-20T19:00:00Z',
    endTime: '2024-02-20T20:30:00Z',
    ticketPrice: 0,
    attendees: 234,
    maxAttendees: 300,
    host: 'VoiceAI Labs',
    worldTitle: 'Voice AI Playground',
    features: ['voice', 'chat'],
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Community Showcase',
    description: 'Creators present their amazing AI worlds and share their building journey with the community.',
    type: 'meetup',
    startTime: '2024-02-12T17:00:00Z',
    endTime: '2024-02-12T19:00:00Z',
    ticketPrice: 0,
    attendees: 312,
    maxAttendees: 300,
    host: 'Community Team',
    worldTitle: 'AI Universe Hub',
    features: ['video', 'chat', 'screen-share'],
    status: 'completed'
  },
  {
    id: '5',
    title: 'Meditation & Mindfulness Session',
    description: 'Join our weekly guided meditation session with AI-powered ambient sounds and personalized guidance.',
    type: 'workshop',
    startTime: '2024-02-22T20:00:00Z',
    endTime: '2024-02-22T21:00:00Z',
    ticketPrice: 9.99,
    attendees: 67,
    maxAttendees: 100,
    host: 'ZenMaster',
    worldTitle: 'Meditation & Mindfulness',
    features: ['voice', 'ambient-sounds'],
    status: 'upcoming'
  }
]

const EVENT_TYPES = [
  { id: 'all', label: 'All Events', icon: Calendar },
  { id: 'workshop', label: 'Workshops', icon: Users },
  { id: 'meetup', label: 'Meetups', icon: Coffee },
  { id: 'conference', label: 'Conferences', icon: Mic }
]

export function EventsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesType = selectedType === 'all' || event.type === selectedType
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const upcomingEvents = filteredEvents.filter(event => event.status === 'upcoming')
  const pastEvents = filteredEvents.filter(event => event.status === 'completed')

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-500'
      case 'meetup': return 'bg-green-500'
      case 'conference': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const EventCard = ({ event }: { event: typeof MOCK_EVENTS[0] }) => {
    const { date, time } = formatEventTime(event.startTime)
    const isUpcoming = event.status === 'upcoming'
    const isFull = event.attendees >= event.maxAttendees

    return (
      <Card className="group hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                <Badge variant="outline" className="text-xs">
                  {event.type}
                </Badge>
                {event.ticketPrice > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    ${event.ticketPrice}
                  </Badge>
                )}
                {event.ticketPrice === 0 && (
                  <Badge variant="outline" className="text-xs text-green-600">
                    Free
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {event.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {time}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event.attendees}/{event.maxAttendees}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.worldTitle}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {event.features.includes('video') && (
                <Badge variant="outline" className="text-xs">
                  <Video className="w-3 h-3 mr-1" />
                  Video
                </Badge>
              )}
              {event.features.includes('voice') && (
                <Badge variant="outline" className="text-xs">
                  <Mic className="w-3 h-3 mr-1" />
                  Voice
                </Badge>
              )}
              {event.features.includes('nft-rewards') && (
                <Badge variant="outline" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  NFT Rewards
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">
                by {event.host}
              </span>
              
              {isUpcoming ? (
                <Button 
                  size="sm" 
                  disabled={isFull}
                  className={isFull ? 'opacity-50' : ''}
                >
                  {isFull ? 'Full' : event.ticketPrice > 0 ? 'Buy Ticket' : 'Join Free'}
                </Button>
              ) : (
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Recording
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Events</h1>
            <p className="text-muted-foreground">
              Join live events, workshops, and meetups in AI worlds
            </p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Host a live event in your AI world
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Title</label>
                  <Input placeholder="My Amazing Event" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    className="w-full p-3 border rounded-md resize-none h-24"
                    placeholder="Describe your event..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1">Create Event</Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className="flex items-center gap-2"
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              <div className="text-sm text-muted-foreground">Upcoming Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">2.4K</div>
              <div className="text-sm text-muted-foreground">Total Attendees</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">45</div>
              <div className="text-sm text-muted-foreground">Active Worlds</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Ticket className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">Events This Month</div>
            </CardContent>
          </Card>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Events ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <CardTitle className="mb-2">No upcoming events</CardTitle>
                  <CardDescription className="mb-4">
                    Be the first to create an event in your AI world!
                  </CardDescription>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <CardTitle className="mb-2">No past events</CardTitle>
                  <CardDescription>
                    Past events will appear here once they're completed.
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Featured Event */}
        <Card className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-white/20 text-white mb-4">Featured Event</Badge>
                <h3 className="text-2xl font-bold mb-2">AI Universe Annual Conference 2024</h3>
                <p className="text-purple-100 mb-4">
                  Join us for the biggest AI world building event of the year. 
                  3 days of workshops, demos, and networking.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    March 15-17, 2024
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    1000+ Expected
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-2">$99</div>
                <Button size="lg" variant="secondary">
                  Get Early Bird Tickets
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}