import { useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface LogoProps {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export function Logo({ variant = 'full', className = '' }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const src = useMemo(() => {
    // Source asset folder has a typo: "darke-theme" holds the light-on-dark variants
    const themeDir = isDark ? 'darke-theme' : 'light-theme';
    const suffix = isDark ? '-light' : '';
    switch (variant) {
      case 'icon':
        return `/assets/img/${themeDir}/logo-cat${suffix}.svg`;
      case 'text':
        return `/assets/img/${themeDir}/logo-text${suffix}.svg`;
      case 'full':
      default:
        return `/assets/img/${themeDir}/logo-text-cat${suffix}.svg`;
    }
  }, [isDark, variant]);

  return <img src={src} alt="DataCats Business Intelligence" className={className} />;
}
