import { getTenantContract } from "@/lib/actions/contracts";
import { formatDate, getStatusColor, formatStatus, formatCurrency, getDaysUntil } from "@/lib/utils";
import { FileText, Calendar, Shield, Building2, Clock, CheckCircle2 } from "lucide-react";
import { SignContractButton } from "@/components/contracts/sign-contract-button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Contract" };

export default async function TenantContractPage() {
  const contract = await getTenantContract();

  if (!contract) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mb-6">My Contract</h1>
        <div className="text-center py-16 rounded-xl bg-surface-container-lowest border border-surface-variant">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-outline" />
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-1">No active contract</h3>
          <p className="text-sm text-on-surface-variant">Your landlord will create and assign a contract to you.</p>
        </div>
      </div>
    );
  }

  const property = contract.properties as Record<string, unknown> | null;
  const signatures = (contract.contract_signatures || []) as Array<Record<string, unknown>>;
  const events = (contract.contract_events || []) as Array<Record<string, unknown>>;
  const daysLeft = contract.end_date ? getDaysUntil(contract.end_date) : null;
  const needsSignature = contract.contract_status === "awaiting_signature";
  const mySignature = signatures.find((s) => s.signature_status === "pending");

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">My Contract</h1>
        <p className="text-sm text-on-surface-variant mt-1">View your rental agreement details</p>
      </div>

      {/* Signing Banner */}
      {needsSignature && mySignature && (
        <div className="p-5 rounded-xl bg-status-pending-bg border border-status-pending/20 animate-slide-up">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-status-pending shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-status-pending">Action Required: Sign Your Contract</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Your landlord has sent a contract for you to review and sign. Please read the details below and sign to activate.
              </p>
              <div className="mt-4">
                <SignContractButton contractId={contract.id} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Card */}
      <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-on-surface">Contract Status</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(contract.contract_status)}`}>
                {formatStatus(contract.contract_status)}
              </span>
            </div>
          </div>
          {daysLeft !== null && daysLeft > 0 && (
            <div className="text-right">
              <p className="text-xs text-on-surface-variant">Expires in</p>
              <p className={`text-lg font-bold ${daysLeft <= 30 ? "text-status-overdue" : "text-on-surface"}`}>
                {daysLeft} days
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {contract.start_date && (
            <div>
              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Start Date
              </p>
              <p className="text-sm font-semibold text-on-surface">{formatDate(contract.start_date)}</p>
            </div>
          )}
          {contract.end_date && (
            <div>
              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <Calendar className="w-3 h-3" /> End Date
              </p>
              <p className="text-sm font-semibold text-on-surface">{formatDate(contract.end_date)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Property Details */}
      {property && (
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            Property Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-on-surface-variant">Property</span>
              <span className="text-sm font-semibold text-on-surface">{property.title as string}</span>
            </div>
            {(property.address as string) && (
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">Address</span>
                <span className="text-sm font-semibold text-on-surface">
                  {property.address as string}{property.city ? `, ${property.city as string}` : ""}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-on-surface-variant">Monthly Rent</span>
              <span className="text-sm font-bold text-on-surface">{formatCurrency(property.monthly_rent as number)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-on-surface-variant">Security Deposit</span>
              <span className="text-sm font-semibold text-on-surface">{formatCurrency(property.security_deposit as number)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-on-surface-variant">Rent Due Day</span>
              <span className="text-sm font-semibold text-on-surface">{property.rent_due_day as number} of every month</span>
            </div>
          </div>
        </div>
      )}

      {/* Contract Summary */}
      {contract.contract_summary && (
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <h3 className="text-sm font-semibold text-on-surface mb-2">Contract Summary</h3>
          <p className="text-sm text-on-surface-variant whitespace-pre-wrap">{contract.contract_summary}</p>
        </div>
      )}

      {/* Contract Timeline */}
      {events.length > 0 && (
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            Timeline
          </h3>
          <div className="space-y-3">
            {(events as Array<{ event_type: string; event_note: string | null; created_at: string }>)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">{formatStatus(event.event_type)}</p>
                  {event.event_note && <p className="text-xs text-on-surface-variant">{event.event_note}</p>}
                  <p className="text-xs text-outline">{formatDate(event.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
