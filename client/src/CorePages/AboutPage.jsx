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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] text-[#1e293b] pt-10 pb-16">
      {/* 1. HERO HEADER */}
      <section className="bg-linear-to-b from-slate-900 via-slate-900 to-[#0F172A] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-300/80 mb-2">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">About Us</span>
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            "Empowering Careers, Driving Organizational Excellence"
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Connecting Talent with <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">Better Opportunities</span>
          </h1>

          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            RafflesJobs is a premier recruitment and talent acquisition platform dedicated to bridging the gap between exceptional professionals and industry-leading organizations across technology, data, engineering, and corporate domains.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/jobs"
              className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl transition duration-300 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              Explore Jobs
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-xs sm:text-sm transition duration-300 flex items-center gap-2 active:scale-95 backdrop-blur-md cursor-pointer"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
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