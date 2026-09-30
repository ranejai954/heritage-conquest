import { useEffect, useState } from "react";

import type { QuizQuestion } from "@/lib/monumentQuizzes";

type MonumentQuizProps = {
  monumentName: string;
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  onSkip: () => void;
};

export function MonumentQuiz({
  monumentName,
  questions,
  onComplete,
  onSkip,
}: MonumentQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  /*
   * Reset the quiz whenever the monument or question set changes.
   */
  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
  }, [monumentName, questions]);

  /*
   * No quiz available.
   */
  if (!questions.length) {
    return (
      <section className="heritage-panel mt-8 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No quiz is available for this monument yet.
        </p>

        <button
          type="button"
          onClick={onSkip}
          className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          Continue
        </button>
      </section>
    );
  }

  /*
   * Safety check in case the question index somehow becomes invalid.
   */
  const question = questions[currentQuestion];

  if (!question) {
    return (
      <section className="heritage-panel mt-8 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Something went wrong loading the quiz.
        </p>

        <button
          type="button"
          onClick={onSkip}
          className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          Continue
        </button>
      </section>
    );
  }

  const isLastQuestion =
    currentQuestion === questions.length - 1;

  function handleNext() {
    if (selectedAnswer === null) {
      return;
    }

    const newScore =
      selectedAnswer === question.answer
        ? score + 1
        : score;

    if (isLastQuestion) {
      onComplete(newScore, questions.length);
      return;
    }

    setScore(newScore);
    setSelectedAnswer(null);
    setCurrentQuestion((prev) => prev + 1);
  }

  return (
    <section className="heritage-panel relative z-30 mt-8 overflow-hidden p-6 sm:p-8">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-sandstone">
            Optional Knowledge Challenge
          </p>

          <h2 className="mt-2 text-2xl text-glow-gold sm:text-3xl">
            {monumentName} Quiz
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Test what you learned from this monument.
          </p>
        </div>

        {/* PROGRESS */}
        <div className="mt-6 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>

          <span className="text-primary">
            Score: {score}
          </span>
        </div>

        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${
                ((currentQuestion + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />
        </div>

        {/* QUESTION */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
            {question.question}
          </h3>

          {/* OPTIONS */}
          <div className="mt-6 grid gap-3">
            {question.options.map((option, index) => {
              const selected =
                selectedAnswer === index;

              return (
                <button
                  key={`${currentQuestion}-${index}`}
                  type="button"
                  onClick={() =>
                    setSelectedAnswer(index)
                  }
                  className={`w-full rounded-xl border px-4 py-4 text-left text-sm transition ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 bg-black/20 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span className="mr-3 font-semibold text-primary">
                    {String.fromCharCode(65 + index)}.
                  </span>

                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">

          {/* SKIP */}
          <button
            type="button"
            onClick={onSkip}
            className="rounded-lg border border-border/50 bg-black/20 px-5 py-2.5 text-sm text-muted-foreground transition hover:border-primary/30 hover:text-primary"
          >
            Skip Quiz
          </button>

          {/* NEXT */}
          <button
            type="button"
            disabled={selectedAnswer === null}
            onClick={handleNext}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLastQuestion
              ? "Finish Quiz"
              : "Next Question →"}
          </button>
        </div>
      </div>
    </section>
  );
}