"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FlaskConical,
  HeartPulse,
  MapPin,
  Package,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";

type DiagnosticService = {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: number;
};

type HealthPackage = {
  id: string;
  name: string;
  description: string;
  tests: string[];
  originalPrice: number;
  price: number;
  savings: number;
  popular?: boolean;
};

const branches = [
  "AVSH Hyderabad",
  "AVSH Tirupati",
  "AVSH Vijayawada",
  "AVSH Bengaluru",
];

const tests: DiagnosticService[] = [
  {
    id: "cbc",
    name: "Complete Blood Count",
    category: "Blood Test",
    description:
      "Measures major blood cell types and provides a general health screening.",
    duration: "15–20 min",
    price: 450,
  },
  {
    id: "lipid",
    name: "Lipid Profile",
    category: "Blood Test",
    description:
      "Checks cholesterol and triglyceride levels for cardiovascular screening.",
    duration: "15–20 min",
    price: 650,
  },
  {
    id: "thyroid",
    name: "Thyroid Function Test",
    category: "Laboratory",
    description:
      "Evaluates thyroid-related markers through a blood sample.",
    duration: "20 min",
    price: 750,
  },
  {
    id: "hba1c",
    name: "HbA1c",
    category: "Blood Test",
    description:
      "Provides an average blood-glucose measurement over recent months.",
    duration: "15–20 min",
    price: 550,
  },
  {
    id: "vitamin-d",
    name: "Vitamin D",
    category: "Blood Test",
    description:
      "Measures vitamin D levels as part of nutritional screening.",
    duration: "20 min",
    price: 900,
  },
  {
    id: "ecg",
    name: "ECG",
    category: "Cardiology",
    description:
      "Records the electrical activity of the heart.",
    duration: "15 min",
    price: 500,
  },
  {
    id: "xray",
    name: "Chest X-Ray",
    category: "Radiology",
    description:
      "Digital chest imaging performed by trained radiology staff.",
    duration: "20–30 min",
    price: 800,
  },
  {
    id: "ultrasound",
    name: "Ultrasound Abdomen",
    category: "Radiology",
    description:
      "Non-invasive ultrasound imaging of abdominal structures.",
    duration: "30–40 min",
    price: 1400,
  },
];

const packages: HealthPackage[] = [
  {
    id: "essential",
    name: "AVSH Essential Health Check",
    description:
      "A practical preventive screening package for routine health monitoring.",
    tests: [
      "Complete Blood Count",
      "Lipid Profile",
      "HbA1c",
      "Thyroid Function Test",
    ],
    originalPrice: 3199,
    price: 2499,
    savings: 700,
  },
  {
    id: "executive",
    name: "AVSH Executive Health Check",
    description:
      "A broader screening package designed for a comprehensive wellness review.",
    tests: [
      "Complete Blood Count",
      "Lipid Profile",
      "HbA1c",
      "Thyroid Function Test",
      "Vitamin D",
      "ECG",
    ],
    originalPrice: 5199,
    price: 3999,
    savings: 1200,
    popular: true,
  },
  {
    id: "complete",
    name: "AVSH Complete Wellness",
    description:
      "Our most extensive demonstration health-screening package.",
    tests: [
      "Complete Blood Count",
      "Lipid Profile",
      "HbA1c",
      "Thyroid Function Test",
      "Vitamin D",
      "ECG",
      "Chest X-Ray",
      "Ultrasound Abdomen",
    ],
    originalPrice: 7299,
    price: 5499,
    savings: 1800,
  },
];

function getUpcomingDates() {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const day = date.getDay();

    if (day !== 0) {
      dates.push(date.toISOString().split("T")[0]);
    }
  }

  return dates;
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DiagnosticsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"tests" | "packages">(
    "tests"
  );

  const [search, setSearch] = useState("");

  const [selectedService, setSelectedService] = useState<
    DiagnosticService | HealthPackage | null
  >(null);

  const [serviceType, setServiceType] = useState<
    "test" | "package"
  >("test");

  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:30 AM");

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const dates = useMemo(() => getUpcomingDates(), []);

  const filteredTests = tests.filter((test) => {
    const query = search.toLowerCase();

    return (
      test.name.toLowerCase().includes(query) ||
      test.category.toLowerCase().includes(query) ||
      test.description.toLowerCase().includes(query)
    );
  });

  const filteredPackages = packages.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tests.some((test) =>
        test.toLowerCase().includes(query)
      )
    );
  });

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("avshPatientLoggedIn") === "true";

    if (!loggedIn) {
      router.push("/patient/login");
    }
  }, [router]);

  const openTestBooking = (test: DiagnosticService) => {
    setSelectedService(test);
    setServiceType("test");
    setSelectedBranch(branches[0]);
    setSelectedDate("");
    setSelectedTime("09:30 AM");
    setBookingSuccess(false);
  };

  const openPackageBooking = (healthPackage: HealthPackage) => {
    setSelectedService(healthPackage);
    setServiceType("package");
    setSelectedBranch(branches[0]);
    setSelectedDate("");
    setSelectedTime("09:30 AM");
    setBookingSuccess(false);
  };

  const closeModal = () => {
    if (bookingSuccess) return;

    setSelectedService(null);
    setBookingSuccess(false);
  };

  const getPrice = () => {
    if (!selectedService) return 0;

    return selectedService.price;
  };

  const handleContinueToPayment = () => {
    if (!selectedService || !selectedDate) {
      return;
    }

    const price = getPrice();

    const booking = {
      id: `AVSH-DIAG-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
      serviceType,
      serviceName: selectedService.name,
      branch: selectedBranch,
      date: selectedDate,
      time: selectedTime,
      amount: price,
      bookedAt: new Date().toISOString(),
      status: "Payment Pending",
    };

    localStorage.setItem(
      "avshDiagnosticBooking",
      JSON.stringify(booking)
    );

    localStorage.setItem(
      "avshPendingPayment",
      JSON.stringify({
        title:
          serviceType === "package"
            ? "Health Package"
            : "Diagnostic Test",
        subtitle: `${selectedService.name} • ${selectedBranch}`,
        amount: price,
      })
    );

    router.push("/patient/payments");
  };

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-[#e5e1d7] bg-white">
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

          <button
            onClick={() => router.push("/patient/dashboard")}
            className="hidden items-center gap-2 text-sm font-semibold text-[#667085] transition hover:text-[#071a3d] sm:flex"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#071a3d] text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-18">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d4a84f]">
              AVSH Diagnostics
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Diagnostics made simple
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Book laboratory tests, imaging services, ECGs, and
              preventive health packages at your preferred AVSH
              branch.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <FlaskConical
                size={24}
                className="text-[#d4a84f]"
              />
              <p className="mt-4 font-semibold">
                Laboratory Testing
              </p>
              <p className="mt-1 text-sm text-white/60">
                Routine and preventive screening
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <HeartPulse
                size={24}
                className="text-[#d4a84f]"
              />
              <p className="mt-4 font-semibold">
                Cardiac Diagnostics
              </p>
              <p className="mt-1 text-sm text-white/60">
                ECG and related screening services
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Package
                size={24}
                className="text-[#d4a84f]"
              />
              <p className="mt-4 font-semibold">
                Health Packages
              </p>
              <p className="mt-1 text-sm text-white/60">
                Curated preventive check-ups
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* SEARCH */}
        <div className="rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Find a diagnostic service
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                Search by test, category, or package.
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search tests or packages..."
                className="w-full rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-4 py-3 text-sm outline-none transition focus:border-[#d4a84f] focus:ring-2 focus:ring-[#d4a84f]/20"
              />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-8 flex gap-2 rounded-2xl border border-[#e5e1d7] bg-white p-2">
          <button
            onClick={() => setActiveTab("tests")}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === "tests"
                ? "bg-[#071a3d] text-white"
                : "text-[#667085] hover:bg-[#f8f7f3]"
            }`}
          >
            Diagnostic Tests
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === "packages"
                ? "bg-[#071a3d] text-white"
                : "text-[#667085] hover:bg-[#f8f7f3]"
            }`}
          >
            Health Packages
          </button>
        </div>

        {/* TESTS */}
        {activeTab === "tests" && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredTests.map((test) => (
              <article
                key={test.id}
                className="flex flex-col rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_12px_35px_rgba(7,26,61,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(7,26,61,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8f7f3]">
                    <FlaskConical
                      size={22}
                      className="text-[#071a3d]"
                    />
                  </div>

                  <span className="rounded-full bg-[#f8f7f3] px-3 py-1 text-xs font-semibold text-[#667085]">
                    {test.category}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {test.name}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-[#667085]">
                  {test.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm text-[#667085]">
                  <Clock3 size={15} />
                  {test.duration}
                </div>

                <div className="mt-6 flex items-end justify-between border-t border-[#e5e1d7] pt-5">
                  <div>
                    <p className="text-xs text-[#667085]">
                      Starting from
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      ₹{test.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() => openTestBooking(test)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#071a3d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#102a56]"
                  >
                    Book
                    <ChevronRight size={16} />
                  </button>
                </div>
              </article>
            ))}

            {filteredTests.length === 0 && (
              <div className="col-span-full rounded-3xl border border-[#e5e1d7] bg-white p-12 text-center">
                <FlaskConical
                  size={36}
                  className="mx-auto text-[#667085]"
                />

                <h3 className="mt-4 text-xl font-bold">
                  No tests found
                </h3>

                <p className="mt-2 text-sm text-[#667085]">
                  Try another search term.
                </p>
              </div>
            )}
          </div>
        )}

        {/* PACKAGES */}
        {activeTab === "packages" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {filteredPackages.map((item) => (
              <article
                key={item.id}
                className="relative flex flex-col rounded-3xl border border-[#e5e1d7] bg-white p-7 shadow-[0_12px_35px_rgba(7,26,61,0.05)]"
              >
                {item.popular && (
                  <div className="absolute right-6 top-6 rounded-full bg-[#d4a84f] px-3 py-1 text-xs font-bold text-[#071a3d]">
                    Most Popular
                  </div>
                )}

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071a3d]">
                  <Package
                    size={23}
                    className="text-[#d4a84f]"
                  />
                </div>

                <h3 className="mt-6 pr-20 text-xl font-bold">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  {item.description}
                </p>

                <div className="mt-6">
                  <p className="text-xs text-[#667085]">
                    Includes
                  </p>

                  <div className="mt-3 space-y-2">
                    {item.tests.map((testName) => (
                      <div
                        key={testName}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-[#d4a84f]"
                        />

                        <span>{testName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-7">
                  <div className="rounded-2xl bg-[#f8f7f3] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#667085]">
                        Regular price
                      </span>

                      <span className="text-sm text-[#667085] line-through">
                        ₹
                        {item.originalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-sm text-[#667085]">
                        Package price
                      </span>

                      <span className="text-2xl font-bold">
                        ₹
                        {item.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-[#667085]">
                      Save ₹
                      {item.savings.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() => openPackageBooking(item)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-3.5 font-semibold text-white transition hover:bg-[#102a56]"
                  >
                    Book Package
                    <ChevronRight size={17} />
                  </button>
                </div>
              </article>
            ))}

            {filteredPackages.length === 0 && (
              <div className="col-span-full rounded-3xl border border-[#e5e1d7] bg-white p-12 text-center">
                <Package
                  size={36}
                  className="mx-auto text-[#667085]"
                />

                <h3 className="mt-4 text-xl font-bold">
                  No packages found
                </h3>

                <p className="mt-2 text-sm text-[#667085]">
                  Try another search term.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TRUST */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5">
            <ShieldCheck
              size={22}
              className="text-[#071a3d]"
            />

            <p className="mt-3 font-semibold">
              Trusted diagnostics
            </p>

            <p className="mt-1 text-sm text-[#667085]">
              Results are reviewed through the AVSH clinical
              workflow.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5">
            <MapPin size={22} className="text-[#071a3d]" />

            <p className="mt-3 font-semibold">
              Multiple branches
            </p>

            <p className="mt-1 text-sm text-[#667085]">
              Choose a convenient AVSH location during booking.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5">
            <Stethoscope
              size={22}
              className="text-[#071a3d]"
            />

            <p className="mt-3 font-semibold">
              Clinical oversight
            </p>

            <p className="mt-1 text-sm text-[#667085]">
              AI does not replace doctors or diagnostic review.
            </p>
          </div>
        </div>

        {/* DEMO NOTICE */}
        <div className="mt-8 rounded-2xl border border-[#d4a84f]/40 bg-[#fffaf0] p-5">
          <p className="font-semibold">
            Demonstration data
          </p>

          <p className="mt-1 text-sm leading-6 text-[#667085]">
            Tests, prices, branches, dates, and availability shown
            here are synthetic examples created for the AVSH
            university project.
          </p>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071a3d]/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e5e1d7] bg-white px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d4a84f]">
                  Book Diagnostic Service
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedService.name}
                </h2>
              </div>

              {!bookingSuccess && (
                <button
                  onClick={closeModal}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f3] text-[#667085] transition hover:text-[#071a3d]"
                >
                  <X size={19} />
                </button>
              )}
            </div>

            {!bookingSuccess ? (
              <div className="space-y-7 p-6">
                {/* SERVICE SUMMARY */}
                <div className="rounded-2xl bg-[#f8f7f3] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-[#667085]">
                        {serviceType === "package"
                          ? "Health Package"
                          : "Diagnostic Test"}
                      </p>

                      <p className="mt-1 font-semibold">
                        {selectedService.name}
                      </p>
                    </div>

                    <p className="text-xl font-bold">
                      ₹{getPrice().toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* BRANCH */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Select branch
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {branches.map((branch) => (
                      <button
                        key={branch}
                        onClick={() =>
                          setSelectedBranch(branch)
                        }
                        className={`rounded-xl border p-4 text-left transition ${
                          selectedBranch === branch
                            ? "border-[#d4a84f] bg-[#fffaf0]"
                            : "border-[#e5e1d7] hover:border-[#c9c2b2]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin size={18} />

                          <span className="text-sm font-semibold">
                            {branch}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* DATE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Select date
                  </label>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {dates.slice(0, 9).map((date) => (
                      <button
                        key={date}
                        onClick={() =>
                          setSelectedDate(date)
                        }
                        className={`rounded-xl border p-3 text-left transition ${
                          selectedDate === date
                            ? "border-[#d4a84f] bg-[#fffaf0]"
                            : "border-[#e5e1d7] hover:border-[#c9c2b2]"
                        }`}
                      >
                        <CalendarDays
                          size={16}
                          className="mb-2"
                        />

                        <p className="text-sm font-semibold">
                          {formatDate(date)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* TIME */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Select time
                  </label>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      "09:30 AM",
                      "11:00 AM",
                      "02:30 PM",
                      "04:30 PM",
                    ].map((time) => (
                      <button
                        key={time}
                        onClick={() =>
                          setSelectedTime(time)
                        }
                        className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                          selectedTime === time
                            ? "border-[#d4a84f] bg-[#fffaf0]"
                            : "border-[#e5e1d7] hover:border-[#c9c2b2]"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PAYMENT */}
                <div className="rounded-2xl border border-[#e5e1d7] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#667085]">
                        Total payable
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        ₹{getPrice().toLocaleString("en-IN")}
                      </p>
                    </div>

                    <ShieldCheck
                      size={28}
                      className="text-[#d4a84f]"
                    />
                  </div>

                  <p className="mt-3 text-xs leading-5 text-[#667085]">
                    You will be taken to the AVSH demonstration
                    payment page to complete this booking.
                  </p>
                </div>

                <button
                  onClick={handleContinueToPayment}
                  disabled={!selectedDate}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-6 py-4 font-semibold text-white transition hover:bg-[#102a56] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to Payment
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f1d58a]/30">
                  <CheckCircle2
                    size={44}
                    className="text-[#071a3d]"
                  />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  Booking created
                </h2>

                <p className="mt-2 text-[#667085]">
                  Your diagnostic booking has been saved.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}