"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function TenantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-error-container text-error flex items-center justify-center mb-6 card-elevation-1">
        <AlertOctagon className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-2">
        Something went wrong!
      </h1>
      
      <p className="text-sm text-on-surface-variant max-w-md mb-8">
        {error.message || "An unexpected error occurred while loading this page. Please try again or contact support if the issue persists."}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/tenant"
          className="inline-flex items-center gap-2 px-6 py-3 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
