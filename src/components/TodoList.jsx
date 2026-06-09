import useTodoStore from '../store/todoStore'
import TodoItem from './TodoItem'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export default function TodoList() {
  const todos = useTodoStore(state => state.todos)
  const filter = useTodoStore(state => state.filter)
  const setFilter = useTodoStore(state => state.setFilter)

  const filteredTodos = filter === 'all'
    ? todos
    : todos.filter(t => t.status === filter)

  return (
    <div className="todo-list">
      <div className="todo-filters">
        {filters.map(f => (
          <button
            key={f.value}
            className={`todo-filter-btn ${filter === f.value ? 'active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredTodos.length === 0 ? (
        <p className="todo-empty">No todos yet. Add one above!</p>
      ) : (
        <div className="todo-items">
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  )
}
