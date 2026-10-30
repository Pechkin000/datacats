import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  to,
  onClick,
  children,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-full transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-bounce interactive touch-manipulation focus:outline-none focus:ring-2 focus:ring-brand-gold/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'min-h-[44px] px-4 py-2.5 text-sm',
    md: 'min-h-[48px] px-6 py-3 text-base',
    lg: 'min-h-[48px] px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary:
      'bg-brand-gold text-slate-900 hover:bg-brand-amber hover:shadow-lg hover:shadow-brand-gold/25',
    secondary:
      'bg-light-card text-light-text-primary shadow-sm hover:shadow-md dark:bg-dark-card dark:text-dark-text-primary',
    outline:
      'border-2 border-light-text-secondary text-light-text-primary hover:border-brand-gold hover:text-brand-gold dark:border-dark-text-secondary dark:text-dark-text-primary dark:hover:border-brand-cyan dark:hover:text-brand-cyan',
    ghost:
      'text-light-text-secondary hover:text-light-text-primary hover:bg-light-card/50 dark:text-dark-text-secondary dark:hover:text-dark-text-primary dark:hover:bg-dark-card/50',
  };

  const classes = clsx(baseStyles, sizeStyles[size], variantStyles[variant], className);

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
