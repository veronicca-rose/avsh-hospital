"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Appointment = {
  branch: string;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
};

export default function ConfirmationPage() {
  const router = useRouter();

  const [live, setLive] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAppointment = localStorage.getItem("avshAppointment");

    if (savedAppointment) {
      try {
        const parsedAppointment = JSON.parse(savedAppointment);

        if (
          parsedAppointment &&
          parsedAppointment.branch &&
          parsedAppointment.specialty &&
          parsedAppointment.doctor &&
          parsedAppointment.date &&
          parsedAppointment.time
        ) {
          setAppointment(parsedAppointment);
        }
      } catch {
        localStorage.removeItem("avshAppointment");
      }
    }

    setLoading(false);
  }, []);

  const formatDate = (date: string) => {
    if (!date) return "Not selected";

    const formatted = new Date(`${date}T00:00:00`);

    if (Number.isNaN(formatted.getTime())) {
      return "Not selected";
    }

    return formatted.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const appointmentId = appointment
    ? `AVSH-${new Date().getFullYear()}-${appointment.date.replaceAll(
        "-",
        ""
      )}-1042`
    : "AVSH-2026-00000000-1042";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F3] text-[#071A3D]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E5E1D7] border-t-[#D4A84F]" />

          <p className="mt-5 text-sm font-medium text-[#667085]">
            Loading your appointment...
          </p>
        </div>
      </main>
    );
  }

  if (!appointment) {
    return (
      <main className="min-h-screen bg-[#F8F7F3] text-[#071A3D]">

        <header className="border-b border-[#E5E1D7] bg-white">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

            <a href="/" className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A84F] text-sm font-bold text-[#D4A84F]">
                AV
              </div>

              <div>
                <div className="text-xl font-semibold tracking-wide">
                  AVSH
                </div>

                <div className="text-[9px] uppercase tracking-[0.2em] text-[#D4A84F]">
                  Advanced Healthcare
                </div>
              </div>

            </a>

            <a
              href="/patient/dashboard"
              className="rounded-full border border-[#E5E1D7] px-5 py-2.5 text-sm font-semibold hover:border-[#D4A84F]"
            >
              Dashboard
            </a>

          </div>
        </header>

        <div className="mx-auto max-w-2xl px-6 py-24">

          <div className="rounded-[2rem] border border-[#E5E1D7] bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F1D58A]/30 text-2xl">
              !
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A84F]">
              Appointment not found
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              No appointment details available.
            </h1>

            <p className="mx-auto mt-4 max-w-lg leading-7 text-[#667085]">
              Please return to the appointment page and select a branch,
              speciality, doctor, date and time before continuing.
            </p>

            <button
              onClick={() => router.push("/patient/appointments")}
              className="mt-8 rounded-xl bg-[#071A3D] px-7 py-3.5 font-semibold text-white transition hover:bg-[#102A56]"
            >
              Book an appointment
            </button>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#071A3D]">

      {/* NAVIGATION */}
      <header className="border-b border-[#E5E1D7] bg-white">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <a href="/" className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A84F] text-sm font-bold text-[#D4A84F]">
              AV
            </div>

            <div>
              <div className="text-xl font-semibold tracking-wide">
                AVSH
              </div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-[#D4A84F]">
                Advanced Healthcare
              </div>
            </div>

          </a>

          <a
            href="/patient/dashboard"
            className="rounded-full border border-[#E5E1D7] px-5 py-2.5 text-sm font-semibold hover:border-[#D4A84F]"
          >
            Dashboard
          </a>

        </div>

      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* SUCCESS */}
        <section className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4A84F] text-2xl font-bold text-[#071A3D]">
            ✓
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A84F]">
            Appointment confirmed
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Your appointment is booked.
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#667085]">
            Your appointment has been successfully added to your AVSH
            healthcare journey.
          </p>

        </section>

        {/* APPOINTMENT CARD */}
        <section className="mt-10 overflow-hidden rounded-[2rem] border border-[#E5E1D7] bg-white shadow-sm">

          {/* ID */}
          <div className="border-b border-[#E5E1D7] p-7 md:p-8">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#98A2B3]">
                  Appointment ID
                </p>

                <p className="mt-1 font-mono text-sm font-semibold">
                  {appointmentId}
                </p>

              </div>

              <div className="rounded-full bg-[#F1D58A]/30 px-4 py-2 text-sm font-semibold">
                Confirmed
              </div>

            </div>

          </div>

          <div className="grid md:grid-cols-2">

            {/* APPOINTMENT DETAILS */}
            <div className="border-b border-[#E5E1D7] p-7 md:border-b-0 md:border-r md:p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#D4A84F]">
                Doctor
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {appointment.doctor}
              </h2>

              <p className="mt-1 text-[#D4A84F]">
                {appointment.specialty}
              </p>

              <div className="mt-7 space-y-4 text-sm">

                <div>
                  <div className="text-[#98A2B3]">
                    Branch
                  </div>

                  <div className="mt-1 font-semibold">
                    {appointment.branch}
                  </div>
                </div>

                <div>
                  <div className="text-[#98A2B3]">
                    Department
                  </div>

                  <div className="mt-1 font-semibold">
                    {appointment.specialty}
                  </div>
                </div>

                <div>
                  <div className="text-[#98A2B3]">
                    Date
                  </div>

                  <div className="mt-1 font-semibold">
                    {formatDate(appointment.date)}
                  </div>
                </div>

                <div>
                  <div className="text-[#98A2B3]">
                    Appointment time
                  </div>

                  <div className="mt-1 font-semibold">
                    {appointment.time}
                  </div>
                </div>

              </div>

            </div>

            {/* QUEUE */}
            <div className="bg-[#071A3D] p-7 text-white md:p-8">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#D4A84F]">
                    Live queue
                  </p>

                  <p className="mt-1 text-sm text-white/50">
                    {appointment.specialty} · {appointment.branch}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => setLive(!live)}
                  className="flex items-center gap-2 text-xs text-white/50"
                >

                  <span
                    className={`h-2 w-2 rounded-full ${
                      live
                        ? "bg-[#D4A84F]"
                        : "bg-white/30"
                    }`}
                  />

                  {live ? "Live" : "Paused"}

                </button>

              </div>

              <div className="mt-10 grid grid-cols-2 gap-6">

                <div>

                  <div className="text-sm text-white/40">
                    Your position
                  </div>

                  <div className="mt-2 text-5xl font-bold text-[#D4A84F]">
                    #04
                  </div>

                </div>

                <div>

                  <div className="text-sm text-white/40">
                    Estimated wait
                  </div>

                  <div className="mt-2 text-4xl font-bold">
                    18 min
                  </div>

                </div>

              </div>

              <div className="mt-8 border-t border-white/10 pt-6">

                <div className="flex justify-between text-sm">

                  <span className="text-white/50">
                    Patients ahead
                  </span>

                  <span className="font-semibold">
                    3
                  </span>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

                  <div className="h-full w-[65%] rounded-full bg-[#D4A84F]" />

                </div>

                <p className="mt-3 text-xs leading-5 text-white/40">
                  Estimated waiting time may change as appointments and
                  queue activity are updated.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* AI OPTIMIZATION NOTE */}
        <section className="mt-6 rounded-2xl border border-[#E5E1D7] bg-white p-6">

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071A3D] text-sm font-bold text-[#D4A84F]">
              AI
            </div>

            <div>

              <h3 className="font-semibold">
                AVSH queue intelligence
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Queue information can be analyzed to help hospital
                administrators identify congestion, improve resource
                allocation and reduce unnecessary waiting.
              </p>

            </div>

          </div>

        </section>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">

          <a
            href="/patient/dashboard"
            className="rounded-xl bg-[#071A3D] px-7 py-3.5 text-center font-semibold text-white hover:bg-[#102A56]"
          >
            Go to Dashboard
          </a>

          <a
            href="/patient/appointments"
            className="rounded-xl border border-[#E5E1D7] bg-white px-7 py-3.5 text-center font-semibold hover:border-[#D4A84F]"
          >
            Book another appointment
          </a>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-[#E5E1D7] bg-white">

        <div className="mx-auto flex max-w-7xl justify-between px-6 py-8 text-sm text-[#667085]">

          <p>
            © 2026 AVSH Healthcare
          </p>

          <a
            href="/"
            className="font-medium text-[#071A3D] hover:text-[#D4A84F]"
          >
            AVSH Home
          </a>

        </div>

      </footer>

    </main>
  );
}