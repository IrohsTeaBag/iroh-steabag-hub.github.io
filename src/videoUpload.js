/**
 * Video-specific upload helper: real thumbnail generation (grabs a frame
 * from the video client-side) plus the same Supabase Storage backing used
 * for documents.
 */

import { fileStorageReady, uploadFile, deleteFile } from "./fileStorage";

// Supabase's free tier enforces a hard 50MB-per-file limit at the platform
// level (not something this app controls) — uploads above this will be
// rejected by Supabase itself regardless of what this constant says.
// If you upgrade to Supabase Pro, you can raise this (their limit becomes
// up to 500GB), and should also raise the number below to match.
export const MAX_VIDEO_BYTES = 48 * 1024 * 1024; // 48MB, just under Supabase's 50MB free-tier ceiling

export function videoUploadReady() {
  return fileStorageReady();
}

/** Grabs a frame partway through the video and returns it as a small JPEG data URL. */
export function generateVideoThumbnail(file) {
  return new Promise((resolve, reject) => {
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.muted = true;
    videoEl.playsInline = true;
    const objectUrl = URL.createObjectURL(file);
    videoEl.src = objectUrl;

    const cleanup = () => URL.revokeObjectURL(objectUrl);

    videoEl.addEventListener("loadeddata", () => {
      const target = Math.min(1, (videoEl.duration || 2) / 2);
      videoEl.currentTime = target;
    });
    videoEl.addEventListener("seeked", () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoEl.videoWidth || 320;
        canvas.height = videoEl.videoHeight || 180;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        cleanup();
        resolve(dataUrl);
      } catch (e) {
        cleanup();
        reject(e);
      }
    });
    videoEl.addEventListener("error", (e) => {
      cleanup();
      reject(e);
    });
  });
}

/** Uploads a video file to Supabase Storage and returns its public URL + storage path. */
export async function uploadVideoFile(file, folder) {
  const { url, path } = await uploadFile(file, folder);
  return { url, path };
}

export { deleteFile as deleteVideoFile };
