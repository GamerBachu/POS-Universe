import React from "react";
import { useTheme } from "../contexts/theme";

type ThemeToggleIconProps = {
  className?: string;
};

const ThemeToggleIcon: React.FC<ThemeToggleIconProps> = ({ className = "" }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`group relative flex items-center justify-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all duration-300 ease-in-out active:scale-90 ${className}`}
      aria-label="Toggle Theme"
    >
      <div
        className={`transition-all duration-500 ${theme === 'dark' ? 'rotate-0' : 'rotate-[360deg]'} group-hover:text-blue-600 dark:group-hover:text-blue-400 `}>
        {theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </div>
    </button>
  );
};

export default ThemeToggleIcon;
