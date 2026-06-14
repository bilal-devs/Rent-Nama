"use client";

import { useState } from "react";
import { signOut } from "@/lib/actions/auth";
import { Moon, Sun, Monitor, LogOut } from "lucide-react";

export default function TenantSettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  function applyTheme(t: "light" | "dark" | "system") {
    setTheme(t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else if (t === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Settings</h1>

      <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Appearance</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "light" as const, label: "Light", icon: Sun },
            { value: "dark" as const, label: "Dark", icon: Moon },
            { value: "system" as const, label: "System", icon: Monitor },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => applyTheme(option.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === option.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-surface-variant hover:border-outline-variant text-on-surface-variant"
              }`}
            >
              <option.icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
        <h3 className="text-sm font-semibold text-on-surface mb-2">Account</h3>
        <button
          onClick={async () => await signOut()}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-error-container transition-colors text-left"
        >
          <LogOut className="w-5 h-5 text-error" />
          <div>
            <p className="text-sm font-semibold text-error">Sign Out</p>
            <p className="text-xs text-on-surface-variant">Log out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
}
