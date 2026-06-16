"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Library, Search, Play } from "lucide-react";
import dynamic from "next/dynamic";
import { ALL_ALGS, type AlgEntry } from "@/lib/algs";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const CubePlayer = dynamic(() => import("@/components/cube/CubePlayer"), { ssr: false });

const typeColors: Record<string, string> = {
  edge: "success",
  corner: "warning",
  parity: "secondary",
};

const typeLabels: Record<string, string> = {
  edge: "Edge",
  corner: "Corner",
  parity: "Parity",
};

export default function AlgsPage() {
  const [filter, setFilter] = useState<string>("");
  const [selectedAlg, setSelectedAlg] = useState<AlgEntry | null>(null);

  const filtered = ALL_ALGS.filter(
    (alg) =>
      alg.name.toLowerCase().includes(filter.toLowerCase()) ||
      alg.alg.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <Badge color="muted" className="mb-4"><Library className="w-3 h-3 mr-1" /> Reference</Badge>
          <h1 className="text-4xl font-black mb-4">Algorithm Library</h1>
          <p className="text-lg text-muted-foreground">
            Search, preview, and play back every algorithm used in the Old Pochmann method.
          </p>
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search algorithms..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-border bg-card text-lg font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {filtered.map((alg) => (
              <Card
                key={alg.id}
                hover
                onClick={() => setSelectedAlg(alg)}
                className={`cursor-pointer transition-all ${selectedAlg?.id === alg.id ? "border-primary ring-2 ring-primary/20" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold">{alg.name}</h3>
                      <Badge color={typeColors[alg.type] as any}>{typeLabels[alg.type]}</Badge>
                    </div>
                    <p className="font-mono text-primary font-bold">{alg.alg}</p>
                    {alg.description && (
                      <p className="text-sm text-muted-foreground mt-2">{alg.description}</p>
                    )}
                  </div>
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Play className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No algorithms found.</p>
            )}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="bg-gradient-to-br from-muted to-background">
              {selectedAlg ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-black">{selectedAlg.name}</h2>
                    <Badge color={typeColors[selectedAlg.type] as any}>{typeLabels[selectedAlg.type]}</Badge>
                  </div>
                  <div className="text-xl font-mono font-bold text-primary mb-4 p-4 bg-card rounded-xl border-2 border-border text-center">
                    {selectedAlg.alg}
                  </div>
                  <p className="text-muted-foreground mb-4">{selectedAlg.description}</p>
                  <div className="h-80">
                    <CubePlayer alg={selectedAlg.alg} controlPanel="bottom-row" />
                  </div>
                </>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center text-muted-foreground">
                  <Play className="w-12 h-12 mb-4 opacity-50" />
                  <p>Select an algorithm to preview it on the 3D cube.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
