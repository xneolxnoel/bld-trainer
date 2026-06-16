"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import LetterSchemeQuiz from "@/components/quiz/LetterSchemeQuiz";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LettersPage() {
  const [quizType, setQuizType] = useState<"edge" | "corner">("edge");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <Badge color="primary" className="mb-4"><BookOpen className="w-3 h-3 mr-1" /> Lesson 1</Badge>
          <h1 className="text-4xl font-black mb-4">Letter Scheme</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Blind solving starts by giving every sticker a name. We use the{" "}
            <strong>Speffz</strong> letter scheme: each face gets letters A-H, and each sticker
            on that face gets one letter. During a solve, you memorize a chain of letters
            instead of colors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">How Speffz Works</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span>Each of the 6 faces is assigned letters A-H in clockwise order.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>Edges and corners share the same letter if they occupy the same position on a face.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span>We usually memorize edges as pairs of letters (e.g. AB, CK) and corners as pairs too.</span>
              </li>
            </ul>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-yellow-50">
            <h2 className="text-xl font-bold mb-2">Pro Tip</h2>
            <p className="text-muted-foreground">
              Turn letter pairs into words or images. "AB" could be "Ali Baba", "CK" could be "Cake".
              The sillier the image, the easier it is to remember.
            </p>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black">Interactive Trainer</h2>
            <div className="flex gap-2">
              <Button
                variant={quizType === "edge" ? "primary" : "outline"}
                size="sm"
                onClick={() => setQuizType("edge")}
              >
                Edges
              </Button>
              <Button
                variant={quizType === "corner" ? "primary" : "outline"}
                size="sm"
                onClick={() => setQuizType("corner")}
              >
                Corners
              </Button>
            </div>
          </div>
          <LetterSchemeQuiz type={quizType} key={quizType} />
        </div>

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
