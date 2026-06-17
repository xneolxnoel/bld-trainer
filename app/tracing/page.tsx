"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Route, Play, RotateCcw, Check } from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useProgressStore } from "@/stores/progressStore";
import PageTitle from "@/components/layout/PageTitle";

// A pre-traced example so the lesson can walk a learner through a real chain
// without requiring them to first follow the procedure cold.
const EDGE_EXAMPLE = {
  scramble: "Example trace",
  chain: [
    { letter: "B", explain: "Read the sticker at the buffer (UF). Suppose it shows the letter B — that's your first target. Say B." },
    { letter: "M", explain: "Jump to position B (UR). Read the sticker there. Say its letter — M in this example." },
    { letter: "F", explain: "Jump to position M (the D-sticker of DF). Read the letter there: F." },
    { letter: "K", explain: "Jump to position F (the R-sticker of UR). Read the letter there: K." },
    { letter: "C", explain: "Jump to position K (the F-sticker of DF). The letter there is C — a buffer letter. The cycle closes." },
  ],
  totalTargets: 4,
  parity: false,
};

const QUIZ = {
  prompt:
    "You start at the buffer and read the sticker A. You jump to A and read X. You jump to X and read Q. You jump to Q and read C. How many edge targets did you say before the cycle closed?",
  options: ["1", "2", "3", "4"],
  answer: "3",
  reason: "A, X, Q — three targets. C is the buffer letter, which marks the cycle's end and isn't shouted.",
};

export default function TracingPage() {
  const [step, setStep] = useState(0);
  const [quizPick, setQuizPick] = useState<string | null>(null);
  const visitLesson = useProgressStore((s) => s.visitLesson);

  useEffect(() => {
    visitLesson("tracing");
  }, [visitLesson]);

  const reset = () => setStep(0);
  const next = () => setStep((s) => Math.min(s + 1, EDGE_EXAMPLE.chain.length));

  const revealed = EDGE_EXAMPLE.chain.slice(0, step);
  const current = EDGE_EXAMPLE.chain[step];
  const done = step >= EDGE_EXAMPLE.chain.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageTitle title="Tracing" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <Badge color="secondary" className="mb-4">
            <Route className="w-3 h-3 mr-1" /> Lesson 2
          </Badge>
          <h1 className="text-4xl font-black mb-4">Tracing the Cube</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Before you can solve a cube blindfolded, you need a way to convert the scrambled state into
            a sequence of letters. That&apos;s <strong>tracing</strong>. Master this and the rest of BLD is
            just executing algorithms.
          </p>
        </div>

        {/* The procedure */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">The Procedure</h2>
          <p className="text-muted-foreground mb-4">
            Tracing is a single rule applied over and over: <strong>read the sticker at the buffer,
            say its letter, then jump to the position that letter names</strong>. Repeat until the
            cycle closes.
          </p>
          <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
            <li>
              <strong className="text-foreground">Look at the buffer.</strong> For edges, that&apos;s
              the sticker on top of the UF piece (Speffz letter C).
            </li>
            <li>
              <strong className="text-foreground">Read the letter</strong> you see there in solved-cube
              terms — that letter is your first target. Say it out loud.
            </li>
            <li>
              <strong className="text-foreground">Jump to that letter&apos;s home position</strong> and
              read the sticker now sitting there. That&apos;s your next target.
            </li>
            <li>
              <strong className="text-foreground">Repeat</strong> until you read a buffer letter (C or I
              for edges). The cycle has closed.
            </li>
            <li>
              <strong className="text-foreground">If pieces remain unsolved</strong>, pick any of them
              and start a new cycle from one of its stickers — see Cycle Breaking below.
            </li>
          </ol>
        </Card>

        {/* Worked example */}
        <Card className="mb-8 bg-gradient-to-br from-secondary/5 to-background">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Worked Example — Edges</h2>
              <p className="text-muted-foreground">
                A short scramble whose edges form a single 4-target cycle.
              </p>
            </div>
            <Badge color="muted">{EDGE_EXAMPLE.scramble}</Badge>
          </div>

          {/* Chain visualization */}
          <div className="flex flex-wrap items-center gap-2 mb-4 min-h-[5rem]">
            <AnimatePresence>
              {revealed.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg ${
                      step.letter === "C" || step.letter === "I"
                        ? "bg-gradient-to-br from-muted-foreground to-foreground"
                        : "bg-gradient-to-br from-primary to-secondary"
                    }`}
                  >
                    {step.letter}
                  </div>
                  {i < revealed.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {!done && current && (
              <motion.div
                key={`prompt-${step}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-2 px-3 py-2 rounded-xl border-2 border-dashed border-primary/40 text-primary font-bold"
              >
                Next: read at {step === 0 ? "buffer (UF)" : `position ${revealed[revealed.length - 1]?.letter}`}
              </motion.div>
            )}
          </div>

          {/* Step explanation */}
          <div className="p-4 rounded-2xl bg-card border-2 border-border mb-4 min-h-[5rem]">
            {!done && current ? (
              <p className="text-muted-foreground">
                <strong className="text-foreground">Step {step + 1}:</strong> {current.explain}
              </p>
            ) : done ? (
              <div className="space-y-2">
                <p className="text-foreground font-bold">
                  Final chain: {EDGE_EXAMPLE.chain.slice(0, -1).map((s) => s.letter).join(" ")}
                </p>
                <p className="text-muted-foreground text-sm">
                  Edge target count: {EDGE_EXAMPLE.totalTargets} —{" "}
                  {EDGE_EXAMPLE.parity ? (
                    <span className="text-warning font-bold">odd, parity required</span>
                  ) : (
                    <span className="text-success font-bold">even, no parity</span>
                  )}
                  .
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Click <strong>Next Step</strong> to begin tracing.</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={next} disabled={done}>
              <Play className="w-4 h-4" /> Next Step
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
          </div>
        </Card>

        {/* Cycle breaking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <h2 className="text-xl font-bold mb-4">Cycle Breaking</h2>
            <p className="text-muted-foreground mb-3">
              Sometimes a cycle closes before all pieces are solved. The buffer piece reaches its home
              and you&apos;re &ldquo;stuck.&rdquo; You break into a new cycle by picking any unsolved
              piece and starting from one of its stickers.
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc list-inside">
              <li>
                <strong className="text-foreground">Closure signal:</strong> you read a buffer letter
                (C or I for edges, A/R/U for corners).
              </li>
              <li>
                <strong className="text-foreground">New cycle:</strong> pick any unsolved piece, write
                down its sticker letter as a fresh target, and continue tracing from there.
              </li>
              <li>
                <strong className="text-foreground">Solved pieces</strong> never get visited and never
                appear in your chain.
              </li>
            </ul>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-yellow-50">
            <h2 className="text-xl font-bold mb-2">Parity Check</h2>
            <p className="text-muted-foreground mb-3">
              Once edge tracing is done, count your total edge targets. The cube&apos;s permutation
              parity constrains this number — and tells you whether to apply the parity algorithm.
            </p>
            <div className="p-3 rounded-xl bg-card border-2 border-border text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Odd number of edge targets</strong> → apply{" "}
                <Link href="/parity" className="text-primary font-bold hover:underline">
                  the parity alg
                </Link>{" "}
                between edges and corners.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong className="text-foreground">Even number of edge targets</strong> → no parity,
                just go straight to corners.
              </p>
            </div>
          </Card>
        </div>

        {/* Mini quiz */}
        <Card className="mb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h2 className="text-xl font-bold mb-2">Quick Check</h2>
          <p className="text-muted-foreground mb-4">{QUIZ.prompt}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {QUIZ.options.map((opt) => {
              const isPicked = quizPick === opt;
              const isCorrect = quizPick !== null && opt === QUIZ.answer;
              const isWrongPick = isPicked && opt !== QUIZ.answer;
              return (
                <button
                  key={opt}
                  onClick={() => setQuizPick(opt)}
                  className={`px-5 py-3 rounded-2xl border-2 font-bold transition-colors ${
                    isCorrect
                      ? "bg-success/10 border-success text-success"
                      : isWrongPick
                      ? "bg-error/10 border-error text-error"
                      : "bg-card border-border hover:border-primary"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {quizPick !== null && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl border-2 text-sm ${
                quizPick === QUIZ.answer
                  ? "bg-success/5 border-success/30 text-foreground"
                  : "bg-error/5 border-error/30 text-foreground"
              }`}
            >
              <span className="font-bold inline-flex items-center gap-1 mr-2">
                <Check className="w-4 h-4" />
                {quizPick === QUIZ.answer ? "Correct." : `Not quite — the answer is ${QUIZ.answer}.`}
              </span>
              {QUIZ.reason}
            </motion.div>
          )}
        </Card>

        <div className="flex justify-end">
          <Link href="/edges">
            <Button size="lg">
              Next: Edge Solving
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
