"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookMarked } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PageTitle from "@/components/layout/PageTitle";

interface Term {
  term: string;
  letters?: string;
  def: React.ReactNode;
  href?: string;
}

const groups: { title: string; terms: Term[] }[] = [
  {
    title: "Core concepts",
    terms: [
      {
        term: "Old Pochmann (OP)",
        def: "A beginner-friendly blindfolded method that solves the cube one piece at a time by repeatedly swapping a fixed buffer piece with a target, using setup moves and a single swap algorithm.",
      },
      {
        term: "Speffz",
        def: "The lettering system this trainer uses: each of the 24 edge stickers and 24 corner stickers gets a letter A–X, so any piece can be named by a single sticker.",
        href: "/letters",
      },
      {
        term: "Sticker",
        def: "One colored facelet of a piece. An edge has 2 stickers; a corner has 3. Tracing reads the cube one sticker at a time.",
      },
      {
        term: "Buffer",
        letters: "edges UF (C, I) · corners UBL (A, R, U)",
        def: "The fixed piece you always swap from. Its own sticker letters never appear as targets — reading a buffer letter means the current cycle has closed.",
      },
      {
        term: "Target",
        letters: "edges UR (B, F) · corners UFR (C, F, I)",
        def: "The fixed slot you swap into. Setup moves bring an arbitrary piece to the target, the swap fires, then the setup is undone.",
      },
    ],
  },
  {
    title: "Procedure",
    terms: [
      {
        term: "Tracing",
        def: "Turning the scrambled cube into a sequence of letters: read the sticker at the buffer, jump to that letter's position, read again, and repeat until the cycle closes.",
        href: "/tracing",
      },
      {
        term: "Setup move",
        def: "A short sequence that moves a target piece into the target slot without disturbing the buffer. You always undo it after the swap. Authoritative table lives in the Setup Trainer.",
        href: "/trainer",
      },
      {
        term: "Shooting",
        def: "Slang for solving one target: set it up, fire the swap algorithm, undo the setup. “Shoot to B” = solve the piece whose sticker is B.",
      },
      {
        term: "Cycle",
        def: "A chain of targets that starts and ends at the buffer. Following the buffer from sticker to sticker traces one cycle until you read a buffer letter.",
      },
      {
        term: "Cycle break",
        def: "When a cycle closes but pieces remain unsolved, you start a new cycle on any unsolved piece. Misoriented-in-place pieces are found this way.",
        href: "/tracing",
      },
      {
        term: "Memo",
        def: "Your memorized letter sequence for edges and corners — usually encoded as words or images so you can hold it blindfolded.",
        href: "/memo",
      },
    ],
  },
  {
    title: "Algorithms & special cases",
    terms: [
      {
        term: "T-perm (edge swap)",
        def: "The algorithm that swaps the edge buffer with the edge target (and two corners, harmless since corners come last). Also used once as the parity fix.",
        href: "/edges",
      },
      {
        term: "Y-perm (corner swap)",
        def: "The algorithm that swaps the corner buffer with the corner target. Corners are solved after edges.",
        href: "/corners",
      },
      {
        term: "Parity",
        def: "An odd number of edge targets leaves corners in an odd permutation. You fix it with one extra T-perm between edges and corners, then swap your first two corner targets.",
        href: "/parity",
      },
      {
        term: "Flipped edge",
        def: "An edge in its home slot but mis-oriented. It is not solved, so it never appears in the main cycle — you pick it up as a cycle break and shoot both of its stickers.",
        href: "/edges",
      },
      {
        term: "Twisted corner",
        def: "A corner in its home slot but rotated. Like a flipped edge, it is caught as its own cycle and worked through its stickers.",
        href: "/corners",
      },
    ],
  },
];

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageTitle title="Glossary" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <Badge color="accent" className="mb-4">
            <BookMarked className="w-3 h-3 mr-1" /> Quick Reference
          </Badge>
          <h1 className="text-4xl font-black mb-3">Glossary</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Every term used across the lessons, in one place. Tap a term&apos;s lesson link to see it
            in action.
          </p>
        </div>

        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.title}>
              <h2 className="text-2xl font-black mb-4">{group.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.terms.map((t) => (
                  <Card key={t.term} className="h-full">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="text-lg font-bold">{t.term}</h3>
                      {t.href && (
                        <Link
                          href={t.href}
                          className="shrink-0 text-sm font-bold text-primary underline underline-offset-2"
                        >
                          Lesson
                        </Link>
                      )}
                    </div>
                    {t.letters && (
                      <div className="font-mono text-sm text-secondary mb-2">{t.letters}</div>
                    )}
                    <p className="text-muted-foreground">{t.def}</p>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
