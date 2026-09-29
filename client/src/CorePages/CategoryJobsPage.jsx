import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Building2, Clock, IndianRupee, RefreshCw } from 'lucide-react';
import useSeo from '../Utils/useSeo';
import { jobPath, absoluteUrl } from '../Utils/seoConfig';
import { breadcrumbSchema, jobItemListSchema } from '../Utils/seoSchema';
import { fetchAllJobs, formatBackendJob } from '../Service/Operation/jobApi';

// Google indexes thin category pages only when they list a real number of jobs.
const MIN_JOBS_TO_INDEX = 2;

export default function CategoryJobsPage({ category }) {
  // Remount per category. The job list and loading flag belong to one slug:
  // without this key, navigating /jobs/bpo → /jobs/sales reused the mounted
  // component, so the previous category's jobs stayed on screen with
  // loading === false until (unless) the new fetch resolved.
  return <CategoryJobsContent key={category.slug} category={category} />;
}

function CategoryJobsContent({ category }) {
  const seed =
    typeof window !== 'undefined' &&
    window.__RAFFLES_CATEGORY__ &&
    window.__RAFFLES_CATEGORY__.slug === category.slug
      ? window.__RAFFLES_CATEGORY__
      : null;

  const [jobs, setJobs] = useState(seed ? seed.jobs : []);
  const [loading, setLoading] = useState(!seed);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetchAllJobs({ category: category.name });
        if (cancelled) return;
        if (res && res.success && Array.isArray(res.jobs)) {
          setJobs(res.jobs.map(formatBackendJob));
          setFailed(false);
        } else if (!seed) {
          setJobs([]);
          setFailed(true);
        }
      } catch {
        if (!cancelled && !seed) {
          setJobs([]);
          setFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [category.name, seed, attempt]);

  const pageUrl = absoluteUrl(`/jobs/${category.slug}`);
  const indexable = jobs.length >= MIN_JOBS_TO_INDEX;

  const jsonLd = [
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Jobs', path: '/jobs' },
      { name: category.label },
    ]),
    jobItemListSchema(jobs, { name: `${category.label} on RafflesJobs`, url: pageUrl }),
  ];

  useSeo({
    path: '/jobs',
    title: `${category.label} – Apply Online | RafflesJobs`,
    description: `Browse ${jobs.length > 0 ? jobs.length : 'current'} live ${category.label.toLowerCase()} on RafflesJobs. Filter openings by location and experience, then apply online for free.`,
    canonicalOverride: `/jobs/${category.slug}`,
    noindex: !indexable,
    jsonLd,
  });

  if (!loading && failed && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xs">
          <h1 className="text-2xl font-extrabold text-[#1e293b]">
            Could not load {category.label} jobs
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Something went wrong while fetching live openings. Try again, or
            browse every current vacancy instead.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setFailed(false);
                setLoading(true);
                setAttempt((value) => value + 1);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
            <Link
              to="/jobs"
              className="rounded-xl bg-[#2B2A8C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1E1D66]"
            >
              Browse all jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xs">
          <h1 className="text-2xl font-extrabold text-[#1e293b]">
            No open {category.label} right now
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            We do not have live openings in this category at the moment. Browse
            all current vacancies instead.
          </p>
          <Link
            to="/jobs"
            className="mt-6 inline-flex rounded-xl bg-[#2B2A8C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1E1D66]"
          >
            Browse all jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 text-[#1e293b]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-4 text-xs font-semibold text-gray-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-[#2B2A8C]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/jobs" className="hover:text-[#2B2A8C]">
                Jobs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-700">{category.label}</li>
          </ol>
        </nav>

        <header className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">{category.label}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
            Browse current {category.label.toLowerCase()} posted on RafflesJobs.
            Every listing is from a real employer posting — filter by location and
            experience, then apply online for free.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#2B2A8C]">
            <Link
              to="/jobs"
              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 transition hover:border-blue-300"
            >
              All Jobs
            </Link>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-600">
              {loading ? 'Loading…' : `${jobs.length} Live Opening${jobs.length === 1 ? '' : 's'}`}
            </span>
          </div>
        </header>

        <div className="mt-6 space-y-4">
          {loading && (
            <div className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-white" />
          )}

          {!loading &&
            jobs.map((job) => {
              const link = job.slug ? jobPath(job.slug) : null;
              const heading = (
                <h2 className="text-lg font-bold text-[#1e293b] group-hover:text-[#2B2A8C] transition-colors">
                  {job.title}
                </h2>
              );

              return (
                <article
                  key={job.id || job._id}
                  className="group rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      {job.company}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-gray-500">
                      <MapPin className="h-4 w-4 text-rose-400" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-gray-500">
                      <Briefcase className="h-4 w-4 text-[#2B2A8C]" />
                      {job.jobType}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      Posted {job.postedAgo}
                    </span>
                  </div>

                  <div className="mt-3">
                    {link ? (
                      <Link to={link} className="block">
                        {heading}
                      </Link>
                    ) : (
                      heading
                    )}
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                      {job.cleanDescription || job.description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-600">
                    {job.salary && job.salary !== 'Competitive' && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1">
                        <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                        {job.salary}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1">
                      <Briefcase className="h-3.5 w-3.5 text-[#2B2A8C]" />
                      {job.experience}
                    </span>
                    {link && (
                      <Link
                        to={link}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[#2B2A8C] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1E1D66]"
                      >
                        View &amp; Apply
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
        </div>

        {!loading && (
          <div className="mt-8 text-center">
            <Link
              to="/jobs"
              className="inline-flex rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Browse all jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
