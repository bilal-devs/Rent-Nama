import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, Download, BarChart3 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reports" };

export default async function LandlordReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get properties for summary
  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, monthly_rent")
    .eq("owner_id", user.id)
    .eq("status", "active");

  // Get current year rent records
  const year = new Date().getFullYear();
  const { data: rentRecords } = await supabase
    .from("rent_records")
    .select("*, properties(title)")
    .in("property_id", (properties || []).map(p => p.id))
    .gte("rent_month", `${year}-01-01`)
    .lte("rent_month", `${year}-12-31`)
    .order("rent_month", { ascending: true });

  const totalCollected = (rentRecords || []).filter(r => r.status === "paid").reduce((s, r) => s + Number(r.amount), 0);
  const totalPending = (rentRecords || []).filter(r => r.status !== "paid").reduce((s, r) => s + Number(r.amount), 0);
  const totalExpected = (rentRecords || []).reduce((s, r) => s + Number(r.amount), 0);
  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  // Monthly summary
  const monthlyMap = new Map<string, { month: string; collected: number; pending: number; total: number }>();
  (rentRecords || []).forEach((r) => {
    const month = new Date(r.rent_month).toLocaleDateString("en-US", { year: "numeric", month: "long" });
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { month, collected: 0, pending: 0, total: 0 });
    }
    const entry = monthlyMap.get(month)!;
    const amount = Number(r.amount);
    entry.total += amount;
    if (r.status === "paid") entry.collected += amount;
    else entry.pending += amount;
  });

  const monthlyData = Array.from(monthlyMap.values());

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Reports</h1>
        <p className="text-sm text-on-surface-variant mt-1">{year} Annual Overview</p>
      </div>

      {/* Year Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Total Expected</p>
          <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(totalExpected)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Collected</p>
          <p className="text-xl font-bold text-status-paid mt-1">{formatCurrency(totalCollected)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Pending</p>
          <p className="text-xl font-bold text-status-pending mt-1">{formatCurrency(totalPending)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Collection Rate</p>
          <p className="text-xl font-bold text-on-surface mt-1">{collectionRate}%</p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {monthlyData.length > 0 && (
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            Monthly Breakdown
          </h3>
          <div className="space-y-1">
            <div className="grid grid-cols-4 text-xs font-semibold text-on-surface-variant tracking-wider uppercase pb-2 border-b border-surface-variant">
              <span>Month</span>
              <span className="text-right">Expected</span>
              <span className="text-right">Collected</span>
              <span className="text-right">Pending</span>
            </div>
            {monthlyData.map((row, i) => (
              <div key={i} className="grid grid-cols-4 text-sm py-2.5 hover:bg-surface-container-low rounded-lg px-1 transition-colors">
                <span className="font-semibold text-on-surface">{row.month}</span>
                <span className="text-right text-on-surface-variant">{formatCurrency(row.total)}</span>
                <span className="text-right font-semibold text-status-paid">{formatCurrency(row.collected)}</span>
                <span className="text-right font-semibold text-status-pending">{formatCurrency(row.pending)}</span>
              </div>
            ))}
            {/* Totals */}
            <div className="grid grid-cols-4 text-sm py-2.5 border-t border-surface-variant font-bold px-1">
              <span className="text-on-surface">Total</span>
              <span className="text-right text-on-surface">{formatCurrency(totalExpected)}</span>
              <span className="text-right text-status-paid">{formatCurrency(totalCollected)}</span>
              <span className="text-right text-status-pending">{formatCurrency(totalPending)}</span>
            </div>
          </div>
        </div>
      )}

      {(rentRecords || []).length === 0 && (
        <div className="text-center py-16 rounded-xl bg-surface-container-lowest border border-surface-variant">
          <FileText className="w-8 h-8 text-outline mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-on-surface mb-1">No data for {year}</h3>
          <p className="text-sm text-on-surface-variant">Reports will generate once you have active contracts with rent records.</p>
        </div>
      )}
    </div>
  );
}
