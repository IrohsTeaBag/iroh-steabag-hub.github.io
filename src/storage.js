/**
 * Lightweight localStorage-backed replacement for the `window.storage` API
 * that this site's owner-mode features (photo, CV, certificates, videos,
 * project code links) were originally built against inside Claude.
 *
 * IMPORTANT LIMITATION: unlike the original, this data lives only in the
 * browser of whoever is using it. That means:
 *   - Content you (the owner) upload will only show up when YOU view the
 *     site from that same browser/device — it will NOT be visible to other
 *     visitors, and it won't survive clearing browser data.
 *   - This is fine for previewing/testing your own portfolio, but it is
 *     NOT a real shared backend. If you want visitors to actually see the
 *     certificates/videos/CV you upload, you need a real database behind
 *     this (see the README in this project for two simple free options:
 *     Supabase or Firebase).
 */

const PREFIX = "tumiso-portfolio:";

function fullKey(key, shared) {
  return `${PREFIX}${shared ? "shared" : "local"}:${key}`;
}

async function get(key, shared = false) {
  const raw = window.localStorage.getItem(fullKey(key, shared));
  if (raw === null) return null;
  return { key, value: raw, shared };
}

async function set(key, value, shared = false) {
  window.localStorage.setItem(fullKey(key, shared), value);
  return { key, value, shared };
}

async function del(key, shared = false) {
  window.localStorage.removeItem(fullKey(key, shared));
  return { key, deleted: true, shared };
}

async function list(prefix = "", shared = false) {
  const scope = `${PREFIX}${shared ? "shared" : "local"}:`;
  const keys = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(scope + prefix)) keys.push(k.slice(scope.length));
  }
  return { keys, prefix, shared };
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = { get, set, delete: del, list };
}

export default { get, set, delete: del, list };
