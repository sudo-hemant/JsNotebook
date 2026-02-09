import { useState, useRef, useEffect } from 'react';
import { CodeEditor } from '../CodeEditor';
import { Toolbar } from '../Toolbar';
import './Cell.css';

export function Cell({
  cell,
  cellNumber,
  cellIndex,
  isSelected,
  canDelete,
  autoFocus,
  onSelect,
  onCodeChange,
  onRun,
  onDelete,
  onAddBelow,
  onGoToPrev,
  onGoToNext,
  onMoveCell,
  theme,
  isDragging,
  onDragStart,
  onDragEnd,
  dragOverIndex,
  dropPosition
}) {
  const cellRef = useRef(null);
  const dragPreviewRef = useRef(null);

  const handleClick = () => {
    onSelect(cell.id);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cellIndex.toString());

    // Create custom drag preview
    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.display = 'block';
      // Position near cursor - offset slightly so it's visible
      e.dataTransfer.setDragImage(dragPreviewRef.current, 10, 10);

      // Hide it after drag image is captured
      requestAnimationFrame(() => {
        if (dragPreviewRef.current) {
          dragPreviewRef.current.style.display = 'none';
        }
      });
    }

    // Notify parent about drag start
    onDragStart?.(cellIndex);
  };

  const handleDragEnd = () => {
    onDragEnd?.();
  };

  const isBeingDragged = isDragging === cellIndex;
  const showDropAbove = dragOverIndex === cellIndex && dropPosition === 'above';
  const showDropBelow = dragOverIndex === cellIndex && dropPosition === 'below';

  return (
    <>
      {/* Custom drag preview - hidden, used only for drag image */}
      <div ref={dragPreviewRef} className="cell-drag-preview" style={{ display: 'none' }}>
        <div className="drag-preview-content">
          <span className="drag-preview-icon">&#x2630;</span>
          <span className="drag-preview-text">Cell [{cellNumber}]</span>
        </div>
      </div>

      <div
        ref={cellRef}
        className={`cell ${isSelected ? 'selected' : ''} ${cell.status} ${isBeingDragged ? 'dragging' : ''} ${showDropAbove ? 'drop-above' : ''} ${showDropBelow ? 'drop-below' : ''}`}
        onClick={handleClick}
        data-cell-index={cellIndex}
      >
        <Toolbar
          cellNumber={cellNumber}
          onRun={() => onRun(cell.id)}
          onDelete={() => onDelete(cell.id)}
          onAddBelow={() => onAddBelow(cell.id)}
          isRunning={cell.status === 'running'}
          canDelete={canDelete}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      <CodeEditor
        value={cell.code}
        onChange={(value) => onCodeChange(cell.id, value)}
        onRun={() => onRun(cell.id)}
        onAddCell={() => onAddBelow(cell.id)}
        onDelete={canDelete ? () => onDelete(cell.id) : undefined}
        onGoToPrev={onGoToPrev}
        onGoToNext={onGoToNext}
        autoFocus={autoFocus}
        theme={theme}
      />
        <div className="cell-status">
          {cell.status === 'running' && <span className="status-indicator running">Running...</span>}
          {cell.status === 'success' && cell.executionTime !== null && (
            <span className="status-indicator success">{cell.executionTime}ms</span>
          )}
          {cell.status === 'error' && (
            <span className="status-indicator error">Error</span>
          )}
        </div>
      </div>
    </>
  );
}
