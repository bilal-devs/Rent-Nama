"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Property, PropertyType } from "@/types/database";

export async function getProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const property_type = formData.get("property_type") as PropertyType;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const monthly_rent = parseFloat(formData.get("monthly_rent") as string);
  const security_deposit = parseFloat(formData.get("security_deposit") as string) || 0;
  const rent_due_day = parseInt(formData.get("rent_due_day") as string) || 1;
  const notes = formData.get("notes") as string;

  const { error } = await supabase.from("properties").insert({
    owner_id: user.id,
    title,
    property_type,
    address: address || null,
    city: city || null,
    monthly_rent,
    security_deposit,
    rent_due_day,
    notes: notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/landlord");
  revalidatePath("/landlord/properties");
  return { success: true };
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const property_type = formData.get("property_type") as PropertyType;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const monthly_rent = parseFloat(formData.get("monthly_rent") as string);
  const security_deposit = parseFloat(formData.get("security_deposit") as string) || 0;
  const rent_due_day = parseInt(formData.get("rent_due_day") as string) || 1;
  const notes = formData.get("notes") as string;

  const { error } = await supabase
    .from("properties")
    .update({
      title,
      property_type,
      address: address || null,
      city: city || null,
      monthly_rent,
      security_deposit,
      rent_due_day,
      notes: notes || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/landlord");
  revalidatePath("/landlord/properties");
  revalidatePath(`/landlord/properties/${id}`);
  return { success: true };
}

export async function archiveProperty(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("properties")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/landlord");
  revalidatePath("/landlord/properties");
  return { success: true };
}

export async function getLandlordStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get properties
  const { data: properties } = await supabase
    .from("properties")
    .select("id, monthly_rent, status")
    .eq("owner_id", user.id)
    .eq("status", "active");

  // Get contracts
  const { data: contracts } = await supabase
    .from("contracts")
    .select("id, tenant_id, contract_status, end_date")
    .eq("landlord_id", user.id);

  // Get rent records for current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const { data: rentRecords } = await supabase
    .from("rent_records")
    .select("id, amount, status, due_date")
    .in("property_id", (properties || []).map(p => p.id))
    .gte("rent_month", monthStart)
    .lte("rent_month", monthEnd);

  const totalProperties = properties?.length || 0;
  const activeContracts = contracts?.filter(c => c.contract_status === "active" || c.contract_status === "expiring_soon") || [];
  const totalTenants = new Set(activeContracts.map(c => c.tenant_id).filter(Boolean)).size;

  const collected = rentRecords?.filter(r => r.status === "paid").reduce((sum, r) => sum + Number(r.amount), 0) || 0;
  const pending = rentRecords?.filter(r => r.status === "pending" || r.status === "overdue").reduce((sum, r) => sum + Number(r.amount), 0) || 0;

  const expiringContracts = contracts?.filter(c => {
    if (!c.end_date) return false;
    const daysUntil = Math.ceil((new Date(c.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil > 0 && daysUntil <= 30;
  }) || [];

  return {
    totalProperties,
    totalTenants,
    collected,
    pending,
    expiringContracts: expiringContracts.length,
    properties: properties || [],
  };
}

export async function getRegisteredTenants() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, phone")
    .eq("role", "tenant")
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  if (error) return [];
  return data || [];
}
