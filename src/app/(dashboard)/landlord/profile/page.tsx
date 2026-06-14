import { getUserProfile } from "@/lib/actions/notifications";
import { formatDate, getInitials } from "@/lib/utils";
import { ProfileEditForm } from "@/components/profile/profile-form";
import { User, Mail, Phone, Calendar, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function LandlordProfilePage() {
  const data = await getUserProfile();
  if (!data || !data.user) return null;

  const { user: userData } = data;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Profile</h1>

      {/* Avatar & Info */}
      <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-variant card-elevation-1">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
            {getInitials(userData.full_name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface">{userData.full_name}</h2>
            <p className="text-sm text-on-surface-variant capitalize">{userData.role}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-outline" />
            <span className="text-on-surface-variant">Email</span>
            <span className="ml-auto font-semibold text-on-surface">{userData.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-outline" />
            <span className="text-on-surface-variant">Phone</span>
            <span className="ml-auto font-semibold text-on-surface">{userData.phone || "Not set"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-4 h-4 text-outline" />
            <span className="text-on-surface-variant">Role</span>
            <span className="ml-auto font-semibold text-on-surface capitalize">{userData.role}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-outline" />
            <span className="text-on-surface-variant">Joined</span>
            <span className="ml-auto font-semibold text-on-surface">{formatDate(userData.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <ProfileEditForm
        initialName={userData.full_name}
        initialPhone={userData.phone || ""}
      />
    </div>
  );
}
