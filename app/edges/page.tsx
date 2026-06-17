"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { EDGE_SWAP_ALG } from "@/lib/algs";

const CubePlayer = dynamic(() => import("@/components/cube/CubePlayer"), { ssr: false });

export default function EdgesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
