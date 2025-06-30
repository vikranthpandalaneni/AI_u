import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Enhanced error checking for environment variables
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable')
  throw new Error('Supabase URL is required. Please check your .env file and ensure VITE_SUPABASE_URL is set.')
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable')
  throw new Error('Supabase Anon Key is required. Please check your .env file and ensure VITE_SUPABASE_ANON_KEY is set.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error('Invalid VITE_SUPABASE_URL format:', supabaseUrl)
  throw new Error('Invalid Supabase URL format. Please check your .env file.')
}

console.log('Supabase configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  anonKeyLength: supabaseAnonKey?.length
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'ai-universe@1.0.0'
    }
  },
  db: {
    schema: 'public'
  }
})

// Test connection on initialization
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error)
  } else {
    console.log('Supabase connection successful')
  }
}).catch(error => {
  console.error('Supabase initialization error:', error)
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
  theme: { color: string; mode: 'light' | 'dark' }
  features: {
    chat: boolean
    voice: boolean
    video: boolean
    nft: boolean
    crypto: boolean
    events: boolean
    translations: boolean
    social: boolean
  }
  pricing: {
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

// Enhanced database helpers with better error handling
export const db = {
  // Users
  getUser: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Get user error:', error)
        throw new Error(`Failed to load user profile: ${error.message}`)
      }
      
      return { data, error: null }
    } catch (error: any) {
      console.error('Get user error:', error)
      return { data: null, error: error.message || 'Failed to load user profile' }
    }
  },

  insertUser: async (user: Omit<User, 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single()
      
      if (error) {
        console.error('Insert user error:', error)
        throw new Error(`Failed to create user profile: ${error.message}`)
      }
      
      return { data, error: null }
    } catch (error: any) {
      console.error('Insert user error:', error)
      return { data: null, error: error.message || 'Failed to create user profile' }
    }
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Update user error:', error)
        throw new Error(`Failed to update user profile: ${error.message}`)
      }
      
      return { data, error: null }
    } catch (error: any) {
      console.error('Update user error:', error)
      return { data: null, error: error.message || 'Failed to update user profile' }
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
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) {
        console.error('Get worlds error:', error)
        throw new Error(`Failed to load worlds: ${error.message}`)
      }
      
      return { data: data || [], error: null }
    } catch (error: any) {
      console.error('Get worlds error:', error)
      return { data: [], error: error.message || 'Failed to load worlds' }
    }
  },

  getWorld: async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_worlds')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        console.error('Get world error:', error)
        throw new Error(`Failed to load world: ${error.message}`)
      }
      
      return { data, error: null }
    } catch (error: any) {
      console.error('Get world error:', error)
      return { data: null, error: error.message || 'Failed to load world' }
    }
  },

  createWorld: async (world: Omit<AIWorld, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('ai_worlds')
        .insert(world)
        .select()
        .single()
      
      if (error) {
        console.error('Create world error:', error)
        
        // Map specific database errors to user-friendly messages
        if (error.message?.includes('duplicate key value violates unique constraint "ai_worlds_slug_key"')) {
          throw new Error('This world name is already taken. Please choose another.')
        }
        
        throw new Error(`Failed to create world: ${error.message}`)
      }
      
      return { data, error: null }
    } catch (error: any) {
      console.error('Create world error:', error)
      return { data: null, error: error.message || 'Failed to create world. Please try again.' }
    }
  },

  updateWorld: async (id: string, updates: Partial<AIWorld>) => {
    try {
      const { data, error } = await supabase
        .from('ai_worlds')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Update world error:', error)
        throw new Error(`Failed to update world: ${error.message}`)
      }
      
      return { data, error: null }
    } catch (error: any) {
      console.error('Update world error:', error)
      return { data: null, error: error.message || 'Failed to update world' }
    }
  },

  deleteWorld: async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_worlds')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Delete world error:', error)
        throw new Error(`Failed to delete world: ${error.message}`)
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Delete world error:', error)
      return { error: error.message || 'Failed to delete world' }
    }
  },

  // Events
  getEvents: async (worldId?: string) => {
    try {
      let query = supabase
        .from('world_events')
        .select(`*, ai_worlds!inner(title, user_id)`)
      
      if (worldId) {
        query = query.eq('world_id', worldId)
      }
      
      const { data, error } = await query.order('start_time', { ascending: true })
      
      if (error) {
        console.error('Get events error:', error)
        throw new Error(`Failed to load events: ${error.message}`)
      }
      
      return { data: data || [], error: null }
    } catch (error: any) {
      console.error('Get events error:', error)
      return { data: [], error: error.message || 'Failed to load events' }
    }
  },

  createEvent: async (event: Omit<WorldEvent, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('world_events')
        .insert(event)
        .select(`*, ai_worlds!inner(title, user_id)`)
        .single()
      
      if (error) {
        console.error('Create event error:', error)
        throw new Error(`Failed to create event: ${error.message}`)
      }
      
      return { data, error: null }
    } catch (error: any) {
      console.error('Create event error:', error)
      return { data: null, error: error.message || 'Failed to create event' }
    }
  },

  updateEvent: async (id: string, updates: Partial<WorldEvent>) => {
    try {
      const { data, error } = await supabase
        .from('world_events')
        .update(updates)
        .eq('id', id)
        .select(`*, ai_worlds!inner(title, user_id)`)
        .single()
      
      if (error) {
        console.error('Update event error:', error)
        throw new Error(`Failed to update event: ${error.message}`)
      }
      
      return { data, error: null }
    } catch (error: any) {
      console.error('Update event error:', error)
      return { data: null, error: error.message || 'Failed to update event' }
    }
  },

  deleteEvent: async (id: string) => {
    try {
      const { error } = await supabase
        .from('world_events')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Delete event error:', error)
        throw new Error(`Failed to delete event: ${error.message}`)
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Delete event error:', error)
      return { error: error.message || 'Failed to delete event' }
    }
  },

  // Analytics
  trackEvent: async (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert(event)
      
      if (error) {
        console.error('Track event error:', error)
        throw new Error(`Failed to track event: ${error.message}`)
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Track event error:', error)
      return { error: error.message || 'Failed to track event' }
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
      
      const { data, error } = await query.order('timestamp', { ascending: false })
      
      if (error) {
        console.error('Get analytics error:', error)
        throw new Error(`Failed to load analytics: ${error.message}`)
      }
      
      return { data: data || [], error: null }
    } catch (error: any) {
      console.error('Get analytics error:', error)
      return { data: [], error: error.message || 'Failed to load analytics' }
    }
  }
}

// Storage helpers with secure signed URLs
export const storage = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file)
      
      if (error) {
        console.error('Upload file error:', error)
        throw new Error(`Failed to upload file: ${error.message}`)
      }
      
      return { data, error: null }
    } catch (error: any) {
      console.error('Upload file error:', error)
      return { data: null, error: error.message || 'Failed to upload file' }
    }
  },

  getUserFiles: async (userId: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-files')
        .list(userId)
      
      if (error) {
        console.error('Get user files error:', error)
        throw new Error(`Failed to load files: ${error.message}`)
      }
      
      return { data: data || [], error: null }
    } catch (error: any) {
      console.error('Get user files error:', error)
      return { data: [], error: error.message || 'Failed to load files' }
    }
  },

  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(path)
  },

  // SECURE: Create signed URLs for private file downloads
  createSignedUrl: async (bucket: string, path: string, expiresIn: number = 60) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)
      
      if (error) {
        console.error('Create signed URL error:', error)
        throw new Error(`Failed to create download link: ${error.message}`)
      }
      
      return { data, error: null }
    } catch (error: any) {
      console.error('Create signed URL error:', error)
      return { data: null, error: error.message || 'Failed to create download link' }
    }
  },

  deleteFile: async (bucket: string, path: string) => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])
      
      if (error) {
        console.error('Delete file error:', error)
        throw new Error(`Failed to delete file: ${error.message}`)
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Delete file error:', error)
      return { error: error.message || 'Failed to delete file' }
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