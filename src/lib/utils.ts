import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), "MMM d");
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getDaysUntil(date: string | Date): number {
  const target = new Date(date);
  const today = new Date();
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getHealthColor(label: string): string {
  switch (label) {
    case "excellent":
      return "text-emerald-700 bg-emerald-50";
    case "good":
      return "text-blue-700 bg-blue-50";
    case "average":
      return "text-amber-700 bg-amber-50";
    case "needs_attention":
      return "text-red-700 bg-red-50";
    default:
      return "text-gray-700 bg-gray-50";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "paid":
    case "active":
    case "signed":
    case "confirmed":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "pending":
    case "awaiting_signature":
    case "confirming":
    case "submitted":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "overdue":
    case "late":
    case "expired":
    case "terminated":
    case "rejected":
    case "declined":
      return "text-red-700 bg-red-50 border-red-200";
    case "expiring_soon":
      return "text-orange-700 bg-orange-50 border-orange-200";
    case "draft":
      return "text-slate-700 bg-slate-50 border-slate-200";
    default:
      return "text-slate-700 bg-slate-50 border-slate-200";
  }
}

export function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
