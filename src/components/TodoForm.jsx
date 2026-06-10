import { useState } from 'react'
import useTodoStore from '../store/todoStore'
import { Plus, X } from './icons'

export default function TodoForm({ onClose }) {
  const addTodo = useTodoStore(state => state.addTodo)
  const updateTodo = useTodoStore(state => state.updateTodo)
  const setEditingId = useTodoStore(state => state.setEditingId)
  const editingTodo = useTodoStore(state => state.todos.find(t => t.id === state.editingId))

  const [text, setText] = useState(editingTodo?.text ?? '')
  const [description, setDescription] = useState(editingTodo?.description ?? '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    if (editingTodo) {
      updateTodo(editingTodo.id, text.trim(), description.trim())
    } else {
      addTodo(text.trim(), description.trim())
      setText('')
      setDescription('')
    }
  }

  function handleClear() {
    setText('')
    setDescription('')
  }

  function handleCancel() {
    setEditingId(null)
    if (onClose) onClose()
  }

  const formContent = (
    <>
      <div className="todo-form-fields">
        <input
          type="text"
          value={text}
          autoFocus={!!editingTodo}
          onChange={e => setText(e.target.value)}
          placeholder={editingTodo ? 'Edit todo...' : 'Add a new todo...'}
        />
        <div className="todo-desc-wrapper">
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description (optional)..."
            maxLength={250}
          />
          <span className="todo-desc-counter">{description.length}/250</span>
        </div>
      </div>
      <div className="todo-form-actions">
        {editingTodo && (
          <button type="button" className="btn btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        )}
        <button type="button" className="btn btn-clear" onClick={handleClear}>
          <X size={16} /> Clear
        </button>
        <button type="submit" className="btn btn-add">
          <Plus size={16} /> {editingTodo ? 'Save' : 'Add'}
        </button>
      </div>
    </>
  )

  if (onClose) {
    return (
      <div className="task-panel">
        <div className="task-panel-header">
          <span className="task-panel-title">
            {editingTodo ? 'Edit task' : 'New task'}
          </span>
          <button type="button" className="btn btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form className="todo-form" onSubmit={handleSubmit}>
          {formContent}
        </form>
      </div>
    )
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      {formContent}
    </form>
  )
}
