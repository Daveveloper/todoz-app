import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useTodoStore = create((set, get) => ({
  todos: [],
  filter: 'all',
  editingId: null,
  deleteTarget: null,
  loading: true,
  error: null,

  loadTodos: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at')
    if (error) {
      set({ error: error.message, loading: false })
    } else {
      set({ todos: data ?? [], loading: false })
    }
  },

  addTodo: async (text, description = '') => {
    const { data, error } = await supabase
      .from('todos')
      .insert({ text, description, status: 'pending' })
      .select()
    if (error) {
      set({ error: error.message })
    } else if (data) {
      set(state => ({ todos: [...state.todos, data[0]] }))
    }
  },

  updateTodo: async (id, text, description = '') => {
    const { error } = await supabase
      .from('todos')
      .update({ text, description })
      .eq('id', id)
    if (error) {
      set({ error: error.message })
    } else {
      set(state => ({
        todos: state.todos.map(t => t.id === id ? { ...t, text, description } : t),
        editingId: null,
      }))
    }
  },

  deleteTodo: async () => {
    const { deleteTarget } = get()
    if (!deleteTarget) return
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', deleteTarget.id)
    if (error) {
      set({ error: error.message })
    } else {
      set(state => ({
        todos: state.todos.filter(t => t.id !== deleteTarget.id),
        deleteTarget: null,
      }))
    }
  },

  toggleStatus: async (id) => {
    const todo = get().todos.find(t => t.id === id)
    if (!todo) return
    const next = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' }
    const newStatus = next[todo.status]
    const { error } = await supabase
      .from('todos')
      .update({ status: newStatus })
      .eq('id', id)
    if (error) {
      set({ error: error.message })
    } else {
      set(state => ({
        todos: state.todos.map(t => t.id === id ? { ...t, status: newStatus } : t),
      }))
    }
  },

  setFilter: (filter) => set({ filter }),
  setEditingId: (id) => set({ editingId: id }),
  setDeleteTarget: (todo) => set({ deleteTarget: todo }),
}))

export default useTodoStore
