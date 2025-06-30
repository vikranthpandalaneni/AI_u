import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, userData?: any) => Promise<{ data?: any; error?: any }>
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('Error getting session:', error)
          setError(error.message)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          
          // Create user profile if session exists
          if (session?.user) {
            await createUserProfile(session.user)
          }
        }
      } catch (err: any) {
        if (!mounted) return
        console.error('Session error:', err)
        setError(err.message || 'Failed to get session')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log('Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)

        // Create user profile for authenticated users
        if (session?.user && (event === 'SIGNED_UP' || event === 'SIGNED_IN')) {
          await createUserProfile(session.user)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const createUserProfile = async (user: User) => {
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
              name: user.user_metadata?.name || '',
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

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      })
      
      if (error) {
        setError(error.message)
        return { error }
      }
      
      console.log('Sign up successful:', data.user?.email)
      return { data }
    } catch (err: any) {
      const errorMessage = err.message || 'Sign up failed'
      setError(errorMessage)
      return { error: { message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setError(error.message)
        return { error }
      }
      
      console.log('Sign in successful:', data.user?.email)
      return { data }
    } catch (err: any) {
      const errorMessage = err.message || 'Sign in failed'
      setError(errorMessage)
      return { error: { message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Clear state immediately for better UX
      setUser(null)
      setSession(null)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        setError(error.message)
      } else {
        console.log('Sign out successful')
      }
    } catch (err: any) {
      console.error('Sign out error:', err)
      const errorMessage = err.message || 'Sign out failed'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}