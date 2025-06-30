import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  initialized: boolean
  
  // Actions
  signInWithGithub: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>
  signUpWithEmail: (email: string, password: string, userData?: any) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,
      error: null,
      initialized: false,

      signInWithGithub: async () => {
        set({ loading: true, error: null })
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
              redirectTo: `${window.location.origin}/dashboard`
            }
          })
          if (error) {
            set({ error: error.message, loading: false })
          }
        } catch (error: any) {
          set({ error: error.message || 'Failed to sign in', loading: false })
        }
      },

      signInWithEmail: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          
          if (error) {
            set({ error: error.message, loading: false })
            return { error }
          }

          // Auth state will be updated by the listener
          return { error: null }
        } catch (error: any) {
          const errorMessage = error.message || 'Sign in failed'
          set({ error: errorMessage, loading: false })
          return { error: { message: errorMessage } }
        }
      },

      signUpWithEmail: async (email: string, password: string, userData?: any) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData || {}
            }
          })
          
          if (error) {
            set({ error: error.message, loading: false })
            return { error }
          }

          // Auth state will be updated by the listener
          return { error: null }
        } catch (error: any) {
          const errorMessage = error.message || 'Sign up failed'
          set({ error: errorMessage, loading: false })
          return { error: { message: errorMessage } }
        }
      },

      signOut: async () => {
        set({ loading: true, error: null })
        try {
          const { error } = await supabase.auth.signOut()
          
          if (error) {
            console.error('Sign out error:', error)
            set({ error: error.message, loading: false })
          } else {
            // Clear state immediately
            set({ 
              user: null, 
              session: null, 
              loading: false,
              error: null 
            })
          }
        } catch (error: any) {
          console.error('Sign out error:', error)
          set({ error: error.message || 'Sign out failed', loading: false })
        }
      },

      setUser: (user: User | null) => set({ user }),
      setSession: (session: Session | null) => set({ session }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),

      initialize: async () => {
        const { initialized } = get()
        if (initialized) return

        set({ loading: true })
        try {
          // Get initial session
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Error getting session:', error)
            set({ error: error.message, loading: false, initialized: true })
            return
          }

          set({ 
            session, 
            user: session?.user ?? null, 
            loading: false,
            initialized: true
          })

          // Create user profile if session exists
          if (session?.user) {
            await createUserProfile(session.user)
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email)
            
            set({ 
              session, 
              user: session?.user ?? null, 
              loading: false,
              error: null 
            })

            // Create user profile for authenticated users
            if (session?.user && (event === 'SIGNED_UP' || event === 'SIGNED_IN')) {
              await createUserProfile(session.user)
            }
          })

        } catch (error: any) {
          console.error('Auth initialization error:', error)
          set({ 
            error: error.message || 'Failed to initialize auth', 
            loading: false,
            initialized: true 
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        session: state.session,
        initialized: state.initialized
      })
    }
  )
)

// Helper function to create user profile
async function createUserProfile(user: User) {
  try {
    // Check if user profile already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create profile
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            plan: 'free'
          }
        ])
      
      if (insertError) {
        console.error('Error creating user profile:', insertError)
      } else {
        console.log('User profile created successfully')
      }
    } else if (existingUser) {
      console.log('User profile already exists')
    } else if (fetchError) {
      console.error('Error checking user profile:', fetchError)
    }
  } catch (error) {
    console.error('Error in createUserProfile:', error)
  }
}