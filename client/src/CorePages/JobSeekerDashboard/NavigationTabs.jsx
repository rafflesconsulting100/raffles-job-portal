import React from "react";
import { LayoutDashboard, FileCheck, Bookmark, User, Bell } from "lucide-react";

export default function NavigationTabs({
  activeTab,
  handleTabSwitch,
  applicationsCount = 0,
  savedJobsCount = 0,
  unreadNotificationsCount = 0
}) {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "applications",
      label: "My Applications",
      icon: FileCheck,
      badge: applicationsCount,
      badgeBg: "bg-blue-100 text-[#2B2A8C]"
    },
    {
      id: "saved-jobs",
      label: "Saved Jobs",
      icon: Bookmark,
      badge: savedJobsCount,
      badgeBg: "bg-amber-100 text-amber-800"
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      badgeBg: "bg-rose-500 text-white font-bold"
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200/80 mb-8 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#0F172A] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon size={18} className={isActive ? "text-blue-400" : "text-slate-400"} />
              <span>{tab.label}</span>

              {tab.badge !== undefined && tab.badge !== null && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? "bg-blue-600 text-white" : tab.badgeBg
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
