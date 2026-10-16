import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ icon: Icon, title, description, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full">
        <div className="mb-4 inline-flex rounded-xl bg-brand-gold/10 p-3 text-brand-gold transition-transform duration-200 hover:scale-110 dark:bg-brand-cyan/10 dark:text-brand-cyan">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
          {title}
        </h3>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {description}
        </p>
      </Card>
    </motion.div>
  );
}
