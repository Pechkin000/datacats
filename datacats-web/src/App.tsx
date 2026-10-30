import { lazy, Suspense, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';

const Presentation = lazy(() =>
  import('./pages/Presentation').then((m) => ({ default: m.Presentation }))
);
const Penelope = lazy(() =>
  import('./pages/Penelope').then((m) => ({ default: m.Penelope }))
);
const Contact = lazy(() =>
  import('./pages/Contact').then((m) => ({ default: m.Contact }))
);
const NotFound = lazy(() =>
  import('./pages/NotFound').then((m) => ({ default: m.NotFound }))
);

function scheduleIdle(task: () => void, timeout = 1500): () => void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = window.requestIdleCallback(task, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const timer = globalThis.setTimeout(task, 250);
  return () => globalThis.clearTimeout(timer);
}

function RouteTracker() {
  const location = useLocation();
  const initializedRef = useRef(false);

  useEffect(() => {
    const page = location.pathname + location.search;
    return scheduleIdle(() => {
      import('react-ga4')
        .then(({ default: ReactGA }) => {
          if (!initializedRef.current) {
            ReactGA.initialize('G-WHJLEG19K8');
            initializedRef.current = true;
          }
          ReactGA.send({ hitType: 'pageview', page });
        })
        .catch(() => {
          // Ignore analytics errors if blocked by ad blockers
        });
    });
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-light-surface text-light-text-primary transition-colors duration-200 dark:bg-dark-surface dark:text-dark-text-primary">
      <RouteTracker />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-slate-900"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/presentation" element={<Presentation />} />
            <Route path="/penelope" element={<Penelope />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
