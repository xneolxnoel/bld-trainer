// Setup-move data for the Old Pochmann trainer.
//
// All non-buffer/target entries below were derived computationally and
// verified against cubing.js's KPuzzle (the real cube engine, not the
// outer-face-only lib/cube-state.ts simulator — see CLAUDE.md): for each
// letter, `setup SWAP_ALG invert(setup)` was checked to produce an exact
// clean transposition of the buffer slot with that letter's home slot (zero
// net orientation change on every piece). Edge setups use only D/L/R/B moves
// (never U/F, which would move the UF buffer); corner setups use only D/R/F
// moves (never U/L/B, which would move the UBL buffer).
//
// IMPORTANT: despite that verification, every entry is still marked `draft`
// — that status tracks whether *you've* drilled it by hand, not whether the
// math checks out. Verify each one against the 3D player before relying on
// it, and override anything you'd rather do differently using the in-app
// editor. The trainer persists your edits.

import { EDGE_SWAP_ALG, CORNER_SWAP_ALG } from "./algs";

export type SetupStatus = "verified" | "draft" | "buffer" | "target" | "empty";

export interface SetupEntry {
  letter: string;
  /** Human-readable piece + sticker label, e.g. "UB (U sticker)". */
  piece: string;
  /** The default setup string. Empty for buffer/target letters. */
  setup: string;
  status: SetupStatus;
}

export const EDGE_BUFFER_LETTERS = ["C", "I"];
export const EDGE_TARGET_LETTERS = ["B", "F"];
export const CORNER_BUFFER_LETTERS = ["A", "R", "U"];
export const CORNER_TARGET_LETTERS = ["C", "F", "I"];

export const EDGE_SETUP_TABLE: SetupEntry[] = [
  { letter: "A", piece: "UB (U sticker)", setup: "B2 D' R2", status: "draft" },
  { letter: "B", piece: "UR (U sticker)", setup: "", status: "target" },
  { letter: "C", piece: "UF (U sticker)", setup: "", status: "buffer" },
  { letter: "D", piece: "UL (U sticker)", setup: "L' B2 R'", status: "draft" },
  { letter: "E", piece: "BR (R sticker)", setup: "R'", status: "draft" },
  { letter: "F", piece: "UR (R sticker)", setup: "", status: "target" },
  { letter: "G", piece: "FR (R sticker)", setup: "R", status: "draft" },
  { letter: "H", piece: "DR (R sticker)", setup: "R2", status: "draft" },
  { letter: "I", piece: "UF (F sticker)", setup: "", status: "buffer" },
  { letter: "J", piece: "FR (F sticker)", setup: "R", status: "draft" },
  { letter: "K", piece: "DF (F sticker)", setup: "D R2", status: "draft" },
  { letter: "L", piece: "FL (F sticker)", setup: "L D2 R2", status: "draft" },
  { letter: "M", piece: "DF (D sticker)", setup: "D R2", status: "draft" },
  { letter: "N", piece: "DR (D sticker)", setup: "R2", status: "draft" },
  { letter: "O", piece: "DB (D sticker)", setup: "D' R2", status: "draft" },
  { letter: "P", piece: "DL (D sticker)", setup: "D2 R2", status: "draft" },
  { letter: "Q", piece: "BL (L sticker)", setup: "B2 R'", status: "draft" },
  { letter: "R", piece: "UL (L sticker)", setup: "L' B2 R'", status: "draft" },
  { letter: "S", piece: "FL (L sticker)", setup: "L D2 R2", status: "draft" },
  { letter: "T", piece: "DL (L sticker)", setup: "D2 R2", status: "draft" },
  { letter: "U", piece: "UB (B sticker)", setup: "B2 D' R2", status: "draft" },
  { letter: "V", piece: "BR (B sticker)", setup: "R'", status: "draft" },
  { letter: "W", piece: "DB (B sticker)", setup: "D' R2", status: "draft" },
  { letter: "X", piece: "BL (B sticker)", setup: "B2 R'", status: "draft" },
];

export const CORNER_SETUP_TABLE: SetupEntry[] = [
  { letter: "A", piece: "UBL (U sticker)", setup: "", status: "buffer" },
  { letter: "B", piece: "UBR (U sticker)", setup: "R D' F'", status: "draft" },
  { letter: "C", piece: "UFR (U sticker)", setup: "", status: "target" },
  { letter: "D", piece: "UFL (U sticker)", setup: "F R' F'", status: "draft" },
  { letter: "E", piece: "UBR (R sticker)", setup: "R D' F'", status: "draft" },
  { letter: "F", piece: "UFR (R sticker)", setup: "", status: "target" },
  { letter: "G", piece: "DFR (R sticker)", setup: "D R2", status: "draft" },
  { letter: "H", piece: "DBR (R sticker)", setup: "R2", status: "draft" },
  { letter: "I", piece: "UFR (F sticker)", setup: "", status: "target" },
  { letter: "J", piece: "DFR (F sticker)", setup: "D R2", status: "draft" },
  { letter: "K", piece: "DFL (F sticker)", setup: "F2", status: "draft" },
  { letter: "L", piece: "UFL (F sticker)", setup: "F R' F'", status: "draft" },
  { letter: "M", piece: "DFL (D sticker)", setup: "F2", status: "draft" },
  { letter: "N", piece: "DFR (D sticker)", setup: "D R2", status: "draft" },
  { letter: "O", piece: "DBR (D sticker)", setup: "R2", status: "draft" },
  { letter: "P", piece: "DBL (D sticker)", setup: "D F2", status: "draft" },
  { letter: "Q", piece: "UFL (L sticker)", setup: "F R' F'", status: "draft" },
  { letter: "R", piece: "UBL (L sticker)", setup: "", status: "buffer" },
  { letter: "S", piece: "DBL (L sticker)", setup: "D F2", status: "draft" },
  { letter: "T", piece: "DFL (L sticker)", setup: "F2", status: "draft" },
  { letter: "U", piece: "UBL (B sticker)", setup: "", status: "buffer" },
  { letter: "V", piece: "DBL (B sticker)", setup: "D F2", status: "draft" },
  { letter: "W", piece: "DBR (B sticker)", setup: "R2", status: "draft" },
  { letter: "X", piece: "UBR (B sticker)", setup: "R D' F'", status: "draft" },
];

export const SWAP_ALG: Record<"edge" | "corner", string> = {
  edge: EDGE_SWAP_ALG,
  corner: CORNER_SWAP_ALG,
};

export function getSetupTable(type: "edge" | "corner"): SetupEntry[] {
  return type === "edge" ? EDGE_SETUP_TABLE : CORNER_SETUP_TABLE;
}
