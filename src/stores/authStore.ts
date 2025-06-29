import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// This store is deprecated in favor of AuthContext.tsx
// Keeping minimal interface for backward compatibility during transition
interface AuthState {
  // Deprecated - use useAuth() hook instead
  user: any | null
  session: any
  loading: boolean
  error: string | null
  
  // Deprecated methods - use AuthContext methods instead
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

      setUser: (user: any | null) => set({ user }),
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

// Note: This store is deprecated. Use useAuth() hook from AuthContext instead.
// All authentication logic has been centralized in AuthContext.tsx