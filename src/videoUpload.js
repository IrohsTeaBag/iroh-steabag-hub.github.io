/**
 * Video-specific upload helper: real thumbnail generation (grabs a frame
 * from the video client-side) plus the same Supabase Storage backing used
 * for documents.
 */

import { fileStorageReady, uploadFile, deleteFile } from "./fileStorage";

export const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200MB — keep an eye on Supabase's free 1GB total storage

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
