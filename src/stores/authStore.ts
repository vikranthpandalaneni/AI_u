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
  signInWithGithub: () => Promise<{ error?: any }>
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

// Helper function to get user-friendly error messages
function getUserFriendlyErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred'
  
  const message = error.message || error.error_description || error.toString()
  
  // Handle specific Supabase error codes
  if (message.includes('Invalid login credentials')) {
    return 'The email or password you entered is incorrect. Please check your credentials and try again.'
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.'
  }
  
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Please sign in instead.'
  }
  
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.'
  }
  
  if (message.includes('Unable to validate email address')) {
    return 'Please enter a valid email address.'
  }
  
  if (message.includes('signup is disabled')) {
    return 'Account registration is currently disabled. Please contact support.'
  }
  
  if (message.includes('Email rate limit exceeded')) {
    return 'Too many email attempts. Please wait a few minutes before trying again.'
  }
  
  if (message.includes('Network request failed') || message.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.'
  }
  
  // Return the original message if we don't have a specific handler
  return message
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false, // Start with false to prevent initial loading state
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
            const friendlyMessage = getUserFriendlyErrorMessage(error)
            set({ error: friendlyMessage, loading: false })
            return { error: { message: friendlyMessage } }
          }
          return { error: null }
        } catch (error: any) {
          const friendlyMessage = getUserFriendlyErrorMessage(error)
          set({ error: friendlyMessage, loading: false })
          return { error: { message: friendlyMessage } }
        }
      },

      signInWithEmail: async (email: string, password: string) => {
        set({ loading: true, error: null })
        
        // Client-side validation
        if (!email || !email.includes('@')) {
          const errorMsg = 'Please enter a valid email address'
          set({ error: errorMsg, loading: false })
          return { error: { message: errorMsg } }
        }
        
        if (!password) {
          const errorMsg = 'Password is required'
          set({ error: errorMsg, loading: false })
          return { error: { message: errorMsg } }
        }
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password
          })
          
          if (error) {
            const friendlyMessage = getUserFriendlyErrorMessage(error)
            set({ error: friendlyMessage, loading: false })
            return { error: { message: friendlyMessage } }
          }

          console.log('Sign in successful:', data.user?.email)
          set({ loading: false })
          // Auth state will be updated by the listener
          return { error: null }
        } catch (error: any) {
          const friendlyMessage = getUserFriendlyErrorMessage(error)
          set({ error: friendlyMessage, loading: false })
          return { error: { message: friendlyMessage } }
        }
      },

      signUpWithEmail: async (email: string, password: string, userData?: any) => {
        set({ loading: true, error: null })
        
        // Client-side validation
        if (!email || !email.includes('@')) {
          const errorMsg = 'Please enter a valid email address'
          set({ error: errorMsg, loading: false })
          return { error: { message: errorMsg } }
        }
        
        if (!password || password.length < 6) {
          const errorMsg = 'Password must be at least 6 characters long'
          set({ error: errorMsg, loading: false })
          return { error: { message: errorMsg } }
        }
        
        try {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
              data: userData || {}
            }
          })
          
          if (error) {
            const friendlyMessage = getUserFriendlyErrorMessage(error)
            set({ error: friendlyMessage, loading: false })
            return { error: { message: friendlyMessage } }
          }

          console.log('Sign up successful:', data.user?.email)
          set({ loading: false })
          // Auth state will be updated by the listener
          return { error: null }
        } catch (error: any) {
          const friendlyMessage = getUserFriendlyErrorMessage(error)
          set({ error: friendlyMessage, loading: false })
          return { error: { message: friendlyMessage } }
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null })
          
          const { error } = await supabase.auth.signOut()
          
          if (error) {
            console.error('Sign out error:', error)
            const friendlyMessage = getUserFriendlyErrorMessage(error)
            set({ error: friendlyMessage, loading: false })
            throw error
          } else {
            console.log('Sign out successful')
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
          const friendlyMessage = getUserFriendlyErrorMessage(error)
          set({ error: friendlyMessage, loading: false })
          throw error
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
            const friendlyMessage = getUserFriendlyErrorMessage(error)
            set({ error: friendlyMessage, loading: false, initialized: true })
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
          const friendlyMessage = getUserFriendlyErrorMessage(error)
          set({ 
            error: friendlyMessage, 
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
      .maybeSingle()

    if (fetchError) {
      console.error('Error checking user profile:', fetchError)
      return
    }

    if (!existingUser) {
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
    } else {
      console.log('User profile already exists')
    }
  } catch (error) {
    console.error('Error in createUserProfile:', error)
  }
}