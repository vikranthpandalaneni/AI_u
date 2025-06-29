import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  plan: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface AIWorld {
  id: string
  user_id: string
  title: string
  description?: string
  slug: string
  domain?: string
  theme: {
    color: string
    mode: 'light' | 'dark'
  }
  features: Record<string, any>
  pricing?: {
    free: boolean
    premium: boolean
    price: number
  }
  public: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  world_id: string
  status: 'active' | 'inactive' | 'cancelled'
  amount: number
  started_at: string
  expires_at?: string
}

export interface WorldEvent {
  id: string
  world_id: string
  event_type: 'meetup' | 'workshop' | 'conference'
  title: string
  description?: string
  start_time?: string
  end_time?: string
  river_id?: string
  ticket_price: number
  created_at: string
}

export interface NFTIdentity {
  id: string
  world_id: string
  owner_wallet?: string
  nft_metadata: Record<string, any>
  mint_date: string
}

export interface AnalyticsEvent {
  id: string
  world_id: string
  user_id: string
  event_name: string
  properties: Record<string, any>
  timestamp: string
}

export interface Translation {
  id: string
  world_id: string
  language_code: string
  content: Record<string, any>
  updated_at: string
}

export interface MemeEntry {
  id: string
  world_id: string
  reddit_post_id?: string
  type: 'text' | 'image' | 'video'
  content: string
  upvotes: number
  created_at: string
}

// Database helpers with better error handling
export const db = {
  // Users
  getUser: async (id: string) => {
    try {
      return await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
    } catch (error) {
      console.error('Get user error:', error)
      throw error
    }
  },

  insertUser: async (user: Omit<User, 'created_at' | 'updated_at'>) => {
    try {
      return await supabase
        .from('users')
        .insert(user)
        .select()
        .single()
    } catch (error) {
      console.error('Insert user error:', error)
      throw error
    }
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    try {
      return await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  },

  // AI Worlds
  getWorlds: async (userId?: string) => {
    try {
      let query = supabase.from('ai_worlds').select('*')
      
      if (userId) {
        query = query.eq('user_id', userId)
      } else {
        query = query.eq('public', true)
      }
      
      return await query.order('created_at', { ascending: false })
    } catch (error) {
      console.error('Get worlds error:', error)
      throw error
    }
  },

  getWorld: async (slug: string) => {
    try {
      return await supabase
        .from('ai_worlds')
        .select('*')
        .eq('slug', slug)
        .single()
    } catch (error) {
      console.error('Get world error:', error)
      throw error
    }
  },

  createWorld: async (world: Omit<AIWorld, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      return await supabase
        .from('ai_worlds')
        .insert(world)
        .select()
        .single()
    } catch (error) {
      console.error('Create world error:', error)
      throw error
    }
  },

  updateWorld: async (id: string, updates: Partial<AIWorld>) => {
    try {
      return await supabase
        .from('ai_worlds')
        .update(updates)
        .eq('id', id)
    } catch (error) {
      console.error('Update world error:', error)
      throw error
    }
  },

  deleteWorld: async (id: string) => {
    try {
      return await supabase
        .from('ai_worlds')
        .delete()
        .eq('id', id)
    } catch (error) {
      console.error('Delete world error:', error)
      throw error
    }
  },

  // Events
  getEvents: async (worldId?: string) => {
    try {
      let query = supabase.from('world_events').select(`
        *,
        ai_worlds!inner(title, user_id)
      `)
      
      if (worldId) {
        query = query.eq('world_id', worldId)
      }
      
      return await query.order('start_time', { ascending: true })
    } catch (error) {
      console.error('Get events error:', error)
      throw error
    }
  },

  createEvent: async (event: Omit<WorldEvent, 'id' | 'created_at'>) => {
    try {
      return await supabase
        .from('world_events')
        .insert(event)
        .select(`
          *,
          ai_worlds!inner(title, user_id)
        `)
        .single()
    } catch (error) {
      console.error('Create event error:', error)
      throw error
    }
  },

  updateEvent: async (id: string, updates: Partial<WorldEvent>) => {
    try {
      return await supabase
        .from('world_events')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          ai_worlds!inner(title, user_id)
        `)
        .single()
    } catch (error) {
      console.error('Update event error:', error)
      throw error
    }
  },

  deleteEvent: async (id: string) => {
    try {
      return await supabase
        .from('world_events')
        .delete()
        .eq('id', id)
    } catch (error) {
      console.error('Delete event error:', error)
      throw error
    }
  },

  // Analytics
  trackEvent: async (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => {
    try {
      return await supabase
        .from('analytics_events')
        .insert(event)
    } catch (error) {
      console.error('Track event error:', error)
      throw error
    }
  },

  getAnalytics: async (worldId: string, startDate?: string, endDate?: string) => {
    try {
      let query = supabase
        .from('analytics_events')
        .select('*')
        .eq('world_id', worldId)
      
      if (startDate) {
        query = query.gte('timestamp', startDate)
      }
      
      if (endDate) {
        query = query.lte('timestamp', endDate)
      }
      
      return await query.order('timestamp', { ascending: false })
    } catch (error) {
      console.error('Get analytics error:', error)
      throw error
    }
  }
}

// Storage helpers
export const storage = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    try {
      return await supabase.storage
        .from(bucket)
        .upload(path, file)
    } catch (error) {
      console.error('Upload file error:', error)
      throw error
    }
  },

  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(path)
  },

  deleteFile: async (bucket: string, path: string) => {
    try {
      return await supabase.storage
        .from(bucket)
        .remove([path])
    } catch (error) {
      console.error('Delete file error:', error)
      throw error
    }
  }
}

// Real-time subscriptions
export const realtime = {
  subscribeToWorld: (worldId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`world:${worldId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ai_worlds',
        filter: `id=eq.${worldId}`
      }, callback)
      .subscribe()
  },

  subscribeToChat: (worldId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`chat:${worldId}`)
      .on('broadcast', { event: 'message' }, callback)
      .subscribe()
  },

  sendChatMessage: (worldId: string, message: any) => {
    return supabase
      .channel(`chat:${worldId}`)
      .send({
        type: 'broadcast',
        event: 'message',
        payload: message
      })
  }
}