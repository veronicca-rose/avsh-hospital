"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const branches = [
  "AVSH Hyderabad",
  "AVSH Vijayawada",
  "AVSH Tirupati",
  "AVSH Visakhapatnam",
];

const emergencyTypes = [
  "Accident / Trauma",
  "Chest Pain / Breathing Difficulty",
  "Severe Injury",
  "Unconsciousness",
  "Stroke Symptoms",
  "Severe Bleeding",
  "Other Emergency",
];

export default function EmergencyPage() {
  const router = useRouter();

  const [branch, setBranch] = useState("");
  const [emergencyType, setEmergencyType] = useState("");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [ambulance, setAmbulance] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !branch ||
      !emergencyType ||
      !patientName ||
      !age ||
      !phone ||
      !contactName ||
      !contactPhone
    ) {
      alert("Please complete all required fields.");
      return;
    }

    const emergencyRequest = {
      id: `AVSH-ER-${Date.now().toString().slice(-6)}`,
      branch,
      emergencyType,
      patientName,
      age,
      phone,
      contactName,
      contactPhone,
      ambulance,
      notes,
      createdAt: new Date().toISOString(),
      status: "Emergency request received",
    };

    localStorage.setItem(
      "avshEmergencyRequest",
      JSON.stringify(emergencyRequest)
    );

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F8F7F3] text-[#071A3D]">
        <header className="border-b border-white/10 bg-[#071A3D]">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
            <a href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A84F] text-xl text-[#D4A84F]">
                AV
              </div>

              <div>
                <div className="text-xl font-semibold tracking-wide text-white">
                  AVSH
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-[#F1D58A]">
                  Advanced Healthcare
                </div>
              </div>
            </a>

            <a
              href="/"
              className="text-sm font-semibold text-white/70 hover:text-[#D4A84F]"
            >
              Back to Home
            </a>
          </div>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center px-6 py-16">
          <div className="w-full rounded-[2rem] border border-[#E5E1D7] bg-white p-8 text-center shadow-xl md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl text-red-600">
              ✓
            </div>

            <div className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A84F]">
              AVSH Emergency Care
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Emergency request received
            </h1>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-[#667085]">
              Your emergency request has been recorded for the selected AVSH
              branch. Please proceed to the emergency department or follow
              instructions from the hospital team.
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-2xl bg-[#F8F7F3] p-6 text-left">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Request details
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#667085]">Patient</span>
                  <span className="font-semibold">{patientName}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#667085]">Branch</span>
                  <span className="font-semibold">{branch}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#667085]">Emergency</span>
                  <span className="font-semibold text-red-600">
                    {emergencyType}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#667085]">Ambulance</span>
                  <span className="font-semibold">
                    {ambulance ? "Requested" : "Not requested"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="/"
                className="rounded-full bg-[#071A3D] px-7 py-3.5 font-semibold text-white hover:bg-[#102A56]"
              >
                Return Home
              </a>

              <button
                onClick={() => router.push("/patient/emergency")}
                className="rounded-full border border-[#D4A84F] px-7 py-3.5 font-semibold text-[#071A3D] hover:bg-[#D4A84F]"
              >
                New Emergency Request
              </button>
            </div>

            <p className="mt-8 text-xs leading-5 text-[#667085]">
              This is a demonstration emergency workflow for the AVSH project.
              For a real medical emergency, contact your local emergency
              services immediately.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#071A3D]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071A3D]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A84F] text-xl text-[#D4A84F]">
              AV
            </div>

            <div>
              <div className="text-xl font-semibold tracking-wide text-white">
                AVSH
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#F1D58A]">
                Advanced Healthcare
              </div>
            </div>
          </a>

          <a
            href="/"
            className="text-sm font-semibold text-white/70 hover:text-[#D4A84F]"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* EMERGENCY HERO */}
      <section className="bg-[#071A3D]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A84F]">
              <span className="h-px w-10 bg-[#D4A84F]" />
              AVSH Emergency Care
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              Emergency assistance,
              <span className="block text-[#D4A84F]">
                when every moment matters.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Submit an emergency request to the nearest AVSH branch. No
              patient login is required.
            </p>
          </div>
        </div>
      </section>

      {/* WARNING */}
      <section className="mx-auto max-w-7xl px-6 pt-8">
        <div className="flex gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 font-bold text-white">
            !
          </div>

          <div>
            <h2 className="font-bold text-red-800">
              For a life-threatening emergency
            </h2>

            <p className="mt-1 text-sm leading-6 text-red-700">
              Contact your local emergency services immediately. This AVSH
              form is a demonstration workflow and should not delay urgent
              medical care.
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[#E5E1D7] bg-white p-6 shadow-sm md:p-8"
          >
            <div className="mb-8">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4A84F]">
                Emergency request
              </div>

              <h2 className="mt-2 text-3xl font-bold">
                Tell us what is happening
              </h2>

              <p className="mt-2 text-sm text-[#667085]">
                Required fields are marked with an asterisk.
              </p>
            </div>

            {/* BRANCH + EMERGENCY */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  AVSH Branch *
                </label>

                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E1D7] bg-white px-4 py-3.5 outline-none focus:border-[#D4A84F]"
                  required
                >
                  <option value="">Select branch</option>

                  {branches.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Emergency Type *
                </label>

                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E1D7] bg-white px-4 py-3.5 outline-none focus:border-[#D4A84F]"
                  required
                >
                  <option value="">Select emergency</option>

                  {emergencyTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PATIENT */}
            <div className="mt-8 border-t border-[#E5E1D7] pt-8">
              <h3 className="text-xl font-bold">Patient information</h3>

              <div className="mt-5 grid gap-5 md:grid-cols-[1fr_180px]">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Patient Name *
                  </label>

                  <input
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    className="w-full rounded-xl border border-[#E5E1D7] px-4 py-3.5 outline-none focus:border-[#D4A84F]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Age *
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    className="w-full rounded-xl border border-[#E5E1D7] px-4 py-3.5 outline-none focus:border-[#D4A84F]"
                    required
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold">
                  Patient Phone *
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-[#E5E1D7] px-4 py-3.5 outline-none focus:border-[#D4A84F]"
                  required
                />
              </div>
            </div>

            {/* CONTACT */}
            <div className="mt-8 border-t border-[#E5E1D7] pt-8">
              <h3 className="text-xl font-bold">Emergency contact</h3>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Contact Name *
                  </label>

                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter contact name"
                    className="w-full rounded-xl border border-[#E5E1D7] px-4 py-3.5 outline-none focus:border-[#D4A84F]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Contact Phone *
                  </label>

                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Enter contact phone"
                    className="w-full rounded-xl border border-[#E5E1D7] px-4 py-3.5 outline-none focus:border-[#D4A84F]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* AMBULANCE */}
            <div className="mt-8 border-t border-[#E5E1D7] pt-8">
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-[#E5E1D7] p-5 hover:border-[#D4A84F]">
                <input
                  type="checkbox"
                  checked={ambulance}
                  onChange={(e) => setAmbulance(e.target.checked)}
                  className="mt-1 h-5 w-5 accent-[#071A3D]"
                />

                <span>
                  <span className="block font-semibold">
                    Request ambulance assistance
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-[#667085]">
                    Select this if ambulance support is required for this
                    demonstration request.
                  </span>
                </span>
              </label>
            </div>

            {/* NOTES */}
            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold">
                Additional information
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Briefly describe anything the emergency team should know..."
                className="w-full resize-none rounded-xl border border-[#E5E1D7] px-4 py-3.5 outline-none focus:border-[#D4A84F]"
              />
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-xl bg-red-600 px-6 py-4 font-bold text-white transition hover:bg-red-700"
            >
              Submit Emergency Request
            </button>
          </form>

          {/* SIDE PANEL */}
          <aside className="space-y-5">
            <div className="rounded-[2rem] bg-[#071A3D] p-7 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-2xl">
                ✚
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Emergency Care
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/60">
                AVSH's emergency workflow is designed to quickly capture the
                information needed for a hospital operations team.
              </p>

              <div className="mt-7 border-t border-white/10 pt-6">
                <div className="text-xs uppercase tracking-wider text-[#D4A84F]">
                  Available
                </div>

                <div className="mt-1 text-2xl font-bold">24/7</div>

                <div className="mt-1 text-sm text-white/50">
                  Emergency support workflow
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E5E1D7] bg-white p-7">
              <h3 className="text-lg font-bold">What happens next?</h3>

              <div className="mt-6 space-y-5">
                {[
                  ["01", "Request received", "Your emergency information is recorded."],
                  ["02", "Branch identified", "The selected AVSH branch is shown to the team."],
                  ["03", "Emergency response", "The workflow indicates the requested support."],
                ].map(([number, title, text]) => (
                  <div key={number} className="flex gap-4">
                    <div className="text-sm font-bold text-[#D4A84F]">
                      {number}
                    </div>

                    <div>
                      <div className="font-semibold">{title}</div>
                      <div className="mt-1 text-sm leading-5 text-[#667085]">
                        {text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E5E1D7] bg-[#F8F7F3] p-7">
              <div className="text-sm font-semibold text-[#D4A84F]">
                PUBLIC ACCESS
              </div>

              <h3 className="mt-2 text-lg font-bold">
                No patient login required
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Emergency access is intentionally available directly from the
                AVSH homepage.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#06152F] py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 text-sm md:flex-row">
          <div>
            <div className="font-semibold">AVSH</div>
            <div className="mt-1 text-white/40">
              Advanced healthcare designed around people.
            </div>
          </div>

          <a
            href="/"
            className="text-white/50 hover:text-[#D4A84F]"
          >
            Return to AVSH Home →
          </a>
        </div>
      </footer>
    </main>
  );
}