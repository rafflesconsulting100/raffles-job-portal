import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useSeo from '../Utils/useSeo';
import { Home, Briefcase } from 'lucide-react';

export default function NotFoundPage() {
  const location = useLocation();

  useSeo({
    path: location.pathname,
    title: 'Page Not Found | RafflesJobs',
    description: 'The page you are looking for does not exist on RafflesJobs.',
    noindex: true,
    canonicalOverride: location.pathname,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 pt-28 pb-20 text-[#1e293b]">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xs">
        <p className="text-sm font-bold uppercase tracking-widest text-[#2B2A8C]">Error 404</p>
        <h1 className="mt-3 text-3xl font-black text-[#0F172A]">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-gray-500">
          The page you are trying to open does not exist. It may have been moved,
          or the job listing may have been filled and removed.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B2A8C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1E1D66]"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            <Briefcase className="h-4 w-4" />
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
