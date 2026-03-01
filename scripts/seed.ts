import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(url, service);

async function main() {
  // seed some GeM listings (global)
  const { error } = await supabase.from("gem_listings").insert([
    { title: "SOC Managed Services", category: "Cybersecurity", value: 18.5, deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString() },
    { title: "Endpoint Security Renewal", category: "Cybersecurity", value: 6.2, deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString() }
  ]);
  if (error) throw error;
  console.log("Seeded gem_listings");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
