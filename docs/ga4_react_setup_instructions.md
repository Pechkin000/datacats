# Agent Instructions: Google Analytics 4 (GA4) Integration for React

**Task:** Integrate Google Analytics 4 into a React Single Page Application (SPA).
**Measurement ID:** `G-WHJLEG19K8`
**Target Environment:** React (assumes `react-router-dom` is used for routing)

## Prerequisites
Ensure you are in the root directory of the React project before beginning execution.

## Step 1: Install Dependencies
Install the `react-ga4` package, which is required for handling GA4 in a React SPA environment.

```bash
npm install react-ga4
```

## Step 2: Initialize GA4
Locate the main entry file of the React application (`datacats-web/src/main.tsx`). Initialize the analytics engine before the App component renders.

Inject the following code:

```typescript
import ReactGA from 'react-ga4';

// Initialize GA4 with the provided Measurement ID
ReactGA.initialize('G-WHJLEG19K8');
```

**Implementation (`datacats-web/src/main.tsx`):**
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactGA from 'react-ga4'
import { ThemeProvider } from './components/layout/ThemeProvider.tsx'
import './styles/globals.css'
import App from './App.tsx'

ReactGA.initialize('G-WHJLEG19K8')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
```

## Step 3: Implement Route Tracking
Because React is a Single Page Application, standard GA4 configuration requires a route listener to explicitly track SPA page transitions.

In this codebase, `<BrowserRouter>` wraps `<App />` in `datacats-web/src/main.tsx`, while `<Routes>` lives inside `datacats-web/src/App.tsx`.

1. Import `useEffect` from React in `datacats-web/src/App.tsx`.
2. Import `useLocation` from `react-router-dom`.
3. Create a `RouteTracker` component.
4. Mount `<RouteTracker />` inside `App` (which is already inside `<BrowserRouter>` and outside `<Routes>`).

**Implementation (`datacats-web/src/App.tsx`):**
```tsx
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Presentation } from './pages/Presentation';
import { Penelope } from './pages/Penelope';
import { Contact } from './pages/Contact';

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
      {/* ...Navbar, Routes, Footer... */}
    </div>
  );
}

export default App;
```

## Step 4: Verification
1. Build and start the development server (`npm start` or `npm run dev`).
2. Navigate through multiple pages in the local application.
3. Verify that network requests to `google-analytics.com/g/collect` are firing with the `v=2` and `tid=G-WHJLEG19K8` query parameters.