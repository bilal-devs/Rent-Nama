"use client";

import { useState } from "react";
import { signContract } from "@/lib/actions/contracts";
import { useRouter } from "next/navigation";
import { Shield, Check } from "lucide-react";

export function SignContractButton({ contractId }: { contractId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSign() {
    if (!name.trim()) {
      setError("Please type your full name to sign.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await signContract(contractId, name.trim());
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all"
      >
        <Shield className="w-4 h-4" />
        Sign Contract
      </button>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1 animate-fade-in">
      <h4 className="text-sm font-semibold text-on-surface mb-3">Digital Signature</h4>
      <p className="text-xs text-on-surface-variant mb-3">
        By typing your full name below and clicking &quot;Sign &amp; Accept&quot;, you agree to the terms of this rental contract.
      </p>

      {error && (
        <div className="p-2 rounded-lg bg-error-container text-on-error-container text-xs mb-3">{error}</div>
      )}

      <div className="mb-4">
        <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase">
          Full Legal Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your full name"
          className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 font-semibold italic"
        />
      </div>

      {name.trim() && (
        <div className="p-3 rounded-lg bg-surface-container-low mb-4 text-center">
          <p className="text-xs text-on-surface-variant mb-1">Signature Preview</p>
          <p className="text-2xl font-bold text-primary italic tracking-wide">{name}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setOpen(false)}
          className="flex-1 h-10 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSign}
          disabled={loading || !name.trim()}
          className="flex-1 h-10 bg-status-paid text-white rounded-lg text-sm font-semibold hover:bg-status-paid/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4" />
              Sign &amp; Accept
            </>
          )}
        </button>
      </div>
    </div>
  );
}
