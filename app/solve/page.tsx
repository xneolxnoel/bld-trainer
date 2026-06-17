"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Shuffle, Play, RotateCcw, Eye, EyeOff, Check, X } from "lucide-react";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { generateScramble, formatTime } from "@/lib/cube-utils";
import { applyScramble, trace } from "@/lib/cube-state";
import { useProgressStore } from "@/stores/progressStore";
import PageTitle from "@/components/layout/PageTitle";

const CubePlayer = dynamic(() => import("@/components/cube/CubePlayer"), { ssr: false });

type Phase = "setup" | "memo" | "recall" | "result";

function normalizeLetters(input: string): string {
  return input.toUpperCase().replace(/[^A-X]/g, "");
}

function scoreMemo(input: string, correct: string[]): { matched: number; total: number } {
  const total = correct.length;
  const userLetters = input.split("");
  let matched = 0;
  for (let i = 0; i < total; i++) {
    if (userLetters[i] === correct[i]) matched++;
  }
  return { matched, total };
}

export default function SolvePage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [scramble, setScramble] = useState<string>("");
  const [edgeMemo, setEdgeMemo] = useState<string>("");
  const [cornerMemo, setCornerMemo] = useState<string>("");
  const [memoElapsed, setMemoElapsed] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [scrambleError, setScrambleError] = useState<string | null>(null);

  const recordPracticeAttempt = useProgressStore((s) => s.recordPracticeAttempt);
  const practiceStats = useProgressStore((s) => s.practiceStats);

  const cubeState = useMemo(() => (scramble ? applyScramble(scramble) : null), [scramble]);
  const edgeTrace = useMemo(
    () => (cubeState ? trace(cubeState.edges, "edge") : null),
    [cubeState]
  );
  const cornerTrace = useMemo(
    () => (cubeState ? trace(cubeState.corners, "corner") : null),
    [cubeState]
  );

  // Live-update the elapsed memo time while we're in the memo phase.
  useEffect(() => {
    if (phase !== "memo") return;
    const start = performance.now();
    const id = setInterval(() => {
      setMemoElapsed(performance.now() - start);
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  const handleNewScramble = () => {
    setScrambleError(null);
    try {
      const next = generateScramble();
      setScramble(next);
      setEdgeMemo("");
      setCornerMemo("");
      setShowAnswer(false);
      setMemoElapsed(0);
      setPhase("setup");
    } catch {
      setScrambleError("Could not generate a scramble. Please try again.");
    }
  };

  const handleStartMemo = () => {
    setMemoElapsed(0);
    setPhase("memo");
  };

  const handleMemoDone = () => {
    setPhase("recall");
  };

  const handleSubmit = () => {
    const correct =
      !!edgeScore &&
      !!cornerScore &&
      edgeScore.matched === edgeScore.total &&
      cornerScore.matched === cornerScore.total;
    recordPracticeAttempt(correct, memoElapsed);
    setPhase("result");
  };

  const normalizedEdges = normalizeLetters(edgeMemo);
  const normalizedCorners = normalizeLetters(cornerMemo);
  const edgeScore = edgeTrace ? scoreMemo(normalizedEdges, edgeTrace.letters) : null;
  const cornerScore = cornerTrace ? scoreMemo(normalizedCorners, cornerTrace.letters) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageTitle title="Full-Solve Simulator" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <Badge color="primary" className="mb-4">
            <Timer className="w-3 h-3 mr-1" /> Full-Solve Simulator
          </Badge>
          <h1 className="text-4xl font-black mb-3">Solve a Scramble</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Generate a scramble, memorize the edge and corner letter sequences, then check your work
            against the computed trace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <div className="text-sm text-muted-foreground">Attempts</div>
            <div className="text-3xl font-black text-primary">{practiceStats.totalAttempts}</div>
          </Card>
          <Card>
            <div className="text-sm text-muted-foreground">Correct Memos</div>
            <div className="text-3xl font-black text-success">{practiceStats.correctMemos}</div>
          </Card>
          <Card>
            <div className="text-sm text-muted-foreground">Best Memo Time</div>
            <div className="text-3xl font-black text-secondary">
              {practiceStats.bestTimeMs !== null ? formatTime(practiceStats.bestTimeMs) : "--:--"}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cube + scramble */}
          <Card className="bg-gradient-to-br from-muted to-background">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Scrambled Cube</h2>
              <Button size="sm" variant="outline" onClick={handleNewScramble}>
                <Shuffle className="w-4 h-4" />
                {scramble ? "New Scramble" : "Generate"}
              </Button>
            </div>

            {scrambleError && (
              <div className="mb-4 p-3 rounded-xl bg-error/10 border-2 border-error/30 text-error text-sm">
                {scrambleError}
              </div>
            )}
            {scramble ? (
              <>
                <div className="p-3 mb-4 rounded-xl bg-card border-2 border-border font-mono text-sm break-words">
                  {scramble}
                </div>
                <div className="h-72 rounded-2xl overflow-hidden bg-card border-2 border-border">
                  <CubePlayer key={scramble} alg={scramble} controlPanel="bottom-row" />
                </div>
              </>
            ) : (
              <div className="h-72 rounded-2xl bg-card border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                Click <strong className="mx-1">Generate</strong> to start.
              </div>
            )}
          </Card>

          {/* Workflow panel */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {phase === "setup" && "Ready to Solve?"}
                {phase === "memo" && "Memo in Progress"}
                {phase === "recall" && "Recall Your Memo"}
                {phase === "result" && "Result"}
              </h2>
              <span className="font-mono font-black text-2xl text-primary">
                {formatTime(memoElapsed)}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {phase === "setup" && (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="text-muted-foreground">
                    Look at the scrambled cube on the left. When you&apos;re ready to start memo,
                    click below — the timer will run while you trace.
                  </p>
                  <Button onClick={handleStartMemo} size="lg" disabled={!scramble} className="w-full">
                    <Play className="w-5 h-5" />
                    Start Memo
                  </Button>
                </motion.div>
              )}

              {phase === "memo" && (
                <motion.div
                  key="memo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="text-muted-foreground">
                    Memorize edges and corners. When you have both memorized, stop the timer.
                  </p>
                  <Button onClick={handleMemoDone} size="lg" className="w-full">
                    <Check className="w-5 h-5" />
                    I&apos;m Done — Stop Memo
                  </Button>
                </motion.div>
              )}

              {phase === "recall" && (
                <motion.div
                  key="recall"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="text-muted-foreground text-sm">
                    Type your edge and corner sequences. Letters only, no spaces.
                  </p>
                  <div>
                    <label className="block text-sm font-bold mb-1">Edge memo</label>
                    <input
                      type="text"
                      value={edgeMemo}
                      onChange={(e) => setEdgeMemo(e.target.value.toUpperCase())}
                      placeholder="DABKJTL..."
                      className="w-full px-4 py-3 font-mono text-lg rounded-xl border-2 border-border bg-card focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 uppercase"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Corner memo</label>
                    <input
                      type="text"
                      value={cornerMemo}
                      onChange={(e) => setCornerMemo(e.target.value.toUpperCase())}
                      placeholder="JDLFI..."
                      className="w-full px-4 py-3 font-mono text-lg rounded-xl border-2 border-border bg-card focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 uppercase"
                    />
                  </div>
                  <Button onClick={handleSubmit} size="lg" className="w-full">
                    Check My Memo
                  </Button>
                </motion.div>
              )}

              {phase === "result" && edgeTrace && cornerTrace && edgeScore && cornerScore && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <ResultStat label="Edge accuracy" score={edgeScore} />
                    <ResultStat label="Corner accuracy" score={cornerScore} />
                  </div>
                  <div className="space-y-3">
                    <TraceCompare
                      label="Edges"
                      yours={normalizedEdges}
                      correct={edgeTrace.letters}
                      parity={edgeTrace.parity}
                      show={showAnswer}
                    />
                    <TraceCompare
                      label="Corners"
                      yours={normalizedCorners}
                      correct={cornerTrace.letters}
                      parity={false}
                      show={showAnswer}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAnswer((s) => !s)}
                      className="flex-1"
                    >
                      {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showAnswer ? "Hide" : "Reveal"} answer
                    </Button>
                    <Button onClick={handleNewScramble} className="flex-1">
                      <RotateCcw className="w-4 h-4" />
                      New Solve
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        <Card className="mt-6 bg-warning/5 border-warning/30">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Trace caveats:</strong> the simulator computes a
            valid Old Pochmann trace but picks alphabetically-first stickers at cycle breaks. Your
            own memo may use different cycle-break choices and still be valid — reveal the answer
            and compare structure rather than blindly matching letters.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

function ResultStat({ label, score }: { label: string; score: { matched: number; total: number } }) {
  const pct = score.total === 0 ? 100 : Math.round((score.matched / score.total) * 100);
  return (
    <div className="p-4 rounded-2xl bg-card border-2 border-border text-center">
      <div className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{label}</div>
      <div className="text-3xl font-black text-primary">{pct}%</div>
      <div className="text-xs text-muted-foreground">
        {score.matched} / {score.total}
      </div>
    </div>
  );
}

function TraceCompare({
  label,
  yours,
  correct,
  parity,
  show,
}: {
  label: string;
  yours: string;
  correct: string[];
  parity: boolean;
  show: boolean;
}) {
  return (
    <div className="p-3 rounded-xl bg-card border-2 border-border space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm">{label}</span>
        <div className="flex gap-2">
          {parity && <Badge color="warning">Parity</Badge>}
          <Badge color="muted">{correct.length} targets</Badge>
        </div>
      </div>
      <div className="font-mono text-sm">
        <span className="text-muted-foreground">Your memo: </span>
        <span className="font-bold">
          {correct.map((c, i) => {
            const userChar = yours[i];
            const match = userChar === c;
            return (
              <span
                key={i}
                className={
                  userChar === undefined
                    ? "text-muted-foreground"
                    : match
                    ? "text-success"
                    : "text-error"
                }
              >
                {userChar ?? "•"}
                {userChar !== undefined && !match && <X className="inline w-3 h-3" />}
              </span>
            );
          })}
          {yours.length > correct.length && (
            <span className="text-error">…{yours.slice(correct.length)}</span>
          )}
        </span>
      </div>
      {show && (
        <div className="font-mono text-sm">
          <span className="text-muted-foreground">Correct: </span>
          <span className="font-bold text-primary">{correct.join("")}</span>
        </div>
      )}
    </div>
  );
}
