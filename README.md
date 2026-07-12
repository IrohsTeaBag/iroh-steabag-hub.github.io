# Tumiso K. Ngwako — Cybersecurity Portfolio

A Splunk-style dashboard portfolio built with React, Vite, and Tailwind.

## ⚠️ Read this first: about the "owner mode" uploads

Inside Claude, the photo/CV/certificate/video uploads were saved to a shared
backend that every visitor could see. This standalone version uses your
**browser's local storage** instead (see `src/storage.js`), which means:

- Anything you upload as owner will only appear **in your own browser**.
- Other people visiting your live site will **not** see what you've
  uploaded — they'll only see the seeded starter data (your bio, projects,
  skills, and the original certificate list from our conversation).
- Clearing your browser data will wipe what you've uploaded.

This is fine for testing locally, but if you want visitors to actually see
your real certificates/videos/CV once this is live, you need a real
database behind it. Two free, beginner-friendly options:

1. **Supabase** (supabase.com) — free Postgres database + simple JS client.
   Swap the functions in `src/storage.js` to call Supabase instead of
   `localStorage`.
2. **Firebase** (firebase.google.com) — free Firestore database, similar idea.

If you'd like, I can wire either of these up for you — just say the word
and let me know which one you'd prefer.

## Running it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Hosting it on GitHub Pages

1. **Create a new repo on GitHub** (e.g. `tumiso-portfolio`) — don't
   initialize it with a README, since you already have one here.

2. **Update the base path.** Open `vite.config.js` and set `base` to match
   your repo name exactly:
   ```js
   base: "/tumiso-portfolio/",
   ```
   (If you're deploying to a *user page* like `IrohsTeaBag.github.io`
   instead of a project page, set `base: "/"` instead.)

3. **Push this project to GitHub:**
   ```bash
   cd tumiso-portfolio
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/IrohsTeaBag/tumiso-portfolio.git
   git push -u origin main
   ```

4. **Install the deploy tool and deploy:**
   ```bash
   npm install
   npm run deploy
   ```
   This builds the site and pushes the `dist` folder to a `gh-pages` branch
   automatically (via the `gh-pages` package already in `package.json`).

5. **Turn on GitHub Pages:**
   - Go to your repo on GitHub → **Settings** → **Pages**
   - Under "Build and deployment", set **Source** to `Deploy from a branch`
   - Set **Branch** to `gh-pages` / `root`
   - Save — GitHub will give you a live URL, usually
     `https://IrohsTeaBag.github.io/tumiso-portfolio/`
   - It can take a minute or two to go live the first time.

6. **Whenever you make changes**, just run `npm run deploy` again to push
   the update.

## Before you make this public

- Change the owner passcode. Open `src/App.jsx`, find:
  ```js
  const OWNER_PASSCODE = "ngwako-owner";
  ```
  and change it to something only you know. Remember: since this is a
  static site, anyone who looks at the deployed JavaScript could
  technically find this value — it's a convenience gate, not real security.
- Re-check file sizes: uploads are capped around 4MB each to stay within
  `localStorage`'s limits (a few MB per browser).

## Project structure

```
tumiso-portfolio/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx      # entry point, installs the storage shim
    ├── App.jsx        # the whole site (all pages/components)
    ├── storage.js      # localStorage-backed storage shim
    └── index.css       # Tailwind entry
```
