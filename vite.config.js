import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: change `base` to match your GitHub repo name, e.g.
// if your repo is github.com/IrohsTeaBag/tumiso-portfolio, use "/tumiso-portfolio/"
// If you're deploying to a *custom domain* or a user/org page (username.github.io), use "/"
export default defineConfig({
  plugins: [react()],
  base: "/tumiso-portfolio/",
});
