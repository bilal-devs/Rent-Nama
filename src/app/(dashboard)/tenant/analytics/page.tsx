import { getTenantAnalytics } from "@/lib/actions/analytics";
import { formatCurrency } from "@/lib/utils";
import { PaymentHistoryChart } from "@/components/analytics/charts";
import { BarChart3, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics" };

export default async function TenantAnalyticsPage() {
  const analytics = await getTenantAnalytics();

  if (!analytics) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Analytics</h1>
        <div className="text-center py-16 rounded-xl bg-surface-container-lowest border border-surface-variant mt-6">
          <BarChart3 className="w-8 h-8 text-outline mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant">No data yet. Analytics will appear once you have payment records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Analytics</h1>
        <p className="text-sm text-on-surface-variant mt-1">Your payment performance overview</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-paid/10 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-5 h-5 text-status-paid" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Total Paid</p>
          <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(analytics.totalPaid)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-pending/10 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-status-pending" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Pending</p>
          <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(analytics.totalPending)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">On-Time</p>
          <p className="text-xl font-bold text-on-surface mt-1">{analytics.onTimeRate}%</p>
        </div>
      </div>

      {/* Payment History Chart */}
      <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Payment History
        </h3>
        {analytics.monthlyData.length > 0 ? (
          <PaymentHistoryChart data={analytics.monthlyData} />
        ) : (
          <div className="flex items-center justify-center h-[300px] text-sm text-on-surface-variant">No data available</div>
        )}
      </div>

      {/* Payment Breakdown */}
      {analytics.monthlyData.length > 0 && (
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <h3 className="text-sm font-semibold text-on-surface mb-4">Monthly Breakdown</h3>
          <div className="space-y-2">
            {analytics.monthlyData.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${d.status === "paid" ? "bg-status-paid" : d.status === "overdue" ? "bg-status-overdue" : "bg-status-pending"}`} />
                  <span className="text-sm font-semibold text-on-surface">{d.month}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-on-surface">{formatCurrency(d.amount || 0)}</span>
                  <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    d.status === "paid" ? "bg-status-paid-bg text-status-paid" :
                    d.status === "overdue" ? "bg-status-overdue-bg text-status-overdue" : "bg-status-pending-bg text-status-pending"
                  }`}>
                    {d.status?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
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
