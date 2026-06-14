import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, getDaysUntil, getStatusColor, formatStatus } from "@/lib/utils";
import Link from "next/link";
import {
  Building2,
  FileText,
  CreditCard,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function TenantDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get active contract for this tenant
  const { data: contract } = await supabase
    .from("contracts")
    .select("*, properties(*)")
    .eq("tenant_id", user.id)
    .in("contract_status", ["active", "expiring_soon", "awaiting_signature"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Get recent rent records
  const { data: rentRecords } = await supabase
    .from("rent_records")
    .select("*")
    .eq("tenant_id", user.id)
    .order("due_date", { ascending: false })
    .limit(6);

  const property = contract?.properties as Record<string, unknown> | null;
  const nextDue = rentRecords?.find(r => r.status === "pending" || r.status === "overdue");
  const paidThisYear = rentRecords?.filter(r => r.status === "paid").reduce((sum, r) => sum + Number(r.amount), 0) || 0;
  const pendingAmount = rentRecords?.filter(r => r.status === "pending" || r.status === "overdue").reduce((sum, r) => sum + Number(r.amount), 0) || 0;

  const contractDaysLeft = contract?.end_date ? getDaysUntil(contract.end_date) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Your rental overview at a glance
        </p>
      </div>

      {/* Contract Expiry Banner */}
      {contractDaysLeft !== null && contractDaysLeft <= 30 && contractDaysLeft > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-status-pending-bg border border-status-pending/20 animate-slide-up">
          <AlertTriangle className="w-5 h-5 text-status-pending shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-status-pending">
              Contract expires in {contractDaysLeft} day{contractDaysLeft !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Contact your landlord about renewal.
            </p>
          </div>
        </div>
      )}

      {/* Property Card */}
      {property ? (
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-on-surface">
                {property.title as string}
              </h2>
              {(property.address as string) && (
                <p className="text-sm text-on-surface-variant truncate">
                  {property.address as string}{property.city ? `, ${property.city as string}` : ""}
                </p>
              )}
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-xs text-on-surface-variant">Monthly Rent</p>
                  <p className="text-lg font-bold text-on-surface">
                    {formatCurrency(property.monthly_rent as number)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant">Due Day</p>
                  <p className="text-lg font-bold text-on-surface">
                    {property.rent_due_day as number}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 rounded-xl bg-surface-container-lowest border border-surface-variant">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-outline" />
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-1">
            No property assigned
          </h3>
          <p className="text-sm text-on-surface-variant">
            Your landlord will assign you to a property.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-paid/10 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-status-paid" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">
            Paid
          </p>
          <p className="text-xl font-bold text-on-surface mt-1">
            {formatCurrency(paidThisYear)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-pending/10 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-status-pending" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">
            Pending
          </p>
          <p className="text-xl font-bold text-on-surface mt-1">
            {formatCurrency(pendingAmount)}
          </p>
        </div>
      </div>

      {/* Next Due Card */}
      {nextDue && (
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-status-pending/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-status-pending" />
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">
                  Next Payment Due
                </p>
                <p className="text-lg font-bold text-on-surface">
                  {formatDate(nextDue.due_date)} — {formatCurrency(Number(nextDue.amount))}
                </p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(nextDue.status)}`}>
              {formatStatus(nextDue.status)}
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Contract", href: "/tenant/contract", icon: FileText },
          { label: "Payments", href: "/tenant/payments", icon: CreditCard },
          { label: "Analytics", href: "/tenant/analytics", icon: BarChart3 },
          { label: "Notifications", href: "/tenant/notifications", icon: AlertTriangle },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-surface-variant hover:border-outline-variant hover:bg-surface-container-low transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-container-high group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <action.icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-semibold text-on-surface">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent Payments */}
      {rentRecords && rentRecords.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-on-surface">
              Recent Payments
            </h2>
            <Link
              href="/tenant/payments"
              className="text-xs font-semibold text-primary hover:text-primary-container transition-colors tracking-wider uppercase flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {rentRecords.slice(0, 4).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-surface-variant"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    record.status === "paid" ? "bg-status-paid" :
                    record.status === "overdue" ? "bg-status-overdue" : "bg-status-pending"
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      {formatDate(record.rent_month)}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Due: {formatDate(record.due_date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-on-surface">
                    {formatCurrency(Number(record.amount))}
                  </p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(record.status)}`}>
                    {formatStatus(record.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
