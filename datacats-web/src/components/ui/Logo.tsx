import { useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface LogoProps {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
  alt?: string;
}

export function Logo({
  variant = 'full',
  className = '',
  alt = 'DataCats Business Intelligence',
}: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { src, width, height } = useMemo(() => {
    // Source asset folder has a typo: "darke-theme" holds the light-on-dark variants
    const themeDir = isDark ? 'darke-theme' : 'light-theme';
    const suffix = isDark ? '-light' : '';
    switch (variant) {
      case 'icon':
        return {
          src: `/assets/img/${themeDir}/logo-cat${suffix}.svg`,
          width: 37,
          height: 40,
        };
      case 'text':
        // Text logo is intentionally inverted: light-version file in dark theme, dark-version file in light theme
        return {
          src: isDark
            ? '/assets/img/light-theme/logo-text-light.svg'
            : '/assets/img/darke-theme/logo-text-dark.svg',
          width: 120,
          height: 32,
        };
      case 'full':
      default:
        return {
          src: `/assets/img/${themeDir}/logo-text-cat${suffix}.svg`,
          width: 149,
          height: 160,
        };
    }
  }, [isDark, variant]);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      className={className}
    />
  );
}
