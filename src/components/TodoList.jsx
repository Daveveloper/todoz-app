import TodoItem from './TodoItem'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export default function TodoList({ todos, filter, onFilterChange, onToggleStatus, onEdit, onDelete }) {
  return (
    <div className="todo-list">
      <div className="todo-filters">
        {filters.map(f => (
          <button
            key={f.value}
            className={`todo-filter-btn ${filter === f.value ? 'active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {todos.length === 0 ? (
        <p className="todo-empty">No todos yet. Add one above!</p>
      ) : (
        <div className="todo-items">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
