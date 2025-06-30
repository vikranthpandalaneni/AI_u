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

// **FIXED**: This interface now perfectly matches the corrected database schema.
export interface AIWorld {
  id: string
  user_id: string
  title: string
  description?: string
  slug: string
  domain?: string
  theme: { color: string; mode: 'light' | 'dark' }
  features: {
      chat: boolean;
      voice: boolean;
      video: boolean;
      nft: boolean;
      crypto: boolean;
      events: boolean;
      translations: boolean;
      social: boolean;
  }
  pricing: {
      free: boolean;
      premium: boolean;
      price: number;
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

// Database helpers
export const db = {
  // Users
  getUser: (id: string) => supabase.from('users').select('*').eq('id', id).single(),
  insertUser: (user: Omit<User, 'created_at' | 'updated_at'>) => supabase.from('users').insert(user).select().single(),
  updateUser: (id: string, updates: Partial<User>) => supabase.from('users').update(updates).eq('id', id),

  // AI Worlds
  getWorlds: (userId?: string) => {
    let query = supabase.from('ai_worlds').select('*')
    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('public', true)
    }
    return query.order('created_at', { ascending: false })
  },
  getWorld: (slug: string) => supabase.from('ai_worlds').select('*').eq('slug', slug).single(),

  // **FIXED**: Explicitly define the type for the 'world' parameter for type safety.
  createWorld: (world: Omit<AIWorld, 'id' | 'created_at' | 'updated_at'>) => {
    return supabase.from('ai_worlds').insert(world).select().single()
  },

  updateWorld: (id: string, updates: Partial<AIWorld>) => supabase.from('ai_worlds').update(updates).eq('id', id),
  deleteWorld: (id: string) => supabase.from('ai_worlds').delete().eq('id', id),

  // Events
  getEvents: (worldId?: string) => {
    let query = supabase.from('world_events').select(`*, ai_worlds!inner(title, user_id)`)
    if (worldId) {
      query = query.eq('world_id', worldId)
    }
    return query.order('start_time', { ascending: true })
  },
  createEvent: (event: Omit<WorldEvent, 'id' | 'created_at'>) => supabase.from('world_events').insert(event).select(`*, ai_worlds!inner(title, user_id)`).single(),
  updateEvent: (id: string, updates: Partial<WorldEvent>) => supabase.from('world_events').update(updates).eq('id', id).select(`*, ai_worlds!inner(title, user_id)`).single(),
  deleteEvent: (id: string) => supabase.from('world_events').delete().eq('id', id),

  // Analytics
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => supabase.from('analytics_events').insert(event),
  getAnalytics: (worldId: string, startDate?: string, endDate?: string) => {
    let query = supabase.from('analytics_events').select('*').eq('world_id', worldId)
    if (startDate) query = query.gte('timestamp', startDate)
    if (endDate) query = query.lte('timestamp', endDate)
    return query.order('timestamp', { ascending: false })
  }
}

// Storage helpers
export const storage = {
  uploadFile: (bucket: string, path: string, file: File) => supabase.storage.from(bucket).upload(path, file),
  
  getUserFiles: (userId: string) => supabase.storage.from('user-files').list(userId),
  
  getPublicUrl: (bucket: string, path: string) => supabase.storage.from(bucket).getPublicUrl(path),
  
  deleteFile: (bucket: string, path: string) => supabase.storage.from(bucket).remove([path])
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