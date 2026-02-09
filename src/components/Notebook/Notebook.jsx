import { useEffect, useState, useCallback, useRef } from 'react';
import { Cell } from '../Cell';
import { ThemeToggle } from '../ThemeToggle';
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
  onGoToNext,
  onMoveCell,
  theme,
  onToggleTheme
}) {
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dropPosition, setDropPosition] = useState(null); // 'above' or 'below'
  const cellsContainerRef = useRef(null);

  // Clear focus after it's been applied
  useEffect(() => {
    if (focusCellId) {
      const timer = setTimeout(() => {
        onClearFocus?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusCellId, onClearFocus]);

  const handleDragStart = useCallback((index) => {
    setDraggingIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggingIndex === null) return;

    // Find which cell we're over
    const cellElements = cellsContainerRef.current?.querySelectorAll('.cell');
    if (!cellElements) return;

    for (let i = 0; i < cellElements.length; i++) {
      const cellEl = cellElements[i];
      const rect = cellEl.getBoundingClientRect();

      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        // Skip if hovering over the dragged cell itself
        if (i === draggingIndex) {
          setDragOverIndex(null);
          setDropPosition(null);
          return;
        }

        const midpoint = rect.top + rect.height / 2;
        const position = e.clientY < midpoint ? 'above' : 'below';

        setDragOverIndex(i);
        setDropPosition(position);
        return;
      }
    }
  }, [draggingIndex]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();

    if (draggingIndex === null || dragOverIndex === null) {
      handleDragEnd();
      return;
    }

    let targetIndex = dragOverIndex;

    // Adjust target based on drop position
    if (dropPosition === 'below') {
      targetIndex = dragOverIndex + 1;
    }

    // Adjust for the removal of the dragged item
    if (draggingIndex < targetIndex) {
      targetIndex -= 1;
    }

    if (draggingIndex !== targetIndex && onMoveCell) {
      onMoveCell(draggingIndex, targetIndex);
    }

    handleDragEnd();
  }, [draggingIndex, dragOverIndex, dropPosition, onMoveCell, handleDragEnd]);

  const handleDragLeave = useCallback((e) => {
    // Only clear if leaving the cells container entirely
    if (cellsContainerRef.current && !cellsContainerRef.current.contains(e.relatedTarget)) {
      setDragOverIndex(null);
      setDropPosition(null);
    }
  }, []);

  return (
    <div className="notebook">
      <div className="notebook-header">
        <h1>JS Notebook</h1>
        <span className="keyboard-hint">⌘/Ctrl+Enter: Run | ⌘/Ctrl+B: New | ⌘/Ctrl+↑↓: Navigate</span>
        <div className="header-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="add-cell-btn" onClick={() => onAddCell()}>
            + Add Cell
          </button>
        </div>
      </div>
      <div
        ref={cellsContainerRef}
        className={`notebook-cells ${draggingIndex !== null ? 'is-dragging' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      >
        {cells.map((cell, index) => (
          <Cell
            key={cell.id}
            cell={cell}
            cellNumber={index + 1}
            cellIndex={index}
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
            onMoveCell={onMoveCell}
            theme={theme}
            isDragging={draggingIndex}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            dragOverIndex={dragOverIndex}
            dropPosition={dropPosition}
          />
        ))}
        <div className="notebook-footer">
          Auto-saved to browser storage
        </div>
      </div>
    </div>
  );
}
