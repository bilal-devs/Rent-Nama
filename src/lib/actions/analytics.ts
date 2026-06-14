"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLandlordAnalytics() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get properties
  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, monthly_rent, status")
    .eq("owner_id", user.id);

  if (!properties || properties.length === 0) return { monthlyData: [], totalCollected: 0, totalPending: 0, occupancyRate: 0, properties: [] };

  const propertyIds = properties.map(p => p.id);

  // Get all rent records
  const { data: rentRecords } = await supabase
    .from("rent_records")
    .select("*")
    .in("property_id", propertyIds)
    .order("rent_month", { ascending: true });

  // Calculate monthly data for chart
  const monthlyMap = new Map<string, { month: string; collected: number; pending: number; overdue: number }>();
  
  (rentRecords || []).forEach((r) => {
    const month = new Date(r.rent_month).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { month, collected: 0, pending: 0, overdue: 0 });
    }
    const entry = monthlyMap.get(month)!;
    const amount = Number(r.amount);
    if (r.status === "paid") entry.collected += amount;
    else if (r.status === "overdue" || r.status === "late") entry.overdue += amount;
    else entry.pending += amount;
  });

  const monthlyData = Array.from(monthlyMap.values()).slice(-12);

  // Get active contracts count
  const { data: contracts } = await supabase
    .from("contracts")
    .select("id, tenant_id")
    .eq("landlord_id", user.id)
    .in("contract_status", ["active", "expiring_soon"]);

  const activeProperties = properties.filter(p => p.status === "active").length;
  const occupiedProperties = new Set((contracts || []).map(c => c.tenant_id)).size;
  const occupancyRate = activeProperties > 0 ? Math.round((occupiedProperties / activeProperties) * 100) : 0;

  const totalCollected = (rentRecords || []).filter(r => r.status === "paid").reduce((s, r) => s + Number(r.amount), 0);
  const totalPending = (rentRecords || []).filter(r => r.status !== "paid").reduce((s, r) => s + Number(r.amount), 0);

  // Per-property breakdown
  const propertyBreakdown = properties.map(p => {
    const records = (rentRecords || []).filter(r => r.property_id === p.id);
    const collected = records.filter(r => r.status === "paid").reduce((s, r) => s + Number(r.amount), 0);
    const pending = records.filter(r => r.status !== "paid").reduce((s, r) => s + Number(r.amount), 0);
    return { name: p.title, collected, pending, rent: p.monthly_rent };
  });

  return {
    monthlyData,
    totalCollected,
    totalPending,
    occupancyRate,
    properties: propertyBreakdown,
  };
}

export async function getTenantAnalytics() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rentRecords } = await supabase
    .from("rent_records")
    .select("*")
    .eq("tenant_id", user.id)
    .order("rent_month", { ascending: true });

  if (!rentRecords || rentRecords.length === 0) return { monthlyData: [], totalPaid: 0, totalPending: 0, onTimeRate: 0 };

  const monthlyData = rentRecords.map((r) => ({
    month: new Date(r.rent_month).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    amount: Number(r.amount),
    status: r.status,
    paid: r.status === "paid" ? Number(r.amount) : 0,
    pending: r.status !== "paid" ? Number(r.amount) : 0,
  })).slice(-12);

  const totalPaid = rentRecords.filter(r => r.status === "paid").reduce((s, r) => s + Number(r.amount), 0);
  const totalPending = rentRecords.filter(r => r.status !== "paid").reduce((s, r) => s + Number(r.amount), 0);
  const totalRecords = rentRecords.length;
  const paidOnTime = rentRecords.filter(r => r.status === "paid" && r.paid_at && new Date(r.paid_at) <= new Date(r.due_date)).length;
  const onTimeRate = totalRecords > 0 ? Math.round((paidOnTime / totalRecords) * 100) : 0;

  return { monthlyData, totalPaid, totalPending, onTimeRate };
}
