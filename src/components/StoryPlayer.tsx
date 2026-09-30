import { useState } from "react";

type StoryScene = {
  image: string;
  caption: string;
};

type MonumentStory = {
  title: string;
  scenes: StoryScene[];
};

type StoryPlayerProps = {
  story: MonumentStory;
  onComplete: () => void;
};

export default function StoryPlayer({
  story,
  onComplete,
}: StoryPlayerProps) {
  const [currentScene, setCurrentScene] = useState(0);

  // Safety check so TypeScript knows the scene exists
  const scene = story.scenes[currentScene];

  if (!scene) {
    return null;
  }

  const isLastScene =
    currentScene === story.scenes.length - 1;

  const nextScene = () => {
    if (isLastScene) {
      onComplete();
    } else {
      setCurrentScene((prev) => prev + 1);
    }
  };

  const previousScene = () => {
    if (currentScene > 0) {
      setCurrentScene((prev) => prev - 1);
    }
  };

  return (
    <section className="heritage-panel mt-8 w-full overflow-hidden p-6">

      <h2 className="mb-4 text-xl text-glow-gold">
        📖 {story.title}
      </h2>

      {/* ================= IMAGE ================= */}

      <div className="relative overflow-hidden rounded-xl border border-border bg-black">
        <img
          src={scene.image}
          alt={`${story.title} scene ${currentScene + 1}`}
          className="aspect-video w-full object-cover"
        />
      </div>

      {/* ================= CAPTION ================= */}

      <div className="mt-5 rounded-xl border border-border bg-black/30 p-5">
        <p className="text-center text-base leading-relaxed">
          {scene.caption}
        </p>
      </div>

      {/* ================= CONTROLS ================= */}

      <div className="mt-5 flex items-center justify-between gap-4">

        <button
          onClick={previousScene}
          disabled={currentScene === 0}
          className="rounded-lg border border-border px-4 py-2 disabled:opacity-40"
        >
          ← Back
        </button>

        <span className="text-sm text-muted-foreground">
          Scene {currentScene + 1} / {story.scenes.length}
        </span>

        <button
          onClick={nextScene}
          className="rounded-lg bg-primary px-5 py-2 text-primary-foreground"
        >
          {isLastScene
            ? "Start Minigame →"
            : "Next →"}
        </button>

      </div>

      {/* ================= SCENE DOTS ================= */}

      <div className="mt-4 flex justify-center gap-1.5">
        {story.scenes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentScene(index)}
            className={`h-2 w-2 rounded-full ${
              index === currentScene
                ? "bg-primary"
                : "bg-muted"
            }`}
            aria-label={`Go to scene ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}