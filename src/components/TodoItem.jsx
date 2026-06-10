import useTodoStore from '../store/todoStore'

export default function TodoItem({ todo }) {
  const selectedTodoId = useTodoStore(state => state.selectedTodoId)
  const setSelectedTodoId = useTodoStore(state => state.setSelectedTodoId)

  const isSelected = selectedTodoId === todo.id

  const desc = todo.description
  const truncatedDesc = desc && desc.length > 50 ? desc.slice(0, 50) + '...' : desc

  return (
    <div
      className={`todo-item todo-item--${todo.status} ${isSelected ? 'todo-item--selected' : ''}`}
      onClick={() => setSelectedTodoId(todo.id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedTodoId(todo.id) }}
    >
      <div className="todo-content">
        <span className="todo-text">{todo.text}</span>
        {truncatedDesc && <p className="todo-desc">{truncatedDesc}</p>}
      </div>
    </div>
  )
}
