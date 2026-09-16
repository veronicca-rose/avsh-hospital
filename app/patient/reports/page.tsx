"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  FlaskConical,
  Pill,
  Printer,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

type ReportStatus = "Completed" | "Processing";
type ReportType = "Imaging" | "Laboratory";

type Result = {
  name: string;
  value: string;
  unit: string;
  reference: string;
  flag: "Normal" | "High" | "Low";
};

type Report = {
  id: string;
  patient: string;
  patientId: string;
  name: string;
  category: string;
  department: string;
  date: string;
  doctor: string;
  specialist: string;
  branch: string;
  status: ReportStatus;
  type: ReportType;
  result: string;
  indication: string;
  technique: string;
  findings: string;
  impression: string;
  image?: string;
  results: Result[];
};

type Prescription = {
  id: string;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor: string;
  date: string;
};

/* =========================================================
   AVSH — ONLY 4 REPORTS
   2 SCANS + 2 LAB TESTS
========================================================= */

const reports: Report[] = [
  {
    id: "AVSH-XR-1001",
    patient: "Ananya Reddy",
    patientId: "AVSH-P1001",
    name: "Chest X-Ray",
    category: "Radiology",
    department: "Radiology",
    date: "14 Sep 2026",
    doctor: "Dr. Aditya Sharma",
    specialist: "Dr. Ananya Rao",
    branch: "Hyderabad",
    status: "Completed",
    type: "Imaging",
    result: "No acute cardiopulmonary abnormality.",
    indication: "Persistent cough and chest discomfort.",
    technique:
      "Single posteroanterior chest radiograph obtained in the upright position.",
    findings:
      "Cardiomediastinal silhouette is within normal limits. Both lungs are clear without focal air-space consolidation. No pleural effusion or pneumothorax is identified. Visualized osseous structures are unremarkable.",
    impression: "No acute cardiopulmonary abnormality.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Normal_posteroanterior_%28PA%29_chest_radiograph_%28X-ray%29.jpg",
    results: [
      {
        name: "Study",
        value: "Chest X-Ray",
        unit: "",
        reference: "Radiology review",
        flag: "Normal",
      },
      {
        name: "Image Quality",
        value: "Adequate",
        unit: "",
        reference: "Diagnostic quality",
        flag: "Normal",
      },
      {
        name: "Clinical Review",
        value: "Reviewed",
        unit: "",
        reference: "Doctor review",
        flag: "Normal",
      },
    ],
  },

  {
    id: "AVSH-MRI-1002",
    patient: "Rahul Verma",
    patientId: "AVSH-P1002",
    name: "MRI Brain",
    category: "Radiology",
    department: "Radiology",
    date: "13 Sep 2026",
    doctor: "Dr. Meera Rao",
    specialist: "Dr. Kavya Menon",
    branch: "Bengaluru",
    status: "Completed",
    type: "Imaging",
    result: "No significant intracranial abnormality.",
    indication: "Evaluation of recurrent headache.",
    technique:
      "Multiplanar MRI examination of the brain performed using standard T1 and T2 weighted sequences.",
    findings:
      "Cerebral hemispheres demonstrate preserved grey-white matter differentiation. No focal mass, midline shift or significant intracranial abnormality is identified. Ventricular system is within normal limits.",
    impression:
      "No significant intracranial abnormality identified.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/f7/MRI_Brain_T1_Axial_%2814%29.jpg",
    results: [
      {
        name: "Study",
        value: "MRI Brain",
        unit: "",
        reference: "Radiology review",
        flag: "Normal",
      },
      {
        name: "Image Quality",
        value: "Adequate",
        unit: "",
        reference: "Diagnostic quality",
        flag: "Normal",
      },
      {
        name: "Clinical Review",
        value: "Reviewed",
        unit: "",
        reference: "Radiologist review",
        flag: "Normal",
      },
    ],
  },

  {
    id: "AVSH-CBP-1006",
    patient: "Megha Joshi",
    patientId: "AVSH-P1006",
    name: "Complete Blood Picture",
    category: "Laboratory",
    department: "Laboratory",
    date: "10 Sep 2026",
    doctor: "Dr. Rohan Patel",
    specialist: "Dr. Priya Menon",
    branch: "Hyderabad",
    status: "Completed",
    type: "Laboratory",
    result: "Haematological parameters within reference range.",
    indication: "Routine health evaluation.",
    technique:
      "Venous blood sample analyzed using an automated hematology analyzer.",
    findings:
      "Hemoglobin, white blood cell count, red blood cell count and platelet count are within the laboratory reference intervals. Differential leukocyte count shows no significant abnormality.",
    impression:
      "Complete blood picture shows no significant hematological abnormality.",
    results: [
      {
        name: "Hemoglobin",
        value: "13.8",
        unit: "g/dL",
        reference: "12.0–16.0 g/dL",
        flag: "Normal",
      },
      {
        name: "RBC Count",
        value: "4.72",
        unit: "million/µL",
        reference: "4.0–5.5 million/µL",
        flag: "Normal",
      },
      {
        name: "WBC Count",
        value: "7,200",
        unit: "/µL",
        reference: "4,000–11,000 /µL",
        flag: "Normal",
      },
      {
        name: "Platelet Count",
        value: "2.68",
        unit: "lakh/µL",
        reference: "1.5–4.5 lakh/µL",
        flag: "Normal",
      },
      {
        name: "Hematocrit",
        value: "41.2",
        unit: "%",
        reference: "36–46%",
        flag: "Normal",
      },
      {
        name: "Neutrophils",
        value: "58",
        unit: "%",
        reference: "40–70%",
        flag: "Normal",
      },
      {
        name: "Lymphocytes",
        value: "34",
        unit: "%",
        reference: "20–40%",
        flag: "Normal",
      },
    ],
  },

  {
    id: "AVSH-HBA1C-1011",
    patient: "Nisha Varma",
    patientId: "AVSH-P1011",
    name: "HbA1c",
    category: "Laboratory",
    department: "Laboratory",
    date: "05 Sep 2026",
    doctor: "Dr. Meera Rao",
    specialist: "Dr. Priya Menon",
    branch: "Bengaluru",
    status: "Completed",
    type: "Laboratory",
    result: "HbA1c: 5.6%.",
    indication: "Diabetes screening and metabolic assessment.",
    technique:
      "Whole blood sample analyzed using an automated HbA1c assay.",
    findings:
      "HbA1c is 5.6%. Estimated average glucose is calculated from the reported HbA1c value.",
    impression:
      "HbA1c result is within the non-diabetic reference range.",
    results: [
      {
        name: "HbA1c",
        value: "5.6",
        unit: "%",
        reference: "<5.7%",
        flag: "Normal",
      },
      {
        name: "Estimated Average Glucose",
        value: "114",
        unit: "mg/dL",
        reference: "Reference dependent",
        flag: "Normal",
      },
    ],
  },
];

/* =========================================================
   PRESCRIPTIONS
========================================================= */

const prescriptions: Prescription[] = [
  {
    id: "RX-2001",
    medicine: "Medicine A",
    dosage: "500 mg",
    frequency: "Twice daily",
    duration: "5 days",
    doctor: "Dr. Sanjay Kumar",
    date: "08 Sep 2026",
  },
  {
    id: "RX-2002",
    medicine: "Medicine B",
    dosage: "10 mg",
    frequency: "Once daily",
    duration: "14 days",
    doctor: "Dr. Aditya Sharma",
    date: "02 Sep 2026",
  },
  {
    id: "RX-2003",
    medicine: "Medicine C",
    dosage: "20 mg",
    frequency: "Once daily",
    duration: "7 days",
    doctor: "Dr. Ramesh Iyer",
    date: "20 Aug 2026",
  },
];

const statusClasses = (status: ReportStatus) => {
  if (status === "Completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

const flagClasses = (flag: Result["flag"]) => {
  if (flag === "High") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (flag === "Low") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
};

export default function ReportsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "reports" | "prescriptions"
  >("reports");

  const [search, setSearch] = useState("");

  const [selectedReport, setSelectedReport] =
    useState<Report | null>(null);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("avshPatientLoggedIn") === "true";

    if (!loggedIn) {
      router.push("/patient/login");
    }
  }, [router]);

  const filteredReports = useMemo(() => {
    const query = search.toLowerCase().trim();

    return reports.filter((report) => {
      return (
        report.name.toLowerCase().includes(query) ||
        report.category.toLowerCase().includes(query) ||
        report.doctor.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query) ||
        report.branch.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const filteredPrescriptions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return prescriptions.filter((prescription) => {
      return (
        prescription.medicine.toLowerCase().includes(query) ||
        prescription.doctor.toLowerCase().includes(query) ||
        prescription.id.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const downloadReport = (report: Report) => {
    const valuesText =
      report.results.length > 0
        ? report.results
            .map(
              (result) =>
                `${result.name}: ${result.value} ${result.unit}\nReference: ${result.reference}\nStatus: ${result.flag}`
            )
            .join("\n\n")
        : "No result values available.";

    const text = `
AVSH ADVANCED HEALTHCARE
DIAGNOSTIC REPORT
==================================================

REPORT ID: ${report.id}

PATIENT
Patient: ${report.patient}
Patient ID: ${report.patientId}
Branch: ${report.branch}

STUDY / TEST
${report.name}

Department: ${report.department}
Category: ${report.category}
Type: ${report.type}
Date: ${report.date}
Status: ${report.status}

REFERRING DOCTOR
${report.doctor}

REPORTING SPECIALIST
${report.specialist}

--------------------------------------------------
CLINICAL INDICATION
--------------------------------------------------
${report.indication}

--------------------------------------------------
TECHNIQUE
--------------------------------------------------
${report.technique}

--------------------------------------------------
RESULT VALUES
--------------------------------------------------
${valuesText}

--------------------------------------------------
FINDINGS
--------------------------------------------------
${report.findings}

--------------------------------------------------
IMPRESSION
--------------------------------------------------
${report.impression}

==================================================
AVSH ADVANCED HEALTHCARE
Patient Clinical Records
Educational / synthetic data for university project.
Doctor remains the source of truth for clinical interpretation.
`;

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${report.id}-${report.name
      .replace(/\s+/g, "-")
      .toLowerCase()}.txt`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const downloadPrescription = (
    prescription: Prescription
  ) => {
    const text = `
AVSH ADVANCED HEALTHCARE
PRESCRIPTION
==================================================

Prescription ID: ${prescription.id}

Medicine: ${prescription.medicine}
Dosage: ${prescription.dosage}
Frequency: ${prescription.frequency}
Duration: ${prescription.duration}

Doctor: ${prescription.doctor}
Date: ${prescription.date}

==================================================
AVSH ADVANCED HEALTHCARE
Patient Clinical Records
Educational / synthetic data for university project.
`;

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${prescription.id}-prescription.txt`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
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
            Patient Records
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Reports & Prescriptions
          </h1>

          <p className="mt-4 max-w-2xl text-white/70">
            Access your diagnostic reports, imaging studies,
            laboratory results and prescriptions through your AVSH
            patient portal.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* SEARCH */}
        <div className="rounded-3xl border border-[#e5e1d7] bg-white p-5 shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
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
              placeholder="Search reports, tests, doctors or medicines..."
              className="w-full rounded-xl border border-[#e5e1d7] bg-[#f8f7f3] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#d4a84f] focus:ring-2 focus:ring-[#d4a84f]/20"
            />
          </div>
        </div>

        {/* TABS */}
        <div className="mt-7 flex rounded-2xl border border-[#e5e1d7] bg-white p-2">
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold ${
              activeTab === "reports"
                ? "bg-[#071a3d] text-white"
                : "text-[#667085] hover:bg-[#f8f7f3]"
            }`}
          >
            Test Reports
          </button>

          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold ${
              activeTab === "prescriptions"
                ? "bg-[#071a3d] text-white"
                : "text-[#667085] hover:bg-[#f8f7f3]"
            }`}
          >
            Prescriptions
          </button>
        </div>

        {/* REPORTS */}
        {activeTab === "reports" && (
          <div className="mt-8 space-y-4">
            {filteredReports.map((report) => (
              <article
                key={report.id}
                className="rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_10px_30px_rgba(7,26,61,0.04)]"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                        report.type === "Imaging"
                          ? "bg-[#071a3d] text-[#d4a84f]"
                          : "bg-[#f8f7f3] text-[#071a3d]"
                      }`}
                    >
                      {report.type === "Imaging" ? (
                        <Eye size={25} />
                      ) : (
                        <FileText size={25} />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold">
                          {report.name}
                        </h2>

                        <span className="rounded-full bg-[#f8f7f3] px-3 py-1 text-xs font-semibold text-[#667085]">
                          {report.category}
                        </span>

                        <span className="rounded-full border border-[#d4a84f]/40 bg-[#fffaf0] px-3 py-1 text-xs font-semibold text-[#8b6a24]">
                          {report.type}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#667085]">
                        {report.date} • {report.doctor}
                      </p>

                      <p className="mt-1 text-xs text-[#667085]">
                        {report.branch} • {report.id}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
                        <CheckCircle2
                          size={16}
                          className={
                            report.status === "Completed"
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }
                        />

                        {report.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setSelectedReport(report)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5e1d7] px-4 py-3 text-sm font-semibold hover:bg-[#f8f7f3] sm:flex-none"
                    >
                      <Eye size={17} />
                      View Report
                    </button>

                    <button
                      onClick={() =>
                        downloadReport(report)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#102a56] sm:flex-none"
                    >
                      <Download size={17} />
                      Download
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredReports.length === 0 && (
              <div className="rounded-3xl border border-[#e5e1d7] bg-white p-12 text-center">
                <FileText
                  size={38}
                  className="mx-auto text-[#667085]"
                />

                <h2 className="mt-4 text-xl font-bold">
                  No reports found
                </h2>

                <p className="mt-2 text-sm text-[#667085]">
                  Try searching for another report or doctor.
                </p>
              </div>
            )}
          </div>
        )}

        {/* PRESCRIPTIONS */}
        {activeTab === "prescriptions" && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrescriptions.map((prescription) => (
              <article
                key={prescription.id}
                className="flex flex-col rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_10px_30px_rgba(7,26,61,0.04)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8f7f3]">
                    <Pill size={23} />
                  </div>

                  <span className="text-xs font-semibold text-[#667085]">
                    {prescription.date}
                  </span>
                </div>

                <h2 className="mt-6 text-lg font-bold">
                  {prescription.medicine}
                </h2>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <span className="text-[#667085]">
                      Dosage:{" "}
                    </span>

                    <span className="font-semibold">
                      {prescription.dosage}
                    </span>
                  </p>

                  <p>
                    <span className="text-[#667085]">
                      Frequency:{" "}
                    </span>

                    <span className="font-semibold">
                      {prescription.frequency}
                    </span>
                  </p>

                  <p>
                    <span className="text-[#667085]">
                      Duration:{" "}
                    </span>

                    <span className="font-semibold">
                      {prescription.duration}
                    </span>
                  </p>
                </div>

                <div className="mt-6 border-t border-[#e5e1d7] pt-5">
                  <p className="text-xs text-[#667085]">
                    Prescribed by
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {prescription.doctor}
                  </p>
                </div>

                <button
                  onClick={() =>
                    downloadPrescription(prescription)
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#102a56]"
                >
                  <Download size={16} />
                  Download Prescription
                </button>
              </article>
            ))}
          </div>
        )}

        {/* AI SECTION */}
        <div className="mt-10 rounded-3xl bg-[#071a3d] p-7 text-white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <FlaskConical
                  size={22}
                  className="text-[#d4a84f]"
                />
              </div>

              <div>
                <p className="font-bold">
                  AVSH AI Report Assistant
                </p>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-white/65">
                  Get a simpler explanation of your report
                  information while preserving the original clinical
                  values and wording.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  "The AVSH AI Report Assistant can explain report information in patient-friendly language while preserving the original clinical information."
                )
              }
              className="rounded-xl bg-[#d4a84f] px-5 py-3 text-sm font-bold text-[#071a3d] hover:bg-[#f1d58a]"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* NOTICE */}
        <div className="mt-8 flex gap-3 rounded-2xl border border-[#d4a84f]/40 bg-[#fffaf0] p-5">
          <ShieldCheck
            size={22}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Clinical information notice
            </p>

            <p className="mt-1 text-sm leading-6 text-[#667085]">
              The reports shown in this university project use
              educational clinical data and imagery. The doctor and
              finalized clinical report remain the source of truth
              for diagnosis, interpretation, medication and
              treatment decisions.
            </p>
          </div>
        </div>
      </section>

      {/* REPORT VIEWER MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#071a3d]/70 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e5e1d7] bg-white px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a84f]">
                  AVSH Diagnostics
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedReport.name}
                </h2>

                <p className="mt-1 text-xs text-[#667085]">
                  Report ID: {selectedReport.id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedReport(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f3] text-[#667085] hover:bg-[#e5e1d7]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* REPORT HEADER */}
              <div className="border border-[#d9d5cb]">
                <div className="border-b-4 border-[#d4a84f] bg-[#071a3d] px-6 py-6 text-white">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-2xl font-bold tracking-wide">
                        AVSH
                      </p>

                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#d4a84f]">
                        Advanced Healthcare
                      </p>

                      <p className="mt-3 text-xs text-white/60">
                        Diagnostic & Clinical Records
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs uppercase tracking-wider text-white/60">
                        Report Status
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                          selectedReport.status
                        )}`}
                      >
                        {selectedReport.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PATIENT DETAILS */}
                <div className="grid border-b border-[#d9d5cb] sm:grid-cols-2 lg:grid-cols-4">
                  <div className="border-b border-[#e5e1d7] p-4 sm:border-r lg:border-b-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                      Patient Name
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedReport.patient}
                    </p>
                  </div>

                  <div className="border-b border-[#e5e1d7] p-4 lg:border-b-0 lg:border-r">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                      Patient ID
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedReport.patientId}
                    </p>
                  </div>

                  <div className="border-b border-[#e5e1d7] p-4 sm:border-r lg:border-b-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                      Report ID
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedReport.id}
                    </p>
                  </div>

                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                      Report Date
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedReport.date}
                    </p>
                  </div>
                </div>

                {/* STUDY DETAILS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                  <div className="border-b border-[#e5e1d7] p-4 sm:border-r lg:border-b-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                      Study / Test
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedReport.name}
                    </p>
                  </div>

                  <div className="border-b border-[#e5e1d7] p-4 lg:border-b-0 lg:border-r">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                      Department
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedReport.department}
                    </p>
                  </div>

                  <div className="border-b border-[#e5e1d7] p-4 sm:border-r lg:border-b-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                      Branch
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedReport.branch}
                    </p>
                  </div>

                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                      Referring Doctor
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedReport.doctor}
                    </p>
                  </div>
                </div>
              </div>

              {/* IMAGING VIEWER */}
              {selectedReport.type === "Imaging" &&
                selectedReport.image && (
                  <section className="mt-7 overflow-hidden rounded-2xl border border-[#d9d5cb]">
                    <div className="flex flex-col justify-between gap-2 bg-[#071a3d] px-5 py-4 text-white sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d4a84f]">
                          Imaging Study
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {selectedReport.name}
                        </p>
                      </div>

                      <span className="text-xs text-white/60">
                        AVSH Diagnostic Imaging
                      </span>
                    </div>

                    <div className="bg-[#111111] p-4 sm:p-6">
                      <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
                        <img
                          src={selectedReport.image}
                          alt={`${selectedReport.name} diagnostic image`}
                          className="max-h-[620px] w-auto max-w-full object-contain"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 border-t border-[#e5e1d7] bg-[#f8f7f3] p-4 text-xs text-[#667085] sm:grid-cols-3">
                      <div>
                        <span className="font-semibold text-[#071a3d]">
                          Study:
                        </span>{" "}
                        {selectedReport.name}
                      </div>

                      <div>
                        <span className="font-semibold text-[#071a3d]">
                          Date:
                        </span>{" "}
                        {selectedReport.date}
                      </div>

                      <div>
                        <span className="font-semibold text-[#071a3d]">
                          Branch:
                        </span>{" "}
                        {selectedReport.branch}
                      </div>
                    </div>
                  </section>
                )}

              {/* LAB RESULTS */}
              {selectedReport.type === "Laboratory" && (
                <section className="mt-7 overflow-hidden rounded-2xl border border-[#d9d5cb]">
                  <div className="bg-[#071a3d] px-5 py-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d4a84f]">
                      Laboratory Report
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedReport.name}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left">
                      <thead className="bg-[#f8f7f3] text-[11px] uppercase tracking-wider text-[#667085]">
                        <tr>
                          <th className="px-5 py-4">
                            Test Parameter
                          </th>

                          <th className="px-5 py-4">
                            Result
                          </th>

                          <th className="px-5 py-4">
                            Reference Range
                          </th>

                          <th className="px-5 py-4">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#e5e1d7]">
                        {selectedReport.results.map(
                          (result) => (
                            <tr
                              key={result.name}
                              className="hover:bg-[#faf9f6]"
                            >
                              <td className="px-5 py-4 text-sm font-semibold">
                                {result.name}
                              </td>

                              <td className="px-5 py-4 text-sm">
                                <span className="font-bold">
                                  {result.value}
                                </span>{" "}
                                <span className="text-[#667085]">
                                  {result.unit}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm text-[#667085]">
                                {result.reference}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${flagClasses(
                                    result.flag
                                  )}`}
                                >
                                  {result.flag}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* CLINICAL REPORT */}
              <section className="mt-7 border border-[#d9d5cb] bg-white">
                <div className="border-b border-[#e5e1d7] px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d4a84f]">
                    Clinical Report
                  </p>
                </div>

                <div className="space-y-7 p-5 sm:p-7">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#071a3d]">
                      Clinical Indication
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#667085]">
                      {selectedReport.indication}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#071a3d]">
                      Technique
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#667085]">
                      {selectedReport.technique}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#071a3d]">
                      Findings
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#667085]">
                      {selectedReport.findings}
                    </p>
                  </div>

                  <div className="border-l-4 border-[#d4a84f] bg-[#f8f7f3] p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#071a3d]">
                      Impression
                    </h3>

                    <p className="mt-2 text-sm font-semibold leading-7 text-[#071a3d]">
                      {selectedReport.impression}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#071a3d]">
                      Reported Result
                    </h3>

                    <p className="mt-2 text-sm font-semibold leading-7 text-[#071a3d]">
                      {selectedReport.result}
                    </p>
                  </div>
                </div>
              </section>

              {/* DOCTORS */}
              <div className="mt-7 grid gap-4 border-t border-[#d9d5cb] pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                    Referring Doctor
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {selectedReport.doctor}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                    Reporting Specialist
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {selectedReport.specialist}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-7 flex flex-col gap-3 border-t border-[#e5e1d7] pt-6 sm:flex-row">
                <button
                  onClick={() =>
                    downloadReport(selectedReport)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#102a56]"
                >
                  <Download size={17} />
                  Download Report
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5e1d7] px-5 py-3.5 text-sm font-semibold hover:bg-[#f8f7f3]"
                >
                  <Printer size={17} />
                  Print Report
                </button>

                <button
                  onClick={() =>
                    setSelectedReport(null)
                  }
                  className="flex flex-1 items-center justify-center rounded-xl border border-[#e5e1d7] px-5 py-3.5 text-sm font-semibold hover:bg-[#f8f7f3]"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#f8f7f3] p-4">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-[#071a3d]"
                />

                <p className="text-xs leading-5 text-[#667085]">
                  Educational clinical record for the AVSH university
                  project. Clinical interpretation and treatment
                  decisions remain with the responsible healthcare
                  professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .fixed.inset-0.z-50,
          .fixed.inset-0.z-50 * {
            visibility: visible;
          }

          .fixed.inset-0.z-50 {
            position: absolute !important;
            inset: 0 !important;
            background: white !important;
            padding: 0 !important;
          }

          .fixed.inset-0.z-50 > div {
            max-width: none !important;
            width: 100% !important;
            max-height: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          button {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}