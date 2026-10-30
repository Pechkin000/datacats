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
          width: 1418,
          height: 1526,
        };
      case 'text':
        // Text logo is intentionally inverted: light-version file in dark theme, dark-version file in light theme
        return {
          src: isDark
            ? '/assets/img/light-theme/logo-text-light.svg'
            : '/assets/img/darke-theme/logo-text-dark.svg',
          width: isDark ? 722 : 705,
          height: isDark ? 193 : 189,
        };
      case 'full':
      default:
        return {
          src: `/assets/img/${themeDir}/logo-text-cat${suffix}.svg`,
          width: 1418,
          height: 1526,
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
