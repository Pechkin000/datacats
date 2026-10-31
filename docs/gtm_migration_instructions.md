### SYSTEM PROMPT INSTRUCTIONS: MIGRATE FROM REACT-GA4 TO GOOGLE TAG MANAGER

### CONTEXT

We are migrating our hybrid Node/Express and React Router v7 web application away from direct Google Analytics tracking (react-ga / react-ga4) to a centralized Google Tag Manager (GTM) container environment using container ID: **GTM-M8TZBJ5P**. 

The application architecture consists of: 

1. A Node/Express backend (app.js) that performs lightweight static HTML shell injection via template string replacements on dist/index.html.
2. A React v18+ Client-Side Rendered (CSR) frontend (main.tsx and App.tsx) utilizing React Router v7 (react-router-dom ^7.18.4) with <BrowserRouter>, <Routes>, and code-split <Route> paths (/, /presentation, /penelope, /contact).

### TASK OBJECTIVES

1. Completely remove all traces of the legacy Google Analytics node module, imports, initializations, and tracking hooks.
2. Inject the official Google Tag Manager container snippets dynamically within the Node/Express backend template engine.
3. Build a client-side GTM pageview tracker wrapper within React Router v7 to handle SPA virtual pageviews.
4. Translate any found legacy analytics event push tracking codes (e.g., manual button event tracking) into the updated custom window.dataLayer.push standard structure.

### IMPLEMENTATION STEPS

### STEP 1: CLEANUP LEGACY GA4 DEPENDENCIES & CODE

Scan the codebase and execute the following deletions: 

1. **Dependencies:** Remove react-ga4 or react-ga from package.json. (Instruct user to run npm uninstall react-ga4 react-ga).
2. **Initialization Deletion:** Search main.tsx, App.tsx, and initialization logic files. Delete any imports of ReactGA and any initialization calls such as ReactGA.initialize(...).
3. **Route Tracking Deletion:** Locate any existing useEffect blocks or router listeners that track page path modifications via legacy commands like ReactGA.send({ hitType: "pageview", ... }) or ReactGA.pageview() and delete them completely.
### SYSTEM PROMPT INSTRUCTIONS: MIGRATE FROM REACT-GA4 TO GOOGLE TAG MANAGER

### CONTEXT

We are migrating our hybrid Node/Express and React Router v7 web application away from direct Google Analytics tracking (react-ga / react-ga4) to a centralized Google Tag Manager (GTM) container environment using container ID: **GTM-M8TZBJ5P**. 

The application architecture consists of: 

1. A Node/Express backend (app.js) that performs lightweight static HTML shell injection via template string replacements on dist/index.html.
2. A React v18+ Client-Side Rendered (CSR) frontend (main.tsx and App.tsx) utilizing React Router v7 (react-router-dom ^7.18.4) with <BrowserRouter>, <Routes>, and code-split <Route> paths (/, /presentation, /penelope, /contact).

### TASK OBJECTIVES

1. Completely remove all traces of the legacy Google Analytics node module, imports, initializations, and tracking hooks.
2. Inject the official Google Tag Manager container snippets dynamically within the Node/Express backend template engine.
3. Build a client-side GTM pageview tracker wrapper within React Router v7 to handle SPA virtual pageviews.
4. Translate any found legacy analytics event push tracking codes (e.g., manual button event tracking) into the updated custom window.dataLayer.push standard structure.

### IMPLEMENTATION STEPS

### STEP 1: CLEANUP LEGACY GA4 DEPENDENCIES & CODE

Scan the codebase and execute the following deletions: 

1. **Dependencies:** Remove react-ga4 or react-ga from package.json. (Instruct user to run npm uninstall react-ga4 react-ga).
2. **Initialization Deletion:** Search main.tsx, App.tsx, and initialization logic files. Delete any imports of ReactGA and any initialization calls such as ReactGA.initialize(...).
3. **Route Tracking Deletion:** Locate any existing useEffect blocks or router listeners that track page path modifications via legacy commands like ReactGA.send({ hitType: "pageview", ... }) or ReactGA.pageview() and delete them completely.

### STEP 2: NODE/EXPRESS SERVER-SIDE GTM INJECTION (app.js)

Modify the Express backend logic responsible for compiling and serving the index HTML payload (specifically within renderIndexHtml or equivalent template-parsing routines): 

1. **Head Script Injection:** Find where the closing </head> tag is processed. Inject the standard async GTM javascript snippet directly above it.
2. **Body Noscript Injection:** Find where the opening <body> tag is processed. Inject the standard GTM <noscript> iframe fallback immediately after it.

Ensure the strings match this exact markup structure containing our container token: 

javascript

// Inside the server-side HTML builder function processing originalHtml:
function injectGTM(html) {
  const gtmContainerId = "GTM-M8TZBJ5P";

  const gtmScript = `
    <!-- Google Tag Manager -->
    <script async src="https://www.googletagmanager.com/gtm.js?id=\${gtmContainerId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    </script>
    <!-- End Google Tag Manager -->
  `;

  const gtmNoscript = `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=\${gtmContainerId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
  `;

  // Safe mutations via string replacement
  let processedHtml = html.replace('</head>', `\${gtmScript}</head>`);
  processedHtml = processedHtml.replace('<body>', `<body>\${gtmNoscript}`);
  
  return processedHtml;
}

Use code with caution.

### STEP 3: CREATE THE REACT ROUTER V7 GTM TRACKER COMPONENT

Create a new file src/components/GTMTracker.tsx to handle route changes within the SPA runtime. This component listens to the useLocation() hook and pushes clean virtual_pageview events down the window.dataLayer vector pipeline. 

typescript

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface GTMTrackerProps {
  children: React.ReactNode;
}

export function GTMTracker({ children }: GTMTrackerProps) {
  const location = useLocation();

  useEffect(() => {
    // Safely establish the layer global array
    window.dataLayer = window.dataLayer || [];
    
    // Push the state layer event to capture route changes
    window.dataLayer.push({
      event: "virtual_pageview",
      page_path: location.pathname,
      page_search: location.search,
      page_title: document.title
    });
  }, [location]);

  return <>{children}</>;
}

// Global scope window interface augmentation for explicit TypeScript compliance
declare global {
  interface Window {
    dataLayer: any[];
  }
}

Use code with caution.

### STEP 4: WIRE UP THE ROUTER CONTAINER LAYER

Integrate the component into the main routing configuration layer inside App.tsx or main.tsx. The <GTMTracker> layout node **must** reside inside the <BrowserRouter> ecosystem to cleanly interact with history hooks, wrapping the top-level routing hierarchy: 

tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GTMTracker } from "./components/GTMTracker";
import React from "react";

// App component routing definition structure
export default function App() {
  return (
    <BrowserRouter>
      <GTMTracker>
        <Routes>
          {/* Main system routes mapped out */}
          <Route path="/" element={<Home />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/penelope" element={<Penelope />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GTMTracker>
    </BrowserRouter>
  );
}

Use code with caution.

### STEP 5: REFACTOR CUSTOM CLICKS & FEATURES ENGAGEMENTS

If the repository features custom interactions inside modules (like form submission hooks, image layout clicks, etc.) tracking directly via a dependency like ReactGA.event('action_name', {...}), convert them to the standalone vanilla global dataLayer layout syntax structure: 

typescript

// ❌ CONVERT FROM OLD STRUCTURE:
// ReactGA.event('form_submission', { category: 'contact' });

//  CONVERT TO NEW DATA LAYER PUSH EVENT PATTERN:
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'custom_interaction',
  interaction_name: 'form_submission',
  interaction_category: 'contact'
});

Use code with caution.

### CONSTRAINTS & SANITY CHECKS

* Do NOT leave any hardcoded tracking event methods using react-ga4 elsewhere in any module.
* Ensure the GTM <script> tags are loaded synchronously relative to the main application bundles, maximizing early telemetry initialization before total client hydration.
### STEP 2: NODE/EXPRESS SERVER-SIDE GTM INJECTION (app.js)

Modify the Express backend logic responsible for compiling and serving the index HTML payload (specifically within renderIndexHtml or equivalent template-parsing routines): 

1. **Head Script Injection:** Find where the closing </head> tag is processed. Inject the standard async GTM javascript snippet directly above it.
2. **Body Noscript Injection:** Find where the opening <body> tag is processed. Inject the standard GTM <noscript> iframe fallback immediately after it.

Ensure the strings match this exact markup structure containing our container token: 

javascript

// Inside the server-side HTML builder function processing originalHtml:
function injectGTM(html) {
  const gtmContainerId = "GTM-M8TZBJ5P";

  const gtmScript = `
    <!-- Google Tag Manager -->
    <script async src="https://www.googletagmanager.com/gtm.js?id=\${gtmContainerId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    </script>
    <!-- End Google Tag Manager -->
  `;

  const gtmNoscript = `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=\${gtmContainerId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
  `;

  // Safe mutations via string replacement
  let processedHtml = html.replace('</head>', `\${gtmScript}</head>`);
  processedHtml = processedHtml.replace('<body>', `<body>\${gtmNoscript}`);
  
  return processedHtml;
}

Use code with caution.

### STEP 3: CREATE THE REACT ROUTER V7 GTM TRACKER COMPONENT

Create a new file src/components/GTMTracker.tsx to handle route changes within the SPA runtime. This component listens to the useLocation() hook and pushes clean virtual_pageview events down the window.dataLayer vector pipeline. 

typescript

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface GTMTrackerProps {
  children: React.ReactNode;
}

export function GTMTracker({ children }: GTMTrackerProps) {
  const location = useLocation();

  useEffect(() => {
    // Safely establish the layer global array
    window.dataLayer = window.dataLayer || [];
    
    // Push the state layer event to capture route changes
    window.dataLayer.push({
      event: "virtual_pageview",
      page_path: location.pathname,
      page_search: location.search,
      page_title: document.title
    });
  }, [location]);

  return <>{children}</>;
}

// Global scope window interface augmentation for explicit TypeScript compliance
declare global {
  interface Window {
    dataLayer: any[];
  }
}

Use code with caution.

### STEP 4: WIRE UP THE ROUTER CONTAINER LAYER

Integrate the component into the main routing configuration layer inside App.tsx or main.tsx. The <GTMTracker> layout node **must** reside inside the <BrowserRouter> ecosystem to cleanly interact with history hooks, wrapping the top-level routing hierarchy: 

tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GTMTracker } from "./components/GTMTracker";
import React from "react";

// App component routing definition structure
export default function App() {
  return (
    <BrowserRouter>
      <GTMTracker>
        <Routes>
          {/* Main system routes mapped out */}
          <Route path="/" element={<Home />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/penelope" element={<Penelope />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GTMTracker>
    </BrowserRouter>
  );
}

Use code with caution.

### STEP 5: REFACTOR CUSTOM CLICKS & FEATURES ENGAGEMENTS

If the repository features custom interactions inside modules (like form submission hooks, image layout clicks, etc.) tracking directly via a dependency like ReactGA.event('action_name', {...}), convert them to the standalone vanilla global dataLayer layout syntax structure: 

typescript

// ❌ CONVERT FROM OLD STRUCTURE:
// ReactGA.event('form_submission', { category: 'contact' });

//  CONVERT TO NEW DATA LAYER PUSH EVENT PATTERN:
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'custom_interaction',
  interaction_name: 'form_submission',
  interaction_category: 'contact'
});

Use code with caution.

### CONSTRAINTS & SANITY CHECKS

* Do NOT leave any hardcoded tracking event methods using react-ga4 elsewhere in any module.
* Ensure the GTM <script> tags are loaded synchronously relative to the main application bundles, maximizing early telemetry initialization before total client hydration.