"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Layers, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { EDGE_SWAP_ALG } from "@/lib/algs";
import { useProgressStore } from "@/stores/progressStore";
import PageTitle from "@/components/layout/PageTitle";

const CubePlayer = dynamic(() => import("@/components/cube/CubePlayer"), { ssr: false });

export default function EdgesPage() {
  const visitLesson = useProgressStore((s) => s.visitLesson);

  useEffect(() => {
    visitLesson("edges");
  }, [visitLesson]);


  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageTitle title="Edge Solving" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <Badge color="success" className="mb-4"><Layers className="w-3 h-3 mr-1" /> Lesson 3</Badge>
          <h1 className="text-4xl font-black mb-4">Edge Solving</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            In Old Pochmann, we solve edges one piece at a time using the{" "}
            <strong>UF edge as a buffer</strong>. We read the sticker at UF, find where it belongs,
            move that target piece to UR, perform a T-perm, and undo the setup.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <h2 className="text-xl font-bold mb-4">The Edge Cycle</h2>
            <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
              <li>
                <strong className="text-foreground">Look at the UF edge.</strong> Read its letter — this is your first target.
              </li>
              <li>
                <strong className="text-foreground">Find that target piece</strong> and use setup moves to bring it to the UR position.
              </li>
              <li>
                <strong className="text-foreground">Execute the T-perm</strong> to swap UF and UR.
              </li>
              <li>
                <strong className="text-foreground">Undo the setup</strong> to restore everything except the solved edge.
              </li>
              <li>
                <strong className="text-foreground">Repeat</strong> with the new piece in UF until all edges are solved.
              </li>
            </ol>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-background">
            <h2 className="text-xl font-bold mb-4">Edge Swap Algorithm (T-Perm)</h2>
            <div className="text-2xl font-mono font-bold text-primary mb-4 p-4 bg-card rounded-xl border-2 border-border text-center">
              {EDGE_SWAP_ALG}
            </div>
            <p className="text-muted-foreground mb-4">
              This swaps UF and UR edges. It also swaps two corners, but that is harmless because
              we solve corners afterward.
            </p>
            <div className="h-64">
              <CubePlayer alg={EDGE_SWAP_ALG} controlPanel="bottom-row" />
            </div>
          </Card>
        </div>

        <div className="mb-12">
          <Card>
            <h2 className="text-xl font-bold mb-4">Setup Move Examples</h2>
            <p className="text-muted-foreground mb-4">
              A setup move brings the target edge to UR. The setup must not disturb the UF buffer.
              After the T-perm, undo the setup.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { target: "UR (B)", setup: "(none)", note: "Already in place" },
                { target: "BR (E)", setup: "D' L2", note: "Bring BR to UR" },
                { target: "FR (G)", setup: "D L2", note: "Bring FR to UR" },
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
              <RefreshCw className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-bold">Special Case: Flipped Edges</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Tracing only skips edges that are <strong>fully solved</strong> — correct position{" "}
              <em>and</em> correct orientation. An edge sitting in its own slot but{" "}
              <strong>flipped</strong> is <em>not</em> solved, so it never shows up in your main
              cycle. You catch it the same way you catch any leftover piece: as a{" "}
              <Link href="/tracing" className="text-primary underline underline-offset-2">
                new cycle (cycle break)
              </Link>
              .
            </p>
            <ul className="space-y-3 text-muted-foreground list-disc list-inside mb-6">
              <li>
                Start a new cycle on the flipped edge, then read through it. You&apos;ll shoot{" "}
                <strong>both of its stickers</strong> — two targets — which flips it into place.
              </li>
              <li>
                So a single flipped-in-place edge still costs you{" "}
                <strong className="text-foreground">two letters</strong> of memo, even though nothing
                looks &ldquo;out of position.&rdquo;
              </li>
              <li>
                Beginner trap: scanning positions only and thinking &ldquo;everything&apos;s
                home, I&apos;m done.&rdquo; Always check orientation too.
              </li>
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Scramble the cube and look at the <strong>BL</strong> edge (its stickers are{" "}
                  <span className="font-mono text-primary">Q</span> /{" "}
                  <span className="font-mono text-primary">X</span>). It is in its slot but flipped:
                </p>
                <div className="h-56 rounded-2xl overflow-hidden bg-card border-2 border-border">
                  <CubePlayer
                    alg="D' F R F' U L' D L2 R L2 B' U"
                    controlPanel="bottom-row"
                  />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-card border-2 border-border">
                <div className="text-sm text-muted-foreground mb-2">Resulting edge memo:</div>
                <div className="font-mono text-lg font-bold break-words">
                  <span className="text-muted-foreground">LOMVAJNBDUGHFR</span>
                  <span className="text-warning">QX</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  The main cycle solves every displaced edge, then closes. The flipped BL edge is
                  picked up last as its own short cycle —{" "}
                  <span className="font-mono text-warning font-bold">Q</span> then{" "}
                  <span className="font-mono text-warning font-bold">X</span>, the piece&apos;s two
                  stickers.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Link href="/corners">
            <Button size="lg">
              Next: Corner Solving
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
