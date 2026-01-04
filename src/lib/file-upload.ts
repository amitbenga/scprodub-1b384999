import { supabase } from "@/integrations/supabase/client";

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

export async function uploadFile(
  file: File,
  folder: "images" | "audio"
): Promise<{ url: string | null; error: string | null }> {
  try {
    const normalizedMime = normalizeMimeType(file.type);
    const ext = getFileExtension(normalizedMime);
    const timestamp = Date.now();
    const uuid = crypto.randomUUID();
    const fileName = `${folder}/${uuid}-${timestamp}.${ext}`;

    // Create a new blob with normalized MIME type for mobile compatibility
    const normalizedBlob = new Blob([file], { type: normalizedMime });

    const { error: uploadError } = await supabase.storage
      .from("actor-submissions")
      .upload(fileName, normalizedBlob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { url: null, error: "שגיאה בהעלאת הקובץ" };
    }

    const { data: urlData } = supabase.storage
      .from("actor-submissions")
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    console.error("Upload exception:", err);
    return { url: null, error: "שגיאה בהעלאת הקובץ" };
  }
}