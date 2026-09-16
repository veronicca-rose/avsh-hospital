"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Filter,
  MoreHorizontal,
  Search,
  Stethoscope,
  Zap,
} from "lucide-react";

type AppointmentStatus =
  | "Confirmed"
  | "Waiting"
  | "In Consultation"
  | "Completed"
  | "Cancelled";

type Priority = "Normal" | "Priority" | "Urgent";

type Appointment = {
  id: string;
  patient: string;
  doctor: string;
  department: string;
  branch: string;
  time: string;
  status: AppointmentStatus;
  priority: Priority;
  wait: number;
};

const initialAppointments: Appointment[] = [
  {
    id: "APT-1042",
    patient: "Aarav Mehta",
    doctor: "Dr. Arjun Reddy",
    department: "Cardiology",
    branch: "AVSH Hyderabad",
    time: "09:30 AM",
    status: "Confirmed",
    priority: "Normal",
    wait: 5,
  },
  {
    id: "APT-1043",
    patient: "Ananya Sharma",
    doctor: "Dr. Vikram Sharma",
    department: "Neurology",
    branch: "AVSH Hyderabad",
    time: "10:00 AM",
    status: "Waiting",
    priority: "Priority",
    wait: 18,
  },
  {
    id: "APT-1044",
    patient: "Rohan Kapoor",
    doctor: "Dr. Karan Mehta",
    department: "Orthopedics",
    branch: "AVSH Secunderabad",
    time: "10:30 AM",
    status: "Confirmed",
    priority: "Normal",
    wait: 7,
  },
  {
    id: "APT-1045",
    patient: "Meera Nair",
    doctor: "Dr. Priya Nair",
    department: "Pediatrics",
    branch: "AVSH Hyderabad",
    time: "11:00 AM",
    status: "Waiting",
    priority: "Normal",
    wait: 22,
  },
  {
    id: "APT-1046",
    patient: "Arjun Malhotra",
    doctor: "Dr. Rohan Kapoor",
    department: "Dermatology",
    branch: "AVSH Vijayawada",
    time: "11:30 AM",
    status: "In Consultation",
    priority: "Normal",
    wait: 0,
  },
  {
    id: "APT-1047",
    patient: "Kavya Iyer",
    doctor: "Dr. Ananya Iyer",
    department: "General Medicine",
    branch: "AVSH Tirupati",
    time: "12:00 PM",
    status: "Waiting",
    priority: "Urgent",
    wait: 31,
  },
  {
    id: "APT-1048",
    patient: "Vikram Rao",
    doctor: "Dr. Aditya Menon",
    department: "Gastroenterology",
    branch: "AVSH Hyderabad",
    time: "12:30 PM",
    status: "Completed",
    priority: "Normal",
    wait: 0,
  },
  {
    id: "APT-1049",
    patient: "Sneha Menon",
    doctor: "Dr. Neha Rao",
    department: "Oncology",
    branch: "AVSH Hyderabad",
    time: "01:00 PM",
    status: "Confirmed",
    priority: "Priority",
    wait: 9,
  },
  {
    id: "APT-1050",
    patient: "Rahul Verma",
    doctor: "Dr. Rahul Verma",
    department: "Pulmonology",
    branch: "AVSH Secunderabad",
    time: "01:30 PM",
    status: "Waiting",
    priority: "Normal",
    wait: 26,
  },
  {
    id: "APT-1051",
    patient: "Nisha Joshi",
    doctor: "Dr. Kavya Sharma",
    department: "Nephrology",
    branch: "AVSH Hyderabad",
    time: "02:00 PM",
    status: "Confirmed",
    priority: "Normal",
    wait: 6,
  },
];

const departments = [
  "All Departments",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General Medicine",
  "Gastroenterology",
  "Oncology",
  "Pulmonology",
  "Nephrology",
];

const branches = [
  "All Branches",
  "AVSH Hyderabad",
  "AVSH Secunderabad",
  "AVSH Vijayawada",
  "AVSH Tirupati",
];

export default function AdminAppointmentsPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [branch, setBranch] = useState("All Branches");
  const [status, setStatus] = useState("All Statuses");
  const [priority, setPriority] = useState("All Priorities");
  const [sortByWait, setSortByWait] = useState(false);

  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const filteredAppointments = useMemo(() => {
    const result = appointments.filter((appointment) => {
      const query = search.toLowerCase();

      const matchesSearch =
        !query ||
        appointment.patient.toLowerCase().includes(query) ||
        appointment.doctor.toLowerCase().includes(query) ||
        appointment.id.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All Departments" ||
        appointment.department === department;

      const matchesBranch =
        branch === "All Branches" ||
        appointment.branch === branch;

      const matchesStatus =
        status === "All Statuses" ||
        appointment.status === status;

      const matchesPriority =
        priority === "All Priorities" ||
        appointment.priority === priority;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesBranch &&
        matchesStatus &&
        matchesPriority
      );
    });

    if (sortByWait) {
      result.sort((a, b) => b.wait - a.wait);
    }

    return result;
  }, [
    appointments,
    search,
    department,
    branch,
    status,
    priority,
    sortByWait,
  ]);

  const waitingCount = appointments.filter(
    (item) => item.status === "Waiting"
  ).length;

  const consultationCount = appointments.filter(
    (item) => item.status === "In Consultation"
  ).length;

  const urgentCount = appointments.filter(
    (item) => item.priority === "Urgent"
  ).length;

  const averageWait = Math.round(
    appointments.reduce(
      (sum, item) => sum + item.wait,
      0
    ) / appointments.length
  );

  function updateStatus(
    id: string,
    nextStatus: AppointmentStatus
  ) {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: nextStatus,
              wait:
                nextStatus === "Completed" ||
                nextStatus === "In Consultation"
                  ? 0
                  : appointment.wait,
            }
          : appointment
      )
    );
  }

  function optimizeQueue() {
    setAppointments((current) => {
      const waiting = current
        .filter((item) => item.status === "Waiting")
        .sort((a, b) => {
          const priorityRank = {
            Urgent: 0,
            Priority: 1,
            Normal: 2,
          };

          return (
            priorityRank[a.priority] -
              priorityRank[b.priority] ||
            b.wait - a.wait
          );
        });

      const first = waiting[0];

      if (!first) return current;

      return current.map((appointment) =>
        appointment.id === first.id
          ? {
              ...appointment,
              status: "In Consultation",
              wait: 0,
            }
          : appointment
      );
    });
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#e5e1d7] bg-white/95 backdrop-blur">
        <div className="flex h-[82px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9a7a32]">
                Operations
              </p>

              <h1 className="text-xl font-bold sm:text-2xl">
                Appointments & Queue
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-bold">
                AVSH Administrator
              </p>

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

      <div className="px-5 py-7 sm:px-8 lg:px-10">
        {/* Page Intro */}
        <section className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-[#667085]">
              Thursday, September 17, 2026
            </p>

            <h2 className="text-3xl font-black tracking-tight">
              Appointment Control Center
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
              Monitor patient flow, identify waiting-time pressure
              and make operational queue adjustments using
              synthetic operational data.
            </p>
          </div>

          <button
            onClick={optimizeQueue}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102a56]"
          >
            <Activity size={17} />
            Optimize Queue
          </button>
        </section>

        {/* Metrics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={CalendarDays}
            label="Today's Appointments"
            value={appointments.length.toString()}
            detail="scheduled records"
          />

          <MetricCard
            icon={Clock3}
            label="Patients Waiting"
            value={waitingCount.toString()}
            detail="currently in queue"
          />

          <MetricCard
            icon={Stethoscope}
            label="In Consultation"
            value={consultationCount.toString()}
            detail="active consultations"
          />

          <MetricCard
            icon={Activity}
            label="Average Wait"
            value={`${averageWait} min`}
            detail={`${urgentCount} urgent case${
              urgentCount === 1 ? "" : "s"
            }`}
          />
        </section>

        {/* Queue Insight */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f8f7f3] px-3 py-1.5 text-xs font-bold text-[#9a7a32]">
                  <Activity size={14} />
                  Queue intelligence
                </div>

                <h3 className="mt-4 text-xl font-black">
                  Current patient flow
                </h3>

                <p className="mt-1 text-sm text-[#667085]">
                  Operational view of active appointment pressure.
                </p>
              </div>

              <button
                onClick={() =>
                  setSortByWait((value) => !value)
                }
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                  sortByWait
                    ? "border-[#071a3d] bg-[#071a3d] text-white"
                    : "border-[#e5e1d7] bg-white text-[#071a3d]"
                }`}
              >
                {sortByWait ? (
                  <ArrowDown size={14} />
                ) : (
                  <ArrowUp size={14} />
                )}

                {sortByWait
                  ? "Highest wait first"
                  : "Sort by wait"}
              </button>
            </div>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#667085]">
                  Queue utilization
                </span>

                <span className="font-black text-[#071a3d]">
                  72%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-[#f0eee8]">
                <div
                  className="h-full rounded-full bg-[#d4a84f]"
                  style={{ width: "72%" }}
                />
              </div>

              <div className="mt-3 flex justify-between text-[11px] text-[#98a2b3]">
                <span>Low pressure</span>
                <span>Moderate</span>
                <span>High pressure</span>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <QueueStat
                label="Normal"
                value={
                  appointments.filter(
                    (item) => item.priority === "Normal"
                  ).length
                }
              />

              <QueueStat
                label="Priority"
                value={
                  appointments.filter(
                    (item) => item.priority === "Priority"
                  ).length
                }
              />

              <QueueStat
                label="Urgent"
                value={urgentCount}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#071a3d] p-6 text-white shadow-[0_8px_30px_rgba(7,26,61,0.08)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4a84f] text-[#071a3d]">
              <Zap size={21} />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#f1d58a]">
              Optimization suggestion
            </p>

            <h3 className="mt-2 text-xl font-black">
              Review the longest waiting queue
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/65">
              The longest current wait is associated with a
              General Medicine queue. Review available capacity
              before reallocating staff or changing schedules.
            </p>

            <button
              onClick={optimizeQueue}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d4a84f] px-4 py-3 text-sm font-black text-[#071a3d] hover:bg-[#f1d58a]"
            >
              Optimize Queue
              <ChevronRight size={16} />
            </button>

            <p className="mt-4 text-[11px] leading-5 text-white/40">
              Queue optimization is an operational aid and does
              not replace hospital staff decisions.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Filter
                size={17}
                className="text-[#9a7a32]"
              />

              <h3 className="font-bold">
                Filter appointments
              </h3>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search patient, doctor..."
                  className="h-11 w-full rounded-xl border border-[#e5e1d7] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#d4a84f]"
                />
              </div>

              <SelectFilter
                value={department}
                onChange={setDepartment}
                options={departments}
              />

              <SelectFilter
                value={branch}
                onChange={setBranch}
                options={branches}
              />

              <SelectFilter
                value={status}
                onChange={setStatus}
                options={[
                  "All Statuses",
                  "Confirmed",
                  "Waiting",
                  "In Consultation",
                  "Completed",
                  "Cancelled",
                ]}
              />

              <SelectFilter
                value={priority}
                onChange={setPriority}
                options={[
                  "All Priorities",
                  "Normal",
                  "Priority",
                  "Urgent",
                ]}
              />
            </div>
          </div>
        </section>

        {/* Appointment Table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#e5e1d7] bg-white shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
          <div className="flex flex-col justify-between gap-3 border-b border-[#e5e1d7] px-5 py-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold">
                Appointment Queue
              </h3>

              <p className="mt-1 text-xs text-[#667085]">
                Showing {filteredAppointments.length} of{" "}
                {appointments.length} records
              </p>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setDepartment("All Departments");
                setBranch("All Branches");
                setStatus("All Statuses");
                setPriority("All Priorities");
                setSortByWait(false);
              }}
              className="text-xs font-bold text-[#9a7a32] hover:underline"
            >
              Clear filters
            </button>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#e5e1d7] bg-[#faf9f6] text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Doctor / Department
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Time
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Priority
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Wait
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Status
                  </th>

                  <th className="px-5 py-4" />
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-[#e5e1d7] last:border-0 hover:bg-[#fcfbf8]"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#071a3d] text-xs font-bold text-white">
                          {appointment.patient
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div>
                          <p className="text-sm font-bold">
                            {appointment.patient}
                          </p>

                          <p className="mt-0.5 text-[11px] text-[#9a7a32]">
                            {appointment.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <p className="text-sm font-semibold">
                        {appointment.doctor}
                      </p>

                      <p className="mt-0.5 text-xs text-[#667085]">
                        {appointment.department}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <p className="text-sm font-bold">
                        {appointment.time}
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#98a2b3]">
                        {appointment.branch.replace(
                          "AVSH ",
                          ""
                        )}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <PriorityBadge
                        priority={appointment.priority}
                      />
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`text-sm font-black ${
                          appointment.wait >= 25
                            ? "text-[#9a7a32]"
                            : "text-[#071a3d]"
                        }`}
                      >
                        {appointment.wait} min
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <StatusBadge
                        status={appointment.status}
                      />
                    </td>

                    <td className="px-5 py-5">
                      <AppointmentActions
                        appointment={appointment}
                        onStatusChange={updateStatus}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-[#e5e1d7] md:hidden">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#071a3d] text-xs font-bold text-white">
                      {appointment.patient
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        {appointment.patient}
                      </p>

                      <p className="text-[11px] text-[#9a7a32]">
                        {appointment.id}
                      </p>
                    </div>
                  </div>

                  <PriorityBadge
                    priority={appointment.priority}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <InfoCell
                    label="Doctor"
                    value={appointment.doctor}
                  />

                  <InfoCell
                    label="Department"
                    value={appointment.department}
                  />

                  <InfoCell
                    label="Time"
                    value={appointment.time}
                  />

                  <InfoCell
                    label="Wait"
                    value={`${appointment.wait} min`}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <StatusBadge
                    status={appointment.status}
                  />

                  <AppointmentActions
                    appointment={appointment}
                    onStatusChange={updateStatus}
                  />
                </div>
              </div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="px-5 py-14 text-center">
              <CalendarDays
                size={34}
                className="mx-auto text-[#c5c1b7]"
              />

              <h3 className="mt-4 font-bold">
                No appointments found
              </h3>

              <p className="mt-1 text-sm text-[#667085]">
                Try changing the filters or search term.
              </p>
            </div>
          )}
        </section>

        {/* Disclaimer */}
        <div className="mt-7 flex gap-3 rounded-xl border border-[#e5e1d7] bg-white p-4">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-[#9a7a32]"
          />

          <p className="text-xs leading-5 text-[#667085]">
            This module uses synthetic operational data. Queue
            optimization is an operational aid and does not make
            clinical decisions or replace hospital staff judgment.
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8f7f3] text-[#9a7a32]">
        <Icon size={21} />
      </div>

      <p className="mt-5 text-sm font-medium text-[#667085]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#98a2b3]">
        {detail}
      </p>
    </div>
  );
}

function QueueStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[#e5e1d7] bg-[#faf9f6] p-4">
      <p className="text-xs font-medium text-[#667085]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full appearance-none rounded-xl border border-[#e5e1d7] bg-white px-3 pr-9 text-sm font-medium outline-none focus:border-[#d4a84f]"
      >
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
      />
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: Priority;
}) {
  const styles = {
    Normal: "bg-[#f5f4ef] text-[#667085]",
    Priority: "bg-[#f4eddd] text-[#9a7a32]",
    Urgent: "bg-[#eee9df] text-[#071a3d]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  const styles = {
    Confirmed: "bg-[#f5f4ef] text-[#667085]",
    Waiting: "bg-[#f4eddd] text-[#9a7a32]",
    "In Consultation":
      "bg-[#071a3d] text-white",
    Completed:
      "bg-[#eceae4] text-[#667085]",
    Cancelled:
      "bg-[#efede8] text-[#98a2b3]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function AppointmentActions({
  appointment,
  onStatusChange,
}: {
  appointment: Appointment;
  onStatusChange: (
    id: string,
    status: AppointmentStatus
  ) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() =>
          setOpen((value) => !value)
        }
        className="rounded-lg p-2 text-[#667085] hover:bg-[#f8f7f3] hover:text-[#071a3d]"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-20 w-48 overflow-hidden rounded-xl border border-[#e5e1d7] bg-white p-1 shadow-xl">
          {appointment.status !==
            "In Consultation" &&
            appointment.status !== "Completed" && (
              <ActionButton
                label="Start consultation"
                onClick={() => {
                  onStatusChange(
                    appointment.id,
                    "In Consultation"
                  );
                  setOpen(false);
                }}
              />
            )}

          {appointment.status !== "Completed" && (
            <ActionButton
              label="Mark completed"
              onClick={() => {
                onStatusChange(
                  appointment.id,
                  "Completed"
                );
                setOpen(false);
              }}
            />
          )}

          {appointment.status !== "Cancelled" && (
            <ActionButton
              label="Cancel appointment"
              onClick={() => {
                onStatusChange(
                  appointment.id,
                  "Cancelled"
                );
                setOpen(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#071a3d] hover:bg-[#f8f7f3]"
    >
      {label}
    </button>
  );
}

function InfoCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#98a2b3]">
        {label}
      </p>

      <p className="mt-0.5 truncate text-xs font-semibold text-[#071a3d]">
        {value}
      </p>
    </div>
  );
}