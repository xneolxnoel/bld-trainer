"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw, Trophy, Eye, EyeOff } from "lucide-react";
import { getEdgeLetters, getCornerLetters, FACE_COLORS, FACE_NAMES, type StickerLetter } from "@/lib/speffz";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useProgressStore } from "@/stores/progressStore";

interface LetterSchemeQuizProps {
  type: "edge" | "corner";
}

// Positions on a 3x3 face grid:
// 0 1 2
// 3 4 5
// 6 7 8
const EDGE_POSITIONS = [1, 3, 5, 7];

export default function LetterSchemeQuiz({ type }: LetterSchemeQuizProps) {
  const [mode, setMode] = useState<"learn" | "quiz">("learn");
  const [showLetters, setShowLetters] = useState(true);
  const [activeSticker, setActiveSticker] = useState<StickerLetter | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [quizQueue, setQuizQueue] = useState<StickerLetter[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const { markLessonComplete } = useProgressStore();

  const allStickers = type === "edge" ? getEdgeLetters() : getCornerLetters();

  const startQuiz = useCallback(() => {
    const shuffled = [...allStickers].sort(() => Math.random() - 0.5);
    setQuizQueue(shuffled.slice(0, 12));
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
    setMode("quiz");
    setActiveSticker(shuffled[0]);
    setInput("");
    setFeedback(null);
    setShowLetters(false);
  }, [allStickers]);

  const backToLearn = () => {
    setMode("learn");
    setShowLetters(true);
    setActiveSticker(null);
    setInput("");
    setFeedback(null);
  };

  const checkAnswer = (value: string) => {
    const target = quizQueue[currentIndex];
    if (!target) return;

    const isCorrect = value.toUpperCase() === target.letter;
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentIndex + 1 >= quizQueue.length) {
        setQuizFinished(true);
        const finalScore = isCorrect ? score + 1 : score;
        if (finalScore >= quizQueue.length * 0.8) {
          markLessonComplete("letters", finalScore);
        }
      } else {
        setCurrentIndex((i) => i + 1);
        setActiveSticker(quizQueue[currentIndex + 1]);
        setInput("");
        setFeedback(null);
      }
    }, 600);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length === 1) {
      checkAnswer(value);
    }
  };

  const getStickerByPosition = (face: string, position: number) => {
    return allStickers.find((s) => s.face === face && s.position === position);
  };

  const isEdgePosition = (position: number) => EDGE_POSITIONS.includes(position);

  const renderFace = (face: keyof typeof FACE_NAMES) => {
    return (
      <div
        key={face}
        className="relative w-32 h-32 rounded-2xl border-4 border-gray-800 shadow-lg overflow-hidden"
        style={{ backgroundColor: FACE_COLORS[face] }}
      >
        <span className="absolute top-1 left-2 text-xs font-black text-black/40 uppercase">{face}</span>
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((position) => {
            const sticker = getStickerByPosition(face, position);
            const isCenter = position === 4;
            const isActive = activeSticker?.letter === sticker?.letter;

            if (isCenter) {
              return (
                <div
                  key={position}
                  className="flex items-center justify-center rounded-md bg-black/5"
                />
              );
            }

            const isEdge = isEdgePosition(position);
            const showLetter = mode === "learn" ? showLetters : false;

            return (
              <button
                key={position}
                onClick={() => {
                  if (sticker) {
                    setActiveSticker(sticker);
                    setMode("learn");
                    setInput("");
                    setFeedback(null);
                  }
                }}
                disabled={!sticker}
                className={`
                  flex items-center justify-center text-xs font-black transition-all
                  ${isEdge ? "rounded-md" : "rounded-full"}
                  ${isActive ? "ring-2 ring-accent scale-110 z-10 bg-white/95 text-foreground" : ""}
                  ${!isActive && showLetter ? "bg-white/85 text-foreground hover:bg-white" : ""}
                  ${!isActive && !showLetter ? "bg-black/10 text-black/30 hover:bg-white/60" : ""}
                  ${!sticker ? "invisible" : ""}
                `}
                title={sticker ? `${FACE_NAMES[face]} ${type} ${sticker.letter}` : undefined}
              >
                {showLetter && sticker ? sticker.letter : ""}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Badge color="primary">{type === "edge" ? "Edge Letters" : "Corner Letters"}</Badge>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="w-4 h-4 rounded-md bg-black/10 border border-black/20 inline-block" />
          <span>Edge position</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="w-4 h-4 rounded-full bg-black/10 border border-black/20 inline-block" />
          <span>Corner position</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cube net */}
        <Card className="bg-gradient-to-br from-muted to-background">
          <div className="grid grid-cols-4 gap-2 place-items-center">
            <div className="col-start-2">{renderFace("U")}</div>
            {renderFace("L")}
            {renderFace("F")}
            {renderFace("R")}
            {renderFace("B")}
            <div className="col-start-2">{renderFace("D")}</div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === "learn"
              ? "All letters are shown. Click a sticker to see its details, or hide letters to test yourself."
              : "Find the letter for the highlighted sticker."}
          </p>
        </Card>

        {/* Control panel */}
        <div className="flex-1 w-full space-y-4">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between mb-4">
              <Badge color="primary">{mode === "learn" ? "Learn Mode" : "Quiz Mode"}</Badge>
              {mode === "quiz" && !quizFinished && (
                <span className="text-sm font-bold text-muted-foreground">
                  {currentIndex + 1} / {quizQueue.length}
                </span>
              )}
            </div>

            {mode === "learn" ? (
              <div className="space-y-4">
                <div className="text-center py-6">
                  {activeSticker ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-2">
                        {FACE_NAMES[activeSticker.face]} {type} — position {activeSticker.position + 1}
                      </p>
                      <div className="text-6xl font-black text-primary mb-2">{activeSticker.letter}</div>
                      <p className="text-muted-foreground">
                        {isEdgePosition(activeSticker.position)
                          ? "This is an edge sticker (square marker)."
                          : "This is a corner sticker (circle marker)."}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Click any sticker on the cube net for details.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowLetters((s) => !s)}
                    className="flex-1"
                  >
                    {showLetters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showLetters ? "Hide Letters" : "Show Letters"}
                  </Button>
                  <Button onClick={startQuiz} className="flex-1">
                    Start {type === "edge" ? "Edge" : "Corner"} Quiz
                  </Button>
                </div>
              </div>
            ) : quizFinished ? (
              <div className="text-center py-8 space-y-4">
                <Trophy className="w-16 h-16 text-accent mx-auto" />
                <h3 className="text-2xl font-black">Quiz Complete!</h3>
                <p className="text-4xl font-black text-primary">
                  {score} / {quizQueue.length}
                </p>
                {score >= quizQueue.length * 0.8 ? (
                  <Badge color="success">Great job! Progress saved.</Badge>
                ) : (
                  <Badge color="warning">Keep practicing!</Badge>
                )}
                <div className="flex gap-2 justify-center">
                  <Button onClick={startQuiz}>
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={backToLearn}>
                    Back to Learn
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  What letter is the highlighted {type}?
                </p>
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    maxLength={1}
                    autoFocus
                    className={`
                      w-24 h-24 text-center text-5xl font-black rounded-2xl border-4
                      focus:outline-none focus:ring-4 focus:ring-primary/30 uppercase
                      transition-colors
                      ${feedback === "correct" ? "border-success bg-green-50 text-success" : ""}
                      ${feedback === "wrong" ? "border-error bg-red-50 text-error" : ""}
                      ${!feedback ? "border-border bg-card text-foreground" : ""}
                    `}
                  />
                </div>
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center"
                    >
                      {feedback === "correct" ? (
                        <Badge color="success"><Check className="w-4 h-4 mr-1" /> Correct!</Badge>
                      ) : (
                        <Badge color="error"><X className="w-4 h-4 mr-1" /> It was {quizQueue[currentIndex]?.letter}</Badge>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button variant="ghost" onClick={backToLearn} className="w-full">
                  Back to Learn Mode
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
