"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const alreadyLoggedIn =
      localStorage.getItem("avshAdminLoggedIn") === "true";

    if (alreadyLoggedIn) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === "admin@avsh.com" &&
        password === "AVSHADMIN123"
      ) {
        localStorage.setItem("avshAdminLoggedIn", "true");
        localStorage.setItem(
          "avshAdminUser",
          JSON.stringify({
            name: "AVSH Administrator",
            email: "admin@avsh.com",
            role: "Hospital Administrator",
          })
        );

        router.push("/admin/dashboard");
      } else {
        setError(
          "Invalid administrator credentials. Please use the demo credentials."
        );
        setLoading(false);
      }
    }, 500);
  };

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden bg-[#071a3d] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,168,79,0.18),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.06),transparent_28%)]" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <button
              onClick={() =>
                router.push("/")
              }
              className="flex w-fit items-center gap-3 text-white"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4a84f]">
                <span className="text-xl font-bold text-[#071a3d]">
                  A
                </span>
              </div>

              <div className="text-left">
                <p className="text-xl font-bold tracking-wide">
                  AVSH
                </p>
                <p className="text-xs text-white/50">
                  Advanced Virtual & Smart Healthcare
                </p>
              </div>
            </button>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#f1d58a]">
                <ShieldCheck size={17} />
                Secure Administration Portal
              </div>

              <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">
                Smarter hospital
                <span className="block text-[#d4a84f]">
                  operations.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-white/60">
                Monitor appointments, queues, beds, doctors,
                diagnostics and hospital resources from one
                centralized administrative workspace.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <AdminFeature
                  title="Operations"
                  text="Live hospital overview"
                />

                <AdminFeature
                  title="Optimization"
                  text="AI-assisted insights"
                />

                <AdminFeature
                  title="Resources"
                  text="Beds & staff visibility"
                />

                <AdminFeature
                  title="Analytics"
                  text="Reports & performance"
                />
              </div>
            </div>

            <p className="text-xs text-white/35">
              AVSH University Project • Synthetic demonstration
              data
            </p>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex min-h-screen items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* MOBILE BRAND */}
            <button
              onClick={() =>
                router.push("/")
              }
              className="mb-12 flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071a3d]">
                <span className="text-lg font-bold text-[#d4a84f]">
                  A
                </span>
              </div>

              <div className="text-left">
                <p className="font-bold">AVSH</p>
                <p className="text-xs text-[#667085]">
                  Administration Portal
                </p>
              </div>
            </button>

            {/* BACK */}
            <button
              onClick={() =>
                router.push("/")
              }
              className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#071a3d]"
            >
              <ArrowLeft size={17} />
              Back to AVSH
            </button>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d4a84f]">
                Administrator Access
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#667085]">
                Sign in to manage AVSH hospital operations and
                optimization workflows.
              </p>
            </div>

            {/* LOGIN CARD */}
            <form
              onSubmit={handleLogin}
              className="mt-8 rounded-3xl border border-[#e5e1d7] bg-white p-7 shadow-[0_20px_55px_rgba(7,26,61,0.07)]"
            >
              {error && (
                <div className="mb-5 rounded-xl border border-[#e7b7b7] bg-[#fff5f5] px-4 py-3 text-sm leading-5 text-[#8a3030]">
                  {error}
                </div>
              )}

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Administrator email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@avsh.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-4 py-3.5 text-sm outline-none transition focus:border-[#d4a84f] focus:bg-white focus:ring-2 focus:ring-[#d4a84f]/20"
                />
              </div>

              {/* PASSWORD */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-[#d4a84f] focus:bg-white focus:ring-2 focus:ring-[#d4a84f]/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#667085] hover:bg-[#e5e1d7]/50"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* REMEMBER */}
              <div className="mt-5 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#667085]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[#071a3d]"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Password recovery is a demonstration feature."
                    )
                  }
                  className="text-sm font-semibold text-[#071a3d] hover:text-[#b67d1d]"
                >
                  Forgot password?
                </button>
              </div>

              {/* LOGIN */}
              <button
                type="submit"
                disabled={loading}
                className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#071a3d] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#102a56] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in to Admin Portal"}
              </button>

              {/* SECURITY */}
              <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#f8f7f3] p-4">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p className="text-xs leading-5 text-[#667085]">
                  Administrator access is restricted to
                  authorized AVSH staff in the demonstration
                  environment.
                </p>
              </div>
            </form>

            {/* DEMO CREDENTIALS */}
            <div className="mt-6 rounded-2xl border border-[#d4a84f]/40 bg-[#fffaf0] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#b67d1d]">
                Demo credentials
              </p>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#667085]">
                    Email
                  </span>

                  <span className="font-semibold">
                    admin@avsh.com
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#667085]">
                    Password
                  </span>

                  <span className="font-semibold">
                    AVSHADMIN123
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-[#98a2b3]">
              AVSH Administration • Synthetic data only
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminFeature({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm font-bold text-white">
        {title}
      </p>

      <p className="mt-1 text-xs text-white/45">
        {text}
      </p>
    </div>
  );
}