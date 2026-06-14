"use client";

import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications";
import { useRouter } from "next/navigation";
import { Check, CheckCheck } from "lucide-react";

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await markNotificationRead(id);
        router.refresh();
      }}
      className="text-xs text-primary hover:text-primary-container transition-colors font-semibold shrink-0"
    >
      <Check className="w-4 h-4" />
    </button>
  );
}

export function MarkAllReadButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await markAllNotificationsRead();
        router.refresh();
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-all"
    >
      <CheckCheck className="w-4 h-4" />
      Mark all read
    </button>
  );
}
