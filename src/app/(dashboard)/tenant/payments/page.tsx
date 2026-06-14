import { getRentRecords } from "@/lib/actions/payments";
import { formatCurrency, formatDate, getStatusColor, formatStatus } from "@/lib/utils";
import { MarkAsPaidButton } from "@/components/payments/payment-actions";
import { CreditCard, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Payments" };

export default async function TenantPaymentsPage() {
  const records = await getRentRecords("tenant");

  const pendingRecords = records.filter((r) => r.status === "pending" || r.status === "overdue");
  const confirmingRecords = records.filter((r) => r.status === "confirming");
  const paidRecords = records.filter((r) => r.status === "paid");
  const totalPaid = paidRecords.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalPending = pendingRecords.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">My Payments</h1>
        <p className="text-sm text-on-surface-variant mt-1">Track and manage your rent payments</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-paid/10 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-5 h-5 text-status-paid" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Total Paid</p>
          <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-pending/10 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-status-pending" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Pending</p>
          <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(totalPending)}</p>
        </div>
      </div>

      {/* Confirming */}
      {confirmingRecords.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-status-info" />
            Awaiting Landlord Confirmation ({confirmingRecords.length})
          </h2>
          <div className="space-y-2">
            {confirmingRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-status-info/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-status-info animate-pulse-soft" />
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{formatDate(record.rent_month)}</p>
                    <p className="text-xs text-on-surface-variant">Submitted • Waiting for confirmation</p>
                  </div>
                </div>
                <p className="text-base font-bold text-on-surface">{formatCurrency(Number(record.amount))}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Payments */}
      {pendingRecords.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-status-pending" />
            Due Payments ({pendingRecords.length})
          </h2>
          <div className="space-y-2">
            {pendingRecords.map((record) => (
              <div key={record.id} className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${record.status === "overdue" ? "bg-status-overdue" : "bg-status-pending"}`} />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{formatDate(record.rent_month)}</p>
                      <p className="text-xs text-on-surface-variant">Due: {formatDate(record.due_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-base font-bold text-on-surface">{formatCurrency(Number(record.amount))}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(record.status)}`}>
                        {formatStatus(record.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <MarkAsPaidButton rentRecordId={record.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid History */}
      {paidRecords.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-status-paid" />
            Paid ({paidRecords.length})
          </h2>
          <div className="space-y-2">
            {paidRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-surface-variant">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-status-paid" />
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{formatDate(record.rent_month)}</p>
                    <p className="text-xs text-on-surface-variant">
                      Paid: {record.paid_at ? formatDate(record.paid_at) : "—"}
                      {record.payment_method ? ` • ${formatStatus(record.payment_method)}` : ""}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-on-surface">{formatCurrency(Number(record.amount))}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {records.length === 0 && (
        <div className="text-center py-16 rounded-xl bg-surface-container-lowest border border-surface-variant">
          <CreditCard className="w-8 h-8 text-outline mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-on-surface mb-1">No payment records</h3>
          <p className="text-sm text-on-surface-variant">Payment records will appear once your contract is active.</p>
        </div>
      )}
    </div>
  );
}
