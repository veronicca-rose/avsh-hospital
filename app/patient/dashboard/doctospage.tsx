"use client";

import { useRouter } from "next/navigation";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  branch: string;
  image: string;
};

const doctors: Doctor[] = [
  {
    id: "AVSH-DOC-001",
    name: "Dr. Arjun Sharma",
    specialty: "Cardiology",
    qualification: "MBBS, MD, DM",
    experience: "12 years",
    branch: "AVSH Hyderabad",
    image:
      "https://images.pexels.com/photos/19438566/pexels-photo-19438566.jpeg",
  },
  {
    id: "AVSH-DOC-002",
    name: "Dr. Ananya Reddy",
    specialty: "Neurology",
    qualification: "MBBS, MD, DM",
    experience: "10 years",
    branch: "AVSH Bengaluru",
    image:
      "https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg",
  },
  {
    id: "AVSH-DOC-003",
    name: "Dr. Vikram Mehta",
    specialty: "Orthopedics",
    qualification: "MBBS, MS",
    experience: "14 years",
    branch: "AVSH Mumbai",
    image:
      "https://images.pexels.com/photos/19438563/pexels-photo-19438563.jpeg",
  },
  {
    id: "AVSH-DOC-004",
    name: "Dr. Priya Nair",
    specialty: "Pediatrics",
    qualification: "MBBS, MD",
    experience: "9 years",
    branch: "AVSH Chennai",
    image:
      "https://images.pexels.com/photos/15752232/pexels-photo-15752232.jpeg",
  },
  {
    id: "AVSH-DOC-005",
    name: "Dr. Rohan Kapoor",
    specialty: "Gastroenterology",
    qualification: "MBBS, MD, DM",
    experience: "11 years",
    branch: "AVSH Hyderabad",
    image:
      "https://images.pexels.com/photos/10695742/pexels-photo-10695742.jpeg",
  },
];

export default function FeaturedDoctors() {
  const router = useRouter();

  const bookDoctor = (doctor: Doctor) => {
    /*
     * Save the exact doctor the patient selected.
     * The appointment page can read this and open
     * directly with this doctor selected.
     */
    localStorage.setItem(
      "avshSelectedDoctor",
      JSON.stringify(doctor)
    );

    router.push("/patient/appointments");
  };

  return (
    <section className="mt-8 w-full">
      {/* Section heading */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4A84F]">
            AVSH Medical Team
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-[#071A3D]">
            Our Doctors
          </h2>

          <p className="mt-1 text-sm text-[#667085]">
            Meet our specialists and book an appointment directly.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push("/patient/appointments?view=doctors")
          }
          className="hidden rounded-xl border border-[#E5E1D7] bg-white px-4 py-2.5 text-sm font-semibold text-[#071A3D] transition hover:bg-[#F8F7F3] sm:block"
        >
          View All Doctors
        </button>
      </div>

      {/* Doctor cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {doctors.map((doctor) => (
          <article
            key={doctor.id}
            className="overflow-hidden rounded-2xl border border-[#E5E1D7] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Portrait */}
            <div className="relative aspect-[4/4.7] overflow-hidden bg-[#EEF1F4]">
              <img
                src={doctor.image}
                alt={`${doctor.name}, ${doctor.specialty}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />

              {/* Experience badge */}
              <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#071A3D] shadow-sm">
                {doctor.experience}
              </div>
            </div>

            {/* Information */}
            <div className="p-4">
              <h3 className="text-base font-semibold leading-tight text-[#071A3D]">
                {doctor.name}
              </h3>

              <p className="mt-1 text-sm font-semibold text-[#D4A84F]">
                {doctor.specialty}
              </p>

              <p className="mt-2 text-xs text-[#667085]">
                {doctor.qualification}
              </p>

              <div className="mt-2 flex items-center gap-2 text-xs text-[#667085]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A84F]" />

                <span>{doctor.branch}</span>
              </div>

              {/* Book button */}
              <button
                type="button"
                onClick={() => bookDoctor(doctor)}
                className="mt-4 w-full rounded-xl bg-[#071A3D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102A56] active:scale-[0.98]"
              >
                Book Appointment
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile view-all button */}
      <button
        type="button"
        onClick={() =>
          router.push("/patient/appointments?view=doctors")
        }
        className="mt-5 w-full rounded-xl border border-[#E5E1D7] bg-white px-4 py-3 text-sm font-semibold text-[#071A3D] transition hover:bg-[#F8F7F3] sm:hidden"
      >
        View All Doctors
      </button>
    </section>
  );
}