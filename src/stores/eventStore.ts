import { create } from 'zustand'
import { db, type WorldEvent } from '../lib/supabase'

interface EventWithWorld extends WorldEvent {
  ai_worlds?: {
    title: string
    user_id: string
  }
}

interface EventState {
  events: EventWithWorld[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchEvents: (worldId?: string) => Promise<void>
  createEvent: (event: Omit<WorldEvent, 'id' | 'created_at'>) => Promise<{ data?: EventWithWorld; error?: any }>
  updateEvent: (id: string, updates: Partial<WorldEvent>) => Promise<{ error?: any }>
  deleteEvent: (id: string) => Promise<{ error?: any }>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (worldId?: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await db.getEvents(worldId)
      
      if (error) {
        set({ error: error.message, loading: false })
        return
      }

      set({ events: data || [], loading: false })
    } catch (error) {
      console.error('Failed to fetch events:', error)
      set({ error: 'Failed to fetch events', loading: false })
    }
  },

  createEvent: async (event) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await db.createEvent(event)
      
      if (error) {
        set({ error: error.message, loading: false })
        return { error }
      }

      const { events } = get()
      set({ 
        events: [data, ...events],
        loading: false 
      })

      return { data, error: null }
    } catch (error) {
      console.error('Failed to create event:', error)
      set({ error: 'Failed to create event', loading: false })
      return { error }
    }
  },

  updateEvent: async (id: string, updates: Partial<WorldEvent>) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await db.updateEvent(id, updates)
      
      if (error) {
        set({ error: error.message, loading: false })
        return { error }
      }

      const { events } = get()
      const updatedEvents = events.map(event => 
        event.id === id ? { ...event, ...updates } : event
      )

      set({ 
        events: updatedEvents,
        loading: false 
      })

      return { error: null }
    } catch (error) {
      console.error('Failed to update event:', error)
      set({ error: 'Failed to update event', loading: false })
      return { error }
    }
  },

  deleteEvent: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await db.deleteEvent(id)
      
      if (error) {
        set({ error: error.message, loading: false })
        return { error }
      }

      const { events } = get()
      const filteredEvents = events.filter(event => event.id !== id)

      set({ 
        events: filteredEvents,
        loading: false 
      })

      return { error: null }
    } catch (error) {
      console.error('Failed to delete event:', error)
      set({ error: 'Failed to delete event', loading: false })
      return { error }
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null })
}))