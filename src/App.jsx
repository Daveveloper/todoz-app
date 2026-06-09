import { useEffect } from 'react'
import useTodoStore from './store/todoStore'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import ConfirmModal from './components/ConfirmModal'
import './App.css'

export default function App() {
  const loading = useTodoStore(state => state.loading)
  const error = useTodoStore(state => state.error)
  const deleteTarget = useTodoStore(state => state.deleteTarget)
  const loadTodos = useTodoStore(state => state.loadTodos)

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  return (
    <div className="app">
      <h1 className="app-title">2dos</h1>
      <p className="app-desc">A simple, elegant todo app to keep track of your tasks.</p>
      {error && <p className="app-error">{error}</p>}
      <TodoForm />
      {loading ? (
        <p className="app-loading">Loading...</p>
      ) : (
        <TodoList />
      )}
      {deleteTarget && <ConfirmModal />}
    </div>
  )
}
