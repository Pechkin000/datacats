import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GTMTracker } from './components/GTMTracker';
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

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-light-surface text-light-text-primary transition-colors duration-200 dark:bg-dark-surface dark:text-dark-text-primary">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-slate-900"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <GTMTracker>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/presentation" element={<Presentation />} />
              <Route path="/penelope" element={<Penelope />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GTMTracker>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
