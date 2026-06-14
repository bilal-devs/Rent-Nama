import { createClient } from "@/lib/supabase/server";
import { formatDate, getDaysUntil, formatCurrency } from "@/lib/utils";
import { Bell, AlertTriangle, Clock, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Renewals" };

export default async function LandlordRenewalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: contracts } = await supabase
    .from("contracts")
    .select("*, properties(title, monthly_rent), users!contracts_tenant_id_fkey(full_name, email)")
    .eq("landlord_id", user.id)
    .in("contract_status", ["active", "expiring_soon"])
    .not("end_date", "is", null)
    .order("end_date", { ascending: true });

  const now = new Date();
  const expiringSoon = (contracts || []).filter((c) => {
    const days = getDaysUntil(c.end_date!);
    return days > 0 && days <= 60;
  });
  const expired = (contracts || []).filter((c) => getDaysUntil(c.end_date!) <= 0);
  const active = (contracts || []).filter((c) => getDaysUntil(c.end_date!) > 60);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Renewals</h1>
        <p className="text-sm text-on-surface-variant mt-1">Track contract expirations and plan renewals</p>
      </div>

      {/* Expiring Soon */}
      {expiringSoon.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-status-pending" />
            Expiring Soon ({expiringSoon.length})
          </h2>
          <div className="space-y-3">
            {expiringSoon.map((contract) => {
              const property = contract.properties as { title: string; monthly_rent: number } | null;
              const tenant = contract.users as { full_name: string } | null;
              const daysLeft = getDaysUntil(contract.end_date!);
              return (
                <div key={contract.id} className="p-5 rounded-xl bg-surface-container-lowest border border-status-pending/30 card-elevation-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-on-surface">{property?.title}</h3>
                      <p className="text-xs text-on-surface-variant">{tenant?.full_name}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      daysLeft <= 7 ? "bg-status-overdue-bg text-status-overdue" :
                      daysLeft <= 30 ? "bg-status-pending-bg text-status-pending" :
                      "bg-status-info-bg text-status-info"
                    }`}>
                      {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="text-xs text-on-surface-variant">Expires</p>
                      <p className="font-semibold text-on-surface">{formatDate(contract.end_date!)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant">Rent</p>
                      <p className="font-semibold text-on-surface">{formatCurrency(property?.monthly_rent || 0)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expired */}
      {expired.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-status-overdue" />
            Expired ({expired.length})
          </h2>
          <div className="space-y-2">
            {expired.map((contract) => {
              const property = contract.properties as { title: string } | null;
              const tenant = contract.users as { full_name: string } | null;
              return (
                <div key={contract.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-status-overdue/20">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{property?.title}</p>
                    <p className="text-xs text-on-surface-variant">{tenant?.full_name} • Expired {formatDate(contract.end_date!)}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-status-overdue-bg text-status-overdue">Expired</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active (safe) */}
      {active.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-status-paid" />
            Active ({active.length})
          </h2>
          <div className="space-y-2">
            {active.map((contract) => {
              const property = contract.properties as { title: string } | null;
              const tenant = contract.users as { full_name: string } | null;
              return (
                <div key={contract.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-surface-variant">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{property?.title}</p>
                    <p className="text-xs text-on-surface-variant">{tenant?.full_name} • Expires {formatDate(contract.end_date!)}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-status-paid-bg text-status-paid">Active</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(contracts || []).length === 0 && (
        <div className="text-center py-16 rounded-xl bg-surface-container-lowest border border-surface-variant">
          <FileText className="w-8 h-8 text-outline mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-on-surface mb-1">No contracts with dates</h3>
          <p className="text-sm text-on-surface-variant">Set start/end dates on contracts to track renewals.</p>
        </div>
      )}
    </div>
  );
}
