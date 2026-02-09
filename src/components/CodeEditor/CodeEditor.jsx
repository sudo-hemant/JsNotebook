import { useRef, useEffect, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import './CodeEditor.css';

export function CodeEditor({ value, onChange, onRun, onAddCell, onDelete, onGoToPrev, onGoToNext, autoFocus, editorRef, theme }) {
  const viewRef = useRef(null);

  // Create keymap extension with high precedence to override default behavior
  const runKeymap = useMemo(() => {
    return Prec.highest(
      keymap.of([
        {
          key: 'Shift-Enter',
          run: () => {
            onRun?.();
            return true; // Prevents default (new line)
          },
        },
        {
          key: 'Mod-Enter', // Cmd on Mac, Ctrl on Windows
          run: () => {
            onRun?.();
            return true;
          },
        },
        {
          key: 'Mod-b', // Cmd+B for new cell
          run: () => {
            onAddCell?.();
            return true;
          },
        },
        {
          key: 'Mod-Shift-Backspace', // Cmd+Shift+Backspace to delete cell
          run: () => {
            onDelete?.();
            return true;
          },
        },
        {
          key: 'Mod-ArrowUp', // Cmd+Up for previous cell
          run: () => {
            onGoToPrev?.();
            return true;
          },
        },
        {
          key: 'Mod-ArrowDown', // Cmd+Down for next cell
          run: () => {
            onGoToNext?.();
            return true;
          },
        },
      ])
    );
  }, [onRun, onAddCell, onDelete, onGoToPrev, onGoToNext]);

  // Handle auto-focus
  useEffect(() => {
    if (autoFocus && viewRef.current) {
      viewRef.current.focus();
    }
  }, [autoFocus]);

  // Expose view ref to parent
  useEffect(() => {
    if (editorRef) {
      editorRef.current = viewRef.current;
    }
  }, [editorRef]);

  return (
    <div className="code-editor">
      <CodeMirror
        value={value}
        height="auto"
        minHeight="60px"
        extensions={[javascript(), runKeymap]}
        onChange={onChange}
        theme={theme === 'dark' ? 'dark' : 'light'}
        onCreateEditor={(view) => {
          viewRef.current = view;
          if (autoFocus) {
            view.focus();
          }
        }}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: false,
          highlightSelectionMatches: true,
        }}
      />
    </div>
  );
}
