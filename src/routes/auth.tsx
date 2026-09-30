import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Heritage Conquest" },
      {
        name: "description",
        content:
          "Log in or create your explorer account to unlock India's monuments, minigames and time crystals.",
      },
      { property: "og:title", content: "Sign In — Heritage Conquest" },
      {
        property: "og:description",
        content: "Create your explorer account and begin the heritage quest across India.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) void navigate({ to: "/" });
  }, [loading, user, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName || email.split("@")[0]);
        setMessage("Account created. Loading your quest…");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    setBusy(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="heritage-panel w-full max-w-md p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-sandstone">Heritage Conquest</p>
        <h1 className="mt-3 text-3xl text-glow-gold">
          {mode === "login" ? "Explorer Login" : "Create Explorer"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ten monuments, ten minigames, one time machine. Your points, crystals and badges are
          saved to your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {mode === "register" && (
            <label className="block text-sm">
              <span className="text-muted-foreground">Explorer name</span>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Rani of Jhansi"
                className="mt-1 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </label>
          )}
          <label className="block text-sm">
            <span className="text-muted-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-primary">{message}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "login" ? "Enter the quest" : "Register"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError(null);
            setMessage(null);
          }}
          className="mt-5 w-full text-sm text-sandstone underline-offset-4 hover:underline"
        >
          {mode === "login" ? "New here? Create an account" : "Already registered? Log in"}
        </button>

        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-primary">
          Back to main menu
        </Link>
      </div>
    </main>
  );
}