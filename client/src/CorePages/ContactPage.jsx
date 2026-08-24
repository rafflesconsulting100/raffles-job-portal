import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Building2,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Globe,
  Loader2
} from 'lucide-react';
import { showSuccess, showError } from '../Utils/toast';
import logo from '../assets/rafflelogo.png';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    queryType: 'Job Seeker Query',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // FAQ Accordion Toggle state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      showError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showSuccess('Thank you for contacting Raffles Consultancy! Our team will get back to you within 24 hours.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        queryType: 'Job Seeker Query',
        message: ''
      });
    }, 1000);
  };

  const contactCards = [
    {
      title: "Headquarters Office",
      desc: "Raffles Consultancy Tower, Sector 44, Gurugram / Connaught Place, New Delhi, India",
      icon: MapPin,
      badge: "Visit Us",
      color: "bg-blue-50 text-[#2B2A8C]"
    },
    {
      title: "Phone & Mobile",
      desc: "+91 (011) 4567 8900 / +91 98765 43210",
      icon: Phone,
      badge: "Call Us",
      color: "bg-purple-50 text-purple-700"
    },
    {
      title: "Email Assistance",
      desc: "info@rafflesconsultancy.com / careers@rafflesconsultancy.com",
      icon: Mail,
      badge: "Write Us",
      color: "bg-emerald-50 text-emerald-700"
    },
    {
      title: "Consultancy Hours",
      desc: "Monday - Saturday: 9:00 AM - 7:00 PM (IST)",
      icon: Clock,
      badge: "Timings",
      color: "bg-amber-50 text-amber-700"
    }
  ];

  const faqs = [
    {
      q: "Does Raffles Consultancy charge job seekers for placement services?",
      a: "No. Raffles Consultancy never charges job seekers or candidates any fees for job placement, resume review, or interview scheduling. Our placement services are 100% free for candidates."
    },
    {
      q: "How quickly can Raffles Consultancy source tech & leadership candidates?",
      a: "Our specialized talent acquisition team presents pre-screened candidate shortlists within 48 to 72 hours for tech, engineering, and executive search mandates."
    },
    {
      q: "What industries does Raffles Consultancy specialize in?",
      a: "We specialize in IT & Software Development, Global Capability Centers (GCCs), BFSI & Fintech, Healthcare & Life Sciences, E-Commerce, and Corporate Executive Search."
    },
    {
      q: "How can corporate employers partner with Raffles Consultancy?",
      a: "Employers can submit a query using the contact form on this page or email us directly at info@rafflesconsultancy.com. A dedicated Account Manager will connect with you immediately."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1e293b] pt-15 pb-16">
      {/* 1. HERO HEADER */}
      <section className="bg-linear-to-b from-slate-900 via-slate-900 to-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Get in Touch with Raffles Consultancy
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            We are Here to Help You Succeed
          </h1>

          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Have questions about open career opportunities, executive hiring, or strategic workforce consulting? Reach out to our team of recruitment experts today.
          </p>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {contactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center font-bold shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-[#1e293b]">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. MAIN FORM & SIDE INFORMATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-[#1e293b] flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#2B2A8C]" />
                Send Us a Message
              </h2>
              <p className="text-xs text-gray-500">
                Fill out the form below and our recruitment consultants will respond promptly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] transition"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] transition"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] transition"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    I am a...
                  </label>
                  <select
                    name="queryType"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] transition"
                    value={formData.queryType}
                    onChange={handleInputChange}
                  >
                    <option value="Job Seeker Query">Job Seeker Looking for Jobs</option>
                    <option value="Corporate Hiring Partner">Employer / Corporate Hiring Partner</option>
                    <option value="HR Advisory">HR Advisory & Payroll Consulting</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="How can Raffles Consultancy assist you today?"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] transition resize-none"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#2B2A8C] hover:bg-[#1E1D66] text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Inquiry
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Information & Map Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className=" bg-linear-to-br from-slate-800 via-slate-800/90 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Raffles Consultancy" className="h-16 w-auto p-2 rounded-xl" />
                <div>
                  <h3 className="text-lg font-black text-white">Raffles Consultancy</h3>
                  <p className="text-xs text-blue-200 font-semibold">Delhi NCR & Pan-India Offices</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-blue-100 border-t border-white/10 pt-5">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Corporate Head Office</p>
                    <p>Tower B, DLF Cyber City, Sector 24, Gurugram, Haryana 122002</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Regional Office</p>
                    <p>Barakhamba Road, Connaught Place, New Delhi 110001</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Global Reach</p>
                    <p>Serving placement mandates across India, Middle East (Dubai), and Southeast Asia.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Support Promise */}
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl space-y-2">
              <h4 className="text-sm font-extrabold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Prompt Response Guarantee
              </h4>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Our consultancy representatives respond to candidate inquiries and corporate hiring requirements within 24 business hours.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
