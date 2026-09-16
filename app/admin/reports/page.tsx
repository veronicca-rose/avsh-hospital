"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  LogOut,
  Search,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ReportStatus = "Completed" | "Processing" | "Pending";
type ReportType = "Imaging" | "Laboratory";

type Report = {
  id: string;
  patient: string;
  patientId: string;
  department: string;
  test: string;
  doctor: string;
  specialist: string;
  branch: string;
  date: string;
  status: ReportStatus;
  type: ReportType;
  result: string;
  indication: string;
  technique: string;
  findings: string;
  impression: string;
  image?: string;
  values?: { name: string; result: string; range: string }[];
};

const REPORTS: Report[] = [
  {
    id: "AVSH-XR-1001",
    patient: "Ananya Reddy",
    patientId: "AVSH-P1001",
    department: "Radiology",
    test: "Chest X-Ray",
    doctor: "Dr. Aditya Sharma",
    specialist: "Dr. Ananya Rao",
    branch: "Hyderabad",
    date: "14 Sep 2026",
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
  },

  {
    id: "AVSH-MRI-1002",
    patient: "Rahul Verma",
    patientId: "AVSH-P1002",
    department: "Radiology",
    test: "MRI Brain",
    doctor: "Dr. Meera Rao",
    specialist: "Dr. Kavya Menon",
    branch: "Bengaluru",
    date: "13 Sep 2026",
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
  },

  {
    id: "AVSH-CT-1003",
    patient: "Priya Nair",
    patientId: "AVSH-P1003",
    department: "Radiology",
    test: "CT Chest",
    doctor: "Dr. Vikram Singh",
    specialist: "Dr. Arjun Mehta",
    branch: "Chennai",
    date: "13 Sep 2026",
    status: "Processing",
    type: "Imaging",
    result: "Report under radiologist review.",
    indication: "Persistent cough and shortness of breath.",
    technique:
      "Axial CT images of the chest obtained with multiplanar reformatted images.",
    findings:
      "Lung fields are adequately expanded. No focal consolidation or pleural effusion is identified. No significant mediastinal lymphadenopathy is seen.",
    impression:
      "No acute abnormality identified on the available images.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/23/CT_of_a_normal_abdomen_and_pelvis%2C_axial_plane_54.png",
  },

  {
    id: "AVSH-US-1004",
    patient: "Sneha Reddy",
    patientId: "AVSH-P1004",
    department: "Radiology",
    test: "Ultrasound Abdomen",
    doctor: "Dr. Neha Kapoor",
    specialist: "Dr. Ritu Shah",
    branch: "Hyderabad",
    date: "12 Sep 2026",
    status: "Completed",
    type: "Imaging",
    result: "No significant sonographic abnormality.",
    indication: "Intermittent abdominal discomfort.",
    technique:
      "Real-time ultrasound examination of the abdomen performed using a curvilinear transducer.",
    findings:
      "Visualized liver demonstrates homogeneous echotexture. No focal hepatic lesion is identified. Gallbladder is adequately distended without obvious calculus. No free fluid is demonstrated.",
    impression:
      "No significant sonographic abnormality identified.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Appendizitis_Sonographie.jpg",
  },

  {
    id: "AVSH-ECG-1005",
  patient: "Arjun Kapoor",
  patientId: "AVSH-P1005",
  department: "Cardiology",
  test: "ECG",
  doctor: "Dr. Vikram Singh",
  specialist: "Dr. Aisha Khan",
  branch: "Mumbai",
  date: "11 Sep 2026",
  status: "Completed",
  type: "Imaging",
  result: "Sinus rhythm.",
  indication: "Routine cardiac evaluation.",
  technique:
    "Standard 12-lead electrocardiogram obtained at rest.",
  findings:
    "Regular rhythm with identifiable P waves preceding each QRS complex. QRS complexes are narrow. No significant acute ST-T segment abnormality is demonstrated.",
  impression:
    "Sinus rhythm with no acute ischemic changes.",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/2/24/Electrocardiograma.png",
  },
  {
    id: "AVSH-CBP-1006",
    patient: "Megha Joshi",
    patientId: "AVSH-P1006",
    department: "Laboratory",
    test: "CBP / Complete Blood Picture",
    doctor: "Dr. Rohan Patel",
    specialist: "Dr. Priya Menon",
    branch: "Hyderabad",
    date: "10 Sep 2026",
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
    values: [
      { name: "Hemoglobin", result: "13.8 g/dL", range: "12.0–16.0 g/dL" },
      { name: "RBC Count", result: "4.72 million/µL", range: "4.0–5.5 million/µL" },
      { name: "WBC Count", result: "7,200 /µL", range: "4,000–11,000 /µL" },
      { name: "Platelet Count", result: "2.68 lakh/µL", range: "1.5–4.5 lakh/µL" },
      { name: "Hematocrit", result: "41.2%", range: "36–46%" },
      { name: "Neutrophils", result: "58%", range: "40–70%" },
      { name: "Lymphocytes", result: "34%", range: "20–40%" },
    ],
  },

  {
    id: "AVSH-LFT-1007",
    patient: "Karthik Rao",
    patientId: "AVSH-P1007",
    department: "Laboratory",
    test: "Liver Function Test",
    doctor: "Dr. Sanjay Kumar",
    specialist: "Dr. Priya Menon",
    branch: "Bengaluru",
    date: "09 Sep 2026",
    status: "Completed",
    type: "Laboratory",
    result: "Liver function parameters within reference range.",
    indication: "Routine metabolic evaluation.",
    technique:
      "Serum sample analyzed using automated biochemical methods.",
    findings:
      "Bilirubin, transaminases, alkaline phosphatase, total protein and albumin values are within the laboratory reference intervals.",
    impression:
      "Liver function parameters are within the expected reference range.",
    values: [
      { name: "Total Bilirubin", result: "0.8 mg/dL", range: "0.2–1.2 mg/dL" },
      { name: "Direct Bilirubin", result: "0.2 mg/dL", range: "0.0–0.3 mg/dL" },
      { name: "AST", result: "24 U/L", range: "10–40 U/L" },
      { name: "ALT", result: "22 U/L", range: "7–56 U/L" },
      { name: "Alkaline Phosphatase", result: "86 U/L", range: "44–147 U/L" },
      { name: "Albumin", result: "4.4 g/dL", range: "3.5–5.0 g/dL" },
    ],
  },

  {
    id: "AVSH-KFT-1008",
    patient: "Divya Sharma",
    patientId: "AVSH-P1008",
    department: "Laboratory",
    test: "Kidney Function Test",
    doctor: "Dr. Arvind Rao",
    specialist: "Dr. Priya Menon",
    branch: "Chennai",
    date: "08 Sep 2026",
    status: "Completed",
    type: "Laboratory",
    result: "Renal function parameters within reference range.",
    indication: "Routine health screening.",
    technique:
      "Serum biochemical analysis performed using an automated clinical chemistry analyzer.",
    findings:
      "Blood urea, serum creatinine, uric acid, sodium and potassium values are within the laboratory reference intervals.",
    impression:
      "Kidney function parameters are within the expected reference range.",
    values: [
      { name: "Blood Urea", result: "26 mg/dL", range: "15–45 mg/dL" },
      { name: "Creatinine", result: "0.9 mg/dL", range: "0.6–1.2 mg/dL" },
      { name: "Uric Acid", result: "5.2 mg/dL", range: "3.5–7.2 mg/dL" },
      { name: "Sodium", result: "140 mmol/L", range: "135–145 mmol/L" },
      { name: "Potassium", result: "4.2 mmol/L", range: "3.5–5.1 mmol/L" },
    ],
  },

  {
    id: "AVSH-LIPID-1009",
    patient: "Vivek Iyer",
    patientId: "AVSH-P1009",
    department: "Laboratory",
    test: "Lipid Profile",
    doctor: "Dr. Aisha Khan",
    specialist: "Dr. Priya Menon",
    branch: "Mumbai",
    date: "07 Sep 2026",
    status: "Completed",
    type: "Laboratory",
    result: "Lipid parameters documented for clinical review.",
    indication: "Cardiovascular risk assessment.",
    technique:
      "Fasting venous blood sample analyzed using automated biochemical methods.",
    findings:
      "Total cholesterol, LDL cholesterol, HDL cholesterol and triglycerides have been measured and documented.",
    impression:
      "Lipid profile completed for cardiovascular risk assessment.",
    values: [
      { name: "Total Cholesterol", result: "182 mg/dL", range: "<200 mg/dL" },
      { name: "LDL Cholesterol", result: "104 mg/dL", range: "<100 mg/dL" },
      { name: "HDL Cholesterol", result: "52 mg/dL", range: ">40 mg/dL" },
      { name: "Triglycerides", result: "128 mg/dL", range: "<150 mg/dL" },
    ],
  },

  {
    id: "AVSH-THY-1010",
    patient: "Rohit Das",
    patientId: "AVSH-P1010",
    department: "Laboratory",
    test: "Thyroid Profile",
    doctor: "Dr. Neha Kapoor",
    specialist: "Dr. Priya Menon",
    branch: "Hyderabad",
    date: "06 Sep 2026",
    status: "Processing",
    type: "Laboratory",
    result: "Laboratory analysis in progress.",
    indication: "Evaluation of fatigue and routine thyroid screening.",
    technique:
      "Serum sample submitted for automated immunoassay analysis.",
    findings:
      "TSH, Free T3 and Free T4 testing requested. Results are currently being processed by the laboratory.",
    impression:
      "Thyroid profile pending completion of laboratory analysis.",
  },

  {
    id: "AVSH-HBA1C-1011",
    patient: "Nisha Varma",
    patientId: "AVSH-P1011",
    department: "Laboratory",
    test: "HbA1c",
    doctor: "Dr. Meera Rao",
    specialist: "Dr. Priya Menon",
    branch: "Bengaluru",
    date: "05 Sep 2026",
    status: "Completed",
    type: "Laboratory",
    result: "HbA1c: 5.6%.",
    indication: "Diabetes screening and metabolic assessment.",
    technique:
      "Whole blood sample analyzed using an automated HbA1c assay.",
    findings:
      "HbA1c: 5.6%. Estimated average glucose is calculated from the reported HbA1c value.",
    impression:
      "HbA1c result is within the non-diabetic reference range.",
    values: [
      { name: "HbA1c", result: "5.6%", range: "<5.7%" },
      { name: "Estimated Average Glucose", result: "114 mg/dL", range: "Reference dependent" },
    ],
  },

  {
    id: "AVSH-URINE-1012",
    patient: "Aditya Menon",
    patientId: "AVSH-P1012",
    department: "Laboratory",
    test: "Urine Routine Examination",
    doctor: "Dr. Kavya Menon",
    specialist: "Dr. Priya Menon",
    branch: "Chennai",
    date: "04 Sep 2026",
    status: "Completed",
    type: "Laboratory",
    result: "No significant abnormality detected.",
    indication: "Routine urine examination.",
    technique:
      "Fresh midstream urine sample examined by physical, chemical and microscopic methods.",
    findings:
      "Appearance: Clear. Colour: Pale yellow. Protein: Negative. Glucose: Negative. Ketones: Negative. Microscopy shows occasional epithelial cells without significant bacteriuria.",
    impression:
      "Routine urine examination shows no significant abnormality.",
    values: [
      { name: "Appearance", result: "Clear", range: "Clear" },
      { name: "Protein", result: "Negative", range: "Negative" },
      { name: "Glucose", result: "Negative", range: "Negative" },
      { name: "Ketones", result: "Negative", range: "Negative" },
      { name: "Microscopy", result: "No significant finding", range: "No significant finding" },
    ],
  },
];

const statusClasses = (status: ReportStatus) => {
  if (status === "Completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Processing") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
};

export default function AdminReportsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [selectedReport, setSelectedReport] =
    useState<Report | null>(null);
  const [operations, setOperations] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("avshAdminLoggedIn");

    if (loggedIn !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  const filteredReports = useMemo(() => {
    const query = search.toLowerCase().trim();

    return REPORTS.filter((report) => {
      const matchesSearch =
        query === "" ||
        report.patient.toLowerCase().includes(query) ||
        report.patientId.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query) ||
        report.test.toLowerCase().includes(query) ||
        report.doctor.toLowerCase().includes(query);

      const matchesBranch =
        branch === "All" || report.branch === branch;

      const matchesDepartment =
        department === "All" ||
        report.department === department;

      const matchesStatus =
        status === "All" || report.status === status;

      const matchesType =
        type === "All" || report.type === type;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesDepartment &&
        matchesStatus &&
        matchesType
      );
    });
  }, [search, branch, department, status, type]);

  const completed = REPORTS.filter(
    (r) => r.status === "Completed"
  ).length;

  const processing = REPORTS.filter(
    (r) => r.status === "Processing"
  ).length;

  const pending = REPORTS.filter(
    (r) => r.status === "Pending"
  ).length;

  const imaging = REPORTS.filter(
    (r) => r.type === "Imaging"
  ).length;

  const downloadReport = (report: Report) => {
    const valuesText = report.values
      ? report.values
          .map(
            (value) =>
              `${value.name}: ${value.result} | Reference: ${value.range}`
          )
          .join("\n")
      : "";

    const text = `
AVSH - ADVANCED HEALTHCARE
DIAGNOSTIC REPORT
========================================

Report ID: ${report.id}
Patient: ${report.patient}
Patient ID: ${report.patientId}
Branch: ${report.branch}

Study/Test: ${report.test}
Department: ${report.department}
Type: ${report.type}
Date: ${report.date}
Referring Doctor: ${report.doctor}
Reporting Specialist: ${report.specialist}

CLINICAL INDICATION
${report.indication}

TECHNIQUE
${report.technique}

RESULT VALUES
${valuesText}

FINDINGS
${report.findings}

IMPRESSION
${report.impression}

Status: ${report.status}

Synthetic Clinical Data
AVSH Advanced Healthcare
`;

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${report.id}-report.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const logout = () => {
    localStorage.removeItem("avshAdminLoggedIn");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#071A3D]">
      {/* HEADER */}
      <header className="bg-[#071A3D] text-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A84F] text-sm font-bold text-[#D4A84F]">
              AV
            </div>

            <div>
              <div className="text-xl font-semibold">
                AVSH
              </div>

              <div className="text-xs tracking-[0.2em] text-[#D4A84F]">
                ADVANCED HEALTHCARE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                Admin Portal
              </p>

              <p className="text-xs text-slate-300">
                Reports & Diagnostics
              </p>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-8">
        {/* TITLE */}
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84F]">
              Administration
            </p>

            <h1 className="text-3xl font-semibold">
              Reports Center
            </h1>

            <p className="mt-2 text-sm text-[#667085]">
              Imaging and laboratory reports across AVSH.
            </p>
          </div>

          <button
            onClick={() => setOperations(!operations)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#071A3D] px-5 py-3 text-sm font-medium text-white hover:bg-[#102653]"
          >
            <BarChart3 size={17} />

            {operations
              ? "Back to Reports"
              : "Operations Overview"}
          </button>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-sm">
            <FileText
              size={20}
              className="mb-4 text-[#D4A84F]"
            />

            <p className="text-sm text-[#667085]">
              Total Reports
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {REPORTS.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-sm">
            <CheckCircle2
              size={20}
              className="mb-4 text-emerald-600"
            />

            <p className="text-sm text-[#667085]">
              Completed
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {completed}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-sm">
            <Activity
              size={20}
              className="mb-4 text-amber-600"
            />

            <p className="text-sm text-[#667085]">
              Processing
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {processing}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-sm">
            <ShieldCheck
              size={20}
              className="mb-4 text-slate-500"
            />

            <p className="text-sm text-[#667085]">
              Pending
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {pending}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-sm">
            <Activity
              size={20}
              className="mb-4 text-[#D4A84F]"
            />

            <p className="text-sm text-[#667085]">
              Imaging
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {imaging}
            </p>
          </div>
        </div>

        {operations ? (
          <section className="rounded-2xl border border-[#E5E1D7] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#071A3D] p-3 text-[#D4A84F]">
                <BarChart3 size={21} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Operations Overview
                </h2>

                <p className="text-sm text-[#667085]">
                  Diagnostic department performance
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["Laboratory", 94, "1,248"],
                ["Radiology", 91, "684"],
                ["Cardiology", 88, "421"],
                ["Pathology", 96, "317"],
              ].map(([name, percentage, volume]) => (
                <div
                  key={name}
                  className="rounded-xl border border-[#E5E1D7] p-5"
                >
                  <div className="mb-3 flex justify-between">
                    <span className="font-medium">
                      {name}
                    </span>

                    <span className="font-semibold text-[#D4A84F]">
                      {percentage}%
                    </span>
                  </div>

                  <div className="mb-3 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-[#D4A84F]"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="text-xs text-[#667085]">
                    {volume} reports processed
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* FILTERS */}
            <section className="mb-6 rounded-2xl border border-[#E5E1D7] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Filter
                  size={17}
                  className="text-[#D4A84F]"
                />

                <h2 className="font-semibold">
                  Search & Filters
                </h2>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search reports..."
                    className="w-full rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#D4A84F]"
                  />
                </div>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] px-4 py-3 text-sm outline-none"
                >
                  <option value="All">All Report Types</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Laboratory">
                    Laboratory
                  </option>
                </select>

                <select
                  value={branch}
                  onChange={(e) =>
                    setBranch(e.target.value)
                  }
                  className="rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] px-4 py-3 text-sm outline-none"
                >
                  <option value="All">All Branches</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Mumbai">Mumbai</option>
                </select>

                <select
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value)
                  }
                  className="rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] px-4 py-3 text-sm outline-none"
                >
                  <option value="All">
                    All Departments
                  </option>
                  <option value="Radiology">Radiology</option>
                  <option value="Cardiology">
                    Cardiology
                  </option>
                  <option value="Laboratory">
                    Laboratory
                  </option>
                </select>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] px-4 py-3 text-sm outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">
                    Completed
                  </option>
                  <option value="Processing">
                    Processing
                  </option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </section>

            {/* REPORTS */}
            <section className="overflow-hidden rounded-2xl border border-[#E5E1D7] bg-white shadow-sm">
              <div className="border-b border-[#E5E1D7] px-6 py-5">
                <h2 className="font-semibold">
                  Diagnostic Reports
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  {filteredReports.length} reports available
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left">
                  <thead className="bg-[#F8F7F3] text-xs uppercase tracking-wider text-[#667085]">
                    <tr>
                      <th className="px-6 py-4">Report</th>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Branch</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#E5E1D7]">
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-[#F8F7F3]"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium">
                            {report.test}
                          </p>

                          <p className="mt-1 text-xs text-[#667085]">
                            {report.id}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-medium">
                            {report.patient}
                          </p>

                          <p className="mt-1 text-xs text-[#667085]">
                            {report.patientId}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm">
                            {report.type}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm">
                          {report.branch}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {report.date}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses(
                              report.status
                            )}`}
                          >
                            {report.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              setSelectedReport(report)
                            }
                            className="rounded-lg border border-[#E5E1D7] px-4 py-2 text-xs font-medium hover:border-[#D4A84F] hover:text-[#D4A84F]"
                          >
                            View Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      {/* REPORT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#071A3D]/70 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 max-w-5xl rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#E5E1D7] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84F]">
                  AVSH Diagnostic Report
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {selectedReport.test}
                </h2>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-[#F8F7F3]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* PATIENT DETAILS */}
              <div className="mb-6 grid gap-4 rounded-xl bg-[#F8F7F3] p-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-[#667085]">
                    Patient
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedReport.patient}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#667085]">
                    Patient ID
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedReport.patientId}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#667085]">
                    Report ID
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedReport.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#667085]">
                    Branch
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedReport.branch}
                  </p>
                </div>
              </div>

              {/* IMAGING */}
              {selectedReport.type === "Imaging" &&
                selectedReport.image && (
                  <div className="mb-6 overflow-hidden rounded-2xl border border-[#E5E1D7]">
                    <div className="flex items-center justify-between bg-[#071A3D] px-5 py-3 text-white">
                      <span className="text-sm font-medium">
                        {selectedReport.test}
                      </span>

                      <span className="text-xs text-[#D4A84F]">
                        Synthetic Clinical Image
                      </span>
                    </div>

                    <div className="flex min-h-[420px] items-center justify-center bg-black p-5">
                      <img
                        src={selectedReport.image}
                        alt={selectedReport.test}
                        className="max-h-[650px] max-w-full object-contain"
                      />
                    </div>
                  </div>
                )}

              {/* LABORATORY REPORT */}
              {selectedReport.type === "Laboratory" && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-[#E5E1D7]">
                  <div className="bg-[#071A3D] px-6 py-5 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#D4A84F]">
                          AVSH Laboratory
                        </p>

                        <h3 className="mt-1 text-lg font-semibold">
                          {selectedReport.test}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses(
                          selectedReport.status
                        )}`}
                      >
                        {selectedReport.status}
                      </span>
                    </div>
                  </div>

                  {selectedReport.values && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[#F8F7F3] text-xs uppercase tracking-wider text-[#667085]">
                          <tr>
                            <th className="px-6 py-4">
                              Test Parameter
                            </th>

                            <th className="px-6 py-4">
                              Result
                            </th>

                            <th className="px-6 py-4">
                              Reference Range
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E5E1D7]">
                          {selectedReport.values.map(
                            (value) => (
                              <tr key={value.name}>
                                <td className="px-6 py-4 text-sm font-medium">
                                  {value.name}
                                </td>

                                <td className="px-6 py-4 text-sm font-semibold">
                                  {value.result}
                                </td>

                                <td className="px-6 py-4 text-sm text-[#667085]">
                                  {value.range}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* REPORT INFORMATION */}
              <div className="space-y-6">
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#D4A84F]">
                    Clinical Indication
                  </h3>

                  <p className="text-sm leading-6 text-[#667085]">
                    {selectedReport.indication}
                  </p>
                </section>

                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#D4A84F]">
                    Technique
                  </h3>

                  <p className="text-sm leading-6 text-[#667085]">
                    {selectedReport.technique}
                  </p>
                </section>

                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#D4A84F]">
                    Findings
                  </h3>

                  <p className="text-sm leading-7 text-[#667085]">
                    {selectedReport.findings}
                  </p>
                </section>

                <section className="rounded-xl border border-[#E5E1D7] bg-[#F8F7F3] p-5">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#D4A84F]">
                    Impression
                  </h3>

                  <p className="font-medium leading-6">
                    {selectedReport.impression}
                  </p>
                </section>
              </div>

              {/* DOCTORS */}
              <div className="mt-7 grid gap-4 border-t border-[#E5E1D7] pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#667085]">
                    Referring Doctor
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedReport.doctor}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#667085]">
                    Reporting Specialist
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedReport.specialist}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-7 flex flex-col gap-3 border-t border-[#E5E1D7] pt-6 sm:flex-row sm:justify-end">
                <button
                  onClick={() =>
                    downloadReport(selectedReport)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#071A3D] px-5 py-3 text-sm font-medium text-white hover:bg-[#102653]"
                >
                  <Download size={17} />
                  Download Report
                </button>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="rounded-xl border border-[#E5E1D7] px-5 py-3 text-sm font-medium hover:bg-[#F8F7F3]"
                >
                  Close
                </button>
              </div>

              <p className="mt-5 text-center text-xs text-[#667085]">
                AVSH Advanced Healthcare • Secure Clinical Reports
              </p>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-[#E5E1D7] bg-white px-6 py-6">
        <div className="mx-auto flex max-w-[1500px] justify-between text-xs text-[#667085]">
          <span>© 2026 AVSH — Advanced Healthcare</span>
          <span>Secure Reports Center</span>
        </div>
      </footer>
    </div>
  );
}
