"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  Smartphone,
  Wallet,
} from "lucide-react";

type PaymentItem = {
  title: string;
  subtitle: string;
  amount: number;
  purpose: "appointment" | "diagnostic" | "other";
};

type PaymentRecord = {
  paymentId: string;
  title: string;
  subtitle: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string;
};

const methods = [
  {
    id: "UPI",
    label: "UPI",
    description: "Google Pay, PhonePe, Paytm and more",
    icon: Smartphone,
  },
  {
    id: "Credit / Debit Card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard and other cards",
    icon: CreditCard,
  },
  {
    id: "Net Banking",
    label: "Net Banking",
    description: "Pay securely through your bank",
    icon: Landmark,
  },
  {
    id: "Wallet",
    label: "Wallet",
    description: "Supported digital wallets",
    icon: Wallet,
  },
];

export default function PaymentsPage() {
  const router = useRouter();

  const [paymentItem, setPaymentItem] =
    useState<PaymentItem | null>(null);

  const [selectedMethod, setSelectedMethod] =
    useState("UPI");

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [lastPayment, setLastPayment] =
    useState<PaymentRecord | null>(null);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("avshPatientLoggedIn") === "true";

    if (!loggedIn) {
      router.push("/patient/login");
      return;
    }

    const pending = localStorage.getItem(
      "avshPendingPayment"
    );

    if (!pending) {
      setPaymentItem({
        title: "AVSH Hospital Service",
        subtitle: "No pending payment",
        amount: 0,
        purpose: "other",
      });
      return;
    }

    try {
      const parsed = JSON.parse(pending);

      let purpose: PaymentItem["purpose"] = "other";

      if (
        parsed.purpose === "appointment" ||
        parsed.purpose === "diagnostic"
      ) {
        purpose = parsed.purpose;
      }

      setPaymentItem({
        title: parsed.title || "AVSH Hospital Service",
        subtitle: parsed.subtitle || "AVSH Hospital Service",
        amount: Number(parsed.amount || 0),
        purpose,
      });
    } catch {
      setPaymentItem({
        title: "AVSH Hospital Service",
        subtitle: "Payment information unavailable",
        amount: 0,
        purpose: "other",
      });
    }
  }, [router]);

  const handlePayment = async () => {
    if (!paymentItem || paymentItem.amount <= 0) {
      return;
    }

    setProcessing(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1600)
    );

    const paymentId = `AVSH-PAY-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const payment: PaymentRecord = {
      paymentId,
      title: paymentItem.title,
      subtitle: paymentItem.subtitle,
      amount: paymentItem.amount,
      method: selectedMethod,
      status: "Paid",
      paidAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "avshLastPayment",
      JSON.stringify(payment)
    );

    let existingPayments: PaymentRecord[] = [];

    try {
      existingPayments = JSON.parse(
        localStorage.getItem("avshPayments") || "[]"
      );
    } catch {
      existingPayments = [];
    }

    localStorage.setItem(
      "avshPayments",
      JSON.stringify([payment, ...existingPayments])
    );

    localStorage.removeItem("avshPendingPayment");

    setLastPayment(payment);
    setProcessing(false);
    setSuccess(true);
  };

  const continueAfterPayment = () => {
    if (!paymentItem) {
      router.push("/patient/dashboard");
      return;
    }

    if (paymentItem.purpose === "diagnostic") {
      router.push("/patient/diagnostics/confirmation");
      return;
    }

    if (paymentItem.purpose === "appointment") {
      router.push("/patient/confirmation");
      return;
    }

    router.push("/patient/dashboard");
  };

  if (!paymentItem) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3]">
        <Loader2
          size={32}
          className="animate-spin text-[#071a3d]"
        />
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
              <span className="font-bold text-[#d4a84f]">
                A
              </span>
            </div>

            <div className="text-left">
              <p className="font-bold">AVSH</p>
              <p className="text-xs text-[#667085]">
                Secure Payments
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-2 text-sm text-[#667085] sm:flex">
            <Lock size={15} />
            Secure demonstration payment
          </div>
        </div>
      </header>

      {/* SUCCESS */}
      {success && lastPayment ? (
        <section className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-3xl border border-[#e5e1d7] bg-white p-8 text-center shadow-[0_20px_60px_rgba(7,26,61,0.08)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f1d58a]/30">
              <CheckCircle2
                size={44}
                className="text-[#071a3d]"
              />
            </div>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-[#d4a84f]">
              Payment successful
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Your payment is complete
            </h1>

            <p className="mt-3 text-[#667085]">
              Your AVSH booking has been updated successfully.
            </p>

            <div className="mt-8 rounded-2xl bg-[#f8f7f3] p-5 text-left">
              <div className="flex justify-between gap-4 border-b border-[#e5e1d7] pb-4">
                <span className="text-sm text-[#667085]">
                  Service
                </span>

                <span className="text-right text-sm font-semibold">
                  {lastPayment.title}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-[#e5e1d7] py-4">
                <span className="text-sm text-[#667085]">
                  Amount
                </span>

                <span className="font-bold">
                  ₹
                  {lastPayment.amount.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-[#e5e1d7] py-4">
                <span className="text-sm text-[#667085]">
                  Payment method
                </span>

                <span className="text-sm font-semibold">
                  {lastPayment.method}
                </span>
              </div>

              <div className="flex justify-between gap-4 pt-4">
                <span className="text-sm text-[#667085]">
                  Transaction ID
                </span>

                <span className="text-right text-sm font-semibold">
                  {lastPayment.paymentId}
                </span>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={continueAfterPayment}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-3.5 font-semibold text-white hover:bg-[#102a56]"
              >
                Continue
                <ChevronRight size={17} />
              </button>

              <button
                onClick={() =>
                  router.push("/patient/payments/history")
                }
                className="flex-1 rounded-xl border border-[#e5e1d7] bg-white px-5 py-3.5 font-semibold text-[#071a3d] hover:bg-[#f8f7f3]"
              >
                Payment History
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* PAYMENT */
        <section className="mx-auto max-w-5xl px-6 py-12">
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#071a3d]"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* LEFT */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4a84f]">
                AVSH Payments
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Complete your payment
              </h1>

              <p className="mt-3 text-[#667085]">
                Select a payment method to continue your
                demonstration booking.
              </p>

              <div className="mt-8 space-y-3">
                {methods.map((method) => {
                  const Icon = method.icon;

                  const active =
                    selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() =>
                        setSelectedMethod(method.id)
                      }
                      className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                        active
                          ? "border-[#d4a84f] bg-[#fffaf0]"
                          : "border-[#e5e1d7] bg-white hover:border-[#c9c2b2]"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          active
                            ? "bg-[#071a3d] text-[#d4a84f]"
                            : "bg-[#f8f7f3] text-[#071a3d]"
                        }`}
                      >
                        <Icon size={21} />
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold">
                          {method.label}
                        </p>

                        <p className="mt-1 text-sm text-[#667085]">
                          {method.description}
                        </p>
                      </div>

                      <div
                        className={`h-5 w-5 rounded-full border-2 ${
                          active
                            ? "border-[#071a3d] bg-[#071a3d]"
                            : "border-[#c9c2b2]"
                        }`}
                      >
                        {active && (
                          <div className="m-1 h-1.5 w-1.5 rounded-full bg-[#d4a84f]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUMMARY */}
            <aside className="h-fit rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_15px_45px_rgba(7,26,61,0.06)] lg:sticky lg:top-8">
              <p className="text-sm font-semibold text-[#667085]">
                Payment Summary
              </p>

              <div className="mt-5 border-b border-[#e5e1d7] pb-5">
                <p className="font-bold">
                  {paymentItem.title}
                </p>

                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  {paymentItem.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="text-sm text-[#667085]">
                  Total
                </span>

                <span className="text-3xl font-bold">
                  ₹
                  {paymentItem.amount.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={
                  processing || paymentItem.amount <= 0
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-4 font-semibold text-white transition hover:bg-[#102a56] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹
                    {paymentItem.amount.toLocaleString(
                      "en-IN"
                    )}
                    <ChevronRight size={18} />
                  </>
                )}
              </button>

              <div className="mt-5 flex gap-3 rounded-xl bg-[#f8f7f3] p-4">
                <ShieldIcon />

                <p className="text-xs leading-5 text-[#667085]">
                  This is a simulated payment environment for
                  the AVSH university project. No real money is
                  charged.
                </p>
              </div>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}

function ShieldIcon() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
      <Lock size={15} className="text-[#071a3d]" />
    </div>
  );
}