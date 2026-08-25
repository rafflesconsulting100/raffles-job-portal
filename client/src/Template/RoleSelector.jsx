// import React from 'react';
// import { User, Building2, Sparkles } from 'lucide-react';
// import candidate from '../assets/candidate.png';
// import employer from '../assets/employer.png';
// export default function RoleSelector({ 
//   selectedRole, 
//   onSelectRole,
//   roles 
// }) {
//   const defaultRoles = [
//     { 
//       id: 'Job Seeker', 
//       label: 'Job Seeker', 
//       subtitle: 'Candidate Portal',
//       icon: candidate
//     },
//     { 
//       id: 'Employer', 
//       label: 'Employer', 
//       subtitle: 'Hiring Partner',
//       icon: employer
//     }
//   ];

//   const activeRoles = roles && roles.length > 0 ? roles : defaultRoles;
//   const activeIndex = activeRoles.findIndex((r) => r.id === selectedRole);
//   const safeIndex = activeIndex >= 0 ? activeIndex : 0;

//   return (
//     <div className="space-y-1.5">
//       <div className="relative grid grid-cols-2 bg-slate-100/90 border border-slate-200/80 p-1.5 rounded-2xl shadow-inner select-none">
//         {/* Animated Sliding Background Pill */}
//         <div
//           className="absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-md shadow-[#2B2A8C]/10 border border-slate-200/60 transition-all duration-300 ease-out"
//           style={{
//             width: `calc(${100 / activeRoles.length}% - 6px)`,
//             left: `calc(${(safeIndex * 100) / activeRoles.length}% + 3px)`,
//           }}
//         />

//         {activeRoles.map((r) => {
//           const isActive = selectedRole === r.id;
//           const IconComponent = typeof r.icon === 'function' || (typeof r.icon === 'object' && r.icon !== null) ? r.icon : null;

//           return (
//             <button
//               key={r.id}
//               type="button"
//               role="tab"
//               aria-selected={isActive}
//               onClick={() => onSelectRole(r.id)}
//               className={`relative z-10 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 active:scale-95 ${
//                 isActive
//                   ? 'text-[#2B2A8C] font-extrabold'
//                   : 'text-slate-500 font-semibold hover:text-slate-800'
//               }`}
//             >
//               {/* Icon container */}
//               <div
//                 className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
//                   isActive
//                     ? 'bg-linear-to-br from-[#2B2A8C] to-[#3B3A9E] text-white shadow-xs scale-105'
//                     : 'bg-slate-200/70 text-slate-500'
//                 }`}
//               >
//                 {IconComponent ? (
//                   <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//                 ) : typeof r.icon === 'string' ? (
//                   <img src={r.icon} alt={r.label} className="w-6 h-6" />
//                 ) : (
//                   <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//                 )}
//               </div>

//               {/* Text Label & Subtitle */}
//               <div className="text-center sm:text-left leading-tight min-w-0">
//                 <span className="block text-[11px] sm:text-xs font-bold tracking-tight truncate">
//                   {r.label}
//                 </span>
//                 {r.subtitle ? (
//                   <span
//                     className={`hidden sm:block text-[9px] sm:text-[10px] transition-colors truncate ${
//                       isActive ? 'text-[#2B2A8C]/80 font-medium' : 'text-slate-400 font-normal'
//                     }`}
//                   >
//                     {r.subtitle}
//                   </span>
//                 ) : (
//                   <span
//                     className={`hidden sm:block text-[9px] sm:text-[10px] transition-colors truncate ${
//                       isActive ? 'text-[#2B2A8C]/80 font-medium' : 'text-slate-400 font-normal'
//                     }`}
//                   >
//                     {r.id === 'Job Seeker' ? 'Candidate Portal' : 'Hiring Partner'}
//                   </span>
//                 )}
//               </div>

//               {/* Active Dot Badge */}
//               {isActive && (
//                 <span className="absolute top-1 sm:top-2 right-1 sm:right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
//               )}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
import React from "react";
import { User } from "lucide-react";

import boy from "../assets/boy.png";
import employer from "../assets/employer.png";

export default function RoleSelector({
  selectedRole,
  onSelectRole,
  roles,
}) {
  const defaultRoles = [
    {
      id: "Job Seeker",
      label: "Job Seeker",
      subtitle: "Candidate Portal",
      icon: boy,
    },
    {
      id: "Employer",
      label: "Employer",
      subtitle: "Hiring Partner",
      icon: employer,
    },
  ];

  const activeRoles =
    roles && roles.length > 0 ? roles : defaultRoles;

  const activeIndex = activeRoles.findIndex(
    (r) => r.id === selectedRole
  );

  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className="w-full">
      <div className="relative grid grid-cols-2 gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1.5 shadow-inner backdrop-blur-sm select-none">

        {/* Animated Active Background */}
        <div
          className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-xl border border-blue-200/80 bg-white shadow-lg shadow-blue-500/10 transition-all duration-300 ease-out"
          style={{
            width: `calc(${100 / activeRoles.length}% - 6px)`,
            left: `calc(${(safeIndex * 100) / activeRoles.length}% + 3px)`,
          }}
        />

        {activeRoles.map((r) => {
          const isActive = selectedRole === r.id;

          const IconComponent =
            typeof r.icon === "function" ||
            (typeof r.icon === "object" && r.icon !== null)
              ? r.icon
              : null;

          return (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectRole(r.id)}
              className={`
                relative z-10 min-w-0 rounded-xl
                px-2 py-2.5 sm:px-3 sm:py-3
                flex items-center justify-center
                gap-2 sm:gap-2.5
                transition-all duration-300
                cursor-pointer
                active:scale-[0.98]
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500/40
                ${
                  isActive
                    ? "text-blue-700"
                    : "text-slate-500 hover:text-slate-800"
                }
              `}
            >
              {/* Icon */}
              <div
                className={`
                  relative flex h-8 w-8 sm:h-9 sm:w-9
                  shrink-0 items-center justify-center
                  rounded-xl
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 scale-105"
                      : "bg-slate-200/70 text-slate-500 group-hover:bg-slate-200"
                  }
                `}
              >
                {IconComponent ? (
                  <IconComponent className="h-4 w-4 sm:h-4.5 sm:w-[18px]" />
                ) : typeof r.icon === "string" ? (
                  <img
                    src={r.icon}
                    alt=""
                    className={`
                      h-7 w-7 sm:h-8 sm:w-8
                      object-contain
                      transition-transform duration-300
                      ${isActive ? "scale-105" : ""}
                    `}
                  />
                ) : (
                  <User className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1 text-left leading-tight">
                <span
                  className={`
                    block truncate text-[11px] sm:text-xs
                    tracking-tight transition-colors duration-300
                    ${
                      isActive
                        ? "font-extrabold text-slate-900"
                        : "font-semibold text-slate-600"
                    }
                  `}
                >
                  {r.label}
                </span>

                <span
                  className={`
                    hidden truncate text-[9px] sm:block sm:text-[10px]
                    transition-colors duration-300
                    ${
                      isActive
                        ? "font-medium text-blue-600/80"
                        : "font-normal text-slate-400"
                    }
                  `}
                >
                  {r.subtitle ||
                    (r.id === "Job Seeker"
                      ? "Candidate Portal"
                      : "Hiring Partner")}
                </span>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}