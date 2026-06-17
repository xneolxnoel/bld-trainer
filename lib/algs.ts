export interface AlgEntry {
  id: string;
  name: string;
  type: 'edge' | 'corner' | 'parity';
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

// Parity algorithm: used when edges have an odd number of targets.
//
// OP parity leaves the corner permutation odd — a single 2-corner swap that
// 3-cycles (Y-perms) can never resolve on their own. The fix is one more T-perm:
// it swaps two edges (finishing the leftover edge swap) AND two corners
// (resolving the parity), and disturbs no centers. You then swap two of your
// corner targets to account for the corners the alg moved.
//
// NOTE: the previous value `D' L2 D M2 D' L2 D` was an M-slice *edge* alg — it
// moved zero corners and shifted the centers, so it could not fix OP parity
// (and was an inert no-op in this repo's outer-face-only simulator).
export const PARITY_ALG = EDGE_SWAP_ALG;

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
    description: 'Used when you have an odd number of edge targets. It is the same T-perm you use for edges: applied once between edges and corners, it swaps the leftover two edges and two corners (no centers move). Swap two of your corner targets to compensate.',
  },
];

export const ALL_ALGS: AlgEntry[] = [...EDGE_ALGS, ...CORNER_ALGS, ...PARITY_ALGS];

