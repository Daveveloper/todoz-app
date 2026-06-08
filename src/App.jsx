import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import ConfirmModal from './components/ConfirmModal'
import './App.css'

export default function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at')
      if (ignore) return
      if (error) {
        setError(error.message)
      } else {
        setTodos(data ?? [])
      }
      setLoading(false)
    }
    load()
    return () => { ignore = true }
  }, [])

  async function addTodo(text) {
    const { data, error } = await supabase
      .from('todos')
      .insert({ text, status: 'pending' })
      .select()
    if (error) {
      setError(error.message)
    } else if (data) {
      setTodos([...todos, data[0]])
    }
  }

  async function updateTodo(id, text) {
    const { error } = await supabase
      .from('todos')
      .update({ text })
      .eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      setTodos(todos.map(t => t.id === id ? { ...t, text } : t))
      setEditingId(null)
    }
  }

  async function deleteTodo() {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', deleteTarget.id)
    if (error) {
      setError(error.message)
    } else {
      setTodos(todos.filter(t => t.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  async function toggleStatus(id) {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    const next = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' }
    const newStatus = next[todo.status]
    const { error } = await supabase
      .from('todos')
      .update({ status: newStatus })
      .eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      setTodos(todos.map(t => t.id === id ? { ...t, status: newStatus } : t))
    }
  }

  const filteredTodos = filter === 'all'
    ? todos
    : todos.filter(t => t.status === filter)

  const editingTodo = todos.find(t => t.id === editingId) || null

  return (
    <div className="app">
      <h1 className="app-title">2dos</h1>
      <p className="app-desc">A simple, elegant todo app to keep track of your tasks.</p>
      {error && <p className="app-error">{error}</p>}
      <TodoForm
        key={editingId ?? 'new'}
        editingTodo={editingTodo}
        onAdd={addTodo}
        onUpdate={updateTodo}
        onCancelEdit={() => setEditingId(null)}
      />
      {loading ? (
        <p className="app-loading">Loading...</p>
      ) : (
        <TodoList
          todos={filteredTodos}
          filter={filter}
          onFilterChange={setFilter}
          onToggleStatus={toggleStatus}
          onEdit={setEditingId}
          onDelete={setDeleteTarget}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          todo={deleteTarget}
          onConfirm={deleteTodo}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
