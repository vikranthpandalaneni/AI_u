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
        console.error('Fetch events error:', error)
        set({ error: 'Failed to load events. Please try again.', loading: false })
        return
      }

      set({ events: data || [], loading: false })
    } catch (error: any) {
      console.error('Failed to fetch events:', error)
      set({ error: 'Failed to load events. Please try again.', loading: false })
    }
  },

  createEvent: async (event) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await db.createEvent(event)
      
      if (error) {
        console.error('Create event error:', error)
        
        // Map specific errors to user-friendly messages
        let errorMessage = 'Failed to create event. Please try again.'
        if (error.message?.includes('permission denied')) {
          errorMessage = 'You do not have permission to create events in this world.'
        } else if (error.message?.includes('foreign key constraint')) {
          errorMessage = 'The selected world is no longer available.'
        }
        
        set({ error: errorMessage, loading: false })
        return { error: { message: errorMessage } }
      }

      const { events } = get()
      set({ 
        events: [data, ...events],
        loading: false 
      })

      return { data, error: null }
    } catch (error: any) {
      console.error('Failed to create event:', error)
      const errorMessage = 'Failed to create event. Please check your connection and try again.'
      set({ error: errorMessage, loading: false })
      return { error: { message: errorMessage } }
    }
  },

  updateEvent: async (id: string, updates: Partial<WorldEvent>) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await db.updateEvent(id, updates)
      
      if (error) {
        console.error('Update event error:', error)
        set({ error: 'Failed to update event. Please try again.', loading: false })
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
    } catch (error: any) {
      console.error('Failed to update event:', error)
      set({ error: 'Failed to update event. Please try again.', loading: false })
      return { error }
    }
  },

  deleteEvent: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await db.deleteEvent(id)
      
      if (error) {
        console.error('Delete event error:', error)
        set({ error: 'Failed to delete event. Please try again.', loading: false })
        return { error }
      }

      const { events } = get()
      const filteredEvents = events.filter(event => event.id !== id)

      set({ 
        events: filteredEvents,
        loading: false 
      })

      return { error: null }
    } catch (error: any) {
      console.error('Failed to delete event:', error)
      set({ error: 'Failed to delete event. Please try again.', loading: false })
      return { error }
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null })
}))