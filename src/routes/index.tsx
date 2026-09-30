import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";

import { useProgress } from "@/hooks/useProgress";

import { MONUMENTS } from "@/lib/monuments";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heritage Conquest — Play India's Monuments" },
      {
        name: "description",
        content:
          "Explore ten Indian monuments on an interactive map, play a minigame at each site, and earn points, crystals and badges on the way to the Time Machine.",
      },
      {
        property: "og:title",
        content: "Heritage Conquest — Play India's Monuments",
      },
      {
        property: "og:description",
        content:
          "Ten monuments, ten minigames, one time machine. Unlock India's heritage one challenge at a time.",
      },
    ],
  }),

  component: Index,
});

function Index() {
  const navigate = useNavigate();

  const { user, loading, signOut } = useAuth();

  const { totals, completed } = useProgress(user?.id);

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/auth" });
    }
  }, [loading, user, navigate]);

  const nextUp =
    MONUMENTS.find((m) => !completed.has(m.slug)) ?? MONUMENTS[0]!;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-sandstone">
        Main Menu
      </p>

      {/* Welcome message using the name entered during registration */}
      <h2 className="mt-3 text-2xl text-glow-gold sm:text-3xl">
        Welcome, {user?.display_name || "Explorer"}! 👋
      </h2>

      <h1 className="mt-2 text-5xl text-glow-gold sm:text-6xl">
        Heritage Conquest
      </h1>

      <p className="mt-4 max-w-xl text-muted-foreground">
        Travel the map of India, watch each monument's story, master its
        minigame and collect the Time Crystals you need to reach the Time
        Machine.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="heritage-panel p-5">
          <p className="text-xs uppercase tracking-widest text-sandstone">
            Points
          </p>

          <p className="mt-1 text-3xl text-primary">
            {totals.points}
          </p>
        </div>

        <div className="heritage-panel p-5">
          <p className="text-xs uppercase tracking-widest text-sandstone">
            Crystals
          </p>

          <p className="mt-1 text-3xl text-primary">
            {totals.crystals} 💎
          </p>
        </div>

        <div className="heritage-panel p-5">
          <p className="text-xs uppercase tracking-widest text-sandstone">
            Badges
          </p>

          <p className="mt-1 text-3xl text-primary">
            {totals.badges} 🎖
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/map"
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          🗺 Open India Map
        </Link>

        <Link
          to="/monument/$slug"
          params={{ slug: nextUp.slug }}
          className="rounded-lg border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-secondary"
        >
          ▶ Continue: {nextUp.name}
        </Link>

        <button
          onClick={() => void signOut()}
          className="rounded-lg border border-input px-6 py-3 text-sm text-muted-foreground hover:text-primary"
        >
          Log out
        </button>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Completed {completed.size} of {MONUMENTS.length} monuments · signed in
        as {user?.email ?? "explorer"}
      </p>
    </main>
  );
}