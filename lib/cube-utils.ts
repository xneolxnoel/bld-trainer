import { Alg } from "cubing/alg";

// Validate a SiGN algorithm string
export function isValidAlg(algStr: string): boolean {
  try {
    new Alg(algStr);
    return true;
  } catch {
    return false;
  }
}

// Generate a random scramble algorithm
export function generateScramble(length: number = 25): string {
  const moves = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2"];
  const scramble: string[] = [];
  let lastFace = "";

  for (let i = 0; i < length; i++) {
    // Re-roll while the picked move is on the same face as the previous one.
    let move = moves[Math.floor(Math.random() * moves.length)];
    while (move.charAt(0) === lastFace) {
      move = moves[Math.floor(Math.random() * moves.length)];
    }
    scramble.push(move);
    lastFace = move.charAt(0);
  }

  return scramble.join(" ");
}

const ALL_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X'];
// Old Pochmann buffers: UF for edges (letters C, I), UBL for corners (letters A, R, U).
// These stickers belong to the buffer piece, so they never appear as targets in a real solve.
const EDGE_BUFFER_LETTERS = new Set(['C', 'I']);
const CORNER_BUFFER_LETTERS = new Set(['A', 'R', 'U']);

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
