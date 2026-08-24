import React from 'react';
import { ShieldCheckIcon, ZapIcon, GlobeIcon } from 'lucide-react';
import global from '../assets/global.png';
import verify from '../assets/verify.png';
import thunder from '../assets/thunder.png';


export default function AuthTemplate({ 
  children, 
  title = (
    <>
      Elevate Your Career <br />
      <span className="text-[#38BDF8]">With Global Leaders.</span>
    </>
  ),
  subtitle = "Join the elite circle of professionals. Access exclusive opportunities and personalized career growth strategies powered by enterprise recruitment technology.",
  features = [
    {
      icon: verify,
      title: "Verified Roles",
      description: "Direct corporate placements without middlemen."
    },
    {
      icon: thunder,
      title: "Fast-Track Hiring",
      description: "Direct pipeline connectivity with hiring managers."
    },
    {
      icon: global,
      title: "Global Reach",
      description: "Remote opportunities across international tech hubs."
    }
  ]
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 text-[#1A1A1A] pt-20 lg:pt-24 relative overflow-hidden">
      {/* Background ambient lighting blur circles */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-24 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid lg:grid-cols-12 gap-8 xl:gap-12 items-stretch">
           
          {/* LEFT BRAND VALUE PROPOSITION PANEL */}
          <div className="w-full lg:col-span-5 bg-linear-to-b from-slate-900 via-slate-900 to-[#0F172A] rounded-3xl p-8 md:p-10 xl:p-12 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-100 lg:min-h-auto">
            <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 skew-y-12 pointer-events-none" />

            <div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/70 text-sm mt-4 leading-relaxed max-w-sm">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Feature Value Highlights */}
            {features && features.length > 0 && (
              <div className="space-y-6 my-8 lg:my-0">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[#38BDF8]">
                        <img src={Icon} alt={feature.title} className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{feature.title}</h4>
                        <p className="text-xs text-white/50">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Brand Left Panel Footer */}
            <div className="text-[11px] text-white/40 font-light flex gap-4 border-t border-white/10 pt-4">
              <span>© 2026 Raffles Consulting</span>
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span className="hover:underline cursor-pointer">Terms</span>
            </div>
          </div>

          {/* RIGHT FORM CONTAINER PANEL */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 lg:p-10 xl:p-12 flex items-center justify-center">
            {children}
          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full bg-white border-t border-gray-200 px-6 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
        <span>© 2026 Raffles Consulting. All rights reserved.</span>
        <span className="font-medium">Secured by Raffles Enterprise Guard</span>
      </footer>
    </div>
  );
}
