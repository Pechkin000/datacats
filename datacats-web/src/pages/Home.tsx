import { TrendingUp, Users, Truck, Clock } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { HeroBlock } from '../components/sections/HeroBlock';
import { FeatureCard } from '../components/sections/FeatureCard';
import { Section } from '../components/sections/Section';
import { Button } from '../components/ui/Button';

const features = [
  {
    icon: TrendingUp,
    title: 'Sales Patterns & Revenue Streams',
    description: 'Uncover peak purchasing times, product affinity, and seasonal trends.',
  },
  {
    icon: Users,
    title: 'Patient & Client Records',
    description: 'Track care pathways, service milestones, and demographic breakdowns safely.',
  },
  {
    icon: Truck,
    title: 'Order Trends & Logistics',
    description: 'Optimize inventory turns and supply chain timing.',
  },
  {
    icon: Clock,
    title: 'Employee Time Utilization',
    description: 'Identify capacity bottlenecks, billable hours, and scheduling efficiency.',
  },
];

export function Home() {
  const { theme } = useTheme();
  const heroGif =
    theme === 'dark'
      ? '/assets/img/darke-theme/ba-rest-us-med-light.gif'
      : '/assets/img/ba-rest-us-med.gif';

  return (
    <>
      <HeroBlock
        title="Business Analytics for the rest of us."
        subtitle="Transform mountains of accounting, sales, and operations data into one clear, actionable dashboard."
        primaryCta={{ label: 'Explore Dashboard Demos', to: '/presentation' }}
        secondaryCta={{ label: 'Get in Touch', to: '/contact' }}
        media={
          <img
            src={heroGif}
            alt="DataCats brand animation"
            className="mx-auto h-auto max-h-64 w-auto rounded-2xl shadow-2xl animate-float"
          />
        }
        centered
      />

      <Section muted>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            The Problem
          </h2>
          <p className="mt-4 text-lg text-light-text-secondary dark:text-dark-text-secondary">
            You generate mountain ranges of data every day across accounting, sales, and operations—yet gain zero actionable clarity.
          </p>
        </div>
      </Section>

      <Section>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            The DataCats Solution
          </h2>
          <p className="mt-4 text-lg text-light-text-secondary dark:text-dark-text-secondary">
            Four lenses that turn raw data into decisions.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Your data sources, unified.
            </h2>
            <p className="mt-4 text-lg text-light-text-secondary dark:text-dark-text-secondary">
              QuickBooks, Salesforce, Square, Clover, your EMR, and more—flow into one clean, real-time executive dashboard.
            </p>
            <div className="mt-8">
              <Button to="/contact">Start Your Free Discovery Call</Button>
            </div>
          </div>
          <div className="rounded-2xl bg-light-card p-6 shadow-lg dark:bg-dark-card">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['QuickBooks', 'Salesforce', 'Square', 'Clover', 'EMR', 'HubSpot'].map((src) => (
                <span
                  key={src}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {src}
                </span>
              ))}
            </div>
            <div className="my-6 flex items-center justify-center">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent dark:via-brand-cyan" />
              <span className="mx-4 text-sm font-semibold text-brand-gold dark:text-brand-cyan">→ DataCats Hub →</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent dark:via-brand-cyan" />
            </div>
            <div className="rounded-xl bg-slate-900 p-6 text-center text-white dark:bg-slate-950">
              <p className="text-sm font-medium text-slate-300">360° Executive Dashboard</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
