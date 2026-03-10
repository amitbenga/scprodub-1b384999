/**
 * R2 URL resolution for the client — PRIVATE BUCKET model.
 *
 * The R2 bucket is private. Objects are never publicly accessible.
 * All file reads go through the server-side /api/signed-url endpoint,
 * which generates a time-limited pre-signed URL (default: 15 minutes).
 *
 * This module:
 * - Does NOT use VITE_R2_PUBLIC_URL or any public bucket URL
 * - Does NOT construct direct R2 object URLs client-side
 * - Does NOT expose R2 credentials to the browser
 *
 * Usage:
 *   const url = await resolveMediaUrl(objectKey);
 *   // url is a signed R2 URL valid for 15 minutes, or null if key is empty
 */

import { isR2ObjectKey } from "./r2-keys";

export type SignedUrlResult = {
  signedUrl: string;
  expiresAt: string; // ISO timestamp
};

/**
 * Fetch a signed URL for an R2 object key from the server-side endpoint.
 * Returns null if the key is empty/null.
 * Throws if the server returns an error.
 */
export async function resolveMediaUrl(
  value: string | null | undefined
): Promise<string | null> {
  if (!value) return null;

  // Legacy full URL (e.g. old Supabase Storage URLs) — pass through as-is.
  // These will stop appearing once all rows are migrated.
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  // Legacy base64 data URL — pass through as-is.
  if (value.startsWith("data:")) {
    return value;
  }

  // R2 object key — fetch a signed URL from the server
  if (isR2ObjectKey(value)) {
    const response = await fetch("/api/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectKey: value }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(`[R2 URL] Failed to get signed URL for ${value}: ${err.error}`);
    }

    const data: SignedUrlResult = await response.json();
    return data.signedUrl;
  }

  // Unknown format — return as-is
  return value;
}
