"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser, isAppConfigured } from "@/lib/supabase/env";

async function adminClient() {
  if (!isAppConfigured()) throw new Error("Application setup is incomplete.");

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !isAdminUser(user.id)) {
    throw new Error("Administrator session required.");
  }
  return { supabase, userId: user.id };
}

function requireWriteSuccess(error: { message: string } | null) {
  if (error) throw new Error("The database operation could not be completed. Check the database setup and access policies.");
}

export async function signIn(formData: FormData) {
  if (!isAppConfigured()) redirect("/login?error=setup");

  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user || !isAdminUser(data.user.id)) {
    if (data.user) await supabase.auth.signOut();
    redirect("/login?error=credentials");
  }
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createProject(formData: FormData) {
  const { supabase, userId } = await adminClient();
  const { error } = await supabase.from("projects").insert({
    user_id: userId,
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? "Other"),
    status: String(formData.get("status") ?? "Planning"),
  });
  requireWriteSuccess(error);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

export async function updateProject(formData: FormData) {
  const { supabase } = await adminClient();
  const { error } = await supabase.from("projects").update({
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? "Other"),
    status: String(formData.get("status") ?? "Planning"),
  }).eq("id", String(formData.get("id") ?? ""));
  requireWriteSuccess(error);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await adminClient();
  const { error } = await supabase.from("projects").delete().eq("id", String(formData.get("id") ?? ""));
  requireWriteSuccess(error);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

export async function createNote(formData: FormData) {
  const { supabase, userId } = await adminClient();
  const tags = String(formData.get("tags") ?? "").split(",").map(tag => tag.trim()).filter(Boolean);
  const { error } = await supabase.from("notes").insert({
    user_id: userId,
    title: String(formData.get("title") ?? "").trim(),
    content: String(formData.get("content") ?? ""),
    category: String(formData.get("category") ?? "Other"),
    tags,
  });
  requireWriteSuccess(error);
  revalidatePath("/notes");
  revalidatePath("/dashboard");
}

export async function updateNote(formData: FormData) {
  const { supabase } = await adminClient();
  const tags = String(formData.get("tags") ?? "").split(",").map(tag => tag.trim()).filter(Boolean);
  const { error } = await supabase.from("notes").update({
    title: String(formData.get("title") ?? "").trim(),
    content: String(formData.get("content") ?? ""),
    category: String(formData.get("category") ?? "Other"),
    tags,
  }).eq("id", String(formData.get("id") ?? ""));
  requireWriteSuccess(error);
  revalidatePath("/notes");
  revalidatePath("/dashboard");
}

export async function deleteNote(formData: FormData) {
  const { supabase } = await adminClient();
  const { error } = await supabase.from("notes").delete().eq("id", String(formData.get("id") ?? ""));
  requireWriteSuccess(error);
  revalidatePath("/notes");
  revalidatePath("/dashboard");
}
