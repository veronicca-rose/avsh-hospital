"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Heart,
  Lightbulb,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Utensils,
  X,
} from "lucide-react";

type Category =
  | "All"
  | "Nutrition"
  | "Fitness"
  | "Mental Wellness"
  | "Preventive Care";

type Article = {
  id: number;
  title: string;
  category: Exclude<Category, "All">;
  description: string;
  readTime: string;
  image: string;
};

const articles: Article[] = [
  {
    id: 1,
    title: "Building a balanced everyday plate",
    category: "Nutrition",
    description:
      "Simple ways to think about variety, portions and everyday meal planning.",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Small movement, big consistency",
    category: "Fitness",
    description:
      "Practical ideas for adding more movement to a busy day.",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Creating a calmer daily routine",
    category: "Mental Wellness",
    description:
      "Explore simple routines that can support rest and everyday wellbeing.",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Why preventive checkups matter",
    category: "Preventive Care",
    description:
      "Understand the role of routine health monitoring and preventive visits.",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Hydration habits that are easy to maintain",
    category: "Nutrition",
    description:
      "Practical reminders and routines for staying hydrated throughout the day.",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "Making sleep a priority",
    category: "Mental Wellness",
    description:
      "Build a consistent wind-down routine and create a better sleep environment.",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1455642305367-68834a1c0b6a?auto=format&fit=crop&w=900&q=80",
  },
];

const dailyTips = [
  {
    title: "Move regularly",
    text: "Break up long periods of sitting with short movement breaks.",
    icon: <Dumbbell size={22} />,
  },
  {
    title: "Choose variety",
    text: "Include a range of foods across your meals when possible.",
    icon: <Utensils size={22} />,
  },
  {
    title: "Pause and reset",
    text: "Take a few quiet minutes during the day to slow down and reset.",
    icon: <Heart size={22} />,
  },
  {
    title: "Keep checkups visible",
    text: "Use reminders to keep routine appointments and screenings on track.",
    icon: <ShieldCheck size={22} />,
  },
];

const quizQuestions = [
  {
    question:
      "Which habit can make a daily wellness routine easier to maintain?",
    options: [
      "Starting with small consistent actions",
      "Changing everything overnight",
      "Skipping rest",
      "Avoiding all physical activity",
    ],
    answer: 0,
  },
  {
    question:
      "Which is a useful approach to everyday meals?",
    options: [
      "Eat exactly the same food every day",
      "Aim for variety across meals",
      "Skip meals regularly",
      "Avoid drinking water",
    ],
    answer: 1,
  },
  {
    question:
      "What can help create a calmer evening routine?",
    options: [
      "Consistent wind-down habits",
      "More screen time immediately before bed",
      "Skipping sleep",
      "Constant multitasking",
    ],
    answer: 0,
  },
];

const habits = [
  "Drink water regularly",
  "Take a movement break",
  "Eat a balanced meal",
  "Spend a few minutes unwinding",
  "Follow today's personal routine",
];

export default function WellnessPage() {
  const router = useRouter();

  const [category, setCategory] =
    useState<Category>("All");

  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  const [habitState, setHabitState] = useState<
    boolean[]
  >([false, false, false, false, false]);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<
    number | null
  >(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] =
    useState(false);

  const [pollAnswer, setPollAnswer] = useState("");
  const [pollSubmitted, setPollSubmitted] =
    useState(false);

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("avshPatientLoggedIn") ===
      "true";

    if (!loggedIn) {
      router.push("/patient/login");
      return;
    }

    const savedHabits =
      localStorage.getItem("avshWellnessHabits");

    if (savedHabits) {
      try {
        setHabitState(JSON.parse(savedHabits));
      } catch {
        setHabitState([
          false,
          false,
          false,
          false,
          false,
        ]);
      }
    }
  }, [router]);

  const filteredArticles = useMemo(() => {
    if (category === "All") {
      return articles;
    }

    return articles.filter(
      (article) => article.category === category
    );
  }, [category]);

  const completedHabits = habitState.filter(
    Boolean
  ).length;

  const wellnessProgress = Math.round(
    (completedHabits / habits.length) * 100
  );

  const toggleHabit = (index: number) => {
    const updated = [...habitState];

    updated[index] = !updated[index];

    setHabitState(updated);

    localStorage.setItem(
      "avshWellnessHabits",
      JSON.stringify(updated)
    );
  };

  const answerQuiz = (index: number) => {
    if (quizAnswer !== null) return;

    setQuizAnswer(index);

    if (
      index === quizQuestions[quizIndex].answer
    ) {
      setQuizScore((current) => current + 1);
    }
  };

  const nextQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((current) => current + 1);
      setQuizAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const nextTip = () => {
    setTipIndex(
      (current) => (current + 1) % dailyTips.length
    );
  };

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#071a3d]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#e5e1d7] bg-white">
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
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#d4a84f]">
              <Sparkles size={17} />
              AVSH Wellness
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Health & Wellness
            </h1>

            <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
              Learn, track small habits and explore
              practical wellness information through the
              AVSH patient portal.
            </p>
          </div>

          {/* PROGRESS */}
          <div className="mt-10 max-w-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">
                Today's wellness progress
              </span>

              <span className="font-bold text-[#d4a84f]">
                {wellnessProgress}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#d4a84f] transition-all"
                style={{
                  width: `${wellnessProgress}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-white/50">
              {completedHabits} of {habits.length} habits
              completed
            </p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* DAILY TIP */}
        <section className="rounded-3xl border border-[#d4a84f]/40 bg-[#fffaf0] p-6 shadow-[0_15px_45px_rgba(7,26,61,0.04)]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d4a84f] text-[#071a3d]">
                <Lightbulb size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#b67d1d]">
                  Daily Tip
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {dailyTips[tipIndex].title}
                </h2>

                <p className="mt-1 max-w-2xl text-sm text-[#667085]">
                  {dailyTips[tipIndex].text}
                </p>
              </div>
            </div>

            <button
              onClick={nextTip}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#d4a84f] px-4 py-3 text-sm font-semibold hover:bg-[#f1d58a]/30"
            >
              <RefreshCw size={16} />
              Another tip
            </button>
          </div>
        </section>

        {/* HABIT TRACKER */}
        <section className="mt-8 rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#d4a84f]">
                Daily Challenge
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Small habits, steady progress
              </h2>

              <p className="mt-2 text-sm text-[#667085]">
                Check off what you complete today.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold">
              <Target size={18} />
              {completedHabits}/{habits.length}
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {habits.map((habit, index) => (
              <button
                key={habit}
                onClick={() => toggleHabit(index)}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  habitState[index]
                    ? "border-[#b8d8c0] bg-[#f1faf3]"
                    : "border-[#e5e1d7] hover:border-[#c9c2b2]"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                    habitState[index]
                      ? "border-[#071a3d] bg-[#071a3d] text-white"
                      : "border-[#d6d3cc] bg-white"
                  }`}
                >
                  {habitState[index] && (
                    <Check size={17} />
                  )}
                </div>

                <span
                  className={`text-sm font-semibold ${
                    habitState[index]
                      ? "line-through text-[#667085]"
                      : ""
                  }`}
                >
                  {habit}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* INTERACTIVE GRID */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* QUIZ */}
          <section className="rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071a3d] text-[#d4a84f]">
                  <Award size={21} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#d4a84f]">
                    Wellness Quiz
                  </p>

                  <h2 className="font-bold">
                    Test your knowledge
                  </h2>
                </div>
              </div>

              {!quizFinished && (
                <span className="text-xs font-semibold text-[#667085]">
                  {quizIndex + 1}/
                  {quizQuestions.length}
                </span>
              )}
            </div>

            {quizFinished ? (
              <div className="mt-8 rounded-2xl bg-[#f8f7f3] p-7 text-center">
                <CheckCircle2
                  size={40}
                  className="mx-auto"
                />

                <h3 className="mt-4 text-2xl font-bold">
                  Quiz complete
                </h3>

                <p className="mt-2 text-sm text-[#667085]">
                  You scored{" "}
                  <strong>{quizScore}</strong> out of{" "}
                  {quizQuestions.length}.
                </p>

                <button
                  onClick={resetQuiz}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-3 font-semibold text-white"
                >
                  <RefreshCw size={17} />
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <h3 className="mt-7 text-lg font-bold leading-7">
                  {quizQuestions[quizIndex].question}
                </h3>

                <div className="mt-5 space-y-3">
                  {quizQuestions[
                    quizIndex
                  ].options.map((option, index) => {
                    const correct =
                      index ===
                      quizQuestions[quizIndex].answer;

                    const selected =
                      index === quizAnswer;

                    let classes =
                      "border-[#e5e1d7] bg-white hover:border-[#c9c2b2]";

                    if (quizAnswer !== null && correct) {
                      classes =
                        "border-[#b8d8c0] bg-[#f1faf3]";
                    }

                    if (
                      quizAnswer !== null &&
                      selected &&
                      !correct
                    ) {
                      classes =
                        "border-[#e5b8b8] bg-[#fff5f5]";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() =>
                          answerQuiz(index)
                        }
                        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold ${classes}`}
                      >
                        <span>{option}</span>

                        {quizAnswer !== null &&
                          correct && (
                            <Check
                              size={18}
                            />
                          )}

                        {quizAnswer !== null &&
                          selected &&
                          !correct && (
                            <X size={18} />
                          )}
                      </button>
                    );
                  })}
                </div>

                {quizAnswer !== null && (
                  <button
                    onClick={nextQuestion}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071a3d] px-5 py-3.5 text-sm font-semibold text-white"
                  >
                    {quizIndex ===
                    quizQuestions.length - 1
                      ? "Finish Quiz"
                      : "Next Question"}
                    <ChevronRight size={17} />
                  </button>
                )}
              </>
            )}
          </section>

          {/* POLL */}
          <section className="rounded-3xl border border-[#e5e1d7] bg-white p-6 shadow-[0_15px_45px_rgba(7,26,61,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8f7f3]">
                <MessageCircle size={21} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#d4a84f]">
                  Community Poll
                </p>

                <h2 className="font-bold">
                  What's hardest to maintain?
                </h2>
              </div>
            </div>

            <p className="mt-6 text-sm text-[#667085]">
              Pick one option in this demonstration
              poll.
            </p>

            <div className="mt-4 space-y-3">
              {[
                "Regular exercise",
                "Balanced meals",
                "Consistent sleep",
                "Stress management",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setPollAnswer(option);
                    setPollSubmitted(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold ${
                    pollAnswer === option
                      ? "border-[#d4a84f] bg-[#fffaf0]"
                      : "border-[#e5e1d7]"
                  }`}
                >
                  {option}

                  {pollAnswer === option && (
                    <CheckCircle2 size={18} />
                  )}
                </button>
              ))}
            </div>

            <button
              disabled={!pollAnswer}
              onClick={() => setPollSubmitted(true)}
              className="mt-5 w-full rounded-xl bg-[#071a3d] px-5 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit Poll
            </button>

            {pollSubmitted && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f1faf3] p-4 text-sm font-semibold text-[#245c35]">
                <CheckCircle2 size={18} />
                Thanks for participating in the demo poll.
              </div>
            )}
          </section>
        </div>

        {/* ARTICLES */}
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#d4a84f]">
                Wellness Library
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Explore health topics
              </h2>

              <p className="mt-2 text-sm text-[#667085]">
                Browse practical educational content.
              </p>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {[
              "All",
              "Nutrition",
              "Fitness",
              "Mental Wellness",
              "Preventive Care",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setCategory(item as Category)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                  category === item
                    ? "bg-[#071a3d] text-white"
                    : "border border-[#e5e1d7] bg-white hover:bg-[#f8f7f3]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="overflow-hidden rounded-3xl border border-[#e5e1d7] bg-white shadow-[0_12px_35px_rgba(7,26,61,0.05)] transition hover:-translate-y-1"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#f8f7f3] px-3 py-1 text-xs font-bold text-[#667085]">
                      {article.category}
                    </span>

                    <span className="text-xs text-[#667085]">
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold leading-6">
                    {article.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    {article.description}
                  </p>

                  <button
                    onClick={() =>
                      setSelectedArticle(article)
                    }
                    className="mt-5 flex items-center gap-2 text-sm font-bold"
                  >
                    Read article
                    <ChevronRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* AI ASSISTANT */}
        <section className="mt-10 overflow-hidden rounded-3xl bg-[#071a3d] p-7 text-white sm:p-9">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#d4a84f]">
                <Sparkles size={17} />
                AVSH AI Wellness Assistant
              </div>

              <h2 className="mt-3 text-2xl font-bold">
                Ask questions about wellness topics
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/60">
                The future AVSH AI assistant can explain
                educational content in simple language and
                help patients navigate the portal. It does
                not replace professional medical advice.
              </p>
            </div>

            <button
              onClick={() =>
                alert(
                  "AVSH AI Wellness Assistant is a demonstration placeholder. OpenAI integration will be connected in the AI module."
                )
              }
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d4a84f] px-5 py-3.5 font-semibold text-[#071a3d] hover:bg-[#f1d58a]"
            >
              <Sparkles size={17} />
              Ask AVSH AI
            </button>
          </div>
        </section>

        {/* DISCLAIMER */}
        <div className="mt-8 rounded-2xl border border-[#e5e1d7] bg-white p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-bold">
                Educational information only
              </p>

              <p className="mt-1 text-xs leading-5 text-[#667085]">
                Wellness content in this university
                demonstration is for general education and
                does not diagnose conditions, prescribe
                treatment or replace advice from a qualified
                healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071a3d]/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="h-56 w-full object-cover"
            />

            <div className="p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#f8f7f3] px-3 py-1 text-xs font-bold text-[#667085]">
                  {selectedArticle.category}
                </span>

                <button
                  onClick={() =>
                    setSelectedArticle(null)
                  }
                  className="rounded-full p-2 hover:bg-[#f8f7f3]"
                  aria-label="Close article"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                {selectedArticle.title}
              </h2>

              <p className="mt-2 text-sm text-[#667085]">
                {selectedArticle.readTime}
              </p>

              <div className="mt-6 space-y-4 text-sm leading-7 text-[#475467]">
                <p>
                  {selectedArticle.description}
                </p>

                <p>
                  A sustainable wellness routine usually
                  starts with practical actions that can fit
                  into everyday life. Rather than attempting
                  many changes at once, focus on one or two
                  habits and build consistency over time.
                </p>

                <p>
                  AVSH wellness resources are designed to
                  support patient education and help people
                  navigate general health information. Your
                  individual circumstances may require
                  guidance from a qualified healthcare
                  professional.
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedArticle(null)
                }
                className="mt-7 w-full rounded-xl bg-[#071a3d] px-5 py-3.5 font-semibold text-white"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}