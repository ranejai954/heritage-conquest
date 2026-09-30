import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/quiz-demo")({
  component: QuizDemo,
});

type Question = {
  question: string;
  options: string[];
  answer: number;
};

type MonumentQuiz = {
  name: string;
  questions: Question[];
};

const QUIZZES: MonumentQuiz[] = [
  {
    name: "Taj Mahal",
    questions: [
      {
        question: "In which city is the Taj Mahal located?",
        options: ["Delhi", "Agra", "Jaipur", "Lucknow"],
        answer: 1,
      },
      {
        question: "Who commissioned the Taj Mahal?",
        options: [
          "Akbar",
          "Aurangzeb",
          "Shah Jahan",
          "Humayun",
        ],
        answer: 2,
      },
      {
        question: "The Taj Mahal was primarily built as a:",
        options: [
          "Fort",
          "Palace",
          "Tomb",
          "Temple",
        ],
        answer: 2,
      },
      {
        question: "The Taj Mahal is located on the banks of which river?",
        options: ["Ganga", "Yamuna", "Godavari", "Narmada"],
        answer: 1,
      },
      {
        question: "The Taj Mahal is mainly constructed using:",
        options: [
          "Red sandstone",
          "Black granite",
          "White marble",
          "Wood",
        ],
        answer: 2,
      },
    ],
  },

  {
    name: "Red Fort",
    questions: [
      {
        question: "Where is the Red Fort located?",
        options: ["Delhi", "Mumbai", "Agra", "Hyderabad"],
        answer: 0,
      },
      {
        question: "Who commissioned the Red Fort?",
        options: [
          "Shah Jahan",
          "Akbar",
          "Babur",
          "Jahangir",
        ],
        answer: 0,
      },
      {
        question: "The Red Fort was built primarily using:",
        options: [
          "White marble",
          "Red sandstone",
          "Granite",
          "Limestone",
        ],
        answer: 1,
      },
      {
        question: "The Red Fort is associated mainly with which dynasty?",
        options: [
          "Maurya",
          "Mughal",
          "Chola",
          "Gupta",
        ],
        answer: 1,
      },
      {
        question: "The Red Fort is located in which part of Delhi?",
        options: [
          "Old Delhi",
          "South Delhi",
          "New Delhi",
          "Dwarka",
        ],
        answer: 0,
      },
    ],
  },

  {
    name: "Gateway of India",
    questions: [
      {
        question: "Where is the Gateway of India located?",
        options: ["Mumbai", "Pune", "Delhi", "Kolkata"],
        answer: 0,
      },
      {
        question: "The Gateway of India faces which body of water?",
        options: [
          "Bay of Bengal",
          "Arabian Sea",
          "Indian Ocean",
          "Gulf of Mannar",
        ],
        answer: 1,
      },
      {
        question: "The Gateway of India was built during the period of:",
        options: [
          "British rule",
          "Mughal rule",
          "Mauryan rule",
          "Maratha rule",
        ],
        answer: 0,
      },
      {
        question: "The monument was built to commemorate the visit of:",
        options: [
          "Queen Victoria",
          "King George V and Queen Mary",
          "Winston Churchill",
          "Prince Charles",
        ],
        answer: 1,
      },
      {
        question: "The Gateway of India is located near:",
        options: [
          "Marine Drive",
          "Colaba",
          "Bandra",
          "Dadar",
        ],
        answer: 1,
      },
    ],
  },

  {
    name: "Qutub Minar",
    questions: [
      {
        question: "Where is Qutub Minar located?",
        options: ["Delhi", "Agra", "Jaipur", "Bhopal"],
        answer: 0,
      },
      {
        question: "Qutub Minar is primarily a:",
        options: [
          "Fort",
          "Minaret",
          "Palace",
          "Temple",
        ],
        answer: 1,
      },
      {
        question: "Who started the construction of Qutub Minar?",
        options: [
          "Qutb-ud-din Aibak",
          "Shah Jahan",
          "Akbar",
          "Sher Shah Suri",
        ],
        answer: 0,
      },
      {
        question: "Qutub Minar is part of the:",
        options: [
          "Qutub complex",
          "Red Fort complex",
          "Agra Fort complex",
          "Lalbagh complex",
        ],
        answer: 0,
      },
      {
        question: "Qutub Minar is primarily constructed from:",
        options: [
          "Red sandstone and marble",
          "Wood",
          "Granite only",
          "Brick only",
        ],
        answer: 0,
      },
    ],
  },

  {
    name: "Ajanta Caves",
    questions: [
      {
        question: "The Ajanta Caves are located in which state?",
        options: [
          "Maharashtra",
          "Rajasthan",
          "Gujarat",
          "Madhya Pradesh",
        ],
        answer: 0,
      },
      {
        question: "The Ajanta Caves are famous mainly for their:",
        options: [
          "Mughal gardens",
          "Buddhist paintings and sculptures",
          "Royal palaces",
          "Fortifications",
        ],
        answer: 1,
      },
      {
        question: "The Ajanta Caves are primarily associated with:",
        options: [
          "Buddhism",
          "Jainism",
          "Sikhism",
          "Zoroastrianism",
        ],
        answer: 0,
      },
      {
        question: "The caves were mainly carved into:",
        options: [
          "Granite",
          "Basalt rock",
          "Marble",
          "Sandstone",
        ],
        answer: 1,
      },
      {
        question: "Ajanta is located near which city?",
        options: [
          "Aurangabad",
          "Nashik",
          "Nagpur",
          "Kolhapur",
        ],
        answer: 0,
      },
    ],
  },

  {
    name: "Ellora Caves",
    questions: [
      {
        question: "The Ellora Caves are located in which state?",
        options: [
          "Maharashtra",
          "Karnataka",
          "Tamil Nadu",
          "Kerala",
        ],
        answer: 0,
      },
      {
        question: "Ellora is notable because it contains monuments associated with:",
        options: [
          "Only Buddhism",
          "Only Hinduism",
          "Buddhism, Hinduism and Jainism",
          "Only Jainism",
        ],
        answer: 2,
      },
      {
        question: "Which famous temple is located at Ellora?",
        options: [
          "Kailasa Temple",
          "Sun Temple",
          "Golden Temple",
          "Meenakshi Temple",
        ],
        answer: 0,
      },
      {
        question: "The Kailasa Temple is primarily dedicated to:",
        options: [
          "Vishnu",
          "Shiva",
          "Buddha",
          "Mahavira",
        ],
        answer: 1,
      },
      {
        question: "Ellora is located near:",
        options: [
          "Chennai",
          "Aurangabad",
          "Delhi",
          "Kolkata",
        ],
        answer: 1,
      },
    ],
  },

  {
    name: "Hampi",
    questions: [
      {
        question: "Hampi is located in which state?",
        options: [
          "Karnataka",
          "Maharashtra",
          "Telangana",
          "Odisha",
        ],
        answer: 0,
      },
      {
        question: "Hampi was the capital of which empire?",
        options: [
          "Maurya Empire",
          "Vijayanagara Empire",
          "Mughal Empire",
          "Gupta Empire",
        ],
        answer: 1,
      },
      {
        question: "Hampi is situated on the banks of which river?",
        options: [
          "Tungabhadra",
          "Yamuna",
          "Ganga",
          "Krishna",
        ],
        answer: 0,
      },
      {
        question: "Hampi is famous for its:",
        options: [
          "Ancient ruins and temples",
          "Modern skyscrapers",
          "Colonial railway stations",
          "Buddhist stupas",
        ],
        answer: 0,
      },
      {
        question: "Hampi is recognized as a:",
        options: [
          "UNESCO World Heritage Site",
          "Modern industrial zone",
          "National capital",
          "Military base",
        ],
        answer: 0,
      },
    ],
  },

  {
    name: "Konark Sun Temple",
    questions: [
      {
        question: "The Konark Sun Temple is located in which state?",
        options: [
          "Odisha",
          "West Bengal",
          "Bihar",
          "Assam",
        ],
        answer: 0,
      },
      {
        question: "The temple is dedicated to which deity?",
        options: [
          "Shiva",
          "Vishnu",
          "Surya",
          "Brahma",
        ],
        answer: 2,
      },
      {
        question: "The temple is designed in the form of a:",
        options: [
          "Ship",
          "Chariot",
          "Fort",
          "Lotus",
        ],
        answer: 1,
      },
      {
        question: "The Konark Sun Temple was built during the reign of:",
        options: [
          "Narasimhadeva I",
          "Ashoka",
          "Akbar",
          "Rajendra Chola",
        ],
        answer: 0,
      },
      {
        question: "Konark is located near which coast?",
        options: [
          "Odisha coast",
          "Malabar coast",
          "Konkan coast",
          "Coromandel coast",
        ],
        answer: 0,
      },
    ],
  },

  {
    name: "India Gate",
    questions: [
      {
        question: "India Gate is located in:",
        options: [
          "New Delhi",
          "Mumbai",
          "Kolkata",
          "Chennai",
        ],
        answer: 0,
      },
      {
        question: "India Gate primarily commemorates Indian soldiers who died in:",
        options: [
          "World War I and related conflicts",
          "The Battle of Plassey",
          "The Revolt of 1857",
          "The Kargil War",
        ],
        answer: 0,
      },
      {
        question: "India Gate was designed by:",
        options: [
          "Edwin Lutyens",
          "Le Corbusier",
          "Charles Correa",
          "Balkrishna Doshi",
        ],
        answer: 0,
      },
      {
        question: "India Gate is made primarily from:",
        options: [
          "Bharatpur sandstone",
          "White marble",
          "Granite",
          "Wood",
        ],
        answer: 0,
      },
      {
        question: "India Gate is located along:",
        options: [
          "Kartavya Path",
          "Marine Drive",
          "MG Road",
          "Rajpath Market",
        ],
        answer: 0,
      },
    ],
  },
];

function QuizDemo() {
  const [monumentIndex, setMonumentIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const monument = QUIZZES[monumentIndex];
  const question = monument.questions[questionIndex];

  const isLastQuestion =
    questionIndex === monument.questions.length - 1;

  function handleNext() {
    if (selectedAnswer === null) return;

    const correct =
      selectedAnswer === question.answer;

    if (correct) {
      setScore((prev) => prev + 1);
    }

    if (!isLastQuestion) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      return;
    }

    // Last question of this monument
    if (monumentIndex === QUIZZES.length - 1) {
      setFinished(true);
      return;
    }

    // Move to next monument
    setMonumentIndex((prev) => prev + 1);
    setQuestionIndex(0);
    setSelectedAnswer(null);
  }

  function restart() {
    setMonumentIndex(0);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <section className="heritage-panel w-full max-w-2xl p-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-sandstone">
            Quiz Demo Complete
          </p>

          <h1 className="mt-4 text-4xl text-glow-gold">
            🏆 All Monuments Completed
          </h1>

          <p className="mt-5 text-lg text-muted-foreground">
            You completed all 9 monument quizzes.
          </p>

          <p className="mt-3 text-2xl text-primary">
            Total Score: {score} / 45
          </p>

          <button
            type="button"
            onClick={restart}
            className="mt-8 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Restart Quiz Demo
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <section className="mx-auto w-full max-w-3xl">

        {/* HEADER */}

        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-sandstone">
            Heritage Conquest
          </p>

          <h1 className="mt-3 text-4xl text-glow-gold">
            Optional Knowledge Challenge
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Monument {monumentIndex + 1} of {QUIZZES.length}
          </p>
        </div>

        {/* MONUMENT NAME */}

        <section className="heritage-panel mt-8 p-6">

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-sandstone">
                Current Monument
              </p>

              <h2 className="mt-2 text-2xl text-primary">
                {monument.name}
              </h2>
            </div>

            <div className="text-right text-sm text-muted-foreground">
              <p>
                Question {questionIndex + 1} /{" "}
                {monument.questions.length}
              </p>

              <p className="mt-1">
                Score: {score}
              </p>
            </div>
          </div>

          {/* PROGRESS */}

          <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${
                  ((questionIndex + 1) /
                    monument.questions.length) *
                  100
                }%`,
              }}
            />
          </div>

          {/* QUESTION */}

          <div className="mt-8">
            <h3 className="text-xl font-semibold leading-relaxed text-foreground">
              {question.question}
            </h3>

            <div className="mt-6 grid gap-3">
              {question.options.map((option, index) => {
                const selected =
                  selectedAnswer === index;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setSelectedAnswer(index)
                    }
                    className={`w-full rounded-xl border px-4 py-4 text-left transition ${
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

          {/* NEXT */}

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={selectedAnswer === null}
              onClick={handleNext}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLastQuestion
                ? monumentIndex === QUIZZES.length - 1
                  ? "Finish All Quizzes →"
                  : "Next Monument →"
                : "Next Question →"}
            </button>
          </div>

        </section>

      </section>
    </main>
  );
}