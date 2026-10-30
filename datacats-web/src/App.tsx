import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Presentation } from './pages/Presentation';
import { Penelope } from './pages/Penelope';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
}

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-light-surface text-light-text-primary transition-colors duration-300 dark:bg-dark-surface dark:text-dark-text-primary">
      <RouteTracker />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-slate-900"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/penelope" element={<Penelope />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
