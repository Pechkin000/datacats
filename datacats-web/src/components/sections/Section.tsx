import { clsx } from 'clsx';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  muted?: boolean;
}

export function Section({ children, className = '', id, muted = false }: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        'px-4 py-16 sm:px-6 lg:px-8',
        muted && 'bg-slate-50 dark:bg-slate-900/50',
        className
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
