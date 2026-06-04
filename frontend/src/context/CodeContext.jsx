import { createContext, useState, useCallback } from 'react';

export const CodeContext = createContext(null);

const LANG_MAP = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  go: 'go',
};

export const MONACO_THEMES = {
  'vs-dark': 'VS Dark',
  'hc-black': 'High Contrast',
  'vs': 'Light',
};

export const CodeProvider = ({ children }) => {
  const [code, setCode] = useState('// Start coding...\n');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');

  const monacoLanguage = LANG_MAP[language] || 'javascript';

  return (
    <CodeContext.Provider
      value={{
        code,
        setCode,
        language,
        setLanguage,
        monacoLanguage,
        theme,
        setTheme,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};
