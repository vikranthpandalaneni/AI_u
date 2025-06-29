import { create } from 'zustand'
import { db, type AIWorld } from '../lib/supabase'

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
  setCurrentWorld: (world: AIWorld | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
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
        set({ error: error.message, loading: false })
        return
      }

      set({ worlds: data || [], loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch worlds', loading: false })
    }
  },

  fetchWorld: async (slug: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await db.getWorld(slug)
      
      if (error) {
        set({ error: error.message, loading: false })
        return
      }

      set({ currentWorld: data, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch world', loading: false })
    }
  },

  createWorld: async (world) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await db.createWorld(world)
      
      if (error) {
        set({ error: error.message, loading: false })
        return { error }
      }

      const { worlds } = get()
      set({ 
        worlds: [data, ...worlds],
        currentWorld: data,
        loading: false 
      })

      return { data, error: null }
    } catch (error) {
      set({ error: 'Failed to create world', loading: false })
      return { error }
    }
  },

  updateWorld: async (id: string, updates: Partial<AIWorld>) => {
    set({ loading: true, error: null })
    try {
      const { error } = await db.updateWorld(id, updates)
      
      if (error) {
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
    } catch (error) {
      set({ error: 'Failed to update world', loading: false })
      return { error }
    }
  },

  deleteWorld: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await db.deleteWorld(id)
      
      if (error) {
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
    } catch (error) {
      set({ error: 'Failed to delete world', loading: false })
      return { error }
    }
  },

  setCurrentWorld: (world: AIWorld | null) => set({ currentWorld: world }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error })
}))