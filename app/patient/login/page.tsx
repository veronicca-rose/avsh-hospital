"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientLogin() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (email === "patient@avsh.com" && password === "AVSH123") {
      localStorage.setItem("avshPatientLoggedIn", "true");
      router.push("/patient/dashboard");
      return;
    }

    setError("Invalid email or password. Please try again.");
  };

  return (
    <main className="min-h-screen bg-[#F8F7F3] px-6 py-10 text-[#071A3D]">
      <div className="mx-auto flex min-h-[90vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-[#E5E1D7] bg-white shadow-2xl md:grid-cols-2">

          {/* LEFT PANEL */}
          <div className="relative hidden overflow-hidden bg-[#071A3D] p-12 text-white md:flex md:flex-col md:justify-between">

            <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full border border-[#D4A84F]/20" />

            <div className="absolute bottom-[-140px] left-[-100px] h-80 w-80 rounded-full border border-[#D4A84F]/10" />

            {/* BRAND */}
            <div className="relative">
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A84F] text-sm font-bold text-[#D4A84F]">
                  AV
                </div>

                <div>
                  <div className="text-xl font-semibold tracking-wide">
                    AVSH
                  </div>

                  <div className="text-[9px] uppercase tracking-[0.2em] text-[#F1D58A]">
                    Advanced Healthcare
                  </div>
                </div>

              </div>
            </div>

            {/* MESSAGE */}
            <div className="relative max-w-lg">

              <div className="mb-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A84F]">
                <span className="h-px w-10 bg-[#D4A84F]" />
                Patient portal
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Your healthcare,
                <span className="block text-[#D4A84F]">
                  connected.
                </span>
              </h1>

              <p className="mt-6 max-w-md leading-7 text-white/65">
                Manage appointments, connect with doctors, access
                prescriptions and reports, and stay connected with AVSH
                healthcare from one secure platform.
              </p>

              {/* TRUST CARDS */}
              <div className="mt-10 grid grid-cols-2 gap-4">

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-2xl font-bold text-[#D4A84F]">
                    24/7
                  </div>

                  <div className="mt-1 text-sm text-white/50">
                    Support
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-2xl font-bold text-[#D4A84F]">
                    Secure
                  </div>

                  <div className="mt-1 text-sm text-white/50">
                    Patient access
                  </div>
                </div>

              </div>
            </div>

            {/* COPYRIGHT */}
            <p className="relative text-xs text-white/35">
              © 2026 AVSH Healthcare
            </p>

          </div>

          {/* LOGIN PANEL */}
          <div className="flex items-center p-8 md:p-12 lg:p-16">

            <div className="mx-auto w-full max-w-md">

              {/* HEADING */}
              <div className="mb-10">

                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4A84F]">
                  Patient portal
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  Sign in to access your AVSH healthcare account.
                </p>

              </div>

              {/* LOGIN FORM */}
              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* EMAIL */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#071A3D]">
                    Email or phone number
                  </label>

                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email or phone"
                    autoComplete="username"
                    className="w-full rounded-xl border border-[#E5E1D7] bg-white px-4 py-3.5 text-[#071A3D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#D4A84F] focus:ring-4 focus:ring-[#D4A84F]/10"
                  />

                </div>

                {/* PASSWORD */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="block text-sm font-semibold text-[#071A3D]">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-sm font-medium text-[#D4A84F] hover:text-[#102A56] hover:underline"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-[#E5E1D7] bg-white px-4 py-3.5 pr-20 text-[#071A3D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#D4A84F] focus:ring-4 focus:ring-[#D4A84F]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#667085] hover:text-[#D4A84F]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                </div>

                {/* ERROR */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* SIGN IN */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#071A3D] py-3.5 font-semibold text-white transition hover:bg-[#102A56] hover:shadow-lg"
                >
                  Sign in
                </button>

              </form>

              {/* DIVIDER */}
              <div className="my-8 flex items-center gap-4">

                <div className="h-px flex-1 bg-[#E5E1D7]" />

                <span className="text-sm text-[#98A2B3]">
                  or
                </span>

                <div className="h-px flex-1 bg-[#E5E1D7]" />

              </div>

              {/* GOOGLE */}
              <button
                type="button"
                className="w-full rounded-xl border border-[#E5E1D7] bg-white py-3.5 font-semibold text-[#071A3D] transition hover:border-[#D4A84F] hover:bg-[#F8F7F3]"
              >
                Continue with Google
              </button>

              {/* CREATE ACCOUNT */}
              <p className="mt-8 text-center text-sm text-[#667085]">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-[#D4A84F] hover:text-[#102A56] hover:underline"
                >
                  Create an account
                </button>
              </p>

              {/* TERMS */}
              <p className="mt-6 text-center text-xs leading-5 text-[#98A2B3]">
                By continuing, you agree to AVSH's Terms of Service and
                Privacy Policy.
              </p>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}