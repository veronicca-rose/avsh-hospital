"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Filter,
  HeartPulse,
  Search,
  UserRound,
  X,
} from "lucide-react";

type PatientStatus = "Active" | "Waiting" | "Completed" | "Admitted";
type VisitType = "OPD" | "Follow-up" | "Emergency" | "Diagnostic";

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  doctor: string;
  department: string;
  branch: string;
  visitType: VisitType;
  status: PatientStatus;
  lastVisit: string;
  nextVisit: string;
  wait: number;
};

const initialPatients: Patient[] = [
  {
    id: "AVSH-P1001",
    name: "Aarav Mehta",
    age: 42,
    gender: "Male",
    phone: "+91 98765 21001",
    doctor: "Dr. Arjun Reddy",
    department: "Cardiology",
    branch: "Hyderabad",
    visitType: "OPD",
    status: "Active",
    lastVisit: "12 Sep 2026",
    nextVisit: "18 Sep 2026",
    wait: 12,
  },
  {
    id: "AVSH-P1002",
    name: "Ananya Sharma",
    age: 35,
    gender: "Female",
    phone: "+91 98765 21002",
    doctor: "Dr. Vikram Sharma",
    department: "Neurology",
    branch: "Hyderabad",
    visitType: "Follow-up",
    status: "Waiting",
    lastVisit: "05 Sep 2026",
    nextVisit: "17 Sep 2026",
    wait: 24,
  },
  {
    id: "AVSH-P1003",
    name: "Rohan Kapoor",
    age: 51,
    gender: "Male",
    phone: "+91 98765 21003",
    doctor: "Dr. Karan Mehta",
    department: "Orthopedics",
    branch: "Bengaluru",
    visitType: "OPD",
    status: "Active",
    lastVisit: "10 Sep 2026",
    nextVisit: "20 Sep 2026",
    wait: 8,
  },
  {
    id: "AVSH-P1004",
    name: "Priya Nair",
    age: 29,
    gender: "Female",
    phone: "+91 98765 21004",
    doctor: "Dr. Ananya Iyer",
    department: "Pediatrics",
    branch: "Chennai",
    visitType: "Follow-up",
    status: "Completed",
    lastVisit: "14 Sep 2026",
    nextVisit: "—",
    wait: 0,
  },
  {
    id: "AVSH-P1005",
    name: "Arjun Malhotra",
    age: 47,
    gender: "Male",
    phone: "+91 98765 21005",
    doctor: "Dr. Rohan Kapoor",
    department: "Dermatology",
    branch: "Mumbai",
    visitType: "OPD",
    status: "Active",
    lastVisit: "13 Sep 2026",
    nextVisit: "25 Sep 2026",
    wait: 15,
  },
  {
    id: "AVSH-P1006",
    name: "Kavya Iyer",
    age: 31,
    gender: "Female",
    phone: "+91 98765 21006",
    doctor: "Dr. Priya Nair",
    department: "General Medicine",
    branch: "Hyderabad",
    visitType: "Follow-up",
    status: "Waiting",
    lastVisit: "08 Sep 2026",
    nextVisit: "17 Sep 2026",
    wait: 31,
  },
  {
    id: "AVSH-P1007",
    name: "Vikram Rao",
    age: 58,
    gender: "Male",
    phone: "+91 98765 21007",
    doctor: "Dr. Aditya Menon",
    department: "Gastroenterology",
    branch: "Bengaluru",
    visitType: "Diagnostic",
    status: "Active",
    lastVisit: "11 Sep 2026",
    nextVisit: "22 Sep 2026",
    wait: 19,
  },
  {
    id: "AVSH-P1008",
    name: "Sneha Menon",
    age: 39,
    gender: "Female",
    phone: "+91 98765 21008",
    doctor: "Dr. Neha Rao",
    department: "Oncology",
    branch: "Chennai",
    visitType: "Follow-up",
    status: "Admitted",
    lastVisit: "15 Sep 2026",
    nextVisit: "19 Sep 2026",
    wait: 0,
  },
  {
    id: "AVSH-P1009",
    name: "Rahul Verma",
    age: 44,
    gender: "Male",
    phone: "+91 98765 21009",
    doctor: "Dr. Rahul Verma",
    department: "Pulmonology",
    branch: "Mumbai",
    visitType: "OPD",
    status: "Waiting",
    lastVisit: "09 Sep 2026",
    nextVisit: "17 Sep 2026",
    wait: 27,
  },
  {
    id: "AVSH-P1010",
    name: "Nisha Joshi",
    age: 26,
    gender: "Female",
    phone: "+91 98765 21010",
    doctor: "Dr. Kavya Sharma",
    department: "Nephrology",
    branch: "Hyderabad",
    visitType: "Diagnostic",
    status: "Completed",
    lastVisit: "16 Sep 2026",
    nextVisit: "—",
    wait: 0,
  },
  {
    id: "AVSH-P1011",
    name: "Aditya Deshmukh",
    age: 63,
    gender: "Male",
    phone: "+91 98765 21011",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    branch: "Bengaluru",
    visitType: "Emergency",
    status: "Admitted",
    lastVisit: "16 Sep 2026",
    nextVisit: "18 Sep 2026",
    wait: 0,
  },
  {
    id: "AVSH-P1012",
    name: "Meera Patel",
    age: 33,
    gender: "Female",
    phone: "+91 98765 21012",
    doctor: "Dr. Siddharth Rao",
    department: "General Medicine",
    branch: "Chennai",
    visitType: "OPD",
    status: "Active",
    lastVisit: "12 Sep 2026",
    nextVisit: "21 Sep 2026",
    wait: 10,
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
  "Hyderabad",
  "Bengaluru",
  "Chennai",
  "Mumbai",
];

export default function AdminPatientsPage() {
  const [patients] = useState<Patient[]>(initialPatients);

  const [search, setSearch] = useState("");
  const [department, setDepartment] =
    useState("All Departments");
  const [branch, setBranch] =
    useState("All Branches");
  const [status, setStatus] =
    useState("All Statuses");
  const [visitType, setVisitType] =
    useState("All Visit Types");

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase().trim();

    return patients.filter((patient) => {
      const matchesSearch =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.doctor.toLowerCase().includes(query) ||
        patient.department.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All Departments" ||
        patient.department === department;

      const matchesBranch =
        branch === "All Branches" ||
        patient.branch === branch;

      const matchesStatus =
        status === "All Statuses" ||
        patient.status === status;

      const matchesVisitType =
        visitType === "All Visit Types" ||
        patient.visitType === visitType;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesBranch &&
        matchesStatus &&
        matchesVisitType
      );
    });
  }, [
    patients,
    search,
    department,
    branch,
    status,
    visitType,
  ]);

  const activePatients = patients.filter(
    (patient) => patient.status === "Active"
  ).length;

  const waitingPatients = patients.filter(
    (patient) => patient.status === "Waiting"
  ).length;

  const admittedPatients = patients.filter(
    (patient) => patient.status === "Admitted"
  ).length;

  const averageWait = Math.round(
    patients.reduce(
      (total, patient) => total + patient.wait,
      0
    ) / patients.length
  );

  const opdCount = patients.filter(
    (patient) => patient.visitType === "OPD"
  ).length;

  const followUpCount = patients.filter(
    (patient) => patient.visitType === "Follow-up"
  ).length;

  const emergencyCount = patients.filter(
    (patient) => patient.visitType === "Emergency"
  ).length;

  const diagnosticCount = patients.filter(
    (patient) => patient.visitType === "Diagnostic"
  ).length;

  function clearFilters() {
    setSearch("");
    setDepartment("All Departments");
    setBranch("All Branches");
    setStatus("All Statuses");
    setVisitType("All Visit Types");
  }

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#071A3D]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#E5E1D7] bg-white/95 backdrop-blur">
        <div className="flex h-[82px] items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9A7A32]">
              Patient Operations
            </p>

            <h1 className="text-xl font-bold sm:text-2xl">
              Patient Management
            </h1>
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

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#071A3D] text-sm font-bold text-white">
              AA
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 py-7 sm:px-8 lg:px-10">
        {/* Intro */}
        <section className="mb-7">
          <p className="mb-2 text-sm font-medium text-[#667085]">
            Patient overview
          </p>

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Patient Directory
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                Monitor patient activity, visit patterns,
                waiting queues and current care status
                across AVSH branches.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E1D7] bg-white px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                Total patients
              </p>

              <p className="mt-1 text-2xl font-black">
                {patients.length}
              </p>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={UserRound}
            label="Active Patients"
            value={activePatients.toString()}
            detail="currently receiving care"
          />

          <MetricCard
            icon={Clock3}
            label="Waiting"
            value={waitingPatients.toString()}
            detail="currently in queues"
          />

          <MetricCard
            icon={HeartPulse}
            label="Admitted"
            value={admittedPatients.toString()}
            detail="in inpatient care"
          />

          <MetricCard
            icon={Activity}
            label="Average Wait"
            value={`${averageWait} min`}
            detail="across active queues"
          />
        </section>

        {/* Patient Flow */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="rounded-2xl border border-[#E5E1D7] bg-white p-6 shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F8F7F3] px-3 py-1.5 text-xs font-bold text-[#9A7A32]">
                  <Activity size={14} />
                  Patient flow
                </div>

                <h3 className="mt-4 text-xl font-black">
                  Current patient activity
                </h3>

                <p className="mt-1 text-sm text-[#667085]">
                  Distribution of active patient visit types.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <FlowRow
                label="OPD visits"
                value={opdCount}
                total={patients.length}
              />

              <FlowRow
                label="Follow-up visits"
                value={followUpCount}
                total={patients.length}
              />

              <FlowRow
                label="Diagnostic visits"
                value={diagnosticCount}
                total={patients.length}
              />

              <FlowRow
                label="Emergency visits"
                value={emergencyCount}
                total={patients.length}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#071A3D] p-6 text-white shadow-[0_8px_30px_rgba(7,26,61,0.08)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4A84F] text-[#071A3D]">
              <CalendarDays size={21} />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#F1D58A]">
              Patient operations
            </p>

            <h3 className="mt-2 text-xl font-black">
              Care activity overview
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Patient records provide an operational view
              of appointments, follow-ups, diagnostics and
              emergency activity across AVSH.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <DarkStat
                label="Active"
                value={activePatients}
              />

              <DarkStat
                label="Waiting"
                value={waitingPatients}
              />

              <DarkStat
                label="Admitted"
                value={admittedPatients}
              />

              <DarkStat
                label="Total"
                value={patients.length}
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
          <div className="flex items-center gap-2">
            <Filter
              size={17}
              className="text-[#9A7A32]"
            />

            <h3 className="font-bold">
              Filter patients
            </h3>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search patient, doctor..."
                className="h-11 w-full rounded-xl border border-[#E5E1D7] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#D4A84F]"
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
                "Active",
                "Waiting",
                "Completed",
                "Admitted",
              ]}
            />

            <SelectFilter
              value={visitType}
              onChange={setVisitType}
              options={[
                "All Visit Types",
                "OPD",
                "Follow-up",
                "Emergency",
                "Diagnostic",
              ]}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-[#9A7A32] hover:underline"
            >
              Clear filters
            </button>
          </div>
        </section>

        {/* Patient Table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#E5E1D7] bg-white shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
          <div className="border-b border-[#E5E1D7] px-5 py-5">
            <h3 className="font-bold">
              Patient Records
            </h3>

            <p className="mt-1 text-xs text-[#667085]">
              Showing {filteredPatients.length} of{" "}
              {patients.length} patients
            </p>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-[#E5E1D7] bg-[#FAF9F6] text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Doctor / Department
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Branch
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Visit
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
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-[#E5E1D7] last:border-0 hover:bg-[#FCFBF8]"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <Avatar name={patient.name} />

                        <div>
                          <p className="text-sm font-bold">
                            {patient.name}
                          </p>

                          <p className="mt-0.5 text-[11px] text-[#9A7A32]">
                            {patient.id}
                          </p>

                          <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                            {patient.age} yrs •{" "}
                            {patient.gender}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <p className="text-sm font-semibold">
                        {patient.doctor}
                      </p>

                      <p className="mt-0.5 text-xs text-[#667085]">
                        {patient.department}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <span className="text-sm font-semibold">
                        {patient.branch}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <p className="text-sm font-semibold">
                        {patient.visitType}
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                        Next: {patient.nextVisit}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`text-sm font-black ${
                          patient.wait >= 25
                            ? "text-[#9A7A32]"
                            : "text-[#071A3D]"
                        }`}
                      >
                        {patient.wait} min
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <StatusBadge
                        status={patient.status}
                      />
                    </td>

                    <td className="px-5 py-5">
                      <button
                        onClick={() =>
                          setSelectedPatient(patient)
                        }
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-[#9A7A32] hover:bg-[#F8F7F3]"
                      >
                        View
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-[#E5E1D7] md:hidden">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() =>
                  setSelectedPatient(patient)
                }
                className="block w-full p-5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={patient.name} />

                    <div>
                      <p className="text-sm font-bold">
                        {patient.name}
                      </p>

                      <p className="text-[11px] text-[#9A7A32]">
                        {patient.id}
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    status={patient.status}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <InfoCell
                    label="Doctor"
                    value={patient.doctor}
                  />

                  <InfoCell
                    label="Department"
                    value={patient.department}
                  />

                  <InfoCell
                    label="Branch"
                    value={patient.branch}
                  />

                  <InfoCell
                    label="Wait"
                    value={`${patient.wait} min`}
                  />
                </div>
              </button>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="px-5 py-14 text-center">
              <UserRound
                size={34}
                className="mx-auto text-[#C5C1B7]"
              />

              <h3 className="mt-4 font-bold">
                No patients found
              </h3>

              <p className="mt-1 text-sm text-[#667085]">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </section>

        {/* Footer Notice */}
        <div className="mt-7 rounded-xl border border-[#E5E1D7] bg-white p-4">
          <p className="text-xs leading-5 text-[#667085]">
            Patient records shown in this module are
            synthetic operational data intended for the AVSH
            hospital optimization project. They are not real
            patient records and should not be used for clinical
            decision-making.
          </p>
        </div>
      </main>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071A3D]/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E1D7] px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                  Patient details
                </p>

                <h3 className="mt-1 text-xl font-black">
                  {selectedPatient.name}
                </h3>
              </div>

              <button
                onClick={() =>
                  setSelectedPatient(null)
                }
                className="rounded-lg p-2 text-[#667085] hover:bg-[#F8F7F3]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 rounded-xl bg-[#F8F7F3] p-4">
                <Avatar
                  name={selectedPatient.name}
                  large
                />

                <div>
                  <p className="font-bold">
                    {selectedPatient.name}
                  </p>

                  <p className="text-xs text-[#9A7A32]">
                    {selectedPatient.id}
                  </p>

                  <p className="mt-1 text-xs text-[#667085]">
                    {selectedPatient.age} years •{" "}
                    {selectedPatient.gender}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Phone"
                  value={selectedPatient.phone}
                />

                <DetailItem
                  label="Branch"
                  value={selectedPatient.branch}
                />

                <DetailItem
                  label="Doctor"
                  value={selectedPatient.doctor}
                />

                <DetailItem
                  label="Department"
                  value={selectedPatient.department}
                />

                <DetailItem
                  label="Visit Type"
                  value={selectedPatient.visitType}
                />

                <DetailItem
                  label="Current Status"
                  value={selectedPatient.status}
                />

                <DetailItem
                  label="Last Visit"
                  value={selectedPatient.lastVisit}
                />

                <DetailItem
                  label="Next Visit"
                  value={selectedPatient.nextVisit}
                />
              </div>

              <div className="mt-6 rounded-xl border border-[#E5E1D7] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                      Current queue
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      {selectedPatient.wait} min
                    </p>
                  </div>

                  <Clock3
                    size={24}
                    className="text-[#D4A84F]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-[#E5E1D7] px-6 py-4">
              <button
                onClick={() =>
                  setSelectedPatient(null)
                }
                className="rounded-xl bg-[#071A3D] px-5 py-3 text-sm font-bold text-white hover:bg-[#102A56]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
    <div className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8F7F3] text-[#9A7A32]">
        <Icon size={21} />
      </div>

      <p className="mt-5 text-sm font-medium text-[#667085]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#98A2B3]">
        {detail}
      </p>
    </div>
  );
}

function FlowRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage =
    total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">
          {label}
        </span>

        <span className="text-xs font-bold text-[#667085]">
          {value} • {percentage}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[#F0EEE8]">
        <div
          className="h-full rounded-full bg-[#D4A84F]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DarkStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-white/50">
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
        className="h-11 w-full appearance-none rounded-xl border border-[#E5E1D7] bg-white px-3 pr-9 text-sm font-medium outline-none focus:border-[#D4A84F]"
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

function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#071A3D] font-bold text-white ${
        large
          ? "h-14 w-14 text-base"
          : "h-10 w-10 text-xs"
      }`}
    >
      {initials}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: PatientStatus;
}) {
  const styles = {
    Active: "bg-[#F5F4EF] text-[#667085]",
    Waiting: "bg-[#F4EDDD] text-[#9A7A32]",
    Completed: "bg-[#ECEAE4] text-[#667085]",
    Admitted: "bg-[#071A3D] text-white",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
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
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#98A2B3]">
        {label}
      </p>

      <p className="mt-0.5 truncate text-xs font-semibold">
        {value}
      </p>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#E5E1D7] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#071A3D]">
        {value}
      </p>
    </div>
  );
}