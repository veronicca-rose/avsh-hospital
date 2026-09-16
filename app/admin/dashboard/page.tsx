"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BedDouble,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileBarChart,
  Users,
} from "lucide-react";

type Appointment = {
  id: string;
  patient: string;
  doctor: string;
  department: string;
  time: string;
  status: "Confirmed" | "Waiting" | "Completed";
};

const appointments: Appointment[] = [
  {
    id: "APT-1042",
    patient: "Sophia Wilson",
    doctor: "Dr. Amelia Carter",
    department: "Cardiology",
    time: "09:30 AM",
    status: "Confirmed",
  },
  {
    id: "APT-1043",
    patient: "Daniel Brooks",
    doctor: "Dr. Ethan Williams",
    department: "Neurology",
    time: "10:00 AM",
    status: "Waiting",
  },
  {
    id: "APT-1044",
    patient: "Olivia Bennett",
    doctor: "Dr. Lucas Martin",
    department: "Orthopedics",
    time: "10:30 AM",
    status: "Confirmed",
  },
  {
    id: "APT-1045",
    patient: "James Anderson",
    doctor: "Dr. Emma Thompson",
    department: "Pediatrics",
    time: "11:00 AM",
    status: "Waiting",
  },
  {
    id: "APT-1046",
    patient: "Grace Mitchell",
    doctor: "Dr. Noah Anderson",
    department: "Dermatology",
    time: "11:30 AM",
    status: "Completed",
  },
];

const departments = [
  { name: "Cardiology", patients: 42, utilization: 84 },
  { name: "Neurology", patients: 31, utilization: 72 },
  { name: "Orthopedics", patients: 27, utilization: 68 },
  { name: "General Medicine", patients: 55, utilization: 91 },
  { name: "Pediatrics", patients: 24, utilization: 63 },
];

export default function AdminDashboardPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("avshAdminLoggedIn");

    if (loggedIn !== "true") {
      router.replace("/admin/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  const todayAppointments = appointments.length;

  const stats = useMemo(
    () => [
      {
        label: "Today's Appointments",
        value: "128",
        change: "+12%",
        icon: CalendarDays,
        description: "vs. yesterday",
      },
      {
        label: "Patients Today",
        value: "94",
        change: "+8%",
        icon: Users,
        description: "active visits",
      },
      {
        label: "Bed Occupancy",
        value: "78%",
        change: "156 / 200",
        icon: BedDouble,
        description: "beds occupied",
      },
      {
        label: "Average Wait Time",
        value: "18 min",
        change: "-14%",
        icon: Clock3,
        description: "vs. yesterday",
      },
    ],
    []
  );

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7f3]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#e5e1d7] border-t-[#d4a84f]" />

          <p className="text-sm text-[#667085]">
            Loading AVSH Admin Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#e5e1d7] bg-white/95 backdrop-blur">
        <div className="flex h-[82px] items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9a7a32]">
              AVSH Hospital
            </p>

            <h1 className="text-xl font-bold sm:text-2xl">
              Operations Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">AVSH Administrator</p>

              <p className="text-xs text-[#667085]">
                Hospital Operations
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#071a3d] text-sm font-bold text-white">
              AA
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-7 sm:px-8 lg:px-10">
        {/* Welcome */}
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-[#667085]">
                Thursday, September 17, 2026
              </p>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Good morning, Admin.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                Monitor AVSH operations, patient flow, appointments,
                capacity and resource utilization from one place.
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/ai")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102a56]"
            >
              <Activity size={17} />
              View AI Optimization
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8f7f3] text-[#9a7a32]">
                    <Icon size={21} />
                  </div>

                  <span className="rounded-full bg-[#f8f7f3] px-2.5 py-1 text-xs font-bold text-[#9a7a32]">
                    {stat.change}
                  </span>
                </div>

                <p className="mt-5 text-sm font-medium text-[#667085]">
                  {stat.label}
                </p>

                <p className="mt-1 text-3xl font-black tracking-tight">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-[#98a2b3]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Main Grid */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          {/* Appointments */}
          <div className="rounded-2xl border border-[#e5e1d7] bg-white shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
            <div className="flex items-center justify-between border-b border-[#e5e1d7] px-5 py-5">
              <div>
                <h3 className="font-bold">
                  Today&apos;s Appointments
                </h3>

                <p className="mt-1 text-xs text-[#667085]">
                  {todayAppointments} recent operational records
                </p>
              </div>

              <button
                onClick={() => router.push("/admin/appointments")}
                className="inline-flex items-center gap-1 text-sm font-bold text-[#9a7a32] hover:underline"
              >
                View all
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="divide-y divide-[#e5e1d7]">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#071a3d] text-sm font-bold text-white">
                      {appointment.patient
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {appointment.patient}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-[#667085]">
                        {appointment.doctor} ·{" "}
                        {appointment.department}
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#9a7a32]">
                        {appointment.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {appointment.time}
                      </p>

                      <StatusBadge status={appointment.status} />
                    </div>

                    <button
                      type="button"
                      className="rounded-lg p-2 text-[#667085] hover:bg-[#f8f7f3] hover:text-[#071a3d]"
                    >
                      <span className="text-lg leading-none">•••</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">Hospital Capacity</h3>

                <p className="mt-1 text-xs text-[#667085]">
                  Current resource overview
                </p>
              </div>

              <BedDouble size={21} className="text-[#9a7a32]" />
            </div>

            <div className="mt-7">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-black">78%</p>

                  <p className="mt-1 text-xs text-[#667085]">
                    overall bed occupancy
                  </p>
                </div>

                <span className="text-sm font-bold text-[#9a7a32]">
                  156 / 200
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#f0eee8]">
                <div
                  className="h-full rounded-full bg-[#d4a84f]"
                  style={{ width: "78%" }}
                />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <CapacityRow
                label="General Ward"
                value="82%"
                width="82%"
              />

              <CapacityRow
                label="ICU"
                value="76%"
                width="76%"
              />

              <CapacityRow
                label="Private Rooms"
                value="71%"
                width="71%"
              />

              <CapacityRow
                label="Emergency"
                value="88%"
                width="88%"
              />
            </div>

            <button
              onClick={() => router.push("/admin/beds")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e5e1d7] py-3 text-sm font-bold transition hover:bg-[#f8f7f3]"
            >
              Manage Capacity
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* Department Utilization */}
        <section className="mt-6 rounded-2xl border border-[#e5e1d7] bg-white shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
          <div className="flex flex-col justify-between gap-3 border-b border-[#e5e1d7] px-5 py-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold">Department Utilization</h3>

              <p className="mt-1 text-xs text-[#667085]">
                Synthetic operational data for demonstration
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/reports")}
              className="inline-flex items-center gap-1 text-sm font-bold text-[#9a7a32]"
            >
              Detailed reports
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="divide-y divide-[#e5e1d7]">
            {departments.map((department) => (
              <div
                key={department.name}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[1.3fr_0.5fr_1.5fr_auto] sm:items-center"
              >
                <p className="text-sm font-semibold">
                  {department.name}
                </p>

                <p className="text-sm text-[#667085]">
                  {department.patients} patients
                </p>

                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f0eee8]">
                    <div
                      className="h-full rounded-full bg-[#d4a84f]"
                      style={{
                        width: `${department.utilization}%`,
                      }}
                    />
                  </div>

                  <span className="w-10 text-right text-xs font-bold">
                    {department.utilization}%
                  </span>
                </div>

                <span
                  className={`text-xs font-bold ${
                    department.utilization >= 85
                      ? "text-[#9a7a32]"
                      : "text-[#667085]"
                  }`}
                >
                  {department.utilization >= 85
                    ? "High load"
                    : "Normal"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* AI Insight */}
        <section className="mt-6 overflow-hidden rounded-2xl bg-[#071a3d] text-white">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d4a84f]/30 bg-[#d4a84f]/10 px-3 py-1.5 text-xs font-bold text-[#f1d58a]">
                <Activity size={14} />
                AI Operations Insight
              </div>

              <h3 className="text-2xl font-black tracking-tight">
                Review today&apos;s operational bottlenecks
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                The optimization module can analyze appointment queues,
                department utilization, bed availability and resource
                allocation, then explain potential operational actions.
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/ai")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d4a84f] px-5 py-3 text-sm font-black text-[#071a3d] transition hover:bg-[#f1d58a]"
            >
              Open AI Optimization
              <ChevronRight size={17} />
            </button>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-[#e5e1d7] pt-5 text-xs text-[#98a2b3] sm:flex-row">
          <p>AVSH Hospital · Admin Operations Platform</p>

          <p>
            Synthetic demo data · AI is assistive, not clinical
            decision-making
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: Appointment["status"];
}) {
  const styles = {
    Confirmed: "bg-[#f8f7f3] text-[#9a7a32]",
    Waiting: "bg-[#f3f1eb] text-[#667085]",
    Completed: "bg-[#eceae4] text-[#667085]",
  };

  return (
    <span
      className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function CapacityRow({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold">{label}</span>

        <span className="font-bold text-[#667085]">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#f0eee8]">
        <div
          className="h-full rounded-full bg-[#d4a84f]"
          style={{ width }}
        />
      </div>
    </div>
  );
}