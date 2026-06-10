import { useState, useEffect } from 'react'
import useAuthStore from './store/authStore'
import useTodoStore from './store/todoStore'
import Sidebar from './components/Sidebar'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import ConfirmModal from './components/ConfirmModal'
import LoginForm from './components/LoginForm'
import TodoDetail from './components/TodoDetail'
import './App.css'

export default function App() {
  const user = useAuthStore(state => state.user)
  const authLoading = useAuthStore(state => state.loading)
  const checkSession = useAuthStore(state => state.checkSession)

  const todoLoading = useTodoStore(state => state.loading)
  const todoError = useTodoStore(state => state.error)
  const deleteTarget = useTodoStore(state => state.deleteTarget)
  const editingId = useTodoStore(state => state.editingId)
  const selectedTodoId = useTodoStore(state => state.selectedTodoId)
  const loadTodos = useTodoStore(state => state.loadTodos)

  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    if (user) loadTodos()
  }, [user, loadTodos])

  const formVisible = showForm || !!editingId

  function handleCloseForm() {
    setShowForm(false)
  }

  if (authLoading) {
    return (
      <div className="app-loading-full">
        <p className="app-loading">Loading...</p>
      </div>
    )
  }

  if (!user) return <LoginForm />

  return (
    <div className="dashboard">
      <Sidebar onNewTask={() => setShowForm(true)} />
      <div className="main">
        <div className="main-content">
          {todoError && <p className="app-error">{todoError}</p>}
          {formVisible && <TodoForm key={editingId ?? 'new'} onClose={handleCloseForm} />}
          {todoLoading ? (
            <p className="app-loading">Loading...</p>
          ) : (
            <TodoList />
          )}
        </div>
        {selectedTodoId && <TodoDetail />}
      </div>
      {deleteTarget && <ConfirmModal />}
    </div>
  )
}
