"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Receipt,
} from "lucide-react";

type PaymentRecord = {
  paymentId: string;
  title: string;
  subtitle: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string;
};

export default function PaymentHistoryPage() {
  const router = useRouter();

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("avshPatientLoggedIn") === "true";

    if (!loggedIn) {
      router.push("/patient/login");
      return;
    }

    try {
      const stored = JSON.parse(
        localStorage.getItem("avshPayments") || "[]"
      );

      if (Array.isArray(stored)) {
        setPayments(stored);
      }
    } catch {
      setPayments([]);
    }

    setLoading(false);
  }, [router]);

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadReceipt = (payment: PaymentRecord) => {
    const receipt = `
AVSH HOSPITAL
PAYMENT RECEIPT
================================

Transaction ID:
${payment.paymentId}

Service:
${payment.title}

Details:
${payment.subtitle}

Amount Paid:
₹${payment.amount.toLocaleString("en-IN")}

Payment Method:
${payment.method}

Status:
${payment.status}

Date:
${formatDate(payment.paidAt)}

Time:
${formatTime(payment.paidAt)}

================================
AVSH Hospital
Patient Portal

This is a demonstration receipt.
No real payment was processed.
    `.trim();

    const blob = new Blob([receipt], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${payment.paymentId}-receipt.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    const confirmed = window.confirm(
      "Clear all demonstration payment history?"
    );

    if (!confirmed) return;

    localStorage.removeItem("avshPayments");
    localStorage.removeItem("avshLastPayment");

    setPayments([]);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e5e1d7] border-t-[#d4a84f]" />
          <p className="mt-4 text-sm text-[#667085]">
            Loading payment history...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-[#e5e1d7] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
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
              <p className="text-lg font-bold tracking-tight">
                AVSH
              </p>

              <p className="text-xs text-[#667085]">
                Patient Portal
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-2 text-sm text-[#667085] sm:flex">
            <CreditCard size={17} />
            Payment History
          </div>
        </div>
      </header>

      {/* PAGE */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <button
          onClick={() => router.push("/patient/payments")}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#667085] transition hover:text-[#071a3d]"
        >
          <ArrowLeft size={17} />
          Back to Payments
        </button>

        {/* TITLE */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#d4a84f]">
              AVSH Transactions
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Payment History
            </h1>

            <p className="mt-3 max-w-2xl text-[#667085]">
              View your completed AVSH service payments,
              transaction details, and demonstration receipts.
            </p>
          </div>

          {payments.length > 0 && (
            <button
              onClick={clearHistory}
              className="rounded-xl border border-[#e5e1d7] bg-white px-5 py-3 text-sm font-semibold text-[#667085] transition hover:border-red-200 hover:text-red-600"
            >
              Clear Demo History
            </button>
          )}
        </div>

        {/* SUMMARY */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5">
            <p className="text-sm text-[#667085]">
              Transactions
            </p>

            <p className="mt-2 text-3xl font-bold">
              {payments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5">
            <p className="text-sm text-[#667085]">
              Total Paid
            </p>

            <p className="mt-2 text-3xl font-bold">
              ₹
              {payments
                .reduce(
                  (total, payment) =>
                    total + Number(payment.amount || 0),
                  0
                )
                .toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5">
            <p className="text-sm text-[#667085]">
              Successful Payments
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                payments.filter(
                  (payment) => payment.status === "Paid"
                ).length
              }
            </p>
          </div>
        </div>

        {/* EMPTY */}
        {payments.length === 0 ? (
          <div className="rounded-3xl border border-[#e5e1d7] bg-white px-6 py-16 text-center shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f8f7f3]">
              <Receipt
                size={36}
                className="text-[#071a3d]"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No payments yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[#667085]">
              Your completed AVSH payments will appear here
              automatically after you book a paid service.
            </p>

            <button
              onClick={() => router.push("/patient/doctors")}
              className="mt-7 rounded-xl bg-[#071a3d] px-6 py-3 font-semibold text-white transition hover:bg-[#102a56]"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          /* PAYMENT LIST */
          <div className="space-y-5">
            {payments.map((payment) => (
              <article
                key={payment.paymentId}
                className="rounded-3xl border border-[#e5e1d7] bg-white shadow-[0_15px_45px_rgba(7,26,61,0.05)]"
              >
                <div className="p-6 sm:p-7">
                  {/* PAYMENT HEADER */}
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#071a3d]">
                        <CreditCard
                          size={21}
                          className="text-[#d4a84f]"
                        />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-lg font-bold">
                            {payment.title}
                          </h2>

                          <span className="inline-flex items-center gap-1 rounded-full bg-[#edf7ef] px-3 py-1 text-xs font-semibold text-[#246b3d]">
                            <CheckCircle2 size={13} />
                            {payment.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-[#667085]">
                          {payment.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-wide text-[#667085]">
                        Amount Paid
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        ₹
                        {Number(
                          payment.amount || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-7 grid gap-5 border-t border-[#e5e1d7] pt-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#667085]">
                        <FileText size={14} />
                        Transaction ID
                      </div>

                      <p className="mt-2 break-all text-sm font-semibold">
                        {payment.paymentId}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#667085]">
                        <CreditCard size={14} />
                        Method
                      </div>

                      <p className="mt-2 text-sm font-semibold">
                        {payment.method}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#667085]">
                        <CalendarDays size={14} />
                        Date
                      </div>

                      <p className="mt-2 text-sm font-semibold">
                        {formatDate(payment.paidAt)}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#667085]">
                        <Receipt size={14} />
                        Time
                      </div>

                      <p className="mt-2 text-sm font-semibold">
                        {formatTime(payment.paidAt)}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-6 flex flex-col gap-3 border-t border-[#e5e1d7] pt-6 sm:flex-row">
                    <button
                      onClick={() =>
                        downloadReceipt(payment)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102a56]"
                    >
                      <Download size={17} />
                      Download Receipt
                    </button>

                    {payment.title ===
                      "Doctor Consultation" && (
                      <button
                        onClick={() =>
                          router.push(
                            "/patient/confirmation"
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#071a3d] px-5 py-3 text-sm font-semibold text-[#071a3d] transition hover:bg-[#f8f7f3]"
                      >
                        View Appointment
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* DEMO NOTICE */}
        <div className="mt-8 rounded-2xl border border-[#d4a84f]/40 bg-[#fffaf0] p-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#071a3d]">
              <CreditCard
                size={17}
                className="text-[#d4a84f]"
              />
            </div>

            <div>
              <p className="font-semibold">
                Demonstration payment system
              </p>

              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Payment records are stored locally in your
                browser for this university project. No real
                money or banking information is processed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}