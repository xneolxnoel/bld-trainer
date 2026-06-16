"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const roadmapSteps = [
  {
    slug: "letters",
    title: "Letter Scheme",
    description: "Memorize every sticker's letter using the Speffz system.",
    icon: "AB",
    color: "from-blue-400 to-blue-600",
    duration: "20 min",
  },
  {
    slug: "edges",
    title: "Edge Solving",
    description: "Learn the UF buffer and how to shoot edges with setup moves.",
    icon: "E",
    color: "from-green-400 to-green-600",
    duration: "40 min",
  },
  {
    slug: "corners",
    title: "Corner Solving",
    description: "Master the UBL buffer and corner 3-cycles.",
    icon: "C",
    color: "from-orange-400 to-orange-600",
    duration: "40 min",
  },
  {
    slug: "parity",
    title: "Parity",
    description: "Fix the special case when edges have an odd number of targets.",
    icon: "P",
    color: "from-purple-400 to-purple-600",
    duration: "15 min",
  },
  {
    slug: "memo",
    title: "Memory Gym",
    description: "Train your brain to remember long letter chains.",
    icon: "M",
    color: "from-yellow-400 to-yellow-600",
    duration: "Practice",
  },
];

export default function RoadmapContent() {
  const { lessons } = useProgressStore();
  const completedCount = Object.values(lessons).filter((l) => l.completed).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-blue-50/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge color="accent" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Interactive BLD Course
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Solve the Cube{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                Blindfolded
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Master the classic Old Pochmann method with interactive 3D demos,
              memory drills, and guided practice.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/letters">
                <Button size="lg">
                  Start Learning
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/memo">
                <Button variant="outline" size="lg">
                  Jump to Memory Gym
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Progress summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Your Progress</h2>
                <p className="text-muted-foreground">
                  {completedCount} of {roadmapSteps.length} lessons completed
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-primary">
                  {Math.round((completedCount / roadmapSteps.length) * 100)}%
                </span>
              </div>
            </div>
            <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / roadmapSteps.length) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>
          </Card>
        </motion.div>

        {/* Roadmap grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapSteps.map((step, index) => {
            const isCompleted = lessons[step.slug]?.completed;
            return (
              <motion.div
                key={step.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
              >
                <Link href={`/${step.slug}`}>
                  <Card hover className="h-full relative overflow-hidden group">
                    {isCompleted && (
                      <div className="absolute top-4 right-4">
                        <Badge color="success">Completed</Badge>
                      </div>
                    )}
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xl font-black mb-4 shadow-lg`}
                    >
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <Badge color="muted">{step.duration}</Badge>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Method note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
            <EyeOff className="w-4 h-4" />
            This course assumes you can already solve a 3x3 cube with your eyes open.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
