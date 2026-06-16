import { Alg } from "cubing/alg";
import { cube3x3x3 } from "cubing/puzzles";
import { ExperimentalStickering } from "cubing/twisty";

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
  let lastMove = "";

  for (let i = 0; i < length; i++) {
    let move = moves[Math.floor(Math.random() * moves.length)];
    const lastFace = lastMove.charAt(0);
    const moveFace = move.charAt(0);
    // Avoid redundant moves on same face or opposite faces
    while (moveFace === lastFace) {
      move = moves[Math.floor(Math.random() * moves.length)];
    }
    scramble.push(move);
    lastMove = move;
  }

  return scramble.join(" ");
}

// Generate letter pairs from a list of letters
export function generateLetterPairs(count: number, type: 'edge' | 'corner'): string[] {
  const letters = type === 'edge'
    ? ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X']
    : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X'];
  
  const pairs: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = letters[Math.floor(Math.random() * letters.length)];
    const b = letters[Math.floor(Math.random() * letters.length)];
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
