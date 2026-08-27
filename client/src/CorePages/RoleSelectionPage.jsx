import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import logo from '../assets/rafflelogo.png';
import boyImg from '../assets/boy.png';
import hr from '../assets/hr.png';

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  const handleJobSeekerClick = () => {
    // Redirect to candidate job search / registration page
    navigate('/register');
  };

  const handleEmployerClick = () => {
    // Redirect to employer dashboard / corporate hiring page
    navigate('/employer-dashboard');
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-blue-50/50 text-[#1E293B] flex flex-col justify-between selection:bg-[#2563EB] selection:text-white font-sans">
      
      {/* 1. TOP MINIMALIST HEADER */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/home" className="flex items-center gap-2 group">
            <img 
              src={logo} 
              alt="RAFFLES JOBS" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="leading-none">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#2B2A8C]">
                raffles
              </h1>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                Job Portal
              </span>
            </div>
          </Link>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleJobSeekerClick}
              className="px-3.5 py-1.5 sm:px-5 sm:py-2.5 bg-linear-to-r from-sky-500 to-blue-600 hover:from-blue-600 hover:to-[#2B2A8C] text-white text-xs sm:text-sm font-bold rounded-full transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Looking for a job?</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#2B2A8C] transition"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN INTENT / ROLE SELECTION CONTAINER */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
          
          {/* Header Headlines */}
          <div className="space-y-2 sm:space-y-3">
            <p className="text-sm sm:text-base font-semibold text-blue-600 tracking-wide">
              Before you get started, tell us
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">
              What are you looking for?
            </h2>
          </div>

          {/* Selection Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch text-left">
            
            {/* Card 1: Job Seeker Card */}
            <div 
              onClick={handleJobSeekerClick}
              className="group bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-blue-400/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                    I want a Job for FREE
                  </h3>
                  <p className="text-lg sm:text-xl font-extrabold text-blue-600 tracking-wide">
                    मुझे नौकरी चाहिए
                  </p>
                  
                  <div className="pt-2 sm:pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobSeekerClick();
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-linear-to-r from-sky-500 to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md shadow-blue-500/20 group-hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <span>Get a Job Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Candidate Image */}
                <div className="shrink-0 w-28 sm:w-36 lg:w-40 h-36 sm:h-44 lg:h-48 flex items-end justify-center">
                  <img 
                    src={boyImg} 
                    alt="Candidate looking for a job" 
                    className="h-full w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#2563EB] font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  100% Free Placement Services
                </span>
                <span className="text-slate-400 group-hover:text-slate-600 transition">
                  12,500+ Hired Candidate Network
                </span>
              </div>
            </div>

            {/* Card 2: Employer / Hiring Card */}
            <div 
              onClick={handleEmployerClick}
              className="group bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-indigo-400/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-600/20 transition-colors" />

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                    I want to hire for FREE
                  </h3>
                  <p className="text-lg sm:text-xl font-extrabold text-[#2B2A8C] tracking-wide">
                    मुझे स्टाफ चाहिए
                  </p>
                  
                  <div className="pt-2 sm:pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmployerClick();
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-linear-to-r from-[#2563EB] to-[#2B2A8C] hover:from-[#1D4ED8] hover:to-[#1E1D66] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md shadow-indigo-500/20 group-hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <span>Hire Staff Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Recruiter Image */}
                <div className="shrink-0 w-28 sm:w-36 lg:w-40 h-36 sm:h-44 lg:h-48 flex items-end justify-center">
                  <img 
                    src={hr} 
                    alt="Employer looking to hire" 
                    className="h-full w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#2B2A8C] font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#2B2A8C]" />
                  48-Hour Shortlist Guarantee
                </span>
                <span className="text-slate-400 group-hover:text-slate-600 transition">
                  650+ Corporate Partners
                </span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* 3. MINIMALIST FOOTER */}
      <footer className="py-6 border-t border-slate-200/60 bg-white/60 backdrop-blur-xs text-center text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 RAFFLES JOBS. All Rights Reserved.</span>
          <div className="flex items-center gap-4 text-slate-500">
            <span>By proceeding, you agree to our</span>
            <Link to="/about" className="text-[#2B2A8C] font-semibold hover:underline">Terms of Use</Link>
            <span>&</span>
            <Link to="/contact" className="text-[#2B2A8C] font-semibold hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

