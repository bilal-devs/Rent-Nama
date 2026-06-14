"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/actions/auth";
import Link from "next/link";
import { Mail, Building2, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await resetPassword(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-[400px] animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-surface-container-high mb-4 card-elevation-1">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-on-surface-variant mt-2">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form
        action={handleSubmit}
        className="space-y-4 bg-surface p-6 rounded-xl card-elevation-2 border border-surface-variant"
      >
        {error && (
          <div className="p-3 rounded-lg bg-error-container text-on-error-container text-sm animate-fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-status-paid-bg text-status-paid text-sm animate-fade-in">
            {success}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
              <Mail className="w-5 h-5" />
            </span>
            <input
              className="w-full h-12 pl-11 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
              required
            />
          </div>
        </div>

        <button
          className="w-full h-12 bg-primary text-on-primary font-semibold text-lg rounded-lg hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      <div className="text-center mt-8">
        <Link
          className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          href="/login"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
