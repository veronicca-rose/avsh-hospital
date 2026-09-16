
"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  LogOut,
  MessageCircle,
  Settings,
  Stethoscope,
  UserRound,
} from "lucide-react";

export default function PatientSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("avshPatientLoggedIn");
    router.push("/patient/login");
  };

  const items = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/patient/dashboard",
    },
    {
      label: "Book Appointment",
      icon: CalendarDays,
      path: "/patient/appointments",
    },
    {
      label: "My Appointments",
      icon: ClipboardList,
      path: "/patient/my-appointments",
    },
    {
      label: "Doctors",
      icon: Stethoscope,
      path: "/patient/doctors",
    },
    {
      label: "Reports",
      icon: FileText,
      path: "/patient/reports",
    },
    {
      label: "Diagnostics & Packages",
      icon: HeartPulse,
      path: "/patient/diagnostics",
    },
    {
      label: "Online Consultation",
      icon: MessageCircle,
      path: "/patient/online-consultation",
    },
    {
      label: "Emergency",
      icon: Bell,
      path: "/patient/emergency",
    },
    {
      label: "Health & Wellness",
      icon: HeartPulse,
      path: "/patient/wellness",
    },
    {
      label: "Profile",
      icon: UserRound,
      path: "/patient/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/patient/settings",
    },
  ];

  return (
    <aside className="fixed bottom-0 left-0 top-[126px] z-40 hidden w-[196px] border-r border-[#dfe3ea] bg-white md:block">
      <div className="flex h-full flex-col overflow-y-auto px-2 py-6">
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;

            const isActive = pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[14px] transition ${
                  isActive
                    ? "bg-[#071a3d] font-semibold text-white"
                    : "text-[#66758c] hover:bg-[#f4f5f7] hover:text-[#071a3d]"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={logout}
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[14px] text-[#66758c] transition hover:bg-[#f4f5f7] hover:text-[#071a3d]"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
