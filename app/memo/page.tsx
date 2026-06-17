"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dices, Brain, ArrowRight } from "lucide-react";
import { generateLetterPairs } from "@/lib/cube-utils";
import { useProgressStore } from "@/stores/progressStore";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import PageTitle from "@/components/layout/PageTitle";

export default function MemoPage() {
  const [count, setCount] = useState(8);
  const visitLesson = useProgressStore((s) => s.visitLesson);

  useEffect(() => {
    visitLesson("memo");
  }, [visitLesson]);


  const [type, setType] = useState<"edge" | "corner">("edge");
  const [pairs, setPairs] = useState<string[]>([]);
  const [phase, setPhase] = useState<"setup" | "memorize" | "recall" | "result">("setup");
  const [recallInput, setRecallInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const recordMemoSession = useProgressStore((s) => s.recordMemoSession);
  const memoStats = useProgressStore((s) => s.memoStats);

  const startSession = () => {
    const newPairs = generateLetterPairs(count, type);
    setPairs(newPairs);
    setPhase("memorize");
    setRecallInput("");
    setCorrectCount(0);
  };

  const handleRecallSubmit = () => {
    const cleaned = recallInput.toUpperCase().replace(/[^A-Z]/g, "");
    const chunks: string[] = [];
    for (let i = 0; i < cleaned.length; i += 2) {
      chunks.push(cleaned.slice(i, i + 2));
    }

    let correct = 0;
    pairs.forEach((pair, i) => {
      if (chunks[i] === pair) correct++;
    });

    setCorrectCount(correct);
    recordMemoSession(count, correct);
    setPhase("result");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <PageTitle title="Memory Gym" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 text-center">
          <Badge color="accent" className="mb-4"><Brain className="w-3 h-3 mr-1" /> Memory Gym</Badge>
          <h1 className="text-4xl font-black mb-4">Train Your Memory</h1>
          <p className="text-lg text-muted-foreground">
            Memorize letter pairs, hide them, then recall as many as you can. Start small and build up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <div className="text-sm text-muted-foreground">Sessions</div>
            <div className="text-3xl font-black text-primary">{memoStats.sessionsCompleted}</div>
          </Card>
          <Card>
            <div className="text-sm text-muted-foreground">Total Pairs</div>
            <div className="text-3xl font-black text-secondary">{memoStats.totalPairs}</div>
          </Card>
          <Card>
            <div className="text-sm text-muted-foreground">Correct Recalls</div>
            <div className="text-3xl font-black text-success">{memoStats.correctRecalls}</div>
          </Card>
        </div>

        <Card className="mb-8">
          {phase === "setup" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Session Setup</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Piece Type</label>
                  <div className="flex gap-2">
                    <Button
                      variant={type === "edge" ? "primary" : "outline"}
                      onClick={() => setType("edge")}
                      className="flex-1"
                    >
                      Edges
                    </Button>
                    <Button
                      variant={type === "corner" ? "primary" : "outline"}
                      onClick={() => setType("corner")}
                      className="flex-1"
                    >
                      Corners
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Number of Pairs: {count}</label>
                  <input
                    type="range"
                    min={4}
                    max={24}
                    step={2}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
              <Button onClick={startSession} size="lg" className="w-full">
                <Dices className="w-5 h-5" />
                Generate Pairs
              </Button>
            </div>
          )}

          {phase === "memorize" && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-bold">Memorize These Pairs</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {pairs.map((pair, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-black shadow-lg"
                  >
                    {pair}
                  </motion.div>
                ))}
              </div>
              <Button onClick={() => setPhase("recall")} size="lg">
                I&apos;m Ready — Hide Them
              </Button>
            </div>
          )}

          {phase === "recall" && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-bold">Recall the Pairs</h2>
              <p className="text-muted-foreground">
                Type all {count} pairs in order without spaces (e.g. ABCKDF...)
              </p>
              <input
                type="text"
                value={recallInput}
                onChange={(e) => setRecallInput(e.target.value.toUpperCase())}
                className="w-full max-w-lg mx-auto block px-4 py-4 text-2xl font-mono font-bold text-center rounded-2xl border-4 border-primary focus:outline-none focus:ring-4 focus:ring-primary/30 uppercase"
                placeholder="ABCK..."
                autoFocus
              />
              <Button onClick={handleRecallSubmit} size="lg">
                Check Answer
              </Button>
            </div>
          )}

          {phase === "result" && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-black">Result</h2>
              <div className="text-5xl font-black text-primary">
                {correctCount} / {count}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {pairs.map((pair, i) => {
                  const user = recallInput.toUpperCase().replace(/[^A-Z]/g, "").slice(i * 2, i * 2 + 2);
                  const isCorrect = user === pair;
                  return (
                    <div
                      key={i}
                      className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-lg ${
                        isCorrect ? "bg-success" : "bg-error"
                      }`}
                    >
                      <span className="text-xs opacity-80">{user || "--"}</span>
                      <span className="text-xl">{pair}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={startSession}>Try Again</Button>
                <Button variant="outline" onClick={() => setPhase("setup")}>Change Setup</Button>
              </div>
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          <Link href="/algs">
            <Button size="lg">
              Browse Algorithms
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
