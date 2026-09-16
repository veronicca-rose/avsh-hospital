
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Stethoscope,
  Video,
  X,
  Users,
} from "lucide-react";

type Doctor = {
  name: string;
  department: string;
  specialty: string;
  experience: string;
  branch: string;
  image: string;
};

const doctors: Doctor[] = [
  {
    name: "Dr. Ananya Reddy",
    department: "Neurology",
    specialty: "Clinical Neurology",
    experience: "11 Years",
    branch: "AVSH Hyderabad",
    image: "/doctors/ananya-reddy.jpg",
  },
  {
    name: "Dr. Arjun Sharma",
    department: "Cardiology",
    specialty: "Interventional Cardiology",
    experience: "14 Years",
    branch: "AVSH Hyderabad",
    image: "/doctors/arjun-sharma.jpg",
  },
  {
    name: "Dr. Meera Iyer",
    department: "Dermatology",
    specialty: "Clinical Dermatology",
    experience: "10 Years",
    branch: "AVSH Bengaluru",
    image: "/doctors/meera-iyer.jpg",
  },
];

const services = [
  {
    title: "Book an Appointment",
    description:
      "Find the right specialist and schedule your hospital visit at a convenient time.",
    icon: CalendarDays,
    action: "/patient/appointments",
    requiresLogin: true,
  },
  {
    title: "Online Consultation",
    description:
      "Connect with AVSH doctors through secure video and chat consultations.",
    icon: Video,
    action: "/patient/online-consultation",
    requiresLogin: true,
  },
  {
    title: "Emergency Care",
    description:
      "Get immediate access to emergency services and dedicated medical support.",
    icon: HeartPulse,
    action: "/patient/emergency",
    requiresLogin: true,
  },
  {
    title: "Diagnostics & Reports",
    description:
      "Access diagnostic services, medical reports and your healthcare records.",
    icon: ShieldCheck,
    action: "/patient/diagnostics",
    requiresLogin: true,
  },
];

const specialties = [
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Ophthalmology",
  "General Medicine",
  "Orthopaedics",
];

const heroSlides = [
  {
    image: "/hero/01-hospital.jpg",
    eyebrow: "Advanced Healthcare",
    title: "Smarter care.",
    highlight: "Simpler experiences.",
    description:
      "AVSH connects patients with trusted doctors, advanced diagnostics and personalized healthcare across our hospital branches.",
  },
  {
    image: "/hero/02-doctor.jpg",
    eyebrow: "Compassionate Care",
    title: "Care that listens.",
    highlight: "Doctors who understand.",
    description:
      "Meet experienced specialists who combine clinical expertise with a patient-first approach.",
  },
  {
    image: "/hero/03-surgery.jpg",
    eyebrow: "Advanced Treatments",
    title: "Precision when it matters.",
    highlight: "Technology with purpose.",
    description:
      "Modern surgical environments and advanced clinical technology designed around better outcomes.",
  },
  {
    image: "/hero/04-room.jpg",
    eyebrow: "A Healing Environment",
    title: "Comfort built into",
    highlight: "every recovery.",
    description:
      "Thoughtfully designed spaces and coordinated care to make every hospital stay simpler.",
  },
  {
    image: "/hero/05-care.jpg",
    eyebrow: "Healthier Communities",
    title: "Your health.",
    highlight: "Our priority.",
    description:
      "Connected healthcare across specialties, services and branches—when and where you need it.",
  },
];

export default function Home() {
  const router = useRouter();

  const [showContact, setShowContact] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroBaseIndex, setHeroBaseIndex] = useState(0);
  const [heroAnimating, setHeroAnimating] = useState(false);
  const [heroPaused, setHeroPaused] = useState(false);

  const changeHero = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + heroSlides.length) % heroSlides.length;
    if (normalizedIndex === heroIndex) return;
    setHeroBaseIndex(heroIndex);
    setHeroAnimating(true);
    setHeroIndex(normalizedIndex);
    window.setTimeout(() => setHeroAnimating(false), 1250);
  };

  useEffect(() => {
    if (heroPaused) return;
    const timer = window.setTimeout(() => {
      setHeroBaseIndex(heroIndex);
      setHeroIndex((heroIndex + 1) % heroSlides.length);
      setHeroAnimating(true);
    }, 5200);

    return () => window.clearTimeout(timer);
  }, [heroPaused, heroIndex]);

  useEffect(() => {
    if (!heroAnimating) return;
    const timer = window.setTimeout(() => setHeroAnimating(false), 1250);
    return () => window.clearTimeout(timer);
  }, [heroAnimating]);

  const activeHero = heroSlides[heroIndex];
  const baseHero = heroSlides[heroBaseIndex];

  /*
   * ---------------------------------------------------------
   * PATIENT LOGIN CHECK
   * ---------------------------------------------------------
   *
   * If the patient is already logged in:
   *     /patient/appointments
   *
   * If the patient is NOT logged in:
   *     /patient/login
   *
   * This prevents patients from directly opening booking pages
   * from the homepage without signing in first.
   */
  const goToPatientArea = (path: string) => {
    setMobileMenu(false);

    if (typeof window !== "undefined") {
      const loggedIn =
        localStorage.getItem("avshPatientLoggedIn") === "true";

      if (loggedIn) {
        router.push(path);
      } else {
        router.push("/patient/login");
      }
    }
  };

  const goTo = (path: string) => {
    setMobileMenu(false);
    router.push(path);
  };

  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#071A3D]">

      {/* =========================================================
          NAVIGATION
      ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-[#E5E1D7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}

          <button
            onClick={() => goTo("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 items-center justify-center">
              <img
                src="/logo/Gemini_Generated_Image_oi0o3qoi0o3qoi0o.png"
                alt="AVSH Hospital"
                className="h-14 w-auto object-contain"
              />
            </div>

            <div className="text-left">
              <p className="text-lg font-bold tracking-tight text-[#071A3D]">
                AVSH
              </p>

              <p className="text-[11px] font-medium tracking-wide text-[#667085]">
                Advanced Healthcare
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-7 lg:flex">

            <button
              onClick={() => goTo("/")}
              className="text-sm font-semibold text-[#071A3D] transition hover:text-[#D4A84F]"
            >
              Home
            </button>

            <button
              onClick={() => {
                document
                  .getElementById("doctors")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm font-semibold text-[#667085] transition hover:text-[#071A3D]"
            >
              Doctors
            </button>

            <button
              onClick={() => {
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm font-semibold text-[#667085] transition hover:text-[#071A3D]"
            >
              Services
            </button>

            <button
              onClick={() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm font-semibold text-[#667085] transition hover:text-[#071A3D]"
            >
              About AVSH
            </button>

            <button
              onClick={() => setShowContact(true)}
              className="text-sm font-semibold text-[#667085] transition hover:text-[#071A3D]"
            >
              Contact Us
            </button>

          </nav>

          {/* Desktop Actions */}

          <div className="hidden items-center gap-3 md:flex">

            <button
              onClick={() => goTo("/patient/login")}
              className="rounded-xl border border-[#E5E1D7] px-4 py-2.5 text-sm font-bold text-[#071A3D] transition hover:border-[#D4A84F] hover:bg-[#F8F7F3]"
            >
              Patient Login
            </button>

            <button
              onClick={() => goTo("/admin/login")}
              className="rounded-xl bg-[#071A3D] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#102A56]"
            >
              Admin Login
            </button>

          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E1D7] text-[#071A3D] md:hidden"
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

        {/* Mobile Menu */}

        {mobileMenu && (
          <div className="border-t border-[#E5E1D7] bg-white px-6 py-5 md:hidden">

            <div className="flex flex-col gap-2">

              <button
                onClick={() => goTo("/")}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-[#F8F7F3]"
              >
                Home
              </button>

              <button
                onClick={() => {
                  setMobileMenu(false);
                  document
                    .getElementById("doctors")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-[#F8F7F3]"
              >
                Doctors
              </button>

              <button
                onClick={() => {
                  setMobileMenu(false);
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-[#F8F7F3]"
              >
                Services
              </button>

              <button
                onClick={() => {
                  setMobileMenu(false);
                  setShowContact(true);
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-[#F8F7F3]"
              >
                Contact Us
              </button>

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#E5E1D7] pt-4">

                <button
                  onClick={() => goTo("/patient/login")}
                  className="rounded-xl border border-[#071A3D] px-4 py-3 text-sm font-bold"
                >
                  Patient Login
                </button>

                <button
                  onClick={() => goTo("/admin/login")}
                  className="rounded-xl bg-[#071A3D] px-4 py-3 text-sm font-bold text-white"
                >
                  Admin Login
                </button>

              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          HERO / LINE-ART SLIDER
          Images are loaded directly from /public/hero/
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#071A3D] text-white">
        <div className="absolute right-[-180px] top-[-180px] h-[450px] w-[450px] rounded-full border border-[#D4A84F]/20" />
        <div className="absolute bottom-[-240px] left-[-180px] h-[500px] w-[500px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 sm:py-10 lg:py-12">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#071A3D] shadow-2xl sm:min-h-[560px] lg:min-h-[600px]">

            {/* IMAGE LAYER — deliberately kept independent from the SVG animation */}
            <img
              key={heroIndex}
              src={activeHero.image}
              alt={activeHero.eyebrow}
              className="absolute inset-0 z-0 h-full w-full object-cover object-center animate-[avshHeroImage_1.2s_ease-out_both]"
              onError={(event) => {
                console.error("AVSH hero image failed to load:", activeHero.image);
                event.currentTarget.style.display = "none";
              }}
            />

            {/* Image readability overlays */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#071A3D]/95 via-[#071A3D]/65 to-[#071A3D]/10" />
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#071A3D]/70 via-transparent to-[#071A3D]/10" />

            {/* LINE ART — independent decorative layer */}
            <svg
              key={`line-${heroIndex}`}
              className="pointer-events-none absolute inset-0 z-20 h-full w-full"
              viewBox="0 0 1440 700"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`avsh-line-${heroIndex}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4A84F" stopOpacity="0" />
                  <stop offset="20%" stopColor="#F5D98D" stopOpacity="1" />
                  <stop offset="60%" stopColor="#D4A84F" stopOpacity="1" />
                  <stop offset="100%" stopColor="#F5D98D" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M-100 570
                   C120 470 250 680 455 535
                   C665 385 760 490 965 350
                   C1130 235 1290 280 1540 105"
                fill="none"
                stroke={`url(#avsh-line-${heroIndex})`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1900"
                strokeDashoffset="1900"
                className="animate-[avshLineDraw_1.45s_cubic-bezier(.77,0,.18,1)_forwards]"
              />

              <path
                d="M-100 570
                   C120 470 250 680 455 535
                   C665 385 760 490 965 350
                   C1130 235 1290 280 1540 105"
                fill="none"
                stroke="#F5D98D"
                strokeOpacity=".22"
                strokeWidth="70"
                strokeLinecap="round"
                strokeDasharray="1900"
                strokeDashoffset="1900"
                className="animate-[avshLineGlow_1.5s_ease-out_forwards]"
              />
            </svg>

            {/* Hero copy */}
            <div
              key={`copy-${heroIndex}`}
              className="relative z-30 flex min-h-[520px] flex-col justify-end p-7 pb-24 sm:min-h-[560px] sm:p-10 sm:pb-24 lg:min-h-[600px] lg:max-w-3xl lg:p-14 lg:pb-24 animate-[avshCopyIn_.7s_cubic-bezier(.22,1,.36,1)_both]"
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D4A84F]/30 bg-white/5 px-4 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#D4A84F]" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4A84F]">
                  {activeHero.eyebrow}
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {activeHero.title}
                <br />
                <span className="text-[#D4A84F]">{activeHero.highlight}</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
                {activeHero.description}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => goToPatientArea("/patient/appointments")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4A84F] px-6 py-3.5 text-sm font-bold text-[#071A3D] transition hover:bg-[#E2BA63]"
                >
                  <CalendarDays size={17} />
                  Book an Appointment
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={() => goToPatientArea("/patient/online-consultation")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <Video size={17} />
                  Online Consultation
                </button>
              </div>
            </div>

            {/* Navigation */}
            <button
              type="button"
              aria-label="Previous hero slide"
              onClick={() => changeHero(heroIndex - 1)}
              className="absolute left-4 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <ChevronLeft size={21} />
            </button>

            <button
              type="button"
              aria-label="Next hero slide"
              onClick={() => changeHero(heroIndex + 1)}
              className="absolute right-4 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <ChevronRight size={21} />
            </button>

            {/* Pause / play */}
            <button
              type="button"
              aria-label={heroPaused ? "Play hero slider" : "Pause hero slider"}
              onClick={() => setHeroPaused((value) => !value)}
              className="absolute bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-xs font-bold text-white backdrop-blur-sm"
            >
              {heroPaused ? "▶" : "Ⅱ"}
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  aria-label={`Show hero slide ${index + 1}`}
                  onClick={() => changeHero(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === heroIndex
                      ? "w-8 bg-[#D4A84F]"
                      : "w-2 bg-white/45 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>

            <style jsx>{`
              @keyframes avshHeroImage {
                0% {
                  opacity: 0;
                  transform: scale(1.06);
                }
                100% {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              @keyframes avshLineDraw {
                0% {
                  stroke-dashoffset: 1900;
                  opacity: 0;
                }
                12% {
                  opacity: 1;
                }
                100% {
                  stroke-dashoffset: 0;
                  opacity: 1;
                }
              }

              @keyframes avshLineGlow {
                0% {
                  stroke-dashoffset: 1900;
                  opacity: 0;
                  stroke-width: 20;
                }
                25% {
                  opacity: .25;
                }
                70% {
                  stroke-width: 120;
                }
                100% {
                  stroke-dashoffset: 0;
                  opacity: 0;
                  stroke-width: 260;
                }
              }

              @keyframes avshCopyIn {
                0% {
                  opacity: 0;
                  transform: translateY(22px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @media (prefers-reduced-motion: reduce) {
                img,
                svg path,
                [class*="animate-"] {
                  animation: none !important;
                }
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* =========================================================
          QUICK ACTIONS
      ========================================================= */}

      <section className="border-b border-[#E5E1D7] bg-white">

        <div className="mx-auto grid max-w-7xl gap-3 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">

          {services.map((service) => {

            const Icon = service.icon;

            return (
              <button
                key={service.title}
                onClick={() =>
                  service.requiresLogin
                    ? goToPatientArea(service.action)
                    : goTo(service.action)
                }
                className="group flex items-center gap-4 rounded-2xl border border-transparent p-4 text-left transition hover:border-[#E5E1D7] hover:bg-[#F8F7F3]"
              >

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071A3D] text-[#D4A84F]">
                  <Icon size={20} />
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-bold">
                    {service.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#667085]">
                    {service.description}
                  </p>

                </div>

                <ChevronRight
                  size={17}
                  className="ml-auto shrink-0 text-[#667085] transition group-hover:translate-x-1 group-hover:text-[#D4A84F]"
                />

              </button>
            );
          })}

        </div>
      </section>

      {/* =========================================================
          TRUST BAR
      ========================================================= */}

      <section className="bg-[#F8F7F3]">

        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <p className="text-2xl font-bold">4</p>
            <p className="mt-1 text-sm text-[#667085]">
              AVSH hospital branches
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold">80+</p>
            <p className="mt-1 text-sm text-[#667085]">
              Doctors at each branch
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold">24/7</p>
            <p className="mt-1 text-sm text-[#667085]">
              Emergency support
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold">Digital</p>
            <p className="mt-1 text-sm text-[#667085]">
              Reports & consultations
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================
          SPECIALTIES / DEPARTMENTS
      ========================================================= */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-2xl">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A84F]">
              Medical Specialties
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Care across multiple specialties
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#667085]">
              Access experienced specialists across major departments through
              the AVSH healthcare network.
            </p>

          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {specialties.map((specialty) => (

              <button
                key={specialty}
                onClick={() => goToPatientArea("/patient/appointments")}
                className="group flex items-center justify-between rounded-2xl border border-[#E5E1D7] bg-[#F8F7F3] px-5 py-4 text-left transition hover:border-[#D4A84F] hover:bg-white"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#071A3D] text-[#D4A84F]">
                    <Stethoscope size={17} />
                  </div>

                  <span className="font-semibold">
                    {specialty}
                  </span>

                </div>

                <ChevronRight
                  size={18}
                  className="text-[#667085] transition group-hover:translate-x-1 group-hover:text-[#D4A84F]"
                />

              </button>

            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          DOCTORS
      ========================================================= */}

      <section id="doctors" className="bg-[#F8F7F3]">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A84F]">
                Our Doctors
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Meet our specialists
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667085]">
                Explore selected AVSH specialists and book directly with the
                doctor you need.
              </p>

            </div>

            <button
              onClick={() => goToPatientArea("/patient/doctors")}
              className="flex items-center gap-2 text-sm font-bold text-[#071A3D] transition hover:text-[#D4A84F]"
            >
              View all doctors
              <ArrowRight size={16} />
            </button>

          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {doctors.map((doctor) => (

              <article
                key={doctor.name}
                className="overflow-hidden rounded-3xl border border-[#E5E1D7] bg-white shadow-[0_12px_35px_rgba(7,26,61,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(7,26,61,0.08)]"
              >

                <div className="relative aspect-[4/3] overflow-hidden bg-[#EDEAE3]">

                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover object-top"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#071A3D]/80 to-transparent p-5 pt-14">

                    <span className="inline-flex rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#071A3D]">
                      AVSH Specialist
                    </span>

                  </div>
                </div>

                <div className="p-6">

                  <h3 className="text-xl font-bold">
                    {doctor.name}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-[#D4A84F]">
                    {doctor.department}
                  </p>

                  <p className="mt-2 text-sm text-[#667085]">
                    {doctor.specialty}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#E5E1D7] pt-5">

                    <div>
                      <p className="text-xs text-[#667085]">
                        Experience
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {doctor.experience}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#667085]">
                        Branch
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {doctor.branch}
                      </p>
                    </div>

                  </div>

                  {/* DOCTOR BOOKING ALSO REQUIRES LOGIN */}

                  <button
                    onClick={() =>
                      goToPatientArea("/patient/appointments")
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071A3D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102A56]"
                  >
                    <CalendarDays size={17} />
                    Book Appointment
                  </button>

                </div>

              </article>

            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}

      <section id="services" className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-2xl">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A84F]">
              AVSH Services
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for your healthcare journey
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#667085]">
              From your first appointment to digital reports and follow-up
              care, AVSH brings your healthcare experience together.
            </p>

          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">

            {services.map((service) => {

              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-3xl border border-[#E5E1D7] bg-[#F8F7F3] p-7"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071A3D] text-[#D4A84F]">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#667085]">
                    {service.description}
                  </p>

                  <button
                    onClick={() =>
                      service.requiresLogin
                        ? goToPatientArea(service.action)
                        : goTo(service.action)
                    }
                    className="mt-5 flex items-center gap-2 text-sm font-bold text-[#071A3D] transition hover:text-[#D4A84F]"
                  >
                    Explore service
                    <ArrowRight size={16} />
                  </button>

                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}

      <section id="about" className="bg-[#071A3D] text-white">

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A84F]">
              About AVSH
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Advanced healthcare designed around the patient
            </h2>

            <p className="mt-6 text-sm leading-7 text-white/65">
              AVSH brings hospital services, specialist doctors, appointments,
              diagnostics and digital healthcare experiences together through
              one connected platform.
            </p>

            <p className="mt-4 text-sm leading-7 text-white/65">
              Whether you need an in-person appointment, an online consultation
              or access to your healthcare reports, AVSH is designed to make
              each step clearer and easier.
            </p>

            <button
              onClick={() => goTo("/patient/login")}
              className="mt-8 flex items-center gap-2 rounded-xl bg-[#D4A84F] px-6 py-3.5 text-sm font-bold text-[#071A3D] transition hover:bg-[#F1D58A]"
            >
              Enter Patient Portal
              <ArrowRight size={17} />
            </button>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <Stethoscope size={25} className="text-[#D4A84F]" />

              <p className="mt-6 text-xl font-bold">
                Specialist Care
              </p>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Access doctors across multiple medical departments.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <Video size={25} className="text-[#D4A84F]" />

              <p className="mt-6 text-xl font-bold">
                Virtual Care
              </p>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Consult with doctors through secure online consultations.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <ShieldCheck size={25} className="text-[#D4A84F]" />

              <p className="mt-6 text-xl font-bold">
                Digital Records
              </p>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Keep reports and healthcare information accessible digitally.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <HeartPulse size={25} className="text-[#D4A84F]" />

              <p className="mt-6 text-xl font-bold">
                Connected Care
              </p>

              <p className="mt-2 text-sm leading-6 text-white/55">
                A simpler experience from booking through follow-up care.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="bg-[#F8F7F3]">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_50px_rgba(7,26,61,0.07)]">

            <div className="grid lg:grid-cols-[1fr_auto] lg:items-center">

              <div className="p-8 sm:p-10">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A84F]">
                  Begin your AVSH journey
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Your healthcare, connected.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667085]">
                  Book an appointment, consult a doctor online or access your
                  healthcare services through the AVSH patient portal.
                </p>

              </div>

              <div className="flex flex-col gap-3 p-8 pt-0 sm:flex-row sm:p-10 lg:flex-col">

                <button
                  onClick={() =>
                    goToPatientArea("/patient/appointments")
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#071A3D] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#102A56]"
                >
                  Book Appointment
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => goTo("/patient/login")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E1D7] px-6 py-3.5 text-sm font-bold text-[#071A3D] transition hover:border-[#D4A84F]"
                >
                  Patient Login
                </button>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="bg-[#071A3D] text-white">

        <div className="mx-auto max-w-7xl px-6 py-12">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 items-center justify-center">
                  <img
                    src="/logo/Gemini_Generated_Image_oi0o3qoi0o3qoi0o.png"
                    alt="AVSH Hospital"
                    className="h-12 w-auto object-contain"
                  />
                </div>

                <div>
                  <p className="font-bold">AVSH</p>

                  <p className="text-xs text-white/45">
                    Advanced Healthcare
                  </p>
                </div>

              </div>

              <p className="mt-5 max-w-xs text-sm leading-6 text-white/50">
                Connected healthcare designed to make every patient experience
                simpler.
              </p>

            </div>

            <div>

              <p className="font-bold">
                Patient Services
              </p>

              <div className="mt-4 space-y-3 text-sm text-white/55">

                <button
                  onClick={() =>
                    goToPatientArea("/patient/appointments")
                  }
                  className="block transition hover:text-[#D4A84F]"
                >
                  Book Appointment
                </button>

                <button
                  onClick={() =>
                    goToPatientArea("/patient/online-consultation")
                  }
                  className="block transition hover:text-[#D4A84F]"
                >
                  Online Consultation
                </button>

                <button
                  onClick={() =>
                    goToPatientArea("/patient/doctors")
                  }
                  className="block transition hover:text-[#D4A84F]"
                >
                  Find a Doctor
                </button>

                <button
                  onClick={() =>
                    goToPatientArea("/patient/diagnostics")
                  }
                  className="block transition hover:text-[#D4A84F]"
                >
                  Diagnostics
                </button>

              </div>
            </div>

            <div>

              <p className="font-bold">
                AVSH Portals
              </p>

              <div className="mt-4 space-y-3 text-sm text-white/55">

                <button
                  onClick={() => goTo("/patient/login")}
                  className="block transition hover:text-[#D4A84F]"
                >
                  Patient Login
                </button>

                <button
                  onClick={() => goTo("/admin/login")}
                  className="block transition hover:text-[#D4A84F]"
                >
                  Admin Login
                </button>

                <button
                  onClick={() => setShowContact(true)}
                  className="block transition hover:text-[#D4A84F]"
                >
                  Contact AVSH
                </button>

              </div>
            </div>

            <div>

              <p className="font-bold">
                Contact AVSH
              </p>

              <div className="mt-4 space-y-4 text-sm text-white/55">

                <button
                  onClick={() => setShowContact(true)}
                  className="flex items-center gap-3 text-left transition hover:text-[#D4A84F]"
                >
                  <Phone size={17} />
                  Contact Support
                </button>

                <div className="flex items-start gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0" />

                  <span>
                    Hyderabad
                    <br />
                    Bengaluru
                    <br />
                    Chennai
                    <br />
                    Mumbai
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={17} />
                  support@avsh.health
                </div>

              </div>
            </div>

          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/35">
            © 2026 AVSH — Advanced Healthcare. All rights reserved.
          </div>

        </div>
      </footer>

      {/* =========================================================
          CONTACT US MODAL
      ========================================================= */}

      {showContact && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#071A3D]/75 px-4 py-8 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-[#E5E1D7] px-6 py-5">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A84F]">
                  AVSH Support
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#071A3D]">
                  Contact Us
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Our support team can help with appointments, consultations,
                  hospital services and general enquiries.
                </p>

              </div>

              <button
                onClick={() => setShowContact(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F7F3] text-[#667085] transition hover:bg-[#E5E1D7]"
              >
                <X size={19} />
              </button>

            </div>

            <div className="space-y-3 p-6">

              <a
                href="tel:+914040000001"
                className="flex items-center justify-between rounded-2xl border border-[#E5E1D7] bg-[#F8F7F3] p-4 transition hover:border-[#D4A84F] hover:bg-white"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3D] text-[#D4A84F]">
                    <Phone size={18} />
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wide text-[#667085]">
                      General Enquiries
                    </p>

                    <p className="mt-1 text-base font-bold text-[#071A3D]">
                      +91 40 4000 0001
                    </p>

                  </div>
                </div>

                <span className="rounded-lg bg-[#071A3D] px-3 py-2 text-xs font-bold text-white">
                  Call
                </span>

              </a>

              <a
                href="tel:+918040000002"
                className="flex items-center justify-between rounded-2xl border border-[#E5E1D7] bg-[#F8F7F3] p-4 transition hover:border-[#D4A84F] hover:bg-white"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3D] text-[#D4A84F]">
                    <CalendarDays size={18} />
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wide text-[#667085]">
                      Appointments
                    </p>

                    <p className="mt-1 text-base font-bold text-[#071A3D]">
                      +91 80 4000 0002
                    </p>

                  </div>

                </div>

                <span className="rounded-lg bg-[#071A3D] px-3 py-2 text-xs font-bold text-white">
                  Call
                </span>

              </a>

              <a
                href="tel:+912240000003"
                className="flex items-center justify-between rounded-2xl border border-[#E5E1D7] bg-[#F8F7F3] p-4 transition hover:border-[#D4A84F] hover:bg-white"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3D] text-[#D4A84F]">
                    <HeartPulse size={18} />
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wide text-[#667085]">
                      Emergency Support
                    </p>

                    <p className="mt-1 text-base font-bold text-[#071A3D]">
                      +91 22 4000 0003
                    </p>

                  </div>

                </div>

                <span className="rounded-lg bg-[#071A3D] px-3 py-2 text-xs font-bold text-white">
                  Call
                </span>

              </a>

              <div className="mt-5 flex gap-3 rounded-2xl border border-[#D4A84F]/40 bg-[#FFFAF0] p-4">

                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-[#071A3D]"
                />

                <p className="text-xs leading-5 text-[#667085]">
                  These contact numbers are configured for the AVSH project
                  demonstration.
                </p>

              </div>

              <button
                onClick={() => setShowContact(false)}
                className="mt-2 w-full rounded-xl border border-[#E5E1D7] px-5 py-3 text-sm font-bold text-[#071A3D] transition hover:bg-[#F8F7F3]"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}

