export interface StickerLetter {
  letter: string;
  face: 'U' | 'R' | 'F' | 'D' | 'L' | 'B';
  position: number; // 0-7 for edges, 0-7 for corners (on each face)
  type: 'edge' | 'corner';
}

// Speffz letter scheme
// Edges: A-H on U, I-P on R, Q-X on F, a-h on D, i-p on L, q-x on B
// Corners: A-H on U, I-P on R, Q-X on F, a-h on D, i-p on L, q-x on B
// Using uppercase for U/R/F/D/L/B faces; standard Speffz uses lowercase for D/L/B
// We represent edge and corner letters separately.

export const EDGE_LETTERS: Record<string, StickerLetter> = {
  // U face edges (clockwise from top-left of face net)
  A: { letter: 'A', face: 'U', position: 1, type: 'edge' }, // UB
  B: { letter: 'B', face: 'U', position: 5, type: 'edge' }, // UR
  C: { letter: 'C', face: 'U', position: 7, type: 'edge' }, // UF
  D: { letter: 'D', face: 'U', position: 3, type: 'edge' }, // UL

  // R face edges
  E: { letter: 'E', face: 'R', position: 1, type: 'edge' }, // UB? actually BR
  F: { letter: 'F', face: 'R', position: 5, type: 'edge' }, // UR
  G: { letter: 'G', face: 'R', position: 7, type: 'edge' }, // FR
  H: { letter: 'H', face: 'R', position: 3, type: 'edge' }, // DR

  // F face edges
  I: { letter: 'I', face: 'F', position: 1, type: 'edge' }, // UF
  J: { letter: 'J', face: 'F', position: 5, type: 'edge' }, // FR
  K: { letter: 'K', face: 'F', position: 7, type: 'edge' }, // DF
  L: { letter: 'L', face: 'F', position: 3, type: 'edge' }, // FL

  // D face edges
  M: { letter: 'M', face: 'D', position: 1, type: 'edge' }, // DF
  N: { letter: 'N', face: 'D', position: 5, type: 'edge' }, // DR
  O: { letter: 'O', face: 'D', position: 7, type: 'edge' }, // DB
  P: { letter: 'P', face: 'D', position: 3, type: 'edge' }, // DL

  // L face edges
  Q: { letter: 'Q', face: 'L', position: 1, type: 'edge' }, // UB? BL
  R: { letter: 'R', face: 'L', position: 5, type: 'edge' }, // UL
  S: { letter: 'S', face: 'L', position: 7, type: 'edge' }, // FL
  T: { letter: 'T', face: 'L', position: 3, type: 'edge' }, // DL

  // B face edges
  U: { letter: 'U', face: 'B', position: 1, type: 'edge' }, // UB
  V: { letter: 'V', face: 'B', position: 5, type: 'edge' }, // BR
  W: { letter: 'W', face: 'B', position: 7, type: 'edge' }, // DB
  X: { letter: 'X', face: 'B', position: 3, type: 'edge' }, // BL
};

export const CORNER_LETTERS: Record<string, StickerLetter> = {
  // U face corners
  A: { letter: 'A', face: 'U', position: 0, type: 'corner' }, // UBL
  B: { letter: 'B', face: 'U', position: 2, type: 'corner' }, // UBR
  C: { letter: 'C', face: 'U', position: 8, type: 'corner' }, // UFR
  D: { letter: 'D', face: 'U', position: 6, type: 'corner' }, // UFL

  // R face corners
  E: { letter: 'E', face: 'R', position: 0, type: 'corner' }, // UBR
  F: { letter: 'F', face: 'R', position: 2, type: 'corner' }, // UFR
  G: { letter: 'G', face: 'R', position: 8, type: 'corner' }, // DFR
  H: { letter: 'H', face: 'R', position: 6, type: 'corner' }, // DBR

  // F face corners
  I: { letter: 'I', face: 'F', position: 0, type: 'corner' }, // UFR
  J: { letter: 'J', face: 'F', position: 2, type: 'corner' }, // DFR
  K: { letter: 'K', face: 'F', position: 8, type: 'corner' }, // DFL
  L: { letter: 'L', face: 'F', position: 6, type: 'corner' }, // UFL

  // D face corners
  M: { letter: 'M', face: 'D', position: 0, type: 'corner' }, // DFL
  N: { letter: 'N', face: 'D', position: 2, type: 'corner' }, // DFR
  O: { letter: 'O', face: 'D', position: 8, type: 'corner' }, // DBR
  P: { letter: 'P', face: 'D', position: 6, type: 'corner' }, // DBL

  // L face corners
  Q: { letter: 'Q', face: 'L', position: 0, type: 'corner' }, // UFL
  R: { letter: 'R', face: 'L', position: 2, type: 'corner' }, // UBL
  S: { letter: 'S', face: 'L', position: 8, type: 'corner' }, // DBL
  T: { letter: 'T', face: 'L', position: 6, type: 'corner' }, // DFL

  // B face corners
  U: { letter: 'U', face: 'B', position: 0, type: 'corner' }, // UBL
  V: { letter: 'V', face: 'B', position: 2, type: 'corner' }, // DBL
  W: { letter: 'W', face: 'B', position: 8, type: 'corner' }, // DBR
  X: { letter: 'X', face: 'B', position: 6, type: 'corner' }, // UBR
};

export const FACE_COLORS: Record<string, string> = {
  U: 'var(--cube-white)',
  D: 'var(--cube-yellow)',
  F: 'var(--cube-green)',
  B: 'var(--cube-blue)',
  R: 'var(--cube-red)',
  L: 'var(--cube-orange)',
};

export const FACE_NAMES: Record<string, string> = {
  U: 'Up',
  D: 'Down',
  F: 'Front',
  B: 'Back',
  R: 'Right',
  L: 'Left',
};

// Helper to get all edge/corner letters as arrays
export const getEdgeLetters = () => Object.values(EDGE_LETTERS);
export const getCornerLetters = () => Object.values(CORNER_LETTERS);

// Get sticker by letter and type
export function getSticker(letter: string, type: 'edge' | 'corner'): StickerLetter | undefined {
  const map = type === 'edge' ? EDGE_LETTERS : CORNER_LETTERS;
  return map[letter.toUpperCase()];
}
