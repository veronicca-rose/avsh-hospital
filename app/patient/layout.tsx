"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Activity,
  Ambulance,
  BarChart3,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  HeartPulse,
  Menu,
  MessageCircle,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";

const NAVY = "#071A3D";
const GOLD = "#D4A84F";
const IVORY = "#F8F7F3";

const branches = [
  "AVSH Hyderabad",
  "AVSH Bengaluru",
  "AVSH Chennai",
  "AVSH Mumbai",
];

const navItems = [
  {
    label: "Dashboard",
    href: "/patient/dashboard",
    icon: BarChart3,
    type: "dashboard",
  },
  {
    label: "Book Appointment",
    href: "/patient/appointments",
    icon: CalendarDays,
    type: "booking",
  },
  {
    label: "Doctors",
    href: "/patient/doctors",
    icon: Users,
    type: "doctors",
  },
  {
    label: "Reports",
    href: "/patient/reports",
    icon: FileText,
    type: "normal",
  },
  {
    label: "Diagnostics",
    href: "/patient/diagnostics",
    icon: ClipboardList,
    type: "normal",
  },
  {
    label: "Online Consultation",
    href: "/patient/online-consultation",
    icon: MessageCircle,
    type: "normal",
  },
  {
    label: "Emergency",
    href: "/patient/emergency",
    icon: Ambulance,
    type: "normal",
  },
  {
    label: "Health & Wellness",
    href: "/patient/wellness",
    icon: HeartPulse,
    type: "normal",
  },
  {
    label: "Payments",
    href: "/patient/payments",
    icon: CreditCard,
    type: "normal",
  },
];

function PatientSidebar({
  pathname,
  selectedBranch,
  onNavigate,
}: {
  pathname: string;
  selectedBranch: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();

  const isActive = (type: string, href: string) => {
    if (type === "dashboard") {
      return pathname === "/patient/dashboard";
    }

    if (type === "booking") {
      return (
        pathname === "/patient/appointments" ||
        pathname.startsWith("/patient/appointments/")
      );
    }

    if (type === "doctors") {
      return pathname === "/patient/doctors";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleBranchChange = (branch: string) => {
    localStorage.setItem("avshSelectedBranch", branch);

    window.dispatchEvent(new Event("avshBranchChanged"));
  };

  const logout = () => {
    localStorage.removeItem("avshPatientLoggedIn");
    localStorage.removeItem("avshSelectedBranch");

    onNavigate?.();

    router.replace("/patient/login");
  };

  return (
    <aside
      className="flex h-screen w-[245px] shrink-0 flex-col overflow-hidden text-white"
      style={{
        backgroundColor: NAVY,
      }}
    >
      {/* BRAND */}
      <div className="shrink-0 border-b border-white/10 px-5 pb-5 pt-6">
        <Link
          href="/patient/dashboard"
          onClick={onNavigate}
          className="block"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full border"
              style={{
                borderColor: GOLD,
                color: GOLD,
              }}
            >
              <Activity size={21} strokeWidth={2.2} />
            </div>

            <div>
              <div className="text-[17px] font-semibold tracking-[0.18em]">
                AVSH
              </div>

              <div className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/55">
                Advanced Healthcare
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* PORTAL LABEL */}
      <div className="shrink-0 px-5 pb-2 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Patient Portal
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.type, item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onNavigate}
                className={[
                  "group flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3.5 text-left text-[13px] font-medium transition-all duration-200",
                  active
                    ? "shadow-sm"
                    : "text-white/70 hover:bg-white/[0.07] hover:text-white",
                ].join(" ")}
                style={
                  active
                    ? {
                        backgroundColor: GOLD,
                        color: NAVY,
                      }
                    : undefined
                }
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.4 : 1.8}
                  className="shrink-0"
                />

                <span className="min-w-0 flex-1 truncate">
                  {item.label}
                </span>

                {active && (
                  <ChevronRight
                    size={15}
                    strokeWidth={2.3}
                    className="shrink-0"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* BRANCH */}
      <div className="shrink-0 border-t border-white/10 px-4 py-4">
        <div className="mb-2 flex items-center gap-2 px-1">
          <Stethoscope
            size={14}
            style={{
              color: GOLD,
            }}
          />

          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45">
            Current Branch
          </span>
        </div>

        <select
          value={selectedBranch}
          onChange={(e) => handleBranchChange(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2.5 text-xs text-white outline-none focus:border-[#D4A84F]"
        >
          {branches.map((branch) => (
            <option
              key={branch}
              value={branch}
              className="bg-[#071A3D] text-white"
            >
              {branch}
            </option>
          ))}
        </select>
      </div>

      {/* ACCOUNT */}
      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.05] px-3 py-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: "rgba(212,168,79,0.14)",
              color: GOLD,
            }}
          >
            <UserRound size={17} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">
              Patient Account
            </p>

            <p className="mt-0.5 truncate text-[10px] text-white/45">
              AVSH Healthcare
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-xs font-medium text-white/65 transition hover:bg-white/[0.06] hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] =
    useState("AVSH Hyderabad");

  useEffect(() => {
    if (pathname === "/patient/login") {
      setAuthorized(true);
      return;
    }

    const loggedIn = localStorage.getItem("avshPatientLoggedIn");

    if (loggedIn !== "true") {
      router.replace("/patient/login");
      return;
    }

    const savedBranch =
      localStorage.getItem("avshSelectedBranch");

    if (savedBranch && branches.includes(savedBranch)) {
      setSelectedBranch(savedBranch);
    }

    setAuthorized(true);
  }, [pathname, router]);

  useEffect(() => {
    const updateBranch = () => {
      const savedBranch =
        localStorage.getItem("avshSelectedBranch");

      if (savedBranch && branches.includes(savedBranch)) {
        setSelectedBranch(savedBranch);
      }
    };

    window.addEventListener(
      "avshBranchChanged",
      updateBranch
    );

    return () => {
      window.removeEventListener(
        "avshBranchChanged",
        updateBranch
      );
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  /*
   * Dashboard already contains its own sidebar.
   * Do not add a second sidebar there.
   */
  if (pathname === "/patient/dashboard") {
    return <>{children}</>;
  }

  /*
   * Login has no patient portal sidebar.
   */
  if (pathname === "/patient/login") {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: IVORY,
        }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2"
            style={{
              borderColor: GOLD,
              borderTopColor: "transparent",
            }}
          />

          <p className="text-sm font-medium text-[#071A3D]">
            Loading AVSH Patient Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: IVORY,
      }}
    >
      {/* DESKTOP SIDEBAR */}
      <div className="fixed inset-y-0 left-0 z-50 hidden lg:flex">
        <PatientSidebar
          pathname={pathname}
          selectedBranch={selectedBranch}
        />
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-xl shadow-lg lg:hidden"
        style={{
          backgroundColor: NAVY,
          color: "white",
        }}
        aria-label="Open patient navigation"
      >
        <Menu size={21} />
      </button>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/45 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-[80] w-[285px] transition-transform duration-300 lg:hidden",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        <PatientSidebar
          pathname={pathname}
          selectedBranch={selectedBranch}
          onNavigate={() => setMobileMenuOpen(false)}
        />

        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white"
          aria-label="Close patient navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* MAIN APPLICATION */}
      <main className="min-h-screen min-w-0 lg:pl-[245px]">
        {children}
      </main>
    </div>
  );
}