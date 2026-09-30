import { useEffect, useRef, useState } from "react";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/background.mp3");

    audio.loop = true;
    audio.volume = 0.25;
    audio.preload = "auto";

    audioRef.current = audio;

    const startMusic = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        // Browser blocked autoplay.
        // Music will start after the user clicks the button.
        setPlaying(false);
      }
    };

    startMusic();

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch (error) {
        console.error("Could not play background music:", error);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleMusic}
      className="fixed bottom-5 right-5 z-[9999] rounded-full border border-primary/40 bg-black/70 px-4 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-black/90"
      title={playing ? "Mute music" : "Play music"}
    >
      {playing ? "🔊 Music" : "🔇 Music"}
    </button>
  );
}