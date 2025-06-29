import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { type AIWorld } from '../../lib/supabase'
import { formatDate, getInitials, truncateText } from '../../lib/utils'
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Users,
  Calendar,
  Globe
} from 'lucide-react'

interface WorldCardProps {
  world: AIWorld & {
    user?: {
      name?: string
      avatar_url?: string
      email: string
    }
    stats?: {
      views: number
      likes: number
      messages: number
      subscribers: number
    }
  }
  showStats?: boolean
  variant?: 'default' | 'compact'
}

export function WorldCard({ world, showStats = true, variant = 'default' }: WorldCardProps) {
  const isCompact = variant === 'compact'
  
  const features = world.features || {}
  const hasAI = features.chat || features.voice || features.video
  const hasBlockchain = features.nft || features.crypto
  const hasEvents = features.events
  
  return (
    <Card className={`world-card group ${isCompact ? 'h-auto' : 'h-full'}`}>
      <CardHeader className={isCompact ? 'pb-2' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`${isCompact ? 'text-lg' : 'text-xl'} mb-2`}>
              <Link 
                to={`/w/${world.slug}`}
                className="hover:text-primary transition-colors"
              >
                {world.title}
              </Link>
            </CardTitle>
            
            {world.description && (
              <p className={`text-muted-foreground ${isCompact ? 'text-sm' : ''}`}>
                {truncateText(world.description, isCompact ? 80 : 120)}
              </p>
            )}
          </div>
          
          {world.public && (
            <Badge variant="secondary" className="ml-2">
              <Globe className="w-3 h-3 mr-1" />
              Public
            </Badge>
          )}
        </div>

        {!isCompact && (
          <div className="flex flex-wrap gap-2 mt-3">
            {hasAI && (
              <Badge variant="outline" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            )}
            {hasBlockchain && (
              <Badge variant="outline" className="text-xs">
                Blockchain
              </Badge>
            )}
            {hasEvents && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Events
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className={isCompact ? 'py-2' : 'py-4'}>
        {world.user && (
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-6 w-6">
              <AvatarImage src={world.user.avatar_url} />
              <AvatarFallback className="text-xs">
                {getInitials(world.user.name || world.user.email)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {world.user.name || world.user.email.split('@')[0]}
            </span>
          </div>
        )}

        {showStats && world.stats && !isCompact && (
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {world.stats.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {world.stats.likes.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {world.stats.messages.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {world.stats.subscribers.toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className={`${isCompact ? 'pt-2' : 'pt-4'} flex items-center justify-between`}>
        <span className="text-xs text-muted-foreground">
          {formatDate(world.created_at)}
        </span>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button size="sm" asChild>
            <Link to={`/w/${world.slug}`}>
              Visit World
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}