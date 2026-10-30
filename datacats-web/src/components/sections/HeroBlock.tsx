import { Button } from '../ui/Button';

interface HeroBlockProps {
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; to?: string; href?: string };
  secondaryCta?: { label: string; to?: string; href?: string };
  media?: React.ReactNode;
  centered?: boolean;
}

export function HeroBlock({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  media,
  centered = false,
}: HeroBlockProps) {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div
        className={`mx-auto max-w-7xl ${
          centered ? 'text-center' : ''
        }`}
      >
        <div className="animate-fade-up">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-light-text-primary sm:text-5xl lg:text-6xl dark:text-dark-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-base text-light-text-secondary sm:text-lg dark:text-dark-text-secondary">
              {subtitle}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {primaryCta && (
                <Button variant="primary" size="lg" to={primaryCta.to} href={primaryCta.href}>
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button variant="outline" size="lg" to={secondaryCta.to} href={secondaryCta.href}>
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </div>

        {media && (
          <div className="mt-12 animate-fade-up">
            {media}
          </div>
        )}
      </div>
    </section>
  );
}
