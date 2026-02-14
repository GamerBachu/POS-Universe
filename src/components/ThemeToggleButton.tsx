import { useTheme } from '../contexts/theme';

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
    >
      Toggle Theme
    </button>
  );
}
