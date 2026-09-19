import { createContext, useLayoutEffect, useMemo, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

const STORAGE_KEY = 'theme-preference';

const getInitialTheme = () => {
  if (typeof document !== 'undefined') {
    if (document.documentElement.classList.contains('theme-dark')) return 'dark';
    if (document.documentElement.classList.contains('theme-light')) return 'light';
  }

  const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (saved === 'light' || saved === 'dark') return saved;

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  return 'light';
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.remove('theme-dark', 'theme-light');
  root.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
  root.style.colorScheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
};

function ThemeProviderImpl({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(() => {
    return {
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function ThemeProvider(props) {
  // keep named export for imports, while returning a component-only file for fast-refresh.
  return <ThemeProviderImpl {...props} />;
}


