import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return { supabase, user: user ?? null } as const;
}

export async function requireOrgContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null, org: null } as const;

  const { data: profile } = await supabase.from("users").select("id, org_id, role").eq("id", user.id).maybeSingle();
  if (!profile?.org_id) return { supabase, user, profile: null, org: null } as const;

  const { data: org } = await supabase.from("organizations").select("id,name,plan,created_at").eq("id", profile.org_id).maybeSingle();

  return { supabase, user, profile: profile ?? null, org: org ?? null } as const;
}
