// Lightweight 3x3 cube simulator over Speffz sticker positions.
//
// We track each of the 24 edge stickers and 24 corner stickers as a map
// `position letter -> letter currently sitting there`. Solved state is the
// identity map. Each face turn permutes positions according to the cycles
// below, which are written out in Speffz coordinates.
//
// This is enough to compute a Speffz trace from a scramble for the Old
// Pochmann method (UF buffer / UBL buffer).

import {
  EDGE_BUFFER_LETTERS,
  CORNER_BUFFER_LETTERS,
} from "./setups";

export type Side = "edge" | "corner";
export type StickerState = Record<string, string>;

interface FacePerm {
  edges: string[][];
  corners: string[][];
}

// Each entry is a 4-cycle written as σ(a)=b, σ(b)=c, σ(c)=d, σ(d)=a.
// Verified by hand against standard Speffz position labels in `lib/speffz.ts`.
const FACE_PERMS: Record<string, FacePerm> = {
  U: {
    edges: [
      ["C", "B", "A", "D"],
      ["I", "F", "U", "R"],
    ],
    corners: [
      ["C", "B", "A", "D"],
      ["F", "X", "R", "L"],
      ["I", "E", "U", "Q"],
    ],
  },
  D: {
    edges: [
      ["M", "P", "O", "N"],
      ["K", "T", "W", "H"],
    ],
    corners: [
      ["N", "M", "P", "O"],
      ["G", "K", "S", "W"],
      ["J", "T", "V", "H"],
    ],
  },
  R: {
    edges: [
      ["F", "E", "H", "G"],
      ["B", "V", "N", "J"],
    ],
    corners: [
      ["F", "E", "H", "G"],
      ["C", "X", "O", "J"],
      ["I", "B", "W", "N"],
    ],
  },
  L: {
    edges: [
      ["R", "S", "T", "Q"],
      ["D", "L", "P", "X"],
    ],
    corners: [
      ["R", "Q", "T", "S"],
      ["A", "L", "M", "V"],
      ["U", "D", "K", "P"],
    ],
  },
  F: {
    edges: [
      ["I", "J", "K", "L"],
      ["C", "G", "M", "S"],
    ],
    corners: [
      ["I", "J", "K", "L"],
      ["C", "G", "M", "Q"],
      ["F", "N", "T", "D"],
    ],
  },
  B: {
    edges: [
      ["U", "X", "W", "V"],
      ["A", "Q", "O", "E"],
    ],
    corners: [
      ["X", "U", "V", "W"],
      ["B", "R", "P", "H"],
      ["E", "A", "S", "O"],
    ],
  },
};

const ALL_LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X"];

export function solvedState(): { edges: StickerState; corners: StickerState } {
  const make = () => Object.fromEntries(ALL_LETTERS.map((l) => [l, l]));
  return { edges: make(), corners: make() };
}

function applyCycle(state: StickerState, cycle: string[]): void {
  const n = cycle.length;
  const last = state[cycle[n - 1]];
  for (let i = n - 1; i > 0; i--) {
    state[cycle[i]] = state[cycle[i - 1]];
  }
  state[cycle[0]] = last;
}

function applyFaceTurn(
  state: { edges: StickerState; corners: StickerState },
  face: string,
  amount: 1 | 2 | 3
): void {
  const perm = FACE_PERMS[face];
  if (!perm) return;
  for (let k = 0; k < amount; k++) {
    for (const cycle of perm.edges) applyCycle(state.edges, cycle);
    for (const cycle of perm.corners) applyCycle(state.corners, cycle);
  }
}

export function applyScramble(scramble: string): { edges: StickerState; corners: StickerState } {
  const state = solvedState();
  const moves = scramble.trim().split(/\s+/).filter(Boolean);
  for (const move of moves) {
    const face = move[0];
    if (!FACE_PERMS[face]) continue;
    let amount: 1 | 2 | 3 = 1;
    if (move.endsWith("2")) amount = 2;
    else if (move.endsWith("'")) amount = 3;
    applyFaceTurn(state, face, amount);
  }
  return state;
}

// Speffz piece groupings: each edge has 2 stickers, each corner has 3.
export const EDGE_PIECES: Record<string, string[]> = {
  UB: ["A", "U"],
  UR: ["B", "F"],
  UF: ["C", "I"], // buffer
  UL: ["D", "R"],
  BR: ["E", "V"],
  FR: ["G", "J"],
  DR: ["H", "N"],
  DF: ["K", "M"],
  DB: ["O", "W"],
  DL: ["P", "T"],
  FL: ["L", "S"],
  BL: ["Q", "X"],
};

export const CORNER_PIECES: Record<string, string[]> = {
  UBL: ["A", "R", "U"], // buffer
  UBR: ["B", "E", "X"],
  UFR: ["C", "F", "I"],
  UFL: ["D", "L", "Q"],
  DFR: ["G", "J", "N"],
  DBR: ["H", "O", "W"],
  DFL: ["K", "M", "T"],
  DBL: ["P", "S", "V"],
};

export const EDGE_BUFFER_PIECE = "UF";
export const CORNER_BUFFER_PIECE = "UBL";

function findPieceByLetter(letter: string, side: Side): string | null {
  const pieces = side === "edge" ? EDGE_PIECES : CORNER_PIECES;
  for (const [name, stickers] of Object.entries(pieces)) {
    if (stickers.includes(letter)) return name;
  }
  return null;
}

export interface TraceResult {
  /** Letters in order, including cycle-break starters. */
  letters: string[];
  /** True if the trace has an odd number of edge targets (only meaningful for edges). */
  parity: boolean;
}

export function trace(state: StickerState, side: Side): TraceResult {
  const pieces = side === "edge" ? EDGE_PIECES : CORNER_PIECES;
  const bufferLetters = side === "edge" ? EDGE_BUFFER_LETTERS : CORNER_BUFFER_LETTERS;
  const bufferPieceName = side === "edge" ? EDGE_BUFFER_PIECE : CORNER_BUFFER_PIECE;

  const solvedPieces = new Set<string>();
  for (const [name, stickers] of Object.entries(pieces)) {
    if (stickers.every((s) => state[s] === s)) solvedPieces.add(name);
  }

  const visitedPieces = new Set<string>([bufferPieceName]);
  // A cycle closes when we land on a letter we've already "consumed" — the
  // buffer's stickers (always) or any letter previously emitted in the trace.
  const visitedLetters = new Set<string>(bufferLetters);
  const letters: string[] = [];

  let current = bufferLetters[0];

  // Safety bound: 24 stickers minus the buffer piece, plus cycle-break starters.
  const maxSteps = 30;
  for (let step = 0; step < maxSteps; step++) {
    const next = state[current];

    if (visitedLetters.has(next)) {
      // Cycle closes — look for an unvisited unsolved piece.
      let newStart: string | null = null;
      let newPiece: string | null = null;
      for (const [name, stickers] of Object.entries(pieces)) {
        if (visitedPieces.has(name) || solvedPieces.has(name)) continue;
        newStart = stickers[0];
        newPiece = name;
        break;
      }
      if (!newStart || !newPiece) break;
      visitedPieces.add(newPiece);
      visitedLetters.add(newStart);
      letters.push(newStart);
      current = newStart;
      continue;
    }

    letters.push(next);
    visitedLetters.add(next);
    const pieceName = findPieceByLetter(next, side);
    if (pieceName) visitedPieces.add(pieceName);
    current = next;
  }

  return { letters, parity: side === "edge" && letters.length % 2 === 1 };
}
