import './Toolbar.css';

export function Toolbar({ cellNumber, onRun, onDelete, onAddBelow, isRunning, canDelete, onDragStart, onDragEnd }) {
  return (
    <div className="toolbar">
      <div
        className="drag-handle"
        draggable="true"
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        title="Drag to reorder"
      >
        ⋮⋮
      </div>
      <span className="cell-number">[{cellNumber}]</span>
      <button
        className="toolbar-btn run-btn"
        onClick={onRun}
        disabled={isRunning}
        title="Run (Shift+Enter)"
      >
        {isRunning ? '...' : '▶'}
      </button>
      <button
        className="toolbar-btn add-btn"
        onClick={onAddBelow}
        title="Add cell below"
      >
        +
      </button>
      <button
        className="toolbar-btn delete-btn"
        onClick={onDelete}
        disabled={!canDelete}
        title="Delete cell (Cmd+Shift+Backspace)"
      >
        🗑
      </button>
    </div>
  );
}
