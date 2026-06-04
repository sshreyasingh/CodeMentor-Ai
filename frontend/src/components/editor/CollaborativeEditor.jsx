import { useContext, useRef, useCallback, useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, IconButton, Tooltip, Button,
  CircularProgress, Chip, Avatar, AvatarGroup, TextField,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import EditIcon from '@mui/icons-material/Edit';
import Editor from '@monaco-editor/react';
import { CodeContext, MONACO_THEMES } from '../../context/CodeContext';
import api from '../../api/axios';
import OutputPanel from './OutputPanel';
import RemoteCursors from './RemoteCursors';
import EditorStatusBar from './EditorStatusBar';

const disableMonacoDiagnostics = (monaco) => {
  const diagOpts = { noSemanticValidation: true, noSyntaxValidation: true, noSuggestionDiagnostics: true };
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(diagOpts);
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(diagOpts);

  monaco.languages.setLanguageConfiguration('javascript', {
    comments: { lineComment: '//', blockComment: ['/*', '*/'] },
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    autoClosingPairs: [
      { open: '{', close: '}' }, { open: '[', close: ']' }, { open: '(', close: ')' },
      { open: '"', close: '"' }, { open: "'", close: "'" }, { open: '`', close: '`' },
    ],
  });
  monaco.languages.setLanguageConfiguration('python', {
    comments: { lineComment: '#' },
    brackets: [['[', ']'], ['(', ')']],
    autoClosingPairs: [
      { open: '{', close: '}' }, { open: '[', close: ']' }, { open: '(', close: ')' },
      { open: '"', close: '"' }, { open: "'", close: "'" },
    ],
  });
  monaco.languages.setLanguageConfiguration('java', {
    comments: { lineComment: '//', blockComment: ['/*', '*/'] },
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    autoClosingPairs: [
      { open: '{', close: '}' }, { open: '[', close: ']' }, { open: '(', close: ')' },
      { open: '"', close: '"' }, { open: "'", close: "'" },
    ],
  });
  monaco.languages.setLanguageConfiguration('cpp', {
    comments: { lineComment: '//', blockComment: ['/*', '*/'] },
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    autoClosingPairs: [
      { open: '{', close: '}' }, { open: '[', close: ']' }, { open: '(', close: ')' },
      { open: '"', close: '"' }, { open: "'", close: "'" },
    ],
  });
  monaco.languages.setLanguageConfiguration('go', {
    comments: { lineComment: '//', blockComment: ['/*', '*/'] },
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    autoClosingPairs: [
      { open: '{', close: '}' }, { open: '[', close: ']' }, { open: '(', close: ')' },
      { open: '"', close: '"' }, { open: "'", close: "'" }, { open: '`', close: '`' },
    ],
  });
};

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
];

const CollaborativeEditor = ({
  roomId,
  onReview,
  reviewLoading,
  emitCodeChange,
  emitLanguageChange,
  emitCursorMove,
  emitCursorSelection,
  lastEditor,
  participants,
  myColor,
  remoteCursors,
}) => {
  const { code, setCode, language, setLanguage, monacoLanguage, theme, setTheme } =
    useContext(CodeContext);
  const emitTimerRef = useRef(null);
  const isTypingRef = useRef(false);
  const [editor, setEditor] = useState(null);
  const [monaco, setMonaco] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localEditorName, setLocalEditorName] = useState(null);
  const [stdin, setStdin] = useState('');
  const stdinRef = useRef('');
  const codeRef = useRef(code);
  const cursorThrottleRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [editorSelection, setEditorSelection] = useState(null);
  const [zoom, setZoom] = useState(0);

  useEffect(() => { codeRef.current = code; }, [code]);

  // Keyboard shortcuts handler
  const handleEditorDidMount = useCallback((editorInstance, monacoInstance) => {
    setEditor(editorInstance);
    setMonaco(monacoInstance);

    // Track cursor position for status bar
    editorInstance.onDidChangeCursorPosition((e) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });

      if (cursorThrottleRef.current) clearTimeout(cursorThrottleRef.current);
      cursorThrottleRef.current = setTimeout(() => {
        emitCursorMove?.({ lineNumber: e.position.lineNumber, column: e.position.column }, null);
      }, 50);
    });

    editorInstance.onDidChangeCursorSelection((e) => {
      setEditorSelection(e.selection);
      if (cursorThrottleRef.current) clearTimeout(cursorThrottleRef.current);
      cursorThrottleRef.current = setTimeout(() => {
        emitCursorMove?.(
          { lineNumber: e.position.lineNumber, column: e.position.column },
          {
            startLineNumber: e.selection.startLineNumber,
            startColumn: e.selection.startColumn,
            endLineNumber: e.selection.endLineNumber,
            endColumn: e.selection.endColumn,
          }
        );
      }, 50);
    });

    // Ctrl+Shift+P => Command Palette (native Monaco)
    // F1 => Command Palette
    // Ctrl+F => Find
    // Ctrl+H => Find & Replace
    // Ctrl+G => Go To Line
    // Ctrl+/ => Toggle Comment
    // Alt+Shift+F => Format Document
    // Ctrl+Space => Trigger Suggestions
    // Ctrl+Shift+Space => Trigger Parameter Hints
    // Ctrl+P => Quick Open (we can map to something)
    // Alt+Click => Multi-cursor
    // Ctrl+Alt+Down/Up => Column selection

    // Format document binding
    editorInstance.addAction({
      id: 'format-document',
      label: 'Format Document',
      keybindings: [monacoInstance.KeyMod.Shift | monacoInstance.KeyMod.Alt | monacoInstance.KeyCode.KeyF],
      run: (ed) => {
        ed.getAction('editor.action.formatDocument')?.run();
      },
    });

    // Zoom in/out
    editorInstance.addAction({
      id: 'zoom-in',
      label: 'Zoom In',
      keybindings: [monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Equal],
      run: () => setZoom((z) => Math.min(z + 1, 5)),
    });
    editorInstance.addAction({
      id: 'zoom-out',
      label: 'Zoom Out',
      keybindings: [monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Minus],
      run: () => setZoom((z) => Math.max(z - 1, -5)),
    });
  }, [emitCursorMove]);

  useEffect(() => {
    return () => {
      if (emitTimerRef.current) clearTimeout(emitTimerRef.current);
      if (cursorThrottleRef.current) clearTimeout(cursorThrottleRef.current);
    };
  }, []);

  const handleEditorChange = useCallback(
    (value) => {
      if (value === code) return;
      setCode(value);
      isTypingRef.current = true;
      setSaving(true);
      setLocalEditorName('You');
      if (emitTimerRef.current) clearTimeout(emitTimerRef.current);
      emitTimerRef.current = setTimeout(() => {
        emitCodeChange?.(value);
        isTypingRef.current = false;
        setTimeout(() => setSaving(false), 300);
      }, 300);
    },
    [code, setCode, emitCodeChange]
  );

  const cycleTheme = () => {
    const keys = Object.keys(MONACO_THEMES);
    const idx = keys.indexOf(theme);
    setTheme(keys[(idx + 1) % keys.length]);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    emitLanguageChange?.(newLang);
  };

  const handleRunCode = async () => {
    const currentCode = codeRef.current;
    const currentStdin = stdinRef.current;
    if (!currentCode.trim()) {
      setError('Please write some code to run');
      setShowOutput(true);
      return;
    }
    setRunning(true);
    setOutput('');
    setError('');
    setShowOutput(true);
    try {
      const { data } = await api.post('/execute', { code: currentCode, language, stdin: currentStdin });
      if (data.error) setError(data.error);
      else setOutput(data.output || 'Code executed successfully (no output)');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to execute code');
    } finally {
      setRunning(false);
    }
  };

  const displayEditor = lastEditor || localEditorName;
  const selectionCount = editorSelection
    ? Math.abs(editorSelection.endLineNumber - editorSelection.startLineNumber) ||
      Math.abs(editorSelection.endColumn - editorSelection.startColumn) ||
      0
    : 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 1,
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.5,
          py: 0.1,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          bgcolor: '#111827',
          minHeight: 36,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeIcon sx={{ color: 'primary.main', fontSize: 16 }} />
          <Typography variant="caption" fontWeight={600} sx={{ color: '#94a3b8', fontSize: 11 }}>
            Editor
          </Typography>
          {saving && (
            <Chip icon={<CloudSyncIcon sx={{ fontSize: 12 }} />} label="Saving..." size="small"
              color="primary" variant="outlined" sx={{ height: 18, fontSize: 9 }} />
          )}
          {displayEditor && !saving && (
            <Chip icon={<EditIcon sx={{ fontSize: 12 }} />}
              label={`Edited by ${displayEditor}`} size="small"
              color="success" variant="outlined" sx={{ height: 18, fontSize: 9 }} />
          )}
          {participants && participants.length > 0 && (
            <AvatarGroup max={3} sx={{
              ml: 1, '& .MuiAvatar-root': { width: 22, height: 22, fontSize: 10, border: '2px solid #111827' }
            }}>
              {participants.map((p) => (
                <Tooltip key={p.userId} title={p.name}>
                  <Avatar alt={p.name} src={p.avatar}
                    sx={{ bgcolor: p.color || '#1976d2', fontSize: 10 }}>
                    {p.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <TextField size="small" placeholder="stdin..."
            value={stdin}
            onChange={(e) => { setStdin(e.target.value); stdinRef.current = e.target.value; }}
            variant="outlined"
            slotProps={{ htmlInput: { autoComplete: 'off', spellCheck: 'false' } }}
            sx={{
              width: 110,
              '& .MuiOutlinedInput-root': {
                height: 26, fontSize: 11, fontFamily: '"JetBrains Mono", monospace',
                bgcolor: 'rgba(255,255,255,0.03)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
              },
              '& .MuiOutlinedInput-input': { py: 0.3, '&::placeholder': { color: '#475569', fontSize: 10 } },
            }}
          />
          <Button variant="contained" size="small" color="success"
            startIcon={running ? <CircularProgress size={12} /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
            onClick={handleRunCode} disabled={running}
            sx={{ fontSize: 10, py: 0.1, px: 1, minWidth: 0, height: 26 }}>
            {running ? 'Running' : 'Run'}
          </Button>
          <Button variant="outlined" size="small" color="secondary"
            startIcon={reviewLoading ? <CircularProgress size={12} /> : <RateReviewIcon sx={{ fontSize: 16 }} />}
            onClick={onReview} disabled={reviewLoading}
            sx={{ fontSize: 10, py: 0.1, px: 1, minWidth: 0, height: 26 }}>
            Review
          </Button>
          <Select value={language} onChange={handleLanguageChange} size="small"
            sx={{
              color: '#94a3b8', fontSize: 11, height: 26,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
              '& .MuiSelect-select': { py: 0.3 },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(99,102,241,0.5)' },
              minWidth: 100,
            }}>
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang.value} value={lang.value} sx={{ fontSize: 11 }}>{lang.label}</MenuItem>
            ))}
          </Select>
          <Tooltip title={`Theme: ${MONACO_THEMES[theme]}`}>
            <IconButton size="small" onClick={cycleTheme}
              sx={{ color: '#94a3b8', p: 0.5, '&:hover': { color: '#e2e8f0' } }}>
              <Brightness4Icon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Editor body */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
        <Box sx={{ flex: showOutput ? '0 0 55%' : 1, minHeight: 0, overflow: 'hidden' }}>
          <Editor
            language={monacoLanguage}
            theme={theme}
            value={code}
            onChange={handleEditorChange}
            beforeMount={disableMonacoDiagnostics}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14 + zoom,
              fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", monospace',
              fontLigatures: true,
              minimap: { enabled: true, scale: 1, showSlider: 'mouseover', maxColumn: 80 },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              lineNumbersMinChars: 4,
              glyphMargin: true,
              folding: true,
              foldingStrategy: 'indentation',
              renderLineHighlight: 'all',
              bracketPairColorization: { enabled: true },
              matchBrackets: 'always',
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              autoSurround: 'languageDefined',
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              detectIndentation: true,
              wordWrap: 'off',
              padding: { top: 8, bottom: 8 },
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              cursorStyle: 'line',
              cursorWidth: 2,
              multiCursorModifier: 'alt',
              suggest: { showWords: true, showSnippets: true, showClasses: true, showFunctions: true },
              snippetSuggestions: 'top',
              quickSuggestions: true,
              parameterHints: { enabled: true },
              hover: { enabled: true },
              links: true,
              contextmenu: true,
              find: { addExtraSpaceOnTop: false, autoFindInSelection: 'never', seedSearchStringFromSelection: 'always' },
              selectionHighlight: true,
              occurrencesHighlight: 'singleFile',
              wordBasedSuggestions: 'currentDocument',
              guides: { indentation: true, bracketPairs: true, bracketPairsHorizontal: 'active' },
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
              overviewRulerLanes: 0,
              renderWhitespace: 'selection',
              renderControlCharacters: true,
              colorDecorators: true,
              dragAndDrop: true,
              emptySelectionClipboard: true,
            }}
          />
          <RemoteCursors editor={editor} monaco={monaco} remoteCursors={remoteCursors} />
        </Box>

        {showOutput && (
          <OutputPanel output={output} error={error} onClose={() => setShowOutput(false)} />
        )}
      </Box>

      {/* VS Code-style Status Bar */}
      <EditorStatusBar
        cursorPos={cursorPos}
        language={language}
        selectionCount={selectionCount}
        zoom={zoom}
        theme={theme}
      />
    </Box>
  );
};

export default CollaborativeEditor;
