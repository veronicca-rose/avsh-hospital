"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  FileBarChart,
  Hospital,
  IndianRupee,
  Search,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";

type PaymentStatus = "Successful" | "Pending" | "Refunded";

type PaymentType =
  | "Doctor Consultation"
  | "Diagnostic Test"
  | "Health Package"
  | "Online Consultation";

type Payment = {
  id: string;
  transactionId: string;
  patient: string;
  type: PaymentType;
  branch: string;
  method: string;
  amount: number;
  date: string;
  status: PaymentStatus;
};

const payments: Payment[] = [
  {
    id: "PAY-001",
    transactionId: "AVSH-TXN-81001",
    patient: "Patient AV-104",
    type: "Doctor Consultation",
    branch: "AVSH Hyderabad",
    method: "UPI",
    amount: 500,
    date: "18 Sep 2026, 09:12 AM",
    status: "Successful",
  },
  {
    id: "PAY-002",
    transactionId: "AVSH-TXN-81002",
    patient: "Patient AV-118",
    type: "Diagnostic Test",
    branch: "AVSH Hyderabad",
    method: "Card",
    amount: 800,
    date: "18 Sep 2026, 09:35 AM",
    status: "Successful",
  },
  {
    id: "PAY-003",
    transactionId: "AVSH-TXN-81003",
    patient: "Patient AV-121",
    type: "Health Package",
    branch: "AVSH Tirupati",
    method: "UPI",
    amount: 2499,
    date: "18 Sep 2026, 10:04 AM",
    status: "Successful",
  },
  {
    id: "PAY-004",
    transactionId: "AVSH-TXN-81004",
    patient: "Patient AV-132",
    type: "Doctor Consultation",
    branch: "AVSH Vijayawada",
    method: "Net Banking",
    amount: 500,
    date: "18 Sep 2026, 10:18 AM",
    status: "Pending",
  },
  {
    id: "PAY-005",
    transactionId: "AVSH-TXN-81005",
    patient: "Patient AV-145",
    type: "Online Consultation",
    branch: "AVSH Hyderabad",
    method: "UPI",
    amount: 700,
    date: "18 Sep 2026, 10:42 AM",
    status: "Successful",
  },
  {
    id: "PAY-006",
    transactionId: "AVSH-TXN-81006",
    patient: "Patient AV-153",
    type: "Diagnostic Test",
    branch: "AVSH Tirupati",
    method: "Card",
    amount: 1400,
    date: "18 Sep 2026, 11:10 AM",
    status: "Successful",
  },
  {
    id: "PAY-007",
    transactionId: "AVSH-TXN-81007",
    patient: "Patient AV-161",
    type: "Health Package",
    branch: "AVSH Hyderabad",
    method: "UPI",
    amount: 3999,
    date: "18 Sep 2026, 11:28 AM",
    status: "Successful",
  },
  {
    id: "PAY-008",
    transactionId: "AVSH-TXN-81008",
    patient: "Patient AV-174",
    type: "Doctor Consultation",
    branch: "AVSH Hyderabad",
    method: "Card",
    amount: 500,
    date: "18 Sep 2026, 11:45 AM",
    status: "Refunded",
  },
  {
    id: "PAY-009",
    transactionId: "AVSH-TXN-81009",
    patient: "Patient AV-183",
    type: "Diagnostic Test",
    branch: "AVSH Vijayawada",
    method: "UPI",
    amount: 900,
    date: "18 Sep 2026, 12:06 PM",
    status: "Successful",
  },
  {
    id: "PAY-010",
    transactionId: "AVSH-TXN-81010",
    patient: "Patient AV-194",
    type: "Online Consultation",
    branch: "AVSH Hyderabad",
    method: "Wallet",
    amount: 700,
    date: "18 Sep 2026, 12:31 PM",
    status: "Successful",
  },
  {
    id: "PAY-011",
    transactionId: "AVSH-TXN-81011",
    patient: "Patient AV-205",
    type: "Health Package",
    branch: "AVSH Vijayawada",
    method: "UPI",
    amount: 5499,
    date: "18 Sep 2026, 01:02 PM",
    status: "Successful",
  },
  {
    id: "PAY-012",
    transactionId: "AVSH-TXN-81012",
    patient: "Patient AV-216",
    type: "Doctor Consultation",
    branch: "AVSH Tirupati",
    method: "Card",
    amount: 500,
    date: "18 Sep 2026, 01:24 PM",
    status: "Successful",
  },
];

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function statusClass(status: PaymentStatus) {
  if (status === "Successful") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Pending") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
}

export default function AdminPaymentsPage() {
  const router = useRouter();

  const [branch, setBranch] = useState("All Branches");
  const [type, setType] = useState("All Services");
  const [status, setStatus] = useState("All Status");
  const [method, setMethod] = useState("All Methods");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  useEffect(() => {
    if (localStorage.getItem("avshAdminLoggedIn") !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  const filteredPayments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const branchMatch =
        branch === "All Branches" || payment.branch === branch;

      const typeMatch =
        type === "All Services" || payment.type === type;

      const statusMatch =
        status === "All Status" || payment.status === status;

      const methodMatch =
        method === "All Methods" || payment.method === method;

      const searchMatch =
        !query ||
        payment.transactionId.toLowerCase().includes(query) ||
        payment.patient.toLowerCase().includes(query) ||
        payment.type.toLowerCase().includes(query);

      return (
        branchMatch &&
        typeMatch &&
        statusMatch &&
        methodMatch &&
        searchMatch
      );
    });
  }, [branch, type, status, method, search]);

  const metrics = useMemo(() => {
    const successful = filteredPayments.filter(
      (payment) => payment.status === "Successful"
    );

    const pending = filteredPayments.filter(
      (payment) => payment.status === "Pending"
    );

    const refunded = filteredPayments.filter(
      (payment) => payment.status === "Refunded"
    );

    return {
      revenue: successful.reduce(
        (sum, payment) => sum + payment.amount,
        0
      ),
      successful: successful.length,
      pendingAmount: pending.reduce(
        (sum, payment) => sum + payment.amount,
        0
      ),
      refundedAmount: refunded.reduce(
        (sum, payment) => sum + payment.amount,
        0
      ),
    };
  }, [filteredPayments]);

  const serviceStats = useMemo(() => {
    const services: PaymentType[] = [
      "Doctor Consultation",
      "Diagnostic Test",
      "Health Package",
      "Online Consultation",
    ];

    return services.map((service) => {
      const servicePayments = filteredPayments.filter(
        (payment) =>
          payment.type === service &&
          payment.status === "Successful"
      );

      return {
        service,
        revenue: servicePayments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ),
        count: servicePayments.length,
      };
    });
  }, [filteredPayments]);

  const branchStats = useMemo(() => {
    const branches = [
      "AVSH Hyderabad",
      "AVSH Tirupati",
      "AVSH Vijayawada",
    ];

    return branches.map((name) => {
      const branchPayments = payments.filter(
        (payment) =>
          payment.branch === name &&
          payment.status === "Successful"
      );

      return {
        name,
        revenue: branchPayments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ),
      };
    });
  }, []);

  function downloadPayment(payment: Payment) {
    const content = [
      "AVSH HOSPITAL",
      "Payment Receipt",
      "",
      `Transaction ID: ${payment.transactionId}`,
      `Patient: ${payment.patient}`,
      `Service: ${payment.type}`,
      `Branch: ${payment.branch}`,
      `Payment Method: ${payment.method}`,
      `Amount: ${formatCurrency(payment.amount)}`,
      `Date: ${payment.date}`,
      `Status: ${payment.status}`,
      "",
      "Synthetic project data — not a real financial record.",
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${payment.transactionId}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function exportRevenueSummary() {
    const content = [
      "AVSH HOSPITAL",
      "Revenue Summary",
      "",
      `Branch filter: ${branch}`,
      `Service filter: ${type}`,
      `Status filter: ${status}`,
      `Method filter: ${method}`,
      "",
      `Successful revenue: ${formatCurrency(metrics.revenue)}`,
      `Successful transactions: ${metrics.successful}`,
      `Pending amount: ${formatCurrency(metrics.pendingAmount)}`,
      `Refunded amount: ${formatCurrency(metrics.refundedAmount)}`,
      "",
      "Service breakdown:",
      ...serviceStats.map(
        (item) =>
          `${item.service}: ${formatCurrency(
            item.revenue
          )} (${item.count} transactions)`
      ),
      "",
      "Synthetic project data.",
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "avsh-revenue-summary.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  const maxBranchRevenue = Math.max(
    ...branchStats.map((item) => item.revenue),
    1
  );

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#e5e1d7] bg-[#f8f7f3]/95 backdrop-blur">
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a84f]">
              Finance & Revenue
            </p>

            <h1 className="text-xl font-bold sm:text-2xl">
              Payments Center
            </h1>

            <p className="mt-1 hidden text-sm text-[#667085] sm:block">
              Monitor transactions, revenue and payment activity across AVSH.
            </p>
          </div>

          <button
            onClick={exportRevenueSummary}
            className="flex items-center gap-2 rounded-xl bg-[#071a3d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102a56]"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export Summary</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8">
        {/* Top Metrics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#667085]">
                  Successful Revenue
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {formatCurrency(metrics.revenue)}
                </p>

                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <ArrowUpRight size={14} />
                  Demo period
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-3">
                <IndianRupee size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#667085]">
                  Successful Transactions
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {metrics.successful}
                </p>

                <p className="mt-2 text-xs text-[#667085]">
                  Completed payments
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-3">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#667085]">
                  Pending Amount
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {formatCurrency(metrics.pendingAmount)}
                </p>

                <p className="mt-2 text-xs text-amber-700">
                  Requires review
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-3">
                <Wallet size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#667085]">
                  Refunded Amount
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {formatCurrency(metrics.refundedAmount)}
                </p>

                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <ArrowDownRight size={14} />
                  Demo refunds
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-3">
                <CreditCard size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-[#e5e1d7] bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient or transaction..."
                className="h-11 w-full rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] pl-10 pr-4 text-sm outline-none transition focus:border-[#d4a84f]"
              />
            </div>

            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              <option>All Branches</option>
              <option>AVSH Hyderabad</option>
              <option>AVSH Tirupati</option>
              <option>AVSH Vijayawada</option>
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              <option>All Services</option>
              <option>Doctor Consultation</option>
              <option>Diagnostic Test</option>
              <option>Health Package</option>
              <option>Online Consultation</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              <option>All Status</option>
              <option>Successful</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>

            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="h-11 rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              <option>All Methods</option>
              <option>UPI</option>
              <option>Card</option>
              <option>Net Banking</option>
              <option>Wallet</option>
            </select>
          </div>
        </section>

        {/* Revenue Overview */}
        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                  Revenue mix
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Revenue by service
                </h2>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-3">
                <Activity size={20} />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {serviceStats.map((item) => {
                const percentage =
                  metrics.revenue > 0
                    ? Math.round(
                        (item.revenue / metrics.revenue) * 100
                      )
                    : 0;

                return (
                  <div key={item.service}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">
                        {item.service}
                      </span>

                      <span className="text-sm font-bold">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#eef0f3]">
                      <div
                        className="h-full rounded-full bg-[#071a3d] transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-[#98a2b3]">
                      {item.count} successful transactions ·{" "}
                      {percentage}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                Branch performance
              </p>

              <h2 className="mt-1 text-lg font-bold">
                Revenue distribution
              </h2>
            </div>

            <div className="mt-6 space-y-6">
              {branchStats.map((item) => {
                const percentage = Math.round(
                  (item.revenue / maxBranchRevenue) * 100
                );

                return (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {item.name}
                      </span>

                      <span className="text-sm font-bold">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[#eef0f3]">
                      <div
                        className="h-full rounded-full bg-[#d4a84f] transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 rounded-xl border border-[#d8c18b] bg-[#fffaf0] p-4">
              <div className="flex gap-3">
                <Zap
                  size={19}
                  className="mt-0.5 shrink-0 text-[#9a762d]"
                />

                <div>
                  <p className="text-sm font-semibold">
                    AI revenue insight
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#667085]">
                    AI can summarize revenue patterns,
                    payment-method distribution and branch-level
                    operational signals for administrator review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payments Table */}
        <section className="mt-6 rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                Transaction management
              </p>

              <h2 className="mt-1 text-lg font-bold">
                Payment transactions
              </h2>
            </div>

            <p className="text-sm text-[#667085]">
              {filteredPayments.length} transactions
            </p>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-[#e5e1d7] text-left text-xs uppercase tracking-wider text-[#667085]">
                  <th className="px-3 py-4">Transaction</th>
                  <th className="px-3 py-4">Patient</th>
                  <th className="px-3 py-4">Service</th>
                  <th className="px-3 py-4">Branch</th>
                  <th className="px-3 py-4">Method</th>
                  <th className="px-3 py-4">Amount</th>
                  <th className="px-3 py-4">Status</th>
                  <th className="px-3 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-[#f0eee9] last:border-0"
                  >
                    <td className="px-3 py-4">
                      <p className="font-semibold">
                        {payment.transactionId}
                      </p>

                      <p className="mt-1 text-xs text-[#667085]">
                        {payment.date}
                      </p>
                    </td>

                    <td className="px-3 py-4 text-sm font-medium">
                      {payment.patient}
                    </td>

                    <td className="px-3 py-4 text-sm">
                      {payment.type}
                    </td>

                    <td className="px-3 py-4 text-sm">
                      {payment.branch}
                    </td>

                    <td className="px-3 py-4 text-sm">
                      {payment.method}
                    </td>

                    <td className="px-3 py-4 text-sm font-bold">
                      {formatCurrency(payment.amount)}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <button
                        onClick={() =>
                          setSelectedPayment(payment)
                        }
                        className="rounded-lg p-2 transition hover:bg-[#f8f7f3]"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {filteredPayments.map((payment) => (
              <button
                key={payment.id}
                onClick={() => setSelectedPayment(payment)}
                className="rounded-2xl border border-[#e5e1d7] p-5 text-left transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      {payment.transactionId}
                    </p>

                    <p className="mt-1 text-sm text-[#667085]">
                      {payment.patient}
                    </p>
                  </div>

                  <ChevronRight size={19} />
                </div>

                <p className="mt-4 font-semibold">
                  {payment.type}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </span>

                  <span className="font-bold">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-[#667085]">
                  {payment.branch} · {payment.method}
                </p>
              </button>
            ))}
          </div>

          {filteredPayments.length === 0 && (
            <div className="py-14 text-center">
              <CreditCard
                size={34}
                className="mx-auto text-[#98a2b3]"
              />

              <p className="mt-3 font-semibold">
                No transactions found
              </p>

              <p className="mt-1 text-sm text-[#667085]">
                Try changing the filters.
              </p>
            </div>
          )}
        </section>

        <footer className="mt-8 border-t border-[#e5e1d7] pt-5 text-xs leading-5 text-[#98a2b3]">
          AVSH Hospital Optimization Platform · Synthetic payment
          and revenue data · No real financial transactions are
          processed by this demonstration.
        </footer>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#071a3d]/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a84f]">
                  Payment details
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedPayment.transactionId}
                </h2>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg p-2 text-[#667085] hover:bg-[#f8f7f3]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-[#f8f7f3] p-5 text-center">
              <p className="text-xs uppercase tracking-wider text-[#667085]">
                Amount
              </p>

              <p className="mt-2 text-4xl font-bold">
                {formatCurrency(selectedPayment.amount)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                  selectedPayment.status
                )}`}
              >
                {selectedPayment.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["Patient", selectedPayment.patient],
                ["Service", selectedPayment.type],
                ["Branch", selectedPayment.branch],
                ["Method", selectedPayment.method],
                ["Date", selectedPayment.date],
                ["Transaction", selectedPayment.transactionId],
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

            <div className="mt-5 flex gap-3">
              <button
                onClick={() =>
                  downloadPayment(selectedPayment)
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#102a56]"
              >
                <Download size={17} />
                Download Receipt
              </button>

              <button
                onClick={() => setSelectedPayment(null)}
                className="flex-1 rounded-xl border border-[#e5e1d7] px-4 py-3 text-sm font-semibold hover:bg-[#f8f7f3]"
              >
                Close
              </button>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#98a2b3]">
              Synthetic project data. This receipt is for
              demonstration purposes only and is not a real
              financial record.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}