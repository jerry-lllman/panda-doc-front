import { Button } from 'antd';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle = () => {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      onClick={toggleTheme}
      icon={themeMode === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
      aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
    />
  );
}; 