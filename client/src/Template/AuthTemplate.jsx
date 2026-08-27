import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  ZapIcon, 
  GlobeIcon, 
  CheckCircle2Icon, 
  UserCheckIcon, 
  Building2Icon,
  SparklesIcon
} from 'lucide-react';
import globalImg from '../assets/global.png';
import verifyImg from '../assets/verify.png';
import thunderImg from '../assets/thunder.png';
import candidateImg from '../assets/candidate.png';
import employerImg from '../assets/employer.png';
import boyImg from '../assets/boy.png';
import approvedImg from '../assets/approved.png';

export default function AuthTemplate({ 
  children, 
  role = 'Job Seeker',
  onRoleChange,
  title,
  subtitle,
  features
}) {
  const [activeRole, setActiveRole] = useState(role);

  // Sync internal state with incoming role prop
  useEffect(() => {
    if (role && role !== activeRole) {
      setActiveRole(role);
    }
  }, [role]);

  const handleRoleToggle = (newRole) => {
    setActiveRole(newRole);
    if (onRoleChange) {
      onRoleChange(newRole);
    }
  };

  const isJobSeeker = activeRole === 'Job Seeker';

  // Dynamic Content Data
  const defaultJobSeekerContent = {
    title: (
      <>
        Elevate Your Career <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-sky-300">
          With Verified Leaders.
        </span>
      </>
    ),
    subtitle: "Join the elite candidate network. Access 100% free placement, direct corporate hiring manager connect, and fast-track interview scheduling.",
    badgeText: "100% Free Candidate Services",
    image: boyImg || candidateImg,
    statBadge: "12,500+ Candidates Placed",
    features: [
      {
        icon: verifyImg,
        title: "100% Verified Corporate Roles",
        description: "Direct placements with top enterprises, GCCs & startups without middlemen."
      },
      {
        icon: thunderImg,
        title: "Fast-Track Sourcing SLA",
        description: "Direct candidate pipeline connection with hiring decision makers."
      },
      {
        icon: globalImg,
        title: "Pan-India & Remote Placement",
        description: "Access premium roles across major Indian tech hubs & global mandates."
      }
    ]
  };

  const defaultEmployerContent = {
    title: (
      <>
        Scale Your Workforce <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-300">
          With 48-Hour Shortlists.
        </span>
      </>
    ),
    subtitle: "Partner with Raffles Consultancy for executive search, IT staffing, and turnkey workforce solutions. Source pre-screened top 1% talent.",
    badgeText: "Enterprise Recruitment Partner",
    image: employerImg || approvedImg,
    statBadge: "650+ Corporate Partners",
    features: [
      {
        icon: verifyImg,
        title: "Pre-Screened Talent Pipeline",
        description: "Thorough technical vetting, culture-fit assessment, and background check."
      },
      {
        icon: thunderImg,
        title: "48-72 Hours Sourcing SLA",
        description: "Receive qualified candidate shortlists within 48 hours of mandate kickoff."
      },
      {
        icon: globalImg,
        title: "Executive & Volume Staffing",
        description: "Dedicated account manager and tailored salary benchmarking reports."
      }
    ]
  };

  const currentContent = isJobSeeker ? defaultJobSeekerContent : defaultEmployerContent;
  const displayTitle = title || currentContent.title;
  const displaySubtitle = subtitle || currentContent.subtitle;
  const displayFeatures = features || currentContent.features;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/60 text-slate-900 pt-20 lg:pt-24 pb-12 relative overflow-hidden">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-24 w-112 h-112 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-start">
           
          {/* LEFT DYNAMIC BRAND & VISUAL PANEL */}
          <div className="w-full lg:col-span-5 bg-linear-to-b from-slate-950 via-slate-900 to-[#0F172A] rounded-3xl p-6 sm:p-8 xl:p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/10 lg:sticky lg:top-24">
            {/* Ambient Background Gradient Shift */}
            <div 
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                isJobSeeker 
                  ? 'bg-radial from-cyan-500/10 via-transparent to-transparent' 
                  : 'bg-radial from-amber-500/10 via-transparent to-transparent'
              }`} 
            />

            <div className="relative z-10 space-y-6">
              
              {/* Role Switcher Pill Bar */}
              <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 w-full sm:w-auto shadow-inner select-none">
                <button
                  type="button"
                  onClick={() => handleRoleToggle('Job Seeker')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isJobSeeker
                      ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserCheckIcon className="w-3.5 h-3.5" />
                  Job Seeker
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleToggle('Employer')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    !isJobSeeker
                      ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Building2Icon className="w-3.5 h-3.5" />
                  Employer / Partner
                </button>
              </div>

              {/* Dynamic Header Titles */}
              <div key={`header-${activeRole}`} className="animate-fadeIn space-y-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                  isJobSeeker 
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-400/20' 
                    : 'bg-amber-500/10 text-amber-300 border-amber-400/20'
                }`}>
                  <SparklesIcon className="w-3 h-3 animate-pulse" />
                  {currentContent.badgeText}
                </span>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight pt-1">
                  {displayTitle}
                </h1>
                
                {displaySubtitle && (
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md pt-1">
                    {displaySubtitle}
                  </p>
                )}
              </div>

              {/* Dynamic Feature Image & Floating Badges */}
              <div key={`visual-${activeRole}`} className="relative my-4 sm:my-6 rounded-2xl bg-slate-800/50 border border-white/10 p-4 overflow-hidden shadow-inner group">
                <div className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
                  isJobSeeker ? 'bg-cyan-500/20' : 'bg-amber-500/20'
                }`} />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2.5 z-10 max-w-[58%]">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2Icon className="w-3 h-3" />
                      Verified Platform
                    </span>

                    <h3 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                      {isJobSeeker ? "Land Your Dream Tech & Corporate Role" : "Hire Pre-Screened Top 1% Professionals"}
                    </h3>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-200 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                        {currentContent.statBadge}
                      </span>
                    </div>
                  </div>

                  {/* Feature Image Illustration */}
                  <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                    <img 
                      src={currentContent.image} 
                      alt={activeRole} 
                      className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Feature Value Highlights */}
              {displayFeatures && displayFeatures.length > 0 && (
                <div key={`features-${activeRole}`} className="space-y-4 pt-1">
                  {displayFeatures.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3.5 group/item">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                          isJobSeeker 
                            ? 'bg-cyan-500/10 border-cyan-400/20 text-cyan-400 group-hover/item:bg-cyan-500/20' 
                            : 'bg-amber-500/10 border-amber-400/20 text-amber-400 group-hover/item:bg-amber-500/20'
                        }`}>
                          {typeof Icon === 'string' ? (
                            <img src={Icon} alt={feature.title} className="w-5 h-5 object-contain" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover/item:text-cyan-300 transition-colors">
                            {feature.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Brand Left Panel Footer */}
            <div className="relative z-10 text-[11px] text-slate-400 font-medium flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 mt-6">
              {/* <span>© 2026 RAFFLES JOBS</span>
              <div className="flex items-center gap-3">
                <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
                <span>•</span>
                <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
              </div> */}
            </div>
          </div>

          {/* RIGHT FORM CONTAINER PANEL */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
            {children}
          </div>

        </div>
      </main>
    </div>
  );
}

