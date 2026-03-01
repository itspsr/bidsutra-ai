import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrgContext } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { logger, requestContext } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Query = z.object({
  document_id: z.string().uuid()
});

export async function GET(req: Request) {
  const ctx = requestContext(req);
  const { supabase, user, profile, org } = await requireOrgContext();
  if (!user || !profile || !org) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });

  const rl = enforceRateLimit({ scope: "api.download", ip: ctx.ip, orgId: org.id, requestId: ctx.request_id, path: ctx.path });
  if (!rl.ok) return NextResponse.json({ success: false, reason: "rate_limited" }, { status: 429 });

  const url = new URL(req.url);
  const parsed = Query.safeParse({ document_id: url.searchParams.get("document_id") });
  if (!parsed.success) return NextResponse.json({ success: false, reason: "invalid_input" }, { status: 400 });

  const { data: doc, error } = await supabase
    .from("documents")
    .select("id, tender_id, file_url")
    .eq("id", parsed.data.document_id)
    .maybeSingle();

  if (error || !doc?.id) return NextResponse.json({ success: false, reason: "not_found" }, { status: 404 });

  const bucket = process.env.DOCUMENTS_BUCKET || "bidsutra-documents";
  const expires = Number(process.env.DOCUMENTS_SIGNED_URL_SECONDS ?? 300);

  try {
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createClient(sbUrl, service, { auth: { persistSession: false } });

    const { data: signed, error: sErr } = await admin.storage.from(bucket).createSignedUrl(doc.file_url, expires);
    if (sErr || !signed?.signedUrl) {
      logger.error({ scope: "download", message: "signed_url_failed", meta: { error: sErr?.message }, org_id: org.id, user_id: user.id, ...ctx });
      return NextResponse.json({ success: false, reason: "signed_url_failed" }, { status: 500 });
    }

    await supabase.from("activity_logs").insert({ org_id: org.id, action: `document.download:${doc.id}` });

    return NextResponse.json({ success: true, url: signed.signedUrl, expires_in: expires });
  } catch (e: any) {
    logger.error({ scope: "download", message: "exception", meta: { message: e?.message }, org_id: org.id, user_id: user.id, ...ctx });
    return NextResponse.json({ success: false, reason: "server_error" }, { status: 500 });
  }
}
