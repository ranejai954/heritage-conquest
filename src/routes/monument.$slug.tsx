og code import {
  createFileRoute,
  Link,
  useNavigate,
  notFound,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GameStage } from "@/components/GameStage";
import StoryPlayer from "@/components/StoryPlayer";
import { MonumentQuiz } from "@/components/MonumentQuiz";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import {
  getMonument,
  nextMonument,
  MONUMENTS,
} from "@/lib/monuments";
import { api } from "@/lib/api";
import { STORIES } from "@/lib/stories";
import { MONUMENT_QUIZZES } from "@/lib/monumentQuizzes";

export const Route = createFileRoute("/monument/$slug")({
  loader: ({ params }) => {
    const monument = getMonument(params.slug);

    if (!monument) {
      throw notFound();
    }

    return { monument };
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          {
            title: "Unavailable — Heritage Conquest",
          },
          {
            name: "robots",
            content: "noindex",
          },
        ],
      };
    }

    const { monument } = loaderData;
    const title = `${monument.name} — Heritage Conquest`;

    return {
      meta: [
        {
          title,
        },
        {
          name: "description",
          content: `${monument.tagline} ${monument.region}, ${monument.era}.`,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: monument.tagline,
        },
      ],
    };
  },

  component: MonumentPage,
});

type Stage =
  | "video"
  | "game"
  | "quiz"
  | "reward"
  | "failed";

const MAX_ATTEMPTS = 3;

function MonumentPage() {
  const { monument } = Route.useLoaderData();

  const navigate = useNavigate();

  const { user, loading } = useAuth();

  const { refresh, isUnlocked } = useProgress(user?.id);

  const [stage, setStage] = useState<Stage>("video");
  const [attempts, setAttempts] = useState(0);
  const [saving, setSaving] = useState(false);

  /*
   * Redirect unauthenticated users.
   */
  useEffect(() => {
    if (!loading && !user) {
      void navigate({
        to: "/auth",
      });
    }
  }, [loading, user, navigate]);

  /*
   * Reset the page whenever the monument changes.
   */
  useEffect(() => {
    setStage("video");
    setAttempts(0);
  }, [monument.slug]);

  const index = MONUMENTS.findIndex(
    (item) => item.slug === monument.slug,
  );

  const next = nextMonument(monument.slug);

  /*
   * Get the story for the current monument.
   */
  const normalizedName = monument.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const story =
    STORIES[monument.slug] ||
    STORIES[normalizedName];

  /*
   * Get quiz questions for the current monument.
   *
   * If a monument does not have a quiz entry,
   * this will simply be an empty array.
   */
  const quizQuestions =
    MONUMENT_QUIZZES[monument.slug] ?? [];

  const hasQuiz = quizQuestions.length > 0;

  const locked =
    !loading &&
    !!user &&
    !isUnlocked(monument.slug);

  /*
   * Handle completion of the minigame.
   */
  async function handleFinish(success: boolean) {
    const used = attempts + 1;

    setAttempts(used);

    /*
     * Failed minigame.
     */
    if (!success) {
      setStage(
        used >= MAX_ATTEMPTS
          ? "failed"
          : "video",
      );

      return;
    }

    /*
     * Minigame completed successfully.
     *
     * If this monument has a quiz:
     *     game → quiz → reward
     *
     * If this monument does NOT have a quiz:
     *     game → reward
     *
     * Gateway of India will therefore skip the quiz
     * if no quiz questions are defined for it.
     */
    if (hasQuiz) {
      setStage("quiz");
    } else {
      setStage("reward");
    }

    /*
     * Save progress.
     */
    if (!user) {
      return;
    }

    setSaving(true);

    try {
      await api.saveProgress({
        monument_slug: monument.slug,
        minigame_completed: true,
        points_earned: 10,
        crystals_earned: 1,
        badge_earned: true,
        attempts_used: used,
      });
    } catch (error) {
      console.error(
        "Could not save progress to MySQL",
        error,
      );
    }

    await refresh();

    setSaving(false);
  }

  /*
   * Locked monument screen.
   */
  if (locked) {
    return (
      <main className="min-h-screen w-full px-4 py-16 text-center">
        <h1 className="text-3xl text-glow-gold">
          {monument.name} is locked
        </h1>

        <p className="mt-3 text-muted-foreground">
          Finish{" "}
          {MONUMENTS[index - 1]?.name}{" "}
          to unlock this monument.
        </p>

        <Link
          to="/map"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
        >
          Back to the map
        </Link>
      </main>
    );
  }

  return (
    <main className="monument-page min-h-screen w-full px-4 py-6">

      {/* ================= HEADER ================= */}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-sandstone">
            Monument{" "}
            {String(index + 1).padStart(2, "0")} ·{" "}
            {monument.era}
          </p>

          <h1 className="mt-2 text-3xl text-glow-gold">
            {monument.name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {monument.region}
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">
            Attempts{" "}
            {Math.min(
              attempts,
              MAX_ATTEMPTS,
            )}
            /{MAX_ATTEMPTS}
          </span>

          <Link
            to="/map"
            className="text-muted-foreground hover:text-primary"
          >
            Map
          </Link>
        </div>
      </header>

      {/* ================= HISTORICAL STORY ================= */}

      {stage === "video" && story && (
        <StoryPlayer
          story={story}
          onComplete={() => setStage("game")}
        />
      )}

      {/* ================= STORY FALLBACK ================= */}

      {stage === "video" && !story && (
        <section className="heritage-panel mt-8 w-full p-8">
          <h2 className="text-xl text-glow-gold">
            🎬 Historical briefing
          </h2>

          <div className="mt-5 flex aspect-video items-center justify-center rounded-xl border border-border bg-black/60 text-center">
            <div className="px-6">
              <p className="font-display text-2xl text-primary">
                {monument.name}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Story coming soon —{" "}
                {monument.era},{" "}
                {monument.region}.
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            {monument.tagline}
          </p>

          {attempts > 0 && (
            <p className="mt-3 text-sm text-accent">
              Challenge failed.{" "}
              {MAX_ATTEMPTS - attempts}{" "}
              attempt(s) remaining.
            </p>
          )}

          <button
            onClick={() => setStage("game")}
            className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            🎮 Play the minigame
          </button>
        </section>
      )}

      {/* ================= GAME ================= */}

      {stage === "game" && (
        <section className="mt-6 w-full">
          <GameStage
            monument={monument}
            onFinish={handleFinish}
          />

          <button
            onClick={() => handleFinish(false)}
            className="mt-4 rounded-lg border border-input px-4 py-2 text-sm text-muted-foreground hover:text-primary"
          >
            Give up this attempt
          </button>
        </section>
      )}

      {/* ================= QUIZ ================= */}

      {stage === "quiz" && hasQuiz && (
        <MonumentQuiz
          monumentName={monument.name}
          questions={quizQuestions}
          onComplete={(score, total) => {
            console.log(
              `${monument.name} quiz completed: ${score}/${total}`,
            );

            setStage("reward");
          }}
          onSkip={() => {
            setStage("reward");
          }}
        />
      )}

      {/* ================= REWARD ================= */}

      {stage === "reward" && (
        <section className="heritage-panel mt-8 p-8 text-center">
          <h2 className="text-2xl text-glow-gold">
            🏆 Challenge mastered!
          </h2>

          <div className="mt-5 flex flex-wrap justify-center gap-6 text-lg">
            <span className="text-primary">
              +10 points
            </span>

            <span className="text-primary">
              +1 crystal 💎
            </span>

            <span className="text-primary">
              +1 badge 🎖
            </span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {saving
              ? "Saving your progress…"
              : "Progress saved to your account."}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {next ? (
              <Link
                to="/monument/$slug"
                params={{
                  slug: next.slug,
                }}
                className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
              >
                🔓 Next: {next.name}
              </Link>
            ) : (
              <span className="text-primary">
                Every monument restored — the timeline is whole.
              </span>
            )}

            <Link
              to="/map"
              className="rounded-lg border border-input px-5 py-2.5 text-sm"
            >
              Back to map
            </Link>
          </div>
        </section>
      )}

      {/* ================= FAILED ================= */}

      {stage === "failed" && (
        <section className="heritage-panel mt-8 p-8 text-center">
          <h2 className="text-2xl text-glow-gold">
            Out of attempts
          </h2>

          <p className="mt-3 text-sm text-muted-foreground">
            The {monument.name} challenge held its
            secrets this time. Take a breath and return.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setAttempts(0);
                setStage("video");
              }}
              className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
            >
              Restart challenge
            </button>

            <Link
              to="/map"
              className="rounded-lg border border-input px-5 py-2.5 text-sm"
            >
              Back to map
            </Link>
          </div>
        </section>
      )}

    </main>
  );
}
