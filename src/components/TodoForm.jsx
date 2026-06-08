import { useState } from 'react'
import { Plus } from './icons'

export default function TodoForm({ editingTodo, onAdd, onUpdate, onCancelEdit }) {
  const [text, setText] = useState(editingTodo?.text ?? '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    if (editingTodo) {
      onUpdate(editingTodo.id, text.trim())
    } else {
      onAdd(text.trim())
    }
    setText('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        autoFocus={!!editingTodo}
        onChange={e => setText(e.target.value)}
        placeholder={editingTodo ? 'Edit todo...' : 'Add a new todo...'}
      />
      <div className="todo-form-actions">
        {editingTodo && (
          <button type="button" className="btn btn-cancel" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-add">
          {editingTodo ? 'Save' : <Plus size={20} />}
        </button>
      </div>
    </form>
  )
}
