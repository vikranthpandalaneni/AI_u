import { create } from 'zustand'
import { db, type AIWorld, supabase } from '../lib/supabase'

interface WorldState {
  worlds: AIWorld[]
  currentWorld: AIWorld | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchWorlds: (userId?: string) => Promise<void>
  fetchWorld: (slug: string) => Promise<void>
  createWorld: (world: Omit<AIWorld, 'id' | 'created_at' | 'updated_at'>) => Promise<{ data?: AIWorld; error?: any }>
  updateWorld: (id: string, updates: Partial<AIWorld>) => Promise<{ error?: any }>
  deleteWorld: (id: string) => Promise<{ error?: any }>
  subscribeToWorlds: (userId: string) => any
  setCurrentWorld: (world: AIWorld | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useWorldStore = create<WorldState>((set, get) => ({
  worlds: [],
  currentWorld: null,
  loading: false,
  error: null,

  fetchWorlds: async (userId?: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await db.getWorlds(userId)
      
      if (error) {
        console.error('Fetch worlds error:', error)
        set({ error: error.message, loading: false })
        return
      }

      set({ worlds: data || [], loading: false })
    } catch (error: any) {
      console.error('Fetch worlds error:', error)
      set({ error: 'Failed to fetch worlds', loading: false })
    }
  },

  fetchWorld: async (slug: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await db.getWorld(slug)
      
      if (error) {
        console.error('Fetch world error:', error)
        set({ error: error.message, loading: false })
        return
      }

      set({ currentWorld: data, loading: false })
    } catch (error: any) {
      console.error('Fetch world error:', error)
      set({ error: 'Failed to fetch world', loading: false })
    }
  },

  createWorld: async (world) => {
    set({ loading: true, error: null })
    try {
      console.log('Creating world with data:', world)
      
      const { data, error } = await db.createWorld(world)
      
      if (error) {
        console.error('Create world error:', error)
        set({ error: error.message, loading: false })
        return { error }
      }

      console.log('World created successfully:', data)
      
      const { worlds } = get()
      set({ 
        worlds: [data, ...worlds],
        currentWorld: data,
        loading: false 
      })

      return { data, error: null }
    } catch (error: any) {
      console.error('Create world error:', error)
      const errorMessage = error.message || 'Failed to create world'
      set({ error: errorMessage, loading: false })
      return { error: { message: errorMessage } }
    }
  },

  updateWorld: async (id: string, updates: Partial<AIWorld>) => {
    set({ loading: true, error: null })
    try {
      const { error } = await db.updateWorld(id, updates)
      
      if (error) {
        console.error('Update world error:', error)
        set({ error: error.message, loading: false })
        return { error }
      }

      const { worlds, currentWorld } = get()
      const updatedWorlds = worlds.map(world => 
        world.id === id ? { ...world, ...updates } : world
      )

      set({ 
        worlds: updatedWorlds,
        currentWorld: currentWorld?.id === id 
          ? { ...currentWorld, ...updates }
          : currentWorld,
        loading: false 
      })

      return { error: null }
    } catch (error: any) {
      console.error('Update world error:', error)
      set({ error: 'Failed to update world', loading: false })
      return { error }
    }
  },

  deleteWorld: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await db.deleteWorld(id)
      
      if (error) {
        console.error('Delete world error:', error)
        set({ error: error.message, loading: false })
        return { error }
      }

      const { worlds, currentWorld } = get()
      const filteredWorlds = worlds.filter(world => world.id !== id)

      set({ 
        worlds: filteredWorlds,
        currentWorld: currentWorld?.id === id ? null : currentWorld,
        loading: false 
      })

      return { error: null }
    } catch (error: any) {
      console.error('Delete world error:', error)
      set({ error: 'Failed to delete world', loading: false })
      return { error }
    }
  },

  subscribeToWorlds: (userId: string) => {
    // First, fetch initial data
    get().fetchWorlds(userId)

    // Then, set up real-time subscription
    const subscription = supabase
      .channel('worlds-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_worlds',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New world created:', payload.new)
          const { worlds } = get()
          set({ worlds: [payload.new as AIWorld, ...worlds] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_worlds',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('World updated:', payload.new)
          const { worlds } = get()
          const updatedWorlds = worlds.map(world =>
            world.id === payload.new.id ? payload.new as AIWorld : world
          )
          set({ worlds: updatedWorlds })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'ai_worlds',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('World deleted:', payload.old)
          const { worlds } = get()
          const filteredWorlds = worlds.filter(world => world.id !== payload.old.id)
          set({ worlds: filteredWorlds })
        }
      )
      .subscribe()

    return subscription
  },

  setCurrentWorld: (world: AIWorld | null) => set({ currentWorld: world }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null })
}))