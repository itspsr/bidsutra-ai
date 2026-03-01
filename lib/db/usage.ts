import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function countTendersThisMonth(orgId: string) {
  const supabase = await createSupabaseServerClient();
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("tenders")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .gte("created_at", start.toISOString());

  return count ?? 0;
}
