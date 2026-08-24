import React, { useState, useEffect } from 'react';
import { 
  SearchIcon, 
  UserPlusIcon, 
  CheckCircle2Icon, 
  SparklesIcon, 
  ArrowRightIcon,
  Building2Icon,
  CalendarIcon,
  AwardIcon,
  FileTextIcon,
  ZapIcon,
  CheckIcon,
  BriefcaseIcon
} from 'lucide-react';
import boy from '../../assets/boy.png';
import search from '../../assets/search.png';
import approved from '../../assets/approved.png';
import { useNavigate } from 'react-router-dom';

export default function HowItWorksSection() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto progression animation (step 1 -> step 2 -> step 3)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const steps = [
    {
      number: "01",
      title: "Discover & Filter Roles",
      description: "Browse thousands of verified job listings tailored to your domain, salary expectations, and preferred work mode with AI matching.",
      icon: search,
      accentBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      pillText: "Step 1: Smart Search",
      glowColor: "from-blue-600/30 to-indigo-600/10",
      activeBadge: "bg-blue-500/20 text-blue-300 border-blue-400/30",
      // Unique visual preview image/graphic layout
      renderGraphic: () => (
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 transition-all duration-500 group-hover:border-blue-500/40 group-hover:shadow-lg group-hover:shadow-blue-500/10">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 w-full sm:w-auto flex-1 min-w-0">
              <SearchIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">React Developer • Bengaluru</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 shrink-0 flex items-center gap-1">
              <SparklesIcon className="w-3 h-3" /> 98% Match
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 space-y-2 group-hover:bg-slate-900 transition-colors">
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                  G
                </div>
                <span className="text-xs font-bold text-white truncate">Full Stack Engineer</span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                ₹18 - 25 LPA
              </span>
            </div>

            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[9px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-1.5 py-0.5 rounded">React.js</span>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Node.js</span>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Remote</span>
            </div>
          </div>
        </div>
      )
    },
    {
      number: "02",
      title: "1-Click Profile Application",
      description: "Build your professional profile once and apply directly to top hiring managers with zero repetitive form filling.",
      icon: boy,
      accentBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      pillText: "Step 2: Instant Apply",
      glowColor: "from-indigo-600/30 to-purple-600/10",
      activeBadge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
      renderGraphic: () => (
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 transition-all duration-500 group-hover:border-indigo-500/40 group-hover:shadow-lg group-hover:shadow-indigo-500/10">
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800/80 rounded-xl p-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              SS
            </div>
            <div className="truncate min-w-0">
              <div className="text-xs font-bold text-white flex items-center gap-1 truncate">
                Sagar Sharma <CheckCircle2Icon className="w-3 h-3 text-blue-400 shrink-0" />
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                <FileTextIcon className="w-3 h-3 text-indigo-400 shrink-0" /> <span className="truncate">Resume_Verified.pdf</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5">
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
              <ZapIcon className="w-3.5 h-3.5 fill-current" /> Application Sent
            </span>
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
              ✓
            </span>
          </div>
        </div>
      )
    },
    {
      number: "03",
      title: "Interview & Get Hired",
      description: "Connect directly with corporate recruitment teams, track interview status in real-time, and receive verified job offers.",
      icon: approved,
      accentBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      pillText: "Step 3: Direct Offer",
      glowColor: "from-emerald-600/30 to-teal-600/10",
      activeBadge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
      renderGraphic: () => (
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 transition-all duration-500 group-hover:border-emerald-500/40 group-hover:shadow-lg group-hover:shadow-emerald-500/10">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2.5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <CalendarIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-[11px] font-medium text-slate-300 truncate">Technical Round Passed</span>
            </div>
            <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded font-bold shrink-0">
              Final Round
            </span>
          </div>

          <div className="bg-linear-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-xl p-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mt-3">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 truncate">
                <AwardIcon className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Offer Letter Released 🎉</span>
              </div>
              <div className="text-xs font-black text-white mt-0.5 truncate">₹24,00,000 / Year</div>
            </div>
            <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md font-extrabold text-xs shrink-0">
              ✓
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full bg-linear-to-b from-slate-900 via-slate-900 to-[#0F172A] text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-16 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-cyan-300 text-xs font-bold backdrop-blur-md">
            <SparklesIcon className="w-3.5 h-3.5" /> Simple 3-Step Journey
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            How Raffles Streamlines Your Career
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From search to final offer, experience a modernized hiring workflow designed for transparency and speed.
          </p>

          {/* Active Step Indicator Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  activeStep === idx
                    ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/25 scale-105"
                    : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                <span>{step.number}</span>
                <span>{idx === 0 ? "Search" : idx === 1 ? "Apply" : "Get Hired"}</span>
                {activeStep === idx && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 lg:mt-16 relative">
          
          {/* Animated Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-28 left-12 right-12 h-1 bg-slate-800 rounded-full z-0 overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-700 ease-out shadow-sm"
              style={{
                width: activeStep === 0 ? "33%" : activeStep === 1 ? "66%" : "100%"
              }}
            />
          </div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;

            return (
              <div 
                key={idx}
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
                className={`group relative bg-white/5 backdrop-blur-xl border p-7 sm:p-8 rounded-3xl transition-all duration-500 flex flex-col justify-between z-10 cursor-pointer overflow-hidden ${
                  isActive 
                    ? "border-blue-500/60 bg-white/10 -translate-y-3 shadow-2xl shadow-blue-500/15" 
                    : "border-white/10 hover:border-white/30 hover:-translate-y-1.5"
                }`}
              >
                {/* Glow Background Gradient effect on active */}
                <div 
                  className={`absolute inset-0 bg-linear-to-br ${step.glowColor} transition-opacity duration-500 pointer-events-none ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  }`}
                />

                <div className="relative z-10">
                  {/* Header Row: Step Number & Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl font-black tracking-wider transition-colors duration-300 ${
                        isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                      }`}>
                        {step.number}
                      </span>
                      {/* {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 animate-fadeIn">
                          <CheckIcon className="w-3 h-3 text-emerald-400" /> Active Step
                        </span>
                      )} */}
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                      isActive ? step.activeBadge : step.accentBg
                    }`}>
                      {step.pillText}
                    </span>
                  </div>

                  {/* Icon Pod */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner mb-5 transition-transform duration-500 ${
                    isActive ? "scale-110 shadow-lg " + step.accentBg : "scale-100 " + step.accentBg
                  }`}>
                    {/* <Icon className="w-7 h-7" /> */}
                    {typeof step.icon === "string" ? (
    <img src={step.icon} alt="Step icon" className="w-12 h-12" />
  ) : (
    <step.icon className="w-8 h-8" />
  )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-2.5 leading-relaxed font-normal">
                    {step.description}
                  </p>

                  {/* UNIQUE HOVER & STEP GRAPHIC PREVIEW CARD */}
                  <div className="mt-6">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                      <SparklesIcon className="w-3 h-3 text-blue-400" /> Interactive Feature Preview
                    </div>
                    {step.renderGraphic()}
                  </div>
                </div>

                {/* Bottom Step Progression Indicator Bar */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between relative z-10 text-xs">
                  <span className={`font-semibold transition-colors ${isActive ? "text-blue-400" : "text-slate-400"}`}>
                    {isActive ? `Step ${idx + 1} of 3 in progress` : `Click to view Step ${idx + 1}`}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? "bg-[#2563EB] text-white" : "bg-slate-800 text-slate-400 group-hover:text-white"
                  }`}>
                    <ArrowRightIcon className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? "translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
