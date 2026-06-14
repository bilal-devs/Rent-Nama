import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, BottomNav } from "@/components/layout/navigation";
import type { UserRole } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!userData) {
    redirect("/login");
  }

  const role = userData.role as UserRole;
  const userName = userData.full_name || "User";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar role={role} userName={userName} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-5 py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav role={role} />
    </div>
  );
}
