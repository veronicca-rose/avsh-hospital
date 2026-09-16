"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  Edit3,
  FileText,
  HeartPulse,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

type PatientProfile = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  city: string;
  emergencyContact: string;
  emergencyPhone: string;
};

const defaultProfile: PatientProfile = {
  fullName: "Alex Morgan",
  email: "patient@avsh.com",
  phone: "+91 98765 43210",
  dateOfBirth: "1998-06-14",
  gender: "Prefer not to say",
  bloodGroup: "O+",
  address: "24 Lake View Road",
  city: "Hyderabad",
  emergencyContact: "Jordan Morgan",
  emergencyPhone: "+91 91234 56789",
};

export default function PatientProfilePage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<PatientProfile>(defaultProfile);

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    appointments: true,
    reports: true,
    wellness: false,
    payments: true,
  });

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("avshPatientLoggedIn") === "true";

    if (!loggedIn) {
      router.push("/patient/login");
      return;
    }

    const storedProfile =
      localStorage.getItem("avshPatientProfile");

    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch {
        setProfile(defaultProfile);
      }
    }

    const storedNotifications =
      localStorage.getItem(
        "avshPatientNotifications"
      );

    if (storedNotifications) {
      try {
        setNotifications(
          JSON.parse(storedNotifications)
        );
      } catch {
        // Keep defaults.
      }
    }
  }, [router]);

  const updateField = (
    field: keyof PatientProfile,
    value: string
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveProfile = () => {
    localStorage.setItem(
      "avshPatientProfile",
      JSON.stringify(profile)
    );

    localStorage.setItem(
      "avshPatientNotifications",
      JSON.stringify(notifications)
    );

    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const toggleNotification = (
    key: keyof typeof notifications
  ) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };

    setNotifications(updated);

    localStorage.setItem(
      "avshPatientNotifications",
      JSON.stringify(updated)
    );
  };

  const calculateAge = () => {
    const birthDate = new Date(profile.dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
      return "—";
    }

    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
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
            className="flex items-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#071a3d]"
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
            Patient Account
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                My Profile
              </h1>

              <p className="mt-3 max-w-2xl text-white/70">
                Manage your personal information,
                emergency contact and notification
                preferences.
              </p>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#d4a84f] px-5 py-3 font-semibold text-[#071a3d] hover:bg-[#f1d58a]"
              >
                <Edit3 size={17} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditing(false);
                    setProfile(defaultProfile);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  onClick={saveProfile}
                  className="flex items-center gap-2 rounded-xl bg-[#d4a84f] px-5 py-3 font-semibold text-[#071a3d] hover:bg-[#f1d58a]"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#b8d8c0] bg-[#f1faf3] px-5 py-4 text-sm font-semibold text-[#245c35]">
            <CheckCircle2 size={19} />
            Your profile has been saved successfully.
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-8">
            {/* PERSONAL INFORMATION */}
            <section className="rounded-3xl border border-[#e5e1d7] bg-white shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
              <div className="border-b border-[#e5e1d7] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f7f3]">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold">
                      Personal Information
                    </h2>

                    <p className="text-xs text-[#667085]">
                      Basic patient information
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-2">
                <Field
                  label="Full Name"
                  icon={<UserRound size={17} />}
                  value={profile.fullName}
                  editable={editing}
                  onChange={(value) =>
                    updateField("fullName", value)
                  }
                />

                <Field
                  label="Email Address"
                  icon={<Mail size={17} />}
                  value={profile.email}
                  editable={false}
                  onChange={() => {}}
                />

                <Field
                  label="Phone Number"
                  icon={<Phone size={17} />}
                  value={profile.phone}
                  editable={editing}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                />

                <Field
                  label="Date of Birth"
                  icon={<CalendarDays size={17} />}
                  type="date"
                  value={profile.dateOfBirth}
                  editable={editing}
                  onChange={(value) =>
                    updateField("dateOfBirth", value)
                  }
                />

                <SelectField
                  label="Gender"
                  value={profile.gender}
                  editable={editing}
                  options={[
                    "Female",
                    "Male",
                    "Non-binary",
                    "Prefer not to say",
                  ]}
                  onChange={(value) =>
                    updateField("gender", value)
                  }
                />

                <SelectField
                  label="Blood Group"
                  value={profile.bloodGroup}
                  editable={editing}
                  options={[
                    "A+",
                    "A-",
                    "B+",
                    "B-",
                    "AB+",
                    "AB-",
                    "O+",
                    "O-",
                    "Unknown",
                  ]}
                  onChange={(value) =>
                    updateField("bloodGroup", value)
                  }
                />
              </div>
            </section>

            {/* ADDRESS */}
            <section className="rounded-3xl border border-[#e5e1d7] bg-white shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
              <div className="border-b border-[#e5e1d7] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f7f3]">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold">
                      Address
                    </h2>

                    <p className="text-xs text-[#667085]">
                      Your contact location
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field
                    label="Address"
                    icon={<MapPin size={17} />}
                    value={profile.address}
                    editable={editing}
                    onChange={(value) =>
                      updateField("address", value)
                    }
                  />
                </div>

                <Field
                  label="City"
                  icon={<MapPin size={17} />}
                  value={profile.city}
                  editable={editing}
                  onChange={(value) =>
                    updateField("city", value)
                  }
                />
              </div>
            </section>

            {/* EMERGENCY CONTACT */}
            <section className="rounded-3xl border border-[#e5e1d7] bg-white shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
              <div className="border-b border-[#e5e1d7] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff7e6]">
                    <HeartPulse
                      size={20}
                      className="text-[#b67d1d]"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold">
                      Emergency Contact
                    </h2>

                    <p className="text-xs text-[#667085]">
                      Person to contact in an emergency
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-2">
                <Field
                  label="Contact Name"
                  icon={<UserRound size={17} />}
                  value={profile.emergencyContact}
                  editable={editing}
                  onChange={(value) =>
                    updateField(
                      "emergencyContact",
                      value
                    )
                  }
                />

                <Field
                  label="Contact Phone"
                  icon={<Phone size={17} />}
                  value={profile.emergencyPhone}
                  editable={editing}
                  onChange={(value) =>
                    updateField(
                      "emergencyPhone",
                      value
                    )
                  }
                />
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="space-y-6">
            {/* PROFILE SUMMARY */}
            <section className="overflow-hidden rounded-3xl border border-[#e5e1d7] bg-white shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
              <div className="bg-[#102a56] px-6 py-7 text-white">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#d4a84f] text-2xl font-bold text-[#071a3d]">
                  {profile.fullName
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  {profile.fullName}
                </h2>

                <p className="mt-1 text-sm text-white/60">
                  AVSH Patient
                </p>
              </div>

              <div className="grid grid-cols-2 divide-x divide-[#e5e1d7]">
                <div className="p-5">
                  <p className="text-xs text-[#667085]">
                    Age
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {calculateAge()}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-xs text-[#667085]">
                    Blood Group
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {profile.bloodGroup}
                  </p>
                </div>
              </div>
            </section>

            {/* ACCOUNT SECURITY */}
            <section className="rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
              <div className="flex items-center gap-3">
                <Lock size={20} />

                <h2 className="font-bold">
                  Account Security
                </h2>
              </div>

              <div className="mt-5 rounded-2xl bg-[#f8f7f3] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Password protected
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#667085]">
                      Your account uses secure authentication
                      for access to the patient portal.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  alert(
                    "Password change is a demonstration feature."
                  )
                }
                className="mt-4 w-full rounded-xl border border-[#e5e1d7] px-4 py-3 text-sm font-semibold hover:bg-[#f8f7f3]"
              >
                Change Password
              </button>
            </section>

            {/* NOTIFICATIONS */}
            <section className="rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
              <div className="flex items-center gap-3">
                <Bell size={20} />

                <div>
                  <h2 className="font-bold">
                    Notifications
                  </h2>

                  <p className="text-xs text-[#667085]">
                    Choose what you receive
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <NotificationRow
                  label="Appointments"
                  description="Booking and appointment reminders"
                  enabled={notifications.appointments}
                  onClick={() =>
                    toggleNotification("appointments")
                  }
                />

                <NotificationRow
                  label="Reports"
                  description="New report availability"
                  enabled={notifications.reports}
                  onClick={() =>
                    toggleNotification("reports")
                  }
                />

                <NotificationRow
                  label="Wellness"
                  description="Health tips and articles"
                  enabled={notifications.wellness}
                  onClick={() =>
                    toggleNotification("wellness")
                  }
                />

                <NotificationRow
                  label="Payments"
                  description="Payment and receipt updates"
                  enabled={notifications.payments}
                  onClick={() =>
                    toggleNotification("payments")
                  }
                />
              </div>
            </section>

            {/* QUICK LINKS */}
            <section className="rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
              <h2 className="font-bold">
                Quick Links
              </h2>

              <div className="mt-4 space-y-2">
                <QuickLink
                  icon={<CalendarDays size={17} />}
                  label="My Appointments"
                  onClick={() =>
                    router.push("/patient/appointments")
                  }
                />

                <QuickLink
                  icon={<FileText size={17} />}
                  label="My Reports"
                  onClick={() =>
                    router.push("/patient/reports")
                  }
                />

                <QuickLink
                  icon={<HeartPulse size={17} />}
                  label="Health & Wellness"
                  onClick={() =>
                    router.push("/patient/wellness")
                  }
                />
              </div>
            </section>
          </aside>
        </div>

        {/* DEMO NOTICE */}
        <div className="mt-8 rounded-2xl border border-[#d4a84f]/40 bg-[#fffaf0] p-5">
          <p className="font-semibold">
            Demonstration profile
          </p>

          <p className="mt-1 text-sm leading-6 text-[#667085]">
            This profile uses synthetic patient information
            for the AVSH university project. It does not
            represent a real patient record.
          </p>
        </div>
      </section>
    </main>
  );
}

/* FIELD */

function Field({
  label,
  icon,
  value,
  editable,
  onChange,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#667085]">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          disabled={!editable}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none ${
            editable
              ? "border-[#e5e1d7] bg-white focus:border-[#d4a84f] focus:ring-2 focus:ring-[#d4a84f]/20"
              : "cursor-not-allowed border-[#e5e1d7] bg-[#f8f7f3] text-[#667085]"
          }`}
        />
      </div>
    </div>
  );
}

/* SELECT */

function SelectField({
  label,
  value,
  editable,
  options,
  onChange,
}: {
  label: string;
  value: string;
  editable: boolean;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#667085]">
        {label}
      </label>

      <select
        value={value}
        disabled={!editable}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
          editable
            ? "border-[#e5e1d7] bg-white focus:border-[#d4a84f]"
            : "cursor-not-allowed border-[#e5e1d7] bg-[#f8f7f3] text-[#667085]"
        }`}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

/* NOTIFICATION */

function NotificationRow({
  label,
  description,
  enabled,
  onClick,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">
          {label}
        </p>

        <p className="mt-0.5 text-xs text-[#667085]">
          {description}
        </p>
      </div>

      <button
        onClick={onClick}
        aria-label={`Toggle ${label} notifications`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-[#071a3d]"
            : "bg-[#d6d3cc]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* QUICK LINK */

function QuickLink({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-[#f8f7f3]"
    >
      {icon}
      {label}
    </button>
  );
}