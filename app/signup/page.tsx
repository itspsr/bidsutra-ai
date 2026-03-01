"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      setMessage("Account created. If email confirmation is enabled, verify your inbox. Otherwise you can sign in now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Start using BidSutra AI in minutes.</CardDescription>
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
                placeholder="Min 6 characters"
                type="password"
                minLength={6}
                required
              />
            </div>

            {error ? <div className="text-sm text-red-300">{error}</div> : null}
            {message ? <div className="text-sm text-emerald-300">{message}</div> : null}

            <Button className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </Button>

            <div className="text-sm text-white/60">
              Already have an account?{" "}
              <a className="text-[hsl(var(--accent))] hover:brightness-110" href="/login">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
