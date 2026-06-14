import { getProperties } from "@/lib/actions/properties";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Plus,
  Building2,
  Home,
  Store,
  Building,
  Layers,
  Search,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties",
};

const propertyIcons: Record<string, React.ElementType> = {
  house: Home,
  apartment: Building,
  floor: Layers,
  shop: Store,
  office: Building2,
  custom: Building2,
};

export default async function PropertiesPage() {
  const properties = await getProperties();
  const activeProperties = properties.filter((p) => p.status === "active");
  const archivedProperties = properties.filter((p) => p.status === "archived");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Properties
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {activeProperties.length} active propert{activeProperties.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Link
          href="/landlord/properties/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-surface-container-lowest border border-surface-variant">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-outline" />
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-1">
            No properties yet
          </h3>
          <p className="text-sm text-on-surface-variant mb-6 max-w-sm mx-auto">
            Start by adding your first property. You can then assign tenants and manage contracts.
          </p>
          <Link
            href="/landlord/properties/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Your First Property
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProperties.map((property) => {
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

          {archivedProperties.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-on-surface-variant mb-4">
                Archived ({archivedProperties.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                {archivedProperties.map((property) => {
                  const Icon = propertyIcons[property.property_type] || Building2;
                  return (
                    <div
                      key={property.id}
                      className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                          <Icon className="w-5 h-5 text-outline" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-on-surface-variant">
                            {property.title}
                          </h3>
                          <p className="text-sm text-outline">
                            {formatCurrency(property.monthly_rent)}/month
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
