"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createContract(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const property_id = formData.get("property_id") as string;
  const tenant_id = formData.get("tenant_id") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const contract_summary = formData.get("contract_summary") as string;

  // Create contract
  const { data: contract, error } = await supabase
    .from("contracts")
    .insert({
      property_id,
      landlord_id: user.id,
      tenant_id: tenant_id || null,
      start_date: start_date || null,
      end_date: end_date || null,
      contract_summary: contract_summary || null,
      contract_status: tenant_id ? "awaiting_signature" : "draft",
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Create contract event
  await supabase.from("contract_events").insert({
    contract_id: contract.id,
    event_type: "created",
    event_note: "Contract created",
    created_by: user.id,
  });

  // If tenant assigned, create signature request
  if (tenant_id) {
    await supabase.from("contract_signatures").insert({
      contract_id: contract.id,
      signer_user_id: tenant_id,
      signer_role: "tenant",
      signature_status: "pending",
    });

    await supabase.from("contract_events").insert({
      contract_id: contract.id,
      event_type: "sent_for_signature",
      event_note: "Sent to tenant for signature",
      created_by: user.id,
    });

    // Create notification for tenant
    await supabase.from("notifications").insert({
      user_id: tenant_id,
      title: "New Contract to Sign",
      message: "You have a new rental contract to review and sign.",
      type: "in_app",
      related_entity_type: "contract",
      related_entity_id: contract.id,
    });
  }

  revalidatePath("/landlord/contracts");
  revalidatePath("/landlord/properties");
  return { success: true, contractId: contract.id };
}

export async function uploadContractFile(contractId: string, file: File) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const fileExt = file.name.split(".").pop();
  const fileName = `${contractId}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("contracts")
    .upload(filePath, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabase.storage
    .from("contracts")
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("contracts")
    .update({
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_type: file.type,
    })
    .eq("id", contractId);

  if (updateError) return { error: updateError.message };

  revalidatePath("/landlord/contracts");
  return { success: true };
}

export async function signContract(contractId: string, fullName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Update signature
  const { error: sigError } = await supabase
    .from("contract_signatures")
    .update({
      signature_status: "signed",
      signed_at: new Date().toISOString(),
      signature_method: "typed_name",
      signature_payload: { typed_name: fullName, signed_at: new Date().toISOString() },
    })
    .eq("contract_id", contractId)
    .eq("signer_user_id", user.id);

  if (sigError) return { error: sigError.message };

  // Update contract status to active
  const { error: contractError } = await supabase
    .from("contracts")
    .update({
      contract_status: "active",
      signed_at: new Date().toISOString(),
      activated_at: new Date().toISOString(),
    })
    .eq("id", contractId);

  if (contractError) return { error: contractError.message };

  // Create events
  await supabase.from("contract_events").insert({
    contract_id: contractId,
    event_type: "signed_by_tenant",
    event_note: `Signed by tenant: ${fullName}`,
    created_by: user.id,
  });

  await supabase.from("contract_events").insert({
    contract_id: contractId,
    event_type: "activated",
    event_note: "Contract activated",
    created_by: user.id,
  });

  // Get contract to generate rent records
  const { data: contract } = await supabase
    .from("contracts")
    .select("*, properties(*)")
    .eq("id", contractId)
    .single();

  if (contract) {
    await generateRentRecords(contract);
  }

  // Notify landlord
  const { data: contractData } = await supabase
    .from("contracts")
    .select("landlord_id")
    .eq("id", contractId)
    .single();

  if (contractData) {
    await supabase.from("notifications").insert({
      user_id: contractData.landlord_id,
      title: "Contract Signed",
      message: `${fullName} has signed the rental contract.`,
      type: "in_app",
      related_entity_type: "contract",
      related_entity_id: contractId,
    });
  }

  revalidatePath("/tenant/contract");
  revalidatePath("/landlord/contracts");
  return { success: true };
}

async function generateRentRecords(contract: Record<string, unknown>) {
  const supabase = await createClient();
  const property = contract.properties as Record<string, unknown>;
  if (!property || !contract.start_date || !contract.end_date || !contract.tenant_id) return;

  const startDate = new Date(contract.start_date as string);
  const endDate = new Date(contract.end_date as string);
  const rentDueDay = (property.rent_due_day as number) || 1;
  const amount = property.monthly_rent as number;

  const records = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  while (current <= endDate) {
    const dueDate = new Date(current.getFullYear(), current.getMonth(), rentDueDay);
    records.push({
      property_id: contract.property_id as string,
      tenant_id: contract.tenant_id as string,
      contract_id: contract.id as string,
      rent_month: current.toISOString().split("T")[0],
      due_date: dueDate.toISOString().split("T")[0],
      amount,
      status: "pending" as const,
    });
    current.setMonth(current.getMonth() + 1);
  }

  if (records.length > 0) {
    await supabase.from("rent_records").insert(records);
  }
}

export async function getContracts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("contracts")
    .select("*, properties(title, property_type), users!contracts_tenant_id_fkey(full_name, email)")
    .eq("landlord_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getTenantContract() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("contracts")
    .select("*, properties(*), contract_signatures(*), contract_events(*)")
    .eq("tenant_id", user.id)
    .in("contract_status", ["active", "expiring_soon", "awaiting_signature"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data;
}
