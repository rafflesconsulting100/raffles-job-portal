// Build-time prerender plugin for RafflesJobs.
//
// Runs inside `vite build` (closeBundle) and turns the SPA build output into
// real, crawlable HTML:
//
//   * index.html + one directory index per public route (meta/canonical/JSON-LD)
//   * /jobs/<category> landing pages (only when the category has jobs)
//   * /jobs/<slug> job pages with full static content + JobPosting JSON-LD
//     (Google's job listing parser does not reliably execute JavaScript)
//   * sitemap.xml (canonical URLs only, with real lastmod for jobs)
//   * 404.html (served by Vercel for unknown paths once the catch-all rewrite
//     is removed)
//
// Job data is read from the API (PRODUCTION by default). If the API is not
// reachable the build still succeeds with route shells only — set
// PRERENDER_API_BASE (or VITE_API_BASE_URL) to point at a local server.

import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// Single source of truth for slug generation (shared with the Job model).
const { deriveJobSlug } = require('../server/utils/slug.js');

const seoConfig = await import('./src/Utils/seoConfig.js');
const seoSchema = await import('./src/Utils/seoSchema.js');
const { formatBackendJob, buildJobTitle, buildJobDescription, cleanJobDescription } = await import('./src/Utils/jobFormat.js');

const {
  SITE_URL,
  ROUTE_META,
  SHELL_ROUTES,
  INDEXABLE_ROUTES,
  JOB_CATEGORIES,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  jobPath,
  canonicalUrl,
  absoluteUrl,
} = seoConfig;

const {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  jobPostingSchema,
  jobItemListSchema,
  serializeSchema,
} = seoSchema;

const API_BASE = (
  process.env.PRERENDER_API_BASE ||
  process.env.VITE_API_BASE_URL ||
  'https://raffles-job-portal.onrender.com/api'
).replace(/\/+$/, '');

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toJson(value) {
  // Prevent </script> breakouts and HTML comment parsing inside inline scripts.
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028|\u2029/g, '');
}

function replaceMeta(html, attrName, key, content) {
  if (content === undefined || content === null || content === '') return html;
  const re = new RegExp(`<meta[^>]*\\b${attrName}="${key}"[^>]*>`, 'i');
  const tag = `<meta ${attrName}="${key}" content="${esc(content)}">`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

/**
 * Rewrites the head of the shared SPA shell for one route.
 */
function applyHead(html, { title, description, canonical, noindex, jsonLd }) {
  let out = html;

  if (title) {
    out = /<title>[\s\S]*?<\/title>/.test(out)
      ? out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
      : out.replace('</head>', `<title>${esc(title)}</title>\n  </head>`);
  }

  out = replaceMeta(out, 'name', 'description', description || DEFAULT_DESCRIPTION);
  out = replaceMeta(out, 'name', 'robots', noindex ? 'noindex,follow' : 'index,follow');
  out = replaceMeta(out, 'property', 'og:title', title || DEFAULT_TITLE);
  out = replaceMeta(out, 'property', 'og:description', description || DEFAULT_DESCRIPTION);
  out = replaceMeta(out, 'property', 'og:url', canonical);
  out = replaceMeta(out, 'name', 'twitter:title', title || DEFAULT_TITLE);
  out = replaceMeta(out, 'name', 'twitter:description', description || DEFAULT_DESCRIPTION);

  if (canonical) {
    out = /<link[^>]*rel="canonical"[^>]*>/.test(out)
      ? out.replace(/<link[^>]*rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(canonical)}">`)
      : out.replace('</head>', `<link rel="canonical" href="${esc(canonical)}">\n  </head>`);
  } else {
    // No canonical for this page (404): drop the template's tag entirely.
    out = out.replace(/\s*<link[^>]*rel="canonical"[^>]*>/i, '');
  }

  const scripts = (jsonLd || []).filter(Boolean).map((schema) =>
    `<script type="application/ld+json" data-seo-jsonld="true">${serializeSchema(schema)}</script>`
  );
  const block = scripts.join('\n    ');
  if (out.includes('<!-- seo:jsonld -->')) {
    out = out.replace('<!-- seo:jsonld -->', block);
  } else if (block) {
    out = out.replace('</head>', `    ${block}\n  </head>`);
  }

  return out;
}

function withBody(html, bodyHtml) {
  if (!bodyHtml) return html;
  if (html.includes('<div id="root"></div>')) {
    return html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  }
  if (html.includes('<div id="root">')) {
    return html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${bodyHtml}</div>`);
  }
  return html;
}

function withInlineScript(html, scriptBody) {
  if (!scriptBody) return html;
  return html.replace('</body>', `    <script>${scriptBody}</script>\n  </body>`);
}

async function writeFile(filePath, contents) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents, 'utf8');
}

/** '/' -> index.html, '/jobs' -> jobs/index.html */
function routeToFile(distDir, route) {
  const clean = route.replace(/^\/+|\/+$/g, '');
  return clean ? path.join(distDir, clean, 'index.html') : path.join(distDir, 'index.html');
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

async function fetchActiveJobs() {
  const url = `${API_BASE}/jobs`;
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || !Array.isArray(data.jobs)) throw new Error('unexpected payload');
      return data.jobs;
    } catch (err) {
      lastError = err;
    }
  }

  // Resilient fallback: Try local/env MongoDB if remote API is waking up
  try {
    const fsSync = await import('node:fs');
    const serverEnvPath = path.resolve(process.cwd(), '../server/.env');
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri && fsSync.existsSync(serverEnvPath)) {
      const envText = fsSync.readFileSync(serverEnvPath, 'utf8');
      const match = envText.match(/MONGO_URI\s*=\s*(.+)/);
      if (match) mongoUri = match[1].trim().replace(/^['"]|['"]$/g, '');
    }
    if (mongoUri) {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      }
      const Job = mongoose.models.Job || mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
      const dbJobs = await Job.find({ status: 'active' }).lean();
      if (dbJobs && dbJobs.length > 0) {
        console.log(`[raffles-prerender] loaded ${dbJobs.length} active job(s) from MongoDB fallback`);
        return dbJobs;
      }
    }
  } catch (fallbackErr) {
    // Ignore fallback failure and throw original error
  }

  throw lastError;
}

function assignSlugs(jobs) {
  const seen = new Set();
  const withSlugs = [];
  for (const job of jobs) {
    if (job && job.slug && !seen.has(job.slug)) {
      seen.add(job.slug);
      withSlugs.push(job);
      continue;
    }
    if (!job || !job.title) continue;
    job.slug = deriveJobSlug(job, seen);
    withSlugs.push(job);
  }
  return withSlugs;
}

// ---------------------------------------------------------------------------
// Static body renderers (kept structurally close to the React pages)
// ---------------------------------------------------------------------------

function renderBreadcrumb(items) {
  return `
        <nav aria-label="Breadcrumb" class="pt-4 text-xs font-semibold text-gray-500">
          <ol class="flex flex-wrap items-center gap-2">
            ${items
              .map((item, index) => {
                const sep = index > 0 ? '<li aria-hidden="true">/</li>' : '';
                const label = item.path
                  ? `<li><a href="${esc(item.path)}" class="hover:text-[#2B2A8C]">${esc(item.name)}</a></li>`
                  : `<li class="text-gray-700">${esc(item.name)}</li>`;
                return sep + label;
              })
              .join('')}
          </ol>
        </nav>`;
}

function renderJobListSection(formattedJobs, { heading = 'Live Job Openings', limit = 60 } = {}) {
  const items = formattedJobs.filter((job) => job.slug).slice(0, limit);
  if (items.length === 0) return '';
  return `
        <section class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 class="text-2xl font-black text-[#0F172A]">${esc(heading)}</h2>
          <div class="mt-6 grid gap-4">
            ${items
              .map(
                (job) => `
            <article class="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
              <a href="${esc(jobPath(job.slug))}" class="text-lg font-bold text-[#1e293b] hover:text-[#2B2A8C]">${esc(job.title)}</a>
              <p class="mt-1 text-sm text-gray-500">${esc(job.company)} · ${esc(job.location)} · ${esc(job.jobType)}${
                  job.salary && job.salary !== 'Competitive' ? ` · ${esc(job.salary)}` : ''
                }</p>
              ${job.category ? `<p class="mt-2 text-xs font-bold text-[#2B2A8C]">${esc(job.category)}</p>` : ''}
            </article>`
              )
              .join('')}
          </div>
          <p class="mt-8">
            <a href="/jobs" class="inline-flex rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">Browse all jobs</a>
          </p>
        </section>`;
}

function renderHomeBody(formattedJobs, categoryCounts = {}) {
  const pills = JOB_CATEGORIES.filter((c) => (categoryCounts[c.name] || 0) > 0)
    .map(
      (c) =>
        `<a href="/jobs/${c.slug}" class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">${esc(c.label)}</a>`
    )
    .join('');

  return `
      <header class="relative isolate w-full overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-[#0F172A] px-4 sm:px-6 lg:px-10 xl:px-16 pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-16 sm:pb-20 md:pb-24 lg:pb-28 text-white">
        <div class="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 h-64 w-[28rem] sm:h-80 sm:w-[40rem] rounded-full bg-cyan-500/10 blur-[110px]"></div>
        <div class="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <div class="mb-7 sm:mb-8 inline-flex max-w-[94%] items-center rounded-full border border-cyan-400/25 bg-white/[0.07] px-4 py-2 sm:px-5 sm:py-2.5">
            <span class="text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide text-slate-200">Discover <span class="font-extrabold text-cyan-300">fresh opportunities</span> from growing companies</span>
          </div>
          <div class="mx-auto w-full max-w-5xl px-2 sm:px-4">
            <h1 class="mx-auto max-w-4xl text-4xl font-black leading-[1.08] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your Next Job with
              <span class="mt-1 block bg-linear-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text pb-1 text-transparent">RafflesJobs</span>
            </h1>
            <p class="mx-auto mt-5 max-w-2xl px-2 text-sm font-normal leading-6 text-slate-300/90 sm:mt-6 sm:text-base sm:leading-7 md:text-lg">
              Explore BPO, sales, warehouse, support and other job opportunities from employers. Search live openings, compare locations and salaries, and apply online — free for job seekers.
            </p>
          </div>
          <nav class="mt-8 flex flex-wrap items-center justify-center gap-3" aria-label="Job categories">
            ${pills}
            <a href="/jobs" class="rounded-full bg-[#2563EB] px-5 py-2 text-sm font-bold text-white hover:bg-[#1D4ED8]">View All Jobs</a>
          </nav>
        </div>
      </header>
      ${renderJobListSection(formattedJobs, { heading: 'Latest Job Openings', limit: 9 })}`;
}

function renderJobsBody(formattedJobs, categoryCounts = {}) {
  const activeCategories = JOB_CATEGORIES.filter((c) => (categoryCounts[c.name] || 0) > 0);
  const chips = (activeCategories.length > 0 ? activeCategories : JOB_CATEGORIES.slice(0, 4)).map(
    (c) =>
      `<a href="/jobs/${c.slug}" class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200">${esc(c.label)}</a>`
  ).join('');

  return `
      <div class="min-h-screen bg-[#F8FAFC] text-[#1e293b] pt-20 pb-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
          <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4">
            <div class="border-b border-gray-100 pb-3">
              <h1 class="text-lg sm:text-xl font-extrabold text-[#1e293b]">Find Jobs</h1>
              <p class="text-xs text-gray-500 font-medium">Search live job openings by title, company, skill, category, or location</p>
            </div>
            <div class="flex flex-wrap gap-2">
              ${chips}
            </div>
          </div>
        </div>
        ${renderJobListSection(formattedJobs, { heading: 'Live Job Openings', limit: 80 })}
      </div>`;
}

function renderCategoryBody(category, formattedJobs) {
  const indexable = formattedJobs.length >= 2;
  return `
      <div class="min-h-screen bg-[#F8FAFC] pt-24 pb-20 text-[#1e293b]">
        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          ${renderBreadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Jobs', path: '/jobs' },
            { name: category.label },
          ])}
          <header class="mt-6 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
            <h1 class="text-2xl sm:text-3xl font-black text-[#0F172A]">${esc(category.label)}</h1>
            <p class="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
              Browse current ${esc(category.label.toLowerCase())} posted on RafflesJobs. Every listing is from a real employer posting — filter by location and experience, then apply online for free.
            </p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#2B2A8C]">
              <a href="/jobs" class="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 hover:border-blue-300">All Jobs</a>
              <span class="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-600">${formattedJobs.length} Live Opening${formattedJobs.length === 1 ? '' : 's'}</span>
            </div>
          </header>
          <div class="mt-6 space-y-4">
            ${formattedJobs
              .map(
                (job) => `
            <article class="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
              <div class="flex flex-wrap items-center gap-3 text-sm">
                <span class="font-semibold text-gray-700">${esc(job.company)}</span>
                <span class="text-gray-500">${esc(job.location)}</span>
                <span class="text-gray-500">${esc(job.jobType)}</span>
              </div>
              <div class="mt-3">
                <a href="${esc(jobPath(job.slug))}" class="text-lg font-bold text-[#1e293b] hover:text-[#2B2A8C]">${esc(job.title)}</a>
                <p class="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">${esc(
                  cleanJobDescription(job.description) || job.description || ''
                )}</p>
              </div>
              <div class="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-600">
                ${
                  job.salary && job.salary !== 'Competitive'
                    ? `<span class="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1">${esc(job.salary)}</span>`
                    : ''
                }
                <span class="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1">${esc(job.experience)}</span>
                <a href="${esc(jobPath(job.slug))}" class="ml-auto inline-flex rounded-xl bg-[#2B2A8C] px-4 py-2 text-xs font-bold text-white hover:bg-[#1E1D66]">View &amp; Apply</a>
              </div>
            </article>`
              )
              .join('')}
          </div>
          <div class="mt-8 text-center">
            <a href="/jobs" class="inline-flex rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">Browse all jobs</a>
          </div>
          ${
            !indexable
              ? `<p class="mt-6 text-center text-xs text-slate-400">This category page is not listed in the sitemap until it has more live openings.</p>`
              : ''
          }
        </div>
      </div>`;
}

function renderJobBody(job) {
  const category = JOB_CATEGORIES.find((c) => c.name === job.category);
  const categoryHref = category ? `/jobs/${category.slug}` : '/jobs';
  const posted = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const chips = [
    job.jobType,
    job.location,
    job.salary,
    job.experienceYears,
    job.minEducation,
    job.numberOfOpenings ? `${job.numberOfOpenings} Openings` : '',
    Array.isArray(job.preferredLanguages) && job.preferredLanguages.length
      ? job.preferredLanguages.join(' · ')
      : '',
  ].filter(Boolean);

  return `
      <div class="min-h-screen bg-[#F8FAFC] pt-24 pb-20 text-[#1e293b]">
        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          ${renderBreadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Jobs', path: '/jobs' },
            ...(category ? [{ name: job.category, path: categoryHref }] : []),
            { name: job.title },
          ])}
          <div class="mt-6 grid gap-6 lg:grid-cols-3 items-start">
            <article class="lg:col-span-2 space-y-6">
              <header class="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
                <div class="flex items-start gap-4">
                  <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-base font-extrabold text-white">
                    <span>${esc(job.company ? job.company.substring(0, 2).toUpperCase() : 'JP')}</span>
                  </div>
                  <div class="min-w-0">
                    <h1 class="text-2xl sm:text-3xl font-black leading-tight text-[#0F172A]">${esc(job.title)}</h1>
                    <div class="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-600">
                      <span>${esc(job.company)}</span>
                      ${
                        job.category
                          ? `<a href="${esc(categoryHref)}" class="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#2B2A8C]">${esc(job.category)}</a>`
                          : ''
                      }
                    </div>
                  </div>
                </div>
                <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-600">
                  ${chips.map((chip) => `<span class="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1">${esc(chip)}</span>`).join('')}
                  ${posted ? `<span class="ml-auto text-[11px] font-medium text-slate-400">Posted ${esc(posted)}</span>` : ''}
                </div>
                <div class="mt-5 flex flex-wrap gap-3">
                  <a href="/jobs?jobId=${esc(String(job._id || job.id || ''))}" class="inline-flex items-center gap-2 rounded-xl bg-[#2B2A8C] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#1E1D66]">Apply Now</a>
                  <a href="${esc(categoryHref)}" class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">More ${esc(job.category || 'related')} jobs</a>
                </div>
              </header>

              <section class="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
                <h2 class="text-lg font-extrabold text-[#0F172A]">Job Description</h2>
                <p class="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">${esc(
                  cleanJobDescription(job.description) || job.description || ''
                )}</p>
                ${
                  Array.isArray(job.requirements) && job.requirements.length
                    ? `<h3 class="mt-6 text-base font-bold text-[#0F172A]">Requirements</h3>
                <ul class="mt-3 space-y-2">
                  ${job.requirements.map((r) => `<li class="text-sm text-gray-600">- ${esc(r)}</li>`).join('')}
                </ul>`
                    : ''
                }
                ${
                  Array.isArray(job.benefits) && job.benefits.length
                    ? `<h3 class="mt-6 text-base font-bold text-[#0F172A]">Benefits</h3>
                <ul class="mt-3 space-y-2">
                  ${job.benefits.map((b) => `<li class="text-sm text-gray-600">- ${esc(b)}</li>`).join('')}
                </ul>`
                    : ''
                }
                ${
                  job.aboutCompany
                    ? `<h3 class="mt-6 text-base font-bold text-[#0F172A]">About the Company</h3>
                <p class="mt-3 text-sm leading-7 text-gray-600">${esc(job.aboutCompany)}</p>`
                    : ''
                }
                ${
                  Array.isArray(job.skills) && job.skills.length
                    ? `<div class="mt-6 flex flex-wrap gap-2">
                  ${job.skills.map((s) => `<span class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-gray-700">${esc(s)}</span>`).join('')}
                </div>`
                    : ''
                }
              </section>
            </article>

            <aside class="space-y-6">
              <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                <h2 class="text-base font-extrabold text-[#0F172A]">Job Overview</h2>
                <dl class="mt-4 space-y-3 text-sm">
                  <div class="flex justify-between gap-3"><dt class="text-gray-500">Company</dt><dd class="text-right font-semibold text-gray-800">${esc(job.company)}</dd></div>
                  <div class="flex justify-between gap-3"><dt class="text-gray-500">Location</dt><dd class="text-right font-semibold text-gray-800">${esc(job.location)}</dd></div>
                  <div class="flex justify-between gap-3"><dt class="text-gray-500">Job Type</dt><dd class="text-right font-semibold text-gray-800">${esc(job.jobType)}</dd></div>
                  ${job.salary ? `<div class="flex justify-between gap-3"><dt class="text-gray-500">Salary</dt><dd class="text-right font-semibold text-gray-800">${esc(job.salary)}</dd></div>` : ''}
                  <div class="flex justify-between gap-3"><dt class="text-gray-500">Experience</dt><dd class="text-right font-semibold text-gray-800">${esc(job.experienceYears || job.experienceLevel || '')}</dd></div>
                  ${job.minEducation ? `<div class="flex justify-between gap-3"><dt class="text-gray-500">Education</dt><dd class="text-right font-semibold text-gray-800">${esc(job.minEducation)}</dd></div>` : ''}
                </dl>
                <a href="/jobs?jobId=${esc(String(job._id || job.id || ''))}" class="mt-5 flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#1D4ED8]">Apply for this Job</a>
              </div>
              <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                <h2 class="text-base font-extrabold text-[#0F172A]">Similar Jobs</h2>
                <div class="mt-4 flex flex-col gap-2">
                  <a href="${esc(categoryHref)}" class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-[#2B2A8C] hover:border-blue-300 hover:bg-blue-50">Browse ${esc(job.category || 'all')} jobs</a>
                  <a href="/jobs" class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">Browse all jobs</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>`;
}


function renderAboutBody() {
  return `
      <div class="min-h-screen bg-[#F8FAFC] px-4 pt-24 pb-20 text-[#1e293b]">
        <div class="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 shadow-xs">
          <h1 class="text-3xl sm:text-4xl font-black text-[#0F172A]">About RafflesJobs</h1>
          <p class="mt-4 text-base leading-7 text-gray-600">
            RafflesJobs is a premier job discovery portal in India connecting job seekers with leading employers across Tamil Nadu, Karnataka, and nationwide.
            Our platform provides verified listings across high-volume recruitment areas including Sales, BPO, Field Sales, Telesales, Telecalling, Customer Support, and Warehouse management.
          </p>
          <div class="mt-8 grid gap-6 sm:grid-cols-2">
            <div class="rounded-xl border border-gray-100 bg-slate-50 p-5">
              <h2 class="text-lg font-bold text-[#0F172A]">Our Mission</h2>
              <p class="mt-2 text-sm leading-6 text-gray-600">
                To simplify frontline and high-volume talent acquisition by making legitimate, verified job opportunities easily accessible to every candidate.
              </p>
            </div>
            <div class="rounded-xl border border-gray-100 bg-slate-50 p-5">
              <h2 class="text-lg font-bold text-[#0F172A]">Direct Connections</h2>
              <p class="mt-2 text-sm leading-6 text-gray-600">
                Direct employer connections without spam, fake listings, or hidden fees. We verify employer profiles to ensure safe career moves.
              </p>
            </div>
          </div>
          <div class="mt-8 border-t border-gray-100 pt-6">
            <a href="/jobs" class="inline-flex rounded-xl bg-[#2B2A8C] px-6 py-3 text-sm font-bold text-white hover:bg-[#1E1D66]">Explore Open Jobs</a>
          </div>
        </div>
      </div>`;
}

function renderContactBody() {
  return `
      <div class="min-h-screen bg-[#F8FAFC] px-4 pt-24 pb-20 text-[#1e293b]">
        <div class="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 shadow-xs">
          <h1 class="text-3xl sm:text-4xl font-black text-[#0F172A]">Contact RafflesJobs</h1>
          <p class="mt-4 text-base leading-7 text-gray-600">
            Have questions about candidate applications or employer hiring? Reach out to our recruitment and support team.
          </p>
          <div class="mt-8 grid gap-6 sm:grid-cols-2">
            <div class="rounded-xl border border-gray-100 bg-slate-50 p-5">
              <h2 class="text-base font-bold text-[#0F172A]">Office Address</h2>
              <p class="mt-2 text-sm leading-6 text-gray-600">
                24, Pavalam St, Veerappanchatram<br>
                Erode, Tamil Nadu, India
              </p>
            </div>
            <div class="rounded-xl border border-gray-100 bg-slate-50 p-5">
              <h2 class="text-base font-bold text-[#0F172A]">Direct Support</h2>
              <p class="mt-2 text-sm leading-6 text-gray-600">
                Email: <a href="mailto:hr@rafflesconsulting.in" class="text-[#2563EB] hover:underline">hr@rafflesconsulting.in</a><br>
                Phone: <a href="tel:+917397242159" class="text-[#2563EB] hover:underline">+91 73972 42159</a>
              </p>
            </div>
          </div>
          <div class="mt-8 border-t border-gray-100 pt-6">
            <a href="/jobs" class="inline-flex rounded-xl bg-[#2B2A8C] px-6 py-3 text-sm font-bold text-white hover:bg-[#1E1D66]">Browse Active Jobs</a>
          </div>
        </div>
      </div>`;
}

function renderPricingBody() {
  return `
      <div class="min-h-screen bg-[#F8FAFC] px-4 pt-24 pb-20 text-[#1e293b]">
        <div class="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 shadow-xs">
          <h1 class="text-3xl sm:text-4xl font-black text-[#0F172A]">Employer Hiring Plans</h1>
          <p class="mt-4 text-base leading-7 text-gray-600">
            Transparent and flexible recruitment plans for hiring partners. Post jobs, review verified applicants, and scale frontline hiring.
          </p>
          <div class="mt-8 grid gap-6 sm:grid-cols-2">
            <div class="rounded-xl border border-blue-200 bg-blue-50/40 p-6">
              <h2 class="text-xl font-bold text-[#0F172A]">Standard Employer</h2>
              <p class="mt-1 text-sm font-semibold text-blue-700">Get Started Free</p>
              <ul class="mt-4 space-y-2 text-sm text-gray-600">
                <li>✓ Direct applicant management</li>
                <li>✓ High-visibility job listing</li>
                <li>✓ Verified hiring partner badge</li>
              </ul>
              <div class="mt-6">
                <a href="/get-started" class="inline-flex rounded-xl bg-[#2B2A8C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1E1D66]">Register as Employer</a>
              </div>
            </div>
            <div class="rounded-xl border border-gray-100 bg-slate-50 p-6">
              <h2 class="text-xl font-bold text-[#0F172A]">High-Volume Hiring</h2>
              <p class="mt-1 text-sm font-semibold text-gray-500">Custom Recruitment</p>
              <p class="mt-4 text-sm leading-6 text-gray-600">
                For enterprise recruiters hiring 50+ candidates in BPO, Sales, or Logistics. Dedicated recruitment coordinator and customized screenings.
              </p>
              <div class="mt-6">
                <a href="/contact" class="inline-flex rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">Contact Enterprise Sales</a>
              </div>
            </div>
          </div>
        </div>
      </div>`;
}

function renderPrivacyBody() {
  return `
      <div class="min-h-screen bg-[#F8FAFC] px-4 pt-24 pb-20 text-[#1e293b]">
        <div class="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 shadow-xs">
          <h1 class="text-3xl sm:text-4xl font-black text-[#0F172A]">Privacy Policy</h1>
          <p class="mt-2 text-xs font-semibold text-gray-400">Last updated: 2026</p>
          <div class="mt-6 space-y-6 text-sm leading-7 text-gray-600">
            <section>
              <h2 class="text-base font-bold text-[#0F172A]">1. Information We Collect</h2>
              <p>We collect candidate contact information (name, email, phone number, resume) and employer business details solely for employment matching purposes.</p>
            </section>
            <section>
              <h2 class="text-base font-bold text-[#0F172A]">2. Use of Information</h2>
              <p>Your data is used to process job applications, facilitate communication between candidates and verified hiring partners, and maintain account security.</p>
            </section>
            <section>
              <h2 class="text-base font-bold text-[#0F172A]">3. Data Protection</h2>
              <p>We implement strict security standards to protect personal data against unauthorized access, loss, or disclosure. For inquiries, email hr@rafflesconsulting.in.</p>
            </section>
          </div>
        </div>
      </div>`;
}

function renderNotFoundBody() {
  return `
      <div class="min-h-screen bg-[#F8FAFC] px-4 pt-28 pb-20 text-[#1e293b]">
        <div class="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xs">
          <p class="text-sm font-bold uppercase tracking-widest text-[#2B2A8C]">Error 404</p>
          <h1 class="mt-3 text-3xl font-black text-[#0F172A]">Page not found</h1>
          <p class="mt-4 text-sm leading-7 text-gray-500">
            The page you are trying to open does not exist. It may have been moved,
            or the job listing may have been filled and removed.
          </p>
          <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href="/" class="inline-flex items-center justify-center rounded-xl bg-[#2B2A8C] px-6 py-3 text-sm font-bold text-white hover:bg-[#1E1D66]">Go to Homepage</a>
            <a href="/jobs" class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">Browse Jobs</a>
          </div>
        </div>
      </div>`;
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

function isoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function buildSitemap({ indexableCategories, jobs }) {
  const urls = [];

  for (const route of INDEXABLE_ROUTES) {
    urls.push(`<url><loc>${esc(canonicalUrl(route))}</loc></url>`);
  }

  for (const category of indexableCategories) {
    const loc = absoluteUrl(`/jobs/${category.slug}`);
    urls.push(`<url><loc>${esc(loc)}</loc></url>`);
  }

  for (const job of jobs) {
    if (!job.slug) continue;
    const lastmod = isoDate(job.updatedAt || job.createdAt);
    urls.push(
      `<url><loc>${esc(absoluteUrl(jobPath(job.slug)))}</loc>${
        lastmod ? `<lastmod>${lastmod}</lastmod>` : ''
      }</url>`
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>
`;
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export default function rafflesPrerenderPlugin() {
  let outDir = 'dist';
  let root = process.cwd();

  return {
    name: 'raffles-prerender',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
      root = config.root;
    },
    async closeBundle() {
      const distDir = path.resolve(root, outDir);
      const templatePath = path.join(distDir, 'index.html');

      let template;
      try {
        template = await fs.readFile(templatePath, 'utf8');
      } catch (err) {
        throw new Error(`[raffles-prerender] missing build output ${templatePath}: ${err.message}`);
      }

      // ---- data ----------------------------------------------------------
      let jobs = [];
      try {
        jobs = assignSlugs(await fetchActiveJobs());
        console.log(`[raffles-prerender] loaded ${jobs.length} active job(s) from ${API_BASE}`);
      } catch (err) {
        console.warn(
          `[raffles-prerender] could not load jobs (${err.message}) — emitting route shells only`
        );
      }

      const formatted = jobs.map((job) => formatBackendJob(job));
      const categories = JOB_CATEGORIES.map((category) => ({
        ...category,
        jobs: jobs.filter((job) => job.category === category.name),
      }));
      const categoryCounts = categories.reduce((acc, category) => {
        acc[category.name] = category.jobs.length;
        return acc;
      }, {});
      const indexableCategories = categories.filter((c) => c.jobs.length >= 2);

      const baseJsonLd = [organizationSchema(), websiteSchema()].filter(Boolean);

      // ---- route shells --------------------------------------------------
      const staticBody = {
        '/': () => renderHomeBody(formatted, categoryCounts),
        '/jobs': () => renderJobsBody(formatted, categoryCounts),
        '/about': () => renderAboutBody(),
        '/contact': () => renderContactBody(),
        '/pricing': () => renderPricingBody(),
        '/privacy': () => renderPrivacyBody(),
      };

      const written = [];

      for (const route of SHELL_ROUTES) {
        const meta = ROUTE_META[route] || {};
        const canonical = canonicalUrl(meta.canonicalOverride || route);
        const body = staticBody[route] ? staticBody[route]() : '';
        const jsonLd = [...baseJsonLd];

        if (meta.breadcrumb) {
          const crumb = breadcrumbSchema(meta.breadcrumb);
          if (crumb) jsonLd.push(crumb);
        }

        const html = withInlineScript(
          withBody(
            applyHead(template, {
              title: meta.title || DEFAULT_TITLE,
              description: meta.description || DEFAULT_DESCRIPTION,
              canonical,
              noindex: Boolean(meta.noindex),
              jsonLd,
            }),
            body
          ),
          ''
        );

        await writeFile(routeToFile(distDir, route), html);
        written.push(route);
      }

      // ---- category landing pages ---------------------------------------
      for (const category of categories) {
        const route = `/jobs/${category.slug}`;
        const list = category.jobs;
        // Do not generate pages for categories without active job inventory
        if (list.length === 0) continue;
        const indexable = list.length >= 2;
        const formatted = list.map((job) => formatBackendJob(job));
        const body = renderCategoryBody(category, formatted);
        const jsonLd = [
          ...baseJsonLd,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Jobs', path: '/jobs' },
            { name: category.label },
          ]),
          jobItemListSchema(formatted, {
            name: `${category.label} on RafflesJobs`,
            url: absoluteUrl(route),
          }),
        ].filter(Boolean);

        const html = withInlineScript(
          withBody(
            applyHead(template, {
              title: `${category.label} – Apply Online | RafflesJobs`,
              description: `Browse ${list.length > 0 ? list.length : 'current'} live ${category.label.toLowerCase()} on RafflesJobs. Filter openings by location and experience, then apply online for free.`,
              canonical: canonicalUrl(route),
              noindex: !indexable,
              jsonLd,
            }),
            body
          ),
          `window.__RAFFLES_CATEGORY__=${toJson({
            slug: category.slug,
            jobs: formatted,
          })};`
        );

        await writeFile(routeToFile(distDir, route), html);
        written.push(route);
      }

      // ---- individual job pages -----------------------------------------
      for (const job of jobs) {
        const route = jobPath(job.slug);
        const jsonLd = [
          ...baseJsonLd,
          jobPostingSchema(job, { url: absoluteUrl(route) }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Jobs', path: '/jobs' },
            ...(job.category
              ? [
                  {
                    name: job.category,
                    path: categories.find((c) => c.name === job.category)
                      ? `/jobs/${categories.find((c) => c.name === job.category).slug}`
                      : '/jobs',
                  },
                ]
              : []),
            { name: job.title },
          ]),
        ].filter(Boolean);

        const html = withInlineScript(
          withBody(
            applyHead(template, {
              title: buildJobTitle(job),
              description: buildJobDescription(job) || DEFAULT_DESCRIPTION,
              canonical: canonicalUrl(route),
              noindex: false,
              jsonLd,
            }),
            renderJobBody(job)
          ),
          `window.__RAFFLES_JOB__=${toJson({ ...job, slug: job.slug })};`
        );

        await writeFile(routeToFile(distDir, route), html);
        written.push(route);
      }

      // ---- 404 ------------------------------------------------------------
      const notFoundHtml = withBody(
        applyHead(template, {
          title: 'Page Not Found | RafflesJobs',
          description: 'The page you are looking for does not exist on RafflesJobs.',
          canonical: null,
          noindex: true,
          jsonLd: baseJsonLd,
        }),
        renderNotFoundBody()
      );
      await writeFile(path.join(distDir, '404.html'), notFoundHtml);

      // ---- sitemap --------------------------------------------------------
      const sitemap = buildSitemap({ indexableCategories, jobs });
      await writeFile(path.join(distDir, 'sitemap.xml'), sitemap);

      // ---- validation: every route in SHELL_ROUTES must exist -------------
      const missing = [];
      for (const route of SHELL_ROUTES) {
        try {
          await fs.access(routeToFile(distDir, route));
        } catch {
          missing.push(route);
        }
      }
      if (missing.length > 0) {
        throw new Error(
          `[raffles-prerender] prerendered files missing for routes: ${missing.join(', ')}`
        );
      }

      // Sanity checks on the homepage shell (the page Google ranks first).
      const homeHtml = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
      if (!homeHtml.includes('rel="canonical"') || !homeHtml.includes('<title>')) {
        throw new Error('[raffles-prerender] index.html is missing canonical/title tags');
      }
      if (homeHtml.includes('seo:jsonld')) {
        throw new Error('[raffles-prerender] JSON-LD placeholder was not replaced');
      }

      console.log(
        `[raffles-prerender] wrote ${written.length} route page(s), ${
          jobs.length
        } job page(s), 404.html and sitemap.xml`
      );
    },
  };
}
