import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail, rentDueEmailTemplate } from "@/lib/email/sender";
import { NextResponse } from "next/server";

// This route is called by a cron job to check for overdue rent and send reminders
// Set up a Vercel cron or external service to call this endpoint daily
export async function GET(request: Request) {
  // Simple auth check via header
  const authHeader = request.headers.get("authorization");
  const isVercelCron = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isServiceRole = authHeader === `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`;

  if (!isVercelCron && !isServiceRole) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const today = new Date().toISOString().split("T")[0];

  // 1. Mark overdue records
  const { data: overdueRecords, error: overdueError } = await supabase
    .from("rent_records")
    .update({ status: "overdue" })
    .eq("status", "pending")
    .lt("due_date", today)
    .select("id, tenant_id, amount, due_date, property_id");

  if (overdueError) {
    console.error("Overdue update error:", overdueError);
  }

  // 2. Send reminders for records due in 3 days
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const reminderDate = threeDaysFromNow.toISOString().split("T")[0];

  const { data: upcomingRecords } = await supabase
    .from("rent_records")
    .select("id, tenant_id, amount, due_date, property_id, reminder_count, properties(title), users!rent_records_tenant_id_fkey(full_name, email)")
    .eq("status", "pending")
    .eq("due_date", reminderDate);

  let emailsSent = 0;
  for (const record of upcomingRecords || []) {
    const tenant = record.users as unknown as { full_name: string; email: string } | null;
    const property = record.properties as unknown as { title: string } | null;

    if (tenant && property) {
      // Check dedupe
      const dedupeKey = `rent_due_${record.id}_${record.due_date}`;
      const { data: existing } = await supabase
        .from("reminder_logs")
        .select("id")
        .eq("dedupe_key", dedupeKey)
        .limit(1);

      if (!existing || existing.length === 0) {
        const html = rentDueEmailTemplate(
          tenant.full_name,
          `PKR ${Number(record.amount).toLocaleString()}`,
          new Date(record.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          property.title
        );

        await sendEmail({
          to: tenant.email,
          subject: `Rent Due: ${property.title}`,
          html,
        });

        // Log reminder
        await supabase.from("reminder_logs").insert({
          rent_record_id: record.id,
          recipient_user_id: record.tenant_id,
          channel: "email",
          template_name: "rent_due",
          reminder_type: "rent_due",
          dedupe_key: dedupeKey,
        });

        // Create in-app notification
        await supabase.from("notifications").insert({
          user_id: record.tenant_id,
          title: "Rent Due Soon",
          message: `Your rent of PKR ${Number(record.amount).toLocaleString()} for ${property.title} is due on ${record.due_date}.`,
          type: "in_app",
          related_entity_type: "rent_record",
          related_entity_id: record.id,
        });

        // Update reminder count
        await supabase
          .from("rent_records")
          .update({
            reminder_count: (record.reminder_count || 0) + 1,
            last_reminded_at: new Date().toISOString(),
          })
          .eq("id", record.id);

        emailsSent++;
      }
    }
  }

  return NextResponse.json({
    success: true,
    overdueMarked: overdueRecords?.length || 0,
    emailsSent,
    timestamp: new Date().toISOString(),
  });
}
