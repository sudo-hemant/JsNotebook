import './Toolbar.css';

export function Toolbar({ cellNumber, onRun, onDelete, onAddBelow, isRunning, canDelete }) {
  return (
    <div className="toolbar">
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
