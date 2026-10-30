import { clsx } from 'clsx';

export type BadgeVariant = 'default' | 'gold' | 'cyan' | 'green' | 'slate';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
}

export function Badge({ children, className = '', variant = 'default' }: BadgeProps) {
  const variants = {
    default:
      'bg-light-card text-light-text-secondary dark:bg-dark-card dark:text-dark-text-secondary',
    gold: 'bg-brand-gold/10 text-brand-gold',
    cyan: 'bg-brand-cyan/10 text-brand-cyan',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-transform duration-200 hover:scale-105',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
