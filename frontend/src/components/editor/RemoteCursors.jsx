import { useEffect, useRef } from 'react';

const getUserColor = (userId) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8B739', '#52C4B0', '#FF6F61', '#6B5B95', '#88B04B',
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const RemoteCursors = ({ editor, monaco, remoteCursors }) => {
  const allDecorationIds = useRef([]);
  const cleanupRef = useRef(() => {});

  useEffect(() => {
    if (!editor || !monaco) return;

    cleanupRef.current();
    allDecorationIds.current = [];

    const styleIds = [];

    Object.entries(remoteCursors).forEach(([userId, cursorData]) => {
      if (!cursorData.position) return;

      const color = cursorData.color || getUserColor(userId);
      const name = cursorData.name || 'Anonymous';
      const { lineNumber, column } = cursorData.position;

      const decorations = [];

      // Cursor decoration — colored 2px line at cursor position
      decorations.push({
        range: new monaco.Range(lineNumber, column, lineNumber, column),
        options: {
          className: `remote-cursor-${userId}`,
          zIndex: 30,
          overviewRuler: {
            color,
            position: monaco.editor.OverviewRulerLane.Full,
          },
        },
      });

      // Full-line highlight on the cursor's line
      decorations.push({
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: `remote-line-highlight-${userId}`,
          zIndex: 10,
          overviewRuler: {
            color: `${color}80`,
            position: monaco.editor.OverviewRulerLane.Right,
          },
        },
      });

      // Glyph margin dot — shows who is on which line
      decorations.push({
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          glyphMarginClassName: `remote-glyph-${userId}`,
          glyphMarginHoverMessage: { value: name },
          zIndex: 20,
        },
      });

      // Selection decoration
      if (
        cursorData.selection &&
        (cursorData.selection.startLineNumber !== lineNumber ||
          cursorData.selection.startColumn !== column)
      ) {
        decorations.push({
          range: new monaco.Range(
            cursorData.selection.startLineNumber,
            cursorData.selection.startColumn,
            cursorData.selection.endLineNumber,
            cursorData.selection.endColumn
          ),
          options: {
            className: `remote-selection-${userId}`,
            zIndex: 5,
          },
        });
      }

      const decorationIds = editor.deltaDecorations([], decorations);
      allDecorationIds.current = [...allDecorationIds.current, ...decorationIds];

      // Inject CSS
      const styleId = `cc-cursor-${userId}`;
      styleIds.push(styleId);

      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }

      style.textContent = `
        .remote-cursor-${userId} {
          background-color: ${color} !important;
          width: 2px !important;
        }
        .remote-cursor-${userId}::after {
          content: '${name.replace(/'/g, "\\'")}';
          position: absolute;
          top: -18px;
          left: 0;
          background: ${color};
          color: #fff;
          font-size: 11px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 3px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 1000;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          letter-spacing: 0.2px;
        }
        .remote-line-highlight-${userId} {
          background-color: ${color}18 !important;
        }
        .remote-glyph-${userId} {
          background: ${color};
          width: 10px !important;
          height: 10px !important;
          margin-left: 5px;
          margin-top: 6px;
          border-radius: 50%;
          border: 2px solid ${color};
          box-shadow: 0 0 4px ${color}80;
        }
        .remote-selection-${userId} {
          background-color: ${color}33 !important;
          border: 1px solid ${color}55;
        }
      `;
    });

    cleanupRef.current = () => {
      if (editor) {
        editor.deltaDecorations(allDecorationIds.current, []);
      }
      styleIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };

    return () => {
      cleanupRef.current();
    };
  }, [editor, monaco, remoteCursors]);

  return null;
};

export default RemoteCursors;
