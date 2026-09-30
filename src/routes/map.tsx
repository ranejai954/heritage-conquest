import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { MONUMENTS } from "@/lib/monuments";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      {
        title: "India Map — Heritage Conquest",
      },
      {
        name: "description",
        content:
          "Travel the map of India and select a monument: Qutub Minar, Taj Mahal, Hawa Mahal, Golden Temple and more.",
      },
      {
        property: "og:title",
        content: "India Map — Heritage Conquest",
      },
      {
        property: "og:description",
        content:
          "Pick your next monument on the map of India and unlock its minigame.",
      },
    ],
  }),

  component: MapPage,
});

function MapPage() {
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  const {
    isUnlocked,
    completed,
    totals,
  } = useProgress(user?.id);

  useEffect(() => {
    if (!loading && !user) {
      void navigate({
        to: "/auth",
      });
    }
  }, [loading, user, navigate]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-sandstone">
            Step 3
          </p>

          <h1 className="mt-2 text-3xl text-glow-gold">
            Map of India
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a monument to watch its story and play its challenge.
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <span className="text-primary">
            🏆 {totals.points} pts
          </span>

          <span className="text-primary">
            💎 {totals.crystals}
          </span>

          <span className="text-primary">
            🎖 {totals.badges}
          </span>

          <Link
            to="/"
            className="text-muted-foreground hover:text-primary"
          >
            Menu
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAP + MONUMENT LIST
      ===================================================== */}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">

        {/* ===================================================
            INDIA MAP
        =================================================== */}

        <div className="heritage-panel relative aspect-[3/4] overflow-hidden p-2">

          {/* India Map Image */}

          <img
  src="/images/india_map.png"
  alt="Map of India showing the locations of India's heritage monuments"
  className="absolute inset-0 h-full w-full object-contain"
/>

          {/* =================================================
              INTERACTIVE MONUMENT OVERLAYS

              The generated image already contains the
              visible labels/markers, so these buttons are
              intentionally transparent.

              They preserve the game's click functionality.
          ================================================= */}

          {MONUMENTS.map((m, i) => {
            const unlocked = isUnlocked(m.slug);
            const done = completed.has(m.slug);

            return (
              <button
                key={m.slug}
                type="button"
                disabled={!unlocked}
                onClick={() =>
                  navigate({
                    to: "/monument/$slug",
                    params: {
                      slug: m.slug,
                    },
                  })
                }
                style={{
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                }}
                aria-label={
                  unlocked
                    ? `Open ${m.name}`
                    : `${m.name} is locked`
                }
                title={
                  unlocked
                    ? `Open ${m.name}`
                    : `Locked — finish ${
                        MONUMENTS[i - 1]?.name ??
                        "the previous monument"
                      }`
                }
                className={`
                  absolute
                  z-20
                  h-10
                  w-10
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-transparent
                  outline-none
                  transition
                  focus-visible:ring-2
                  focus-visible:ring-primary

                  ${
                    unlocked
                      ? "cursor-pointer hover:bg-primary/10"
                      : "cursor-not-allowed"
                  }

                  ${
                    done
                      ? "ring-2 ring-primary/30"
                      : ""
                  }
                `}
              >
                <span className="sr-only">
                  {done
                    ? `${m.name} completed`
                    : unlocked
                      ? `Enter ${m.name}`
                      : `${m.name} locked`}
                </span>
              </button>
            );
          })}

          {/* =================================================
              MAP PROGRESS
          ================================================= */}

          <div className="absolute bottom-4 left-4 z-30 rounded-lg border border-primary/30 bg-black/70 px-3 py-2 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Heritage Progress
            </p>

            <p className="mt-1 text-sm font-semibold text-primary">
              {
                MONUMENTS.filter((m) =>
                  completed.has(m.slug),
                ).length
              }
              /{MONUMENTS.length - 1} Restored
            </p>
          </div>
        </div>

        {/* ===================================================
            MONUMENT LIST
        =================================================== */}

        <ol className="space-y-3">
          {MONUMENTS.map((m, i) => {
            const unlocked = isUnlocked(m.slug);
            const done = completed.has(m.slug);

            return (
              <li
                key={m.slug}
                className={`
                  heritage-panel
                  flex
                  items-center
                  gap-4
                  p-4
                  transition

                  ${
                    done
                      ? "border-primary/50"
                      : ""
                  }
                `}
              >
                {/* Number */}

                <span className="w-8 text-center font-display text-lg text-sandstone">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Monument information */}

                <div className="flex-1">
                  <p className="text-glow-gold text-lg leading-tight">
                    {m.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {m.region} · {m.era}
                  </p>
                </div>

                {/* Status / Button */}

                {unlocked ? (
                  <Link
                    to="/monument/$slug"
                    params={{
                      slug: m.slug,
                    }}
                    className={`
                      rounded-lg
                      px-3
                      py-1.5
                      text-sm
                      font-semibold
                      transition

                      ${
                        done
                          ? "border border-primary/50 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                          : "bg-primary text-primary-foreground hover:scale-105"
                      }
                    `}
                  >
                    {done ? "Replay" : "Enter"}
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    🔒 Locked
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}