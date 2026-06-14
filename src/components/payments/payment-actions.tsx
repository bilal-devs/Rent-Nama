"use client";

import { useState } from "react";
import { confirmPayment, rejectPayment, markAsPaid } from "@/lib/actions/payments";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export function PaymentActionButtons({
  rentRecordId,
  type,
}: {
  rentRecordId: string;
  type: "landlord" | "tenant";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (type === "landlord") {
    return (
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-variant">
        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await confirmPayment(rentRecordId);
            router.refresh();
          }}
          className="flex-1 h-10 bg-status-paid text-white rounded-lg text-sm font-semibold hover:bg-status-paid/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          Confirm
        </button>
        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await rejectPayment(rentRecordId);
            router.refresh();
          }}
          className="flex-1 h-10 border border-error/30 text-error rounded-lg text-sm font-semibold hover:bg-error-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Reject
        </button>
      </div>
    );
  }

  return null;
}

export function MarkAsPaidButton({ rentRecordId }: { rentRecordId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await markAsPaid(rentRecordId, formData);
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all"
      >
        Mark as Paid
      </button>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-surface-variant animate-fade-in">
      <form action={handleSubmit} className="space-y-3">
        <select
          name="method"
          className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm"
        >
          <option value="cash">Cash</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="easypaisa">Easypaisa</option>
          <option value="jazzcash">JazzCash</option>
          <option value="other">Other</option>
        </select>
        <input
          name="notes"
          placeholder="Reference / notes (optional)"
          className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm"
        />
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen(false)} className="flex-1 h-10 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface-variant">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-10 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
