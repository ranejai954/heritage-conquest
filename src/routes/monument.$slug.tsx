import {
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
  | "failed"
  | "complete";

const MAX_ATTEMPTS = 3;

function MonumentPage() {
  const { monument } = Route.useLoaderData();

  const navigate = useNavigate();

  const { user, loading } = useAuth();

  const { refresh, isUnlocked } = useProgress(user?.id);

  const [stage, setStage] = useState<Stage>("video");
  const [attempts, setAttempts] = useState(0);
  const [saving, setSaving] = useState(false);
  const [certificatePreviewUrl, setCertificatePreviewUrl] =
    useState("");

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
   */
  const quizQuestions =
    MONUMENT_QUIZZES[monument.slug] ?? [];

  const hasQuiz = quizQuestions.length > 0;

  const locked =
    !loading &&
    !!user &&
    !isUnlocked(monument.slug);

  /*
   * Get the player's name.
   *
   * Different authentication setups can expose the
   * name differently, so we check the common fields.
   */
  const playerName =
    (user as any)?.name ||
    (user as any)?.full_name ||
    (user as any)?.username ||
    (user as any)?.email?.split("@")[0] ||
    "Young Historian";

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
   * Called after the final monument reward.
   *
   * Since Time Machine is the final entry in MONUMENTS,
   * next will be undefined. That means the whole game
   * has been completed.
   */
  function handleRewardContinue() {
    if (!next) {
      setStage("complete");
      return;
    }

    void navigate({
      to: "/monument/$slug",
      params: {
        slug: next.slug,
      },
    });
  }

  /*
   * Certificate export helpers.
   *
   * Both PNG and PDF are generated from the same SVG so the two files
   * contain the same certificate design instead of printing the webpage.
   */
  async function loadCertificateBackground() {
    try {
      const response = await fetch(
        "/assets/certificate-background.png",
        { cache: "force-cache" },
      );

      if (!response.ok) {
        return "";
      }

      const blob = await response.blob();

      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve(
            typeof reader.result === "string"
              ? reader.result
              : "",
          );
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  }

  function buildCertificateSVG(
    name: string,
    backgroundDataUrl = "",
  ) {
    const certificateWidth = 1600;
    const certificateHeight = 1100;
    const safeName = escapeXML(name);
    const nameFontSize =
      name.length > 24 ? 52 : name.length > 16 ? 60 : 70;

    const background = backgroundDataUrl
      ? `
        <image
          href="${backgroundDataUrl}"
          x="0"
          y="0"
          width="${certificateWidth}"
          height="${certificateHeight}"
          preserveAspectRatio="xMidYMid slice"
        />
      `
      : `
        <rect
          width="${certificateWidth}"
          height="${certificateHeight}"
          fill="#f7ead0"
        />
      `;

    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="${certificateWidth}"
        height="${certificateHeight}"
        viewBox="0 0 ${certificateWidth} ${certificateHeight}"
      >
        ${background}

        <!-- Text is intentionally kept inside the light center panel of the supplied design. -->
        <text
          x="800"
          y="315"
          text-anchor="middle"
          font-family="Georgia, serif"
          font-size="34"
          font-weight="bold"
          letter-spacing="8"
          fill="#7a4b20"
        >
          HERITAGE CONQUEST
        </text>

        <text
          x="800"
          y="395"
          text-anchor="middle"
          font-family="Georgia, serif"
          font-size="58"
          font-weight="bold"
          fill="#3f2a18"
        >
          CERTIFICATE OF COMPLETION
        </text>

        <text
          x="800"
          y="470"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="25"
          fill="#5d5144"
        >
          This certificate is proudly presented to
        </text>

        <text
          x="800"
          y="555"
          text-anchor="middle"
          font-family="Georgia, serif"
          font-size="${nameFontSize}"
          font-weight="bold"
          fill="#9a682b"
        >
          ${safeName}
        </text>

        <line
          x1="480"
          y1="580"
          x2="1120"
          y2="580"
          stroke="#b8863b"
          stroke-width="3"
        />

        <text
          x="800"
          y="645"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="24"
          fill="#4f4438"
        >
          for successfully completing the Heritage Conquest adventure
        </text>

        <text
          x="800"
          y="685"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="24"
          fill="#4f4438"
        >
          and restoring the timeline by completing all 10 Indian monuments.
        </text>

        <text
          x="800"
          y="755"
          text-anchor="middle"
          font-family="Georgia, serif"
          font-size="38"
          font-weight="bold"
          fill="#7a4b20"
        >
          10 MONUMENTS • 10 TIME CRYSTALS
        </text>

        <text
          x="800"
          y="810"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="21"
          fill="#65584b"
        >
          Awarded by the Heritage Conquest Time Archivists
        </text>

        <line
          x1="620"
          y1="860"
          x2="980"
          y2="860"
          stroke="#b8863b"
          stroke-width="2"
        />

        <text
          x="800"
          y="900"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="20"
          fill="#65584b"
        >
          Congratulations, Young Historian!
        </text>
      </svg>
    `;
  }

  async function renderCertificateCanvas() {
    const certificateWidth = 1600;
    const certificateHeight = 1100;
    const backgroundDataUrl =
      await loadCertificateBackground();

    const svg = buildCertificateSVG(
      playerName,
      backgroundDataUrl,
    );

    const blob = new Blob([svg], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    try {
      const image = await new Promise<HTMLImageElement>(
        (resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () =>
            reject(
              new Error("Could not render certificate."),
            );
          img.src = url;
        },
      );

      const canvas = document.createElement("canvas");
      canvas.width = certificateWidth;
      canvas.height = certificateHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error(
          "Could not create certificate canvas.",
        );
      }

      context.drawImage(
        image,
        0,
        0,
        certificateWidth,
        certificateHeight,
      );

      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function downloadBlob(
    blob: Blob,
    fileName: string,
  ) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadCertificatePNG() {
    try {
      const canvas = await renderCertificateCanvas();

      const blob = await new Promise<Blob | null>(
        (resolve) =>
          canvas.toBlob(
            (result) => resolve(result),
            "image/png",
          ),
      );

      if (!blob) {
        throw new Error("Could not create PNG file.");
      }

      downloadBlob(
        blob,
        `Heritage-Conquest-Certificate-${sanitizeFileName(
          playerName,
        )}.png`,
      );
    } catch (error) {
      console.error(
        "Could not generate certificate PNG:",
        error,
      );
    }
  }

  /*
   * Create a real one-page PDF from the certificate image.
   * This does NOT use window.print(), so browser URL/date/page
   * headers can never appear in the downloaded certificate.
   */
  async function downloadCertificatePDF() {
    try {
      const canvas = await renderCertificateCanvas();
      const jpegDataUrl = canvas.toDataURL(
        "image/jpeg",
        0.96,
      );
      const commaIndex = jpegDataUrl.indexOf(",");
      if (commaIndex === -1) {
        throw new Error("Could not encode certificate image.");
      }

      const base64 = jpegDataUrl.slice(commaIndex + 1);
      const binary = atob(base64);
      const jpegBytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i += 1) {
        jpegBytes[i] = binary.charCodeAt(i);
      }

      const pageWidth = 842;
      const pageHeight = 595;
      const scale = Math.min(
        pageWidth / canvas.width,
        pageHeight / canvas.height,
      );
      const imageWidth = canvas.width * scale;
      const imageHeight = canvas.height * scale;
      const imageX =
        (pageWidth - imageWidth) / 2;
      const imageY =
        (pageHeight - imageHeight) / 2;

      const encoder = new TextEncoder();
      const chunks: Uint8Array[] = [];
      const offsets: number[] = [0];
      let length = 0;

      const add = (data: Uint8Array | string) => {
        const bytes =
          typeof data === "string"
            ? encoder.encode(data)
            : data;
        chunks.push(bytes);
        length += bytes.length;
      };

      add("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

      const addObject = (
        number: number,
        body: string,
      ) => {
        offsets[number] = length;
        add(`${number} 0 obj\n${body}\nendobj\n`);
      };

      addObject(
        1,
        "<< /Type /Catalog /Pages 2 0 R >>",
      );

      addObject(
        2,
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      );

      const content =
        `q\n${imageWidth.toFixed(2)} 0 0 ` +
        `${imageHeight.toFixed(2)} ` +
        `${imageX.toFixed(2)} ${imageY.toFixed(2)} cm\n` +
        "/Im0 Do\nQ\n";

      addObject(
        3,
        `<< /Type /Page /Parent 2 0 R ` +
          `/MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
          `/Resources << /XObject << /Im0 4 0 R >> >> ` +
          `/Contents 5 0 R >>`,
      );

      offsets[4] = length;
      add(
        `4 0 obj\n` +
          `<< /Type /XObject /Subtype /Image ` +
          `/Width ${canvas.width} /Height ${canvas.height} ` +
          `/ColorSpace /DeviceRGB /BitsPerComponent 8 ` +
          `/Filter /DCTDecode /Length ${jpegBytes.length} >>\n` +
          `stream\n`,
      );
      add(jpegBytes);
      add("\nendstream\nendobj\n");

      offsets[5] = length;
      add(
        `5 0 obj\n` +
          `<< /Length ${encoder.encode(content).length} >>\n` +
          `stream\n${content}endstream\nendobj\n`,
      );

      const xrefOffset = length;
      add("xref\n0 6\n");
      add("0000000000 65535 f \n");

      for (let i = 1; i <= 5; i += 1) {
        add(
          `${String(offsets[i]).padStart(10, "0")} 00000 n \n`,
        );
      }

      add(
        `trailer\n` +
          `<< /Size 6 /Root 1 0 R >>\n` +
          `startxref\n${xrefOffset}\n%%EOF`,
      );

      const pdfBytes = new Uint8Array(length);
      let cursor = 0;

      for (const chunk of chunks) {
        pdfBytes.set(chunk, cursor);
        cursor += chunk.length;
      }

      const pdf = new Blob(
        [pdfBytes.buffer as ArrayBuffer],
        { type: "application/pdf" },
      );

      downloadBlob(
        pdf,
        `Heritage-Conquest-Certificate-${sanitizeFileName(
          playerName,
        )}.pdf`,
      );
    } catch (error) {
      console.error(
        "Could not generate certificate PDF:",
        error,
      );
    }
  }

  /*
   * Build the on-screen certificate from the exact same SVG used by
   * the PNG/PDF download functions. This keeps the preview and the
   * downloaded certificate visually identical.
   */
  useEffect(() => {
    if (stage !== "complete") {
      setCertificatePreviewUrl("");
      return;
    }

    let cancelled = false;
    let objectUrl = "";

    async function createCertificatePreview() {
      try {
        const backgroundDataUrl =
          await loadCertificateBackground();

        const svg = buildCertificateSVG(
          playerName,
          backgroundDataUrl,
        );

        const blob = new Blob([svg], {
          type: "image/svg+xml;charset=utf-8",
        });

        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setCertificatePreviewUrl(objectUrl);
        }
      } catch (error) {
        console.error(
          "Could not create certificate preview:",
          error,
        );
      }
    }

    void createCertificatePreview();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [stage, playerName]);

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

  /*
   * ================= GAME COMPLETED =================
   */
  if (stage === "complete") {
    return (
      <main className="monument-page min-h-screen w-full px-4 py-10">
        <section className="heritage-panel mx-auto max-w-5xl p-8 text-center md:p-12 print:p-0 print:border-0 print:bg-white">

          <div className="mb-6 text-6xl">
            🎉
          </div>

          <p className="text-sm uppercase tracking-[0.35em] text-sandstone">
            Heritage Conquest
          </p>

          <h1 className="mt-4 text-4xl text-glow-gold md:text-5xl">
            Game Successfully Completed!
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Congratulations,{" "}
            <span className="font-bold text-primary">
              {playerName}
            </span>
            !
            You have successfully completed the
            Heritage Conquest adventure and restored
            the timeline.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="text-3xl">🏛️</div>
              <p className="mt-2 font-semibold">
                10 Monuments
              </p>
              <p className="text-sm text-muted-foreground">
                Successfully explored
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="text-3xl">💎</div>
              <p className="mt-2 font-semibold">
                10 Time Crystals
              </p>
              <p className="text-sm text-muted-foreground">
                Timeline restored
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="text-3xl">🎖️</div>
              <p className="mt-2 font-semibold">
                10 Badges
              </p>
              <p className="text-sm text-muted-foreground">
                Achievements unlocked
              </p>
            </div>
          </div>

          {/* ================= CERTIFICATE ================= */}

          <div
            id="heritage-certificate"
            className="relative mx-auto mt-10 w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl print:mt-0 print:max-w-none print:rounded-none print:shadow-none"
            style={{
              aspectRatio: "1600 / 1100",
            }}
          >
            {certificatePreviewUrl ? (
              <img
                src={certificatePreviewUrl}
                alt={`Heritage Conquest Certificate for ${playerName}`}
                className="absolute inset-0 h-full w-full object-fill"
              />
            ) : (
              <div
                className="absolute inset-0 bg-[#f7ead0]"
                aria-label="Loading certificate preview"
              />
            )}
          </div>

          {/* ================= DOWNLOAD BUTTONS ================= */}

          <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">

            <button
              type="button"
              onClick={downloadCertificatePNG}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              🖼️ Download Certificate PNG
            </button>

            <button
              type="button"
              onClick={downloadCertificatePDF}
              className="rounded-lg border border-primary/50 px-6 py-3 font-semibold text-primary transition hover:bg-primary/10"
            >
              📄 Download Certificate PDF
            </button>

            <Link
              to="/map"
              className="rounded-lg border border-input px-6 py-3 font-semibold transition hover:text-primary"
            >
              🗺️ Back to Map
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground print:hidden">
            Your personalized certificate can be downloaded as PNG or PDF.
          </p>
        </section>
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
              <button
                type="button"
                onClick={handleRewardContinue}
                disabled={saving}
                className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                🔓 Next: {next.name}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRewardContinue}
                disabled={saving}
                className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                🎉 Complete Heritage Conquest
              </button>
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

/*
 * Escape characters that could break the certificate SVG.
 */
function escapeXML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/*
 * Make a safe filename for certificate downloads.
 */
function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "young-historian";
}
