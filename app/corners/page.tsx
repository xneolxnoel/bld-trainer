"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Box, RotateCw } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { CORNER_SWAP_ALG } from "@/lib/algs";
import { useProgressStore } from "@/stores/progressStore";
import PageTitle from "@/components/layout/PageTitle";

const CubePlayer = dynamic(() => import("@/components/cube/CubePlayer"), { ssr: false });

export default function CornersPage() {
  const visitLesson = useProgressStore((s) => s.visitLesson);

  useEffect(() => {
    visitLesson("corners");
  }, [visitLesson]);


  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageTitle title="Corner Solving" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <Badge color="warning" className="mb-4"><Box className="w-3 h-3 mr-1" /> Lesson 4</Badge>
          <h1 className="text-4xl font-black mb-4">Corner Solving</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Corners work just like edges, but the buffer is{" "}
            <strong>UBL</strong> and we use a Y-perm to swap UBL with UFR. Setup moves bring the
            target corner to UFR without disturbing UBL.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <h2 className="text-xl font-bold mb-4">The Corner Cycle</h2>
            <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
              <li>
                <strong className="text-foreground">Look at the UBL corner.</strong> Read its letter.
              </li>
              <li>
                <strong className="text-foreground">Find the target corner</strong> and set it up to UFR.
              </li>
              <li>
                <strong className="text-foreground">Execute the Y-perm</strong> to swap UBL and UFR.
              </li>
              <li>
                <strong className="text-foreground">Undo the setup.</strong>
              </li>
              <li>
                <strong className="text-foreground">Repeat</strong> until corners are solved.
              </li>
            </ol>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-background">
            <h2 className="text-xl font-bold mb-4">Corner Swap Algorithm (Y-Perm)</h2>
            <div className="text-xl font-mono font-bold text-primary mb-4 p-4 bg-card rounded-xl border-2 border-border text-center">
              {CORNER_SWAP_ALG}
            </div>
            <p className="text-muted-foreground mb-4">
              Swaps UBL and UFR corners. It also swaps two edges, but edges are already solved at this point —
              which is why we do corners last.
            </p>
            <div className="h-64">
              <CubePlayer alg={CORNER_SWAP_ALG} controlPanel="bottom-row" />
            </div>
          </Card>
        </div>

        <div className="mb-12">
          <Card>
            <h2 className="text-xl font-bold mb-4">Corner Setup Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { target: "UFR (C)", setup: "(none)", note: "Target position" },
                { target: "UBR (B)", setup: "R2", note: "Bring UBR to UFR" },
                { target: "UFL (D)", setup: "F2", note: "Bring UFL to UFR" },
              ].map((ex) => (
                <div key={ex.target} className="p-4 rounded-2xl bg-muted">
                  <div className="font-bold text-foreground">{ex.target}</div>
                  <div className="font-mono text-primary">{ex.setup}</div>
                  <div className="text-sm text-muted-foreground">{ex.note}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mb-12">
          <Card className="bg-gradient-to-br from-amber-50 to-background border-warning/30">
            <div className="flex items-center gap-2 mb-4">
              <RotateCw className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-bold">Special Case: Twisted Corners</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Just like a flipped edge, a corner that sits in its own slot but{" "}
              <strong>twisted</strong> is <em>not</em> solved. Tracing skips only fully solved
              corners, so a twisted-in-place corner never appears in your main cycle — you pick it
              up afterwards as a{" "}
              <Link href="/tracing" className="text-primary underline underline-offset-2">
                new cycle (cycle break)
              </Link>
              .
            </p>
            <ul className="space-y-3 text-muted-foreground list-disc list-inside mb-6">
              <li>
                Start a new cycle on the twisted corner and read through its stickers. Shooting them
                rotates the corner back into its solved orientation.
              </li>
              <li>
                Which sticker you start from changes how many shots it takes — the simulator on this
                site always starts at the alphabetically-first sticker, which is{" "}
                <em>one valid choice, not always the shortest</em>. (The{" "}
                <Link href="/solve" className="text-primary underline underline-offset-2">
                  full-solve simulator
                </Link>{" "}
                notes the same caveat.)
              </li>
              <li>
                Beginner trap: corners are the last step, so it&apos;s easy to forget that a corner
                can be home but mis-twisted. Always check orientation before removing the blindfold.
              </li>
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Scramble the cube and look at the <strong>UFL</strong> corner (its stickers are{" "}
                  <span className="font-mono text-primary">D</span> /{" "}
                  <span className="font-mono text-primary">L</span> /{" "}
                  <span className="font-mono text-primary">Q</span>). It is in its slot but twisted:
                </p>
                <div className="h-56 rounded-2xl overflow-hidden bg-card border-2 border-border">
                  <CubePlayer
                    alg="U' F' B2 R' U L2 U2 F L D L2 R'"
                    controlPanel="bottom-row"
                  />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-card border-2 border-border">
                <div className="text-sm text-muted-foreground mb-2">Resulting corner memo:</div>
                <div className="font-mono text-lg font-bold break-words">
                  <span className="text-muted-foreground">CBJP</span>
                  <span className="text-warning">DLQ</span>
                  <span className="text-muted-foreground">HTWKOM</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  The twisted UFL corner appears as its own run through the piece&apos;s stickers —
                  <span className="font-mono text-warning font-bold"> D</span>,
                  <span className="font-mono text-warning font-bold"> L</span>,
                  <span className="font-mono text-warning font-bold"> Q</span> — instead of being
                  skipped as &ldquo;already home.&rdquo;
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Link href="/parity">
            <Button size="lg">
              Next: Parity
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
