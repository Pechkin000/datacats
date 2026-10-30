import { useEffect } from 'react';

const SITE_URL = 'https://datacats.ca';

export interface PageMetaProps {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  breadcrumbLabel?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function PageMeta({
  title,
  description,
  path,
  noindex = false,
  breadcrumbLabel,
  jsonLd,
}: PageMetaProps) {
  useEffect(() => {
    const cleanPath = path === '/' ? '/' : path.replace(/\/+$/, '');
    const canonicalUrl = `${SITE_URL}${cleanPath}`;

    document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setCanonical(canonicalUrl);

    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);

    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);

    const graphItems: Record<string, unknown>[] = [];

    if (!noindex) {
      const breadcrumbItems: Record<string, unknown>[] = [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
      ];
      if (cleanPath !== '/' && breadcrumbLabel) {
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: breadcrumbLabel,
          item: canonicalUrl,
        });
      }
      graphItems.push({
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      });
    }

    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        graphItems.push(...jsonLd);
      } else {
        graphItems.push(jsonLd);
      }
    }

    let script = document.getElementById('datacats-jsonld-route') as HTMLScriptElement | null;
    if (graphItems.length > 0) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'datacats-jsonld-route';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graphItems,
      });
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, noindex, breadcrumbLabel, jsonLd]);

  return null;
}

