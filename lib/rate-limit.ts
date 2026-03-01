import { logger } from "@/lib/logger";

type Key = string;

type WindowBucket = {
  ts: number; // ms
  count: number;
};

const store = (globalThis as any).__bidsutra_rl_store ?? new Map<Key, WindowBucket[]>();
(globalThis as any).__bidsutra_rl_store = store;

function now() {
  return Date.now();
}

export type RateLimitConfig = {
  key: string;
  limit: number;
  windowMs: number;
};

export function rateLimit(cfg: RateLimitConfig) {
  const t = now();
  const windowStart = t - cfg.windowMs;

  const buckets: WindowBucket[] = store.get(cfg.key) ?? [];
  const kept = buckets.filter((b) => b.ts >= windowStart);

  const count = kept.reduce((acc, b) => acc + b.count, 0);
  if (count >= cfg.limit) {
    store.set(cfg.key, kept);
    return { ok: false as const, remaining: 0, resetMs: kept[0]?.ts ? kept[0].ts + cfg.windowMs - t : cfg.windowMs };
  }

  kept.push({ ts: t, count: 1 });
  store.set(cfg.key, kept);
  return { ok: true as const, remaining: cfg.limit - (count + 1) };
}

export function enforceRateLimit(opts: {
  scope: string;
  ip?: string;
  orgId?: string;
  requestId?: string;
  path?: string;
}) {
  const ipKey = opts.ip ? `ip:${opts.ip}:${opts.scope}` : null;
  const orgKey = opts.orgId ? `org:${opts.orgId}:${opts.scope}` : null;

  const ipRes = ipKey ? rateLimit({ key: ipKey, limit: Number(process.env.RATE_LIMIT_PER_IP ?? 120), windowMs: 60_000 }) : { ok: true as const, remaining: 0 };
  const orgRes = orgKey ? rateLimit({ key: orgKey, limit: Number(process.env.RATE_LIMIT_PER_ORG ?? 600), windowMs: 60_000 }) : { ok: true as const, remaining: 0 };

  if (!ipRes.ok || !orgRes.ok) {
    logger.warn({
      scope: "rate_limit",
      message: "blocked",
      meta: { ipRemaining: ipRes.ok ? ipRes.remaining : 0, orgRemaining: orgRes.ok ? orgRes.remaining : 0 },
      request_id: opts.requestId,
      org_id: opts.orgId,
      ip: opts.ip,
      path: opts.path
    });
    const resetMs = !ipRes.ok ? ipRes.resetMs : (orgRes as any).resetMs;
    return { ok: false as const, resetMs: resetMs ?? 60_000 };
  }

  return { ok: true as const };
}
