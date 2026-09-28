// Central SEO configuration for RafflesJobs.
// This file is imported by:
//   1. React pages (via useSeo) at runtime, and
//   2. the Vite prerender plugin at build time (client/vite-plugin-prerender.mjs)
// so it must stay a dependency-free ES module (no JSX, no react imports).

export const SITE_URL = 'https://www.rafflesjobs.com';
export const SITE_NAME = 'RafflesJobs';

export const DEFAULT_TITLE = 'RafflesJobs – BPO, Sales & Other Job Opportunities';
export const DEFAULT_DESCRIPTION =
  'Find BPO, sales, warehouse, support and other job opportunities on RafflesJobs. ' +
  'Search jobs, explore career opportunities and apply for jobs.';

/**
 * Canonical job categories supported by the job posting form.
 * `name` must match the value employers pick in JobFormTab (and the value
 * stored on the Job document). `slug` is the /jobs/<slug> landing page.
 * Pages are only created/indexed for categories that actually have jobs.
 */
export const JOB_CATEGORIES = [
  { name: 'BPO', slug: 'bpo', label: 'BPO Jobs' },
  { name: 'Sales', slug: 'sales', label: 'Sales Jobs' },
  { name: 'Warehouse', slug: 'warehouse', label: 'Warehouse Jobs' },
  { name: 'Support Assistant', slug: 'support-assistant', label: 'Support Assistant Jobs' },
  { name: 'Customer Support', slug: 'customer-support', label: 'Customer Support Jobs' },
  { name: 'Operations', slug: 'operations', label: 'Operations Jobs' },
  { name: 'Back Office', slug: 'back-office', label: 'Back Office Jobs' },
  { name: 'Marketing', slug: 'marketing', label: 'Marketing Jobs' },
  { name: 'Finance', slug: 'finance', label: 'Finance Jobs' },
  { name: 'HR', slug: 'hr', label: 'HR Jobs' },
  { name: 'Management', slug: 'management', label: 'Management Jobs' },
];

/** Categories shown in job list filters (kept identical to the job form). */
export const CATEGORY_FILTER_OPTIONS = ['All', ...JOB_CATEGORIES.map((c) => c.name)];

const CATEGORY_BY_SLUG = JOB_CATEGORIES.reduce((acc, c) => {
  acc[c.slug] = c;
  return acc;
}, {});

const CATEGORY_BY_NAME = JOB_CATEGORIES.reduce((acc, c) => {
  acc[c.name.toLowerCase()] = c;
  return acc;
}, {});

export function categoryBySlug(slug) {
  if (!slug) return null;
  return CATEGORY_BY_SLUG[String(slug).toLowerCase()] || null;
}

export function categoryByName(name) {
  if (!name) return null;
  return CATEGORY_BY_NAME[String(name).toLowerCase()] || null;
}

/** Reverse lookup: stored category name -> "/jobs/<slug>". Returns null for unknown. */
export function categoryPath(name) {
  const category = categoryByName(name);
  return category ? `/jobs/${category.slug}` : null;
}

/** Public URL of a job given its slug. */
export function jobPath(slug) {
  return slug ? `/jobs/${slug}` : '/jobs';
}

/** Absolute URL for a site-relative path (keeps query strings out of canonicals). */
export function absoluteUrl(path = '/') {
  const cleanPath = path.startsWith('http') ? new URL(path).pathname : path;
  return `${SITE_URL}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
}

/** Canonical URL for a path: absolute, no query string, no trailing slash (except root). */
export function canonicalUrl(path = '/') {
  const withoutQuery = String(path || '/').split('?')[0].split('#')[0];
  if (withoutQuery === '/' || withoutQuery === '') return `${SITE_URL}/`;
  const normalized = withoutQuery.replace(/\/+$/, '');
  return `${SITE_URL}${normalized}`;
}

/**
 * Public, indexable routes (used to build the sitemap). Everything else
 * (auth, dashboards, previews) is emitted with
 * <meta name="robots" content="noindex,follow">.
 */
export const INDEXABLE_ROUTES = [
  '/',
  '/jobs',
  '/about',
  '/contact',
  '/pricing',
  '/privacy',
];

/** Routes that render the app chrome and get a prerendered shell. */
export const SHELL_ROUTES = [
  '/',
  '/home',
  '/jobs',
  '/about',
  '/contact',
  '/pricing',
  '/get-started',
  '/login',
  '/register',
  '/verify-otp',
  '/privacy',
  '/employer-dashboard',
  '/jobseeker-dashboard',
  '/job-seeker-dashboard',
  '/admin-dashboard',
];

export function isIndexableRoute(path) {
  const clean = String(path || '/').split('?')[0];
  if (INDEXABLE_ROUTES.includes(clean)) return true;
  if (categoryBySlug(clean.replace(/^\/jobs\//, ''))) return true; // /jobs/<category>
  if (/^\/jobs\/[^/]+$/.test(clean)) return true; // /jobs/<slug> (closed jobs downgrade to noindex at runtime)
  return false;
}

/**
 * Per-route head metadata used by the prerender plugin and useSeo.
 * Titles are unique per page; descriptions are factual (no invented stats).
 */
export const ROUTE_META = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    ogTitle: DEFAULT_TITLE,
    ogDescription: DEFAULT_DESCRIPTION,
    breadcrumb: null,
  },
  '/home': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    ogTitle: DEFAULT_TITLE,
    ogDescription: DEFAULT_DESCRIPTION,
    breadcrumb: null,
    canonicalOverride: '/',
    // Legacy URL: keep it working for old links but out of the index.
    noindex: true,
  },
  '/jobs': {
    title: 'Jobs – Find Job Opportunities | RafflesJobs',
    description:
      'Browse current job openings across BPO, sales, warehouse, support and other roles on RafflesJobs. ' +
      'Filter live vacancies by category, location, experience and job type, then apply online.',
    ogTitle: 'Jobs – Find Job Opportunities | RafflesJobs',
    ogDescription:
      'Browse current job openings across BPO, sales, warehouse, support and other roles and apply online.',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Jobs' }],
  },
  '/about': {
    title: 'About RafflesJobs – How Our Job Portal Works',
    description:
      'Learn how RafflesJobs connects job seekers with employers: free job search and applications ' +
      'for candidates, simple job posting for hiring teams, and how to reach us.',
    ogTitle: 'About RafflesJobs',
    ogDescription: 'Learn how RafflesJobs connects job seekers with employers.',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'About' }],
  },
  '/contact': {
    title: 'Contact RafflesJobs – Support for Job Seekers & Employers',
    description:
      'Get in touch with the RafflesJobs team for help with your account, job applications, ' +
      'job postings or billing. Reach us by phone or email.',
    ogTitle: 'Contact RafflesJobs',
    ogDescription: 'Get in touch with the RafflesJobs team.',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Contact' }],
  },
  '/pricing': {
    title: 'Pricing for Employers – Post Jobs on RafflesJobs',
    description:
      'See how employers can post job openings on RafflesJobs and reach candidates. ' +
      'Compare posting options and start hiring.',
    ogTitle: 'Pricing for Employers',
    ogDescription: 'See how employers can post job openings on RafflesJobs.',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Pricing' }],
  },
  '/get-started': {
    title: 'Get Started – Choose Job Seeker or Employer | RafflesJobs',
    description:
      'Tell us what you are looking for: search and apply for jobs free, or post job openings and hire staff.',
    ogTitle: 'Get Started with RafflesJobs',
    ogDescription: 'Search and apply for jobs free, or post job openings and hire staff.',
    noindex: true,
    breadcrumb: null,
  },
  '/privacy': {
    title: 'Privacy Policy – RafflesJobs',
    description:
      'How RafflesJobs collects, uses and protects the information you share when you create an account, ' +
      'apply for jobs or post vacancies.',
    ogTitle: 'Privacy Policy – RafflesJobs',
    ogDescription: 'How RafflesJobs collects, uses and protects your information.',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Privacy Policy' }],
  },
  '/login': { noindex: true, title: 'Login | RafflesJobs' },
  '/register': { noindex: true, title: 'Register | RafflesJobs' },
  '/verify-otp': { noindex: true, title: 'Verify OTP | RafflesJobs' },
  '/employer-dashboard': { noindex: true, title: 'Employer Dashboard | RafflesJobs' },
  '/jobseeker-dashboard': { noindex: true, title: 'Job Seeker Dashboard | RafflesJobs' },
  '/job-seeker-dashboard': { noindex: true, title: 'Job Seeker Dashboard | RafflesJobs' },
  '/admin-dashboard': { noindex: true, title: 'Admin Dashboard | RafflesJobs' },
};

/** FAQ content pairs — every pair must be visible on the page it is attached to. */
export const CONTACT_FAQS = [
  {
    question: 'Is it free for job seekers to search and apply on RafflesJobs?',
    answer:
      'Yes. Job seekers can create an account, search jobs and submit applications at no cost.',
  },
  {
    question: 'How do I apply for a job listed on RafflesJobs?',
    answer:
      'Open the job listing, choose Apply Now and submit your resume together with any screening answers the employer has asked for.',
  },
  {
    question: 'How do employers post a job opening?',
    answer:
      'Employers create an account, open the employer dashboard and use the job posting form to publish an opening.',
  },
  {
    question: 'How can I reach the RafflesJobs team?',
    answer: 'Call +91 7397242159 or email hr@rafflesconsulting.in.',
  },
];
