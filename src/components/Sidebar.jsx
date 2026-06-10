import { Plus, LogOut } from './icons'
import useAuthStore from '../store/authStore'
import './Sidebar.css'

export default function Sidebar({ onNewTask }) {
  const signOut = useAuthStore(state => state.signOut)

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img className="sidebar-logo" src="/logo.svg" alt="TODOZ" />
      </div>
      <nav className="sidebar-nav">
        <button className="sidebar-btn" onClick={onNewTask}>
          <Plus size={18} />
          New Task
        </button>
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-btn sidebar-btn--logout" onClick={signOut}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
