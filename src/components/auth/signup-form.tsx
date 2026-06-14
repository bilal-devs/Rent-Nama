"use client";

import { useState } from "react";
import { signUp } from "@/lib/actions/auth";
import Link from "next/link";
import { Mail, Lock, User, Phone, Building2, Home, UserCheck } from "lucide-react";
import type { UserRole } from "@/types/database";

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState<"role" | "details">("role");

  async function handleSubmit(formData: FormData) {
    if (!selectedRole) return;
    setLoading(true);
    setError(null);
    formData.set("role", selectedRole);
    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setSuccess(result.success);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-surface-container-high mb-4 card-elevation-1">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-[32px] font-bold text-primary tracking-tight leading-10">
          Join Rent Nama
        </h1>
        <p className="text-sm text-on-surface-variant mt-2">
          {step === "role"
            ? "Select your role to get started."
            : "Fill in your details to create an account."}
        </p>
      </div>

      {step === "role" ? (
        /* Role Selection */
        <div className="space-y-4 bg-surface p-6 rounded-xl card-elevation-2 border border-surface-variant">
          <button
            type="button"
            onClick={() => {
              setSelectedRole("landlord");
              setStep("details");
            }}
            className="w-full p-5 rounded-xl border-2 border-outline-variant hover:border-primary bg-surface-container-lowest hover:bg-surface-container-low transition-all flex items-start gap-4 group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-on-surface">
                Landlord
              </h3>
              <p className="text-sm text-on-surface-variant mt-1">
                I own properties and want to manage tenants, contracts, and rent
                collection.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole("tenant");
              setStep("details");
            }}
            className="w-full p-5 rounded-xl border-2 border-outline-variant hover:border-primary bg-surface-container-lowest hover:bg-surface-container-low transition-all flex items-start gap-4 group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
              <UserCheck className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-on-surface">Tenant</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                I am renting a property and want to track my rent, contracts,
                and payments.
              </p>
            </div>
          </button>
        </div>
      ) : (
        /* Details Form */
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

          {/* Role badge */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              {selectedRole === "landlord" ? (
                <Home className="w-4 h-4 text-primary" />
              ) : (
                <UserCheck className="w-4 h-4 text-secondary" />
              )}
            </div>
            <span className="text-sm font-semibold text-on-surface capitalize">
              {selectedRole}
            </span>
            <button
              type="button"
              onClick={() => setStep("role")}
              className="ml-auto text-xs text-primary hover:text-primary-container transition-colors font-semibold tracking-wider uppercase"
            >
              Change
            </button>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <User className="w-5 h-5" />
              </span>
              <input
                className="w-full h-12 pl-11 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                type="text"
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="phone">
              Phone <span className="text-outline font-normal normal-case">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <Phone className="w-5 h-5" />
              </span>
              <input
                className="w-full h-12 pl-11 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
                id="phone"
                name="phone"
                placeholder="+92 300 1234567"
                type="tel"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <Lock className="w-5 h-5" />
              </span>
              <input
                className="w-full h-12 pl-11 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
                id="password"
                name="password"
                placeholder="Minimum 6 characters"
                type="password"
                minLength={6}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            className="w-full h-12 mt-4 bg-primary text-on-primary font-semibold text-lg rounded-lg hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      )}

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link
            className="text-xs font-semibold text-primary hover:text-primary-container transition-colors tracking-wider uppercase ml-1"
            href="/login"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
