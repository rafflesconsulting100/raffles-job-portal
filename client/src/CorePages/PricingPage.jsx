import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  Mail,
  Headphones,
  ArrowRight,
  Star,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { showSuccess, showError } from '../Utils/toast';

import paytmLogo from '../assets/paytm.png';
import phonepeLogo from '../assets/phonepe.png';
import transcomLogo from '../assets/transcom.png';
import iciciLogo from '../assets/icici.png';
import hdbLogo from '../assets/hdb.png';

export default function PricingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for single vs multi hires tab toggle
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'multi'

  const handleBuyNow = (planName) => {
    showSuccess(`Selected ${planName}! Redirecting to checkout...`);
  };

  const handleRequestCallback = () => {
    showSuccess('Callback request received! Our hiring team will contact you within 30 minutes.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] pb-16">
      
      {/* 1. HERO HEADER */}
      <section className="bg-linear-to-b from-slate-900 via-slate-900 to-[#0F172A] text-white pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-300/80 mb-2">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Pricing Plans</span>
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Flexible Employer Hiring Plans
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Post Jobs & Hire the <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">Best Talent</span>
          </h1>

          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Choose a flexible single hire plan or customize your hiring volume. Find perfect matching candidates quickly with our automated screening.
          </p>

          {/* TOGGLE TAB CONTROL */}
          <div className="pt-4 flex justify-center">
            <div className="bg-slate-800/80 p-1.5 rounded-full border border-slate-700/60 inline-flex items-center gap-1 shadow-lg backdrop-blur-md">
              <button
                onClick={() => setActiveTab('single')}
                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  activeTab === 'single'
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Single Hire
              </button>
              <button
                onClick={() => setActiveTab('multi')}
                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  activeTab === 'multi'
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Multi Hires
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRICING CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">

          {/* CARD 1: BASIC */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase">
                  BASIC
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₹2000</span>
                  <span className="text-xs text-slate-400 font-medium">/ Month</span>
                </div>
                <p className="text-xs text-slate-500 font-semibold">Pay Upfront: ₹2499</p>
              </div>

              <button
                disabled
                className="w-full py-2.5 mt-5 bg-slate-300 text-slate-600 font-bold text-xs rounded-xl cursor-not-allowed text-center transition"
              >
                Currently Unavailable
              </button>

              <div className="border-t border-slate-100 my-5" />

              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span className="font-bold text-slate-800 leading-snug">
                    High reach — more relevant calls & applies for 'Faster Hiring'
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Keep only 01 job active</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Unlock 100 candidates profiles from database</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Post unlimited jobs and get unlimited responses</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Valid for 30 days</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Make job live & unlock candidates in one city</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CARD 2: PRO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase">
                  PRO
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₹3800</span>
                  <span className="text-xs text-slate-400 font-medium">/ Month</span>
                </div>
                <p className="text-xs text-slate-500 font-semibold">Pay Upfront: ₹4999</p>
              </div>

              <button
                disabled
                className="w-full py-2.5 mt-5 bg-slate-300 text-slate-600 font-bold text-xs rounded-xl cursor-not-allowed text-center transition"
              >
                Currently Unavailable
              </button>

              <div className="border-t border-slate-100 my-5" />

              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span className="font-bold text-slate-800 leading-snug">
                    High reach — more relevant calls & applies for 'Faster Hiring'
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Keep only 01 job active</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Unlock 300 candidates profiles from database</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Post unlimited jobs and get unlimited responses</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Valid for 90 days</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Make job live & unlock candidates in one city</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CARD 3: PREMIUM (MOST POPULAR) */}
          <div className="bg-white border-2 border-[#0052CC] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 relative flex flex-col justify-between">
            {/* MOST POPULAR BADGE */}
            <div className="absolute -top-3.5 right-6 bg-[#FF9900] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
              MOST POPULAR
            </div>

            <div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase">
                  PREMIUM
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₹5500</span>
                  <span className="text-xs text-slate-400 font-medium">/ Month</span>
                </div>
                <p className="text-xs text-slate-500 font-semibold">Pay Upfront: ₹11000</p>
              </div>

              <button
                disabled
                className="w-full py-2.5 mt-5 bg-[#0052CC] text-white font-bold text-xs rounded-xl shadow-md cursor-not-allowed text-center transition"
              >
                Currently Unavailable
              </button>

              <div className="border-t border-slate-100 my-5" />

              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span className="font-bold text-slate-800 leading-snug">
                    High reach — more relevant calls & applies for 'Faster Hiring'
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Keep only 01 job active</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Unlock 800 candidates profiles from database</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Post unlimited jobs and get unlimited responses</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Valid for 365 days</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Make job live & unlock candidates in one city</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CARD 4: Take a Top Up */}
          <div className="bg-white border-2 border-[#0052CC] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  Take a Top Up
                </h3>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-xl sm:text-2xl font-black text-slate-900">Starting @ ₹3500/-</span>
                  <span className="text-xs text-slate-400 font-medium">/ Month</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">for a single job post</p>
              </div>

              <button
                onClick={() => handleBuyNow('Single Job Post Top Up')}
                className="w-full py-2.5 mt-5 bg-[#0052CC] hover:bg-[#0040A8] text-white font-extrabold text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer text-center"
              >
                Buy Now
              </button>

              <div className="border-t border-slate-100 my-5" />

              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Add more jobposts</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Unlock more candidate profiles</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Increase job visibility</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Reach relevant candidates faster</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
                  <span>Flexible and pay only when needed</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HAVE MORE REQUIREMENTS CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-[#EBF3FF] border border-blue-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">

          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-lg font-black text-[#0F172A]">
              Have more requirements?
            </h3>
            <p className="text-xs text-slate-600">
              Get a custom plan that fits your hiring needs. Our team is here to help you.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 sm:gap-8">
            {/* Phone Support */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0052CC] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <a href="tel:+917397242159" className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-[#0052CC] transition">
                  +91 7397242159
                </a>
                <p className="text-[11px] text-slate-500 font-medium">Talk to Our Team</p>
              </div>
            </div>

            {/* Email Support */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0052CC] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left">
                <a href="mailto:hr@rafflesconsulting.in" className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-[#0052CC] transition">
                  hr@rafflesconsulting.in
                </a>
                <p className="text-[11px] text-slate-500 font-medium">Get Support via Email</p>
              </div>
            </div>

            {/* Request Callback Button */}
            <button
              onClick={handleRequestCallback}
              className="bg-white border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow px-4 py-2.5 rounded-2xl flex items-center gap-3 transition cursor-pointer active:scale-95"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>Request callback now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0052CC]" />
                </div>
                <span className="text-[10px] text-slate-500 block">We'll call you back</span>
              </div>
            </button>
          </div>

        </div>
      </section>

      {/* 4. TRUSTED BY LEADING COMPANIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">

          <div className="space-y-0.5 text-center md:text-left">
            <h4 className="text-sm font-extrabold text-slate-900">
              Trusted by Leading Companies
            </h4>
            <p className="text-xs text-slate-500">
              Businesses across India trust RafflesJobs to build their teams.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <img src={paytmLogo} alt="Paytm" className="h-7 sm:h-9 w-auto object-contain hover:scale-105 transition-transform" />
            <img src={phonepeLogo} alt="PhonePe" className="h-7 sm:h-9 w-auto object-contain hover:scale-105 transition-transform" />
            <img src={transcomLogo} alt="Transcom" className="h-7 sm:h-9 w-auto object-contain hover:scale-105 transition-transform" />
            <img src={iciciLogo} alt="ICICI Lombard" className="h-7 sm:h-9 w-auto object-contain hover:scale-105 transition-transform" />

          </div>

        </div>
      </section>

      {/* 5. WHAT RECRUITERS THINK ABOUT US (TESTIMONIALS) */}
      <section className="mt-16 bg-slate-50/70 border-t border-slate-200/60 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              What recruiters think about us
            </h2>
            <p className="text-xs sm:text-sm text-[#0052CC] font-semibold">
              37 Lakh recruiters have trusted RafflesJobs since 2015. Hear from their own words below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

            {/* TESTIMONIAL 1 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  "They helped us in closing 20+ opening for field sales for Trichy location."
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-extrabold text-slate-900">Tamilvendhan</p>
                <p className="text-[11px] text-slate-500 font-medium">Assistant Sales Manager, Paytm</p>
              </div>
            </div>

            {/* TESTIMONIAL 2 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  "As a small studio, we wanted one clean hire without spending fortune. The ₹2499 plan was exact fit for our one-off requirement."
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-extrabold text-slate-900">Sneha Patel</p>
                <p className="text-[11px] text-slate-500 font-medium">Founder, Bloom Studio</p>
              </div>
            </div>

            {/* TESTIMONIAL 3 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  "Consistently great support. The response quality is noticeably better than other platforms we have tried in past."
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-extrabold text-slate-900">Amit Sharma</p>
                <p className="text-[11px] text-slate-500 font-medium">Talent Acquisition, FinLeap</p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
