import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  Clock,
  Send,
  Building2,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Loader2,
  User,
  UserCheck,
  ExternalLink,
  Copy,
  Check,
  Headphones,
  MapPin
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
  const [copiedText, setCopiedText] = useState(null);

  // FAQ Accordion Toggle state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showSuccess(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedText(null), 2500);
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

  // 3 Contact Cards based on active business details (Headquarters card excluded as commented)
  const contactCards = [
    {
      title: "Phone & Mobile",
      desc: "+91 7397242159",
      subdesc: "Mon - Fri, 9:30 AM - 6:30 PM",
      icon: Phone,
      badge: "Call Us",
      color: "bg-purple-50 text-purple-700 border-purple-100",
      actionText: "Call Now",
      link: "tel:+917397242159"
    },
    {
      title: "Email Assistance",
      desc: "hr@rafflesconsulting.in",
      subdesc: "Average response under 24 hours",
      icon: Mail,
      badge: "Write Us",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      actionText: "Send Email",
      link: "mailto:hr@rafflesconsulting.in"
    },
    {
      title: "Consultancy Hours",
      desc: "Monday - Friday: 9:30 AM - 6:30 PM (IST)",
      subdesc: "Closed on Sundays",
      icon: Clock,
      badge: "Timings",
      color: "bg-amber-50 text-amber-700 border-amber-100",
      actionText: "Mon - Fri",
      link: null
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
      a: "Employers can submit a query using the contact form on this page or email us directly at hr@rafflesconsulting.in. A dedicated Account Manager will connect with you immediately."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1e293b] pt-15 pb-16">
      {/* 1. HERO HEADER */}
      <section className="bg-linear-to-b from-slate-900 via-slate-900 to-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-300/80 mb-2">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Contact Us</span>
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/20 shadow-xs">
            Get in Touch with Raffles Consulting
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            We Are Here to Help You <span className="bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Succeed</span>
          </h1>

          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Have questions about open career opportunities, executive hiring, or strategic workforce consulting? Reach out to our team of recruitment experts today.
          </p>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS GRID (3 Cards matching active requirements) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {contactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#1e293b]">{card.title}</h3>
                  <p className="text-xs text-gray-700 leading-relaxed font-bold">{card.desc}</p>
                  {card.subdesc && <p className="text-[11px] text-gray-400">{card.subdesc}</p>}
                </div>

                {card.link ? (
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                    <a
                      href={card.link}
                      target={card.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#2B2A8C] hover:text-indigo-800 flex items-center gap-1 transition-colors"
                    >
                      {card.actionText}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {card.title.includes('Phone') && (
                      <button
                        onClick={() => handleCopy('+917397242159', 'Phone Number')}
                        title="Copy Phone Number"
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition cursor-pointer"
                      >
                        {copiedText === 'Phone Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    {card.title.includes('Email') && (
                      <button
                        onClick={() => handleCopy('hr@rafflesconsulting.in', 'Email Address')}
                        title="Copy Email Address"
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition cursor-pointer"
                      >
                        {copiedText === 'Email Address' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Active Support
                    </span>
                  </div>
                )}
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
              <h2 className="text-2xl font-extrabold text-[#1e293b] flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 rounded-xl text-[#2B2A8C]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                Send Us a Message
              </h2>
              <p className="text-xs text-gray-500">
                Fill out the form below and our recruitment consultants will respond promptly within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="John Doe"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/20 transition"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/20 transition"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/20 transition"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    I am a...
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <select
                      name="queryType"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/20 transition appearance-none"
                      value={formData.queryType}
                      onChange={handleInputChange}
                    >
                      <option value="Job Seeker Query">Job Seeker Looking for Jobs</option>
                      <option value="Corporate Hiring Partner">Employer / Corporate Hiring Partner</option>
                      <option value="HR Advisory">HR Advisory & Payroll Consulting</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
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
                  placeholder="How can Raffles Consultancy assist you today? Provide details on the positions or support required..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/20 transition resize-none"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#2B2A8C] hover:bg-[#1E1D66] text-white rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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

          {/* Right Information & Office Location (Only Head Office as per commented preference) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden border border-slate-700/50">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Raffles Consulting" className="h-14 w-auto p-1.5 rounded-xl bg-white/10 backdrop-blur-xs" />
                <div>
                  <h3 className="text-lg font-black text-white">Raffles Consulting</h3>
                  <p className="text-xs text-blue-300 font-semibold">Tamil Nadu Office</p>
                </div>
              </div>

              {/* Office Details */}
              <div className="space-y-4 text-xs text-blue-100 border-t border-white/10 pt-5">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-amber-400/10 rounded-xl border border-amber-400/20 text-amber-400 shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Corporate Head Office</p>
                    <p className="mt-1 leading-relaxed text-slate-300">
                      24, Pavalam St, Municipal Colony, Veerappanchatram, Erode, Tamil Nadu 638004
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Location Map Frame */}
            <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2B2A8C]" />
                  Headquarters Location Map
                </span>
                <a
                  href="https://maps.google.com/?q=24+Pavalam+St+Municipal+Colony+Erode+Tamil+Nadu+638004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#2B2A8C] hover:underline flex items-center gap-1"
                >
                  Get Directions
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="h-48 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                <iframe
                  title="Raffles Consultancy Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.8906915152865!2d77.7187121!3d11.342423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f42c33efb1b%3A0xa618bf5d96a56e07!2sMunicipal%20Colony%2C%20Veerappanchatram%2C%20Erode%2C%20Tamil%20Nadu%20638004!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Quick Support Promise */}
            <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-2">
              <h4 className="text-sm font-extrabold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                Prompt Response Guarantee
              </h4>
              <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                Our consultancy representatives respond to candidate inquiries and corporate hiring requirements within 24 business hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION (Rendered from component faqs & openFaqIndex state) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center space-y-3 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[#2B2A8C] text-xs font-bold border border-blue-100">
            <HelpCircle className="w-3.5 h-3.5" />
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1e293b]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-base text-gray-500 max-w-xl mx-auto">
            Find answers to common questions regarding candidate placement, employer mandates, and consultancy services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen ? 'border-[#2B2A8C]/30 shadow-md ring-1 ring-[#2B2A8C]/10' : 'border-gray-200 hover:border-gray-300 shadow-xs'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm font-bold text-[#1e293b] flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 text-[#2B2A8C] text-xs font-black flex items-center justify-center shrink-0">
                      Q{index + 1}
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#2B2A8C]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    <p className="pl-9 font-medium">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

