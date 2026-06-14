import { getPropertyById } from "@/lib/actions/properties";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, getStatusColor, formatStatus } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Users,
  Edit,
  MoreHorizontal,
} from "lucide-react";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const supabase = await createClient();

  // Get contracts for this property
  const { data: contracts } = await supabase
    .from("contracts")
    .select("*, users!contracts_tenant_id_fkey(full_name, email)")
    .eq("property_id", id)
    .order("created_at", { ascending: false });

  // Get rent records
  const { data: rentRecords } = await supabase
    .from("rent_records")
    .select("*")
    .eq("property_id", id)
    .order("due_date", { ascending: false })
    .limit(12);

  const activeContract = contracts?.find(
    (c) => c.contract_status === "active" || c.contract_status === "expiring_soon"
  );

  const tenant = activeContract?.users as { full_name: string; email: string } | null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/landlord/properties"
          className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-surface-variant flex items-center justify-center hover:bg-surface-container-low transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            {property.title}
          </h1>
          <p className="text-sm text-on-surface-variant capitalize">
            {property.property_type}{property.address ? ` • ${property.address}` : ""}
          </p>
        </div>
        <Link
          href={`/landlord/properties/${id}/edit`}
          className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-surface-variant flex items-center justify-center hover:bg-surface-container-low transition-colors"
        >
          <Edit className="w-5 h-5 text-on-surface-variant" />
        </Link>
      </div>

      {/* Property Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <CreditCard className="w-5 h-5 text-primary mb-2" />
          <p className="text-xs text-on-surface-variant">Monthly Rent</p>
          <p className="text-lg font-bold text-on-surface">{formatCurrency(property.monthly_rent)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <CreditCard className="w-5 h-5 text-secondary mb-2" />
          <p className="text-xs text-on-surface-variant">Security Deposit</p>
          <p className="text-lg font-bold text-on-surface">{formatCurrency(property.security_deposit)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <Calendar className="w-5 h-5 text-status-pending mb-2" />
          <p className="text-xs text-on-surface-variant">Due Day</p>
          <p className="text-lg font-bold text-on-surface">{property.rent_due_day}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <MapPin className="w-5 h-5 text-status-info mb-2" />
          <p className="text-xs text-on-surface-variant">City</p>
          <p className="text-lg font-bold text-on-surface">{property.city || "—"}</p>
        </div>
      </div>

      {/* Current Tenant */}
      <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
        <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-primary" />
          Current Tenant
        </h3>
        {tenant ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {tenant.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-on-surface">{tenant.full_name}</p>
              <p className="text-sm text-on-surface-variant">{tenant.email}</p>
            </div>
            {activeContract && (
              <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(activeContract.contract_status)}`}>
                {formatStatus(activeContract.contract_status)}
              </span>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-on-surface-variant mb-3">No tenant assigned yet</p>
            <Link
              href={`/landlord/contracts/new?property=${id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all"
            >
              <Users className="w-4 h-4" />
              Assign Tenant
            </Link>
          </div>
        )}
      </div>

      {/* Rent History */}
      {rentRecords && rentRecords.length > 0 && (
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-primary" />
            Rent History
          </h3>
          <div className="space-y-2">
            {rentRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors"
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
                <div className="text-right flex items-center gap-3">
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

      {/* Notes */}
      {property.notes && (
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <h3 className="text-sm font-semibold text-on-surface mb-2">Notes</h3>
          <p className="text-sm text-on-surface-variant whitespace-pre-wrap">{property.notes}</p>
        </div>
      )}
    </div>
  );
}
