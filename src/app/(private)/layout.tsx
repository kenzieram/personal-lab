import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser, isAppConfigured } from "@/lib/supabase/env";
import { AppShell } from "@/components/app-shell";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  if (!isAppConfigured()) redirect("/login?error=setup");

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !isAdminUser(user.id)) redirect("/login?error=unauthorized");

  return <AppShell>{children}</AppShell>;
}
