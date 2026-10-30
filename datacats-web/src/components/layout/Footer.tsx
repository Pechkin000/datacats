import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

const year = new Date().getFullYear();
const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.1';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-light-surface dark:border-slate-800/50 dark:bg-dark-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Logo variant="text" className="h-8 w-auto" />
            <p className="max-w-xs text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Business analytics for the rest of us. Transforming raw data into clear, actionable insight.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light-text-primary dark:text-dark-text-primary">
              Quick Links
            </h2>
            <ul className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <li><Link to="/" className="hover:text-brand-gold dark:hover:text-brand-cyan">Home</Link></li>
              <li><Link to="/presentation" className="hover:text-brand-gold dark:hover:text-brand-cyan">Solutions</Link></li>
              <li><Link to="/penelope" className="hover:text-brand-gold dark:hover:text-brand-cyan">Penelope</Link></li>
              <li><Link to="/contact" className="hover:text-brand-gold dark:hover:text-brand-cyan">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light-text-primary dark:text-dark-text-primary">
              Contact
            </h2>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <a
                href="mailto:josh@datacats.ca"
                className="hover:text-brand-gold dark:hover:text-brand-cyan"
              >
                josh@datacats.ca
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/50 pt-8 dark:border-slate-800/50 sm:flex-row">
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            © {year} DataCats Business Intelligence. All rights reserved.
          </p>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            Made with 🐱 and data. (CI/CD Deployment v {appVersion})
          </p>
        </div>
      </div>
    </footer>
  );
}
