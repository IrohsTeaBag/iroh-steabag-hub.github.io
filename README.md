# Tumiso K. Ngwako — Cybersecurity Portfolio

A Splunk-style dashboard portfolio built with React, Vite, and Tailwind.

## Making uploads visible to everyone (Supabase setup)

Right now, `src/storage.js` falls back to your browser's local storage,
which means uploads you make in owner mode are only visible to you. To
make them visible to every visitor, connect a free Supabase project —
takes about 5 minutes.

### 1. Create a Supabase project
- Go to **supabase.com** → sign up (free) → **New Project**
- Pick any name/region, set a database password (you won't need it again
  for this), and wait ~1 minute for it to spin up

### 2. Create the storage table
In your new project, go to the **SQL Editor** (left sidebar) → New query →
paste this in and click **Run**:

```sql
create table if not exists kv_store (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table kv_store enable row level security;

create policy "Public read" on kv_store for select using (true);
create policy "Public write" on kv_store for insert with check (true);
create policy "Public update" on kv_store for update using (true);
create policy "Public delete" on kv_store for delete using (true);
```

**Honest note on security:** these policies make the table fully open to
anyone who calls the API directly (not just through your site's owner
passcode). For a personal portfolio the worst case is someone vandalizing
your data, which you can fix by re-uploading — but it is not real
access control. If you'd like proper protection (only you can write, based
on real login rather than a shared passcode), that's a bigger step using
Supabase Auth — ask and I can wire that up separately.

### 3. Get your API credentials
Go to **Settings → API** in your Supabase project. You need two values:
- **Project URL** (looks like `https://abcdefgh.supabase.co`)
- **anon public** key (a long string under "Project API keys")

### 4. Paste them into the project
Open `src/storage.js` and edit these two lines near the top:
```js
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```
Replace with your actual values from step 3.

### 5. Rebuild and redeploy
```bash
npm install
npm run deploy
```

That's it — from now on, anything uploaded through owner mode (photo, CV,
certificates, videos, project code links) will be visible to every visitor,
not just you. Until you complete this, the site still works fine for
browsing and for previewing your own uploads locally — it just won't share
them with anyone else yet.

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
