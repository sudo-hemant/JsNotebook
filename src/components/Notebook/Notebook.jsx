import { useEffect } from 'react';
import { Cell } from '../Cell';
import './Notebook.css';

export function Notebook({
  cells,
  selectedCellId,
  focusCellId,
  onSelectCell,
  onCodeChange,
  onRunCell,
  onDeleteCell,
  onAddCell,
  onClearFocus,
  onGoToPrev,
  onGoToNext
}) {
  // Clear focus after it's been applied
  useEffect(() => {
    if (focusCellId) {
      // Small delay to let the component mount
      const timer = setTimeout(() => {
        onClearFocus?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusCellId, onClearFocus]);

  return (
    <div className="notebook">
      <div className="notebook-header">
        <h1>JS Notebook</h1>
        <span className="keyboard-hint">⌘/Ctrl+Enter: Run | ⌘/Ctrl+B: New | ⌘/Ctrl+↑↓: Navigate</span>
        <button className="add-cell-btn" onClick={() => onAddCell()}>
          + Add Cell
        </button>
      </div>
      <div className="notebook-cells">
        {cells.map((cell, index) => (
          <Cell
            key={cell.id}
            cell={cell}
            cellNumber={index + 1}
            isSelected={cell.id === selectedCellId}
            canDelete={cells.length > 1}
            autoFocus={cell.id === focusCellId}
            onSelect={onSelectCell}
            onCodeChange={onCodeChange}
            onRun={onRunCell}
            onDelete={onDeleteCell}
            onAddBelow={onAddCell}
            onGoToPrev={onGoToPrev}
            onGoToNext={onGoToNext}
          />
        ))}
        <div className="notebook-footer">
          Auto-saved to browser storage
        </div>
      </div>
    </div>
  );
}
