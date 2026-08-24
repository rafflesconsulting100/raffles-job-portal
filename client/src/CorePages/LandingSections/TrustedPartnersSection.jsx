import React from 'react';

export default function TrustedPartnersSection() {
  // Helper to safely fetch logo asset if user adds it to src/assets folder
  const getAssetLogo = (fileName) => {
    try {
      return new URL(`../../assets/${fileName}`, import.meta.url).href;
    } catch {
      return null;
    }
  };

  const baseLogos = [
    { name: "Paytm", fileName: "paytm.png", fallbackText: "paytm", colorClass: "text-cyan-600 font-extrabold tracking-tighter" },
    { name: "PhonePe", fileName: "phonepe.png", fallbackText: "PhonePe", colorClass: "text-purple-600 font-black italic" },
    { name: "Transcom", fileName: "transcom.png", fallbackText: "Transcom", colorClass: "text-blue-900 font-bold uppercase tracking-widest" },
    { name: "ICICI Lombard", fileName: "icici.png", fallbackText: "icici.png", colorClass: "text-red-600 font-black" },
    { name: "HDB Financial", fileName: "hdb.png", fallbackText: "HDB Financial", colorClass: "text-slate-800 font-bold uppercase" },
  ];

  // Repeat logos to create a seamless infinite marquee scroll effect
  const marqueeLogos = [...baseLogos, ...baseLogos, ...baseLogos, ...baseLogos];

  return (
    <section className="w-full bg-linear-to-b from-white via-slate-50/60 to-white border-y border-slate-200/80 py-10 px-4 sm:px-6 lg:px-16 shadow-xs relative overflow-hidden">
      {/* Embed Inline Keyframes for Infinite Smooth Marquee Running Effect */}
      <style>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 30s linear infinite;
        }
        .animate-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 relative z-10">
        {/* Header Badge */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-linear-to-r from-transparent to-slate-300"></span>
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold text-center">
            Trusted by Industry Leaders Worldwide
          </span>
          <span className="h-px w-8 bg-linear-to-l from-transparent to-slate-300"></span>
        </div>

        {/* Marquee Running Container with Edge Fades */}
        <div className="relative w-full overflow-hidden">
          {/* Left & Right Smooth Gradient Mask Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Running Marquee Track */}
          <div className="animate-marquee-track flex items-center gap-6 sm:gap-10 py-2">
            {marqueeLogos.map((partner, index) => {
              const logoUrl = getAssetLogo(partner.fileName);

              return (
                <div 
                  key={index}
                  className="group relative flex items-center justify-center px-6 py-3 rounded-2xl bg-white border border-slate-100 hover:border-blue-200/80 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer min-w-35 sm:min-w-42.5 h-16 shrink-0"
                >
                  <img 
                    src={logoUrl} 
                    alt={partner.name} 
                    className="max-h-9 sm:max-h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      // Hide image element and show styled text logo badge fallback if PNG file isn't present
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = 'block';
                      }
                    }}
                  />

                  <div 
                    style={{ display: 'none' }}
                    className={`text-lg sm:text-xl transition-transform duration-300 group-hover:scale-105 ${partner.colorClass}`}
                  >
                    {partner.fallbackText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
