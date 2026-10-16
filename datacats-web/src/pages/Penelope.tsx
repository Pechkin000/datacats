import { Database, Users, BrainCircuit, FileCheck, Zap, DollarSign, HeartHandshake } from 'lucide-react';
import { HeroBlock } from '../components/sections/HeroBlock';
import { Section } from '../components/sections/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const valuePillars = [
  {
    icon: Database,
    title: 'Deep Data Extraction',
    description: 'Pull client metrics, intake logs, and session statistics effortlessly.',
  },
  {
    icon: Users,
    title: 'Maximize Staff Utilization',
    description: 'Measure caseloads, billable hours, and service outcomes per practitioner.',
  },
  {
    icon: BrainCircuit,
    title: 'Pattern Recognition',
    description: 'Discover demographic shifts and service demand trends.',
  },
  {
    icon: FileCheck,
    title: 'Custom Tailored Reports',
    description: 'Build exact reports tailored to grant requirements, boards, and clinical directors.',
  },
];

const competitiveEdge = [
  {
    icon: DollarSign,
    title: 'Fraction of the Cost',
    description: 'Avoid Bonaterra\'s astronomical custom reporting fees.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Delivery',
    description: 'Get custom reports delivered in days, not months.',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated, Personalized Service',
    description: 'Direct contact with reporting experts who know Penelope inside and out.',
  },
];

export function Penelope() {
  return (
    <>
      <HeroBlock
        title="Unlock Your Penelope Client Data—Without the Enterprise Price Tag."
        subtitle="Custom reporting for Bonaterra Penelope case management, built for agencies that need answers fast."
        primaryCta={{ label: 'Request a Penelope Report', to: '/contact' }}
        secondaryCta={{ label: 'See All Solutions', to: '/presentation' }}
        centered
      />

      <Section>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            Value Pillars
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valuePillars.map((pillar) => (
            <Card key={pillar.title} className="h-full">
              <pillar.icon className="mb-4 h-10 w-10 text-brand-gold dark:text-brand-cyan" />
              <h3 className="mb-2 text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                {pillar.title}
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-8 dark:from-slate-800 dark:to-slate-900">
              <h3 className="mb-4 text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                The Competitive Edge
              </h3>
              <div className="space-y-6">
                {competitiveEdge.map((edge) => (
                  <div key={edge.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold dark:bg-brand-cyan/10 dark:text-brand-cyan">
                      <edge.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                        {edge.title}
                      </h4>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {edge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Built for Penelope users.
            </h2>
            <p className="mt-4 text-lg text-light-text-secondary dark:text-dark-text-secondary">
              Whether you need board dashboards, grant reports, or clinical metrics, we extract and shape your Penelope data into exactly what stakeholders ask for.
            </p>
            <div className="mt-8">
              <Button to="/contact">Start Your Penelope Project</Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
