import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Solutions', to: '/presentation' },
  { label: 'Penelope', to: '/penelope' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md transition-colors duration-300">
      <div className="border-b border-slate-200/50 bg-light-surface/80 dark:border-slate-800/50 dark:bg-dark-surface/80">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-h-[48px] items-center gap-2 interactive">
            <Logo variant="icon" alt="" className="h-10 w-auto" />
            <Logo variant="text" alt="DataCats Business Intelligence" className="h-7 w-auto sm:h-8" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link inline-flex min-h-[48px] items-center px-2 py-2 text-base font-medium ${
                  location.pathname === link.to ? 'text-light-text-primary dark:text-dark-text-primary' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="interactive flex h-12 w-12 items-center justify-center rounded-full bg-light-card p-2.5 text-light-text-primary shadow-sm dark:bg-dark-card dark:text-dark-text-primary"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="border-t border-slate-200/50 bg-light-surface px-4 py-4 dark:border-slate-800/50 dark:bg-dark-surface md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`inline-flex min-h-[48px] items-center py-2 text-base font-medium transition-colors duration-200 ${
                    location.pathname === link.to
                      ? 'text-brand-gold dark:text-brand-cyan'
                      : 'text-light-text-secondary hover:text-light-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
