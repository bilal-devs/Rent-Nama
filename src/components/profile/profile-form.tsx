"use client";

import { useState } from "react";
import { updateUserProfile } from "@/lib/actions/notifications";
import { useRouter } from "next/navigation";
import { User, Phone, Save } from "lucide-react";

export function ProfileEditForm({
  initialName,
  initialPhone,
}: {
  initialName: string;
  initialPhone: string;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const result = await updateUserProfile(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  return (
    <form
      action={handleSubmit}
      className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1 space-y-4"
    >
      <h3 className="text-sm font-semibold text-on-surface">Edit Profile</h3>

      {error && (
        <div className="p-2 rounded-lg bg-error-container text-on-error-container text-sm">{error}</div>
      )}
      {success && (
        <div className="p-2 rounded-lg bg-status-paid-bg text-status-paid text-sm animate-fade-in">Profile updated!</div>
      )}

      <div>
        <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            name="full_name"
            defaultValue={initialName}
            className="w-full h-12 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase">Phone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            name="phone"
            defaultValue={initialPhone}
            className="w-full h-12 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="+92 300 1234567"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </button>
    </form>
  );
}
