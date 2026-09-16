
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  Search,
  Stethoscope,
  X,
} from "lucide-react";

type Doctor = {
  id: number;
  name: string;
  branch: string;
  department: string;
  specialty: string;
  qualification: string;
  experience: number;
  image: string;
  available: boolean;
};

const doctors: Doctor[] = [
  // =========================
  // HYDERABAD
  // =========================
  {
    id: 1,
    name: "Dr. Arjun Sharma",
    branch: "AVSH Hyderabad",
    department: "Cardiology",
    specialty: "Interventional Cardiology",
    qualification: "MBBS, MD, DM",
    experience: 14,
    image:
      "/doctors/arjun-sharma.jpg",
    available: true,
  },
  {
    id: 2,
    name: "Dr. Ananya Reddy",
    branch: "AVSH Hyderabad",
    department: "Neurology",
    specialty: "Clinical Neurology",
    qualification: "MBBS, MD, DM",
    experience: 11,
    image:
      "/doctors/ananya-reddy.jpg",
    available: true,
  },
  {
    id: 3,
    name: "Dr. Vikram Mehta",
    branch: "AVSH Hyderabad",
    department: "Orthopedics",
    specialty: "Joint Replacement",
    qualification: "MBBS, MS",
    experience: 16,
    image:
      "/doctors/vikram-mehta.jpg",
    available: true,
  },
  {
    id: 4,
    name: "Dr. Priya Nair",
    branch: "AVSH Hyderabad",
    department: "Pediatrics",
    specialty: "General Pediatrics",
    qualification: "MBBS, MD",
    experience: 9,
    image:
      "/doctors/priya-nair.jpg",
    available: true,
  },
  {
    id: 5,
    name: "Dr. Rohan Kapoor",
    branch: "AVSH Hyderabad",
    department: "Gastroenterology",
    specialty: "Medical Gastroenterology",
    qualification: "MBBS, MD, DM",
    experience: 13,
    image:
      "/doctors/rohan-kapoor.jpg",
    available: true,
  },

  // =========================
  // BENGALURU
  // =========================
  {
    id: 6,
    name: "Dr. Karan Malhotra",
    branch: "AVSH Bengaluru",
    department: "Cardiology",
    specialty: "Clinical Cardiology",
    qualification: "MBBS, MD, DM",
    experience: 12,
    image:
      "/doctors/karan-malhotra.jpg",
    available: true,
  },
  {
    id: 7,
    name: "Dr. Meera Iyer",
    branch: "AVSH Bengaluru",
    department: "Dermatology",
    specialty: "Clinical Dermatology",
    qualification: "MBBS, MD",
    experience: 10,
    image:
      "/doctors/meera-iyer.jpg",
    available: true,
  },
  {
    id: 8,
    name: "Dr. Siddharth Rao",
    branch: "AVSH Bengaluru",
    department: "Neurology",
    specialty: "Stroke Medicine",
    qualification: "MBBS, MD, DM",
    experience: 15,
    image:
      "/doctors/siddharth-rao.jpg",
    available: true,
  },
  {
    id: 9,
    name: "Dr. Kavya Menon",
    branch: "AVSH Bengaluru",
    department: "Gynecology",
    specialty: "Women's Health",
    qualification: "MBBS, MD",
    experience: 8,
    image:
      "/doctors/kavya-menon.jpg",
    available: true,
  },
  {
    id: 10,
    name: "Dr. Nikhil Khanna",
    branch: "AVSH Bengaluru",
    department: "Orthopedics",
    specialty: "Sports Medicine",
    qualification: "MBBS, MS",
    experience: 12,
    image:
      "/doctors/nikhil-khanna.jpg",
    available: true,
  },

  // =========================
  // CHENNAI
  // =========================
  {
    id: 11,
    name: "Dr. Rahul Verma",
    branch: "AVSH Chennai",
    department: "General Medicine",
    specialty: "Internal Medicine",
    qualification: "MBBS, MD",
    experience: 13,
    image:
      "/doctors/rahul-verma.jpg",
    available: true,
  },
  {
    id: 12,
    name: "Dr. Shreya Nair",
    branch: "AVSH Chennai",
    department: "Ophthalmology",
    specialty: "Cataract Surgery",
    qualification: "MBBS, MS",
    experience: 11,
    image:
      "/doctors/shreya-nair.jpg",
    available: true,
  },
  {
    id: 13,
    name: "Dr. Aditya Menon",
    branch: "AVSH Chennai",
    department: "ENT",
    specialty: "Head & Neck Surgery",
    qualification: "MBBS, MS",
    experience: 14,
    image:
      "/doctors/aditya-menon.jpg",
    available: true,
  },
  {
    id: 14,
    name: "Dr. Aisha Khan",
    branch: "AVSH Chennai",
    department: "Pediatrics",
    specialty: "Neonatology",
    qualification: "MBBS, MD",
    experience: 9,
    image:
      "/doctors/aisha-khan.jpg",
    available: true,
  },
  {
    id: 15,
    name: "Dr. Varun Deshmukh",
    branch: "AVSH Chennai",
    department: "Gastroenterology",
    specialty: "Hepatology",
    qualification: "MBBS, MD, DM",
    experience: 17,
    image:
      "/doctors/varun-deshmukh.jpg",
    available: true,
  },

  // =========================
  // MUMBAI
  // =========================
  {
    id: 16,
    name: "Dr. Yash Malhotra",
    branch: "AVSH Mumbai",
    department: "Cardiology",
    specialty: "Preventive Cardiology",
    qualification: "MBBS, MD, DM",
    experience: 10,
    image:
      "/doctors/yash-malhotra.jpg",
    available: true,
  },
  {
    id: 17,
    name: "Dr. Riya Kapoor",
    branch: "AVSH Mumbai",
    department: "Dermatology",
    specialty: "Cosmetic Dermatology",
    qualification: "MBBS, MD",
    experience: 8,
    image:
      "/doctors/riya-kapoor.jpg",
    available: true,
  },
  {
    id: 18,
    name: "Dr. Manav Bhatia",
    branch: "AVSH Mumbai",
    department: "Orthopedics",
    specialty: "Spine Surgery",
    qualification: "MBBS, MS, DNB",
    experience: 18,
    image:
      "/doctors/manav-bhatia.jpg",
    available: true,
  },
  {
    id: 19,
    name: "Dr. Nandini Iyer",
    branch: "AVSH Mumbai",
    department: "Gynecology",
    specialty: "High-Risk Pregnancy",
    qualification: "MBBS, MD",
    experience: 12,
    image:
      "/doctors/nandini-iyer.jpg",
    available: true,
  },
  {
    id: 20,
    name: "Dr. Kabir Sharma",
    branch: "AVSH Mumbai",
    department: "Neurology",
    specialty: "Movement Disorders",
    qualification: "MBBS, MD, DM",
    experience: 15,
    image:
      "/doctors/kabir-sharma.jpg",
    available: true,
  },
];

const branches = [
  "All Branches",
  "AVSH Hyderabad",
  "AVSH Bengaluru",
  "AVSH Chennai",
  "AVSH Mumbai",
];

const departments = [
  "All Departments",
  ...Array.from(new Set(doctors.map((doctor) => doctor.department))),
];

// Safety check: every doctor must have a different URL.
const imagePaths = doctors.map((doctor) => doctor.image);

const duplicateImagePaths = [
  ...new Set(
    imagePaths.filter(
      (path, index) => imagePaths.indexOf(path) !== index
    )
  ),
];

const branchCounts = doctors.reduce<Record<string, number>>(
  (counts, doctor) => {
    counts[doctor.branch] =
      (counts[doctor.branch] || 0) + 1;

    return counts;
  },
  {}
);

const requiredBranches = [
  "AVSH Hyderabad",
  "AVSH Bengaluru",
  "AVSH Chennai",
  "AVSH Mumbai",
];

const invalidBranches = requiredBranches.filter(
  (branch) => branchCounts[branch] !== 5
);

const directoryIsValid =
  doctors.length === 20 &&
  new Set(imagePaths).size === 20 &&
  duplicateImagePaths.length === 0 &&
  invalidBranches.length === 0;

export default function PatientDoctorsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] =
    useState("All Branches");

  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");

  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        !query ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.department.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.branch.toLowerCase().includes(query);

      const matchesBranch =
        selectedBranch === "All Branches" ||
        doctor.branch === selectedBranch;

      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        doctor.department === selectedDepartment;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesDepartment
      );
    });
  }, [search, selectedBranch, selectedDepartment]);

  const bookDoctor = (doctor: Doctor) => {
    localStorage.setItem(
      "avshSelectedDoctor",
      JSON.stringify({
        ...doctor,
        department: doctor.department,
        specialty: doctor.specialty,
      })
    );

    router.push("/patient/appointments");
  };

  if (!directoryIsValid) {
    return (
      <main className="min-h-screen bg-[#F8F7F3] px-6 py-16 text-[#071A3D]">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8">
          <h1 className="text-2xl font-extrabold">
            Doctor directory configuration error
          </h1>

          <p className="mt-3 text-[#667085]">
            The directory must contain exactly 20 doctors,
            five per branch, with unique portrait URLs.
          </p>

          <div className="mt-6 space-y-2 text-sm">
            <p>
              Doctors: <strong>{doctors.length}</strong>
            </p>

            <p>
              Unique image URLs:{" "}
              <strong>{new Set(imagePaths).size}</strong>
            </p>

            <p>
              Duplicate URLs:{" "}
              <strong>{duplicateImagePaths.length}</strong>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#071A3D]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#E5E1D7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#071A3D] text-[#D4A84F]">
              <Stethoscope size={21} />
            </div>

            <div>
              <div className="text-xl font-extrabold tracking-[0.08em]">
                AVSH
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#667085]">
                Advanced Healthcare
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/patient/dashboard")
            }
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E1D7] bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-[#D4A84F]"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* INTRO */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#071A3D] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
            <Stethoscope
              size={14}
              className="text-[#D4A84F]"
            />
            AVSH Doctor Directory
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Find your doctor
              </h1>

              <p className="mt-2 max-w-2xl text-[#667085]">
                Browse specialists across AVSH Hyderabad,
                Bengaluru, Chennai and Mumbai and book directly
                with your chosen doctor.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#667085]">
              <CheckCircle2
                size={17}
                className="text-[#D4A84F]"
              />
              {doctors.length} specialists available
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-8 rounded-2xl border border-[#E5E1D7] bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr]">
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
                placeholder="Search doctor, specialty or department..."
                className="h-12 w-full rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] pl-11 pr-4 text-sm outline-none focus:border-[#D4A84F]"
              />
            </div>

            <div className="relative">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]"
              />

              <select
                value={selectedBranch}
                onChange={(event) =>
                  setSelectedBranch(event.target.value)
                }
                className="h-12 w-full appearance-none rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] pl-11 pr-10 text-sm font-medium outline-none focus:border-[#D4A84F]"
              >
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#667085]"
              />
            </div>

            <div className="relative">
              <Stethoscope
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]"
              />

              <select
                value={selectedDepartment}
                onChange={(event) =>
                  setSelectedDepartment(event.target.value)
                }
                className="h-12 w-full appearance-none rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] pl-11 pr-10 text-sm font-medium outline-none focus:border-[#D4A84F]"
              >
                {departments.map((department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#667085]"
              />
            </div>
          </div>
        </div>

        {/* COUNT */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#667085]">
            Showing{" "}
            <span className="text-[#071A3D]">
              {filteredDoctors.length}
            </span>{" "}
            {filteredDoctors.length === 1
              ? "doctor"
              : "doctors"}
          </p>

          {(search ||
            selectedBranch !== "All Branches" ||
            selectedDepartment !== "All Departments") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedBranch("All Branches");
                setSelectedDepartment("All Departments");
              }}
              className="text-sm font-semibold text-[#D4A84F]"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* DOCTORS */}
        {filteredDoctors.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="group overflow-hidden rounded-2xl border border-[#E5E1D7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-[250px] overflow-hidden bg-[#EDEBE5]">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />

                  <div className="absolute left-3 top-3 rounded-full bg-[#071A3D]/90 px-3 py-1.5 text-[10px] font-bold text-white">
                    {doctor.branch}
                  </div>

                  {doctor.available && (
                    <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[#16804A] shadow-md">
                      <span className="h-2 w-2 rounded-full bg-[#20A464]" />
                      Available
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-extrabold leading-tight">
                    {doctor.name}
                  </h2>

                  <p className="mt-1 text-sm font-bold text-[#D4A84F]">
                    {doctor.department}
                  </p>

                  <p className="mt-1 min-h-[42px] text-sm text-[#667085]">
                    {doctor.specialty}
                  </p>

                  <div className="my-4 h-px bg-[#E5E1D7]" />

                  <div className="space-y-2.5 text-xs text-[#667085]">
                    <div className="flex items-center gap-2">
                      <Stethoscope
                        size={15}
                        className="text-[#D4A84F]"
                      />
                      {doctor.qualification}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3
                        size={15}
                        className="text-[#D4A84F]"
                      />
                      {doctor.experience} years experience
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin
                        size={15}
                        className="text-[#D4A84F]"
                      />
                      {doctor.branch}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDoctor(doctor)
                      }
                      className="rounded-xl border border-[#E5E1D7] px-3 py-2.5 text-xs font-bold transition hover:border-[#D4A84F] hover:bg-[#F8F7F3]"
                    >
                      View Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => bookDoctor(doctor)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#D4A84F] px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#071A3D]"
                    >
                      <Calendar size={14} />
                      Book Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#E5E1D7] bg-white px-6 py-16 text-center">
            <Search
              size={25}
              className="mx-auto text-[#667085]"
            />

            <h2 className="mt-5 text-xl font-bold">
              No doctors found
            </h2>

            <p className="mt-2 text-sm text-[#667085]">
              Try changing your search, branch or department.
            </p>
          </div>
        )}
      </section>

      {/* PROFILE MODAL */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071A3D]/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedDoctor(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#071A3D] shadow-md"
              aria-label="Close doctor profile"
            >
              <X size={19} />
            </button>

            <div className="grid md:grid-cols-[240px_1fr]">
              <div className="h-[300px] bg-[#EDEBE5] md:h-full">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div className="p-7">
                {selectedDoctor.available && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#EAF8F0] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#16804A]">
                    <span className="h-2 w-2 rounded-full bg-[#20A464]" />
                    Available for appointments
                  </div>
                )}

                <h2 className="text-2xl font-extrabold">
                  {selectedDoctor.name}
                </h2>

                <p className="mt-1 font-bold text-[#D4A84F]">
                  {selectedDoctor.department}
                </p>

                <p className="mt-1 text-sm text-[#667085]">
                  {selectedDoctor.specialty}
                </p>

                <div className="my-6 h-px bg-[#E5E1D7]" />

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#667085]">
                      Qualifications
                    </p>
                    <p className="mt-1 font-semibold">
                      {selectedDoctor.qualification}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#667085]">
                      Experience
                    </p>
                    <p className="mt-1 font-semibold">
                      {selectedDoctor.experience} years
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#667085]">
                      AVSH Branch
                    </p>
                    <p className="mt-1 font-semibold">
                      {selectedDoctor.branch}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => bookDoctor(selectedDoctor)}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4A84F] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#071A3D]"
                >
                  <Calendar size={18} />
                  Book Appointment with{" "}
                  {selectedDoctor.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

