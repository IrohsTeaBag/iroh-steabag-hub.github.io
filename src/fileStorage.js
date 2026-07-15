/**
 * Generic file upload/download helper backed by Supabase Storage.
 * Used for videos, reports, CVs, and certificate attachments — anything
 * bigger or more "real" than the small text values in the kv_store table.
 */

import { supabase, isSupabaseConfigured } from "./storage";

const BUCKET = "project-media";
export const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB — generous for PDFs/docs

export function fileStorageReady() {
  return isSupabaseConfigured && !!supabase;
}

/** Uploads a file to Supabase Storage. Returns { url, path, filename }. */
export async function uploadFile(file, folder) {
  if (!fileStorageReady()) throw new Error("Supabase Storage isn't configured yet.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, filename: file.name };
}

/** Best-effort delete of an uploaded file. */
export async function deleteFile(path) {
  if (!fileStorageReady() || !path) return;
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    /* non-fatal */
  }
}

/** Appends Supabase's built-in download query param so the browser saves
    the file with its original name instead of just opening/viewing it. */
export function downloadUrl(url, filename) {
  if (!url) return url;
  return `${url}?download=${encodeURIComponent(filename || "file")}`;
}

export function isPdfFile(filename) {
  return /\.pdf$/i.test(filename || "");
}
export function isImageFile(filename) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(filename || "");
}
