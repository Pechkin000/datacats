import { Database, Users, BrainCircuit, FileCheck, Zap, DollarSign, HeartHandshake } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
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
    description: "Avoid Bonaterra's astronomical custom reporting fees.",
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

const penelopeFaqs = [
  {
    question: 'What kind of custom reports can DataCats build from Bonaterra Penelope?',
    answer:
      'We build board-ready executive dashboards, funder and grant compliance reports, practitioner caseload and billable-hour utilization reports, client intake and waitlist funnels, and demographic outcome breakdowns.',
  },
  {
    question: 'Which reporting tools can connect to our Penelope data?',
    answer:
      'We deliver Penelope analytics in Microsoft Power BI, Tableau, automated Excel workbooks, or cloud data warehouses like BigQuery—formatted to match how your clinical directors and finance team already work.',
  },
  {
    question: 'How fast can you deliver a custom Penelope report compared to vendor services?',
    answer:
      'Most custom Penelope reports and dashboards are delivered in days rather than months, at a fraction of standard enterprise custom reporting fees.',
  },
];

export function Penelope() {
  return (
    <>
      <PageMeta
        title="Bonaterra Penelope Custom Reporting Services | DataCats"
        description="Unlock your Bonaterra Penelope case management data without enterprise consulting fees. Fast custom reports, grant dashboards & staff utilization metrics."
        path="/penelope"
        breadcrumbLabel="Penelope Reporting"
        jsonLd={[
          {
            '@type': 'Service',
            name: 'Custom Bonaterra Penelope Case Management Reporting',
            provider: { '@id': 'https://datacats.ca/#organization' },
            serviceType: 'Case Management Business Intelligence & Custom Reporting',
            description:
              'Custom reporting, caseload utilization, intake tracking, and grant compliance dashboards for agencies running Bonaterra Penelope case management software.',
            areaServed: ['CA', 'US'],
          },
          {
            '@type': 'FAQPage',
            mainEntity: penelopeFaqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]}
      />
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
            Penelope Reporting Value Pillars
          </h2>
          <p className="mt-4 text-lg text-light-text-secondary dark:text-dark-text-secondary">
            Purpose-built analytics for social services, healthcare, and non-profit agencies using Penelope.
          </p>
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

      <Section>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            Penelope Custom Reporting FAQ
          </h2>
          <div className="space-y-4">
            {penelopeFaqs.map((faq) => (
              <Card key={faq.question} hover={false}>
                <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
