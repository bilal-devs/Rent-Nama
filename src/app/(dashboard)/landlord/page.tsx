import { getLandlordStats, getProperties } from "@/lib/actions/properties";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Building2,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  Plus,
  FileText,
  BarChart3,
  Bell,
  ChevronRight,
  Home,
  Store,
  Building,
  Layers,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

const propertyIcons: Record<string, React.ElementType> = {
  house: Home,
  apartment: Building,
  floor: Layers,
  shop: Store,
  office: Building2,
  custom: Building2,
};

export default async function LandlordDashboard() {
  const [stats, properties] = await Promise.all([
    getLandlordStats(),
    getProperties(),
  ]);

  const summaryCards = [
    {
      label: "Properties",
      value: stats?.totalProperties || 0,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/5",
    },
    {
      label: "Tenants",
      value: stats?.totalTenants || 0,
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "Collected",
      value: formatCurrency(stats?.collected || 0),
      icon: TrendingUp,
      color: "text-status-paid",
      bgColor: "bg-status-paid/10",
    },
    {
      label: "Pending",
      value: formatCurrency(stats?.pending || 0),
      icon: Clock,
      color: "text-status-pending",
      bgColor: "bg-status-pending/10",
    },
  ];

  const quickActions = [
    { label: "Add Property", href: "/landlord/properties/new", icon: Plus },
    { label: "Contracts", href: "/landlord/contracts", icon: FileText },
    { label: "Analytics", href: "/landlord/analytics", icon: BarChart3 },
    { label: "Reminders", href: "/landlord/notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Overview of your rental portfolio
          </p>
        </div>
        <Link
          href="/landlord/properties/new"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      {/* Expiring Contracts Banner */}
      {(stats?.expiringContracts || 0) > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-status-pending-bg border border-status-pending/20 animate-slide-up">
          <AlertTriangle className="w-5 h-5 text-status-pending shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-status-pending">
              {stats?.expiringContracts} contract{stats?.expiringContracts !== 1 ? "s" : ""} expiring soon
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Review and renew before they expire.
            </p>
          </div>
          <Link
            href="/landlord/renewals"
            className="text-xs font-semibold text-status-pending hover:text-status-pending/80 transition-colors"
          >
            View
          </Link>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="p-4 md:p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1 hover:card-elevation-2 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">
              {card.label}
            </p>
            <p className="text-xl md:text-2xl font-bold text-on-surface mt-1 tracking-tight">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
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

      {/* Properties Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">
            Your Properties
          </h2>
          <Link
            href="/landlord/properties"
            className="text-xs font-semibold text-primary hover:text-primary-container transition-colors tracking-wider uppercase flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-surface-container-lowest border border-surface-variant">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-outline" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-1">
              No properties yet
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Add your first property to get started.
            </p>
            <Link
              href="/landlord/properties/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.slice(0, 6).map((property) => {
              const Icon = propertyIcons[property.property_type] || Building2;
              return (
                <Link
                  key={property.id}
                  href={`/landlord/properties/${property.id}`}
                  className="group p-5 rounded-xl bg-surface-container-lowest border border-surface-variant hover:border-outline-variant card-elevation-1 hover:card-elevation-2 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant capitalize">
                      {property.property_type}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  {property.address && (
                    <p className="text-xs text-on-surface-variant mb-3 truncate">
                      {property.address}{property.city ? `, ${property.city}` : ""}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-surface-variant">
                    <div>
                      <p className="text-xs text-on-surface-variant">Monthly Rent</p>
                      <p className="text-base font-bold text-on-surface">
                        {formatCurrency(property.monthly_rent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-on-surface-variant">Due Day</p>
                      <p className="text-base font-bold text-on-surface">
                        {property.rent_due_day}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
