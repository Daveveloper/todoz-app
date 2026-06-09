import useTodoStore from '../store/todoStore'

export default function ConfirmModal() {
  const deleteTarget = useTodoStore(state => state.deleteTarget)
  const deleteTodo = useTodoStore(state => state.deleteTodo)
  const setDeleteTarget = useTodoStore(state => state.setDeleteTarget)

  return (
    <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Delete todo</h2>
        <p className="modal-text">
          Are you sure you want to delete <strong>&quot;{deleteTarget?.text}&quot;</strong>?
        </p>
        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={() => setDeleteTarget(null)}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={deleteTodo}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
