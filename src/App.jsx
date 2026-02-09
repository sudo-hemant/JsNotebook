import { useCallback, useState, useRef, useEffect } from 'react';
import { Notebook } from './components/Notebook';
import { OutputPanel } from './components/OutputPanel';
import { useCells } from './hooks/useCells';
import { useCodeExecution } from './hooks/useCodeExecution';
import { useTheme } from './hooks/useTheme';

const DEFAULT_CODE = `// Welcome to JS Notebook!
// Cmd+Enter: Run | Cmd+B: New cell | Cmd+↑↓: Navigate

console.log("Hello, World!");

// Each cell runs in complete isolation
const message = "Variables are scoped to this cell";
console.log(message);

// Return a value to see it in the output
42`;

const MIN_OUTPUT_WIDTH = 300;
const MAX_OUTPUT_WIDTH = 800;
const DEFAULT_OUTPUT_WIDTH = 500;

function App() {
  const [outputWidth, setOutputWidth] = useState(DEFAULT_OUTPUT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const appRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  const {
    cells,
    selectedCellId,
    setSelectedCellId,
    focusCellId,
    clearFocus,
    goToPrevCell,
    goToNextCell,
    addCell,
    deleteCell,
    updateCellCode,
    moveCell,
    addCellOutput,
    startCellExecution,
    finishCellExecution,
    getSelectedCell
  } = useCells(DEFAULT_CODE);

  const { execute } = useCodeExecution();

  const handleRunCell = useCallback(async (cellId) => {
    const cell = cells.find(c => c.id === cellId);
    if (!cell || cell.status === 'running') return;

    startCellExecution(cellId);

    await execute(
      cell.code,
      (output) => addCellOutput(cellId, output),
      (result) => finishCellExecution(cellId, result)
    );
  }, [cells, execute, startCellExecution, addCellOutput, finishCellExecution]);

  const selectedCell = getSelectedCell();

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !appRef.current) return;

      const appRect = appRef.current.getBoundingClientRect();
      const newWidth = appRect.right - e.clientX;

      if (newWidth >= MIN_OUTPUT_WIDTH && newWidth <= MAX_OUTPUT_WIDTH) {
        setOutputWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div className="app" ref={appRef} style={{ gridTemplateColumns: `1fr 4px ${outputWidth}px` }}>
      <div className="notebook-panel">
        <Notebook
          cells={cells}
          selectedCellId={selectedCellId}
          focusCellId={focusCellId}
          onSelectCell={setSelectedCellId}
          onCodeChange={updateCellCode}
          onRunCell={handleRunCell}
          onDeleteCell={deleteCell}
          onAddCell={addCell}
          onClearFocus={clearFocus}
          onGoToPrev={goToPrevCell}
          onGoToNext={goToNextCell}
          onMoveCell={moveCell}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>
      <div className="resizer" onMouseDown={handleMouseDown} />
      <div className="output-panel-container">
        <OutputPanel cell={selectedCell} />
      </div>
    </div>
  );
}

export default App;
