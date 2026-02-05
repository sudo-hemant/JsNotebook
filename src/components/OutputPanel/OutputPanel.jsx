import { formatConsoleArgs, formatValue } from '../../utils/formatOutput';
import './OutputPanel.css';

export function OutputPanel({ cell }) {
  if (!cell) {
    return (
      <div className="output-panel">
        <div className="output-panel-header">
          <h2>Output</h2>
        </div>
        <div className="output-empty">
          Select a cell to see its output
        </div>
      </div>
    );
  }

  const hasOutput = cell.output.length > 0 || cell.result !== null;

  return (
    <div className="output-panel">
      <div className="output-panel-header">
        <h2>Output</h2>
        {cell.executionTime !== null && (
          <span className="execution-time">{cell.executionTime}ms</span>
        )}
      </div>

      {!hasOutput && cell.status === 'idle' && (
        <div className="output-empty">
          Run the cell to see output
        </div>
      )}

      {cell.status === 'running' && (
        <div className="output-running">
          Running...
        </div>
      )}

      {cell.output.length > 0 && (
        <div className="console-output">
          <h3>Console</h3>
          {cell.output.map((item, index) => (
            <div key={index} className={`console-line ${item.method}`}>
              <span className="console-prefix">{getPrefix(item.method)}</span>
              <span className="console-content">{formatConsoleArgs(item.args)}</span>
            </div>
          ))}
        </div>
      )}

      {cell.result !== null && cell.status !== 'running' && (
        <div className="return-value">
          <h3>{cell.status === 'error' ? 'Error' : 'Return Value'}</h3>
          <div className={`result-content ${cell.status}`}>
            {cell.status === 'error' ? (
              <>
                <div className="error-message">{cell.result.message}</div>
                {cell.result.stack && (
                  <pre className="error-stack">{cell.result.stack}</pre>
                )}
              </>
            ) : (
              <pre>{formatValue(cell.result)}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getPrefix(method) {
  switch (method) {
    case 'error': return '✕';
    case 'warn': return '⚠';
    case 'info': return 'ℹ';
    default: return '›';
  }
}
