# JS Notebook

A web-based JavaScript notebook inspired by Jupyter, allowing you to write and execute JavaScript code in isolated cells with real-time output.

## Features

- **Isolated Cell Execution** - Each cell runs in a sandboxed iframe with its own context. Variables from one cell don't leak into another.
- **Real-time Output** - See console output (log, error, warn, info) and return values instantly.
- **Auto-save** - Your code is automatically saved to browser storage (IndexedDB). No work is lost on refresh.
- **Resizable Panels** - Drag the divider to adjust notebook and output panel widths.
- **Keyboard-first Workflow** - Full keyboard shortcut support for efficient coding.

## Keyboard Shortcuts

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Run cell | `Cmd+Enter` | `Ctrl+Enter` |
| Run cell (alt) | `Shift+Enter` | `Shift+Enter` |
| New cell below | `Cmd+B` | `Ctrl+B` |
| Delete cell | `Cmd+Shift+Backspace` | `Ctrl+Shift+Backspace` |
| Navigate to previous cell | `Cmd+↑` | `Ctrl+↑` |
| Navigate to next cell | `Cmd+↓` | `Ctrl+↓` |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd js-notebook

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CodeMirror 6** - Code editor with JavaScript syntax highlighting
- **IndexedDB** - Persistent storage for notebooks

## How It Works

### Sandboxed Execution

Each cell executes in a fresh `<iframe sandbox="allow-scripts">` element. This provides:

- Complete isolation between cells
- Safe execution environment
- No access to parent page DOM or cookies

### Console Capture

The sandbox overrides `console.log`, `console.error`, `console.warn`, and `console.info` to capture output via `postMessage` and display it in the output panel.

### Storage

Notebooks are automatically saved to IndexedDB with a 1.5-second debounce. Only cell IDs and code are persisted—outputs are not saved.

## Project Structure

```
js-notebook/
├── public/
│   └── sandbox.html          # Sandboxed iframe for code execution
├── src/
│   ├── components/
│   │   ├── Cell/             # Individual code cell
│   │   ├── CodeEditor/       # CodeMirror wrapper
│   │   ├── Notebook/         # Cell list container
│   │   ├── OutputPanel/      # Console & return value display
│   │   └── Toolbar/          # Cell action buttons
│   ├── hooks/
│   │   ├── useCells.js       # Cell state management
│   │   └── useCodeExecution.js # Sandbox communication
│   ├── utils/
│   │   ├── storage.js        # IndexedDB operations
│   │   ├── generateId.js     # Unique ID generator
│   │   └── formatOutput.js   # Output formatting
│   ├── App.jsx               # Main app layout
│   └── main.jsx              # Entry point
├── index.html
├── package.json
└── vite.config.js
```
