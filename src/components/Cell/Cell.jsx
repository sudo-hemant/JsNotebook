import { CodeEditor } from '../CodeEditor';
import { Toolbar } from '../Toolbar';
import './Cell.css';

export function Cell({
  cell,
  cellNumber,
  isSelected,
  canDelete,
  autoFocus,
  onSelect,
  onCodeChange,
  onRun,
  onDelete,
  onAddBelow,
  onGoToPrev,
  onGoToNext
}) {
  const handleClick = () => {
    onSelect(cell.id);
  };

  return (
    <div
      className={`cell ${isSelected ? 'selected' : ''} ${cell.status}`}
      onClick={handleClick}
    >
      <Toolbar
        cellNumber={cellNumber}
        onRun={() => onRun(cell.id)}
        onDelete={() => onDelete(cell.id)}
        onAddBelow={() => onAddBelow(cell.id)}
        isRunning={cell.status === 'running'}
        canDelete={canDelete}
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
  );
}
