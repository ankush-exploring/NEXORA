'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 text-gray-500 dark:text-gray-400 rounded-full w-9 h-9 flex items-center justify-center opacity-0">
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 text-gray-500 dark:text-gray-400 hover:text-nexora-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-card transition-colors flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
