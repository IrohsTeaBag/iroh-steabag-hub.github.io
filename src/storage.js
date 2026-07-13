/**
 * Storage layer for owner-mode uploads (photo, CV, certificates, videos,
 * project code links).
 *
 * By default this falls back to localStorage, which only persists in YOUR
 * own browser — other visitors to your live site will NOT see anything you
 * upload. To make uploads actually visible to everyone, connect a free
 * Supabase project below. Full step-by-step setup is in the README.
 */

import { createClient } from "@supabase/supabase-js";

// ---- 1. Paste your Supabase project details here after setup ----
const SUPABASE_URL = "YOUR_SUPABASE_URL"; // e.g. "https://abcdefgh.supabase.co"
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
// -------------------------------------------------------------------

const isConfigured =
  SUPABASE_URL.startsWith("http") &&
  SUPABASE_ANON_KEY &&
  SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

let supabase = null;
if (isConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn("Supabase failed to initialize, falling back to local-only storage.", e);
  }
}

if (!supabase && typeof window !== "undefined" && !window.__storageWarned) {
  window.__storageWarned = true;
  console.warn(
    "[tumiso-portfolio] Shared storage isn't set up yet — uploads will only " +
      "be visible in this browser. See the README to connect Supabase so " +
      "visitors can see your certificates, CV, and videos."
  );
}

/* ---------------- Supabase-backed implementation (shared, real) ---------------- */
function fullKey(key, shared) {
  return `${shared ? "shared" : "local"}:${key}`;
}

async function supaGet(key, shared) {
  const { data, error } = await supabase
    .from("kv_store")
    .select("value")
    .eq("key", fullKey(key, shared))
    .maybeSingle();
  if (error || !data) return null;
  return { key, value: data.value, shared };
}

async function supaSet(key, value, shared) {
  const { error } = await supabase
    .from("kv_store")
    .upsert({ key: fullKey(key, shared), value, updated_at: new Date().toISOString() });
  if (error) throw error;
  return { key, value, shared };
}

async function supaDelete(key, shared) {
  await supabase.from("kv_store").delete().eq("key", fullKey(key, shared));
  return { key, deleted: true, shared };
}

async function supaList(prefix, shared) {
  const scope = fullKey(prefix, shared);
  const { data, error } = await supabase.from("kv_store").select("key").like("key", `${scope}%`);
  if (error) return { keys: [], prefix, shared };
  const stripLen = fullKey("", shared).length;
  return { keys: (data || []).map((r) => r.key.slice(stripLen)), prefix, shared };
}

/* ---------------- localStorage fallback (local-only, used until configured) ---------------- */
const PREFIX = "tumiso-portfolio:";
function lsFullKey(key, shared) {
  return `${PREFIX}${shared ? "shared" : "local"}:${key}`;
}
async function lsGet(key, shared) {
  const raw = window.localStorage.getItem(lsFullKey(key, shared));
  return raw === null ? null : { key, value: raw, shared };
}
async function lsSet(key, value, shared) {
  window.localStorage.setItem(lsFullKey(key, shared), value);
  return { key, value, shared };
}
async function lsDelete(key, shared) {
  window.localStorage.removeItem(lsFullKey(key, shared));
  return { key, deleted: true, shared };
}
async function lsList(prefix, shared) {
  const scope = `${PREFIX}${shared ? "shared" : "local"}:`;
  const keys = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(scope + prefix)) keys.push(k.slice(scope.length));
  }
  return { keys, prefix, shared };
}

/* ---------------- Public API (matches the original window.storage shape) ---------------- */
async function get(key, shared = false) {
  return supabase ? supaGet(key, shared) : lsGet(key, shared);
}
async function set(key, value, shared = false) {
  return supabase ? supaSet(key, value, shared) : lsSet(key, value, shared);
}
async function del(key, shared = false) {
  return supabase ? supaDelete(key, shared) : lsDelete(key, shared);
}
async function list(prefix = "", shared = false) {
  return supabase ? supaList(prefix, shared) : lsList(prefix, shared);
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = { get, set, delete: del, list };
}

export default { get, set, delete: del, list };
