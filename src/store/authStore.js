import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  checkSession: async () => {
    set({ loading: true, error: null })
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      set({ user: null, session: null, loading: false, error: error.message })
    } else {
      set({ user: session?.user ?? null, session, loading: false })
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ user: null, session: null, loading: false, error: error.message })
    } else {
      set({ user: data.user, session: data.session, loading: false })
    }
  },

  signOut: async () => {
    set({ loading: true })
    const { error } = await supabase.auth.signOut()
    if (error) {
      set({ loading: false, error: error.message })
    } else {
      set({ user: null, session: null, loading: false })
    }
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
