import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  GraduationCap,
  Users,
  Languages,
  Clock,
  ArrowLeft,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import useSeo from '../Utils/useSeo';
import {
  jobPath,
  categoryPath,
  absoluteUrl,
} from '../Utils/seoConfig';
import {
  jobPostingSchema,
  breadcrumbSchema,
} from '../Utils/seoSchema';
import { fetchJobBySlug } from '../Service/Operation/jobApi';
import { showSuccess } from '../Utils/toast';

export default function JobDetailPage({ slug }) {
  const params = useParams();
  const activeSlug = slug || params.slug;
  const [job, setJob] = useState(() => {
    const seed = typeof window !== 'undefined' ? window.__RAFFLES_JOB__ : null;
    return seed && seed.slug === activeSlug ? seed : null;
  });
  const [loading, setLoading] = useState(!job);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetchJobBySlug(activeSlug);
        if (cancelled) return;
        if (res && res.success && res.job) {
          setJob(res.job);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [activeSlug]);

  const isClosed = Boolean(
    job && (
      job.status === 'closed' ||
      job.isExpired
    )
  );
  const jobUrl = absoluteUrl(jobPath(activeSlug));
  const categoryLink = job ? categoryPath(job.category) : null;

  const jsonLd = [];
  if (job && !isClosed) {
    const posting = jobPostingSchema(job, { url: jobUrl });
    if (posting) jsonLd.push(posting);
    jsonLd.push(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Jobs', path: '/jobs' },
        ...(job.category ? [{ name: job.category, path: categoryLink || '/jobs' }] : []),
        { name: job.title },
      ])
    );
  }

  const buildTitle = (j) => {
    if (!j) return 'Job Details | RafflesJobs';
    const locs = Array.isArray(j.locations) && j.locations.length > 0
      ? j.locations
      : (j.location ? j.location.split(/[|,]/).map((s) => s.trim()).filter(Boolean) : []);
    const companyPart = j.company ? ` | ${j.company}` : '';
    if (locs.length >= 3) {
      return `${j.title} Jobs${companyPart} | RafflesJobs`;
    }
    const locStr = locs.length > 0 ? ` in ${locs.join(', ')}` : '';
    return `${j.title} Job${locStr}${companyPart} | RafflesJobs`;
  };

  const buildDescription = (j) => {
    if (!j) return undefined;
    const companyPart = j.company ? ` at ${j.company}` : '';
    const locs = Array.isArray(j.locations) && j.locations.length > 0
      ? (j.locations.length >= 3 ? ` across multiple locations (${j.locations.slice(0, 3).join(', ')} & more)` : ` in ${j.locations.join(', ')}`)
      : (j.location ? ` in ${j.location}` : '');

    const details = [];
    if (j.salary) details.push('salary');
    if (j.experienceYears || j.experienceLevel) details.push('experience');
    if (j.minEducation) details.push('eligibility');
    if (Array.isArray(j.preferredLanguages) && j.preferredLanguages.length > 0) details.push('languages');
    if (j.shift) details.push('shift');
    if (Array.isArray(j.skills) && j.skills.length > 0) details.push('skills');
    details.push('job responsibilities');

    return `Apply for ${j.title}${companyPart}${locs}. View ${details.join(', ')} and application details on RafflesJobs.`;
  };

  useSeo({
    path: '/jobs',
    title: buildTitle(job),
    description: buildDescription(job),
    canonicalOverride: jobPath(activeSlug),
    noindex: !job || isClosed,
    jsonLd,
  });

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${jobPath(activeSlug)}`;
    if (navigator.share) {
      navigator
        .share({
          title: job ? `${job.title} at ${job.company}` : 'Job on RafflesJobs',
          url: shareUrl,
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            navigator.clipboard?.writeText(shareUrl);
            showSuccess('Job link copied to clipboard!');
          }
        });
    } else {
      navigator.clipboard?.writeText(shareUrl);
      showSuccess('Job link copied to clipboard!');
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xs">
          <h1 className="text-2xl font-extrabold text-[#1e293b]">Job not found</h1>
          <p className="mt-3 text-sm text-gray-500">
            This job listing may have been removed or the link is incorrect.
          </p>
          <Link
            to="/jobs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2B2A8C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1E1D66]"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse all jobs
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !job) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4">
        <div className="mx-auto h-96 max-w-4xl animate-pulse rounded-2xl border border-gray-100 bg-white" />
      </div>
    );
  }

  if (!job) return null;

  const hasMultipleLocations = Array.isArray(job.locations) && job.locations.length > 1;

  const metaChips = [
    job.employmentRole && { icon: Briefcase, label: job.employmentRole },
    job.jobType && { icon: Briefcase, label: job.jobType },
    !hasMultipleLocations && job.location && { icon: MapPin, label: job.location },
    hasMultipleLocations && { icon: MapPin, label: `${job.locations.length} Locations` },
    job.salary && { icon: IndianRupee, label: job.salary },
    job.incentives && { icon: IndianRupee, label: `+ Incentives: ${job.incentives}` },
    job.experienceYears && { icon: Clock, label: job.experienceYears },
    job.minEducation && { icon: GraduationCap, label: job.minEducation },
    job.numberOfOpenings != null && { icon: Users, label: `${job.numberOfOpenings} Openings` },
    job.shift && { icon: Clock, label: `Shift: ${job.shift}` },
    job.weekOff && { icon: Clock, label: `Off: ${job.weekOff}` },
    job.preferredLanguages?.length && {
      icon: Languages,
      label: job.preferredLanguages.join(' · '),
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 text-[#1e293b]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
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
            {categoryLink && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to={categoryLink} className="hover:text-[#2B2A8C]">
                    {job.category}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li className="text-gray-700">{job.title}</li>
          </ol>
        </nav>

        {isClosed && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            This job is no longer accepting applications. Browse similar live
            openings on our <Link to="/jobs" className="underline font-bold">jobs page</Link>.
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-3 items-start">
          {/* Main column */}
          <article className="lg:col-span-2 space-y-6">
            <header className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-base font-extrabold text-white">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={`${job.company} logo`}
                      className="h-full w-full bg-white object-cover"
                    />
                  ) : (
                    <span>{job.company ? job.company.substring(0, 2).toUpperCase() : 'JP'}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-black leading-tight text-[#0F172A]">
                    {job.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-600">
                    <span className="inline-flex items-center gap-1.5 font-bold text-gray-800">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      {job.company}
                    </span>
                    {job.employmentRole && (
                      <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {job.employmentRole}
                      </span>
                    )}
                    {job.category && (
                      <Link
                        to={categoryLink || '/jobs'}
                        className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#2B2A8C] hover:border-blue-300"
                      >
                        {job.category}
                      </Link>
                    )}
                  </div>

                  {hasMultipleLocations && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#2B2A8C]" /> Hiring Locations:
                      </span>
                      {job.locations.map((loc) => (
                        <span
                          key={loc}
                          className="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#2B2A8C]"
                        >
                          {loc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-600">
                {metaChips.map((chip, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1"
                  >
                    <chip.icon className="h-3.5 w-3.5 text-[#2B2A8C]" />
                    {chip.label}
                  </span>
                ))}
                {job.createdAt && !isNaN(new Date(job.createdAt).getTime()) && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <Clock className="h-3 w-3" />
                    Posted {new Date(job.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {!isClosed && (
                  <Link
                    to={`/jobs?jobId=${job._id || job.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2B2A8C] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1E1D66]"
                  >
                    Apply Now
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <Link
                  to={categoryLink || '/jobs'}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  More {job.category || 'related'} jobs
                </Link>
              </div>
            </header>

            <section className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-extrabold text-[#0F172A]">Job Description</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                {job.cleanDescription || job.description}
              </p>

              {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                <>
                  <h3 className="mt-6 text-base font-bold text-[#0F172A]">Requirements</h3>
                  <ul className="mt-3 space-y-2">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                <>
                  <h3 className="mt-6 text-base font-bold text-[#0F172A]">Benefits & Perks</h3>
                  <ul className="mt-3 space-y-2">
                    {job.benefits.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Distinct Compensation breakdown */}
              {(job.incentives || job.allowances) && (
                <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <h3 className="text-sm font-extrabold text-[#0F172A]">Compensation Details</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    {job.salary && (
                      <div><span className="font-semibold text-gray-900">Fixed / Base:</span> {job.salary}</div>
                    )}
                    {job.incentives && (
                      <div><span className="font-semibold text-emerald-700">Incentives:</span> {job.incentives}</div>
                    )}
                    {job.allowances && (
                      <div><span className="font-semibold text-blue-700">Allowances:</span> {job.allowances}</div>
                    )}
                  </div>
                </div>
              )}

              {job.aboutCompany && (
                <>
                  <h3 className="mt-6 text-base font-bold text-[#0F172A]">About {job.company}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{job.aboutCompany}</p>
                </>
              )}

              {Array.isArray(job.skills) && job.skills.length > 0 && (
                <>
                  <h3 className="mt-6 text-base font-bold text-[#0F172A]">Skills & Domains</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </section>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
              <h2 className="text-base font-extrabold text-[#0F172A]">Job Overview</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-500">Company</dt>
                  <dd className="text-right font-semibold text-gray-800">{job.company}</dd>
                </div>
                {job.employmentRole && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Role Type</dt>
                    <dd className="text-right font-semibold text-gray-800">{job.employmentRole}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-500">Location</dt>
                  <dd className="text-right font-semibold text-gray-800">
                    {hasMultipleLocations ? `${job.locations.length} Locations` : job.location}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-500">Job Type</dt>
                  <dd className="text-right font-semibold text-gray-800">{job.jobType}</dd>
                </div>
                {job.salary && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Salary</dt>
                    <dd className="text-right font-semibold text-gray-800">{job.salary}</dd>
                  </div>
                )}
                {job.incentives && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Incentives</dt>
                    <dd className="text-right font-semibold text-emerald-700">{job.incentives}</dd>
                  </div>
                )}
                {job.allowances && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Allowances</dt>
                    <dd className="text-right font-semibold text-blue-700">{job.allowances}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-500">Experience</dt>
                  <dd className="text-right font-semibold text-gray-800">
                    {job.experienceYears || job.experienceLevel}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-500">Education</dt>
                  <dd className="text-right font-semibold text-gray-800">{job.minEducation}</dd>
                </div>
                {job.shift && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Shift</dt>
                    <dd className="text-right font-semibold text-gray-800">{job.shift}</dd>
                  </div>
                )}
                {job.weekOff && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Week Off</dt>
                    <dd className="text-right font-semibold text-gray-800">{job.weekOff}</dd>
                  </div>
                )}
                {job.numberOfOpenings != null && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Openings</dt>
                    <dd className="text-right font-semibold text-gray-800">{job.numberOfOpenings}</dd>
                  </div>
                )}
                {job.expiresAt && !isNaN(new Date(job.expiresAt).getTime()) && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Deadline</dt>
                    <dd className="text-right font-semibold text-rose-700">
                      {new Date(job.expiresAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </dd>
                  </div>
                )}
              </dl>

              {!isClosed && (
                <Link
                  to={`/jobs?jobId=${job._id || job.id}`}
                  className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#1D4ED8]"
                >
                  Apply for this Job
                </Link>
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
              <h2 className="text-base font-extrabold text-[#0F172A]">Similar Jobs</h2>
              <p className="mt-2 text-sm text-gray-500">
                Looking for more roles like this one?
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to={categoryLink || '/jobs'}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-[#2B2A8C] transition hover:border-blue-300 hover:bg-blue-50"
                >
                  Browse {job.category || 'all'} jobs
                </Link>
                <Link
                  to="/jobs"
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Browse all jobs
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
