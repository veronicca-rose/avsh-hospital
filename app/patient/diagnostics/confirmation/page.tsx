"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FlaskConical,
  Home,
  MapPin,
  Package,
  ReceiptText,
} from "lucide-react";

type DiagnosticBooking = {
  id: string;
  serviceType: "test" | "package";
  serviceName: string;
  branch: string;
  date: string;
  time: string;
  amount: number;
  bookedAt: string;
  status: string;
};

type Payment = {
  paymentId: string;
  method: string;
  status: string;
  paidAt: string;
};

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DiagnosticConfirmationPage() {
  const router = useRouter();

  const [booking, setBooking] =
    useState<DiagnosticBooking | null>(null);

  const [payment, setPayment] =
    useState<Payment | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("avshPatientLoggedIn") === "true";

    if (!loggedIn) {
      router.push("/patient/login");
      return;
    }

    try {
      const storedBooking = localStorage.getItem(
        "avshDiagnosticBooking"
      );

      const storedPayment = localStorage.getItem(
        "avshLastPayment"
      );

      if (storedBooking) {
        setBooking(JSON.parse(storedBooking));
      }

      if (storedPayment) {
        setPayment(JSON.parse(storedPayment));
      }
    } catch {
      setBooking(null);
      setPayment(null);
    }

    setLoading(false);
  }, [router]);

  const downloadReceipt = () => {
    if (!booking) return;

    const receipt = `
AVSH HOSPITAL
Diagnostic Booking Confirmation
================================

Booking ID: ${booking.id}

Service:
${booking.serviceName}

Type:
${
  booking.serviceType === "package"
    ? "Health Package"
    : "Diagnostic Test"
}

Branch:
${booking.branch}

Date:
${formatDate(booking.date)}

Time:
${booking.time}

Amount Paid:
₹${booking.amount.toLocaleString("en-IN")}

Payment Status:
Paid

Transaction ID:
${payment?.paymentId || "AVSH-PAY-DEMO"}

Payment Method:
${payment?.method || "Online Payment"}

Booked On:
${formatDateTime(booking.bookedAt)}

================================
AVSH demonstration system.
All information shown is synthetic
data created for the university project.
`;

    const blob = new Blob([receipt], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${booking.id}-receipt.txt`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e5e1d7] border-t-[#071a3d]" />
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3] px-6">
        <div className="w-full max-w-lg rounded-3xl border border-[#e5e1d7] bg-white p-8 text-center shadow-[0_20px_60px_rgba(7,26,61,0.07)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f7f3]">
            <FlaskConical size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            No diagnostic booking found
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Start a diagnostic booking from the AVSH Diagnostics
            page.
          </p>

          <button
            onClick={() =>
              router.push("/patient/diagnostics")
            }
            className="mt-7 rounded-xl bg-[#071a3d] px-6 py-3 font-semibold text-white hover:bg-[#102a56]"
          >
            Go to Diagnostics
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* HEADER */}
      <header className="border-b border-[#e5e1d7] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <button
            onClick={() => router.push("/patient/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071a3d]">
              <span className="text-lg font-bold text-[#d4a84f]">
                A
              </span>
            </div>

            <div className="text-left">
              <p className="font-bold">AVSH</p>
              <p className="text-xs text-[#667085]">
                Patient Portal
              </p>
            </div>
          </button>

          <button
            onClick={() =>
              router.push("/patient/dashboard")
            }
            className="hidden items-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#071a3d] sm:flex"
          >
            <Home size={16} />
            Dashboard
          </button>
        </div>
      </header>

      {/* MAIN */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        {/* SUCCESS */}
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f1d58a]/30">
            <CheckCircle2
              size={52}
              className="text-[#071a3d]"
            />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#d4a84f]">
            Booking confirmed
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Your diagnostic appointment is confirmed
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[#667085]">
            Your payment was successfully recorded and your
            diagnostic booking is now confirmed with AVSH.
          </p>
        </div>

        {/* BOOKING CARD */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-[#e5e1d7] bg-white shadow-[0_20px_60px_rgba(7,26,61,0.07)]">
          <div className="bg-[#071a3d] px-6 py-7 text-white sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/60">
                  Booking ID
                </p>

                <p className="mt-1 text-xl font-bold tracking-wide">
                  {booking.id}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2 text-sm font-semibold sm:self-auto">
                <CheckCircle2 size={16} />
                Confirmed
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* SERVICE */}
            <div className="flex items-start gap-4 border-b border-[#e5e1d7] pb-7">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f8f7f3]">
                {booking.serviceType === "package" ? (
                  <Package
                    size={26}
                    className="text-[#071a3d]"
                  />
                ) : (
                  <FlaskConical
                    size={26}
                    className="text-[#071a3d]"
                  />
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#667085]">
                  {booking.serviceType === "package"
                    ? "Health Package"
                    : "Diagnostic Test"}
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {booking.serviceName}
                </h2>
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid gap-6 py-7 sm:grid-cols-2">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f7f3]">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs text-[#667085]">
                    AVSH Branch
                  </p>

                  <p className="mt-1 font-semibold">
                    {booking.branch}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f7f3]">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="text-xs text-[#667085]">
                    Appointment Date
                  </p>

                  <p className="mt-1 font-semibold">
                    {formatDate(booking.date)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f7f3]">
                  <Clock3 size={18} />
                </div>

                <div>
                  <p className="text-xs text-[#667085]">
                    Appointment Time
                  </p>

                  <p className="mt-1 font-semibold">
                    {booking.time}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f7f3]">
                  <ReceiptText size={18} />
                </div>

                <div>
                  <p className="text-xs text-[#667085]">
                    Amount Paid
                  </p>

                  <p className="mt-1 font-semibold">
                    ₹
                    {booking.amount.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="rounded-2xl border border-[#e5e1d7] bg-[#f8f7f3] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-[#667085]">
                    Payment status
                  </p>

                  <p className="mt-1 font-bold">
                    Paid successfully
                  </p>

                  {payment?.paymentId && (
                    <p className="mt-1 text-xs text-[#667085]">
                      Transaction: {payment.paymentId}
                    </p>
                  )}
                </div>

                <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
                  ₹
                  {booking.amount.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() =>
                  router.push("/patient/dashboard")
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-3.5 font-semibold text-white transition hover:bg-[#102a56]"
              >
                <Home size={17} />
                Go to Dashboard
              </button>

              <button
                onClick={downloadReceipt}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5e1d7] bg-white px-5 py-3.5 font-semibold transition hover:bg-[#f8f7f3]"
              >
                <Download size={17} />
                Download Receipt
              </button>

              <button
                onClick={() =>
                  router.push("/patient/diagnostics")
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5e1d7] bg-white px-5 py-3.5 font-semibold transition hover:bg-[#f8f7f3]"
              >
                <FlaskConical size={17} />
                Book Another
              </button>
            </div>
          </div>
        </div>

        {/* NEXT STEPS */}
        <div className="mt-8 rounded-3xl border border-[#e5e1d7] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold">
            Before your visit
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div>
              <p className="font-semibold">
                01. Arrive on time
              </p>

              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Please arrive a little before your scheduled
                diagnostic appointment.
              </p>
            </div>

            <div>
              <p className="font-semibold">
                02. Bring your details
              </p>

              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Keep your AVSH patient information available
                during registration.
              </p>
            </div>

            <div>
              <p className="font-semibold">
                03. Await review
              </p>

              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Diagnostic results are subject to clinical
                review by appropriate healthcare professionals.
              </p>
            </div>
          </div>
        </div>

        {/* DEMO NOTICE */}
        <div className="mt-8 rounded-2xl border border-[#d4a84f]/40 bg-[#fffaf0] p-5">
          <p className="font-semibold">
            Demonstration system
          </p>

          <p className="mt-1 text-sm leading-6 text-[#667085]">
            This confirmation contains synthetic booking,
            payment, branch, and diagnostic information created
            for the AVSH university project. It does not
            represent a real medical appointment.
          </p>
        </div>

        <button
          onClick={() =>
            router.push("/patient/dashboard")
          }
          className="mx-auto mt-8 flex items-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#071a3d]"
        >
          <ArrowLeft size={16} />
          Return to patient portal
        </button>
      </section>
    </main>
  );
}