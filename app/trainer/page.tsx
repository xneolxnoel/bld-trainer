"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Play, AlertTriangle, Check, Trash2, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { Alg } from "cubing/alg";
import {
  EDGE_SETUP_TABLE,
  CORNER_SETUP_TABLE,
  SWAP_ALG,
  type SetupEntry,
  type SetupStatus,
} from "@/lib/setups";
import { useProgressStore } from "@/stores/progressStore";
import Card from "@/components/ui/Card";
import Badge, { type BadgeColor } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { isValidAlg } from "@/lib/cube-utils";

const CubePlayer = dynamic(() => import("@/components/cube/CubePlayer"), { ssr: false });

const statusColors: Record<SetupStatus, BadgeColor> = {
  verified: "success",
  draft: "warning",
  buffer: "secondary",
  target: "primary",
  empty: "muted",
};

const statusLabels: Record<SetupStatus, string> = {
  verified: "Verified",
  draft: "Draft — verify",
  buffer: "Buffer",
  target: "Shoot target",
  empty: "Not set",
};

function invertAlg(alg: string): string {
  try {
    return new Alg(alg).invert().toString();
  } catch {
    return "";
  }
}

export default function TrainerPage() {
  const [type, setType] = useState<"edge" | "corner">("edge");
  const [selectedLetter, setSelectedLetter] = useState<string>("A");
  // Pair the draft input with the (type, letter) key it belongs to. When the
  // selected target changes we reset the draft to the new default — without
  // an effect, per the React 19 derived-state pattern.
  const [draft, setDraft] = useState<{ key: string; value: string }>({
    key: "edge-A",
    value: "",
  });
  const [playKey, setPlayKey] = useState(0);

  const { setupOverrides, knownSetups, setSetupOverride, clearSetupOverride, toggleSetupKnown } =
    useProgressStore();

  const baseTable: SetupEntry[] = useMemo(
    () => (type === "edge" ? EDGE_SETUP_TABLE : CORNER_SETUP_TABLE),
    [type]
  );

  const effectiveTable = useMemo(
    () =>
      baseTable.map((entry) => {
        const key = `${type}-${entry.letter}`;
        const override = setupOverrides[key];
        if (override !== undefined) {
          return { ...entry, setup: override, status: "verified" as SetupStatus };
        }
        return entry;
      }),
    [baseTable, setupOverrides, type]
  );

  const selected = effectiveTable.find((e) => e.letter === selectedLetter) ?? effectiveTable[0];
  const selectedKey = `${type}-${selected.letter}`;
  const isKnown = !!knownSetups[selectedKey];
  const hasOverride = setupOverrides[selectedKey] !== undefined;

  // Sync draft to the newly selected entry. Allowed during render — React
  // restarts the render and the next call returns the updated value.
  if (draft.key !== selectedKey) {
    setDraft({ key: selectedKey, value: selected.setup });
  }
  const draftSetup = draft.key === selectedKey ? draft.value : selected.setup;
  const setDraftSetup = (value: string) => setDraft({ key: selectedKey, value });

  const isPlayable =
    !!selected.setup &&
    selected.status !== "buffer" &&
    isValidAlg(selected.setup);

  const fullAlg = useMemo(() => {
    if (selected.status === "buffer") return "";
    if (selected.status === "target") return SWAP_ALG[type];
    if (!isPlayable) return "";
    const inv = invertAlg(selected.setup);
    return [selected.setup, SWAP_ALG[type], inv].filter(Boolean).join(" ");
  }, [selected, type, isPlayable]);

  const knownCount = effectiveTable.filter((e) => knownSetups[`${type}-${e.letter}`]).length;
  const setCount = effectiveTable.filter((e) => e.setup || e.status === "target").length;

  const handleSave = () => {
    const trimmed = draftSetup.trim();
    if (!trimmed) {
      clearSetupOverride(type, selected.letter);
    } else if (isValidAlg(trimmed)) {
      setSetupOverride(type, selected.letter, trimmed);
    }
    setPlayKey((k) => k + 1);
  };

  const handleClear = () => {
    clearSetupOverride(type, selected.letter);
    setDraftSetup(baseTable.find((e) => e.letter === selected.letter)?.setup ?? "");
    setPlayKey((k) => k + 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <Badge color="primary" className="mb-4">
            <Dumbbell className="w-3 h-3 mr-1" /> Practice
          </Badge>
          <h1 className="text-4xl font-black mb-3">Setup Move Trainer</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Drill every target letter individually. Watch the setup, the swap, and the undo as one
            motion. Save your own setups when you learn them.
          </p>
        </div>

        {/* Verify-setups warning */}
        <Card className="mb-8 bg-warning/5 border-warning/30">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">Default setups marked &ldquo;draft&rdquo; are
              starting points only.</strong>{" "}
              Verify each one against your favorite BLD guide before drilling. Edit any setup below
              and it&apos;ll be saved to your browser.
            </div>
          </div>
        </Card>

        {/* Type toggle + stats */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant={type === "edge" ? "primary" : "outline"}
              onClick={() => setType("edge")}
            >
              Edges
            </Button>
            <Button
              variant={type === "corner" ? "primary" : "outline"}
              onClick={() => setType("corner")}
            >
              Corners
            </Button>
          </div>
          <div className="flex gap-3 text-sm">
            <Badge color="success">{knownCount} known</Badge>
            <Badge color="muted">{setCount} / 24 have setups</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Letter grid */}
          <Card className="lg:col-span-1">
            <h2 className="text-lg font-bold mb-4">Pick a target letter</h2>
            <div className="grid grid-cols-4 gap-2">
              {effectiveTable.map((entry) => {
                const key = `${type}-${entry.letter}`;
                const known = !!knownSetups[key];
                const isSelected = entry.letter === selected.letter;
                const isBufferOrTarget =
                  entry.status === "buffer" || entry.status === "target";
                return (
                  <button
                    key={entry.letter}
                    onClick={() => setSelectedLetter(entry.letter)}
                    className={`relative aspect-square rounded-xl border-2 font-black text-lg transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : entry.status === "buffer"
                        ? "border-secondary/30 bg-secondary/5 text-secondary"
                        : entry.status === "target"
                        ? "border-primary/30 bg-primary/5 text-primary"
                        : entry.setup
                        ? "border-border bg-card hover:border-primary"
                        : "border-dashed border-muted text-muted-foreground hover:border-primary"
                    }`}
                    title={`${entry.letter} — ${entry.piece}`}
                  >
                    {entry.letter}
                    {known && !isBufferOrTarget && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-success" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Dashed = no setup yet. Dot = you marked it known.
            </p>
          </Card>

          {/* Selected letter detail */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-black text-primary">{selected.letter}</h2>
                  <Badge color={statusColors[selected.status]}>
                    {statusLabels[selected.status]}
                  </Badge>
                  {hasOverride && <Badge color="success">Saved</Badge>}
                </div>
                <p className="text-muted-foreground">{selected.piece}</p>
              </div>
              {selected.status !== "buffer" && (
                <Button
                  variant={isKnown ? "primary" : "outline"}
                  size="sm"
                  onClick={() => toggleSetupKnown(type, selected.letter)}
                >
                  <Check className="w-4 h-4" />
                  {isKnown ? "Known" : "Mark known"}
                </Button>
              )}
            </div>

            {/* Setup editor */}
            {selected.status === "buffer" ? (
              <div className="p-4 rounded-2xl bg-card border-2 border-border mb-4">
                <p className="text-sm text-muted-foreground">
                  This is a buffer sticker. The buffer piece never gets shot — it&apos;s the
                  starting point of your trace. No setup move needed here.
                </p>
              </div>
            ) : selected.status === "target" ? (
              <div className="p-4 rounded-2xl bg-card border-2 border-border mb-4">
                <p className="text-sm text-muted-foreground">
                  This sticker sits at the shoot target slot. No setup move needed — execute the
                  swap algorithm directly.
                </p>
              </div>
            ) : (
              <div className="mb-4 space-y-3">
                <label className="block text-sm font-bold text-foreground">
                  Setup moves (SiGN notation)
                </label>
                <input
                  type="text"
                  value={draftSetup}
                  onChange={(e) => setDraftSetup(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  placeholder="e.g. R U' R'"
                  className="w-full px-4 py-3 font-mono text-lg rounded-xl border-2 border-border bg-card focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {draftSetup && !isValidAlg(draftSetup) && (
                  <p className="text-sm text-error">
                    That doesn&apos;t parse as SiGN notation. Use moves like R, U&apos;, F2, M, etc.
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleClear} disabled={!hasOverride}>
                    <Trash2 className="w-4 h-4" />
                    Revert to default
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDraftSetup(selected.setup)}
                    disabled={draftSetup === selected.setup}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Discard edit
                  </Button>
                </div>
              </div>
            )}

            {/* Full alg preview */}
            {fullAlg && (
              <div className="p-3 rounded-xl bg-card border-2 border-border mb-4 font-mono text-sm break-words">
                <span className="text-muted-foreground">Full alg: </span>
                <span className="text-primary font-bold">{fullAlg}</span>
              </div>
            )}

            {/* 3D player */}
            <div className="h-72 rounded-2xl overflow-hidden bg-card border-2 border-border">
              {fullAlg ? (
                <CubePlayer
                  key={`${selected.letter}-${type}-${playKey}`}
                  alg={fullAlg}
                  controlPanel="bottom-row"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm px-6 text-center">
                  {selected.status === "buffer"
                    ? "Buffer sticker — no demo."
                    : "Add a setup move above to see the full procedure."}
                </div>
              )}
            </div>
            {fullAlg && (
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="outline" onClick={() => setPlayKey((k) => k + 1)}>
                  <Play className="w-4 h-4" />
                  Replay
                </Button>
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
