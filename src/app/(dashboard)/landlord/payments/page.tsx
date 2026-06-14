import { getRentRecords } from "@/lib/actions/payments";
import { formatCurrency, formatDate, getStatusColor, formatStatus } from "@/lib/utils";
import { PaymentActionButtons } from "@/components/payments/payment-actions";
import { CreditCard, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payments" };

export default async function LandlordPaymentsPage() {
  const records = await getRentRecords("landlord");

  const confirming = records.filter((r) => r.status === "confirming");
  const pending = records.filter((r) => r.status === "pending" || r.status === "overdue");
  const paid = records.filter((r) => r.status === "paid");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Payments</h1>
        <p className="text-sm text-on-surface-variant mt-1">Track and confirm rent payments</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-pending/10 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-status-pending" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Awaiting</p>
          <p className="text-xl font-bold text-on-surface">{confirming.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-overdue/10 flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5 text-status-overdue" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Pending</p>
          <p className="text-xl font-bold text-on-surface">{pending.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-paid/10 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-5 h-5 text-status-paid" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Confirmed</p>
          <p className="text-xl font-bold text-on-surface">{paid.length}</p>
        </div>
      </div>

      {/* Awaiting Confirmation */}
      {confirming.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-status-pending" />
            Awaiting Your Confirmation ({confirming.length})
          </h2>
          <div className="space-y-2">
            {confirming.map((record) => {
              const property = record.properties as { title: string } | null;
              const tenant = record.users as { full_name: string } | null;
              return (
                <div key={record.id} className="p-4 rounded-xl bg-surface-container-lowest border border-status-pending/30 card-elevation-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-status-pending animate-pulse-soft" />
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{property?.title}</p>
                        <p className="text-xs text-on-surface-variant">{tenant?.full_name} • {formatDate(record.rent_month)}</p>
                      </div>
                    </div>
                    <p className="text-base font-bold text-on-surface">{formatCurrency(Number(record.amount))}</p>
                  </div>
                  <PaymentActionButtons rentRecordId={record.id} type="landlord" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Records */}
      <div>
        <h2 className="text-lg font-semibold text-on-surface mb-3">All Records</h2>
        {records.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-surface-container-lowest border border-surface-variant">
            <CreditCard className="w-8 h-8 text-outline mx-auto mb-3" />
            <p className="text-sm text-on-surface-variant">No payment records yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((record) => {
              const property = record.properties as { title: string } | null;
              const tenant = record.users as { full_name: string } | null;
              return (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-surface-variant">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      record.status === "paid" ? "bg-status-paid" :
                      record.status === "overdue" ? "bg-status-overdue" :
                      record.status === "confirming" ? "bg-status-pending" : "bg-outline"
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{property?.title}</p>
                      <p className="text-xs text-on-surface-variant">{tenant?.full_name} • Due: {formatDate(record.due_date)}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className="text-sm font-bold text-on-surface">{formatCurrency(Number(record.amount))}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(record.status)}`}>
                      {formatStatus(record.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
