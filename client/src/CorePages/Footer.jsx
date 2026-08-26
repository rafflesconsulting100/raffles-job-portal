// src/components/layout/Footer.jsx

import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Send,
} from "lucide-react";
import { FaFacebook,FaInstagram, FaLinkedin, FaTwitter} from "react-icons/fa";
import logo from "../assets/rafflelogo.png";

const candidateLinks = [
  { name: "Browse Jobs", path: "/jobs" },
  { name: "Companies", path: "/companies" },
  { name: "Career Advice", path: "/career-advice" },
  { name: "Job Alerts", path: "/job-alerts" },
];

const employerLinks = [
  { name: "Post a Job", path: "/post-job" },
  { name: "Browse Candidates", path: "/candidates" },
  { name: "Recruitment Solutions", path: "/solutions" },
  { name: "Employer Login", path: "/employer/login" },
];

const companyLinks = [
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Our Team", path: "/team" },
  { name: "Privacy Policy", path: "/privacy" },
];

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-[#0F172A] text-gray-300">
      {/* Background */}

      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Newsletter */}

        <section className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-400 px-4 py-2 text-sm font-semibold">
                  Join Our Community
                </span>

                <h2 className="text-3xl md:text-4xl font-black text-white mt-5 leading-tight">
                  Get the latest jobs delivered directly to your inbox.
                </h2>

                <p className="mt-4 text-gray-400 max-w-xl leading-7">
                  Subscribe to receive personalized job recommendations, hiring
                  updates, interview tips, and career insights.
                </p>
              </div>

              <div>
                <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-3 shadow-2xl">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 h-14 px-5 rounded-xl outline-none text-gray-700"
                  />

                  <button className="h-14 px-7 rounded-xl bg-[#2563EB] hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center gap-2">
                    Subscribe
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}

        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Company */}

            <div className="lg:col-span-2">
              {/* <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg">

                  <BriefcaseBusiness
                    className="text-white"
                    size={24}
                  />

                </div> */}
              <Link to="/" className="flex items-center gap-1">
                <img
                  src={logo}
                  alt="Raffles Consultancy"
                  className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />

                <div>
                  <h2 className="text-4xl font-black text-white">raffles</h2>
                </div>
              </Link>

              <p className="mt-6 text-gray-400 leading-8 max-w-md">
                Connecting talented professionals with top employers across
                India and beyond. We help candidates find dream careers while
                enabling companies to hire exceptional talent faster.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-400" />

                  <span>hr@rafflesconsulting.in</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-400" />

                  <span>+91 7397242159</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-blue-400" />

                  <span>
                    24, Pavalam St, Veerappanchatram, Erode, Tamil Nadu
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#2563EB] transition flex items-center justify-center"
                >
                  <FaFacebook size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/company/raffle-consulting-in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#2563EB] transition flex items-center justify-center"
                >
                  <FaLinkedin size={18} />
                </a>

                <a
                  href="https://www.instagram.com/raffles_jobs?igsi=c2x4bDc1YmFzZWI5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#2563EB] transition flex items-center justify-center"
                >
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>

            {/* Candidates */}

            <div>
              <h3 className="text-white font-bold text-lg mb-6">
                For Candidates
              </h3>

              <ul className="space-y-4">
                {candidateLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="hover:text-blue-400 transition"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Employers */}

            <div>
              <h3 className="text-white font-bold text-lg mb-6">
                For Employers
              </h3>

              <ul className="space-y-4">
                {employerLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="hover:text-blue-400 transition duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}

            <div>
              <h3 className="text-white font-bold text-lg mb-6">Company</h3>

              <ul className="space-y-4">
                {companyLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="hover:text-blue-400 transition duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Statistics */}

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-blue-400" />

                  <span>500+ Hiring Companies</span>
                </div>

                <div className="flex items-center gap-3">
                  <BriefcaseBusiness size={18} className="text-blue-400" />

                  <span>25,000+ Active Jobs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom */}

        <section className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Raffles Consulting. All Rights
                  Reserved.
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Built with ❤️ for connecting talent with opportunities.
                </p>
              </div>

              {/* Footer Links */}

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <Link to="/privacy" className="hover:text-blue-400 transition">
                  Privacy
                </Link>

                <Link to="/terms" className="hover:text-blue-400 transition">
                  Terms
                </Link>

                <Link to="/cookies" className="hover:text-blue-400 transition">
                  Cookies
                </Link>

                <Link to="/support" className="hover:text-blue-400 transition">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Scroll To Top */}

      <button
        onClick={scrollTop}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}