import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface GTMTrackerProps {
  children: ReactNode;
}

const KNOWN_PATHS = new Set(['/', '/presentation', '/penelope', '/contact']);

function isRouteMetaReady(pathname: string): boolean {
  const canonical = document.head
    .querySelector<HTMLLinkElement>('link[rel="canonical"]')
    ?.getAttribute('href');
  if (!canonical) return true;
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const expectedPath = KNOWN_PATHS.has(cleanPath) ? cleanPath : '/404';
  return canonical === `https://datacats.ca${expectedPath}`;
}

export function GTMTracker({ children }: GTMTrackerProps) {
  const location = useLocation();

  useEffect(() => {
    let pushed = false;
    const pushPageview = () => {
      if (pushed) return;
      pushed = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'virtual_pageview',
        page_path: location.pathname,
        page_search: location.search,
        page_title: document.title,
      });
    };

    if (isRouteMetaReady(location.pathname)) {
      pushPageview();
      return;
    }

    const observer = new MutationObserver(() => {
      if (isRouteMetaReady(location.pathname)) {
        observer.disconnect();
        pushPageview();
      }
    });
    observer.observe(document.head, { childList: true, subtree: true, attributes: true });
    const timer = window.setTimeout(() => {
      observer.disconnect();
      pushPageview();
    }, 300);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [location.pathname, location.search]);

  return <>{children}</>;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
