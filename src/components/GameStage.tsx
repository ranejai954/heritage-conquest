import { useEffect, useRef } from "react";

import type { Monument } from "@/lib/monuments";

type GlobalGame = Record<string, unknown>;

const scriptCache = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const cached = scriptCache.get(src);

  if (cached) {
    return cached;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      `script[data-game="${src}"]`,
    ) as HTMLScriptElement | null;

    if (existing) {
      // If the script was already loaded, resolve immediately.
      if (
        existing.dataset.loaded === "true" ||
        existing.readyState === "complete"
      ) {
        resolve();
        return;
      }

      // The script exists but may still be loading.
      existing.addEventListener("load", () => resolve(), {
        once: true,
      });

      existing.addEventListener(
        "error",
        () => {
          scriptCache.delete(src);
          reject(
            new Error(`Failed to load game script: ${src}`),
          );
        },
        { once: true },
      );

      return;
    }

    const script = document.createElement("script");

    script.src = src;
    script.dataset.game = src;

    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };

    script.onerror = () => {
      scriptCache.delete(src);

      reject(
        new Error(`Failed to load game script: ${src}`),
      );
    };

    document.body.appendChild(script);
  });

  scriptCache.set(src, promise);

  return promise;
}

export function GameStage({
  monument,
  onFinish,
}: {
  monument: Monument;
  onFinish: (success: boolean) => void;
}) {
  const gameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const domHostRef = useRef<HTMLDivElement | null>(null);

  const finishRef = useRef(onFinish);

  finishRef.current = onFinish;

  useEffect(() => {
    let cancelled = false;
    let gameStarted = false;

    const hostId =
      monument.kind === "canvas"
        ? "gameCanvas"
        : "dom-host";

    async function startGame() {
      try {
        /*
         * Load the shared game CSS once.
         */
        if (!document.querySelector('link[data-game-css="1"]')) {
          const link = document.createElement("link");

          link.rel = "stylesheet";
          link.href = "/games/games.css";
          link.dataset.gameCss = "1";

          document.head.appendChild(link);
        }

        /*
         * Wait until React has painted the game container.
         */
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              resolve();
            });
          });
        });

        if (cancelled) {
          return;
        }

        const gameContainer = gameRef.current;

        if (!gameContainer) {
          throw new Error(
            "Game container was not found.",
          );
        }

        const rect =
          gameContainer.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) {
          throw new Error(
            `Invalid game container size: ${rect.width}x${rect.height}`,
          );
        }

        /*
         * Canvas games must receive their real pixel dimensions.
         *
         * IMPORTANT:
         * Use the React canvas ref instead of
         * document.getElementById().
         */
        if (monument.kind === "canvas") {
          const canvas = canvasRef.current;

          if (!canvas) {
            throw new Error(
              "Game canvas was not found inside the game container.",
            );
          }

          canvas.style.width = "100%";
          canvas.style.height = "100%";
          canvas.style.display = "block";

          canvas.width = Math.max(
            1,
            Math.floor(rect.width),
          );

          canvas.height = Math.max(
            1,
            Math.floor(rect.height),
          );
        }

        /*
         * Load the actual game JavaScript.
         */
        await loadScript(
          `/games/${monument.script}`,
        );

        if (cancelled) {
          return;
        }

        const globalGame =
          window as unknown as GlobalGame;

        const start = globalGame[monument.start];

        if (typeof start !== "function") {
          throw new Error(
            `Game start function "${monument.start}" was not found.`,
          );
        }

        /*
         * Start the vanilla JS game.
         */
        (
          start as (
            id: string,
            callback: (success: boolean) => void,
          ) => void
        )(hostId, (success) => {
          if (!cancelled) {
            finishRef.current(success);
          }
        });

        gameStarted = true;
      } catch (error) {
        console.error(
          "Failed to start minigame:",
          error,
        );

        if (!cancelled) {
          finishRef.current(false);
        }
      }
    }

    void startGame();

    /*
     * Cleanup when leaving the game or changing monuments.
     */
    return () => {
      cancelled = true;

      /*
       * Only call the game's end hook if the game
       * actually started.
       *
       * This prevents React's initial cleanup/StrictMode
       * cycle from producing unnecessary game errors.
       */
      if (!gameStarted) {
        return;
      }

      const globalGame =
        window as unknown as GlobalGame;

      const end = globalGame[monument.end];

      if (typeof end === "function") {
        try {
          (
            end as (success: boolean) => void
          )(false);
        } catch {
          // Game was already cleaned up.
        }
      }
    };
  }, [monument]);

  return (
    <div className="w-full">
      {/* ================= GAME ================= */}

      <div
        ref={gameRef}
        id="game"
        className={`game-stage relative w-full overflow-hidden bg-black ${
          monument.kind === "canvas"
            ? "game-stage-canvas"
            : "game-stage-dom"
        }`}
        style={{
          height:
            "clamp(560px, calc(100vh - 220px), 820px)",
          minHeight: "560px",
        }}
      >
        {monument.kind === "canvas" ? (
          <canvas
            ref={canvasRef}
            id="gameCanvas"
            className="game-canvas block h-full w-full"
          />
        ) : (
          <div
            ref={domHostRef}
            id="dom-host"
            className="h-full w-full overflow-auto"
          />
        )}
      </div>

      {/* ================= DEMO SKIP BUTTON ================= */}

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => onFinish(true)}
          className="rounded-lg border border-primary/50 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/20"
        >
          ⏭ Skip Minigame → Go to Quiz
        </button>
      </div>
    </div>
  );
}