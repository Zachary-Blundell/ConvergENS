"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

// Backend base URL (HttpOnly cookies recommended)
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          (data && (data.message || data.error)) || "Invalid credentials.";
        throw new Error(msg);
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-dvh bg-surface-3 text-fg-primary flex items-center">
      <div className="container px-6 py-16 md:py-24 mx-auto">
        <div className="grid lg:grid-cols-2 items-center space-around gap-2">
          {/* Left column */}
          <div className="space-y-4 lg:ml-auto lg:mr-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <img
                src="/images/placeholder.png"
                alt="ConvergENS logo"
                width={100}
                height={100}
                className="rounded-md"
              />
              <span className="font-heading text-4xl lg:text-5xl text-fg-primary">
                ConvergENS
              </span>
            </Link>

            <p className="text-fg-muted text-xl">Welcome back</p>

            <h1 className="text-2xl lg:text-4xl ">Log in to your account</h1>

            {/* Accent bar */}
            <div className="h-1 w-32 rounded-full bg-highlight-500" />
          </div>

          {/* Right column */}
          <Card className="lg:mr-auto lg:ml-5 border-outline border-t-outline-highlight shadow-2xl bg-gradient-to-b from-surface-2 to-surface-1">
            <CardHeader>
              <CardTitle className="text-xl">Sign in</CardTitle>
              <CardDescription className="text-fg-muted">
                Use your email and password to continue.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="space-y-4">
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail
                      aria-hidden
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted"
                    />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={!!error && !email}
                      className="pl-10 bg-surface-3 border-outline focus-visible:ring-highlight-300 focus-visible:border-highlight-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock
                      aria-hidden
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted"
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      aria-invalid={!!error && !password}
                      className="pl-10 pr-10 bg-surface-3 border-outline focus-visible:ring-highlight-300 focus-visible:border-highlight-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg-primary"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Error */}
                <div role="status" aria-live="polite">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex-col items-stretch gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-highlight-500 hover:bg-highlight-600 focus-visible:ring-highlight-300 text-white"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {loading ? "Signing in…" : "Sign in"}
                </Button>

                {/* <div className="text-center text-sm"> */}
                {/*   <Link */}
                {/*     href="/forgot-password" */}
                {/*     className="text-highlight-600 hover:underline" */}
                {/*   > */}
                {/*     Forgot your password? */}
                {/*   </Link> */}
                {/* </div> */}
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
