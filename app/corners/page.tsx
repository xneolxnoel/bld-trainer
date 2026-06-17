"use client";

import { motion } from "framer-motion";
import { ArrowRight, Box } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { CORNER_SWAP_ALG } from "@/lib/algs";

const CubePlayer = dynamic(() => import("@/components/cube/CubePlayer"), { ssr: false });

export default function CornersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
