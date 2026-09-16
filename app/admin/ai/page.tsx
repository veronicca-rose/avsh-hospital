"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  BarChart3,
  BedDouble,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
  Zap,
} from "lucide-react";

type Insight = {
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  issue: string;
  recommendation: string;
  impact: string;
};

type AIResult = {
  success: boolean;
  summary?: string;
  insights?: Insight[];
  error?: string;
};

const hospitalData = {
  appointments: {
    totalToday: 128,
    completed: 76,
    waiting: 31,
    inConsultation: 14,
    cancelled: 7,
    averageWaitMinutes: 18,
    peakWindow: "09:00–11:30",
  },

  patients: {
    activeToday: 94,
    arrivals: 116,
    consultationsCompleted: 76,
    followUps: 28,
    emergencyVisits: 6,
  },

  beds: {
    total: 240,
    occupied: 187,
    available: 53,
    occupancyPercent: 78,
  },

  doctors: {
    total: 36,
    active: 31,
    available: 18,
    inConsultation: 9,
    onLeave: 5,
    highestLoadDepartment: "Cardiology",
  },

  diagnostics: {
    pendingTests: 24,
    laboratoryRequests: 15,
    imagingRequests: 6,
    cardiacTests: 3,
  },

  emergency: {
    activeCases: 6,
    critical: 2,
    waiting: 2,
    triage: 1,
    inTreatment: 3,
    ambulanceCases: 2,
  },

  finance: {
    successfulRevenue: 17798,
    pendingAmount: 500,
    refundedAmount: 500,
    strongestBranch: "AVSH Hyderabad",
  },
};

const signalCards = [
  {
    title: "Average Wait",
    value: "18 min",
    description: "Across today's appointments",
    icon: Clock,
  },
  {
    title: "Bed Occupancy",
    value: "78%",
    description: "187 of 240 beds occupied",
    icon: BedDouble,
  },
  {
    title: "Active Doctors",
    value: "31",
    description: "18 currently available",
    icon: Stethoscope,
  },
  {
    title: "Emergency Cases",
    value: "6",
    description: "2 critical cases active",
    icon: AlertCircle,
  },
];

const categories = [
  "All",
  "Appointments",
  "Capacity",
  "Staff",
  "Diagnostics",
  "Emergency",
  "Finance",
];

export default function AdminAIPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedInsight, setSelectedInsight] =
    useState<Insight | null>(null);
  const [error, setError] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("avshAdminLoggedIn");

    if (loggedIn !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  async function runAIAnalysis() {
    setLoading(true);
    setError("");

    try {
      console.log(
        "AVSH AI: sending hospital data to server..."
      );

      const response = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospitalData,
        }),
      });

      console.log(
        "AVSH AI: response status",
        response.status
      );

      const rawText = await response.text();

      console.log(
        "AVSH AI: raw response",
        rawText
      );

      if (!rawText.trim()) {
        throw new Error(
          "The AI server returned an empty response. Check the Next.js terminal."
        );
      }

      let data: AIResult;

      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          "The AI server returned an invalid JSON response."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            `AI server returned HTTP ${response.status}.`
        );
      }

      const newSummary = data.summary || "";

      const newInsights = Array.isArray(data.insights)
        ? data.insights
        : [];

      setSummary(newSummary);
      setInsights(newInsights);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (err) {
      console.error(
        "AVSH AI analysis failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to run AI analysis."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredInsights = useMemo(() => {
    if (selectedCategory === "All") {
      return insights;
    }

    return insights.filter(
      (item) => item.category === selectedCategory
    );
  }, [insights, selectedCategory]);

  function exportReport() {
    const report = [
      "AVSH HOSPITAL",
      "AI OPERATIONS OPTIMIZATION REPORT",
      "====================================",
      "",
      "AI EXECUTIVE SUMMARY",
      summary ||
        "No AI analysis has been generated yet.",
      "",
      "OPERATIONAL INSIGHTS",
      "---------------------",

      ...insights.flatMap((item, index) => [
        `${index + 1}. ${item.title}`,
        `Category: ${item.category}`,
        `Priority: ${item.priority}`,
        `Issue: ${item.issue}`,
        `Recommendation: ${item.recommendation}`,
        `Expected operational impact: ${item.impact}`,
        "",
      ]),

      "Responsible AI Notice:",
      "This report supports hospital operations only.",
      "It does not make clinical decisions or replace qualified medical professionals.",
      "",
      "Synthetic demonstration data only.",
    ].join("\n");

    const blob = new Blob([report], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      "avsh-ai-operations-report.txt";

    anchor.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#e5e1d7] pb-6 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
              <span>AVSH</span>
              <span>/</span>
              <span>Intelligence Layer</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              AI Optimization
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[#667085] sm:text-base">
              Use OpenAI to analyze hospital operations
              and surface actionable optimization
              opportunities.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportReport}
              disabled={insights.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e5e1d7] bg-white px-4 py-3 text-sm font-semibold text-[#071a3d] transition hover:border-[#d4a84f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <BarChart3 size={17} />
              Export Report
            </button>

            <button
              onClick={runAIAnalysis}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102a56] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <RefreshCw
                    size={17}
                    className="animate-spin"
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Run AI Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-[#071a3d] p-6 text-white shadow-sm sm:p-8 lg:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#d4a84f]/20" />

          <div className="absolute -bottom-24 right-20 h-52 w-52 rounded-full border border-white/10" />

          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a84f]/30 bg-[#d4a84f]/10 px-3 py-1.5 text-xs font-semibold text-[#f1d58a]">
                <Zap size={14} />
                AVSH Intelligence Layer
              </div>

              <h2 className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                Turn operational data into clear
                hospital decisions.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                OpenAI reviews the synthetic AVSH
                operational dataset and produces an
                executive summary plus prioritized
                operational insights for the
                administrator.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs text-white/45">
                    Data points
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    24+
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs text-white/45">
                    Departments
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    18
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs text-white/45">
                    Analysis
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    Live
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-[#d4a84f]/30 bg-[#d4a84f]/10">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#d4a84f]/30 bg-[#d4a84f]/10">
                  <BrainCircuit
                    size={52}
                    className="text-[#f1d58a]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Signals */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {signalCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f7f3] text-[#071a3d]">
                    <Icon size={19} />
                  </div>

                  <Activity
                    size={16}
                    className="text-[#d4a84f]"
                  />
                </div>

                <p className="text-sm font-medium text-[#667085]">
                  {card.title}
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {card.value}
                </p>

                <p className="mt-1 text-xs text-[#667085]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex gap-3">
              <AlertCircle
                size={21}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="font-semibold text-red-900">
                  AI analysis failed
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Summary */}
        <section
          ref={resultsRef}
          className="mt-8 scroll-mt-24 rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col gap-4 border-b border-[#e5e1d7] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071a3d] text-[#f1d58a]">
                <BrainCircuit size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  AI Executive Summary
                </h2>

                <p className="text-sm text-[#667085]">
                  Generated from current AVSH operational
                  data
                </p>
              </div>
            </div>

            {summary && (
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#f8f7f3] px-3 py-1.5 text-xs font-semibold text-[#071a3d]">
                <CheckCircle2 size={14} />
                Analysis complete
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-[150px] items-center justify-center">
              <div className="text-center">
                <RefreshCw
                  size={28}
                  className="mx-auto animate-spin text-[#d4a84f]"
                />

                <p className="mt-3 text-sm font-medium">
                  OpenAI is analyzing AVSH operations...
                </p>

                <p className="mt-1 text-xs text-[#667085]">
                  This may take a few seconds.
                </p>
              </div>
            </div>
          ) : summary ? (
            <p className="pt-6 text-[15px] leading-8 text-[#475467]">
              {summary}
            </p>
          ) : (
            <div className="py-10 text-center">
              <BrainCircuit
                size={36}
                className="mx-auto text-[#d4a84f]"
              />

              <p className="mt-4 font-semibold">
                No AI analysis generated yet
              </p>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#667085]">
                Click “Run AI Analysis” to send the
                synthetic AVSH operational dataset to
                OpenAI.
              </p>
            </div>
          )}
        </section>

        {/* Insights */}
        <section className="mt-8">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d4a84f]">
                Optimization findings
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Operational Insights
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                AI-generated recommendations based on
                the current synthetic dataset.
              </p>
            </div>
          </div>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? "bg-[#071a3d] text-white"
                    : "border border-[#e5e1d7] bg-white text-[#667085] hover:border-[#d4a84f] hover:text-[#071a3d]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredInsights.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d8d3c7] bg-white p-10 text-center">
              <Sparkles
                size={32}
                className="mx-auto text-[#d4a84f]"
              />

              <p className="mt-4 font-semibold">
                {insights.length === 0
                  ? "AI insights will appear here"
                  : "No insights in this category"}
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#667085]">
                {insights.length === 0
                  ? "Run an AI analysis to generate operational recommendations."
                  : "Try another category filter."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredInsights.map(
                (insight, index) => (
                  <button
                    key={`${insight.title}-${index}`}
                    onClick={() =>
                      setSelectedInsight(insight)
                    }
                    className="group rounded-2xl border border-[#e5e1d7] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d4a84f] hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#f8f7f3] px-3 py-1 text-[11px] font-bold text-[#071a3d]">
                          {insight.category}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                            insight.priority === "High"
                              ? "bg-red-50 text-red-700"
                              : insight.priority ===
                                "Medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-50 text-slate-600"
                          }`}
                        >
                          {insight.priority}
                        </span>
                      </div>

                      <ChevronRight
                        size={18}
                        className="text-[#667085] transition group-hover:translate-x-1 group-hover:text-[#071a3d]"
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      {insight.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#667085]">
                      {insight.recommendation}
                    </p>

                    <div className="mt-5 flex items-center gap-2 border-t border-[#e5e1d7] pt-4 text-xs font-semibold text-[#071a3d]">
                      <Zap
                        size={14}
                        className="text-[#d4a84f]"
                      />
                      View operational impact
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </section>

        {/* Data snapshot */}
        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f7f3]">
                <BarChart3 size={19} />
              </div>

              <div>
                <h3 className="font-bold">
                  Operational Data Snapshot
                </h3>

                <p className="text-xs text-[#667085]">
                  Data supplied to the AI layer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f8f7f3] p-4">
                <p className="text-xs text-[#667085]">
                  Appointments
                </p>

                <p className="mt-1 text-xl font-bold">
                  {hospitalData.appointments.totalToday}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-4">
                <p className="text-xs text-[#667085]">
                  Patients
                </p>

                <p className="mt-1 text-xl font-bold">
                  {hospitalData.patients.activeToday}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-4">
                <p className="text-xs text-[#667085]">
                  Beds occupied
                </p>

                <p className="mt-1 text-xl font-bold">
                  {hospitalData.beds.occupied}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-4">
                <p className="text-xs text-[#667085]">
                  Pending diagnostics
                </p>

                <p className="mt-1 text-xl font-bold">
                  {hospitalData.diagnostics.pendingTests}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-4">
                <p className="text-xs text-[#667085]">
                  Emergency cases
                </p>

                <p className="mt-1 text-xl font-bold">
                  {hospitalData.emergency.activeCases}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f7f3] p-4">
                <p className="text-xs text-[#667085]">
                  Today's revenue
                </p>

                <p className="mt-1 text-xl font-bold">
                  ₹
                  {hospitalData.finance.successfulRevenue.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-[#071a3d] p-6 text-white shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4a84f] text-[#071a3d]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h3 className="font-bold">
                  Responsible AI Boundaries
                </h3>

                <p className="text-xs text-white/50">
                  Safety-first hospital optimization
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-6 text-white/65">
              <div className="flex gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-[#d4a84f]"
                />

                <p>
                  AI analyzes operational patterns and
                  supports administrator decisions.
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-[#d4a84f]"
                />

                <p>
                  Recommendations do not replace clinical
                  judgment or hospital policy.
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-[#d4a84f]"
                />

                <p>
                  The current demonstration uses synthetic
                  hospital data only.
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-[#d4a84f]"
                />

                <p>
                  AI does not prescribe medicines, change
                  dosage, diagnose patients, or decide
                  treatment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Synthetic data notice */}
        <div className="mt-8 flex items-center gap-2 rounded-xl border border-[#e5e1d7] bg-white px-4 py-3 text-xs text-[#667085]">
          <Building2 size={15} />
          AVSH demonstration environment • Synthetic
          operational data only
        </div>
      </div>

      {/* Insight modal */}
      {selectedInsight && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#e5e1d7] p-6">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f8f7f3] px-3 py-1 text-xs font-bold">
                    {selectedInsight.category}
                  </span>

                  <span className="rounded-full bg-[#071a3d] px-3 py-1 text-xs font-bold text-white">
                    {selectedInsight.priority} priority
                  </span>
                </div>

                <h2 className="text-2xl font-bold">
                  {selectedInsight.title}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedInsight(null)
                }
                className="rounded-xl p-2 text-[#667085] hover:bg-[#f8f7f3]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Operational issue
                </p>

                <p className="mt-2 text-sm leading-7 text-[#475467]">
                  {selectedInsight.issue}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  AI recommendation
                </p>

                <p className="mt-2 text-sm leading-7 text-[#475467]">
                  {selectedInsight.recommendation}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f7f3] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Expected operational impact
                </p>

                <p className="mt-2 text-sm font-semibold leading-7 text-[#071a3d]">
                  {selectedInsight.impact}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedInsight(null)
                }
                className="w-full rounded-xl bg-[#071a3d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#102a56]"
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