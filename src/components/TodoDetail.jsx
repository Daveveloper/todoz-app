import useTodoStore from '../store/todoStore'
import { Circle, CircleDot, CheckCircle, Pencil, Trash2, X } from './icons'
import './TodoDetail.css'

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

const statusIcons = {
  pending: Circle,
  'in-progress': CircleDot,
  completed: CheckCircle,
}

export default function TodoDetail() {
  const todo = useTodoStore(state => state.todos.find(t => t.id === state.selectedTodoId))
  const setSelectedTodoId = useTodoStore(state => state.setSelectedTodoId)
  const setEditingId = useTodoStore(state => state.setEditingId)
  const setDeleteTarget = useTodoStore(state => state.setDeleteTarget)
  const toggleStatus = useTodoStore(state => state.toggleStatus)

  if (!todo) return null

  const StatusIcon = statusIcons[todo.status]

  const createdDate = new Date(todo.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  function handleEdit() {
    setEditingId(todo.id)
  }

  function handleDelete() {
    setDeleteTarget(todo)
  }

  function handleToggle() {
    toggleStatus(todo.id)
  }

  return (
    <aside className="detail-panel">
      <div className="detail-close">
        <button className="btn btn-icon" onClick={() => setSelectedTodoId(null)}>
          <X size={18} />
        </button>
      </div>

      <div className="detail-title-row">
        <h2 className="detail-title">{todo.text}</h2>
        <span className="detail-id">{todo.id.slice(0, 8)}</span>
      </div>
      <p className="detail-date">{createdDate}</p>

      <div className="detail-jumbotron">
        <p className={`detail-jumbotron-text ${todo.description ? '' : 'detail-jumbotron-text--empty'}`}>
          {todo.description || 'No description'}
        </p>
      </div>

      <div className="detail-body">
        <div className="detail-field">
          <label className="detail-label">Status</label>
          <button className="detail-status" onClick={handleToggle}>
            <StatusIcon size={20} />
            {statusLabels[todo.status]}
          </button>
        </div>
      </div>

      <div className="detail-actions">
        <button className="btn btn-add" onClick={handleEdit}>
          <Pencil size={16} /> Edit
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </aside>
  )
}
