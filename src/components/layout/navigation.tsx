"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  BarChart3,
  CreditCard,
  User,
  FileText,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

const landlordNav: NavItem[] = [
  { label: "Home", href: "/landlord", icon: Home },
  { label: "Properties", href: "/landlord/properties", icon: Building2 },
  { label: "Analytics", href: "/landlord/analytics", icon: BarChart3 },
  { label: "Payments", href: "/landlord/payments", icon: CreditCard },
  { label: "Profile", href: "/landlord/profile", icon: User },
  { label: "Contracts", href: "/landlord/contracts", icon: FileText, desktopOnly: true },
  { label: "Reports", href: "/landlord/reports", icon: FileText, desktopOnly: true },
  { label: "Renewals", href: "/landlord/renewals", icon: Bell, desktopOnly: true },
  { label: "Notifications", href: "/landlord/notifications", icon: Bell, desktopOnly: true },
  { label: "Settings", href: "/landlord/settings", icon: Settings, desktopOnly: true },
];

const tenantNav: NavItem[] = [
  { label: "Home", href: "/tenant", icon: Home },
  { label: "Contract", href: "/tenant/contract", icon: FileText },
  { label: "Analytics", href: "/tenant/analytics", icon: BarChart3 },
  { label: "Payments", href: "/tenant/payments", icon: CreditCard },
  { label: "Profile", href: "/tenant/profile", icon: User },
  { label: "Notifications", href: "/tenant/notifications", icon: Bell, desktopOnly: true },
  { label: "Settings", href: "/tenant/settings", icon: Settings, desktopOnly: true },
];

export function Sidebar({ role, userName }: { role: UserRole; userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = role === "landlord" ? landlordNav : tenantNav;

  const isActive = (href: string) => {
    if (href === `/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-surface-container-lowest card-elevation-1 flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-on-surface" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-on-surface/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-surface-container-lowest border-r border-surface-variant transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-surface-variant">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-on-primary" />
              </div>
              <span className="text-lg font-bold text-primary tracking-tight">
                Rent Nama
              </span>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden">
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          {/* User info */}
          <div className="px-5 py-4 border-b border-surface-variant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{userName}</p>
                <p className="text-xs text-on-surface-variant capitalize">{role}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                  item.desktopOnly && "hidden lg:flex"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive(item.href) ? "text-primary" : "text-outline")} />
                {item.label}
                {isActive(item.href) && (
                  <ChevronRight className="w-4 h-4 ml-auto text-primary/60" />
                )}
              </Link>
            ))}
          </nav>

          {/* Sign out */}
          <div className="p-3 border-t border-surface-variant">
            <form action="/auth/signout" method="POST">
              <button
                type="button"
                onClick={async () => {
                  const { signOut } = await import("@/lib/actions/auth");
                  await signOut();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}

export function BottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const nav = (role === "landlord" ? landlordNav : tenantNav).filter(
    (item) => !item.desktopOnly
  );

  const isActive = (href: string) => {
    if (href === `/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-lg border-t border-surface-variant pb-safe">
      <div className="flex items-center justify-around h-16">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-1.5 min-w-[60px] transition-all",
              isActive(item.href)
                ? "text-primary"
                : "text-outline"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-wider">
              {item.label}
            </span>
            {isActive(item.href) && (
              <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
