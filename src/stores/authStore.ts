// FIXED: Updated auth store to use the new useAuth hook pattern
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, db, type User } from '../lib/supabase'

interface AuthState {
  user: User | null
  session: any
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ error?: any }>
  resetPassword: (email: string) => Promise<{ error?: any }>
  setUser: (user: User | null) => void
  setSession: (session: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          
          if (error) {
            set({ loading: false, error: error.message })
            return { error }
          }

          if (data.user) {
            // Try to get user profile, create if doesn't exist
            const { data: userData, error: userError } = await db.getUser(data.user.id)
            
            if (userError && userError.code === 'PGRST116') {
              // User profile doesn't exist, create it
              const userProfile = {
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata?.name || '',
                avatar_url: data.user.user_metadata?.avatar_url || '',
                plan: 'free' as const
              }

              const { data: newUserData, error: createError } = await db.insertUser(userProfile)
              if (createError) {
                set({ loading: false, error: createError.message })
                return { error: createError }
              }
              
              set({ 
                user: newUserData,
                session: data.session,
                loading: false,
                error: null
              })
            } else if (userError) {
              set({ loading: false, error: userError.message })
              return { error: userError }
            } else {
              set({ 
                user: userData,
                session: data.session,
                loading: false,
                error: null
              })
            }
          }

          return { error: null }
        } catch (error: any) {
          const errorMessage = error?.message || 'An unexpected error occurred'
          set({ loading: false, error: errorMessage })
          return { error: { message: errorMessage } }
        }
      },

      signUp: async (email: string, password: string, metadata = {}) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: metadata
            }
          })
          
          if (error) {
            set({ loading: false, error: error.message })
            return { error }
          }

          if (data.user) {
            const userProfile = {
              id: data.user.id,
              email: data.user.email!,
              name: metadata.name || '',
              avatar_url: metadata.avatar_url || '',
              plan: 'free' as const
            }

            const { data: newUserData, error: profileError } = await db.insertUser(userProfile)
            if (profileError) {
              set({ loading: false, error: profileError.message })
              return { error: profileError }
            }
            
            set({ 
              user: newUserData,
              session: data.session,
              loading: false,
              error: null
            })
          }

          return { error: null }
        } catch (error: any) {
          const errorMessage = error?.message || 'An unexpected error occurred'
          set({ loading: false, error: errorMessage })
          return { error: { message: errorMessage } }
        }
      },

      signOut: async () => {
        set({ loading: true, error: null })
        try {
          await supabase.auth.signOut()
          set({ 
            user: null, 
            session: null, 
            loading: false,
            error: null
          })
        } catch (error: any) {
          set({ loading: false, error: error?.message || 'Failed to sign out' })
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const { user } = get()
        if (!user) return { error: { message: 'No user logged in' } }

        set({ loading: true, error: null })
        try {
          const { error } = await db.updateUser(user.id, updates)
          
          if (error) {
            set({ loading: false, error: error.message })
            return { error }
          }

          set({ 
            user: { ...user, ...updates, updated_at: new Date().toISOString() },
            loading: false,
            error: null
          })

          return { error: null }
        } catch (error: any) {
          const errorMessage = error?.message || 'Failed to update profile'
          set({ loading: false, error: errorMessage })
          return { error: { message: errorMessage } }
        }
      },

      resetPassword: async (email: string) => {
        set({ loading: true, error: null })
        try {
          // TODO: Implement password reset with Supabase
          set({ loading: false })
          return { error: null }
        } catch (error: any) {
          const errorMessage = error?.message || 'Failed to send reset email'
          set({ loading: false, error: errorMessage })
          return { error: { message: errorMessage } }
        }
      },

      setUser: (user: User | null) => set({ user }),
      setSession: (session: any) => set({ session }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        session: state.session 
      })
    }
  )
)

// Initialize auth state
supabase.auth.onAuthStateChange(async (event, session) => {
  const { setUser, setSession, setLoading, setError } = useAuthStore.getState()
  
  setLoading(true)
  setError(null)
  
  try {
    if (session?.user) {
      const { data: userData, error } = await db.getUser(session.user.id)
      
      if (error && error.code === 'PGRST116') {
        // User profile doesn't exist, create it
        const userProfile = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || '',
          avatar_url: session.user.user_metadata?.avatar_url || '',
          plan: 'free' as const
        }

        const { data: newUserData, error: createError } = await db.insertUser(userProfile)
        if (createError) {
          setError(createError.message)
          setUser(null)
          setSession(null)
        } else {
          setUser(newUserData)
          setSession(session)
        }
      } else if (error) {
        setError(error.message)
        setUser(null)
        setSession(null)
      } else {
        setUser(userData)
        setSession(session)
      }
    } else {
      setUser(null)
      setSession(null)
    }
  } catch (error: any) {
    setError(error?.message || 'Authentication error')
    setUser(null)
    setSession(null)
  } finally {
    setLoading(false)
  }
})