"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  DoorOpen,
  Hospital,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
  Zap,
} from "lucide-react";

type BedStatus = "Available" | "Occupied" | "Cleaning" | "Reserved";

type Bed = {
  id: string;
  ward: string;
  room: string;
  bed: string;
  type: "General" | "Semi-Private" | "Private" | "ICU" | "Emergency";
  status: BedStatus;
  patient?: string;
  department: string;
  floor: string;
  branch: string;
  estimatedRelease?: string;
};

const branches = [
  "AVSH Hyderabad",
  "AVSH Tirupati",
  "AVSH Vijayawada",
  "AVSH Bengaluru",
];

const wards = [
  "General Ward A",
  "General Ward B",
  "Cardiac Care",
  "ICU",
  "Private Wing",
  "Emergency Observation",
];

const initialBeds: Bed[] = [
  {
    id: "BED-001",
    ward: "Cardiac Care",
    room: "CC-101",
    bed: "01",
    type: "ICU",
    status: "Occupied",
    patient: "Patient A-104",
    department: "Cardiology",
    floor: "1st Floor",
    branch: "AVSH Hyderabad",
    estimatedRelease: "Today, 8:30 PM",
  },
  {
    id: "BED-002",
    ward: "Cardiac Care",
    room: "CC-101",
    bed: "02",
    type: "ICU",
    status: "Available",
    department: "Cardiology",
    floor: "1st Floor",
    branch: "AVSH Hyderabad",
  },
  {
    id: "BED-003",
    ward: "General Ward A",
    room: "GW-A12",
    bed: "01",
    type: "General",
    status: "Occupied",
    patient: "Patient B-218",
    department: "General Medicine",
    floor: "2nd Floor",
    branch: "AVSH Hyderabad",
    estimatedRelease: "Tomorrow",
  },
  {
    id: "BED-004",
    ward: "General Ward A",
    room: "GW-A12",
    bed: "02",
    type: "General",
    status: "Cleaning",
    department: "General Medicine",
    floor: "2nd Floor",
    branch: "AVSH Hyderabad",
  },
  {
    id: "BED-005",
    ward: "General Ward A",
    room: "GW-A13",
    bed: "01",
    type: "General",
    status: "Available",
    department: "General Medicine",
    floor: "2nd Floor",
    branch: "AVSH Hyderabad",
  },
  {
    id: "BED-006",
    ward: "General Ward B",
    room: "GW-B21",
    bed: "01",
    type: "General",
    status: "Occupied",
    patient: "Patient C-301",
    department: "Orthopedics",
    floor: "3rd Floor",
    branch: "AVSH Hyderabad",
    estimatedRelease: "Sep 12",
  },
  {
    id: "BED-007",
    ward: "General Ward B",
    room: "GW-B21",
    bed: "02",
    type: "General",
    status: "Available",
    department: "Orthopedics",
    floor: "3rd Floor",
    branch: "AVSH Hyderabad",
  },
  {
    id: "BED-008",
    ward: "Private Wing",
    room: "PW-301",
    bed: "01",
    type: "Private",
    status: "Reserved",
    patient: "Patient D-412",
    department: "Neurology",
    floor: "3rd Floor",
    branch: "AVSH Hyderabad",
  },
  {
    id: "BED-009",
    ward: "Private Wing",
    room: "PW-302",
    bed: "01",
    type: "Private",
    status: "Occupied",
    patient: "Patient E-118",
    department: "Neurology",
    floor: "3rd Floor",
    branch: "AVSH Hyderabad",
    estimatedRelease: "Sep 13",
  },
  {
    id: "BED-010",
    ward: "ICU",
    room: "ICU-01",
    bed: "01",
    type: "ICU",
    status: "Occupied",
    patient: "Patient F-009",
    department: "Pulmonology",
    floor: "Ground Floor",
    branch: "AVSH Hyderabad",
    estimatedRelease: "Under review",
  },
  {
    id: "BED-011",
    ward: "ICU",
    room: "ICU-01",
    bed: "02",
    type: "ICU",
    status: "Available",
    department: "Critical Care",
    floor: "Ground Floor",
    branch: "AVSH Hyderabad",
  },
  {
    id: "BED-012",
    ward: "Emergency Observation",
    room: "ER-04",
    bed: "01",
    type: "Emergency",
    status: "Occupied",
    patient: "Patient G-553",
    department: "Emergency",
    floor: "Ground Floor",
    branch: "AVSH Hyderabad",
    estimatedRelease: "Today, 10:00 PM",
  },
  {
    id: "BED-013",
    ward: "Emergency Observation",
    room: "ER-04",
    bed: "02",
    type: "Emergency",
    status: "Available",
    department: "Emergency",
    floor: "Ground Floor",
    branch: "AVSH Hyderabad",
  },
  {
    id: "BED-014",
    ward: "General Ward B",
    room: "GW-B22",
    bed: "01",
    type: "General",
    status: "Occupied",
    patient: "Patient H-204",
    department: "Pediatrics",
    floor: "3rd Floor",
    branch: "AVSH Hyderabad",
    estimatedRelease: "Sep 12",
  },
  {
    id: "BED-015",
    ward: "General Ward B",
    room: "GW-B22",
    bed: "02",
    type: "General",
    status: "Available",
    department: "Pediatrics",
    floor: "3rd Floor",
    branch: "AVSH Hyderabad",
  },
  {
    id: "BED-016",
    ward: "Private Wing",
    room: "PW-303",
    bed: "01",
    type: "Private",
    status: "Cleaning",
    department: "Oncology",
    floor: "3rd Floor",
    branch: "AVSH Hyderabad",
  },
];

function statusClasses(status: BedStatus) {
  if (status === "Available") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === "Occupied") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (status === "Cleaning") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-blue-50 text-blue-700 border-blue-200";
}

function bedCardClasses(status: BedStatus) {
  if (status === "Available") {
    return "border-emerald-200 bg-emerald-50/50";
  }

  if (status === "Occupied") {
    return "border-red-200 bg-red-50/40";
  }

  if (status === "Cleaning") {
    return "border-amber-200 bg-amber-50/40";
  }

  return "border-blue-200 bg-blue-50/40";
}

export default function AdminBedsPage() {
  const router = useRouter();

  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [branch, setBranch] = useState("AVSH Hyderabad");
  const [ward, setWard] = useState("All Wards");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [search, setSearch] = useState("");
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [optimizationMessage, setOptimizationMessage] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("avshAdminLoggedIn");

    if (loggedIn !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  const filteredBeds = useMemo(() => {
    const query = search.toLowerCase().trim();

    return beds.filter((bed) => {
      const matchesBranch = bed.branch === branch;
      const matchesWard = ward === "All Wards" || bed.ward === ward;
      const matchesType = type === "All Types" || bed.type === type;
      const matchesStatus =
        status === "All Status" || bed.status === status;

      const matchesSearch =
        !query ||
        bed.id.toLowerCase().includes(query) ||
        bed.room.toLowerCase().includes(query) ||
        bed.patient?.toLowerCase().includes(query) ||
        bed.department.toLowerCase().includes(query);

      return (
        matchesBranch &&
        matchesWard &&
        matchesType &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [beds, branch, ward, type, status, search]);

  const metrics = useMemo(() => {
    const branchBeds = beds.filter((bed) => bed.branch === branch);

    const total = branchBeds.length;
    const occupied = branchBeds.filter(
      (bed) => bed.status === "Occupied"
    ).length;
    const available = branchBeds.filter(
      (bed) => bed.status === "Available"
    ).length;
    const cleaning = branchBeds.filter(
      (bed) => bed.status === "Cleaning"
    ).length;
    const reserved = branchBeds.filter(
      (bed) => bed.status === "Reserved"
    ).length;

    const occupancy =
      total === 0 ? 0 : Math.round((occupied / total) * 100);

    return {
      total,
      occupied,
      available,
      cleaning,
      reserved,
      occupancy,
    };
  }, [beds, branch]);

  const wardSummary = useMemo(() => {
    return wards.map((wardName) => {
      const wardBeds = beds.filter(
        (bed) => bed.branch === branch && bed.ward === wardName
      );

      const total = wardBeds.length;
      const occupied = wardBeds.filter(
        (bed) => bed.status === "Occupied"
      ).length;
      const available = wardBeds.filter(
        (bed) => bed.status === "Available"
      ).length;

      return {
        ward: wardName,
        total,
        occupied,
        available,
        occupancy: total
          ? Math.round((occupied / total) * 100)
          : 0,
      };
    });
  }, [beds, branch]);

  function updateBedStatus(id: string, nextStatus: BedStatus) {
    setBeds((current) =>
      current.map((bed) =>
        bed.id === id
          ? {
              ...bed,
              status: nextStatus,
              patient:
                nextStatus === "Available" || nextStatus === "Cleaning"
                  ? undefined
                  : bed.patient,
            }
          : bed
      )
    );

    setSelectedBed(null);
  }

  function optimizeCapacity() {
    const branchBeds = beds.filter((bed) => bed.branch === branch);

    const cleaningBeds = branchBeds.filter(
      (bed) => bed.status === "Cleaning"
    );

    if (cleaningBeds.length > 0) {
      setBeds((current) =>
        current.map((bed) =>
          bed.id === cleaningBeds[0].id
            ? { ...bed, status: "Available" }
            : bed
        )
      );

      setOptimizationMessage(
        `${cleaningBeds[0].id} marked available after simulated cleaning clearance.`
      );

      return;
    }

    const reserved = branchBeds.filter(
      (bed) => bed.status === "Reserved"
    );

    if (reserved.length > 0) {
      setOptimizationMessage(
        `${reserved.length} reserved bed(s) are being held for scheduled admissions.`
      );

      return;
    }

    setOptimizationMessage(
      "Capacity is currently balanced. No immediate demo action is recommended."
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* Page Header */}
      <header className="sticky top-0 z-30 border-b border-[#e5e1d7] bg-[#f8f7f3]/95 backdrop-blur">
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a84f]">
              Operations
            </p>

            <h1 className="text-xl font-bold sm:text-2xl">
              Beds & Capacity
            </h1>

            <p className="mt-1 text-sm text-[#667085]">
              Monitor bed availability, occupancy and ward capacity.
            </p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-2 rounded-xl border border-[#e5e1d7] bg-white px-4 py-2.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-[#475467]">
                Operations live
              </span>
            </div>

            <button
              onClick={optimizeCapacity}
              className="flex items-center gap-2 rounded-xl bg-[#071a3d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102a56]"
            >
              <Zap size={16} />
              Optimize Capacity
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8">
        {/* Mobile Action */}
        <button
          onClick={optimizeCapacity}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-4 py-3 text-sm font-semibold text-white sm:hidden"
        >
          <Zap size={16} />
          Optimize Capacity
        </button>

        {/* Filters */}
        <section className="rounded-2xl border border-[#e5e1d7] bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bed, room, patient..."
                className="h-11 w-full rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] pl-10 pr-4 text-sm outline-none transition focus:border-[#d4a84f]"
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
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              <option>All Wards</option>

              {wards.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              <option>All Types</option>
              <option>General</option>
              <option>Semi-Private</option>
              <option>Private</option>
              <option>ICU</option>
              <option>Emergency</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              <option>All Status</option>
              <option>Available</option>
              <option>Occupied</option>
              <option>Cleaning</option>
              <option>Reserved</option>
            </select>
          </div>
        </section>

        {/* Metrics */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              label: "Total Beds",
              value: metrics.total,
              icon: BedDouble,
              note: "Configured capacity",
            },
            {
              label: "Occupied",
              value: metrics.occupied,
              icon: Users,
              note: `${metrics.occupancy}% occupancy`,
            },
            {
              label: "Available",
              value: metrics.available,
              icon: CheckCircle2,
              note: "Ready for allocation",
            },
            {
              label: "Cleaning",
              value: metrics.cleaning,
              icon: RefreshCw,
              note: "Being prepared",
            },
            {
              label: "Reserved",
              value: metrics.reserved,
              icon: DoorOpen,
              note: "Planned admissions",
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

                  <div className="rounded-xl bg-[#f8f7f3] p-3 text-[#102a56]">
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#98a2b3]">
                  {item.note}
                </p>
              </div>
            );
          })}
        </section>

        {/* Occupancy + AI */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                  Capacity overview
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Current occupancy
                </h2>
              </div>

              <span className="text-3xl font-bold">
                {metrics.occupancy}%
              </span>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#eef0f3]">
              <div
                className="h-full rounded-full bg-[#071a3d] transition-all"
                style={{ width: `${metrics.occupancy}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-[#f8f7f3] p-3">
                <p className="text-xs text-[#667085]">Occupied</p>
                <p className="mt-1 font-bold">{metrics.occupied}</p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-3">
                <p className="text-xs text-[#667085]">Available</p>
                <p className="mt-1 font-bold">{metrics.available}</p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-3">
                <p className="text-xs text-[#667085]">Cleaning</p>
                <p className="mt-1 font-bold">{metrics.cleaning}</p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-3">
                <p className="text-xs text-[#667085]">Reserved</p>
                <p className="mt-1 font-bold">{metrics.reserved}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d8c18b] bg-[#fffaf0] p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#d4a84f] p-3 text-[#071a3d]">
                <Zap size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9a762d]">
                  AI Operations Insight
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Capacity monitoring
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#475467]">
              AVSH can use operational data to highlight available beds,
              cleaning delays, reserved capacity and ward-level pressure.
              Recommendations are decision-support only.
            </p>

            <div className="mt-4 rounded-xl border border-[#ead9aa] bg-white/70 p-4">
              <p className="text-sm font-semibold">
                {optimizationMessage ||
                  "Run Optimize Capacity to simulate an operational recommendation."}
              </p>
            </div>
          </div>
        </section>

        {/* Ward Summary */}
        <section className="mt-6 rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                Ward utilization
              </p>

              <h2 className="mt-1 text-lg font-bold">
                Capacity by ward
              </h2>
            </div>

            <Building2
              className="text-[#98a2b3]"
              size={21}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {wardSummary
              .filter((item) => item.total > 0)
              .map((item) => (
                <div
                  key={item.ward}
                  className="rounded-xl border border-[#e5e1d7] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {item.ward}
                      </p>

                      <p className="mt-1 text-xs text-[#667085]">
                        {item.occupied} occupied ·{" "}
                        {item.available} available
                      </p>
                    </div>

                    <span className="text-sm font-bold">
                      {item.occupancy}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eef0f3]">
                    <div
                      className="h-full rounded-full bg-[#102a56]"
                      style={{
                        width: `${item.occupancy}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Bed Grid */}
        <section className="mt-6 rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                Bed inventory
              </p>

              <h2 className="mt-1 text-lg font-bold">
                Live capacity map
              </h2>
            </div>

            <p className="text-sm text-[#667085]">
              Showing {filteredBeds.length} bed
              {filteredBeds.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredBeds.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d0d5dd] py-16 text-center">
              <BedDouble
                className="mx-auto text-[#98a2b3]"
                size={32}
              />

              <p className="mt-3 font-semibold">
                No beds found
              </p>

              <p className="mt-1 text-sm text-[#667085]">
                Try changing the current filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBeds.map((bed) => (
                <button
                  key={bed.id}
                  onClick={() => setSelectedBed(bed)}
                  className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${bedCardClasses(
                    bed.status
                  )}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                        {bed.id}
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        Room {bed.room}
                      </p>

                      <p className="text-sm text-[#667085]">
                        Bed {bed.bed} · {bed.type}
                      </p>
                    </div>

                    <BedDouble size={22} />
                  </div>

                  <div className="mt-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(
                        bed.status
                      )}`}
                    >
                      {bed.status}
                    </span>
                  </div>

                  {bed.patient && (
                    <p className="mt-4 text-sm font-medium">
                      {bed.patient}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-[#667085]">
                    {bed.department} · {bed.floor}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-2 border-t border-[#e5e1d7] pt-5 text-xs text-[#98a2b3] sm:flex-row sm:items-center sm:justify-between">
          <p>
            AVSH Hospital Optimization Platform · Synthetic
            operational data
          </p>

          <p>
            AI recommendations are assistive and require
            administrator review.
          </p>
        </div>
      </div>

      {/* Bed Detail Modal */}
      {selectedBed && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#071a3d]/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                  Bed details
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedBed.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedBed(null)}
                className="rounded-lg p-2 text-[#667085] hover:bg-[#f8f7f3]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ["Branch", selectedBed.branch],
                ["Ward", selectedBed.ward],
                ["Room", selectedBed.room],
                ["Bed", selectedBed.bed],
                ["Type", selectedBed.type],
                ["Floor", selectedBed.floor],
                ["Department", selectedBed.department],
                ["Patient", selectedBed.patient || "—"],
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

            {selectedBed.estimatedRelease && (
              <div className="mt-4 rounded-xl border border-[#e5e1d7] p-4">
                <p className="text-xs text-[#667085]">
                  Estimated release
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {selectedBed.estimatedRelease}
                </p>
              </div>
            )}

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">
                Update operational status
              </p>

              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    "Available",
                    "Occupied",
                    "Cleaning",
                    "Reserved",
                  ] as BedStatus[]
                ).map((nextStatus) => (
                  <button
                    key={nextStatus}
                    onClick={() =>
                      updateBedStatus(
                        selectedBed.id,
                        nextStatus
                      )
                    }
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      selectedBed.status === nextStatus
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
              Status changes are simulated locally for the
              project demo and do not update a real hospital
              system.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}