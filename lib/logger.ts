import { createClient } from "@supabase/supabase-js";

type LogLevel = "debug" | "info" | "warn" | "error";

type BaseLog = {
  level: LogLevel;
  scope: string;
  message: string;
  meta?: Record<string, any>;
  request_id?: string;
  org_id?: string;
  user_id?: string;
  ip?: string;
  path?: string;
};

function nowIso() {
  return new Date().toISOString();
}

function shouldDbLog() {
  return process.env.NODE_ENV === "production" && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function adminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function dbInsert(table: string, row: any) {
  if (!shouldDbLog()) return;
  try {
    const supabase = adminSupabase();
    await supabase.from(table).insert(row);
  } catch {
    // swallow to avoid cascading failures
  }
}

export const logger = {
  debug(l: Omit<BaseLog, "level">) {
    if (process.env.NODE_ENV !== "production") console.debug(`[${l.scope}]`, l.message, l.meta ?? "");
    void dbInsert("api_rate_logs", { level: "debug", ...l, created_at: nowIso() });
  },
  info(l: Omit<BaseLog, "level">) {
    console.info(`[${l.scope}]`, l.message, l.meta ?? "");
    void dbInsert("activity_logs", { org_id: l.org_id, action: `${l.scope}:${l.message}`, created_at: nowIso() });
  },
  warn(l: Omit<BaseLog, "level">) {
    console.warn(`[${l.scope}]`, l.message, l.meta ?? "");
    void dbInsert("security_events", { severity: "medium", ...l, created_at: nowIso() });
  },
  error(l: Omit<BaseLog, "level">) {
    console.error(`[${l.scope}]`, l.message, l.meta ?? "");
    void dbInsert("error_logs", { ...l, created_at: nowIso() });
  }
};

export function requestContext(req: Request) {
  const h = new Headers(req.headers);
  const xf = h.get("x-forwarded-for") || "";
  const ip = xf.split(",")[0]?.trim() || h.get("x-real-ip") || "";
  const path = (() => {
    try {
      return new URL(req.url).pathname;
    } catch {
      return "";
    }
  })();
  const request_id = h.get("x-request-id") || crypto?.randomUUID?.() || "";
  return { ip, path, request_id };
}
