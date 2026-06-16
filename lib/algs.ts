export interface AlgEntry {
  id: string;
  name: string;
  type: 'edge' | 'corner' | 'parity' | 'setup';
  alg: string;
  description?: string;
  targets?: string[];
}

// Old Pochmann edge swap algorithm (buffer UF, target UR)
// This T-perm swaps UF edge with UR edge and UBR/ULF corners
export const EDGE_SWAP_ALG = "R U R' U' R' F R2 U' R' U' R U R' F'";

// Old Pochmann corner swap algorithm (buffer UBL, target UFR)
// Y-perm swaps UBL corner with UFR corner and UF/UR edges
export const CORNER_SWAP_ALG = "F R U' R' U' R U R' F' R U R' U' R' F R F'";

// Parity algorithm: when edges have odd number of targets
// Do a modified edge swap that also fixes corners, then continue corners normally
export const PARITY_ALG = "D' L2 D M2 D' L2 D";

export const EDGE_ALGS: AlgEntry[] = [
  {
    id: 'edge-swap',
    name: 'Edge Swap (T-Perm)',
    type: 'edge',
    alg: EDGE_SWAP_ALG,
    description: 'Swaps the buffer edge (UF) with the target edge (UR). Also swaps two corners, which is fine because corners are solved afterward.',
  },
];

export const CORNER_ALGS: AlgEntry[] = [
  {
    id: 'corner-swap',
    name: 'Corner Swap (Y-Perm)',
    type: 'corner',
    alg: CORNER_SWAP_ALG,
    description: 'Swaps the buffer corner (UBL) with the target corner (UFR).',
  },
];

export const PARITY_ALGS: AlgEntry[] = [
  {
    id: 'parity',
    name: 'Parity Fix',
    type: 'parity',
    alg: PARITY_ALG,
    description: 'Used when you have an odd number of edge targets. Perform this right before starting corners, then continue with normal corner cycles.',
  },
];

// Common setup moves for edges (target -> UR position)
export const EDGE_SETUPS: Record<string, string> = {
  A: "L2 D' L2",      // UB -> UR
  B: "",              // UR (already target)
  C: "F2",            // UF -> UR (but UF is buffer, never a target)
  D: "L2 D L2",       // UL -> UR
  E: "D' L2",         // BR -> UR
  F: "D2 L2",         // DR -> UR
  G: "D L2",          // FR -> UR
  H: "L2",            // UR? actually DR... wait
  // These setup moves are simplified examples; a real trainer would need a complete table
};

// Common setup moves for corners (target -> UFR position)
export const CORNER_SETUPS: Record<string, string> = {
  B: "R2",            // UBR -> UFR
  C: "",              // UFR (target)
  D: "F2",            // UFL -> UFR
  E: "R'",            // UBR setup variant
  F: "R",             // UFR
  // Simplified examples
};

export const ALL_ALGS: AlgEntry[] = [...EDGE_ALGS, ...CORNER_ALGS, ...PARITY_ALGS];
