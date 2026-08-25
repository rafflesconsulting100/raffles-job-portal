import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Globe,
  Sparkles,
  Target,
  HeartHandshake,
  Lightbulb,
  BadgeCheck, ChevronRight, Home
} from 'lucide-react';
import logo from '../assets/rafflelogo.png';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: "Successful Placements", value: "12,500+", icon: Users, color: "from-blue-600 to-indigo-600" },
    { label: "Corporate Partners", value: "650+", icon: Building2, color: "from-purple-600 to-indigo-700" },
    { label: "Candidate Retention Rate", value: "98.4%", icon: ShieldCheck, color: "from-emerald-500 to-teal-700" },
    { label: "Years of Excellence", value: "15+", icon: Award, color: "from-amber-500 to-orange-600" }
  ];

  const services = [
    {
      title: "Executive Search & Leadership Hiring",
      description: "Direct talent hunting for CXO, Director, and VP level roles with deep industry background verification.",
      icon: Target,
      tag: "Leadership"
    },
    {
      title: "IT & Tech Recruitment Solutions",
      description: "Specialized sourcing for Full-Stack Engineers, AI/ML Engineers, Cloud Architects, and Product Managers.",
      icon: Lightbulb,
      tag: "Technology"
    },
    {
      title: "Bulk & Turnkey Staffing",
      description: "Scalable volume recruitment solutions for rapidly growing startups, GCCs, and enterprise expansions.",
      icon: Users,
      tag: "Enterprise"
    },
    {
      title: "Overseas & Offshore Placement",
      description: "Global mobility and remote staffing services across North America, Europe, UAE, and Southeast Asia.",
      icon: Globe,
      tag: "Global"
    },
    {
      title: "HR Advisory & Compensation Benchmarking",
      description: "Strategic workforce structuring, salary benchmark reports, and organizational development consulting.",
      icon: HeartHandshake,
      tag: "Advisory"
    },
    {
      title: "Contractual & Flexi-Staffing",
      description: "Agile contract staffing for project-based demands and specialized short-term technical assignments.",
      icon: Briefcase,
      tag: "Contract"
    }
  ];

  const coreValues = [
    {
      title: "Uncompromising Integrity",
      desc: "We prioritize complete transparency, compliance, and ethical standards in candidate representation and client partnerships.",
      icon: BadgeCheck
    },
    {
      title: "Data-Driven Matching",
      desc: "Combining human recruitment expertise with advanced AI matching algorithms to ensure 98%+ candidate alignment.",
      icon: TrendingUp
    },
    {
      title: "Client-Centric Commitment",
      desc: "Customized talent solutions designed specifically for your organization's unique culture, tech stack, and growth goals.",
      icon: HeartHandshake
    }
  ];

  const leadershipTeam = [
    {
      name: "Vikramaditya Sharma",
      role: "Founder & Managing Director",
      experience: "20+ Years in Global HR & Executive Search",
      bio: "Pioneered strategic recruitment solutions for Fortune 500 tech companies and high-growth Indian unicorn startups.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Ananya Deshmukh",
      role: "Head of Talent Acquisition & Offshore Placement",
      experience: "14+ Years in Tech Staffing & GCC Setup",
      bio: "Architected GCC hiring strategies for major MNCs across India and Dubai, building tech teams of 500+ engineers.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Rajesh K. Nair",
      role: "VP - Executive Leadership Search",
      experience: "16+ Years in CXO & Strategic HR",
      bio: "Specializes in high-stakes C-suite recruitment, board advisory, and leadership talent mapping across APAC.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1e293b] pt-15 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-b from-slate-900 via-slate-900 to-[#0F172A] text-white py-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative ambient glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/20 shadow-inner">
              {/* <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> */}
              Premier HR & Talent Acquisition Partner
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Empowering Businesses with <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 via-indigo-200 to-amber-300">Exceptional Talent</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Raffles Consultancy is a trusted recruitment and strategic human capital advisory firm. For over 15 years, we have connected top-tier professionals with leading global enterprises, GCCs, and high-growth startups.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/jobs"
                className="px-6 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-extrabold text-sm shadow-xl hover:shadow-2xl transition duration-300 flex items-center gap-2 active:scale-95"
              >
                <Briefcase className="w-4 h-4" />
                Explore Open Positions
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm transition duration-300 flex items-center gap-2 active:scale-95 backdrop-blur-md"
              >
                Hire Top Talent
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Card Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-4 border-b border-white/10 pb-5">
                <img src={logo} alt="Raffles Consultancy" className="h-16 w-auto p-2 rounded-xl" />
                <div>
                  <h3 className="text-lg font-black text-white">Raffles Consultancy</h3>
                  <p className="text-xs text-blue-200 font-semibold">Strategic Talent & HR Solutions</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Specialized in Tech, GCCs, Leadership & Finance Hiring</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Customized End-to-End Talent Acquisition Pipeline</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Pan-India & Overseas Placement Services</span>
                </div>
              </div>

              <div className="bg-linear-to-r from-blue-600/30 to-indigo-600/30 p-4 rounded-2xl border border-blue-400/20 text-center">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">Trusted by 650+ Enterprise Clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1e293b] pt-1">
                  {stat.value}
                </h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ABOUT OUR CONSULTANCY STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-extrabold text-[#2B2A8C] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
              Our Journey & Philosophy
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1e293b] leading-tight">
              Building World-Class Teams with Precision & Human Insight
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              Founded with the vision to revolutionize recruitment and talent search, **Raffles Consultancy** bridges the gap between ambitious corporate enterprises and top-tier talent.
            </p>

            <p className="text-sm text-gray-600 leading-relaxed">
              Whether you are a candidate aiming to accelerate your career path or an employer seeking high-caliber tech architects, CXOs, or specialized domain experts, our dedicated recruitment partners ensure seamless alignment, cultural fit, and long-term retention.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs space-y-1">
                <h4 className="text-sm font-extrabold text-[#1e293b]">Our Mission</h4>
                <p className="text-xs text-gray-500">To deliver agile, ethical, and result-driven talent solutions that fuel corporate innovation and individual growth.</p>
              </div>

              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs space-y-1">
                <h4 className="text-sm font-extrabold text-[#1e293b]">Our Vision</h4>
                <p className="text-xs text-gray-500">To be the most preferred recruitment advisory partner known for reliability, speed, and candidate care.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Raffles Consultancy Team Collaboration"
                className="rounded-3xl shadow-2xl object-cover w-full h-100"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 max-w-xs space-y-1 hidden sm:block">
                <p className="text-xs font-black text-[#2B2A8C] uppercase tracking-wider">Pan-India Reach</p>
                <p className="text-xs font-semibold text-gray-600">Connecting talent across Delhi NCR, Bengaluru, Mumbai, Hyderabad, and International locations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR CONSULTANCY SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#2B2A8C] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            What We Do
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1e293b]">
            Comprehensive Staffing & HR Solutions
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Tailored consultancy services designed to meet demanding recruitment needs across technical and non-technical domains.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2B2A8C] flex items-center justify-center group-hover:bg-[#2B2A8C] group-hover:text-white transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2A8C] bg-blue-50 px-2.5 py-1 rounded-md">
                      {srv.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1e293b] group-hover:text-[#2B2A8C] transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-50 flex items-center text-xs font-bold text-[#2B2A8C] group-hover:translate-x-1 transition-transform">
                  Learn More <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* 5. LEADERSHIP TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#2B2A8C] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            Leadership
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1e293b]">
            Meet Our Leadership Team
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Seasoned HR executives and talent strategists driving excellence across global placements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {leadershipTeam.map((member, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 text-center group">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-50 shadow-md group-hover:scale-105 transition-transform"
              />
              <div>
                <h3 className="text-base font-extrabold text-[#1e293b]">{member.name}</h3>
                <p className="text-xs font-bold text-[#2B2A8C] mt-0.5">{member.role}</p>
                <p className="text-[11px] font-semibold text-gray-400 mt-1">{member.experience}</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
