import { PageMeta } from '../components/layout/PageMeta';
import { Section } from '../components/sections/Section';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <>
      <PageMeta
        title="Page Not Found | DataCats Business Intelligence"
        description="The page you are looking for could not be found. Explore DataCats Business Intelligence dashboards and custom reporting solutions."
        path="/404"
        noindex
      />
      <Section className="py-24 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold dark:text-brand-cyan">
            404 Error
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-light-text-primary sm:text-5xl dark:text-dark-text-primary">
            This cat wandered off the chart.
          </h1>
          <p className="mt-4 text-lg text-light-text-secondary dark:text-dark-text-secondary">
            We couldn&apos;t find the page you were looking for. Try heading back home or exploring our sample dashboards.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button to="/" variant="primary" size="lg">
              Back to Home
            </Button>
            <Button to="/presentation" variant="outline" size="lg">
              View Sample Reports
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

