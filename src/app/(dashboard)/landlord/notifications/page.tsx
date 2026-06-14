import { getNotifications } from "@/lib/actions/notifications";
import { formatRelativeDate } from "@/lib/utils";
import { MarkAllReadButton, MarkReadButton } from "@/components/notifications/notification-actions";
import { Bell, FileText, CreditCard, Shield, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications" };

const typeIcons: Record<string, React.ElementType> = {
  contract: FileText,
  rent_record: CreditCard,
  signature: Shield,
};

export default async function LandlordNotificationsPage() {
  const notifications = await getNotifications();
  const unread = notifications.filter((n) => n.status === "sent");

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Notifications</h1>
          <p className="text-sm text-on-surface-variant mt-1">{unread.length} unread</p>
        </div>
        {unread.length > 0 && <MarkAllReadButton />}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-surface-container-lowest border border-surface-variant">
          <Bell className="w-8 h-8 text-outline mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-on-surface mb-1">All caught up!</h3>
          <p className="text-sm text-on-surface-variant">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.related_entity_type || ""] || Info;
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-all ${
                  notification.status === "sent"
                    ? "bg-surface-container-lowest border-primary/20 card-elevation-1"
                    : "bg-surface-container-low border-surface-variant"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notification.status === "sent" ? "bg-primary/10" : "bg-surface-container-high"
                  }`}>
                    <Icon className={`w-5 h-5 ${notification.status === "sent" ? "text-primary" : "text-outline"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-semibold ${notification.status === "sent" ? "text-on-surface" : "text-on-surface-variant"}`}>
                        {notification.title}
                      </h3>
                      {notification.status === "sent" && <MarkReadButton id={notification.id} />}
                    </div>
                    {notification.message && (
                      <p className="text-sm text-on-surface-variant mt-0.5">{notification.message}</p>
                    )}
                    <p className="text-xs text-outline mt-1">{formatRelativeDate(notification.created_at)}</p>
                  </div>
                  {notification.status === "sent" && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
