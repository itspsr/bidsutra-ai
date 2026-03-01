import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (_stripe) return _stripe;
  _stripe = new Stripe(key, {
    apiVersion: "2026-02-25.clover",
    typescript: true
  });
  return _stripe;
}

export function appUrl(path: string) {
  const base = process.env.APP_URL || "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
