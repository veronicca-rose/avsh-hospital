"use client";

import { useEffect, useMemo, useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type DoctorStatus = "Available" | "On Leave" | "Busy";

type Doctor = {
  id: string;
  name: string;
  gender: "Male" | "Female";
  department: string;
  specialty: string;
  qualification: string;
  experience: number;
  branch: string;
  consultation: string;
  availability: string;
  status: DoctorStatus;
  email: string;
  phone: string;
  languages: string[];
  photo: string;
};

/* =========================================================
   CONFIG
========================================================= */

const DATA_VERSION = "avsh-admin-doctors-v24";

const STORAGE_KEY = "avshDoctors";
const VERSION_KEY = "avshDoctorsVersion";

const branches = [
  "AVSH Hyderabad",
  "AVSH Bengaluru",
  "AVSH Chennai",
  "AVSH Mumbai",
];

const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Gastroenterology",
  "Gynecology & Obstetrics",
  "Ophthalmology",
  "Urology",
  "General Medicine",
];

const specialties: Record<string, string[]> = {
  Cardiology: [
    "Interventional Cardiology",
    "Clinical Cardiology",
    "Heart Failure",
    "Preventive Cardiology",
  ],
  Neurology: [
    "Stroke Medicine",
    "Epilepsy",
    "Movement Disorders",
    "Neurocritical Care",
  ],
  Orthopedics: [
    "Joint Replacement",
    "Sports Medicine",
    "Spine Surgery",
    "Trauma & Fracture Care",
  ],
  Pediatrics: [
    "Neonatology",
    "Pediatric Neurology",
    "Pediatric Cardiology",
    "Child Development",
  ],
  Dermatology: [
    "Clinical Dermatology",
    "Cosmetic Dermatology",
    "Dermatologic Surgery",
    "Pediatric Dermatology",
  ],
  Gastroenterology: [
    "Interventional Gastroenterology",
    "Hepatology",
    "Digestive Diseases",
    "GI Endoscopy",
  ],
  "Gynecology & Obstetrics": [
    "High-Risk Pregnancy",
    "Reproductive Medicine",
    "Gynecologic Surgery",
    "Maternal-Fetal Medicine",
  ],
  Ophthalmology: [
    "Cataract Surgery",
    "Retina",
    "Cornea",
    "Glaucoma",
  ],
  Urology: [
    "Uro-Oncology",
    "Endourology",
    "Andrology",
    "Reconstructive Urology",
  ],
  "General Medicine": [
    "Internal Medicine",
    "Diabetology",
    "Preventive Medicine",
    "Geriatric Medicine",
  ],
};

/* =========================================================
   LOCAL DOCTOR PORTRAITS
   Images are stored in:
   public/doctors/
========================================================= */

const indianPortraits = [
  "/doctors/aditya-menon.jpg",
  "/doctors/aisha-khan.jpg",
  "/doctors/ananya-reddy.jpg",
  "/doctors/arjun-sharma.jpg",
  "/doctors/kabir-sharma.jpg",
  "/doctors/karan-malhotra.jpg",
  "/doctors/kavya-menon.jpg",
  "/doctors/manav-bhatia.jpg",
  "/doctors/meera-iyer.jpg",
  "/doctors/nandini-iyer.jpg",
  "/doctors/nikhil-khanna.jpg",
  "/doctors/priya-nair.jpg",
  "/doctors/rahul-verma.jpg",
  "/doctors/riya-kapoor.jpg",
  "/doctors/rohan-kapoor.jpg",
  "/doctors/shreya-nair.jpg",
  "/doctors/siddharth-rao.jpg",
  "/doctors/varun-deshmukh.jpg",
  "/doctors/vikram-mehta.jpg",
  "/doctors/yash-malhotra.jpg",
];

/* =========================================================
   INDIAN DOCTOR NAMES
========================================================= */

const maleFirstNames = [
  "Arjun",
  "Rohan",
  "Vikram",
  "Aditya",
  "Rahul",
  "Karan",
  "Aarav",
  "Nikhil",
  "Siddharth",
  "Varun",
  "Rajat",
  "Manish",
  "Anirudh",
  "Amit",
  "Pranav",
  "Harsh",
];

const femaleFirstNames = [
  "Ananya",
  "Meera",
  "Priya",
  "Ishita",
  "Kavya",
  "Nandini",
  "Aditi",
  "Riya",
  "Shreya",
  "Sneha",
  "Pooja",
  "Divya",
  "Tanvi",
  "Neha",
  "Sonia",
  "Mira",
];

const lastNames = [
  "Sharma",
  "Reddy",
  "Kapoor",
  "Mehta",
  "Nair",
  "Iyer",
  "Menon",
  "Rao",
  "Verma",
  "Malhotra",
  "Bhat",
  "Patel",
  "Chopra",
  "Desai",
  "Khanna",
  "Agarwal",
  "Joshi",
  "Gupta",
  "Kulkarni",
  "Saxena",
];

/* =========================================================
   HELPERS
========================================================= */

function getDoctorPhoto(index: number) {
  return indianPortraits[index % indianPortraits.length];
}

function getDoctorName(
  index: number,
  gender: "Male" | "Female"
) {
  const firstNames =
    gender === "Male" ? maleFirstNames : femaleFirstNames;

  const first =
    firstNames[index % firstNames.length];

  const last =
    lastNames[
      Math.floor(index / firstNames.length) %
        lastNames.length
    ];

  return `Dr. ${first} ${last}`;
}

function getQualification(department: string) {
  const map: Record<string, string> = {
    Cardiology: "MD, DM Cardiology",
    Neurology: "MBBS, MD, DM Neurology",
    Orthopedics: "MBBS, MS Orthopedics",
    Pediatrics: "MBBS, MD Pediatrics",
    Dermatology: "MBBS, MD Dermatology",
    Gastroenterology: "MBBS, MD, DM Gastroenterology",
    "Gynecology & Obstetrics":
      "MBBS, MD Obstetrics & Gynecology",
    Ophthalmology: "MBBS, MS Ophthalmology",
    Urology: "MBBS, MS, MCh Urology",
    "General Medicine": "MBBS, MD Internal Medicine",
  };

  return map[department] || "MBBS, MD";
}

function getExperience(index: number) {
  return 8 + (index % 19);
}

function getConsultation(index: number) {
  return index % 2 === 0 ? "₹900" : "₹1,200";
}

function getAvailability(index: number) {
  const schedules = [
    "09:00 AM – 01:00 PM",
    "10:00 AM – 02:00 PM",
    "02:00 PM – 06:00 PM",
    "04:00 PM – 08:00 PM",
    "09:00 AM – 05:00 PM",
  ];

  return schedules[index % schedules.length];
}

function getStatus(index: number): DoctorStatus {
  if (index % 17 === 0) return "On Leave";
  if (index % 9 === 0) return "Busy";
  return "Available";
}

function getLanguages(index: number) {
  const languageSets = [
    ["English", "Hindi", "Telugu"],
    ["English", "Hindi", "Tamil"],
    ["English", "Hindi", "Kannada"],
    ["English", "Hindi", "Marathi"],
    ["English", "Hindi"],
  ];

  return languageSets[index % languageSets.length];
}

/* =========================================================
   CREATE 320 DOCTORS
   80 DOCTORS PER BRANCH
========================================================= */

function generateDoctors(): Doctor[] {
  const doctors: Doctor[] = [];

  let globalIndex = 0;

  branches.forEach((branch, branchIndex) => {
    departments.forEach((department) => {
      const departmentSpecialties =
        specialties[department];

      for (let doctorIndex = 0; doctorIndex < 8; doctorIndex++) {
        const gender =
          globalIndex % 2 === 0 ? "Female" : "Male";

        const specialty =
          departmentSpecialties[
            doctorIndex % departmentSpecialties.length
          ];

        const id =
          `AVSH-${String(branchIndex + 1).padStart(
            2,
            "0"
          )}-${String(globalIndex + 1).padStart(
            3,
            "0"
          )}`;

        doctors.push({
          id,

          name: getDoctorName(
            globalIndex,
            gender
          ),

          gender,

          department,

          specialty,

          qualification:
            getQualification(department),

          experience:
            getExperience(globalIndex),

          branch,

          consultation:
            getConsultation(globalIndex),

          availability:
            getAvailability(globalIndex),

          status:
            getStatus(globalIndex),

          email:
            `${id.toLowerCase()}@avshhealthcare.in`,

          phone:
            `+91 ${9000000000 + globalIndex}`,

          languages:
            getLanguages(globalIndex),

          photo:
            getDoctorPhoto(globalIndex),
        });

        globalIndex++;
      }
    });
  });

  return doctors;
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatusBadge({
  status,
}: {
  status: DoctorStatus;
}) {
  const styles = {
    Available:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Busy:
      "bg-amber-50 text-amber-700 border-amber-200",
    "On Leave":
      "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Available"
            ? "bg-emerald-500"
            : status === "Busy"
            ? "bg-amber-500"
            : "bg-rose-500"
        }`}
      />

      {status}
    </span>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] =
    useState("All Branches");
  const [departmentFilter, setDepartmentFilter] =
    useState("All Departments");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [editingDoctor, setEditingDoctor] =
    useState<Doctor | null>(null);

  const [showAddDoctor, setShowAddDoctor] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const doctorsPerPage = 12;

  /* -------------------------------------------------------
     LOAD DATA
  ------------------------------------------------------- */

  useEffect(() => {
    const storedVersion =
      localStorage.getItem(VERSION_KEY);

    const storedDoctors =
      localStorage.getItem(STORAGE_KEY);

    if (
      storedVersion === DATA_VERSION &&
      storedDoctors
    ) {
      try {
        setDoctors(JSON.parse(storedDoctors));
        return;
      } catch {
        // regenerate below
      }
    }

    const generated =
      generateDoctors();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(generated)
    );

    localStorage.setItem(
      VERSION_KEY,
      DATA_VERSION
    );

    setDoctors(generated);
  }, []);

  /* -------------------------------------------------------
     FILTER
  ------------------------------------------------------- */

  const filteredDoctors = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        !query ||
        doctor.name
          .toLowerCase()
          .includes(query) ||
        doctor.department
          .toLowerCase()
          .includes(query) ||
        doctor.specialty
          .toLowerCase()
          .includes(query) ||
        doctor.branch
          .toLowerCase()
          .includes(query) ||
        doctor.id
          .toLowerCase()
          .includes(query);

      const matchesBranch =
        branchFilter === "All Branches" ||
        doctor.branch === branchFilter;

      const matchesDepartment =
        departmentFilter ===
          "All Departments" ||
        doctor.department ===
          departmentFilter;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        doctor.status === statusFilter;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    doctors,
    search,
    branchFilter,
    departmentFilter,
    statusFilter,
  ]);

  /* -------------------------------------------------------
     PAGINATION
  ------------------------------------------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredDoctors.length /
        doctorsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedDoctors =
    filteredDoctors.slice(
      (safeCurrentPage - 1) *
        doctorsPerPage,
      safeCurrentPage *
        doctorsPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    branchFilter,
    departmentFilter,
    statusFilter,
  ]);

  /* -------------------------------------------------------
     STATS
  ------------------------------------------------------- */

  const totalDoctors = doctors.length;

  const availableDoctors =
    doctors.filter(
      (doctor) =>
        doctor.status === "Available"
    ).length;

  const busyDoctors =
    doctors.filter(
      (doctor) =>
        doctor.status === "Busy"
    ).length;

  const onLeaveDoctors =
    doctors.filter(
      (doctor) =>
        doctor.status === "On Leave"
    ).length;

  /* -------------------------------------------------------
     SAVE EDIT
  ------------------------------------------------------- */

  function saveEditedDoctor() {
    if (!editingDoctor) return;

    const updated =
      doctors.map((doctor) =>
        doctor.id === editingDoctor.id
          ? editingDoctor
          : doctor
      );

    setDoctors(updated);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    setEditingDoctor(null);
  }

  /* -------------------------------------------------------
     ADD DOCTOR
  ------------------------------------------------------- */

  function addDoctor() {
    const index = doctors.length;

    const department =
      departments[
        index % departments.length
      ];

    const gender =
      index % 2 === 0
        ? "Female"
        : "Male";

    const branch =
      branches[
        index % branches.length
      ];

    const newDoctor: Doctor = {
      id: `AVSH-NEW-${Date.now()}`,

      name: getDoctorName(
        index + 100,
        gender
      ),

      gender,

      department,

      specialty:
        specialties[department][0],

      qualification:
        getQualification(department),

      experience:
        getExperience(index),

      branch,

      consultation:
        getConsultation(index),

      availability:
        getAvailability(index),

      status: "Available",

      email:
        `newdoctor${index}@avshhealthcare.in`,

      phone:
        `+91 ${9010000000 + index}`,

      languages:
        getLanguages(index),

      photo:
        getDoctorPhoto(index),
    };

    const updated = [
      ...doctors,
      newDoctor,
    ];

    setDoctors(updated);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    setShowAddDoctor(false);
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#071A3D]">

      {/* =====================================================
          ADMIN HEADER
      ===================================================== */}

      <header className="border-b border-[#E5E1D7] bg-[#071A3D] text-white">

        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-5">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A84F] text-sm font-bold text-[#D4A84F]">
              AV
            </div>

            <div>
              <div className="text-lg font-semibold tracking-wide">
                AVSH
              </div>

              <div className="text-xs tracking-[0.18em] text-white/60">
                ADMINISTRATION
              </div>
            </div>

          </div>

          <div className="hidden items-center gap-8 md:flex">

            <span className="text-sm text-white/60">
              Hospital Administration
            </span>

            <div className="h-8 w-px bg-white/15" />

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                A
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Admin
                </p>

                <p className="text-[11px] text-white/50">
                  AVSH Operations
                </p>
              </div>

            </div>

          </div>

        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-[1600px] px-8 py-8">

        {/* PAGE TITLE */}

        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D4A84F]">
              Staff Management
            </p>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Doctor Directory
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[#667085]">
              Manage physician profiles, departments,
              branch assignments, availability and
              administrative staff information.
            </p>

          </div>

          <button
            onClick={() =>
              setShowAddDoctor(true)
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#071A3D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0C285A]"
          >
            <span className="text-lg leading-none">
              +
            </span>

            Add Doctor
          </button>

        </div>

        {/* ===================================================
            STATS
        =================================================== */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-[#E5E1D7] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              Total Physicians
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {totalDoctors}
            </p>

            <p className="mt-1 text-xs text-[#667085]">
              Across all AVSH branches
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E1D7] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              Available
            </p>

            <p className="mt-2 text-3xl font-semibold text-emerald-700">
              {availableDoctors}
            </p>

            <p className="mt-1 text-xs text-[#667085]">
              Currently available
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E1D7] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              Busy
            </p>

            <p className="mt-2 text-3xl font-semibold text-amber-700">
              {busyDoctors}
            </p>

            <p className="mt-1 text-xs text-[#667085]">
              Currently occupied
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E1D7] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              On Leave
            </p>

            <p className="mt-2 text-3xl font-semibold text-rose-700">
              {onLeaveDoctors}
            </p>

            <p className="mt-1 text-xs text-[#667085]">
              Temporarily unavailable
            </p>
          </div>

        </div>

        {/* ===================================================
            FILTER BAR
        =================================================== */}

        <div className="mb-6 rounded-2xl border border-[#E5E1D7] bg-white p-5">

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">

            <div className="relative">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]">
                ⌕
              </span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search doctor, department, specialty or ID..."
                className="h-11 w-full rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] pl-11 pr-4 text-sm outline-none transition focus:border-[#D4A84F] focus:ring-2 focus:ring-[#D4A84F]/20"
              />

            </div>

            <select
              value={branchFilter}
              onChange={(event) =>
                setBranchFilter(
                  event.target.value
                )
              }
              className="h-11 rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] px-4 text-sm outline-none focus:border-[#D4A84F]"
            >
              <option>
                All Branches
              </option>

              {branches.map(
                (branch) => (
                  <option
                    key={branch}
                    value={branch}
                  >
                    {branch}
                  </option>
                )
              )}
            </select>

            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(
                  event.target.value
                )
              }
              className="h-11 rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] px-4 text-sm outline-none focus:border-[#D4A84F]"
            >
              <option>
                All Departments
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                )
              )}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="h-11 rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] px-4 text-sm outline-none focus:border-[#D4A84F]"
            >
              <option>
                All Statuses
              </option>

              <option>
                Available
              </option>

              <option>
                Busy
              </option>

              <option>
                On Leave
              </option>
            </select>

          </div>

        </div>

        {/* ===================================================
            RESULTS
        =================================================== */}

        <div className="mb-4 flex items-center justify-between">

          <div>
            <p className="text-sm font-semibold">
              Physician records
            </p>

            <p className="mt-0.5 text-xs text-[#667085]">
              Showing{" "}
              {paginatedDoctors.length}{" "}
              of{" "}
              {filteredDoctors.length}{" "}
              physicians
            </p>
          </div>

          <p className="hidden text-xs text-[#667085] md:block">
            Admin directory
          </p>

        </div>

        {/* ===================================================
            DOCTOR GRID
        =================================================== */}

        {paginatedDoctors.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E1D7] bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold">
              No physicians found
            </p>

            <p className="mt-2 text-sm text-[#667085]">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

            {paginatedDoctors.map(
              (doctor) => (

                <article
                  key={doctor.id}
                  className="group overflow-hidden rounded-2xl border border-[#E5E1D7] bg-white shadow-[0_4px_20px_rgba(7,26,61,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(7,26,61,0.08)]"
                >

                  {/* IMAGE */}

                  <div className="relative h-64 overflow-hidden bg-[#ECEAE3]">

                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025]"
                      loading="lazy"
                      onError={(event) => {
                        const img =
                          event.currentTarget;

                        if (
                          img.dataset.fallback
                        ) {
                          img.style.display =
                            "none";
                          return;
                        }

                        img.dataset.fallback =
                          "true";

                        img.src =
                          indianPortraits[0];
                      }}
                    />

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

                    <div className="absolute left-4 top-4">
                      <StatusBadge
                        status={doctor.status}
                      />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">

                      <p className="text-lg font-semibold text-white">
                        {doctor.name}
                      </p>

                      <p className="mt-0.5 text-xs text-white/80">
                        {doctor.id}
                      </p>

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="p-5">

                    <div className="mb-4">

                      <p className="text-sm font-semibold text-[#071A3D]">
                        {doctor.specialty}
                      </p>

                      <p className="mt-1 text-xs text-[#667085]">
                        {doctor.department}
                      </p>

                    </div>

                    <div className="space-y-2.5 text-xs">

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[#667085]">
                          Branch
                        </span>

                        <span className="text-right font-medium">
                          {doctor.branch.replace(
                            "AVSH ",
                            ""
                          )}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[#667085]">
                          Experience
                        </span>

                        <span className="font-medium">
                          {doctor.experience} years
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[#667085]">
                          Qualification
                        </span>

                        <span className="max-w-[170px] text-right font-medium">
                          {doctor.qualification}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[#667085]">
                          Availability
                        </span>

                        <span className="text-right font-medium">
                          {doctor.availability}
                        </span>
                      </div>

                    </div>

                    {/* ADMIN ACTIONS */}

                    <div className="mt-5 grid grid-cols-2 gap-2">

                      <button
                        onClick={() =>
                          setSelectedDoctor(
                            doctor
                          )
                        }
                        className="rounded-xl border border-[#E5E1D7] px-3 py-2.5 text-xs font-semibold text-[#071A3D] transition hover:border-[#D4A84F] hover:bg-[#F8F7F3]"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() =>
                          setEditingDoctor(
                            doctor
                          )
                        }
                        className="rounded-xl bg-[#071A3D] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0C285A]"
                      >
                        Edit Staff
                      </button>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}

        {/* ===================================================
            PAGINATION
        =================================================== */}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">

            <button
              disabled={
                safeCurrentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(1, page - 1)
                )
              }
              className="rounded-lg border border-[#E5E1D7] bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-3 text-sm text-[#667085]">
              Page{" "}
              <strong className="text-[#071A3D]">
                {safeCurrentPage}
              </strong>{" "}
              of {totalPages}
            </span>

            <button
              disabled={
                safeCurrentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              className="rounded-lg border border-[#E5E1D7] bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}

      </section>

      {/* =====================================================
          VIEW PROFILE MODAL
      ===================================================== */}

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071A3D]/60 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#E5E1D7] px-6 py-5">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4A84F]">
                  Physician Profile
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Staff Details
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedDoctor(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F7F3] text-lg text-[#667085]"
              >
                ×
              </button>

            </div>

            <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr]">

              <div className="overflow-hidden rounded-2xl bg-[#ECEAE3]">

                <img
                  src={selectedDoctor.photo}
                  alt={selectedDoctor.name}
                  className="h-[270px] w-full object-cover"
                />

              </div>

              <div>

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>

                    <h3 className="text-2xl font-semibold">
                      {selectedDoctor.name}
                    </h3>

                    <p className="mt-1 text-sm text-[#667085]">
                      {selectedDoctor.specialty}
                    </p>

                  </div>

                  <StatusBadge
                    status={
                      selectedDoctor.status
                    }
                  />

                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-[#667085]">
                      Staff ID
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedDoctor.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">
                      Department
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedDoctor.department}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">
                      Branch
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedDoctor.branch}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedDoctor.experience} years
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">
                      Qualification
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedDoctor.qualification}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">
                      Consultation
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedDoctor.consultation}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold">
                      {selectedDoctor.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#667085]">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedDoctor.phone}
                    </p>
                  </div>

                </div>

                <div className="mt-6 border-t border-[#E5E1D7] pt-5">

                  <p className="text-xs text-[#667085]">
                    Languages
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {selectedDoctor.languages.map(
                      (language) => (
                        <span
                          key={language}
                          className="rounded-full bg-[#F8F7F3] px-3 py-1.5 text-xs font-medium"
                        >
                          {language}
                        </span>
                      )
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071A3D]/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#E5E1D7] px-6 py-5">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4A84F]">
                  Staff Management
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Edit Physician
                </h2>

              </div>

              <button
                onClick={() =>
                  setEditingDoctor(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F7F3] text-lg text-[#667085]"
              >
                ×
              </button>

            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">

              <label className="block">

                <span className="mb-1.5 block text-xs font-semibold text-[#667085]">
                  Doctor Name
                </span>

                <input
                  value={editingDoctor.name}
                  onChange={(event) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      name: event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E5E1D7] px-3 text-sm outline-none focus:border-[#D4A84F]"
                />

              </label>

              <label className="block">

                <span className="mb-1.5 block text-xs font-semibold text-[#667085]">
                  Branch
                </span>

                <select
                  value={
                    editingDoctor.branch
                  }
                  onChange={(event) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      branch: event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E5E1D7] px-3 text-sm outline-none focus:border-[#D4A84F]"
                >
                  {branches.map(
                    (branch) => (
                      <option
                        key={branch}
                        value={branch}
                      >
                        {branch}
                      </option>
                    )
                  )}
                </select>

              </label>

              <label className="block">

                <span className="mb-1.5 block text-xs font-semibold text-[#667085]">
                  Department
                </span>

                <select
                  value={
                    editingDoctor.department
                  }
                  onChange={(event) => {
                    const department =
                      event.target.value;

                    setEditingDoctor({
                      ...editingDoctor,
                      department,
                      specialty:
                        specialties[
                          department
                        ][0],
                      qualification:
                        getQualification(
                          department
                        ),
                    });
                  }}
                  className="h-11 w-full rounded-xl border border-[#E5E1D7] px-3 text-sm outline-none focus:border-[#D4A84F]"
                >
                  {departments.map(
                    (department) => (
                      <option
                        key={department}
                        value={department}
                      >
                        {department}
                      </option>
                    )
                  )}
                </select>

              </label>

              <label className="block">

                <span className="mb-1.5 block text-xs font-semibold text-[#667085]">
                  Specialty
                </span>

                <select
                  value={
                    editingDoctor.specialty
                  }
                  onChange={(event) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      specialty:
                        event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E5E1D7] px-3 text-sm outline-none focus:border-[#D4A84F]"
                >
                  {specialties[
                    editingDoctor.department
                  ].map(
                    (specialty) => (
                      <option
                        key={specialty}
                        value={specialty}
                      >
                        {specialty}
                      </option>
                    )
                  )}
                </select>

              </label>

              <label className="block">

                <span className="mb-1.5 block text-xs font-semibold text-[#667085]">
                  Availability
                </span>

                <input
                  value={
                    editingDoctor.availability
                  }
                  onChange={(event) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      availability:
                        event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E5E1D7] px-3 text-sm outline-none focus:border-[#D4A84F]"
                />

              </label>

              <label className="block">

                <span className="mb-1.5 block text-xs font-semibold text-[#667085]">
                  Status
                </span>

                <select
                  value={
                    editingDoctor.status
                  }
                  onChange={(event) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      status:
                        event.target
                          .value as DoctorStatus,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E5E1D7] px-3 text-sm outline-none focus:border-[#D4A84F]"
                >
                  <option>
                    Available
                  </option>

                  <option>
                    Busy
                  </option>

                  <option>
                    On Leave
                  </option>
                </select>

              </label>

              <label className="block md:col-span-2">

                <span className="mb-1.5 block text-xs font-semibold text-[#667085]">
                  Email
                </span>

                <input
                  value={
                    editingDoctor.email
                  }
                  onChange={(event) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      email:
                        event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-[#E5E1D7] px-3 text-sm outline-none focus:border-[#D4A84F]"
                />

              </label>

            </div>

            <div className="flex justify-end gap-3 border-t border-[#E5E1D7] px-6 py-5">

              <button
                onClick={() =>
                  setEditingDoctor(null)
                }
                className="rounded-xl border border-[#E5E1D7] px-5 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={saveEditedDoctor}
                className="rounded-xl bg-[#071A3D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0C285A]"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          ADD DOCTOR MODAL
      ===================================================== */}

      {showAddDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071A3D]/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#E5E1D7] px-6 py-5">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4A84F]">
                  Staff Management
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Add Doctor
                </h2>

              </div>

              <button
                onClick={() =>
                  setShowAddDoctor(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F7F3] text-lg text-[#667085]"
              >
                ×
              </button>

            </div>

            <div className="p-6">

              <div className="rounded-2xl border border-[#E5E1D7] bg-[#F8F7F3] p-4">

                <p className="text-sm font-semibold">
                  Create a new physician record
                </p>

                <p className="mt-1 text-xs leading-5 text-[#667085]">
                  A complete staff profile will be
                  created with branch, department,
                  specialty, availability and
                  professional contact information.
                </p>

              </div>

              <button
                onClick={addDoctor}
                className="mt-5 w-full rounded-xl bg-[#071A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0C285A]"
              >
                Create Doctor Record
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}