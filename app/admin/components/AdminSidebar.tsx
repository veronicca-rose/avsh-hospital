"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  BarChart3,
  BedDouble,
  BrainCircuit,
  ChevronRight,
  Clock,
  Hospital,
  LogOut,
  Menu,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: Clock,
  },
  {
    label: "Patients",
    href: "/admin/patients",
    icon: Users,
  },
  {
    label: "Beds & Capacity",
    href: "/admin/beds",
    icon: BedDouble,
  },
  {
    label: "Doctors & Staff",
    href: "/admin/doctors",
    icon: Stethoscope,
  },
  {
    label: "Emergency",
    href: "/admin/emergency",
    icon: AlertCircle,
  },
  {
    label: "AI Optimization",
    href: "/admin/ai",
    icon: BrainCircuit,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: Activity,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: BarChart3,
  },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState("AVSH Administrator");

  // IMPORTANT:
  // null = still checking authentication
  // true = logged in
  // false = logged out
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean | null>(
    null
  );

  // =========================
  // CHECK ADMIN LOGIN
  // =========================
  useEffect(() => {
    function checkAdminLogin() {
      const loggedIn =
        localStorage.getItem("avshAdminLoggedIn") === "true";

      if (!loggedIn) {
        setIsAdminLoggedIn(false);

        // Prevent access to admin pages after logout
        if (pathname !== "/admin/login") {
          window.location.replace("/admin/login");
        }

        return;
      }

      setIsAdminLoggedIn(true);

      // Load admin name
      const storedUser = localStorage.getItem("avshAdminUser");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          if (user?.name) {
            setAdminName(user.name);
          }
        } catch {
          setAdminName("AVSH Administrator");
        }
      }
    }

    checkAdminLogin();

    // Listen for logout/login changes inside this tab
    window.addEventListener("admin-auth-change", checkAdminLogin);

    // Also listen for localStorage changes from another tab
    window.addEventListener("storage", checkAdminLogin);

    return () => {
      window.removeEventListener(
        "admin-auth-change",
        checkAdminLogin
      );

      window.removeEventListener("storage", checkAdminLogin);
    };
  }, [pathname]);

  // =========================
  // ACTIVE NAVIGATION
  // =========================
  function isActive(href: string) {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // =========================
  // NAVIGATE
  // =========================
  function navigate(href: string) {
    // NEVER allow navigation if logged out
    const loggedIn =
      localStorage.getItem("avshAdminLoggedIn") === "true";

    if (!loggedIn) {
      setIsAdminLoggedIn(false);
      window.location.replace("/admin/login");
      return;
    }

    setMobileOpen(false);
    router.push(href);
  }

  // =========================
  // LOGOUT
  // =========================
  function logout() {
    // Remove ONLY admin authentication.
    // Do NOT use localStorage.clear()
    // because that would delete other AVSH data.
    localStorage.removeItem("avshAdminLoggedIn");
    localStorage.removeItem("avshAdminUser");

    // Immediately update sidebar state
    setIsAdminLoggedIn(false);
    setAdminName("AVSH Administrator");
    setMobileOpen(false);

    // Notify any other admin components
    window.dispatchEvent(new Event("admin-auth-change"));

    // Hard redirect so the old admin page/sidebar
    // cannot remain active.
    window.location.replace("/admin/login");
  }

  // =========================
  // WHILE AUTH IS BEING CHECKED
  // =========================
  if (isAdminLoggedIn === null) {
    return null;
  }

  // =========================
  // IF LOGGED OUT
  // =========================
  if (isAdminLoggedIn === false) {
    return null;
  }

  return (
    <>
      {/* =========================
          MOBILE TOP BAR
      ========================== */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#071A3D] px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10"
          aria-label="Open admin navigation"
        >
          <Menu size={22} />
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4A84F] text-[#071A3D]">
            <Hospital size={19} />
          </div>

          <div className="text-left">
            <p className="text-sm font-bold tracking-wide">AVSH</p>

            <p className="text-[10px] text-white/50">
              Admin Console
            </p>
          </div>
        </button>

        <div className="w-10" />
      </header>

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-[260px] bg-[#071A3D] text-white lg:block">
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="border-b border-white/10 px-6 py-6">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4A84F] text-[#071A3D]">
                <Hospital size={22} />
              </div>

              <div className="text-left">
                <p className="text-lg font-bold tracking-wide">
                  AVSH
                </p>

                <p className="text-xs text-white/50">
                  Admin Console
                </p>
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => navigate(item.href)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                      active
                        ? "bg-[#D4A84F] text-[#071A3D] shadow-sm"
                        : "bg-transparent text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={18}
                      className="shrink-0"
                    />

                    <span
                      className={`flex-1 ${
                        active
                          ? "font-bold"
                          : "font-medium"
                      }`}
                    >
                      {item.label}
                    </span>

                    {active && (
                      <ChevronRight
                        size={16}
                        className="shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Admin account */}
          <div className="border-t border-white/10 p-4">
            <div className="mb-3 rounded-xl bg-white/5 p-4">
              <p className="text-[11px] text-white/45">
                Signed in as
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-white">
                {adminName}
              </p>

              <p className="mt-0.5 text-[11px] text-white/40">
                Hospital Administrator
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* =========================
          MOBILE DRAWER
      ========================== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">

          {/* Overlay */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/50"
          />

          {/* Drawer */}
          <aside className="relative flex h-full w-[285px] flex-col bg-[#071A3D] text-white shadow-2xl">

            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4A84F] text-[#071A3D]">
                  <Hospital size={20} />
                </div>

                <div className="text-left">
                  <p className="font-bold">AVSH</p>

                  <p className="text-[11px] text-white/50">
                    Admin Console
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close admin navigation"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile nav */}
            <nav className="flex-1 overflow-y-auto px-4 py-5">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => navigate(item.href)}
                      className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                        active
                          ? "bg-[#D4A84F] text-[#071A3D]"
                          : "bg-transparent text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon
                        size={18}
                        className="shrink-0"
                      />

                      <span
                        className={`flex-1 ${
                          active
                            ? "font-bold"
                            : "font-medium"
                        }`}
                      >
                        {item.label}
                      </span>

                      {active && (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Mobile account */}
            <div className="border-t border-white/10 p-4">
              <div className="mb-3 rounded-xl bg-white/5 p-4">
                <p className="text-[11px] text-white/45">
                  Signed in as
                </p>

                <p className="mt-1 truncate text-sm font-semibold">
                  {adminName}
                </p>

                <p className="mt-0.5 text-[11px] text-white/40">
                  Hospital Administrator
                </p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}