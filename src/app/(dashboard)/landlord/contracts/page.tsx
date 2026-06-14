import { getContracts } from "@/lib/actions/contracts";
import { getProperties, getRegisteredTenants } from "@/lib/actions/properties";
import { formatDate, getStatusColor, formatStatus, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus, FileText, ChevronRight } from "lucide-react";
import { CreateContractDialog } from "@/components/contracts/create-contract-dialog";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contracts" };

export default async function LandlordContractsPage() {
  const [contracts, properties, tenants] = await Promise.all([
    getContracts(),
    getProperties(),
    getRegisteredTenants(),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Contracts</h1>
          <p className="text-sm text-on-surface-variant mt-1">{contracts.length} total contracts</p>
        </div>
        <CreateContractDialog properties={properties} tenants={tenants} />
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-surface-container-lowest border border-surface-variant">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-outline" />
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-1">No contracts yet</h3>
          <p className="text-sm text-on-surface-variant mb-4 max-w-sm mx-auto">
            Create a contract and assign it to a property and tenant.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => {
            const property = contract.properties as { title: string; property_type: string } | null;
            const tenant = contract.users as { full_name: string; email: string } | null;
            return (
              <div
                key={contract.id}
                className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1 hover:card-elevation-2 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-on-surface">{property?.title || "Untitled"}</h3>
                      <p className="text-xs text-on-surface-variant">
                        {tenant ? tenant.full_name : "No tenant assigned"}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(contract.contract_status)}`}>
                    {formatStatus(contract.contract_status)}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  {contract.start_date && (
                    <div>
                      <p className="text-xs text-on-surface-variant">Start</p>
                      <p className="font-semibold text-on-surface">{formatDate(contract.start_date)}</p>
                    </div>
                  )}
                  {contract.end_date && (
                    <div>
                      <p className="text-xs text-on-surface-variant">End</p>
                      <p className="font-semibold text-on-surface">{formatDate(contract.end_date)}</p>
                    </div>
                  )}
                </div>

                {contract.contract_summary && (
                  <p className="text-sm text-on-surface-variant mt-3 line-clamp-2">{contract.contract_summary}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
