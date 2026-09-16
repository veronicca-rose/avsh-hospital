"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Home,
  LogOut,
  Menu,
  UserRound,
  Users,
  Activity,
} from "lucide-react";

export default function AppointmentStatusPage() {
  const router = useRouter();

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("avshPatientLoggedIn");

    if (loggedIn !== "true") {
      router.push("/patient/login");
      return;
    }

    const savedAppointment = localStorage.getItem("avshCurrentAppointment");

    if (savedAppointment) {
      try {
        setAppointment(JSON.parse(savedAppointment));
      } catch {
        setAppointment(null);
      }
    } else {
      setAppointment({
        branch: "AVSH Hyderabad",
        specialty: "Cardiology",
        doctor: "Dr. Aditya Sharma",
        date: "2026-09-18",
        time: "10:30 AM",
      });
    }

    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("avshPatientLoggedIn");
    router.push("/patient/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f3] flex items-center justify-center">
        <div className="text-[#071a3d] text-lg font-semibold">
          Loading appointment...
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-[#f8f7f3] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-[#e5e1d7] p-10 text-center max-w-md shadow-sm">
          <h1 className="text-2xl font-bold text-[#071a3d]">
            No appointment found
          </h1>

          <p className="text-[#667085] mt-3">
            Please return to your dashboard and select an appointment.
          </p>

          <button
            onClick={() => router.push("/patient/dashboard")}
            className="mt-6 bg-[#071a3d] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[76px] bg-[#071a3d] text-white flex items-center justify-between px-5 md:px-8 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            <Menu size={24} />
          </button>

          <button
            onClick={() => router.push("/patient/dashboard")}
            className="text-2xl font-extrabold tracking-wide"
          >
            AVSH
          </button>

          <span className="hidden sm:block text-[#f1d58a] text-sm">
            Patient Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-white/80">
            <UserRound size={18} />
            Patient
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-[76px] bottom-0 left-0 z-40 w-[210px] bg-[#102a56] text-white p-4 transition-transform duration-200 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <nav className="space-y-1">
          <button
            onClick={() => router.push("/patient/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-left"
          >
            <Home size={18} />
            Dashboard
          </button>

          <button
            onClick={() => router.push("/patient/appointments")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-left"
          >
            <CalendarDays size={18} />
            Book Appointment
          </button>

          <button
            onClick={() => router.push("/patient/doctors")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-left"
          >
            <UserRound size={18} />
            Doctors
          </button>

          <button
            onClick={() => router.push("/patient/reports")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-left"
          >
            <Activity size={18} />
            Reports
          </button>

          <button
            onClick={() => router.push("/patient/diagnostics")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-left"
          >
            <Activity size={18} />
            Diagnostics
          </button>

          <button
            onClick={() => router.push("/patient/consultation")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-left"
          >
            <Users size={18} />
            Online Consultation
          </button>

          <button
            onClick={() => router.push("/patient/emergency")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-left"
          >
            <Clock3 size={18} />
            Emergency
          </button>

          <button
            onClick={() => router.push("/patient/wellness")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-left"
          >
            <Activity size={18} />
            Health & Wellness
          </button>

          <button
            onClick={() => router.push("/patient/profile")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-left"
          >
            <UserRound size={18} />
            Profile
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="pt-[76px] md:ml-[210px] min-h-screen">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
          {/* BACK */}
          <button
            onClick={() => router.push("/patient/dashboard")}
            className="flex items-center gap-2 text-[#667085] hover:text-[#071a3d] font-medium mb-6"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          {/* TITLE */}
          <div className="mb-8">
            <p className="text-[#d4a84f] uppercase tracking-[0.2em] text-xs font-bold">
              Appointment Tracking
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">
              Appointment Status
            </h1>

            <p className="text-[#667085] mt-2">
              Track your appointment and estimated waiting time.
            </p>
          </div>

          {/* CONFIRMED */}
          <div className="bg-white border border-[#e5e1d7] rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#eef8f0] flex items-center justify-center">
                  <CheckCircle2
                    size={27}
                    className="text-green-700"
                  />
                </div>

                <div>
                  <p className="text-green-700 font-bold text-sm uppercase tracking-wide">
                    Appointment Confirmed
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {appointment.doctor}
                  </h2>

                  <p className="text-[#667085]">
                    {appointment.specialty}
                  </p>
                </div>
              </div>

              <div className="bg-[#f8f7f3] rounded-xl px-5 py-3">
                <p className="text-xs text-[#667085] uppercase tracking-wide">
                  Appointment ID
                </p>
                <p className="font-bold mt-1">
                  AVSH-2026-0918
                </p>
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="border border-[#e5e1d7] rounded-xl p-5">
                <CalendarDays
                  size={21}
                  className="text-[#d4a84f]"
                />
                <p className="text-sm text-[#667085] mt-3">
                  Date
                </p>
                <p className="font-bold mt-1">
                  {appointment.date}
                </p>
              </div>

              <div className="border border-[#e5e1d7] rounded-xl p-5">
                <Clock3
                  size={21}
                  className="text-[#d4a84f]"
                />
                <p className="text-sm text-[#667085] mt-3">
                  Time
                </p>
                <p className="font-bold mt-1">
                  {appointment.time}
                </p>
              </div>

              <div className="border border-[#e5e1d7] rounded-xl p-5">
                <Home
                  size={21}
                  className="text-[#d4a84f]"
                />
                <p className="text-sm text-[#667085] mt-3">
                  Branch
                </p>
                <p className="font-bold mt-1">
                  {appointment.branch}
                </p>
              </div>
            </div>
          </div>

          {/* QUEUE */}
          <div className="mt-6 grid md:grid-cols-3 gap-5">
            <div className="bg-white border border-[#e5e1d7] rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <Users className="text-[#d4a84f]" />
                <span className="text-[#667085]">
                  Patients Ahead
                </span>
              </div>

              <p className="text-4xl font-extrabold mt-4">
                3
              </p>

              <p className="text-sm text-[#667085] mt-1">
                In the current queue
              </p>
            </div>

            <div className="bg-white border border-[#e5e1d7] rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <Clock3 className="text-[#d4a84f]" />
                <span className="text-[#667085]">
                  Estimated Wait
                </span>
              </div>

              <p className="text-4xl font-extrabold mt-4">
                18 min
              </p>

              <p className="text-sm text-[#667085] mt-1">
                Estimated operational wait
              </p>
            </div>

            <div className="bg-white border border-[#e5e1d7] rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <Activity className="text-[#d4a84f]" />
                <span className="text-[#667085]">
                  Queue Progress
                </span>
              </div>

              <p className="text-4xl font-extrabold mt-4">
                65%
              </p>

              <div className="h-2 bg-[#eeeae1] rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-[#d4a84f] rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
          </div>

          {/* WAIT GRAPH */}
          <div className="mt-6 bg-white border border-[#e5e1d7] rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  Estimated Waiting Time
                </h2>

                <p className="text-sm text-[#667085] mt-1">
                  Queue movement over the last few intervals
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-2 rounded-full bg-[#f8f7f3] text-[#667085]">
                Demo operational data
              </span>
            </div>

            <div className="mt-8">
              <svg
                viewBox="0 0 900 280"
                className="w-full h-[260px]"
                preserveAspectRatio="none"
              >
                {/* GRID */}
                <line
                  x1="60"
                  y1="40"
                  x2="860"
                  y2="40"
                  stroke="#e5e1d7"
                  strokeWidth="1"
                />

                <line
                  x1="60"
                  y1="100"
                  x2="860"
                  y2="100"
                  stroke="#e5e1d7"
                  strokeWidth="1"
                />

                <line
                  x1="60"
                  y1="160"
                  x2="860"
                  y2="160"
                  stroke="#e5e1d7"
                  strokeWidth="1"
                />

                <line
                  x1="60"
                  y1="220"
                  x2="860"
                  y2="220"
                  stroke="#e5e1d7"
                  strokeWidth="1"
                />

                {/* AREA */}
                <path
                  d="M60 75 L190 105 L320 125 L450 150 L580 135 L710 175 L860 185 L860 220 L60 220 Z"
                  fill="#f1d58a"
                  opacity="0.28"
                />

                {/* LINE */}
                <path
                  d="M60 75 L190 105 L320 125 L450 150 L580 135 L710 175 L860 185"
                  fill="none"
                  stroke="#d4a84f"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* POINTS */}
                <circle cx="60" cy="75" r="6" fill="#071a3d" />
                <circle cx="190" cy="105" r="6" fill="#071a3d" />
                <circle cx="320" cy="125" r="6" fill="#071a3d" />
                <circle cx="450" cy="150" r="6" fill="#071a3d" />
                <circle cx="580" cy="135" r="6" fill="#071a3d" />
                <circle cx="710" cy="175" r="6" fill="#071a3d" />
                <circle cx="860" cy="185" r="7" fill="#071a3d" />

                {/* LABELS */}
                <text x="48" y="250" fontSize="13" fill="#667085">
                  9:30
                </text>

                <text x="300" y="250" fontSize="13" fill="#667085">
                  9:50
                </text>

                <text x="550" y="250" fontSize="13" fill="#667085">
                  10:10
                </text>

                <text x="825" y="250" fontSize="13" fill="#667085">
                  10:30
                </text>
              </svg>
            </div>
          </div>

          {/* AI NOTE */}
          <div className="mt-6 bg-[#071a3d] text-white rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#d4a84f] flex items-center justify-center text-[#071a3d] font-extrabold">
                AI
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  AVSH AI Queue Insight
                </h2>

                <p className="text-white/75 mt-2 leading-7">
                  The current queue estimate indicates approximately
                  18 minutes of waiting time. This estimate is based
                  on demo operational data and may change as patients
                  are checked in or consultations are completed.
                </p>
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/patient/dashboard")}
              className="bg-[#071a3d] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#102a56]"
            >
              Back to Dashboard
            </button>

            <button
              onClick={() => router.push("/patient/appointments")}
              className="border border-[#071a3d] text-[#071a3d] px-6 py-3 rounded-xl font-semibold hover:bg-white"
            >
              Book Another Appointment
            </button>
          </div>

          <p className="text-xs text-[#667085] mt-8">
            Queue and waiting-time information shown here is
            illustrative/demo operational data for the AVSH project.
          </p>
        </div>
      </main>
    </div>
  );
}