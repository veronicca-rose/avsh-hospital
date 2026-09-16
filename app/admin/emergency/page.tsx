"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  Ambulance,
  CalendarClock,
  ChevronRight,
  Clock,
  PhoneCall,
  Search,
  Siren,
  Users,
  X,
  Zap,
} from "lucide-react";

type EmergencyStatus =
  | "Waiting"
  | "Triage"
  | "In Treatment"
  | "Transferred"
  | "Completed";

type Priority = "Critical" | "High" | "Moderate";

type EmergencyCase = {
  id: string;
  patient: string;
  age: number;
  emergencyType: string;
  priority: Priority;
  status: EmergencyStatus;
  branch: string;
  arrival: string;
  waitMinutes: number;
  assignedUnit: string;
  assignedDoctor: string;
  ambulance: boolean;
};

const initialCases: EmergencyCase[] = [
  {
    id: "ER-2401",
    patient: "Patient ER-101",
    age: 54,
    emergencyType: "Chest discomfort",
    priority: "Critical",
    status: "In Treatment",
    branch: "AVSH Hyderabad",
    arrival: "08:42 AM",
    waitMinutes: 4,
    assignedUnit: "Emergency Bay 01",
    assignedDoctor: "Dr. Amelia Carter",
    ambulance: true,
  },
  {
    id: "ER-2402",
    patient: "Patient ER-102",
    age: 31,
    emergencyType: "Road injury",
    priority: "High",
    status: "Triage",
    branch: "AVSH Hyderabad",
    arrival: "09:05 AM",
    waitMinutes: 11,
    assignedUnit: "Trauma Bay 02",
    assignedDoctor: "Dr. Olivia Anderson",
    ambulance: true,
  },
  {
    id: "ER-2403",
    patient: "Patient ER-103",
    age: 67,
    emergencyType: "Breathing difficulty",
    priority: "Critical",
    status: "In Treatment",
    branch: "AVSH Hyderabad",
    arrival: "09:18 AM",
    waitMinutes: 6,
    assignedUnit: "Emergency Bay 03",
    assignedDoctor: "Dr. Chloe Harrison",
    ambulance: false,
  },
  {
    id: "ER-2404",
    patient: "Patient ER-104",
    age: 24,
    emergencyType: "Minor injury",
    priority: "Moderate",
    status: "Waiting",
    branch: "AVSH Hyderabad",
    arrival: "09:24 AM",
    waitMinutes: 19,
    assignedUnit: "Waiting Area",
    assignedDoctor: "Pending",
    ambulance: false,
  },
  {
    id: "ER-2405",
    patient: "Patient ER-105",
    age: 42,
    emergencyType: "Abdominal pain",
    priority: "High",
    status: "Waiting",
    branch: "AVSH Hyderabad",
    arrival: "09:31 AM",
    waitMinutes: 14,
    assignedUnit: "Waiting Area",
    assignedDoctor: "Pending",
    ambulance: false,
  },
  {
    id: "ER-2406",
    patient: "Patient ER-106",
    age: 73,
    emergencyType: "Fall injury",
    priority: "High",
    status: "Transferred",
    branch: "AVSH Hyderabad",
    arrival: "08:17 AM",
    waitMinutes: 3,
    assignedUnit: "Inpatient Ward",
    assignedDoctor: "Dr. Daniel Foster",
    ambulance: true,
  },
  {
    id: "ER-2407",
    patient: "Patient ER-107",
    age: 38,
    emergencyType: "Fever",
    priority: "Moderate",
    status: "Completed",
    branch: "AVSH Hyderabad",
    arrival: "07:48 AM",
    waitMinutes: 8,
    assignedUnit: "Emergency Bay 04",
    assignedDoctor: "Dr. Noah Richardson",
    ambulance: false,
  },
  {
    id: "ER-2408",
    patient: "Patient ER-108",
    age: 61,
    emergencyType: "Neurological symptoms",
    priority: "Critical",
    status: "Triage",
    branch: "AVSH Tirupati",
    arrival: "09:36 AM",
    waitMinutes: 7,
    assignedUnit: "Triage Bay 01",
    assignedDoctor: "Dr. Sophia Mitchell",
    ambulance: true,
  },
  {
    id: "ER-2409",
    patient: "Patient ER-109",
    age: 29,
    emergencyType: "Allergic reaction",
    priority: "High",
    status: "In Treatment",
    branch: "AVSH Tirupati",
    arrival: "09:14 AM",
    waitMinutes: 5,
    assignedUnit: "Emergency Bay 02",
    assignedDoctor: "Dr. Grace Wilson",
    ambulance: false,
  },
  {
    id: "ER-2410",
    patient: "Patient ER-110",
    age: 47,
    emergencyType: "Dehydration",
    priority: "Moderate",
    status: "Waiting",
    branch: "AVSH Vijayawada",
    arrival: "09:41 AM",
    waitMinutes: 17,
    assignedUnit: "Waiting Area",
    assignedDoctor: "Pending",
    ambulance: false,
  },
];

const branches = [
  "All Branches",
  "AVSH Hyderabad",
  "AVSH Tirupati",
  "AVSH Vijayawada",
  "AVSH Bengaluru",
];

const emergencyTypes = [
  "All Emergency Types",
  "Chest discomfort",
  "Road injury",
  "Breathing difficulty",
  "Minor injury",
  "Abdominal pain",
  "Fall injury",
  "Fever",
  "Neurological symptoms",
  "Allergic reaction",
  "Dehydration",
];

function priorityClass(priority: Priority) {
  if (priority === "Critical") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (priority === "High") {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function statusClass(status: EmergencyStatus) {
  if (status === "In Treatment") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "Triage") {
    return "border-purple-200 bg-purple-50 text-purple-700";
  }

  if (status === "Waiting") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (status === "Transferred") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-gray-200 bg-gray-50 text-gray-600";
}

export default function AdminEmergencyPage() {
  const router = useRouter();

  const [cases, setCases] = useState<EmergencyCase[]>(initialCases);
  const [branch, setBranch] = useState("AVSH Hyderabad");
  const [type, setType] = useState("All Emergency Types");
  const [priority, setPriority] = useState("All Priority");
  const [status, setStatus] = useState("All Status");
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] =
    useState<EmergencyCase | null>(null);
  const [operationMessage, setOperationMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("avshAdminLoggedIn") !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  const filteredCases = useMemo(() => {
    const query = search.toLowerCase().trim();

    return cases.filter((item) => {
      const branchMatch =
        branch === "All Branches" || item.branch === branch;

      const typeMatch =
        type === "All Emergency Types" ||
        item.emergencyType === type;

      const priorityMatch =
        priority === "All Priority" ||
        item.priority === priority;

      const statusMatch =
        status === "All Status" ||
        item.status === status;

      const searchMatch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.patient.toLowerCase().includes(query) ||
        item.emergencyType.toLowerCase().includes(query) ||
        item.assignedDoctor.toLowerCase().includes(query);

      return (
        branchMatch &&
        typeMatch &&
        priorityMatch &&
        statusMatch &&
        searchMatch
      );
    });
  }, [cases, branch, type, priority, status, search]);

  const branchCases = useMemo(() => {
    return branch === "All Branches"
      ? cases
      : cases.filter((item) => item.branch === branch);
  }, [cases, branch]);

  const metrics = useMemo(() => {
    return {
      active: branchCases.filter(
        (item) =>
          item.status !== "Completed" &&
          item.status !== "Transferred"
      ).length,

      critical: branchCases.filter(
        (item) => item.priority === "Critical"
      ).length,

      waiting: branchCases.filter(
        (item) => item.status === "Waiting"
      ).length,

      treatment: branchCases.filter(
        (item) => item.status === "In Treatment"
      ).length,

      ambulances: branchCases.filter(
        (item) => item.ambulance
      ).length,

      averageWait: branchCases.length
        ? Math.round(
            branchCases.reduce(
              (sum, item) => sum + item.waitMinutes,
              0
            ) / branchCases.length
          )
        : 0,
    };
  }, [branchCases]);

  function updateStatus(
    id: string,
    nextStatus: EmergencyStatus
  ) {
    setCases((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              waitMinutes:
                nextStatus === "In Treatment"
                  ? Math.min(item.waitMinutes, 5)
                  : item.waitMinutes,
            }
          : item
      )
    );

    setSelectedCase(null);
    setOperationMessage(
      `${id} status updated to ${nextStatus}.`
    );
  }

  function prioritizeEmergency() {
    const waiting = cases
      .filter(
        (item) =>
          (branch === "All Branches" ||
            item.branch === branch) &&
          item.status === "Waiting"
      )
      .sort((a, b) => {
        const priorityRank = {
          Critical: 3,
          High: 2,
          Moderate: 1,
        };

        return (
          priorityRank[b.priority] -
            priorityRank[a.priority] ||
          b.waitMinutes - a.waitMinutes
        );
      });

    if (waiting.length === 0) {
      setOperationMessage(
        "No waiting emergency cases require queue prioritization."
      );
      return;
    }

    const next = waiting[0];

    setCases((current) =>
      current.map((item) =>
        item.id === next.id
          ? {
              ...item,
              status: "Triage",
              waitMinutes: Math.max(
                0,
                item.waitMinutes - 3
              ),
            }
          : item
      )
    );

    setOperationMessage(
      `${next.id} moved to triage based on simulated emergency priority.`
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#e5e1d7] bg-[#f8f7f3]/95 backdrop-blur">
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a84f]">
              Emergency Operations
            </p>

            <h1 className="text-xl font-bold sm:text-2xl">
              Emergency Command Center
            </h1>

            <p className="mt-1 text-sm text-[#667085]">
              Monitor emergency queues, triage flow and operational capacity.
            </p>
          </div>

          <button
            onClick={prioritizeEmergency}
            className="hidden items-center gap-2 rounded-xl bg-[#071a3d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#102a56] sm:flex"
          >
            <Zap size={16} />
            Prioritize Queue
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8">
        {/* Critical Alert */}
        <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-100 p-3 text-red-700">
                <Siren size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-red-800">
                  Emergency operations monitoring
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  {metrics.critical} critical case
                  {metrics.critical === 1 ? "" : "s"} currently
                  require active operational attention.
                </p>
              </div>
            </div>

            <button
              onClick={prioritizeEmergency}
              className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Review priority
            </button>
          </div>
        </section>

        {/* Mobile Action */}
        <button
          onClick={prioritizeEmergency}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-4 py-3 text-sm font-semibold text-white sm:hidden"
        >
          <Zap size={16} />
          Prioritize Queue
        </button>

        {/* Filters */}
        <section className="rounded-2xl border border-[#e5e1d7] bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search emergency case..."
                className="h-11 w-full rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] pl-10 pr-4 text-sm outline-none focus:border-[#d4a84f]"
              />
            </div>

            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              {branches.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              {emergencyTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              <option>All Priority</option>
              <option>Critical</option>
              <option>High</option>
              <option>Moderate</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              <option>All Status</option>
              <option>Waiting</option>
              <option>Triage</option>
              <option>In Treatment</option>
              <option>Transferred</option>
              <option>Completed</option>
            </select>
          </div>
        </section>

        {/* Metrics */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {[
            {
              label: "Active Cases",
              value: metrics.active,
              icon: Siren,
            },
            {
              label: "Critical",
              value: metrics.critical,
              icon: AlertCircle,
            },
            {
              label: "Waiting",
              value: metrics.waiting,
              icon: Clock,
            },
            {
              label: "In Treatment",
              value: metrics.treatment,
              icon: Activity,
            },
            {
              label: "Ambulance",
              value: metrics.ambulances,
              icon: Ambulance,
            },
            {
              label: "Avg Wait",
              value: `${metrics.averageWait}m`,
              icon: PhoneCall,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#667085]">
                      {item.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {item.value}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f8f7f3] p-3">
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Operational Panels */}
        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                  Emergency flow
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Current case distribution
                </h2>
              </div>

              <Activity
                size={21}
                className="text-[#98a2b3]"
              />
            </div>

            <div className="mt-5 space-y-4">
              {[
                [
                  "Waiting",
                  branchCases.filter(
                    (item) => item.status === "Waiting"
                  ).length,
                ],
                [
                  "Triage",
                  branchCases.filter(
                    (item) => item.status === "Triage"
                  ).length,
                ],
                [
                  "In Treatment",
                  branchCases.filter(
                    (item) => item.status === "In Treatment"
                  ).length,
                ],
                [
                  "Transferred",
                  branchCases.filter(
                    (item) => item.status === "Transferred"
                  ).length,
                ],
                [
                  "Completed",
                  branchCases.filter(
                    (item) => item.status === "Completed"
                  ).length,
                ],
              ].map(([label, value]) => {
                const numericValue = Number(value);
                const total = Math.max(branchCases.length, 1);

                return (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{label}</span>

                      <span className="font-semibold">
                        {numericValue}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#eef0f3]">
                      <div
                        className="h-full rounded-full bg-[#102a56]"
                        style={{
                          width: `${Math.min(
                            100,
                            (numericValue / total) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#d8c18b] bg-[#fffaf0] p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#d4a84f] p-3">
                <Zap size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9a762d]">
                  AI Operations Insight
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Emergency flow monitoring
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#475467]">
              AI can summarize operational pressure across emergency
              queues, triage stages, available capacity and staff
              allocation. It does not determine clinical treatment.
            </p>

            <div className="mt-4 rounded-xl border border-[#ead9aa] bg-white/70 p-4">
              <p className="text-sm font-semibold">
                {operationMessage ||
                  `${metrics.waiting} case${
                    metrics.waiting === 1 ? "" : "s"
                  } currently waiting at the selected branch.`}
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Cases */}
        <section className="mt-6 rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                Emergency queue
              </p>

              <h2 className="mt-1 text-lg font-bold">
                Active emergency cases
              </h2>
            </div>

            <p className="text-sm text-[#667085]">
              {filteredCases.length} cases
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            {filteredCases.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d0d5dd] py-16 text-center">
                <Siren
                  className="mx-auto text-[#98a2b3]"
                  size={32}
                />

                <p className="mt-3 font-semibold">
                  No emergency cases found
                </p>

                <p className="mt-1 text-sm text-[#667085]">
                  Try changing the filters.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-[#e5e1d7] text-left text-xs uppercase tracking-wider text-[#667085]">
                    <th className="px-3 py-4">Case</th>
                    <th className="px-3 py-4">Emergency</th>
                    <th className="px-3 py-4">Priority</th>
                    <th className="px-3 py-4">Status</th>
                    <th className="px-3 py-4">Wait</th>
                    <th className="px-3 py-4">Unit</th>
                    <th className="px-3 py-4">Doctor</th>
                    <th className="px-3 py-4"></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCases.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#f0eee9] last:border-0"
                    >
                      <td className="px-3 py-4">
                        <p className="font-semibold">
                          {item.id}
                        </p>

                        <p className="mt-1 text-xs text-[#667085]">
                          {item.patient} · Age {item.age}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        <p className="text-sm font-medium">
                          {item.emergencyType}
                        </p>

                        <p className="mt-1 text-xs text-[#667085]">
                          Arrived {item.arrival}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClass(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-sm font-semibold">
                        {item.waitMinutes} min
                      </td>

                      <td className="px-3 py-4 text-sm">
                        {item.assignedUnit}
                      </td>

                      <td className="px-3 py-4 text-sm">
                        {item.assignedDoctor}
                      </td>

                      <td className="px-3 py-4">
                        <button
                          onClick={() => setSelectedCase(item)}
                          className="rounded-lg p-2 hover:bg-[#f8f7f3]"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile / Tablet */}
          <div className="grid gap-4 lg:hidden">
            {filteredCases.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d0d5dd] py-16 text-center">
                <Siren
                  className="mx-auto text-[#98a2b3]"
                  size={32}
                />

                <p className="mt-3 font-semibold">
                  No emergency cases found
                </p>

                <p className="mt-1 text-sm text-[#667085]">
                  Try changing the filters.
                </p>
              </div>
            ) : (
              filteredCases.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  className="rounded-2xl border border-[#e5e1d7] p-5 text-left transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{item.id}</p>

                      <p className="mt-1 text-sm text-[#667085]">
                        {item.patient} · Age {item.age}
                      </p>
                    </div>

                    <ChevronRight size={19} />
                  </div>

                  <p className="mt-4 font-semibold">
                    {item.emergencyType}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClass(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-[#f8f7f3] p-3">
                      <p className="text-xs text-[#667085]">
                        Wait
                      </p>

                      <p className="mt-1 font-semibold">
                        {item.waitMinutes} min
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#f8f7f3] p-3">
                      <p className="text-xs text-[#667085]">
                        Unit
                      </p>

                      <p className="mt-1 truncate font-semibold">
                        {item.assignedUnit}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col gap-2 border-t border-[#e5e1d7] pt-5 text-xs text-[#98a2b3] sm:flex-row sm:justify-between">
          <p>
            AVSH Hospital Optimization Platform · Synthetic emergency data
          </p>

          <p>
            Emergency decisions remain under qualified clinical staff.
          </p>
        </footer>
      </div>

      {/* Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#071a3d]/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                  Emergency case
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedCase.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="rounded-lg p-2 text-[#667085] hover:bg-[#f8f7f3]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
              <AlertCircle
                className="text-red-600"
                size={22}
              />

              <div>
                <p className="font-semibold text-red-800">
                  {selectedCase.emergencyType}
                </p>

                <p className="mt-1 text-xs text-red-700">
                  Priority: {selectedCase.priority}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["Patient", selectedCase.patient],
                ["Age", selectedCase.age],
                ["Branch", selectedCase.branch],
                ["Arrival", selectedCase.arrival],
                ["Wait", `${selectedCase.waitMinutes} min`],
                ["Unit", selectedCase.assignedUnit],
                ["Doctor", selectedCase.assignedDoctor],
                [
                  "Ambulance",
                  selectedCase.ambulance ? "Yes" : "No",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-[#f8f7f3] p-3"
                >
                  <p className="text-xs text-[#667085]">
                    {label}
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">
                Update operational status
              </p>

              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    "Waiting",
                    "Triage",
                    "In Treatment",
                    "Transferred",
                    "Completed",
                  ] as EmergencyStatus[]
                ).map((nextStatus) => (
                  <button
                    key={nextStatus}
                    onClick={() =>
                      updateStatus(
                        selectedCase.id,
                        nextStatus
                      )
                    }
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      selectedCase.status === nextStatus
                        ? "border-[#071a3d] bg-[#071a3d] text-white"
                        : "border-[#e5e1d7] hover:border-[#d4a84f]"
                    }`}
                  >
                    {nextStatus}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-[#98a2b3]">
              This project interface demonstrates emergency operational
              coordination using synthetic data. It does not provide
              clinical diagnosis, treatment, or medical decision-making.
            </p>

            <button
              onClick={() => setSelectedCase(null)}
              className="mt-5 w-full rounded-xl bg-[#071a3d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#102a56]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}