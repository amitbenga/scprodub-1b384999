import { logger } from "@/lib/logger";
import type { R2MediaFolder } from "@/lib/r2-keys";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/ogg",
  "audio/aac",
  "audio/webm",
];

// Normalize MIME types for mobile compatibility
function normalizeMimeType(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    "audio/x-m4a": "audio/mp4",
    "audio/m4a": "audio/mp4",
    "audio/mp3": "audio/mpeg",
    "audio/x-wav": "audio/wav",
  };
  return mimeMap[mimeType] || mimeType;
}

function getFileExtension(mimeType: string): string {
  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/mp4": "m4a",
    "audio/ogg": "ogg",
    "audio/aac": "aac",
    "audio/webm": "webm",
  };
  return extMap[mimeType] || "bin";
}

export type FileValidationResult = {
  valid: boolean;
  error?: string;
};

export function validateImageFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "הקובץ גדול מדי (מקסימום 10MB)" };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "סוג קובץ לא נתמך (JPG, PNG, WebP, GIF)" };
  }
  return { valid: true };
}

export function validateAudioFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "הקובץ גדול מדי (מקסימום 10MB)" };
  }
  const normalizedType = normalizeMimeType(file.type);
  if (!ALLOWED_AUDIO_TYPES.includes(file.type) && !ALLOWED_AUDIO_TYPES.includes(normalizedType)) {
    return { valid: false, error: "סוג קובץ לא נתמך (MP3, WAV, M4A, OGG, AAC)" };
  }
  return { valid: true };
}

/**
 * Upload a file to R2 using a direct presigned URL.
 *
 * Returns the R2 object key on success (NOT a full URL).
 * The key follows the convention: actor-submissions/{submissionId}/{folder}/{filename}
 */
export async function uploadFileToR2(
  file: File,
  folder: R2MediaFolder,
  submissionId: string
): Promise<{ objectKey: string | null; error: string | null }> {
  try {
    const normalizedMime = normalizeMimeType(file.type);
    const ext = getFileExtension(normalizedMime);
    const timestamp = Date.now();
    const uuid = crypto.randomUUID();
    const uploadFilename = `${uuid}-${timestamp}.${ext}`;

    // Create a blob with normalized MIME type for mobile compatibility
    const normalizedBlob = new Blob([file], { type: normalizedMime });

    logger.log(`[R2 Upload Setup] Requesting presigned URL for ${uploadFilename}`);

    // Step 1: Get presigned URL from Vercel API
    const urlResponse = await fetch(`/api/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        folder,
        submissionId,
        filename: uploadFilename,
        contentType: normalizedMime,
      }),
    });

    if (!urlResponse.ok) {
      let serverError: string;
      try {
        const errorData = await urlResponse.json();
        serverError = errorData.error || `Server responded with ${urlResponse.status}`;
      } catch {
        const bodySnippet = await urlResponse.text().catch(() => "");
        logger.error("[R2 Upload Setup] Non-JSON response body:", bodySnippet.slice(0, 200));
        serverError = `Presigned URL API returned ${urlResponse.status}`;
      }
      logger.error("[R2 Upload Setup] Server error:", serverError);
      return { objectKey: null, error: serverError };
    }

    const { uploadUrl, objectKey } = await urlResponse.json();
    logger.log(`[R2 Upload] Got presigned URL. Uploading direct to R2...`);

    // Step 2: Upload directly to R2 using the presigned URL
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": normalizedMime,
      },
      body: normalizedBlob,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text().catch(() => "");
      logger.error(`[R2 Direct Upload] Failed with status ${uploadResponse.status}:`, errorText.slice(0, 200));
      return { objectKey: null, error: `העלאה נכשלה (R2 status ${uploadResponse.status})` };
    }

    logger.log(`[R2 Upload] Success. Object key: ${objectKey}`);
    return { objectKey, error: null };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    logger.error("[R2 Upload] Exception:", detail);
    return { objectKey: null, error: `שגיאה בהעלאת הקובץ: ${detail}` };
  }
}

/**
 * Delete an R2 object by key. Used for cleanup when DB insert fails
 * after files were already uploaded (prevents orphaned objects).
 *
 * Best-effort: errors are logged but not thrown.
 */
export async function deleteR2Object(objectKey: string): Promise<void> {
  try {
    logger.log(`[R2 Cleanup] Deleting orphaned object: ${objectKey}`);
    const response = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectKey }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      logger.error("[R2 Cleanup] Delete failed:", data);
    } else {
      logger.log(`[R2 Cleanup] Deleted: ${objectKey}`);
    }
  } catch (err) {
    logger.error("[R2 Cleanup] Exception during delete:", err);
  }
}
