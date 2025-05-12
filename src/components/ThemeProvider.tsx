import { useState, useEffect, createContext, useContext } from 'react';
import { ConfigProvider, theme } from 'antd';
import type { ThemeConfig } from 'antd';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

const lightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // colorPrimary: '#337ea9',
  },
};

const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    // colorPrimary: '#379ad3',
  },
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme-mode');
    return (savedTheme as ThemeMode) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    // Update the document element class for global CSS variables
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ConfigProvider
        theme={themeMode === 'light' ? lightTheme : darkTheme}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}; 