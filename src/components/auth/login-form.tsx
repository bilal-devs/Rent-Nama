"use client";

import { useState } from "react";
import { signIn } from "@/lib/actions/auth";
import Link from "next/link";
import { Mail, Lock, LogIn, Building2 } from "lucide-react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] animate-fade-in">
      {/* Header / Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-surface-container-high mb-4 card-elevation-1">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-[32px] font-bold text-primary tracking-tight leading-10">
          Rent Nama
        </h1>
        <p className="text-sm text-on-surface-variant mt-2">
          Welcome back. Please enter your details.
        </p>
      </div>

      {/* Form */}
      <form
        action={handleSubmit}
        className="space-y-4 bg-surface p-6 rounded-xl card-elevation-2 border border-surface-variant"
      >
        {error && (
          <div className="p-3 rounded-lg bg-error-container text-on-error-container text-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div>
          <label
            className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase"
            htmlFor="email"
          >
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

        {/* Password Field */}
        <div>
          <label
            className="block text-xs font-semibold text-on-surface mb-1 tracking-wider uppercase"
            htmlFor="password"
          >
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
              placeholder="••••••••"
              type="password"
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-lowest transition-all cursor-pointer"
              type="checkbox"
            />
            <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
              Remember me
            </span>
          </label>
          <Link
            className="text-xs font-semibold text-primary hover:text-primary-container transition-colors tracking-wider uppercase"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          className="w-full h-12 mt-6 bg-primary text-on-primary font-semibold text-lg rounded-lg hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Log In
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link
            className="text-xs font-semibold text-primary hover:text-primary-container transition-colors tracking-wider uppercase ml-1"
            href="/signup"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
