"use client";

import { useState } from "react";
import { updateProperty, archiveProperty } from "@/lib/actions/properties";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Home,
  Store,
  Building,
  Layers,
  Briefcase,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { Property, PropertyType } from "@/types/database";

const propertyTypes: { value: PropertyType; label: string; icon: React.ElementType }[] = [
  { value: "house", label: "House", icon: Home },
  { value: "apartment", label: "Apartment", icon: Building },
  { value: "floor", label: "Floor", icon: Layers },
  { value: "shop", label: "Shop", icon: Store },
  { value: "office", label: "Office", icon: Briefcase },
  { value: "custom", label: "Other", icon: Settings },
];

export default function EditPropertyForm({ property }: { property: Property }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [selectedType, setSelectedType] = useState<PropertyType>(property.property_type);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("property_type", selectedType);
    const result = await updateProperty(property.id, formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(`/landlord/properties/${property.id}`);
      router.refresh();
    }
  }

  async function handleArchive() {
    if (!confirm("Are you sure you want to archive this property? This will hide it from active listings.")) {
      return;
    }
    setArchiving(true);
    setError(null);
    const result = await archiveProperty(property.id);
    if (result?.error) {
      setError(result.error);
      setArchiving(false);
    } else {
      router.push("/landlord/properties");
      router.refresh();
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/landlord/properties/${property.id}`}
            className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-surface-variant flex items-center justify-center hover:bg-surface-container-low transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              Edit Property
            </h1>
            <p className="text-sm text-on-surface-variant">
              Update details for {property.title}
            </p>
          </div>
        </div>

        {property.status === "active" && (
          <button
            type="button"
            onClick={handleArchive}
            disabled={archiving}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-error bg-error-container hover:bg-error-container/80 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Archive
          </button>
        )}
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-error-container text-on-error-container text-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Property Type Selection */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant p-5 card-elevation-1">
          <label className="block text-xs font-semibold text-on-surface mb-3 tracking-wider uppercase">
            Property Type
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSelectedType(type.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  selectedType === type.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-surface-variant hover:border-outline-variant text-on-surface-variant"
                }`}
              >
                <type.icon className="w-6 h-6" />
                <span className="text-xs font-semibold">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Details */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant p-5 card-elevation-1 space-y-4">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Basic Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="title">
              Property Name *
            </label>
            <input
              className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
              id="title"
              name="title"
              placeholder="e.g. Ground Floor Shop, Blue House"
              defaultValue={property.title}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="address">
                Address
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
                id="address"
                name="address"
                placeholder="Street address"
                defaultValue={property.address || ""}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="city">
                City
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
                id="city"
                name="city"
                placeholder="City name"
                defaultValue={property.city || ""}
              />
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant p-5 card-elevation-1 space-y-4">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="text-primary">₨</span>
            Financial Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="monthly_rent">
                Monthly Rent *
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
                id="monthly_rent"
                name="monthly_rent"
                placeholder="25000"
                type="number"
                min="0"
                defaultValue={property.monthly_rent}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="security_deposit">
                Security Deposit
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
                id="security_deposit"
                name="security_deposit"
                placeholder="50000"
                type="number"
                min="0"
                defaultValue={property.security_deposit}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="rent_due_day">
                Due Day (1-28) *
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
                id="rent_due_day"
                name="rent_due_day"
                placeholder="1"
                type="number"
                min="1"
                max="28"
                defaultValue={property.rent_due_day}
                required
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant p-5 card-elevation-1">
          <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="notes">
            Notes <span className="text-outline font-normal normal-case">(optional)</span>
          </label>
          <textarea
            className="w-full h-24 px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant resize-none"
            id="notes"
            name="notes"
            placeholder="Any additional notes about this property..."
            defaultValue={property.notes || ""}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <Link
            href={`/landlord/properties/${property.id}`}
            className="px-6 py-3 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all"
          >
            Cancel
          </Link>
          <button
            className="flex-1 md:flex-none px-8 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
