import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-light-card p-2.5 text-light-text-secondary shadow-sm transition-[transform,color,background-color] duration-200 hover:scale-110 hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 dark:bg-dark-card dark:text-dark-text-secondary dark:hover:text-brand-cyan"
    >
      <span className="transition-transform duration-300 group-hover:animate-cat-swipe">
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </span>
    </button>
  );
}
