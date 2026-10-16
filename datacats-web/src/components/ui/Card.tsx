import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={clsx(
        'surface-card',
        hover && 'hover-lift interactive cursor-default',
        className
      )}
    >
      {children}
    </div>
  );
}
