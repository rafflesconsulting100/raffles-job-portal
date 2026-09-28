// Runtime head management for the SPA. Keeps document title, description,
// canonical, robots, Open Graph tags and JSON-LD in sync with the prerendered
// HTML so Google sees identical signals after client-side navigation.

import { useEffect } from 'react';
import {
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  ROUTE_META,
  canonicalUrl,
} from './seoConfig.js';
import { organizationSchema, websiteSchema, serializeSchema } from './seoSchema.js';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

function clearJsonLd() {
  // Clear every JSON-LD script, not only the ones this file injected: the
  // prerendered HTML ships its own graphs, and any page-specific schema
  // (BreadcrumbList / JobPosting / FAQ of the previous route) would otherwise
  // stay in <head> after a client-side navigation.
  document.head
    .querySelectorAll('script[type="application/ld+json"], script[data-seo-jsonld]')
    .forEach((node) => node.remove());
}

function injectJsonLd(schemas) {
  const list = (Array.isArray(schemas) ? schemas : [schemas]).filter(Boolean);
  list.forEach((schema) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-jsonld', 'true');
    script.textContent = serializeSchema(schema);
    document.head.appendChild(script);
  });
}

/**
 * Applies head metadata for the current route.
 *
 * @param {object} options
 * @param {string} options.path          Current route path (used for defaults).
 * @param {string} [options.title]       Page title (defaults to ROUTE_META[path].title).
 * @param {string} [options.description] Meta description.
 * @param {boolean} [options.noindex]    Force noindex,follow.
 * @param {Array} [options.jsonLd]       Extra JSON-LD objects (page-specific).
 */
export default function useSeo(options = {}) {
  const {
    path,
    title,
    description,
    noindex,
    jsonLd,
    canonicalOverride,
  } = options;

  const routeMeta = path && ROUTE_META[path] ? ROUTE_META[path] : null;
  const resolvedTitle = title || routeMeta?.title || `${SITE_NAME} – Find Jobs`;
  const resolvedDescription =
    description || routeMeta?.description || DEFAULT_DESCRIPTION;
  const isNoindex = typeof noindex === 'boolean' ? noindex : Boolean(routeMeta?.noindex);
  const resolvedCanonical =
    canonicalUrl(canonicalOverride || routeMeta?.canonicalOverride || path || '/');

  const jsonLdKey = serializeSchema(jsonLd || null);

  useEffect(() => {
    document.title = resolvedTitle;

    upsertMeta('name', 'description', resolvedDescription);
    upsertMeta('name', 'robots', isNoindex ? 'noindex,follow' : 'index,follow');
    upsertMeta('property', 'og:title', resolvedTitle);
    upsertMeta('property', 'og:description', resolvedDescription);
    upsertMeta('property', 'og:url', resolvedCanonical);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:type', 'website');
    // Must match client/index.html (twitter:image is a square logo).
    upsertMeta('name', 'twitter:card', 'summary');
    upsertMeta('name', 'twitter:title', resolvedTitle);
    upsertMeta('name', 'twitter:description', resolvedDescription);
    upsertLink('canonical', resolvedCanonical);

    clearJsonLd();
    injectJsonLd([organizationSchema(), websiteSchema()]);
    if (jsonLd) injectJsonLd(jsonLd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    resolvedTitle,
    resolvedDescription,
    isNoindex,
    resolvedCanonical,
    jsonLdKey,
  ]);

  useEffect(() => clearJsonLd, []);
}
