import { motion } from 'framer-motion';
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
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div
        className={`mx-auto max-w-7xl ${
          centered ? 'text-center' : ''
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-light-text-primary sm:text-5xl lg:text-6xl dark:text-dark-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
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
        </motion.div>

        {media && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mt-12"
          >
            {media}
          </motion.div>
        )}
      </div>
    </section>
  );
}
