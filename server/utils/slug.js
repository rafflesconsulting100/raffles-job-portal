// URL slug helpers for public job pages (SEO).
// Used by the Job model, the job controller, and the client build-time prerender
// script (imported from client/vite-plugin-prerender.mjs), so this file must stay
// dependency-free and identical in behaviour for both CommonJS and ESM callers.

// Segments under /jobs that are reserved for category landing pages.
// Also includes site route segments so a job slug can never collide with a
// prerendered file (e.g. /privacy) — a job taking one of these gets "-job".
const RESERVED_SLUGS = new Set([
  // /jobs/<category> landing pages
  'bpo',
  'sales',
  'warehouse',
  'support-assistant',
  'customer-support',
  'operations',
  'back-office',
  'marketing',
  'finance',
  'hr',
  'management',
  // generic /jobs segments
  'jobs',
  'new',
  'saved',
  'search',
  'all',
  'category',
  'slug',
  'my-jobs',
  // top-level site routes
  'home',
  'about',
  'contact',
  'pricing',
  'privacy',
  'login',
  'register',
  'get-started',
  'verify-otp',
  'employer-dashboard',
  'jobseeker-dashboard',
  'admin-dashboard',
  'favicon',
  'robots',
  'sitemap',
]);

const MAX_SLUG_LENGTH = 90;

/** Lowercase, ASCII-safe slug of a free text value. */
function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '');
}

/** `title-location` slug base for a job. Falls back safely when data is thin. */
function buildJobSlug(job) {
  const titlePart = slugify(job && job.title);
  const locationPart = slugify(job && job.location);
  const parts = [titlePart, locationPart].filter(Boolean);
  let base = parts.join('-');
  if (!base) base = 'job';
  base = base.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '');
  if (RESERVED_SLUGS.has(base)) {
    base = `${base}-job`.slice(0, MAX_SLUG_LENGTH);
  }
  return base;
}

/**
 * Deterministic slug for a job that never touches the database.
 * Used as a fallback when a stored slug is missing (e.g. build time, before the
 * server has backfilled existing documents).
 * `seen` is an optional Set of already used slugs for collision handling.
 */
function deriveJobSlug(job, seen) {
  const base = buildJobSlug(job);
  const id = String((job && (job._id || job.id)) || '');
  const suffix = id ? id.slice(-6) : '';

  if (!seen) return base;

  if (!seen.has(base)) {
    seen.add(base);
    return base;
  }
  const unique = suffix ? `${base}-${suffix}` : `${base}-${seen.size}`;
  seen.add(unique);
  return unique;
}

/** True when a job slug would collide with a reserved /jobs/:slug segment. */
function isReservedSlug(slug) {
  return RESERVED_SLUGS.has(String(slug || '').toLowerCase());
}

module.exports = {
  RESERVED_SLUGS,
  slugify,
  buildJobSlug,
  deriveJobSlug,
  isReservedSlug,
};
