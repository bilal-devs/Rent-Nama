"use client";

import { useState } from "react";
import { createContract } from "@/lib/actions/contracts";
import { useRouter } from "next/navigation";
import { Plus, X, Search } from "lucide-react";
import type { Property } from "@/types/database";

interface Tenant {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
}

export function CreateContractDialog({
  properties,
  tenants,
}: {
  properties: Property[];
  tenants: Tenant[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const router = useRouter();

  const filteredTenants = tenants.filter(
    (t) =>
      t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    if (selectedTenant) {
      formData.set("tenant_id", selectedTenant.id);
    }
    const result = await createContract(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setOpen(false);
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all"
      >
        <Plus className="w-4 h-4" />
        New Contract
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-on-surface/40 z-50" onClick={() => setOpen(false)} />
      <div className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50 max-h-[80vh] overflow-y-auto bg-surface-container-lowest rounded-2xl card-elevation-3 animate-slide-up">
        <div className="sticky top-0 bg-surface-container-lowest border-b border-surface-variant p-5 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-on-surface">New Contract</h2>
          <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <form action={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-error-container text-on-error-container text-sm">{error}</div>
          )}

          {/* Property */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase">Property *</label>
            <select
              name="property_id"
              required
              className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select a property</option>
              {properties.filter(p => p.status === "active").map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* Tenant Selection */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase">
              Assign Tenant
            </label>
            {selectedTenant ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {selectedTenant.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{selectedTenant.full_name}</p>
                  <p className="text-xs text-on-surface-variant truncate">{selectedTenant.email}</p>
                </div>
                <button type="button" onClick={() => setSelectedTenant(null)} className="text-xs text-error font-semibold">Remove</button>
              </div>
            ) : (
              <div>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search registered tenants..."
                    className="w-full h-10 pl-9 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 rounded-lg border border-surface-variant">
                  {filteredTenants.length === 0 ? (
                    <p className="p-3 text-sm text-on-surface-variant text-center">No tenants found</p>
                  ) : (
                    filteredTenants.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => { setSelectedTenant(t); setSearch(""); }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-surface-container-low transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-semibold text-secondary">
                          {t.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-on-surface truncate">{t.full_name}</p>
                          <p className="text-xs text-on-surface-variant truncate">{t.email}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase">Start Date</label>
              <input
                type="date"
                name="start_date"
                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase">End Date</label>
              <input
                type="date"
                name="end_date"
                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase">Contract Summary</label>
            <textarea
              name="contract_summary"
              placeholder="Key contract terms..."
              className="w-full h-24 px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 h-12 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> : "Create Contract"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
