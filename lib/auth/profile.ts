import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAuthedProfile() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) return { user: null, profile: null, org: null } as const;

  const { data: profile } = await supabase.from("users").select("id, org_id, role, created_at").eq("id", user.id).maybeSingle();
  const orgId = profile?.org_id;
  const { data: org } = orgId
    ? await supabase.from("organizations").select("id, name, plan, created_at").eq("id", orgId).maybeSingle()
    : { data: null };

  return { user, profile, org } as const;
}
