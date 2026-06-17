"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PARITY_ALG } from "@/lib/algs";
import { useProgressStore } from "@/stores/progressStore";
import PageTitle from "@/components/layout/PageTitle";

const CubePlayer = dynamic(() => import("@/components/cube/CubePlayer"), { ssr: false });

export default function ParityPage() {
  const visitLesson = useProgressStore((s) => s.visitLesson);

  useEffect(() => {
    visitLesson("parity");
  }, [visitLesson]);


  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageTitle title="Parity" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <Badge color="secondary" className="mb-4"><AlertTriangle className="w-3 h-3 mr-1" /> Lesson 5</Badge>
          <h1 className="text-4xl font-black mb-4">Parity</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Sometimes edges have an odd number of targets. That leaves your corners in an odd
            permutation — a single two-corner swap that 3-cycles can never fix on their own. You
            resolve it with one extra T-perm between edges and corners, then adjust your corner memo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-background">
            <h2 className="text-xl font-bold mb-4">When Does Parity Happen?</h2>
            <p className="text-muted-foreground mb-4">
              A 3x3 cube permutation must be even overall. If your edge cycle has an odd number of
              targets, your corner cycle will be &ldquo;off&rdquo; by one swap. You detect this during memo:
              count your edge targets.
            </p>
            <div className="p-4 rounded-2xl bg-card border-2 border-border mb-4">
              <p className="font-bold text-foreground">Rule:</p>
              <p className="text-muted-foreground">
                Odd number of edge targets → parity exists. Apply the parity alg between edges and corners.
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4">Parity Algorithm</h2>
            <div className="text-2xl font-mono font-bold text-primary mb-4 p-4 bg-muted rounded-xl border-2 border-border text-center">
              {PARITY_ALG}
            </div>
            <p className="text-muted-foreground mb-4">
              This is the <strong>same T-perm you use for edges</strong>. Run it once after your edge
              targets and before corners: it swaps the leftover two edges and two corners, and{" "}
              <strong>leaves the centers untouched</strong>. Because it moves two corners, you adjust
              your corner memo to match (see below).
            </p>
            <div className="h-64">
              <CubePlayer alg={PARITY_ALG} controlPanel="bottom-row" />
            </div>
          </Card>
        </div>

        <Card className="mb-12 bg-gradient-to-br from-purple-50 to-background">
          <h2 className="text-xl font-bold mb-4">Compensating Your Corner Memo</h2>
          <p className="text-muted-foreground mb-4">
            The parity T-perm swaps two corners as a side effect, so your traced corner sequence is
            now &ldquo;off&rdquo; by that swap. The standard fix is simple:
          </p>
          <div className="p-4 rounded-2xl bg-card border-2 border-border mb-4">
            <p className="font-bold text-foreground">Rule:</p>
            <p className="text-muted-foreground">
              When you have parity, <strong>swap your first two corner targets</strong> before
              solving corners. The parity alg&apos;s corner swap then cancels cleanly.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Exactly which two corners the alg disturbs depends on your buffer and setup conventions —
            the &ldquo;first two targets&rdquo; rule is the common shortcut, but verify it against
            your own scheme the first few times, the same way you sanity-check a trace on the{" "}
            <Link href="/solve" className="text-primary underline underline-offset-2">
              full-solve simulator
            </Link>
            .
          </p>
        </Card>

        <Card className="mb-12">
          <h2 className="text-xl font-bold mb-4">Full Solve Flow with Parity</h2>
          <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
            <li>Memorize edges and corners separately, counting your edge targets.</li>
            <li>
              <strong className="text-foreground">If the edge count is odd</strong>, you have parity
              — swap your first two corner targets in memo before you start.
            </li>
            <li>Solve all edge targets using T-perms.</li>
            <li>
              <strong className="text-foreground">If you have parity:</strong> apply the parity
              T-perm{" "}
              <code className="bg-muted px-2 py-1 rounded font-mono text-primary">{PARITY_ALG}</code>{" "}
              once, now — between edges and corners.
            </li>
            <li>Solve all corner targets using Y-perms.</li>
            <li>Remove blindfold and celebrate.</li>
          </ol>
        </Card>

        <div className="flex justify-end">
          <Link href="/memo">
            <Button size="lg">
              Next: Memory Gym
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
