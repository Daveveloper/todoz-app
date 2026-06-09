import useTodoStore from '../store/todoStore'
import { Circle, CircleDot, CheckCircle, Pencil, Trash2 } from './icons'

const statusIcons = {
  pending: Circle,
  'in-progress': CircleDot,
  completed: CheckCircle,
}

export default function TodoItem({ todo }) {
  const toggleStatus = useTodoStore(state => state.toggleStatus)
  const setEditingId = useTodoStore(state => state.setEditingId)
  const setDeleteTarget = useTodoStore(state => state.setDeleteTarget)

  const StatusIcon = statusIcons[todo.status]

  const desc = todo.description
  const truncatedDesc = desc && desc.length > 50 ? desc.slice(0, 50) + '...' : desc

  return (
    <div className={`todo-item todo-item--${todo.status}`}>
      <button
        className="todo-status"
        onClick={() => toggleStatus(todo.id)}
        title={`Status: ${todo.status}. Click to change.`}
      >
        <StatusIcon size={22} />
      </button>
      <div className="todo-content">
        <span className="todo-text">{todo.text}</span>
        {truncatedDesc && <p className="todo-desc">{truncatedDesc}</p>}
      </div>
      <div className="todo-actions">
        <button className="btn btn-icon" onClick={() => setEditingId(todo.id)} title="Edit">
          <Pencil size={18} />
        </button>
        <button className="btn btn-icon btn-danger" onClick={() => setDeleteTarget(todo)} title="Delete">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
