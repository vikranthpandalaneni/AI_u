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
  signInWithGithub: () => Promise<{ error?: any }>
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
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
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
        console.error('Session error:', err)
        setError(err.message || 'Failed to get session')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)

        // Handle user profile creation on sign up or sign in
        if ((event === 'SIGNED_UP' || event === 'SIGNED_IN') && session?.user) {
          await createUserProfile(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
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

  const signInWithGithub = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        setError(error.message)
        return { error }
      }
      
      return { error: null }
    } catch (err: any) {
      const errorMessage = err.message || 'GitHub sign in failed'
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
      const { error } = await supabase.auth.signOut()
      if (error) {
        setError(error.message)
      } else {
        console.log('Sign out successful')
      }
    } catch (err: any) {
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
    signInWithGithub,
    signOut,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}