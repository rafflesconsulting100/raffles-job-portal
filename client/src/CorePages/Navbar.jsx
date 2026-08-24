// src/components/layout/Navbar.jsx

import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  BriefcaseBusiness,
  Building2,
  Info,
  Phone,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  UserCheck,ShieldCheck
} from "lucide-react";
import logo from "../assets/rafflelogo.png";

const navLinks = [
  {
    title: "Home",
    path: "/",
    icon: Home,
  },
  {
    title: "Jobs",
    path: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "About",
    path: "/about",
    icon: Info,
  },
  {
    title: "Contact",
    path: "/contact",
    icon: Phone,
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const syncUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);
    window.addEventListener("focus", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, []);

  useEffect(() => {
    syncUser();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  const handlePostJobClick = () => {
    if (user && user.role === "Employer") {
      navigate("/employer-dashboard?tab=post-job");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* ===================== NAVBAR ===================== */}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200"
            : "bg-[#0F172A] backdrop-blur-sm border-b border-slate-200/80 shadow-xs"
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-18 px-4 sm:px-6 lg:px-8">

            {/* ================= LOGO ================= */}

            <Link
              to="/"
              className="flex items-center shrink-0 group gap-1"
            >
              <img
                src={logo}
                alt="R"
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />

              <div className="leading-none">
                <h2
                  className={`text-xl md:text-3xl font-black tracking-tight  ${scrolled ? "text-[#2B2A8C]" : "text-white"
                    }`}
                >
                  raffles
                </h2>
              </div>
            </Link>

            {/* ================= NAVIGATION ================= */}

            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 font-catamaran">

              {navLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-base font-semibold transition duration-200 ${isActive
                        ? scrolled
                          ? "text-[#2B2A8C]"
                          : "text-white"
                        : scrolled
                          ? "text-gray-900 hover:text-[#2B2A8C]"
                          : "text-white/80 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={18} strokeWidth={2} />
                    {item.title}
                  </NavLink>
                );
              })}

            </nav>

            {/* ================= RIGHT SIDE ================= */}

            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to={
                      user?.role === "Admin"
                        ? "/admin-dashboard"
                        : user?.role === "Employer"
                        ? "/employer-dashboard"
                        : "/jobseeker-dashboard"
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-slate-700 transition hover:border-blue-200 hover:text-[#2563EB] flex items-center gap-1.5"
                  >
                    {user?.role === "Admin" ? (
                      <span className="flex items-center gap-1.5 text-purple-700 font-bold">
                        <ShieldCheck size={16} /> Admin Portal
                      </span>
                    ) : (
                      "Dashboard"
                    )}
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:shadow-md cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#2563EB] to-[#1D4ED8] text-sm font-bold text-white">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>

                      <div className="text-left">
                        <p className="max-w-30 truncate text-base font-semibold text-slate-900">
                          {user.username}
                        </p>

                        <p className="text-xs text-slate-500 font-medium">
                          {user.role}
                        </p>
                      </div>

                      <ChevronDown size={16} className="text-slate-400" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs text-slate-500">Signed in as</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">{user.username}</p>
                          <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            {user.role}
                          </span>
                        </div>

                        {/* <Link
                          to="/admin-dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 cursor-pointer"
                        >
                          <ShieldCheck size={16} className="text-purple-600" />
                          Admin Control Panel
                        </Link> */}

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer border-t border-slate-100"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`rounded-xl px-4 py-2 text-base font-semibold transition-all duration-200 ${scrolled
                        ? "text-slate-700 hover:bg-slate-100 hover:text-[#2563EB]"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1D4ED8] hover:shadow-xl hover:shadow-blue-600/30"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* ================= MOBILE BUTTON ================= */}

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
            >
              <Menu size={26} />
            </button>

          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      {/* Overlay */}

      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-all duration-300 lg:hidden ${mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
          }`}
      />

      {/* Drawer */}

      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-[86%] max-w-sm bg-white shadow-2xl transition-transform duration-300 lg:hidden flex flex-col ${mobileOpen
            ? "translate-x-0"
            : "translate-x-full"
          }`}
      >
        {/* Header */}

        <div className="flex items-center justify-between px-6 h-18 border-b border-slate-100">

          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 group"
          >
            <img
              src={logo}
              alt="R"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="leading-none">
              <h2 className="text-xl font-black tracking-tight text-[#2B2A8C]">
                raffles
              </h2>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X size={24} />
          </button>

        </div>

        {/* Navigation */}

        <div className="flex-1 overflow-y-auto py-4">

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `mx-4 mb-2 flex items-center gap-4 rounded-xl px-4 py-3.5 transition ${isActive
                    ? "bg-blue-50 text-[#2B2A8C] font-bold"
                    : "text-slate-700 hover:bg-slate-50 font-medium"
                  }`
                }
              >
                <Icon size={19} />
                <span className="text-sm">
                  {item.title}
                </span>
              </NavLink>
            );
          })}

          {user && user?.role?.toLowerCase() === "employer" && (
            <NavLink
              to="/employer-dashboard"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `mx-4 mb-2 flex items-center gap-4 rounded-xl px-4 py-3.5 transition ${isActive
                  ? "bg-[#2B2A8C] text-white font-bold"
                  : "bg-indigo-50 text-[#2B2A8C] font-semibold"
                }`
              }
            >
              <LayoutDashboard size={19} />
              <span className="text-sm">
                Employer Dashboard
              </span>
            </NavLink>
          )}

          {user && user?.role?.toLowerCase() !== "employer" && (
            <NavLink
              to="/jobseeker-dashboard"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `mx-4 mb-2 flex items-center gap-4 rounded-xl px-4 py-3.5 transition ${isActive
                  ? "bg-[#2B2A8C] text-white font-bold"
                  : "bg-indigo-50 text-[#2B2A8C] font-semibold"
                }`
              }
            >
              <LayoutDashboard size={19} />
              <span className="text-sm">
                Job Seeker Dashboard
              </span>
            </NavLink>
          )}

        </div>

        {/* Bottom Drawer Actions */}

        <div className="border-t border-slate-100 p-5 space-y-3">

          {user ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700 font-semibold">
                <span>Signed in as <strong>{user.username}</strong></span>
                <span className="bg-blue-100 text-[#2B2A8C] px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                  {user.role}
                </span>
              </div>


              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-rose-200 text-rose-600 font-semibold hover:bg-rose-50 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center h-12 rounded-xl border border-[#3B82F6] font-semibold text-slate-700 hover:bg-slate-50 transition text-sm"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold border border-transparent transition text-sm shadow-md"
              >
                Create Account
              </Link>
            </>
          )}

        </div>

      </aside>

    </>
  );
}