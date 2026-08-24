import React from "react";
import { Bell, CheckCheck, Clock, Briefcase, CheckCircle2, XCircle, Info } from "lucide-react";

export default function NotificationsTab({
  notifications = [],
  loading = false,
  markNotificationAsRead,
  markAllNotificationsAsRead
}) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding your job application statuses
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm animate-pulse">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center">
          <Bell size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No notifications yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            You will be notified here whenever an employer reviews or updates your application status.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const timeAgo = notif.createdAt
              ? new Date(notif.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recently";

            const isStatusChange = notif.type === "status_change";
            const isAccepted = notif.message?.toLowerCase().includes("accepted");
            const isRejected = notif.message?.toLowerCase().includes("rejected");

            return (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && markNotificationAsRead(notif._id)}
                className={`p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                  notif.isRead
                    ? "bg-slate-50/40 border-slate-100 opacity-80"
                    : "bg-blue-50/30 border-blue-200 shadow-2xs font-medium"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isAccepted
                      ? "bg-emerald-100 text-emerald-600"
                      : isRejected
                      ? "bg-rose-100 text-rose-600"
                      : "bg-blue-100 text-[#2B2A8C]"
                  }`}
                >
                  {isAccepted ? (
                    <CheckCircle2 size={20} />
                  ) : isRejected ? (
                    <XCircle size={20} />
                  ) : (
                    <Bell size={20} />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-xs text-slate-900 leading-relaxed font-semibold">
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock size={12} /> {timeAgo}
                  </p>
                </div>

                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 mt-1" title="Unread" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
