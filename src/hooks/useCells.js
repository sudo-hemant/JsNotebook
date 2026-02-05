import { useState, useCallback, useEffect, useRef } from 'react';
import { generateId } from '../utils/generateId';
import { saveNotebook, loadNotebook, debounce } from '../utils/storage';

const createCell = (code = '') => ({
  id: generateId(),
  code,
  output: [],
  result: null,
  status: 'idle',
  executionTime: null
});

// Restore saved cell with fresh runtime state
const restoreCell = (savedCell) => ({
  ...createCell(savedCell.code),
  id: savedCell.id
});

export function useCells(initialCode = '') {
  const [cells, setCells] = useState(() => [createCell(initialCode)]);
  const [selectedCellId, setSelectedCellId] = useState(() => cells[0]?.id);
  const [focusCellId, setFocusCellId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Debounced save function (1.5 second delay)
  const debouncedSave = useRef(
    debounce((cellsToSave) => {
      saveNotebook(cellsToSave);
    }, 1500)
  ).current;

  // Load from IndexedDB on mount
  useEffect(() => {
    loadNotebook().then((savedCells) => {
      if (savedCells && savedCells.length > 0) {
        const restoredCells = savedCells.map(restoreCell);
        setCells(restoredCells);
        setSelectedCellId(restoredCells[0].id);
        setFocusCellId(restoredCells[0].id);
      } else {
        // No saved data, focus the default cell
        setFocusCellId(cells[0]?.id);
      }
      setIsLoaded(true);
    });
  }, []);

  // Save to IndexedDB whenever cells change (debounced)
  useEffect(() => {
    if (isLoaded) {
      debouncedSave(cells);
    }
  }, [cells, isLoaded, debouncedSave]);

  const addCell = useCallback((afterId = null, code = '') => {
    const newCell = createCell(code);
    setCells(prev => {
      if (!afterId) {
        return [...prev, newCell];
      }
      const index = prev.findIndex(c => c.id === afterId);
      const newCells = [...prev];
      newCells.splice(index + 1, 0, newCell);
      return newCells;
    });
    setSelectedCellId(newCell.id);
    setFocusCellId(newCell.id);
    return newCell.id;
  }, []);

  const clearFocus = useCallback(() => {
    setFocusCellId(null);
  }, []);

  const focusCell = useCallback((id) => {
    setSelectedCellId(id);
    setFocusCellId(id);
  }, []);

  const goToPrevCell = useCallback(() => {
    setCells(currentCells => {
      const currentIndex = currentCells.findIndex(c => c.id === selectedCellId);
      if (currentIndex > 0) {
        const prevCell = currentCells[currentIndex - 1];
        setSelectedCellId(prevCell.id);
        setFocusCellId(prevCell.id);
      }
      return currentCells;
    });
  }, [selectedCellId]);

  const goToNextCell = useCallback(() => {
    setCells(currentCells => {
      const currentIndex = currentCells.findIndex(c => c.id === selectedCellId);
      if (currentIndex < currentCells.length - 1) {
        const nextCell = currentCells[currentIndex + 1];
        setSelectedCellId(nextCell.id);
        setFocusCellId(nextCell.id);
      }
      return currentCells;
    });
  }, [selectedCellId]);

  const deleteCell = useCallback((id) => {
    setCells(prev => {
      if (prev.length === 1) {
        // Keep at least one cell, just reset it
        const newCell = createCell();
        setSelectedCellId(newCell.id);
        setFocusCellId(newCell.id);
        return [newCell];
      }

      // Find the index of the cell being deleted
      const deleteIndex = prev.findIndex(c => c.id === id);
      const newCells = prev.filter(c => c.id !== id);

      // Focus the previous cell, or the first cell if we deleted the first one
      const focusIndex = deleteIndex > 0 ? deleteIndex - 1 : 0;
      const cellToFocus = newCells[focusIndex];

      if (cellToFocus) {
        setSelectedCellId(cellToFocus.id);
        setFocusCellId(cellToFocus.id);
      }

      return newCells;
    });
  }, []);

  const updateCellCode = useCallback((id, code) => {
    setCells(prev => prev.map(c =>
      c.id === id ? { ...c, code } : c
    ));
  }, []);

  const updateCellExecution = useCallback((id, updates) => {
    setCells(prev => prev.map(c =>
      c.id === id ? { ...c, ...updates } : c
    ));
  }, []);

  const addCellOutput = useCallback((id, outputItem) => {
    setCells(prev => prev.map(c =>
      c.id === id ? { ...c, output: [...c.output, outputItem] } : c
    ));
  }, []);

  const startCellExecution = useCallback((id) => {
    setCells(prev => prev.map(c =>
      c.id === id ? { ...c, output: [], result: null, status: 'running', executionTime: null } : c
    ));
    setSelectedCellId(id);
  }, []);

  const finishCellExecution = useCallback((id, result) => {
    setCells(prev => prev.map(c =>
      c.id === id ? {
        ...c,
        result: result.success ? result.value : result.error,
        status: result.success ? 'success' : 'error',
        executionTime: result.executionTime
      } : c
    ));
  }, []);

  const getSelectedCell = useCallback(() => {
    return cells.find(c => c.id === selectedCellId) || cells[0];
  }, [cells, selectedCellId]);

  return {
    cells,
    selectedCellId,
    setSelectedCellId,
    focusCellId,
    clearFocus,
    focusCell,
    goToPrevCell,
    goToNextCell,
    addCell,
    deleteCell,
    updateCellCode,
    updateCellExecution,
    addCellOutput,
    startCellExecution,
    finishCellExecution,
    getSelectedCell,
    isLoaded
  };
}
