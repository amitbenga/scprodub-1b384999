/**
 * R2 URL resolution for the client.
 *
 * Resolves R2 object keys to public URLs using the configured R2 public domain.
 * The R2 bucket should have a public custom domain (or R2.dev subdomain) configured.
 *
 * Env var: VITE_R2_PUBLIC_URL — the base URL for the R2 bucket's public access.
 * Example: https://media.sc-produb.com  or  https://pub-xxx.r2.dev
 */

import { isR2ObjectKey } from "./r2-keys";

/**
 * Resolve an R2 object key to a publicly accessible URL.
 *
 * - If the value is already a full URL (legacy Supabase or other), returns it as-is.
 * - If the value is a data: URL (legacy base64), returns it as-is.
 * - If the value is an R2 object key, prepends the R2 public base URL.
 * - Returns null for null/undefined/empty input.
 */
export function resolveMediaUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  // Already a full URL (legacy Supabase storage or other) — pass through
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  // Legacy base64 data URL — pass through
  if (value.startsWith("data:")) {
    return value;
  }

  // R2 object key — resolve to public URL
  if (isR2ObjectKey(value)) {
    const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL;
    if (!baseUrl) {
      console.warn(
        "[R2 URL] VITE_R2_PUBLIC_URL is not set. Cannot resolve R2 object key:",
        value
      );
      return null;
    }
    // Ensure no double slash between base and key
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}/${value}`;
  }

  // Unknown format — return as-is
  return value;
}
