// Setup-move data for the Old Pochmann trainer.
//
// IMPORTANT: the default setups marked `draft` are starting points carried
// over from the original `algs.ts` placeholder table. They are NOT guaranteed
// to be correct — verify each one against your favorite BLD guide before
// drilling, and override anything wrong using the in-app editor. The trainer
// persists your edits.

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
  { letter: "A", piece: "UB (U sticker)", setup: "L2 D' L2", status: "draft" },
  { letter: "B", piece: "UR (U sticker)", setup: "", status: "target" },
  { letter: "C", piece: "UF (U sticker)", setup: "", status: "buffer" },
  { letter: "D", piece: "UL (U sticker)", setup: "L2 D L2", status: "draft" },
  { letter: "E", piece: "BR (R sticker)", setup: "D' L2", status: "draft" },
  { letter: "F", piece: "UR (R sticker)", setup: "", status: "target" },
  { letter: "G", piece: "FR (R sticker)", setup: "D L2", status: "draft" },
  { letter: "H", piece: "DR (R sticker)", setup: "D2 L2", status: "draft" },
  { letter: "I", piece: "UF (F sticker)", setup: "", status: "buffer" },
  { letter: "J", piece: "FR (F sticker)", setup: "", status: "empty" },
  { letter: "K", piece: "DF (F sticker)", setup: "", status: "empty" },
  { letter: "L", piece: "FL (F sticker)", setup: "", status: "empty" },
  { letter: "M", piece: "DF (D sticker)", setup: "", status: "empty" },
  { letter: "N", piece: "DR (D sticker)", setup: "", status: "empty" },
  { letter: "O", piece: "DB (D sticker)", setup: "", status: "empty" },
  { letter: "P", piece: "DL (D sticker)", setup: "", status: "empty" },
  { letter: "Q", piece: "BL (L sticker)", setup: "", status: "empty" },
  { letter: "R", piece: "UL (L sticker)", setup: "", status: "empty" },
  { letter: "S", piece: "FL (L sticker)", setup: "", status: "empty" },
  { letter: "T", piece: "DL (L sticker)", setup: "", status: "empty" },
  { letter: "U", piece: "UB (B sticker)", setup: "", status: "empty" },
  { letter: "V", piece: "BR (B sticker)", setup: "", status: "empty" },
  { letter: "W", piece: "DB (B sticker)", setup: "", status: "empty" },
  { letter: "X", piece: "BL (B sticker)", setup: "", status: "empty" },
];

export const CORNER_SETUP_TABLE: SetupEntry[] = [
  { letter: "A", piece: "UBL (U sticker)", setup: "", status: "buffer" },
  { letter: "B", piece: "UBR (U sticker)", setup: "R2", status: "draft" },
  { letter: "C", piece: "UFR (U sticker)", setup: "", status: "target" },
  { letter: "D", piece: "UFL (U sticker)", setup: "F2", status: "draft" },
  { letter: "E", piece: "UBR (R sticker)", setup: "R'", status: "draft" },
  { letter: "F", piece: "UFR (R sticker)", setup: "", status: "target" },
  { letter: "G", piece: "DFR (R sticker)", setup: "R", status: "draft" },
  { letter: "H", piece: "DBR (R sticker)", setup: "", status: "empty" },
  { letter: "I", piece: "UFR (F sticker)", setup: "", status: "target" },
  { letter: "J", piece: "DFR (F sticker)", setup: "", status: "empty" },
  { letter: "K", piece: "DFL (F sticker)", setup: "", status: "empty" },
  { letter: "L", piece: "UFL (F sticker)", setup: "", status: "empty" },
  { letter: "M", piece: "DFL (D sticker)", setup: "", status: "empty" },
  { letter: "N", piece: "DFR (D sticker)", setup: "", status: "empty" },
  { letter: "O", piece: "DBR (D sticker)", setup: "", status: "empty" },
  { letter: "P", piece: "DBL (D sticker)", setup: "", status: "empty" },
  { letter: "Q", piece: "UFL (L sticker)", setup: "", status: "empty" },
  { letter: "R", piece: "UBL (L sticker)", setup: "", status: "buffer" },
  { letter: "S", piece: "DBL (L sticker)", setup: "", status: "empty" },
  { letter: "T", piece: "DFL (L sticker)", setup: "", status: "empty" },
  { letter: "U", piece: "UBL (B sticker)", setup: "", status: "buffer" },
  { letter: "V", piece: "DBL (B sticker)", setup: "", status: "empty" },
  { letter: "W", piece: "DBR (B sticker)", setup: "", status: "empty" },
  { letter: "X", piece: "UBR (B sticker)", setup: "", status: "empty" },
];

export const SWAP_ALG: Record<"edge" | "corner", string> = {
  edge: EDGE_SWAP_ALG,
  corner: CORNER_SWAP_ALG,
};

export function getSetupTable(type: "edge" | "corner"): SetupEntry[] {
  return type === "edge" ? EDGE_SETUP_TABLE : CORNER_SETUP_TABLE;
}
