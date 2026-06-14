"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getRentRecords(role: "landlord" | "tenant") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  if (role === "tenant") {
    const { data } = await supabase
      .from("rent_records")
      .select("*, properties(title)")
      .eq("tenant_id", user.id)
      .order("due_date", { ascending: false });
    return data || [];
  } else {
    const { data: properties } = await supabase
      .from("properties")
      .select("id")
      .eq("owner_id", user.id);

    if (!properties || properties.length === 0) return [];

    const { data } = await supabase
      .from("rent_records")
      .select("*, properties(title), users!rent_records_tenant_id_fkey(full_name)")
      .in("property_id", properties.map(p => p.id))
      .order("due_date", { ascending: false });
    return data || [];
  }
}

export async function markAsPaid(rentRecordId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const method = formData.get("method") as string || "cash";
  const notes = formData.get("notes") as string;

  // Get current record
  const { data: record } = await supabase
    .from("rent_records")
    .select("*")
    .eq("id", rentRecordId)
    .single();

  if (!record) return { error: "Record not found" };

  // Update rent record
  const { error } = await supabase
    .from("rent_records")
    .update({
      status: "confirming",
      payment_method: method,
      notes: notes || null,
    })
    .eq("id", rentRecordId);

  if (error) return { error: error.message };

  // Create payment record
  await supabase.from("payments").insert({
    rent_record_id: rentRecordId,
    amount: record.amount,
    method,
    paid_by: "tenant",
    reference_note: notes || null,
    payment_status: "submitted",
  });

  // Create payment event
  await supabase.from("payment_events").insert({
    rent_record_id: rentRecordId,
    event_type: "submitted",
    old_status: record.status,
    new_status: "confirming",
    changed_by: user.id,
  });

  // Notify landlord
  const { data: property } = await supabase
    .from("properties")
    .select("owner_id, title")
    .eq("id", record.property_id)
    .single();

  if (property) {
    await supabase.from("notifications").insert({
      user_id: property.owner_id,
      title: "Payment Submitted",
      message: `Tenant has marked rent as paid for ${property.title}.`,
      type: "in_app",
      related_entity_type: "rent_record",
      related_entity_id: rentRecordId,
    });
  }

  revalidatePath("/tenant/payments");
  revalidatePath("/landlord/payments");
  return { success: true };
}

export async function confirmPayment(rentRecordId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("rent_records")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", rentRecordId);

  if (error) return { error: error.message };

  // Update payment
  await supabase
    .from("payments")
    .update({
      payment_status: "confirmed",
      confirmed_by: user.id,
      confirmed_at: new Date().toISOString(),
    })
    .eq("rent_record_id", rentRecordId)
    .eq("payment_status", "submitted");

  // Create payment event
  await supabase.from("payment_events").insert({
    rent_record_id: rentRecordId,
    event_type: "confirmed",
    old_status: "confirming",
    new_status: "paid",
    changed_by: user.id,
  });

  // Notify tenant
  const { data: record } = await supabase
    .from("rent_records")
    .select("tenant_id, properties(title)")
    .eq("id", rentRecordId)
    .single();

  if (record) {
    const prop = record.properties as unknown as { title: string } | null;
    await supabase.from("notifications").insert({
      user_id: record.tenant_id,
      title: "Payment Confirmed",
      message: `Your payment for ${prop?.title || "property"} has been confirmed.`,
      type: "in_app",
      related_entity_type: "rent_record",
      related_entity_id: rentRecordId,
    });
  }

  revalidatePath("/landlord/payments");
  revalidatePath("/tenant/payments");
  return { success: true };
}

export async function rejectPayment(rentRecordId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("rent_records")
    .update({ status: "pending" })
    .eq("id", rentRecordId);

  if (error) return { error: error.message };

  await supabase
    .from("payments")
    .update({ payment_status: "rejected" })
    .eq("rent_record_id", rentRecordId)
    .eq("payment_status", "submitted");

  await supabase.from("payment_events").insert({
    rent_record_id: rentRecordId,
    event_type: "rejected",
    old_status: "confirming",
    new_status: "pending",
    changed_by: user.id,
  });

  revalidatePath("/landlord/payments");
  revalidatePath("/tenant/payments");
  return { success: true };
}
