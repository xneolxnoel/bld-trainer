import { Alg } from "cubing/alg";
import {
  EDGE_BUFFER_LETTERS as EDGE_BUFFER_ARRAY,
  CORNER_BUFFER_LETTERS as CORNER_BUFFER_ARRAY,
} from "./setups";

// Validate a SiGN algorithm string
export function isValidAlg(algStr: string): boolean {
  try {
    new Alg(algStr);
    return true;
  } catch {
    return false;
  }
}

// Generate a 3x3 scramble on the main thread.
//
// We deliberately avoid cubing's solver-backed `randomScrambleForEvent`: it
// produces real WCA random-state scrambles, but only via a Web Worker that
// can't be instantiated under our Next/Turbopack static export ("Module worker
// instantiation failed. There are no more fallbacks available."). A random-move
// scramble needs no worker, works in every environment, and is more than enough
// for BLD memo practice — the cube is fully scrambled either way.
export function generateScramble(): string {
  return randomMoveScramble();
}

const SCRAMBLE_FACES = ["U", "D", "L", "R", "F", "B"] as const;
const SCRAMBLE_MODIFIERS = ["", "'", "2"] as const;
// Opposite faces share an axis: U/D, L/R, F/B.
const FACE_AXIS: Record<string, number> = { U: 0, D: 0, L: 1, R: 1, F: 2, B: 2 };

// Main-thread random-move scramble. Avoids repeating the same face and avoids a
// third consecutive move on the same axis, so the sequence can't trivially
// collapse. Uses only outer turns (U D L R F B), which both `applyScramble`
// and the TwistyPlayer understand.
function randomMoveScramble(length = 25): string {
  const moves: string[] = [];
  let prevFace = "";
  let prevPrevFace = "";
  while (moves.length < length) {
    const face = SCRAMBLE_FACES[Math.floor(Math.random() * SCRAMBLE_FACES.length)];
    if (face === prevFace) continue;
    if (
      FACE_AXIS[face] === FACE_AXIS[prevFace] &&
      FACE_AXIS[face] === FACE_AXIS[prevPrevFace]
    ) {
      continue;
    }
    const modifier =
      SCRAMBLE_MODIFIERS[Math.floor(Math.random() * SCRAMBLE_MODIFIERS.length)];
    moves.push(`${face}${modifier}`);
    prevPrevFace = prevFace;
    prevFace = face;
  }
  return moves.join(" ");
}

const ALL_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X'];
// Old Pochmann buffers: UF for edges (letters C, I), UBL for corners (letters A, R, U).
// These stickers belong to the buffer piece, so they never appear as targets in a real solve.
const EDGE_BUFFER_LETTERS = new Set(EDGE_BUFFER_ARRAY);
const CORNER_BUFFER_LETTERS = new Set(CORNER_BUFFER_ARRAY);

// Generate random letter pairs for memo practice. Excludes the buffer's own
// sticker letters and never repeats a letter within a pair.
export function generateLetterPairs(count: number, type: 'edge' | 'corner'): string[] {
  const buffer = type === 'edge' ? EDGE_BUFFER_LETTERS : CORNER_BUFFER_LETTERS;
  const letters = ALL_LETTERS.filter((l) => !buffer.has(l));

  const pairs: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = letters[Math.floor(Math.random() * letters.length)];
    let b = letters[Math.floor(Math.random() * letters.length)];
    while (b === a) {
      b = letters[Math.floor(Math.random() * letters.length)];
    }
    pairs.push(`${a}${b}`);
  }
  return pairs;
}

// Format time in mm:ss.ms
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centis = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
}
