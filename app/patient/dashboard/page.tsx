"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartPulse,
  LogOut,
  MapPin,
  MessageCircle,
  Pill,
  Search,
  Stethoscope,
  Video,
  WalletCards,
  Bell,
  Clock3,
  Building2,
  Menu,
  X,
} from "lucide-react";

type DoctorStatus = "Available" | "Busy" | "On Leave";
type Gender = "male" | "female";

type Doctor = {
  id: string;
  name: string;
  gender: Gender;
  department: string;
  specialization: string;
  branch: string;
  experience: number;
  patients: number;
  phone: string;
  email: string;
  status: DoctorStatus;
  image: string;
};

type Appointment = {
  branch?: string;
  specialty?: string;
  department?: string;
  doctor?: string;
  date?: string;
  time?: string;
  mode?: "Physical" | "Video Consult";
};

type QueueData = {
  appointmentKey: string;
  position: number;
  waitMinutes: number;
  updatedAt: string;
};

const DOCTORS_STORAGE_KEY = "avshDoctors";
const APPOINTMENT_STORAGE_KEY = "avshAppointment";
const QUEUE_STORAGE_KEY = "avshQueueData";
const SELECTED_BRANCH_KEY = "avshSelectedBranch";

const branches = [
  "AVSH Hyderabad",
  "AVSH Bengaluru",
  "AVSH Chennai",
  "AVSH Mumbai",
];

/*
  Fallback doctors are only used when the admin doctor
  directory has not been created yet.
*/
const fallbackDoctors: Doctor[] = [
  {
    id: "AVSH-DOC-0001",
    name: "Dr. Amelia Carter",
    gender: "female",
    department: "Cardiology",
    specialization: "Interventional Cardiology",
    branch: "AVSH Hyderabad",
    experience: 14,
    patients: 820,
    phone: "+91 9001000001",
    email: "amelia.carter@avsh.health",
    status: "Available",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "AVSH-DOC-0002",
    name: "Dr. Ethan Williams",
    gender: "male",
    department: "Neurology",
    specialization: "Stroke Medicine",
    branch: "AVSH Bengaluru",
    experience: 12,
    patients: 760,
    phone: "+91 9001000002",
    email: "ethan.williams@avsh.health",
    status: "Available",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "AVSH-DOC-0003",
    name: "Dr. Lucas Martin",
    gender: "male",
    department: "Orthopedics",
    specialization: "Joint Replacement",
    branch: "AVSH Chennai",
    experience: 16,
    patients: 910,
    phone: "+91 9001000003",
    email: "lucas.martin@avsh.health",
    status: "Available",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "AVSH-DOC-0004",
    name: "Dr. Emma Thompson",
    gender: "female",
    department: "Pediatrics",
    specialization: "Neonatology",
    branch: "AVSH Mumbai",
    experience: 11,
    patients: 690,
    phone: "+91 9001000004",
    email: "emma.thompson@avsh.health",
    status: "Available",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "AVSH-DOC-0005",
    name: "Dr. Noah Anderson",
    gender: "male",
    department: "Dermatology",
    specialization: "Medical Dermatology",
    branch: "AVSH Hyderabad",
    experience: 10,
    patients: 640,
    phone: "+91 9001000005",
    email: "noah.anderson@avsh.health",
    status: "Available",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

const quickActions = [
  {
    title: "Book Appointment",
    description: "Find a doctor and choose a time",
    icon: CalendarDays,
    route: "/patient/appointments",
  },
  {
    title: "Find Doctors",
    description: "Browse doctors by branch",
    icon: Stethoscope,
    route: "/patient/appointments",
  },
  {
    title: "Test Reports",
    description: "View your latest reports",
    icon: FileText,
    route: "/patient/reports",
  },
  {
    title: "Diagnostics",
    description: "Access diagnostic services",
    icon: ClipboardList,
    route: "/patient/diagnostics",
  },
  {
    title: "Consult Online",
    description: "Start a video consultation",
    icon: Video,
    route: "/patient/online-consultation",
  },
  {
    title: "Payments",
    description: "Manage payments and receipts",
    icon: WalletCards,
    route: "/patient/payments",
  },
  {
    title: "Wellness",
    description: "Health packages and tips",
    icon: HeartPulse,
    route: "/patient/wellness",
  },
  {
    title: "Emergency",
    description: "Access emergency care",
    icon: Activity,
    route: "/patient/emergency",
  },
];

const prescriptions = [
  {
    doctor: "Dr. Amelia Carter",
    medicine: "Atorvastatin",
    dose: "20 mg",
    instruction: "Once daily after dinner",
  },
  {
    doctor: "Dr. Ethan Williams",
    medicine: "Levetiracetam",
    dose: "500 mg",
    instruction: "Twice daily",
  },
  {
    doctor: "Dr. Lucas Martin",
    medicine: "Naproxen",
    dose: "250 mg",
    instruction: "After meals as prescribed",
  },
];

function createAppointmentKey(appointment: Appointment) {
  return [
    appointment.branch ?? "",
    appointment.specialty ?? appointment.department ?? "",
    appointment.doctor ?? "",
    appointment.date ?? "",
    appointment.time ?? "",
    appointment.mode ?? "",
  ].join("|");
}

function createQueueData(appointment: Appointment): QueueData {
  const key = createAppointmentKey(appointment);

  let hash = 0;

  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 997;
  }

  return {
    appointmentKey: key,
    position: 5 + (hash % 18),
    waitMinutes: 8 + (hash % 25),
    updatedAt: new Date().toISOString(),
  };
}

export default function PatientDashboardPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [appointment, setAppointment] =
    useState<Appointment | null>(null);
  const [queue, setQueue] = useState<QueueData | null>(null);
  const [doctors, setDoctors] =
    useState<Doctor[]>(fallbackDoctors);

  const [selectedBranch, setSelectedBranch] =
    useState("AVSH Hyderabad");

  const [showBranchPicker, setShowBranchPicker] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem(
      "avshPatientLoggedIn"
    );

    if (loggedIn !== "true") {
      router.replace("/patient/login");
      return;
    }

    setAuthorized(true);

    /* LOAD ADMIN DOCTOR DIRECTORY */

    try {
      const savedDoctors = localStorage.getItem(
        DOCTORS_STORAGE_KEY
      );

      if (savedDoctors) {
        const parsed = JSON.parse(savedDoctors);

        if (
          Array.isArray(parsed) &&
          parsed.length > 0
        ) {
          setDoctors(parsed);
        }
      }
    } catch {
      setDoctors(fallbackDoctors);
    }

    /* LOAD PATIENT APPOINTMENT */

    try {
      const savedAppointment = localStorage.getItem(
        APPOINTMENT_STORAGE_KEY
      );

      if (savedAppointment) {
        const parsedAppointment =
          JSON.parse(savedAppointment) as Appointment;

        setAppointment(parsedAppointment);

        if (
          parsedAppointment.branch &&
          branches.includes(parsedAppointment.branch)
        ) {
          setSelectedBranch(
            parsedAppointment.branch
          );
        }

        const appointmentKey =
          createAppointmentKey(parsedAppointment);

        const savedQueue = localStorage.getItem(
          QUEUE_STORAGE_KEY
        );

        if (savedQueue) {
          const parsedQueue =
            JSON.parse(savedQueue) as QueueData;

          if (
            parsedQueue.appointmentKey ===
            appointmentKey
          ) {
            setQueue(parsedQueue);
          } else {
            const newQueue =
              createQueueData(parsedAppointment);

            localStorage.setItem(
              QUEUE_STORAGE_KEY,
              JSON.stringify(newQueue)
            );

            setQueue(newQueue);
          }
        } else {
          const newQueue =
            createQueueData(parsedAppointment);

          localStorage.setItem(
            QUEUE_STORAGE_KEY,
            JSON.stringify(newQueue)
          );

          setQueue(newQueue);
        }
      } else {
        const savedBranch = localStorage.getItem(
          SELECTED_BRANCH_KEY
        );

        if (
          savedBranch &&
          branches.includes(savedBranch)
        ) {
          setSelectedBranch(savedBranch);
        }
      }
    } catch {
      setAppointment(null);
      setQueue(null);
    }
  }, [router]);

  const branchDoctors = useMemo(() => {
    return doctors.filter(
      (doctor) =>
        doctor.branch === selectedBranch
    );
  }, [doctors, selectedBranch]);

  const upcomingAppointmentCount =
    appointment ? 1 : 0;

  const reportCount = 12;

  function chooseBranch(branch: string) {
    setSelectedBranch(branch);

    localStorage.setItem(
      SELECTED_BRANCH_KEY,
      branch
    );

    setShowBranchPicker(false);
  }

  function goToBooking() {
    localStorage.setItem(
      SELECTED_BRANCH_KEY,
      selectedBranch
    );

    setMobileMenuOpen(false);

    router.push("/patient/appointments");
  }

  function viewAppointment() {
    if (!appointment) {
      goToBooking();
      return;
    }

    localStorage.setItem(
      "avshCurrentAppointment",
      JSON.stringify({
        ...appointment,
        queuePosition: queue?.position ?? 0,
        waitMinutes: queue?.waitMinutes ?? 0,
      })
    );

    router.push(
      "/patient/appointment-status"
    );
  }

  function logout() {
    localStorage.removeItem(
      "avshPatientLoggedIn"
    );

    router.replace("/patient/login");
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7F3]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#E5E1D7] border-t-[#D4A84F]" />

          <p className="text-sm text-[#667085]">
            Loading AVSH Patient Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#071A3D]">

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-50
          hidden
          w-[245px]
          flex-col
          bg-[#071A3D]
          text-white
          lg:flex
        "
      >
        {/* BRAND */}

        <div className="border-b border-white/10 px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4A84F] text-sm font-black text-[#071A3D]">
              AV
            </div>

            <div className="min-w-0">
              <p className="text-sm font-black tracking-[0.12em]">
                AVSH
              </p>

              <p className="mt-0.5 text-[10px] font-medium text-white/55">
                Advanced Healthcare
              </p>
            </div>
          </div>
        </div>

        {/* PORTAL LABEL */}

        <div className="px-4 pt-6">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4A84F]">
            Patient Portal
          </p>

          <nav className="space-y-1">
            <SidebarItem
              label="Dashboard"
              icon={Activity}
              active
              onClick={() =>
                router.push(
                  "/patient/dashboard"
                )
              }
            />

            <SidebarItem
              label="Book Appointment"
              icon={CalendarDays}
              onClick={goToBooking}
            />

            <SidebarItem
              label="Doctors"
              icon={Stethoscope}
              onClick={goToBooking}
            />

            <SidebarItem
              label="Reports"
              icon={FileText}
              onClick={() =>
                router.push(
                  "/patient/reports"
                )
              }
            />

            <SidebarItem
              label="Diagnostics"
              icon={ClipboardList}
              onClick={() =>
                router.push(
                  "/patient/diagnostics"
                )
              }
            />

            <SidebarItem
              label="Online Consultation"
              icon={Video}
              onClick={() =>
                router.push(
                  "/patient/online-consultation"
                )
              }
            />

            <SidebarItem
              label="Emergency"
              icon={Activity}
              onClick={() =>
                router.push(
                  "/patient/emergency"
                )
              }
            />

            <SidebarItem
              label="Health & Wellness"
              icon={HeartPulse}
              onClick={() =>
                router.push(
                  "/patient/wellness"
                )
              }
            />

            <SidebarItem
              label="Payments"
              icon={WalletCards}
              onClick={() =>
                router.push(
                  "/patient/payments"
                )
              }
            />
          </nav>
        </div>

        {/* SIDEBAR FOOTER */}

        <div className="mt-auto border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/5 px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Current Branch
            </p>

            <p className="mt-1 truncate text-xs font-semibold text-white/80">
              {selectedBranch}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              font-semibold
              text-white/65
              transition
              hover:bg-white/5
              hover:text-white
            "
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="fixed inset-0 z-40 bg-[#071A3D]/50 lg:hidden"
          />

          <aside
            className="
              fixed
              inset-y-0
              left-0
              z-50
              flex
              w-[285px]
              flex-col
              bg-[#071A3D]
              text-white
              shadow-2xl
              lg:hidden
            "
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4A84F] text-sm font-black text-[#071A3D]">
                  AV
                </div>

                <div>
                  <p className="text-sm font-black tracking-[0.12em]">
                    AVSH
                  </p>

                  <p className="text-[10px] text-white/50">
                    Advanced Healthcare
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="px-4 pt-6">
              <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4A84F]">
                Patient Portal
              </p>

              <nav className="space-y-1">
                <SidebarItem
                  label="Dashboard"
                  icon={Activity}
                  active
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(
                      "/patient/dashboard"
                    );
                  }}
                />

                <SidebarItem
                  label="Book Appointment"
                  icon={CalendarDays}
                  onClick={goToBooking}
                />

                <SidebarItem
                  label="Doctors"
                  icon={Stethoscope}
                  onClick={goToBooking}
                />

                <SidebarItem
                  label="Reports"
                  icon={FileText}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(
                      "/patient/reports"
                    );
                  }}
                />

                <SidebarItem
                  label="Diagnostics"
                  icon={ClipboardList}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(
                      "/patient/diagnostics"
                    );
                  }}
                />

                <SidebarItem
                  label="Online Consultation"
                  icon={Video}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(
                      "/patient/online-consultation"
                    );
                  }}
                />

                <SidebarItem
                  label="Emergency"
                  icon={Activity}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(
                      "/patient/emergency"
                    );
                  }}
                />

                <SidebarItem
                  label="Health & Wellness"
                  icon={HeartPulse}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(
                      "/patient/wellness"
                    );
                  }}
                />

                <SidebarItem
                  label="Payments"
                  icon={WalletCards}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(
                      "/patient/payments"
                    );
                  }}
                />
              </nav>
            </div>

            <div className="mt-auto border-t border-white/10 p-4">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          </aside>
        </>
      )}

      {/* =====================================================
          RIGHT SIDE APPLICATION AREA
      ===================================================== */}

      <div className="min-h-screen lg:pl-[245px]">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="sticky top-0 z-30 border-b border-[#E5E1D7] bg-white/95 backdrop-blur">
          <div className="flex min-h-[82px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">

            <div className="flex items-center gap-3">

              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                className="rounded-xl border border-[#E5E1D7] p-2.5 text-[#071A3D] lg:hidden"
                aria-label="Open patient menu"
              >
                <Menu size={20} />
              </button>

              <div className="lg:hidden">
                <p className="text-sm font-black tracking-wide">
                  AVSH
                </p>

                <p className="text-[11px] font-medium text-[#667085]">
                  Patient Portal
                </p>
              </div>

              {/* DESKTOP HEADER LABEL */}

              <div className="hidden lg:block">
                <p className="text-sm font-black tracking-wide">
                  Patient Healthcare Portal
                </p>

                <p className="mt-0.5 text-xs text-[#667085]">
                  Manage your AVSH healthcare services
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative rounded-xl p-2.5 text-[#667085] transition hover:bg-[#F8F7F3] hover:text-[#071A3D]"
                aria-label="Notifications"
              >
                <Bell size={19} />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#D4A84F]" />
              </button>

              <div className="hidden border-l border-[#E5E1D7] pl-4 sm:block">
                <p className="text-sm font-bold">
                  Patient Portal
                </p>

                <p className="text-xs text-[#667085]">
                  AVSH Healthcare
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#071A3D] text-sm font-bold text-white">
                PW
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="min-w-0">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">

            {/* WELCOME */}

            <section className="mb-7">
              <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
                <div>
                  <p className="mb-2 text-sm font-medium text-[#667085]">
                    Your AVSH healthcare overview
                  </p>

                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Welcome back.
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                    Manage appointments, reports,
                    prescriptions and healthcare
                    services from one secure place.
                  </p>
                </div>

                {/* BRANCH PICKER */}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowBranchPicker(
                        (current) => !current
                      )
                    }
                    className="flex min-w-[240px] items-center justify-between gap-4 rounded-xl border border-[#E5E1D7] bg-white px-4 py-3 text-left shadow-sm transition hover:border-[#D4A84F]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8F7F3] text-[#9A7A32]">
                        <MapPin size={17} />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A7A32]">
                          Selected Branch
                        </p>

                        <p className="mt-0.5 text-sm font-bold">
                          {selectedBranch.replace(
                            "AVSH ",
                            ""
                          )}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      size={17}
                      className={
                        showBranchPicker
                          ? "rotate-90 transition"
                          : "transition"
                      }
                    />
                  </button>

                  {showBranchPicker && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[280px] overflow-hidden rounded-2xl border border-[#E5E1D7] bg-white p-2 shadow-xl">
                      <div className="px-3 py-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                          Choose AVSH Branch
                        </p>

                        <p className="mt-1 text-xs text-[#667085]">
                          Your selected branch will
                          be used for doctor booking.
                        </p>
                      </div>

                      {branches.map((branch) => {
                        const count =
                          doctors.filter(
                            (doctor) =>
                              doctor.branch === branch
                          ).length;

                        return (
                          <button
                            type="button"
                            key={branch}
                            onClick={() =>
                              chooseBranch(branch)
                            }
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                              selectedBranch === branch
                                ? "bg-[#071A3D] text-white"
                                : "hover:bg-[#F8F7F3]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Building2
                                size={17}
                                className={
                                  selectedBranch === branch
                                    ? "text-[#D4A84F]"
                                    : "text-[#9A7A32]"
                                }
                              />

                              <span className="text-sm font-semibold">
                                {branch}
                              </span>
                            </div>

                            <span
                              className={`text-[10px] font-bold ${
                                selectedBranch === branch
                                  ? "text-[#F1D58A]"
                                  : "text-[#667085]"
                              }`}
                            >
                              {count || 80} doctors
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* STATS */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Upcoming Appointments"
                value={String(
                  upcomingAppointmentCount
                )}
                description="scheduled visit"
                icon={CalendarDays}
              />

              <StatCard
                label="Test Reports"
                value={String(reportCount)}
                description="available reports"
                icon={FileText}
              />

              <StatCard
                label="Prescriptions"
                value={String(
                  prescriptions.length
                )}
                description="active records"
                icon={Pill}
              />

              <StatCard
                label="Queue Status"
                value={
                  queue
                    ? `${queue.waitMinutes} min`
                    : "—"
                }
                description={
                  queue
                    ? `Position #${queue.position}`
                    : "No active queue"
                }
                icon={Clock3}
              />
            </section>

            {/* APPOINTMENT + DOCTORS */}

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]">

              {/* APPOINTMENT */}

              <div className="min-w-0 overflow-hidden rounded-2xl border border-[#E5E1D7] bg-white shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
                <div className="flex items-center justify-between border-b border-[#E5E1D7] px-5 py-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                      Your Care
                    </p>

                    <h2 className="mt-1 font-bold">
                      Upcoming Appointment
                    </h2>
                  </div>

                  <CalendarDays
                    size={20}
                    className="text-[#9A7A32]"
                  />
                </div>

                {appointment ? (
                  <div className="p-5">
                    <div className="flex flex-col gap-5 rounded-2xl bg-[#F8F7F3] p-5 sm:flex-row sm:items-center">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#071A3D] text-xl font-black text-white">
                        {appointment.doctor
                          ? appointment.doctor
                              .replace("Dr. ", "")
                              .split(" ")
                              .map(
                                (word) =>
                                  word[0]
                              )
                              .join("")
                              .slice(0, 2)
                          : "DR"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                          {appointment.mode ||
                            "Physical"}{" "}
                          Appointment
                        </p>

                        <h3 className="mt-1 break-words text-xl font-black">
                          {appointment.doctor ||
                            "Doctor not selected"}
                        </h3>

                        <p className="mt-1 text-sm text-[#667085]">
                          {appointment.specialty ||
                            appointment.department ||
                            "Medical consultation"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E5E1D7] bg-white px-3 py-1.5 text-xs font-semibold">
                            <MapPin
                              size={13}
                              className="shrink-0 text-[#9A7A32]"
                            />
                            <span className="truncate">
                              {appointment.branch ||
                                selectedBranch}
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E1D7] bg-white px-3 py-1.5 text-xs font-semibold">
                            <CalendarDays
                              size={13}
                              className="text-[#9A7A32]"
                            />
                            {appointment.date ||
                              "Date pending"}
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E1D7] bg-white px-3 py-1.5 text-xs font-semibold">
                            <Clock3
                              size={13}
                              className="text-[#9A7A32]"
                            />
                            {appointment.time ||
                              "Time pending"}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span className="inline-flex rounded-full bg-[#F3F1EB] px-3 py-1.5 text-xs font-bold text-[#9A7A32]">
                          Confirmed
                        </span>
                      </div>
                    </div>

                    {queue && (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-[#E5E1D7] p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-[#667085]">
                                Queue Position
                              </p>

                              <p className="mt-1 text-3xl font-black">
                                #{queue.position}
                              </p>
                            </div>

                            <Activity
                              size={21}
                              className="text-[#9A7A32]"
                            />
                          </div>

                          <p className="mt-2 text-xs text-[#667085]">
                            Live appointment queue
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#E5E1D7] p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-[#667085]">
                                Estimated Wait
                              </p>

                              <p className="mt-1 text-3xl font-black">
                                {queue.waitMinutes} min
                              </p>
                            </div>

                            <Clock3
                              size={21}
                              className="text-[#9A7A32]"
                            />
                          </div>

                          <p className="mt-2 text-xs text-[#667085]">
                            Updated automatically
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={viewAppointment}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071A3D] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#102A56]"
                    >
                      View Appointment Status
                      <ArrowRight size={17} />
                    </button>
                  </div>
                ) : (
                  <div className="p-5">
                    <div className="rounded-2xl bg-[#F8F7F3] p-7 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#9A7A32] shadow-sm">
                        <CalendarDays size={25} />
                      </div>

                      <h3 className="mt-4 text-lg font-black">
                        No upcoming appointment
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
                        Choose your AVSH branch and
                        book a physical or video
                        consultation with an available
                        doctor.
                      </p>

                      <button
                        type="button"
                        onClick={goToBooking}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#071A3D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102A56]"
                      >
                        Book Appointment
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* BRANCH DOCTORS */}

              <div className="min-w-0 rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                      Selected Branch
                    </p>

                    <h2 className="mt-1 truncate font-bold">
                      {selectedBranch}
                    </h2>

                    <p className="mt-1 text-xs text-[#667085]">
                      Doctors available at this branch
                    </p>
                  </div>

                  <Building2
                    size={21}
                    className="shrink-0 text-[#9A7A32]"
                  />
                </div>

                <div className="mt-5 space-y-3">
                  {branchDoctors
                    .slice(0, 4)
                    .map((doctor) => (
                      <div
                        key={doctor.id}
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E5E1D7] p-3"
                      >
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="h-11 w-11 shrink-0 rounded-full border border-[#E5E1D7] object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">
                            {doctor.name}
                          </p>

                          <p className="truncate text-xs text-[#667085]">
                            {doctor.department}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-[#9A7A32]">
                            {doctor.specialization}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                            doctor.status ===
                            "Available"
                              ? "bg-emerald-50 text-emerald-700"
                              : doctor.status ===
                                "Busy"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {doctor.status}
                        </span>
                      </div>
                    ))}

                  {branchDoctors.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#E5E1D7] p-6 text-center">
                      <Search
                        size={22}
                        className="mx-auto text-[#98A2B3]"
                      />

                      <p className="mt-2 text-sm font-semibold">
                        Branch doctors will appear here
                      </p>

                      <p className="mt-1 text-xs text-[#667085]">
                        Select another branch or open
                        the booking page.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={goToBooking}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E1D7] px-4 py-3 text-sm font-bold transition hover:bg-[#F8F7F3]"
                >
                  View Doctors & Book
                  <ChevronRight size={17} />
                </button>
              </div>
            </section>

            {/* QUICK ACTIONS */}

            <section className="mt-6">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                  Healthcare Services
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Quick Actions
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      type="button"
                      key={action.title}
                      onClick={() => {
                        if (
                          action.title ===
                            "Book Appointment" ||
                          action.title ===
                            "Find Doctors"
                        ) {
                          goToBooking();
                          return;
                        }

                        router.push(action.route);
                      }}
                      className="group min-w-0 rounded-2xl border border-[#E5E1D7] bg-white p-5 text-left shadow-[0_8px_30px_rgba(7,26,61,0.03)] transition hover:-translate-y-0.5 hover:border-[#D4A84F] hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8F7F3] text-[#9A7A32] transition group-hover:bg-[#071A3D] group-hover:text-white">
                          <Icon size={20} />
                        </div>

                        <ArrowRight
                          size={17}
                          className="text-[#98A2B3] transition group-hover:translate-x-1 group-hover:text-[#9A7A32]"
                        />
                      </div>

                      <p className="mt-5 text-sm font-bold">
                        {action.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#667085]">
                        {action.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* PRESCRIPTIONS */}

            <section className="mt-6 overflow-hidden rounded-2xl border border-[#E5E1D7] bg-white shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
              <div className="flex items-center justify-between border-b border-[#E5E1D7] px-5 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#9A7A32]">
                    Medication
                  </p>

                  <h2 className="mt-1 font-bold">
                    Recent Prescriptions
                  </h2>
                </div>

                <Pill
                  size={20}
                  className="text-[#9A7A32]"
                />
              </div>

              <div className="divide-y divide-[#E5E1D7]">
                {prescriptions.map((prescription) => (
                  <div
                    key={`${prescription.doctor}-${prescription.medicine}`}
                    className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold">
                        {prescription.medicine}{" "}
                        <span className="font-semibold text-[#9A7A32]">
                          {prescription.dose}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-[#667085]">
                        {prescription.doctor}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#667085]">
                      <Clock3 size={14} />

                      {prescription.instruction}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI ASSISTANT */}

            <section className="mt-6 overflow-hidden rounded-2xl bg-[#071A3D] text-white">
              <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/30 bg-[#D4A84F]/10 px-3 py-1.5 text-xs font-bold text-[#F1D58A]">
                    <MessageCircle size={14} />
                    AVSH AI Assistant
                  </div>

                  <h2 className="text-2xl font-black tracking-tight">
                    Need help navigating your care?
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                    Get help understanding your
                    appointments, reports, prescriptions
                    and AVSH healthcare services.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "AVSH AI Assistant will be connected to OpenAI next."
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4A84F] px-5 py-3 text-sm font-black text-[#071A3D] transition hover:bg-[#F1D58A]"
                >
                  Open AI Assistant
                  <ArrowRight size={17} />
                </button>
              </div>
            </section>

            {/* FOOTER */}

            <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-[#E5E1D7] pt-5 text-xs text-[#98A2B3] sm:flex-row">
              <p>
                AVSH Hospital · Patient Healthcare
                Platform
              </p>

              <p>
                Synthetic demonstration data · AI
                is assistive, not clinical
                decision-making
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  label,
  icon: Icon,
  active = false,
  onClick,
}: {
  label: string;
  icon: typeof Activity;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
        active
          ? "bg-[#D4A84F] text-[#071A3D] shadow-sm"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon size={17} />

      <span className="flex-1">
        {label}
      </span>

      {active && <ChevronRight size={15} />}
    </button>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Activity;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,61,0.04)]">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8F7F3] text-[#9A7A32]">
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-[#667085]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#98A2B3]">
        {description}
      </p>
    </div>
  );
}