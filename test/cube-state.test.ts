import { test } from "node:test";
import assert from "node:assert/strict";
import {
  solvedState,
  applyScramble,
  trace,
  EDGE_BUFFER_PIECE,
  CORNER_BUFFER_PIECE,
} from "../lib/cube-state";
import { PARITY_ALG } from "../lib/algs";

// Old Pochmann buffer sticker letters (CLAUDE.md domain model): edge buffer UF
// owns C/I, corner buffer UBL owns A/R/U. These must never appear as targets.
const EDGE_BUFFER_LETTERS = ["C", "I"];
const CORNER_BUFFER_LETTERS = ["A", "R", "U"];

// A handful of fixed scrambles — deterministic so the test is reproducible.
const SCRAMBLES = [
  "R U2 D' B' L2 F U' R' F2 B D2 L U2 R2 D2 F2 U2 L2 B2 D2",
  "F R U' B2 D L2 F' U R2 B D' L F2 U2 B2 R2 D' L' U F'",
  "U' L R2 F2 B2 U2 D R2 L2 D2 B' F U L' U' L B2 D F2 U'",
  "D2 R' F U L B' R2 U D' F2 L2 B U' R B2 L D F' U2 R'",
];

function invert(scramble: string): string {
  return scramble
    .trim()
    .split(/\s+/)
    .reverse()
    .map((m) => (m.endsWith("2") ? m : m.endsWith("'") ? m.slice(0, -1) : `${m}'`))
    .join(" ");
}

test("solved cube produces empty traces", () => {
  const s = solvedState();
  const edges = trace(s.edges, "edge");
  const corners = trace(s.corners, "corner");
  assert.deepEqual(edges.letters, []);
  assert.equal(edges.parity, false);
  assert.deepEqual(corners.letters, []);
  assert.equal(corners.parity, false);
});

test("scramble + its inverse returns to solved (empty traces)", () => {
  for (const scramble of SCRAMBLES) {
    const state = applyScramble(`${scramble} ${invert(scramble)}`);
    assert.deepEqual(state.edges, solvedState().edges, `edges for: ${scramble}`);
    assert.deepEqual(state.corners, solvedState().corners, `corners for: ${scramble}`);
    assert.deepEqual(trace(state.edges, "edge").letters, []);
    assert.deepEqual(trace(state.corners, "corner").letters, []);
  }
});

test("buffer letters never appear as targets", () => {
  for (const scramble of SCRAMBLES) {
    const state = applyScramble(scramble);
    const edgeLetters = trace(state.edges, "edge").letters;
    const cornerLetters = trace(state.corners, "corner").letters;
    for (const b of EDGE_BUFFER_LETTERS) {
      assert.ok(!edgeLetters.includes(b), `edge target ${b} leaked in: ${scramble}`);
    }
    for (const b of CORNER_BUFFER_LETTERS) {
      assert.ok(!cornerLetters.includes(b), `corner target ${b} leaked in: ${scramble}`);
    }
  }
});

test("edge parity flag matches odd target count; corner parity always false", () => {
  for (const scramble of SCRAMBLES) {
    const state = applyScramble(scramble);
    const edges = trace(state.edges, "edge");
    const corners = trace(state.corners, "corner");
    assert.equal(edges.parity, edges.letters.length % 2 === 1, `parity for: ${scramble}`);
    assert.equal(corners.parity, false);
  }
});

test("trace is deterministic and matches a known snapshot", () => {
  const scramble = SCRAMBLES[0];
  const a = applyScramble(scramble);
  const b = applyScramble(scramble);
  const edgesA = trace(a.edges, "edge");
  const edgesB = trace(b.edges, "edge");
  assert.deepEqual(edgesA, edgesB, "same scramble must trace identically");

  // Snapshot captured from the current simulator (alphabetically-first sticker
  // at cycle breaks). A change here means the permutation tables or cycle-break
  // logic moved — confirm intentionally before updating.
  assert.equal(edgesA.letters.join(""), "HGEFASDWMPQ");
  assert.equal(edgesA.parity, true);
  const corners = trace(a.corners, "corner");
  assert.equal(corners.letters.join(""), "GITSBEXDQL");
  assert.equal(corners.parity, false);
});

// The edges/corners lessons display these worked "special case" examples with
// the resulting memo hardcoded in the JSX. Guard them here so a change to the
// trace logic can't silently make the lesson text wrong.
test("special-case lesson examples still produce the documented memos", () => {
  // Edges lesson: BL edge (Q/X) flipped in place -> picked up last as `…QX`.
  const flippedEdge = applyScramble("D' F R F' U L' D L2 R L2 B' U");
  assert.equal(trace(flippedEdge.edges, "edge").letters.join(""), "LOMVAJNBDUGHFRQX");
  // Corners lesson: UFL corner (D/L/Q) twisted in place -> appears as `…DLQ…`.
  const twistedCorner = applyScramble("U' F' B2 R' U L2 U2 F L D L2 R'");
  assert.equal(trace(twistedCorner.corners, "corner").letters.join(""), "CBJPDLQHTWKOM");
});

// OP parity must fix a 2-corner swap, so the parity alg has to actually move
// corners. The previous `D' L2 D M2 D' L2 D` moved none (and was an inert no-op
// here because the simulator ignores M-slice moves). Guard against regressing.
test("parity alg actually permutes both edges and corners", () => {
  const after = applyScramble(PARITY_ALG);
  const solved = solvedState();
  const cornersMoved = Object.keys(after.corners).some((k) => after.corners[k] !== solved.corners[k]);
  const edgesMoved = Object.keys(after.edges).some((k) => after.edges[k] !== solved.edges[k]);
  assert.ok(cornersMoved, "parity alg must change corner state");
  assert.ok(edgesMoved, "parity alg must change edge state");
});

test("exported buffer piece names match the Old Pochmann method", () => {
  assert.equal(EDGE_BUFFER_PIECE, "UF");
  assert.equal(CORNER_BUFFER_PIECE, "UBL");
});
