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

## Build Static Site

```bash
npm run build
```

Output is in `./dist`.

## Deploy to GitHub Pages

A GitHub Actions workflow is included in `.github/workflows/deploy.yml`. It builds and deploys the site on every push to `main`.

### Setup

1. Create a public GitHub repo.
2. Push this code to the `main` branch.
3. Go to repo **Settings** → **Pages**.
4. Under **Source**, select **GitHub Actions**.
5. (Optional) Add a custom domain and check **Enforce HTTPS**.

### Custom Domain with GitHub Pages

1. In **Settings** → **Pages** → **Custom domain**, enter `bldtrainer.com`.
2. At your domain registrar, add GitHub's A records:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. Check **Enforce HTTPS** in GitHub Pages settings.
4. Wait a few minutes for the SSL certificate to be issued.

## Deploy to Tencent Cloud COS

1. Build: `npm run build`
2. Upload the contents of `./dist` to a COS bucket.
3. Enable static website hosting with index document `index.html`.
4. (Optional) Bind a custom domain via Tencent Cloud CDN and enable HTTPS.
