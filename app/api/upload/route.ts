import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrgContext } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { logger, requestContext } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  tender_id: z.string().uuid(),
  filename: z.string().min(1),
  content_type: z.string().min(1)
});

export async function POST(req: Request) {
  const ctx = requestContext(req);
  const { supabase, user, profile, org } = await requireOrgContext();
  if (!user || !profile || !org) return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });

  const rl = enforceRateLimit({ scope: "api.upload", ip: ctx.ip, orgId: org.id, requestId: ctx.request_id, path: ctx.path });
  if (!rl.ok) return NextResponse.json({ success: false, reason: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, reason: "invalid_input" }, { status: 400 });

  const { data: tender } = await supabase.from("tenders").select("id, org_id").eq("id", parsed.data.tender_id).maybeSingle();
  if (!tender?.id) return NextResponse.json({ success: false, reason: "tender_not_found" }, { status: 404 });

  const bucket = process.env.DOCUMENTS_BUCKET || "bidsutra-documents";
  const path = `${org.id}/${tender.id}/${crypto.randomUUID()}-${parsed.data.filename}`;

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createClient(url, service, { auth: { persistSession: false } });

    const { data: signed, error } = await admin.storage.from(bucket).createSignedUploadUrl(path, { upsert: false });
    if (error || !signed) {
      logger.error({ scope: "upload", message: "signed_upload_url_failed", meta: { error: error?.message }, org_id: org.id, user_id: user.id, ...ctx });
      return NextResponse.json({ success: false, reason: "signed_upload_failed" }, { status: 500 });
    }

    const { data: doc, error: docErr } = await supabase
      .from("documents")
      .insert({ tender_id: tender.id, file_url: path, uploaded_by: user.id })
      .select("id")
      .single();

    if (docErr || !doc?.id) {
      logger.error({ scope: "upload", message: "document_row_failed", meta: { error: docErr?.message }, org_id: org.id, user_id: user.id, ...ctx });
      return NextResponse.json({ success: false, reason: "db_insert_failed" }, { status: 500 });
    }

    await supabase.from("activity_logs").insert({ org_id: org.id, action: `document.upload.init:${doc.id}` });

    return NextResponse.json({
      success: true,
      document_id: doc.id,
      bucket,
      path,
      signed_upload_url: signed.signedUrl,
      token: signed.token
    });
  } catch (e: any) {
    logger.error({ scope: "upload", message: "exception", meta: { message: e?.message }, org_id: org.id, user_id: user.id, ...ctx });
    return NextResponse.json({ success: false, reason: "server_error" }, { status: 500 });
  }
}
