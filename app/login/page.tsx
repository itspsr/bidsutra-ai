"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }

      const url = new URL(window.location.href);
      const next = url.searchParams.get("next") || "/overview";
      window.location.assign(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your BidSutra AI workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-white/70">Email</label>
              <input
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                type="email"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-white/70">Password</label>
              <input
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </div>

            {error ? <div className="text-sm text-red-300">{error}</div> : null}

            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <div className="text-sm text-white/60">
              New here?{" "}
              <a className="text-[hsl(var(--accent))] hover:brightness-110" href="/signup">
                Create an account
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
