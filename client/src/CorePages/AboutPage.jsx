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

const roleCategories = [
  "Software Engineering",
  "Data Science",
  "Design",
  "Marketing",
  "Finance",
  "HR",
  "Management",
  "Operations",
  "Sales",
  "Customer Support"
];

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: "Jobs Available", value: "Active", icon: Users, color: "from-blue-600 to-indigo-600" },
    { label: "Companies", value: "Growing", icon: Building2, color: "from-purple-600 to-indigo-700" },
    { label: "Job Seekers", value: "Active", icon: ShieldCheck, color: "from-emerald-500 to-teal-700" },
    { label: "Role Categories", value: "10", icon: Award, color: "from-amber-500 to-orange-600" }
  ];

  const services = [
    {
      title: "Software Engineering",
      description: "Frontend, backend, full-stack, mobile, DevOps and software development opportunities.",
      icon: Briefcase,
      tag: "Technology"
    },
    {
      title: "Data Science",
      description: "Data analysis, data science, machine learning, AI and analytics opportunities.",
      icon: TrendingUp,
      tag: "Data"
    },
    {
      title: "Design",
      description: "UI/UX, product design, graphic design and creative opportunities.",
      icon: Target,
      tag: "Creative"
    },
    {
      title: "Marketing",
      description: "Digital marketing, SEO, content, growth, brand and marketing opportunities.",
      icon: Sparkles,
      tag: "Growth"
    },
    {
      title: "Finance",
      description: "Accounting, financial analysis, banking, payroll and finance opportunities.",
      icon: Award,
      tag: "Finance"
    },
    {
      title: "HR",
      description: "Recruitment, talent acquisition, HR operations and people-focused opportunities.",
      icon: Users,
      tag: "People"
    },
    {
      title: "Management",
      description: "Product, project, business, team and leadership opportunities.",
      icon: Target,
      tag: "Leadership"
    },
    {
      title: "Operations",
      description: "Business operations, processes, administration and operational opportunities.",
      icon: Building2,
      tag: "Operations"
    },
    {
      title: "Sales",
      description: "Inside sales, field sales, business development and account opportunities.",
      icon: TrendingUp,
      tag: "Business"
    },
    {
      title: "Customer Support",
      description: "Customer service, customer success, support and helpdesk opportunities.",
      icon: HeartHandshake,
      tag: "Support"
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
      name: "Job Seekers",
      role: "Find Opportunities",
      experience: "Search • Apply • Grow",
      bio: "Create your profile, discover relevant jobs and manage your applications from one place.",
      avatar: logo
    },
    {
      name: "Employers",
      role: "Find Great Talent",
      experience: "Post • Review • Hire",
      bio: "Create your company presence, publish jobs and connect with candidates across our role categories.",
      avatar: logo
    },
    {
      name: "RafflesJobs",
      role: "Recruitment Platform",
      experience: "Jobs • Talent • Careers",
      bio: "A focused platform designed to make job discovery and recruitment easier for everyone.",
      avatar: logo
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] text-[#1e293b] pt-15 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-b from-slate-900 via-slate-900 to-[#0F172A] text-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative ambient glows */}
        <div className="absolute top-0 left-1/2 sm:left-1/4 -translate-x-1/2 sm:translate-x-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/2 sm:right-1/4 translate-x-1/2 sm:translate-x-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="min-w-0 lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/20 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              RafflesJobs — Jobs & Careers
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.12]">
              Connecting Talent with <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 via-indigo-200 to-amber-300">Better Opportunities</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-7 sm:leading-relaxed">
              RafflesJobs is a modern recruitment platform connecting job seekers with employers across Software Engineering, Data Science, Design, Marketing, Finance, HR, Management, Operations, Sales, and Customer Support.
            </p>

            <div className="pt-2 flex flex-col min-[420px]:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/jobs"
                className="w-full min-[420px]:w-auto justify-center px-5 sm:px-6 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-extrabold text-sm shadow-xl hover:shadow-2xl transition duration-300 flex items-center gap-2 active:scale-95"
              >
                <Briefcase className="w-4 h-4" />
                Explore Jobs
              </Link>
              <Link
                to="/contact"
                className="w-full min-[420px]:w-auto justify-center px-5 sm:px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm transition duration-300 flex items-center gap-2 active:scale-95 backdrop-blur-md"
              >
                Hire Talent
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Card Visual */}
          <div className="min-w-0 lg:col-span-5 flex w-full justify-center">
            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 border-b border-white/10 pb-5">
                <img src={logo} alt="RafflesJobs" className="h-12 sm:h-16 max-w-[8rem] w-auto p-2 rounded-xl object-contain shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">RafflesJobs</h3>
                  <p className="text-[11px] sm:text-xs text-blue-200 font-semibold leading-5">Find Jobs. Hire Talent. Build Careers.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs text-slate-200 leading-5">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-400 shrink-0" />
                  <span>Opportunities across 10 professional role categories</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-200 leading-5">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-400 shrink-0" />
                  <span>Simple job discovery and application experience</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-200 leading-5">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-400 shrink-0" />
                  <span>Tools for job seekers and employers</span>
                </div>
              </div>

              <div className="bg-linear-to-r from-blue-600/30 to-indigo-600/30 p-3 sm:p-4 rounded-2xl border border-blue-400/20 text-center">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">Trusted by Growing Enterprise Clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="min-w-0 bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1e293b] pt-1 break-words">
                  {stat.value}
                </h3>
                <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ABOUT OUR CONSULTANCY STORY */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="min-w-0 lg:col-span-6 space-y-5 sm:space-y-6">
            <span className="text-xs font-extrabold text-[#2B2A8C] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
              About RafflesJobs
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1e293b] leading-tight">
              A simpler way to find jobs and hire talent
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-7">
              RafflesJobs makes it easier for job seekers to discover opportunities and for employers to connect with candidates.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-7">
              Job seekers can create profiles, search for relevant positions and apply. Employers can create company profiles, post openings and manage applications.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-xs space-y-1">
                <h4 className="text-sm font-extrabold text-[#1e293b]">Our Mission</h4>
                <p className="text-xs text-gray-500">To make job discovery and recruitment simple, accessible, and useful for both sides of the hiring process.</p>
              </div>

              <div className="p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-xs space-y-1">
                <h4 className="text-sm font-extrabold text-[#1e293b]">Our Vision</h4>
                <p className="text-xs text-gray-500">To build a trusted recruitment platform where people can discover opportunities and companies can find the right talent.</p>
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="RafflesJobs Team Collaboration"
                className="rounded-2xl sm:rounded-3xl shadow-2xl object-cover w-full h-64 sm:h-80 lg:h-[25rem]"
              />
              <div className="absolute -bottom-5 left-4 sm:-left-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 max-w-[calc(100%-2rem)] sm:max-w-xs space-y-1 hidden sm:block">
                <p className="text-xs font-black text-[#2B2A8C] uppercase tracking-wider">Professional Opportunities</p>
                <p className="text-xs font-semibold text-gray-600">Discover opportunities across the professional categories supported by RafflesJobs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. JOB CATEGORIES */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="text-center w-full max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#2B2A8C] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            Explore Opportunities
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1e293b]">
            Find Jobs by Role Category
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-6">
            Explore jobs across ten focused professional categories.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-7 sm:mt-8 mb-2 px-1">
          {roleCategories.map((category) => (
            <Link
              key={category}
              to={`/jobs?category=${encodeURIComponent(category)}`}
              className="max-w-full px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[#2B2A8C] text-[11px] sm:text-xs font-bold text-center hover:bg-[#2B2A8C] hover:text-white transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="min-w-0 bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 flex flex-col justify-between group"
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

                  <h3 className="text-base sm:text-lg font-bold text-[#1e293b] group-hover:text-[#2B2A8C] transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 leading-6">
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
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="text-center w-full max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#2B2A8C] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            Leadership
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1e293b]">
            Built for Job Seekers & Employers
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-6">
            Everything you need to discover opportunities, apply for jobs, post openings, and connect with talent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mt-8 sm:mt-12">
          {leadershipTeam.map((member, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 text-center group">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto object-cover border-4 border-blue-50 shadow-md group-hover:scale-105 transition-transform"
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