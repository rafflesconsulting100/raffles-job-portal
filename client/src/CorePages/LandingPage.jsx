import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  SparklesIcon, 
  SearchIcon,
  ArrowRightIcon
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

// Subcomponents for Sections 3, 4, and 5
import TrustedPartnersSection from './LandingSections/TrustedPartnersSection';
import ActiveJobsSection from './LandingSections/ActiveJobsSection';
import HowItWorksSection from './LandingSections/HowItWorksSection';

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchSkill, setSearchSkill] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.append('q', searchTitle);
    if (searchSkill) params.append('skill', searchSkill);
    if (searchLocation) params.append('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-500 selection:text-white">
      
      {/* 1. HEADER NAVIGATION */}
      <Navbar />

      {/* 2. CORE HERO SECTION BLOCK */}
      {/* <header className="relative w-full overflow-hidden bg-linear-to-b from-slate-900 via-slate-900 to-[#0F172A] px-4 sm:px-6 lg:px-16 pt-28 md:pt-32 pb-20 md:pb-28 text-center text-white shadow-2xl"> */}
        {/* Background Decorative Glow Blobs */}
        {/* <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10"> */}
          {/* Metric Pill Accent */}
          {/* <div className="mb-8 inline-flex max-w-[92%] sm:max-w-fit items-center justify-center gap-2.5 rounded-full border border-cyan-400/30 bg-white/10 px-4 py-2 sm:px-6 sm:py-2.5 backdrop-blur-xl shadow-xl hover:bg-white/15 transition duration-300">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
            </span>

            <span className="text-center text-xs sm:text-sm font-semibold tracking-wide text-slate-100">
              Discover{" "}<span className="font-extrabold text-cyan-300"> fresh opportunities
    </span>{" "}
    from growing companies
            </span>
          </div>

          {/* Master Tagline Titles */}
          {/* <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Find the right opportunity. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-sky-300 to-blue-400">
              Build your future.
            </span>
          </h1>
          
          <p className="text-slate-300/90 font-normal text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Discover meaningful opportunities, showcase your skills, and connect
            with companies that value what you bring.
          </p>  */}

          {/* Floating Input Search Widget */}
          {/* <form 
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-2.5 max-w-4xl mx-auto mt-10 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-2 md:gap-0"
          >
            <div className="flex items-center px-4 w-full py-2.5">
              <BriefcaseIcon className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Job title or keyword" 
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder-slate-400 font-medium" 
              />
            </div>

            <div className="flex items-center px-4 w-full py-2.5">
              <SparklesIcon className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Skills (React, Python...)" 
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder-slate-400 font-medium" 
              />
            </div>

            <div className="flex items-center px-4 w-full py-2.5">
              <MapPinIcon className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Location or Remote" 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder-slate-400 font-medium" 
              />
            </div>

            <button 
              type="submit"
              className="w-full md:w-auto bg-linear-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-bold text-sm px-8 py-4 rounded-xl transition duration-200 whitespace-nowrap shadow-lg shadow-blue-600/25 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <SearchIcon className="w-4 h-4" />
              Search Jobs
            </button>
          </form> */}

          {/* Micro Meta Context Metrics */}
          {/* <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-slate-300 font-medium">
            <span className="cursor-pointer hover:text-white transition" onClick={() => navigate('/jobs?q=AI')}>
              ⚡ Trending: <span className="underline decoration-cyan-400/50">AI Engineer</span>, <span className="underline decoration-cyan-400/50">UX Designer</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              🌐 2,400+ Job openings live
            </span>
          </div>
        </div>
      </header> */}
            {/* <d className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-500 selection:text-white"> */}

  {/* 1. HEADER NAVIGATION */}
  {/* <Navbar /> */}

  {/* 2. CORE HERO SECTION */}
  <header className="relative isolate w-full overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-[#0F172A] px-4 sm:px-6 lg:px-10 xl:px-16 pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-16 sm:pb-20 md:pb-24 lg:pb-28 text-white">

    {/* Background Decorative Glow Blobs */}
    <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 h-64 w-[28rem] sm:h-80 sm:w-[40rem] rounded-full bg-cyan-500/10 blur-[110px]" />

    <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-blue-600/15 blur-[110px]" />

    <div className="pointer-events-none absolute -left-40 bottom-10 h-72 w-72 rounded-full bg-cyan-500/5 blur-[100px]" />

    {/* Subtle Grid */}
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />

    {/* HERO CONTENT */}
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">

      {/* Trust / Opportunity Badge */}
      <div className="mb-7 sm:mb-8 inline-flex max-w-[94%] items-center justify-center gap-2 rounded-full border border-cyan-400/25 bg-white/[0.07] px-4 py-2 sm:px-5 sm:py-2.5 backdrop-blur-xl shadow-lg shadow-black/10 transition hover:border-cyan-400/40 hover:bg-white/10">

        {/* <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
        </span> */}

        <span className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide text-slate-200">
          Discover{" "}
          <span className="font-extrabold text-cyan-300">
            fresh opportunities
          </span>{" "}
          from growing companies
        </span>
      </div>

      {/* Main Heading */}
      <div className="mx-auto w-full max-w-5xl px-2 sm:px-4">

        <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.08] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
          Find the right opportunity.
          <span className="mt-1 block bg-linear-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text pb-1 text-transparent">
            Build your future.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl px-2 text-sm font-normal leading-6 text-slate-300/90 sm:mt-6 sm:text-base sm:leading-7 md:text-lg">
          Discover meaningful opportunities, showcase your skills, and connect
          with companies that value what you bring.
        </p>

      </div>

      {/* SEARCH SECTION */}
      <form
        onSubmit={handleSearch}
        className="mt-8 flex w-full max-w-5xl flex-col gap-1.5 rounded-2xl border border-white/20 bg-white/[0.96] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:mt-10 sm:p-2.5 md:flex-row md:items-stretch md:gap-0"
      >

        {/* Job Title */}
        <div className="flex min-h-14 w-full items-center rounded-xl px-4 py-2.5 transition focus-within:bg-slate-50 md:flex-1 md:rounded-none md:border-r md:border-slate-200">
          <BriefcaseIcon className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

          <input
            type="text"
            placeholder="Job title or keyword"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="w-full min-w-0 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Skills */}
        <div className="flex min-h-14 w-full items-center rounded-xl px-4 py-2.5 transition focus-within:bg-slate-50 md:flex-1 md:rounded-none md:border-r md:border-slate-200">
          <SparklesIcon className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

          <input
            type="text"
            placeholder="Skills ( Communication ..)"
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
            className="w-full min-w-0 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Location */}
        <div className="flex min-h-14 w-full items-center rounded-xl px-4 py-2.5 transition focus-within:bg-slate-50 md:flex-1">
          <MapPinIcon className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

          <input
            type="text"
            placeholder="Location or Remote"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="w-full min-w-0 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex min-h-14 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#2563EB] to-[#1D4ED8] px-7 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition duration-200 hover:from-[#1D4ED8] hover:to-[#1E40AF] hover:shadow-blue-600/35 active:scale-[0.99] md:w-auto"
        >
          <SearchIcon className="h-4 w-4" />
          <span>Search Jobs</span>
        </button>

      </form>

      {/* Supporting Context */}
      <div className="mt-5 flex w-full flex-col items-center justify-center gap-3 text-xs font-medium text-slate-400 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">

        <span className="hidden h-4 w-px bg-white/10 sm:block" />

        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
          <span className="text-cyan-400">✓</span>
          Career opportunities across multiple industries
        </span>

      </div>

      {/* Consulting Message */}
      <div className="mt-8 max-w-xl border-t border-white/10 pt-5 sm:mt-10 sm:pt-6">
        <p className="text-xs leading-5 text-slate-400 sm:text-sm">
          <span className="font-semibold text-slate-300">
            More than a job portal.
          </span>{" "}
          Raffle helps professionals and businesses make smarter career and
          talent decisions through technology, opportunities, and consulting.
        </p>
      </div>

    </div>
  </header>


      {/* 3. TRUSTED MARQUEE PARTNERS PANEL (Component) */}
      <TrustedPartnersSection />

      {/* 4. DYNAMIC TRENDING OPPORTUNITIES GRID (Component) */}
      <ActiveJobsSection />

      {/* 5. USER METRIC PROGRESSION SYSTEM (Component) */}
      <HowItWorksSection />

      {/* 6. CONVERSATIONAL PIPELINE ENTRY CARD */}
   
         <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0F172A] px-5 py-12 sm:px-8 sm:py-14 md:px-14 md:py-16 text-center shadow-2xl">

    {/* Background Glow */}
    <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#2B2A8C]/20 blur-3xl pointer-events-none" />

    <div className="absolute -bottom-28 -right-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

    {/* Animated Shine */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 -left-1/2 w-[200%] h-full bg-linear-to-r from-transparent via-white/[0.04] to-transparent -skew-x-12 animate-pulse" />
    </div>

    {/* Content */}
    <div className="relative z-10 max-w-2xl mx-auto">

      {/* Small Label */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.06] text-white/70 text-xs font-semibold tracking-wide mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        YOUR NEXT OPPORTUNITY AWAITS
      </div>

      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-[2.7rem] font-bold text-white leading-[1.15] tracking-tight">
        Ready to Take the Next Step
        <span className="block text-white/90">
          in Your Career?
        </span>
      </h2>

      {/* Description */}
      <p className="mt-5 mx-auto max-w-xl text-sm sm:text-base text-slate-300 leading-7">
        Whether you're looking for your next opportunity or the right talent,
        <span className="text-white font-medium"> Raffles </span>
        makes the connection simple.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">

        <button
          onClick={() => navigate("/register")}
          className="group w-full sm:w-auto min-h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#2B2A8C] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl active:translate-y-0 cursor-pointer"
        >
          Create Free Account

          <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => navigate("/employer-dashboard")}
          className="w-full sm:w-auto min-h-12 inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.12] active:translate-y-0 cursor-pointer"
        >
          Post a Job Opening
        </button>

      </div>

      {/* Trust Indicators */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] sm:text-xs font-medium text-white/45">
        <span className="flex items-center gap-1.5">
          <span className="text-emerald-400">✓</span>
          No credit card required
        </span>

        <span className="hidden sm:block text-white/20">•</span>

        <span className="flex items-center gap-1.5">
          <span className="text-emerald-400">✓</span>
          GDPR Compliant
        </span>

        <span className="hidden sm:block text-white/20">•</span>

        <span className="flex items-center gap-1.5">
          <span className="text-emerald-400">✓</span>
          Free setup
        </span>
      </div>

    </div>
  </div>
</section>

    </div>
  );
}