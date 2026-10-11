import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
export default async function PrivateLayout({children}:{children:React.ReactNode}) { if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.ADMIN_USER_ID) redirect("/login?error=setup"); const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user||user.id!==process.env.ADMIN_USER_ID) redirect("/login?error=unauthorized"); return <AppShell>{children}</AppShell>; }
