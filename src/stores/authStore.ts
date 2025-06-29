import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// DEPRECATED: This store is being phased out in favor of AuthContext.tsx
// Use useAuth() hook from AuthContext instead of this store

interface AuthState {
  // Legacy state - DO NOT USE - Use useAuth() hook instead
  user: any | null
  session: any
  loading: boolean
  error: string | null
  
  // Legacy methods - DO NOT USE - Use AuthContext methods instead
  setUser: (user: any | null) => void
  setSession: (session: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      loading: true,
      error: null,

      // These methods are deprecated - use AuthContext instead
      setUser: (user: any | null) => set({ user }),
      setSession: (session: any) => set({ session }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage-deprecated',
      partialize: () => ({}) // Don't persist anything - AuthContext handles persistence
    }
  )
)

// WARNING: This store is deprecated and will be removed
// Use useAuth() hook from AuthContext.tsx instead
// All authentication logic has been centralized in AuthContext.tsx