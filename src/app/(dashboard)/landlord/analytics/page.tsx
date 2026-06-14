import { getLandlordAnalytics } from "@/lib/actions/analytics";
import { formatCurrency } from "@/lib/utils";
import { CollectionChart, OccupancyDonut } from "@/components/analytics/charts";
import { BarChart3, TrendingUp, Clock, Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics" };

export default async function LandlordAnalyticsPage() {
  const analytics = await getLandlordAnalytics();

  if (!analytics) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Analytics</h1>
        <div className="text-center py-16 rounded-xl bg-surface-container-lowest border border-surface-variant mt-6">
          <BarChart3 className="w-8 h-8 text-outline mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant">No data yet. Add properties and contracts to see analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Analytics</h1>
        <p className="text-sm text-on-surface-variant mt-1">Rental portfolio performance overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-paid/10 flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-status-paid" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Total Collected</p>
          <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(analytics.totalCollected)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-status-pending/10 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-status-pending" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Total Pending</p>
          <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(analytics.totalPending)}</p>
        </div>
        <div className="col-span-2 lg:col-span-1 p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-2">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Occupancy Rate</p>
          <p className="text-xl font-bold text-on-surface mt-1">{analytics.occupancyRate}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Collection Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Collection Trends (Last 12 Months)
          </h3>
          {analytics.monthlyData.length > 0 ? (
            <CollectionChart data={analytics.monthlyData} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-sm text-on-surface-variant">No data available</div>
          )}
        </div>

        {/* Occupancy Donut */}
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <h3 className="text-sm font-semibold text-on-surface mb-4">Occupancy</h3>
          <OccupancyDonut rate={analytics.occupancyRate} />
        </div>
      </div>

      {/* Property Breakdown */}
      {analytics.properties.length > 0 && (
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <h3 className="text-sm font-semibold text-on-surface mb-4">Per-Property Breakdown</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-4 text-xs font-semibold text-on-surface-variant tracking-wider uppercase pb-2 border-b border-surface-variant">
              <span>Property</span>
              <span className="text-right">Rent</span>
              <span className="text-right">Collected</span>
              <span className="text-right">Pending</span>
            </div>
            {analytics.properties.map((p, i) => (
              <div key={i} className="grid grid-cols-4 text-sm py-2 hover:bg-surface-container-low rounded-lg px-1 transition-colors">
                <span className="font-semibold text-on-surface truncate pr-2">{p.name}</span>
                <span className="text-right text-on-surface-variant">{formatCurrency(p.rent)}</span>
                <span className="text-right font-semibold text-status-paid">{formatCurrency(p.collected)}</span>
                <span className="text-right font-semibold text-status-pending">{formatCurrency(p.pending)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
