import { useCallback, useRef } from 'react';

export function useCodeExecution() {
  const iframeRef = useRef(null);
  const cleanupRef = useRef(null);

  const execute = useCallback((code, onOutput, onResult) => {
    return new Promise((resolve) => {
      // Clean up any existing iframe
      if (cleanupRef.current) {
        cleanupRef.current();
      }

      // Create fresh iframe for isolation
      const iframe = document.createElement('iframe');
      iframe.sandbox = 'allow-scripts';
      iframe.src = '/sandbox.html';
      iframe.style.display = 'none';

      let resolved = false;

      const cleanup = () => {
        if (iframeRef.current === iframe) {
          window.removeEventListener('message', messageHandler);
          iframe.remove();
          iframeRef.current = null;
          cleanupRef.current = null;
        }
      };

      cleanupRef.current = cleanup;

      const messageHandler = (event) => {
        // Only handle messages from our iframe
        if (event.source !== iframe.contentWindow) return;

        const data = event.data;

        if (data.type === 'ready') {
          // Sandbox is ready, send code to execute
          iframe.contentWindow.postMessage({ type: 'execute', code }, '*');
        } else if (data.type === 'console') {
          // Console output
          onOutput({
            method: data.method,
            args: data.args,
            timestamp: Date.now()
          });
        } else if (data.type === 'error') {
          // Runtime error (not caught by try/catch)
          onOutput({
            method: 'error',
            args: [{ type: 'error', message: data.message, stack: data.stack }],
            timestamp: Date.now()
          });
        } else if (data.type === 'result') {
          // Execution complete
          if (!resolved) {
            resolved = true;
            cleanup();

            onResult({
              success: data.success,
              value: data.value,
              error: data.error,
              executionTime: data.executionTime
            });

            resolve(data);
          }
        }
      };

      window.addEventListener('message', messageHandler);
      document.body.appendChild(iframe);
      iframeRef.current = iframe;

      // Timeout after 30 seconds
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();

          const result = {
            success: false,
            error: { message: 'Execution timeout (30s)', name: 'TimeoutError' },
            executionTime: 30000
          };

          onResult(result);
          resolve(result);
        }
      }, 30000);

      // Update cleanup to also clear timeout
      const originalCleanup = cleanup;
      cleanupRef.current = () => {
        clearTimeout(timeoutId);
        originalCleanup();
      };
    });
  }, []);

  return { execute };
}
