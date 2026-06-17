# BLD Trainer

Interactive trainer for learning to solve a 3x3 Rubik's cube blindfolded using the Old Pochmann method.

## Tech Stack

- Next.js 16 + TypeScript + Tailwind CSS
- `cubing` library for 3D cube visualization
- Zustand + localStorage for progress
- Framer Motion for animations

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality Checks

```bash
npm run lint        # ESLint (flat config)
npx tsc --noEmit    # TypeScript type-check
```

There is no test suite.

## Build Static Site

```bash
npm run build
```

Output is in `./dist`.
