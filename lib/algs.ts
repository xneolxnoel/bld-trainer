export interface AlgEntry {
  id: string;
  name: string;
  type: 'edge' | 'corner' | 'parity';
  alg: string;
  description?: string;
  targets?: string[];
}

// Old Pochmann edge swap algorithm (buffer UF, target UR)
// Swaps UF edge with UR edge and UFR/UBR corners (harmless, solved after edges).
//
// NOTE: the previous value `R U R' U' R' F R2 U' R' U' R U R' F'` is a real
// T-perm, but physically swaps UR/UL edges and UFR/UBR corners — it never
// touches the UF buffer at all, so it could not be used for the documented
// buffer/target convention. Verified against cubing.js's KPuzzle (not the
// outer-face-only lib/cube-state.ts simulator, which doesn't match real cube
// geometry — see CLAUDE.md). This replacement is a J-perm-pattern alg,
// confirmed via the same KPuzzle check to cleanly swap exactly UF<->UR edges
// and UFR<->UBR corners with zero net orientation change on every piece.
export const EDGE_SWAP_ALG = "R U R' F' R U R' U' R' F R2 U' R' U'";

// Old Pochmann corner swap algorithm (buffer UBL, target UFR)
// Swaps UBL corner with UFR corner and UB/UL edges (harmless, edges already
// solved by the time corners run). NOTE: an earlier comment here said "UF/UR
// edges" — verified via cubing.js KPuzzle that the actual pair is UB/UL.
export const CORNER_SWAP_ALG = "F R U' R' U' R U R' F' R U R' U' R' F R F'";

// Parity algorithm: used when edges have an odd number of targets.
//
// OP parity leaves the corner permutation odd — a single 2-corner swap that
// 3-cycles (Y-perms) can never resolve on their own. The fix is one more
// edge-swap alg: it swaps two edges (finishing the leftover edge swap) AND
// two corners (resolving the parity), and disturbs no centers. You then swap
// two of your corner targets to account for the corners the alg moved.
//
// NOTE: the previous value `D' L2 D M2 D' L2 D` was an M-slice *edge* alg — it
// moved zero corners and shifted the centers, so it could not fix OP parity
// (and was an inert no-op in this repo's outer-face-only simulator).
export const PARITY_ALG = EDGE_SWAP_ALG;

export const EDGE_ALGS: AlgEntry[] = [
  {
    id: 'edge-swap',
    name: 'Edge Swap (J-Perm)',
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
    description: 'Used when you have an odd number of edge targets. It is the same algorithm you use for edges: applied once between edges and corners, it swaps the leftover two edges and two corners (no centers move). Swap two of your corner targets to compensate.',
  },
];

export const ALL_ALGS: AlgEntry[] = [...EDGE_ALGS, ...CORNER_ALGS, ...PARITY_ALGS];

