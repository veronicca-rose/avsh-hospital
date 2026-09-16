"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Search,
  ShieldCheck,
  Video,
  X,
} from "lucide-react";

type ConsultationType = "Video Consultation" | "Chat Consultation";

type Doctor = {
  id: string;
  name: string;
  department: string;
  specialty: string;
  qualification: string;
  experience: string;
  branch: string;
  image: string;
  slots: string[];
};

const doctors: Doctor[] = [
  {
    id: "CONS-001",
    name: "Dr. Arjun Sharma",
    department: "Cardiology",
    specialty: "Interventional Cardiology",
    qualification: "MBBS, MD, DM",
    experience: "14 years",
    branch: "AVSH Hyderabad",
    image: "/doctors/arjun-sharma.jpg",
    slots: ["09:00 AM", "10:20 AM", "11:40 AM", "03:00 PM"],
  },
  {
    id: "CONS-002",
    name: "Dr. Ananya Reddy",
    department: "Neurology",
    specialty: "Clinical Neurology",
    qualification: "MBBS, MD, DM",
    experience: "11 years",
    branch: "AVSH Hyderabad",
    image: "/doctors/ananya-reddy.jpg",
    slots: ["09:40 AM", "11:00 AM", "02:20 PM", "04:00 PM"],
  },
  {
    id: "CONS-003",
    name: "Dr. Meera Iyer",
    department: "Dermatology",
    specialty: "Clinical Dermatology",
    qualification: "MBBS, MD",
    experience: "10 years",
    branch: "AVSH Bengaluru",
    image: "/doctors/meera-iyer.jpg",
    slots: ["09:20 AM", "10:40 AM", "01:40 PM", "03:40 PM"],
  },
  {
    id: "CONS-004",
    name: "Dr. Siddharth Rao",
    department: "Neurology",
    specialty: "Stroke Medicine",
    qualification: "MBBS, MD, DM",
    experience: "15 years",
    branch: "AVSH Bengaluru",
    image: "/doctors/siddharth-rao.jpg",
    slots: ["10:00 AM", "11:20 AM", "02:40 PM", "04:20 PM"],
  },
  {
    id: "CONS-005",
    name: "Dr. Shreya Nair",
    department: "Ophthalmology",
    specialty: "Cataract Surgery",
    qualification: "MBBS, MS",
    experience: "11 years",
    branch: "AVSH Chennai",
    image: "/doctors/shreya-nair.jpg",
    slots: ["09:00 AM", "10:20 AM", "01:20 PM", "03:20 PM"],
  },
  {
    id: "CONS-006",
    name: "Dr. Rahul Verma",
    department: "General Medicine",
    specialty: "Internal Medicine",
    qualification: "MBBS, MD",
    experience: "13 years",
    branch: "AVSH Chennai",
    image: "/doctors/rahul-verma.jpg",
    slots: ["09:40 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
  },
];

const getConsultationDates = () => {
  const dates: string[] = [];
  const current = new Date();

  for (let i = 1; i <= 10; i++) {
    const date = new Date(current);
    date.setDate(current.getDate() + i);

    if (date.getDay() !== 0) {
      dates.push(date.toISOString().split("T")[0]);
    }
  }

  return dates;
};

const formatDate = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ConsultationPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [consultationType, setConsultationType] =
    useState<ConsultationType>("Video Consultation");

  const consultationDates = useMemo(
    () => getConsultationDates(),
    []
  );

  const [selectedDate, setSelectedDate] = useState(
    consultationDates[0] || ""
  );

  const [selectedSlot, setSelectedSlot] = useState("");

  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("avshPatientLoggedIn") === "true";

    if (!loggedIn) {
      router.push("/patient/login");
    }
  }, [router]);

  const departments = [
    "All Departments",
    ...Array.from(
      new Set(doctors.map((doctor) => doctor.department))
    ),
  ];

  const filteredDoctors = useMemo(() => {
    const query = search.toLowerCase().trim();

    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(query) ||
        doctor.department.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All Departments" ||
        doctor.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [search, department]);

  const openBooking = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setConsultationType("Video Consultation");
    setSelectedDate(consultationDates[0] || "");
    setSelectedSlot(doctor.slots[0] || "");
    setShowBooking(true);
  };

  const confirmBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      alert("Please select a date and consultation time.");
      return;
    }

    const consultation = {
      id: `AVSH-CONS-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctor: selectedDoctor.name,
      department: selectedDoctor.department,
      specialty: selectedDoctor.specialty,
      branch: selectedDoctor.branch,
      type: consultationType,
      date: selectedDate,
      time: selectedSlot,
      status: "Scheduled",
      amount: 700,
    };

    localStorage.setItem(
      "avshConsultation",
      JSON.stringify(consultation)
    );

    localStorage.setItem(
      "avshPendingPayment",
      JSON.stringify({
        title: consultationType,
        subtitle: `${selectedDoctor.name} • ${selectedDoctor.department}`,
        amount: 700,
        purpose: "consultation",
      })
    );

    setShowBooking(false);

    router.push("/patient/payments");
  };

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-[#e5e1d7] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            onClick={() =>
              router.push("/patient/dashboard")
            }
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
            <ArrowLeft size={17} />
            Dashboard
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#071a3d] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4a84f]">
            Virtual Care
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Online Consultation
          </h1>

          <p className="mt-4 max-w-2xl text-white/70">
            Connect with an AVSH doctor through a secure video or
            chat consultation from wherever you are.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* SEARCH + FILTER */}
        <div className="rounded-3xl border border-[#e5e1d7] bg-white p-5 shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
          <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search doctors, departments or specialties..."
                className="w-full rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#d4a84f] focus:ring-2 focus:ring-[#d4a84f]/20"
              />
            </div>

            <select
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
              className="rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] px-4 py-3 text-sm outline-none focus:border-[#d4a84f]"
            >
              {departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CONSULTATION TYPES */}
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <button
            onClick={() =>
              setConsultationType("Video Consultation")
            }
            className={`rounded-2xl border p-5 text-left transition ${
              consultationType === "Video Consultation"
                ? "border-[#d4a84f] bg-[#fffaf0]"
                : "border-[#e5e1d7] bg-white hover:border-[#d4a84f]/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071a3d] text-[#d4a84f]">
                <Video size={22} />
              </div>

              <div>
                <p className="font-bold">
                  Video Consultation
                </p>

                <p className="mt-1 text-sm text-[#667085]">
                  Face-to-face consultation with your doctor
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() =>
              setConsultationType("Chat Consultation")
            }
            className={`rounded-2xl border p-5 text-left transition ${
              consultationType === "Chat Consultation"
                ? "border-[#d4a84f] bg-[#fffaf0]"
                : "border-[#e5e1d7] bg-white hover:border-[#d4a84f]/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071a3d] text-[#d4a84f]">
                <MessageCircle size={22} />
              </div>

              <div>
                <p className="font-bold">
                  Chat Consultation
                </p>

                <p className="mt-1 text-sm text-[#667085]">
                  Communicate with your doctor through chat
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* DOCTORS */}
        <div className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4a84f]">
              Available Doctors
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Choose your doctor
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="overflow-hidden rounded-3xl border border-[#e5e1d7] bg-white shadow-[0_10px_30px_rgba(7,26,61,0.04)]"
              >
                <div className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />

                    <div className="min-w-0">
                      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        AVAILABLE
                      </span>

                      <h3 className="mt-2 text-lg font-bold">
                        {doctor.name}
                      </h3>

                      <p className="text-sm font-semibold text-[#d4a84f]">
                        {doctor.department}
                      </p>

                      <p className="mt-1 text-xs text-[#667085]">
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#e5e1d7] pt-5 text-xs">
                    <div>
                      <p className="text-[#667085]">
                        Experience
                      </p>
                      <p className="mt-1 font-semibold">
                        {doctor.experience}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#667085]">
                        Branch
                      </p>
                      <p className="mt-1 font-semibold">
                        {doctor.branch}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => openBooking(doctor)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-4 py-3 text-sm font-bold text-white hover:bg-[#102a56]"
                  >
                    <Video size={17} />
                    Book Consultation
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="rounded-3xl border border-[#e5e1d7] bg-white p-12 text-center">
              <Search
                size={36}
                className="mx-auto text-[#667085]"
              />

              <h3 className="mt-4 text-xl font-bold">
                No doctors found
              </h3>

              <p className="mt-2 text-sm text-[#667085]">
                Try another doctor, department or specialty.
              </p>
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="mt-10 flex gap-3 rounded-2xl border border-[#d4a84f]/40 bg-[#fffaf0] p-5">
          <ShieldCheck
            size={22}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Online consultation information
            </p>

            <p className="mt-1 text-sm leading-6 text-[#667085]">
              Online consultations are scheduled for approximately
              20 minutes. Consultation charges are ₹700.
            </p>
          </div>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {showBooking && selectedDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#071a3d]/70 px-4 py-8 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#e5e1d7] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a84f]">
                  Book Consultation
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedDoctor.name}
                </h2>
              </div>

              <button
                onClick={() => setShowBooking(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f3] text-[#667085] hover:bg-[#e5e1d7]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6">
              {/* DOCTOR */}
              <div className="flex gap-4 rounded-2xl border border-[#e5e1d7] bg-[#f8f7f3] p-4">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />

                <div>
                  <p className="font-bold">
                    {selectedDoctor.name}
                  </p>

                  <p className="mt-1 text-sm text-[#d4a84f]">
                    {selectedDoctor.department}
                  </p>

                  <p className="mt-1 text-xs text-[#667085]">
                    {selectedDoctor.specialty}
                  </p>

                  <p className="mt-1 text-xs text-[#667085]">
                    {selectedDoctor.qualification} •{" "}
                    {selectedDoctor.experience}
                  </p>
                </div>
              </div>

              {/* TYPE */}
              <div className="mt-6">
                <p className="mb-3 text-sm font-bold">
                  Consultation Type
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() =>
                      setConsultationType(
                        "Video Consultation"
                      )
                    }
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left ${
                      consultationType ===
                      "Video Consultation"
                        ? "border-[#d4a84f] bg-[#fffaf0]"
                        : "border-[#e5e1d7]"
                    }`}
                  >
                    <Video size={20} />
                    <span className="text-sm font-semibold">
                      Video Consultation
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      setConsultationType(
                        "Chat Consultation"
                      )
                    }
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left ${
                      consultationType ===
                      "Chat Consultation"
                        ? "border-[#d4a84f] bg-[#fffaf0]"
                        : "border-[#e5e1d7]"
                    }`}
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm font-semibold">
                      Chat Consultation
                    </span>
                  </button>
                </div>
              </div>

              {/* DATE */}
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays size={17} />
                  <p className="text-sm font-bold">
                    Select Date
                  </p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {consultationDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot("");
                      }}
                      className={`min-w-[120px] rounded-xl border px-4 py-3 text-left ${
                        selectedDate === date
                          ? "border-[#d4a84f] bg-[#fffaf0]"
                          : "border-[#e5e1d7] bg-white"
                      }`}
                    >
                      <p className="text-xs text-[#667085]">
                        {new Date(
                          `${date}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                          weekday: "short",
                        })}
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {new Date(
                          `${date}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* TIME */}
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 size={17} />
                  <p className="text-sm font-bold">
                    Select Time
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {selectedDoctor.slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                        selectedSlot === slot
                          ? "border-[#d4a84f] bg-[#fffaf0]"
                          : "border-[#e5e1d7] bg-white hover:border-[#d4a84f]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUMMARY */}
              <div className="mt-7 rounded-2xl bg-[#071a3d] p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Consultation
                  </span>

                  <span className="text-sm font-semibold">
                    ₹700
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Doctor
                  </span>

                  <span className="text-sm font-semibold">
                    {selectedDoctor.name}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Date
                  </span>

                  <span className="text-sm font-semibold">
                    {selectedDate
                      ? formatDate(selectedDate)
                      : "Select date"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Time
                  </span>

                  <span className="text-sm font-semibold">
                    {selectedSlot || "Select time"}
                  </span>
                </div>
              </div>

              {/* CONFIRM */}
              <button
                onClick={confirmBooking}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4a84f] px-5 py-4 text-sm font-bold text-[#071a3d] hover:bg-[#f1d58a]"
              >
                <CheckCircle2 size={18} />
                Continue to Payment
              </button>

              <p className="mt-3 text-center text-xs text-[#667085]">
                You will be taken to the secure AVSH payment page
                to complete the booking.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}