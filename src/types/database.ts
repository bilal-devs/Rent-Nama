// Database types matching the Supabase schema

export type UserRole = "landlord" | "tenant";
export type ThemePreference = "light" | "dark" | "system";
export type PropertyType = "house" | "apartment" | "floor" | "shop" | "office" | "custom";
export type PropertyStatus = "active" | "archived";
export type ContractStatus = "draft" | "awaiting_signature" | "active" | "expiring_soon" | "expired" | "terminated";
export type SignatureStatus = "pending" | "signed" | "declined";
export type SignatureMethod = "typed_name" | "drawn" | "uploaded_image" | "simple_approval";
export type ContractEventType = "created" | "sent_for_signature" | "signed_by_tenant" | "signed_by_landlord" | "activated" | "renewal_sent" | "expired" | "terminated";
export type RentStatus = "pending" | "paid" | "overdue" | "late" | "confirming";
export type PaymentMethod = "cash" | "bank_transfer" | "easypaisa" | "jazzcash" | "other";
export type PaymentStatusType = "submitted" | "confirmed" | "rejected";
export type PaymentEventType = "submitted" | "confirmed" | "rejected" | "marked_pending" | "marked_paid" | "adjusted";
export type HealthLabel = "excellent" | "good" | "average" | "needs_attention";

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  notification_email_enabled: boolean;
  notification_in_app_enabled: boolean;
  theme_preference: ThemePreference;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  property_type: PropertyType;
  address: string | null;
  city: string | null;
  monthly_rent: number;
  security_deposit: number;
  rent_due_day: number;
  status: PropertyStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  property_id: string;
  landlord_id: string;
  tenant_id: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  start_date: string | null;
  end_date: string | null;
  renewal_reminder_days: number[];
  contract_status: ContractStatus;
  contract_summary: string | null;
  signed_at: string | null;
  activated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractSignature {
  id: string;
  contract_id: string;
  signer_user_id: string;
  signer_role: UserRole;
  signature_status: SignatureStatus;
  signed_at: string | null;
  signature_method: SignatureMethod | null;
  signature_payload: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ContractEvent {
  id: string;
  contract_id: string;
  event_type: ContractEventType;
  event_note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface RentRecord {
  id: string;
  property_id: string;
  tenant_id: string;
  contract_id: string;
  rent_month: string;
  due_date: string;
  amount: number;
  status: RentStatus;
  paid_at: string | null;
  payment_method: PaymentMethod | null;
  proof_url: string | null;
  notes: string | null;
  reminder_count: number;
  last_reminded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  rent_record_id: string;
  amount: number;
  method: PaymentMethod | null;
  paid_by: UserRole;
  reference_note: string | null;
  proof_url: string | null;
  payment_status: PaymentStatusType;
  confirmed_by: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export interface PaymentEvent {
  id: string;
  rent_record_id: string;
  event_type: PaymentEventType;
  old_status: string | null;
  new_status: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface PaymentHealthSnapshot {
  id: string;
  user_id: string;
  scope_type: "tenant" | "landlord" | "property";
  scope_id: string | null;
  score_label: HealthLabel;
  score_value: number;
  summary_json: Record<string, unknown> | null;
  generated_at: string;
  created_at: string;
}

export interface AnalyticsSnapshot {
  id: string;
  user_id: string;
  role: UserRole;
  period_type: "month" | "quarter" | "year" | "custom";
  period_start: string | null;
  period_end: string | null;
  metrics_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  type: "email" | "in_app" | "system";
  status: "sent" | "read" | "failed";
  related_entity_type: string | null;
  related_entity_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReminderLog {
  id: string;
  rent_record_id: string | null;
  contract_id: string | null;
  recipient_user_id: string;
  channel: string;
  template_name: string | null;
  reminder_type: "rent_due" | "overdue" | "contract_expiring" | "signature_request";
  sent_at: string;
  delivery_status: string | null;
  dedupe_key: string | null;
  created_at: string;
}

export interface ReportExport {
  id: string;
  user_id: string;
  report_type: "monthly" | "quarterly" | "yearly" | "custom";
  scope_type: "landlord" | "tenant" | "property";
  scope_id: string | null;
  file_url: string | null;
  file_name: string | null;
  status: "queued" | "ready" | "failed";
  created_at: string;
  updated_at: string;
}

// Extended types with joins
export interface PropertyWithContract extends Property {
  contracts?: Contract[];
  tenant?: User | null;
}

export interface ContractWithDetails extends Contract {
  property?: Property;
  tenant?: User | null;
  landlord?: User;
  signatures?: ContractSignature[];
  events?: ContractEvent[];
}

export interface RentRecordWithDetails extends RentRecord {
  property?: Property;
  tenant?: User;
  payments?: Payment[];
}
